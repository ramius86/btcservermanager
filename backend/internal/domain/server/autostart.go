package server

import (
	"context"
	"errors"
	"log"
	"sync"
	"time"
)

const (
	autostartAttempts = 3
	autostartPoll     = 10 * time.Second
	autostartBackoff  = 30 * time.Second
	autostartStagger  = 2 * time.Second

	// Reforger downloads its mods while starting, so it needs a much larger
	// window before the attempt counts as failed.
	autostartServerTimeout   = 10 * time.Minute
	autostartReforgerTimeout = 60 * time.Minute
)

// ServerRestoreFailureListener is called once, after the last attempt, when a
// server could not be restored at startup.
type ServerRestoreFailureListener func(serverID int64, serverName string, serverType Type, attempts int, lastErr error)

// autostartConfig keeps the timings injectable so tests do not sleep.
type autostartConfig struct {
	attempts int
	poll     time.Duration
	backoff  time.Duration
	stagger  time.Duration
	timeout  func(Type) time.Duration
	sleep    func(context.Context, time.Duration) bool
}

func defaultAutostartConfig() autostartConfig {
	return autostartConfig{
		attempts: autostartAttempts,
		poll:     autostartPoll,
		backoff:  autostartBackoff,
		stagger:  autostartStagger,
		timeout:  autostartTimeout,
		sleep:    sleepContext,
	}
}

func autostartTimeout(t Type) time.Duration {
	if t == TypeReforger {
		return autostartReforgerTimeout
	}

	return autostartServerTimeout
}

// sleepContext waits for d, returning false when the context ended first.
func sleepContext(ctx context.Context, d time.Duration) bool {
	timer := time.NewTimer(d)
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return false
	case <-timer.C:
		return true
	}
}

// RestoreDesiredServers starts again the servers that were running before the
// manager stopped. It blocks until every attempt settled; main runs it in a
// goroutine. A server that keeps failing is left stopped and its intent is
// cleared, so the next restart does not try it again.
func (s *Service) RestoreDesiredServers(ctx context.Context) {
	ids, err := s.repo.GetDesiredRunningIDs(ctx)
	if err != nil {
		log.Printf("[Autostart] Failed to read the servers to restore: %v", err)
		return
	}

	if len(ids) == 0 {
		return
	}

	log.Printf("[Autostart] Restoring %d server(s)...", len(ids))

	cfg := defaultAutostartConfig()

	var (
		wg       sync.WaitGroup
		mu       sync.Mutex
		launched int
		restored int
	)

	for i, id := range ids {
		launched++
		wg.Add(1)

		go func(serverID int64) {
			defer wg.Done()

			if s.restoreServer(ctx, serverID, cfg) {
				mu.Lock()
				restored++
				mu.Unlock()
			}
		}(id)

		if i < len(ids)-1 && !cfg.sleep(ctx, cfg.stagger) {
			break
		}
	}

	wg.Wait()

	log.Printf("[Autostart] Finished: %d/%d server(s) started", restored, launched)
}

// restoreServer runs the attempts for one server and reports whether it came
// back. Every attempt starts the server and then waits for the game to answer
// its query: a live process alone is not enough.
func (s *Service) restoreServer(ctx context.Context, id int64, cfg autostartConfig) bool {
	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		log.Printf("[Autostart] Cannot load server %d: %v", id, err)
		return false
	}

	name, serverType := autostartServerInfo(srv)
	timeout := cfg.timeout(serverType)

	var lastErr error

	for attempt := 1; attempt <= cfg.attempts; attempt++ {
		if ctx.Err() != nil {
			return false
		}

		// A manual stop while we were waiting wins over the restore.
		wanted, err := s.repo.IsDesiredRunning(ctx, id)
		if err != nil {
			log.Printf("[Autostart] Cannot read the desired state of server %d: %v", id, err)
			return false
		}
		if !wanted {
			return false
		}

		if s.processManager.GetInstanceInfo(id) != nil {
			return true
		}

		if err := s.StartServer(ctx, id); err != nil {
			lastErr = err
		} else if s.waitUntilReady(ctx, id, timeout, cfg) {
			log.Printf("[Autostart] Server %d (%s) is up", id, name)
			return true
		} else if s.processManager.GetInstanceInfo(id) == nil {
			lastErr = errors.New("server exited during startup")
		} else {
			lastErr = errors.New("server did not answer its query before the timeout")

			// The process is alive but stuck: stop it so the next attempt can
			// claim its ports. Use the manager directly, so the desired state
			// stays set.
			if err := s.processManager.StopServer(ctx, id); err != nil {
				log.Printf("[Autostart] Failed to stop server %d before retrying: %v", id, err)
			}
		}

		if ctx.Err() != nil {
			return false
		}

		log.Printf("[Autostart] Server %d (%s) attempt %d/%d failed: %v", id, name, attempt, cfg.attempts, lastErr)

		if attempt < cfg.attempts && !cfg.sleep(ctx, cfg.backoff) {
			return false
		}
	}

	// The user may have stopped it while the attempts were running: in that
	// case there is nothing to report.
	wanted, err := s.repo.IsDesiredRunning(ctx, id)
	if err == nil && !wanted {
		return false
	}

	log.Printf("[Autostart] Giving up on server %d (%s) after %d attempts: %v", id, name, cfg.attempts, lastErr)

	if err := s.repo.SetDesiredRunning(ctx, id, false); err != nil {
		log.Printf("[Autostart] Failed to clear the desired state of server %d: %v", id, err)
	}

	s.notifyRestoreFailure(id, name, serverType, cfg.attempts, lastErr)

	return false
}

// waitUntilReady polls the instance until the game answers its query with a
// map. The scheduler refreshes the query data every 10 seconds.
func (s *Service) waitUntilReady(ctx context.Context, id int64, timeout time.Duration, cfg autostartConfig) bool {
	deadline := time.Now().Add(timeout)

	for {
		info := s.processManager.GetInstanceInfo(id)
		if info == nil {
			return false
		}

		if info.Map != "" {
			return true
		}

		if !time.Now().Before(deadline) {
			return false
		}

		if !cfg.sleep(ctx, cfg.poll) {
			return false
		}
	}
}

// autostartServerInfo returns the name and the type of a server.
func autostartServerInfo(srv any) (string, Type) {
	switch v := srv.(type) {
	case *Arma3Server:
		return v.Name, v.Type
	case *DayZServer:
		return v.Name, v.Type
	case *ReforgerServer:
		return v.Name, v.Type
	default:
		return "", ""
	}
}

func (s *Service) notifyRestoreFailure(id int64, name string, t Type, attempts int, lastErr error) {
	s.restoreFailureMu.RLock()
	listener := s.restoreFailureListener
	s.restoreFailureMu.RUnlock()

	if listener != nil {
		go listener(id, name, t, attempts, lastErr)
	}
}
