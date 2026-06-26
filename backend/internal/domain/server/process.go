package server

import (
	"btcservermanager/internal/fastdl"
	"bufio"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

type LogPayload struct {
	ServerID int64  `json:"server_id"`
	Message  string `json:"message"`
}

func (p LogPayload) GetServerID() int64 { return p.ServerID }

type ReforgerStatsPayload struct {
	ServerID int64            `json:"server_id"`
	Stats    *ReforgerStatDto `json:"stats"`
}

func (p ReforgerStatsPayload) GetServerID() int64 { return p.ServerID }

var bufferPool = sync.Pool{
	New: func() any {
		return new(bytes.Buffer)
	},
}

type Process struct {
	serverID            int64
	cmd                 *exec.Cmd
	info                *ServerInstanceInfo
	mu                  sync.RWMutex
	stopCh              chan struct{}
	port                int
	queryPort           int
	exited              bool
	stopping            bool
	fastDownloadEnabled bool
}

func (p *Process) IsAlive() bool {
	p.mu.RLock()
	defer p.mu.RUnlock()

	return !p.exited
}

type ProcessManager struct {
	processes       sync.Map // map[int64]*Process
	headlessClients sync.Map // map[int64][]*HeadlessClient
	hcMu            sync.Mutex
	paths           PathProvider
	launcher        *Launcher
	debugMode       bool
	broadcasterMu   sync.RWMutex
	broadcaster     Broadcaster

	fastdlServer      *fastdl.Server
	fastdlActiveCount int
	fastdlPort        int
	fastdlDomain      string
	fastdlMu          sync.Mutex
}

type Broadcaster interface {
	Broadcast(eventType string, payload any)
}

func NewProcessManager(paths PathProvider, launcher *Launcher, debugMode bool) *ProcessManager {
	return &ProcessManager{
		paths:     paths,
		launcher:  launcher,
		debugMode: debugMode,
	}
}

func (m *ProcessManager) SetFastDLConfig(port int, domain string) {
	m.fastdlMu.Lock()
	defer m.fastdlMu.Unlock()
	m.fastdlPort = port
	m.fastdlDomain = domain
}

func (m *ProcessManager) SetBroadcaster(b Broadcaster) {
	m.broadcasterMu.Lock()
	defer m.broadcasterMu.Unlock()
	m.broadcaster = b
}

func (m *ProcessManager) emitStatus(id int64, alive bool) {
	m.broadcasterMu.RLock()
	b := m.broadcaster
	m.broadcasterMu.RUnlock()

	if b != nil {
		payload := map[string]any{
			"server_id": id,
			"alive":     alive,
		}

		if alive {
			if info := m.GetInstanceInfo(id); info != nil {
				payload["info"] = info
			}
		}

		b.Broadcast("server_status", payload)
	}
}

func (m *ProcessManager) UpdateQueryInfo(id int64, players int, mapName, mission string) {
	if val, ok := m.processes.Load(id); ok {
		p, okProc := val.(*Process)
		if !okProc {
			return
		}
		p.mu.Lock()

		changed := p.info.Players != players || p.info.Map != mapName || p.info.Mission != mission

		if changed {
			p.info.Players = players
			p.info.Map = mapName
			p.info.Mission = mission
			p.mu.Unlock()
			m.emitStatus(id, true)
		} else {
			p.mu.Unlock()
		}
	}
}

func (m *ProcessManager) StartServer(ctx context.Context, s any) error {
	id, t, maxPlayers, port, queryPort, err := m.parseServerInstance(s)
	if err != nil {
		return err
	}

	if m.isServerAlreadyRunning(id) {
		return nil
	}

	// Validate Ports
	if err := m.checkPortConflict(id, port, queryPort); err != nil {
		return err
	}

	m.startFastDLIfNeeded(s)

	params, err := m.launcher.GetLaunchParameters(s)
	if err != nil {
		return err
	}

	logFilePath, err := m.prepareServerDirectories(t, id)
	if err != nil {
		return err
	}

	logFile, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return fmt.Errorf("failed to open log file: %w", err)
	}

	executable := m.paths.GetServerExecutable(t)
	cmd := exec.Command(executable, params...)
	cmd.Dir = m.paths.GetServerPath(t)

	m.logStartMessage(id, t, executable, params)

	a3, _ := s.(*Arma3Server)
	now := time.Now()
	p := &Process{
		serverID: id,
		cmd:      cmd,
		info: &ServerInstanceInfo{
			StartedAt:      &now,
			MaxPlayers:     maxPlayers,
			CurrentLogFile: filepath.Base(logFilePath),
		},
		stopCh:              make(chan struct{}),
		port:                port,
		queryPort:           queryPort,
		fastDownloadEnabled: a3 != nil && a3.FastDownloadEnabled,
	}

	// Capture logs for broadcasting and writing to file
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		logFile.Close()
		return fmt.Errorf("failed to create stdout pipe: %w", err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		logFile.Close()
		return fmt.Errorf("failed to create stderr pipe: %w", err)
	}

	logChan := make(chan *bytes.Buffer, 1000)
	m.startPipeScanning(stdout, stderr, logChan)

	statsFile, isReforger, statIntervalMs := m.openStatsLogIfNeeded(s, params, logFilePath, logFile)

	logsDone := make(chan struct{})
	go func() {
		m.handleServerLogs(
			p,
			logChan,
			logFile,
			statsFile,
			isReforger,
			statIntervalMs,
		)
		close(logsDone)
	}()

	if err := cmd.Start(); err != nil {
		<-logsDone
		closeFiles(logFile, statsFile)
		return fmt.Errorf("failed to start process: %w", err)
	}

	m.processes.Store(id, p)
	m.emitStatus(id, true)

	m.handlePostWait(p, logsDone, logFile, statsFile)

	return nil
}

func (m *ProcessManager) isServerAlreadyRunning(id int64) bool {
	if p, ok := m.processes.Load(id); ok {
		if proc, okProc := p.(*Process); okProc && proc.IsAlive() {
			return true
		}
	}
	return false
}

func (m *ProcessManager) startFastDLIfNeeded(s any) {
	a3, isArma3 := s.(*Arma3Server)
	if isArma3 && a3.FastDownloadEnabled {
		if err := m.startFastDLForServer(); err != nil {
			log.Printf("[ProcessManager] Warning: failed to start FastDL for server %d: %v", a3.ID, err)
		}
	}
}

func (m *ProcessManager) prepareServerDirectories(t Type, id int64) (string, error) {
	executable := m.paths.GetServerExecutable(t)
	if err := m.validateExecutable(executable); err != nil {
		return "", err
	}

	logFilePath := m.paths.GetServerLogFile(t, id)
	if err := os.MkdirAll(filepath.Dir(logFilePath), 0o755); err != nil {
		return "", fmt.Errorf("failed to create log directory: %w", err)
	}

	if t == TypeReforger {
		if err := m.ensureReforgerModsDir(); err != nil {
			return "", err
		}
	}

	return logFilePath, nil
}

func (m *ProcessManager) logStartMessage(id int64, t Type, executable string, params []string) {
	if m.debugMode {
		log.Printf("[ProcessManager] DEBUG: Executing: %s %s", executable, strings.Join(params, " "))
		log.Printf("[ProcessManager] DEBUG: Working Directory: %s", m.paths.GetServerPath(t))
	} else {
		log.Printf("[ProcessManager] Starting server ID %d: %s (Type: %v)", id, executable, t)
	}
}

func (m *ProcessManager) handlePostWait(p *Process, logsDone chan struct{}, logFile, statsFile *os.File) {
	go func() {
		err := p.cmd.Wait()
		log.Printf("Server ID %d stopped with error: %v", p.serverID, err)

		<-logsDone

		// Stop Headless Clients
		m.stopHeadlessClients(p.serverID)

		closeFiles(logFile, statsFile)

		p.mu.Lock()
		p.exited = true
		p.mu.Unlock()

		close(p.stopCh)
		m.emitStatus(p.serverID, false)

		// Pulizia dopo un delay (lascia tempo a GetInstanceInfo di rispondere correttamente)
		time.AfterFunc(5*time.Second, func() {
			if val, ok := m.processes.Load(p.serverID); ok && val == p {
				m.processes.Delete(p.serverID)
			}
		})
	}()
}

func closeFiles(mainLog, statsLog *os.File) {
	if mainLog != nil {
		_ = mainLog.Close()
	}
	if statsLog != nil && statsLog != mainLog {
		_ = statsLog.Close()
	}
}

func (m *ProcessManager) parseServerInstance(s any) (id int64, t Type, maxPlayers, port, queryPort int, err error) {
	switch v := s.(type) {
	case *Arma3Server:
		return v.ID, v.Type, v.MaxPlayers, v.Port, v.QueryPort, nil
	case *DayZServer:
		return v.ID, v.Type, v.MaxPlayers, v.Port, v.QueryPort, nil
	case *ReforgerServer:
		return v.ID, v.Type, v.MaxPlayers, v.Port, v.QueryPort, nil
	default:
		return 0, "", 0, 0, 0, errors.New("invalid server type for process manager")
	}
}

func (m *ProcessManager) checkPortConflict(id int64, port, queryPort int) error {
	var conflict error

	m.processes.Range(func(key, value any) bool {
		otherID, okID := key.(int64)
		otherProc, okProc := value.(*Process)
		if !okID || !okProc {
			return true
		}
		if otherID == id {
			return true
		}

		if otherProc.IsAlive() {
			portConflict := otherProc.port == port || otherProc.queryPort == port ||
				otherProc.port == queryPort || otherProc.queryPort == queryPort
			if portConflict {
				conflict = fmt.Errorf("port conflict: ports %d or %d are already in use by running server ID %d", port, queryPort, otherID)
				return false
			}
		}

		return true
	})

	return conflict
}

func (m *ProcessManager) validateExecutable(executable string) error {
	info, err := os.Stat(executable)
	if err != nil {
		return fmt.Errorf("server executable not found at %s: %w", executable, err)
	}
	if runtime.GOOS != "windows" && info.Mode()&0o111 == 0 {
		return fmt.Errorf("server executable at %s is not executable (mode: %o)", executable, info.Mode())
	}
	return nil
}

func (m *ProcessManager) ensureReforgerModsDir() error {
	reforgerModsDir := filepath.Join(m.paths.GetModsBaseDir(), "reforger")
	if err := os.MkdirAll(reforgerModsDir, 0o755); err != nil {
		return fmt.Errorf("failed to create reforger mods directory: %w", err)
	}
	return nil
}

func (m *ProcessManager) startPipeScanning(stdout, stderr io.ReadCloser, logChan chan *bytes.Buffer) {
	go func() {
		var wg sync.WaitGroup
		wg.Add(2)

		scanPipe := func(r io.Reader) {
			defer wg.Done()
			const maxLineSize = 64 * 1024 // 64KB max per line to prevent unbounded memory growth
			scanner := bufio.NewScanner(r)
			scanner.Buffer(make([]byte, 4096), maxLineSize)
			for scanner.Scan() {
				b := scanner.Bytes()
				if len(b) > 0 {
					buf, ok := bufferPool.Get().(*bytes.Buffer)
					if !ok {
						buf = new(bytes.Buffer)
					}
					buf.Reset()
					buf.Write(b)
					select {
					case logChan <- buf:
					default:
						// Buffer full, drop to prevent backpressure on game server process
						bufferPool.Put(buf)
					}
				}
			}
			if err := scanner.Err(); err != nil {
				log.Printf("[ProcessManager] Error scanning pipe: %v", err)
			}
		}

		go scanPipe(stdout)
		go scanPipe(stderr)

		wg.Wait()
		close(logChan)
	}()
}

func (m *ProcessManager) openStatsLogIfNeeded(s any, params []string, logFilePath string, logFile *os.File) (*os.File, bool, int) {
	rs, isReforger := s.(*ReforgerServer)
	if !isReforger {
		return nil, false, 20000
	}

	statIntervalMs := 20000

	if rs.LogStatsIntervalMs != nil && *rs.LogStatsIntervalMs > 0 {
		statIntervalMs = *rs.LogStatsIntervalMs
	}

	var hasLogStats bool
	if rs.LogStats {
		hasLogStats = true
	} else {
		for _, param := range params {
			if strings.EqualFold(param, "-logStats") {
				hasLogStats = true
				break
			}
		}
	}

	if !hasLogStats {
		return nil, true, statIntervalMs
	}

	statsLogPath := strings.Replace(logFilePath, ".log", ".stats.log", 1)
	statsFile, err := os.OpenFile(statsLogPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		log.Printf("[ProcessManager] Failed to open stats log: %v", err)
		return logFile, true, statIntervalMs
	}

	return statsFile, true, statIntervalMs
}

func (m *ProcessManager) stopHeadlessClients(id int64) {
	if val, ok := m.headlessClients.Load(id); ok {
		if hcs, ok := val.([]*HeadlessClient); ok {
			for _, hc := range hcs {
				_ = hc.Stop()
			}
		}

		m.headlessClients.Delete(id)
	}
}

func (m *ProcessManager) AddHeadlessClient(_ context.Context, s *Arma3Server) error {
	p, ok := m.processes.Load(s.ID)
	if !ok {
		return errors.New("server is not running")
	}
	proc, okProc := p.(*Process)
	if !okProc || !proc.IsAlive() {
		return errors.New("server is not running")
	}

	m.hcMu.Lock()
	defer m.hcMu.Unlock()

	hcs := []*HeadlessClient{}
	if val, ok := m.headlessClients.Load(s.ID); ok {
		if existingHCs, ok := val.([]*HeadlessClient); ok {
			hcs = existingHCs
		}
	}

	nextID := len(hcs) + 1

	hc := NewHeadlessClient(nextID, s, m.paths)
	if err := hc.Start(m.launcher.additionalMods); err != nil {
		return err
	}

	hcs = append(hcs, hc)
	m.headlessClients.Store(s.ID, hcs)

	proc.mu.Lock()
	proc.info.HeadlessClientsCount = len(hcs)
	proc.mu.Unlock()

	m.emitStatus(s.ID, true)

	return nil
}

func (m *ProcessManager) RemoveHeadlessClient(_ context.Context, id int64) error {
	m.hcMu.Lock()
	defer m.hcMu.Unlock()

	val, ok := m.headlessClients.Load(id)
	if !ok {
		return errors.New("no headless clients running")
	}

	hcs, okHCs := val.([]*HeadlessClient)
	if !okHCs || len(hcs) == 0 {
		return errors.New("no headless clients running")
	}

	lastHC := hcs[len(hcs)-1]
	_ = lastHC.Stop()

	hcs = hcs[:len(hcs)-1]
	if len(hcs) > 0 {
		m.headlessClients.Store(id, hcs)
	} else {
		m.headlessClients.Delete(id)
	}

	if p, ok := m.processes.Load(id); ok {
		if proc, okProc := p.(*Process); okProc {
			proc.mu.Lock()
			proc.info.HeadlessClientsCount = len(hcs)
			proc.mu.Unlock()
			m.emitStatus(id, true)
		}
	}

	return nil
}

func (m *ProcessManager) StopServer(ctx context.Context, id int64) error {
	p, ok := m.processes.Load(id)
	if !ok {
		return nil
	}
	proc, okProc := p.(*Process)
	if !okProc {
		return nil
	}

	shouldStop, err := m.trySetStopping(proc, ctx)
	if err != nil || !shouldStop {
		return err
	}

	// FastDL Logic
	if proc.fastDownloadEnabled {
		m.stopFastDLForServer()
	}

	// Try graceful shutdown
	stopped, err := m.gracefulShutdown(proc, ctx)
	if err != nil {
		return err
	}
	if stopped {
		return nil
	}

	// Fallback to Kill
	if err := m.killProcess(proc); err != nil {
		return err
	}

	// Always wait for the cleanup goroutine to finish before returning
	select {
	case <-proc.stopCh:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (m *ProcessManager) trySetStopping(proc *Process, ctx context.Context) (bool, error) {
	proc.mu.Lock()
	if proc.exited {
		proc.mu.Unlock()
		return false, nil
	}

	if proc.stopping {
		proc.mu.Unlock()
		// Already stopping, wait for it to finish
		select {
		case <-proc.stopCh:
			return false, nil
		case <-ctx.Done():
			return false, ctx.Err()
		}
	}

	proc.stopping = true
	proc.mu.Unlock()
	return true, nil
}

func (m *ProcessManager) gracefulShutdown(proc *Process, ctx context.Context) (bool, error) {
	// Try graceful shutdown (SIGINT/Interrupt)
	if err := proc.cmd.Process.Signal(os.Interrupt); err != nil {
		return false, err
	}

	// Wait for a bit
	select {
	case <-proc.stopCh:
		return true, nil
	case <-ctx.Done():
		return false, ctx.Err()
	case <-time.After(30 * time.Second):
		// Fallback to Kill
		return false, nil
	}
}

func (m *ProcessManager) killProcess(proc *Process) error {
	if err := proc.cmd.Process.Kill(); err != nil {
		proc.mu.Lock()
		proc.stopping = false
		proc.mu.Unlock()
		return err
	}
	return nil
}

func (m *ProcessManager) startFastDLForServer() error {
	m.fastdlMu.Lock()
	defer m.fastdlMu.Unlock()

	m.fastdlActiveCount++

	if m.fastdlServer == nil {
		// Serve directly from the mpmissions directory.
		// This ensures new .pbo files uploaded at runtime are immediately available
		// without requiring a server restart.
		mpmissionsDir := m.paths.GetScenariosBasePath()
		if err := os.MkdirAll(mpmissionsDir, 0o755); err != nil {
			return fmt.Errorf("failed to ensure mpmissions directory exists: %w", err)
		}

		m.fastdlServer = fastdl.NewServer(m.fastdlPort, mpmissionsDir)
		go func() {
			if err := m.fastdlServer.Start(); err != nil {
				log.Printf("[ProcessManager] FastDL server error: %v", err)
			}
		}()
	}

	return nil
}

func (m *ProcessManager) stopFastDLForServer() {
	m.fastdlMu.Lock()
	defer m.fastdlMu.Unlock()

	m.fastdlActiveCount--

	if m.fastdlActiveCount <= 0 {
		m.fastdlActiveCount = 0
		if m.fastdlServer != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			_ = m.fastdlServer.Stop(ctx)
			m.fastdlServer = nil
		}
	}
}

func (m *ProcessManager) Stop() {
	log.Println("[ProcessManager] Stopping all running servers...")
	bgCtx := context.Background()
	m.processes.Range(func(key, _ any) bool {
		id, okID := key.(int64)
		if !okID {
			return true
		}
		if err := m.StopServer(bgCtx, id); err != nil {
			log.Printf("[ProcessManager] Failed to stop server ID %d: %v", id, err)
		}
		return true
	})
}

func (m *ProcessManager) GetInstanceInfo(id int64) *ServerInstanceInfo {
	if p, ok := m.processes.Load(id); ok {
		if proc, okProc := p.(*Process); okProc && proc.IsAlive() {
			proc.mu.RLock()
			infoCopy := *proc.info
			proc.mu.RUnlock()

			return &infoCopy
		}
	}

	return nil
}

func (m *ProcessManager) GetServerLogFile(t Type, id int64) string {
	return m.paths.GetServerLogFile(t, id)
}

func (m *ProcessManager) handleServerLogs(p *Process, logChan <-chan *bytes.Buffer, mainLog, statsLog *os.File, isReforger bool, statIntervalMs int) {
	tracker := &reforgerTimeTracker{
		statInterval: time.Duration(statIntervalMs) * time.Millisecond,
	}

	for buf := range logChan {
		bLine := buf.Bytes()
		// trim \r (scanner already strips \n)
		if len(bLine) > 0 && bLine[len(bLine)-1] == '\r' {
			bLine = bLine[:len(bLine)-1]
		}

		m.broadcasterMu.RLock()
		b := m.broadcaster
		m.broadcasterMu.RUnlock()

		if isReforger {
			m.handleReforgerLogLine(p, bLine, b, mainLog, statsLog, tracker)
		} else {
			m.handleGenericLogLine(p, bLine, b, mainLog)
		}

		bufferPool.Put(buf)
	}
}

const reforgerTimeFormat = "2006-01-02 15:04:05"

type reforgerTimeTracker struct {
	lastTimestamp          time.Time
	lastFormattedTimestamp string
	lastUnix               int64
	lastStatTime           time.Time
	statInterval           time.Duration
}

func updateReforgerStatTracker(tracker *reforgerTimeTracker) string {
	now := time.Now()
	if tracker.lastStatTime.IsZero() {
		tracker.lastStatTime = now
		return now.Format(reforgerTimeFormat)
	}

	next := tracker.lastStatTime.Add(tracker.statInterval)

	if now.Sub(next) > 5*time.Minute {
		next = now.Add(-4 * time.Minute)
	}

	if next.After(now) {
		next = now
	}

	tracker.lastStatTime = next
	return next.Format(reforgerTimeFormat)
}

func updateReforgerTracker(tracker *reforgerTimeTracker) string {
	now := time.Now()
	if !now.After(tracker.lastTimestamp) {
		now = tracker.lastTimestamp.Add(time.Millisecond)
	}
	tracker.lastTimestamp = now

	unix := now.Unix()
	if unix != tracker.lastUnix {
		tracker.lastFormattedTimestamp = now.Format(reforgerTimeFormat)
		tracker.lastUnix = unix
	}
	return tracker.lastFormattedTimestamp
}

func (m *ProcessManager) broadcastReforgerStats(p *Process, stat *ReforgerStatDto, rawLine string, b Broadcaster) {
	if m.debugMode {
		log.Printf("[DEBUG-STATS] ParsedTime: %s | FPS: %.1f | Players: %d | Raw: %s", stat.Timestamp, stat.FPS, stat.Players, rawLine)
	}
	p.mu.Lock()
	p.info.LastReforgerStat = stat
	p.mu.Unlock()

	if b != nil {
		b.Broadcast("reforger_stats", ReforgerStatsPayload{
			ServerID: p.serverID,
			Stats:    stat,
		})
	}
}

// isReforgerSpam detects the cyclic tick lines that Reforger emits around
// each telemetry sample. These carry no diagnostic value and would flood
// both the main log file and the WebSocket stream.
func isReforgerSpam(line []byte) bool {
	if !bytes.Contains(line, []byte("UpdateEntities")) && !bytes.Contains(line, []byte("Frame")) {
		return false
	}
	s := strings.ReplaceAll(string(bytes.TrimSpace(line)), " ", "")
	return s == "WORLD:UpdateEntities" || s == "WORLD:Frame"
}

func (m *ProcessManager) handleReforgerLogLine(p *Process, line []byte, b Broadcaster, mainLog, statsLog *os.File, tracker *reforgerTimeTracker) {
	if isReforgerSpam(line) {
		return
	}

	timestampStr := updateReforgerTracker(tracker)

	var stat *ReforgerStatDto
	isStatLine := false
	var lineStr string // lazily set once if the line is a stat line
	if bytes.Contains(line, []byte("FPS:")) && bytes.Contains(line, []byte("Mem:")) {
		lineStr = string(line) // single conversion — reused by both ParseReforgerStatLine and broadcastReforgerStats
		statTimestampStr := updateReforgerStatTracker(tracker)
		stat = ParseReforgerStatLine(statTimestampStr, lineStr)
		isStatLine = stat != nil
		if isStatLine {
			timestampStr = statTimestampStr
		}
	}

	if isStatLine {
		m.broadcastReforgerStats(p, stat, lineStr, b)
	}

	// Get buffer from pool to avoid allocation
	outBuf, ok := bufferPool.Get().(*bytes.Buffer)
	if !ok {
		outBuf = new(bytes.Buffer)
	}
	outBuf.Reset()
	outBuf.WriteString(timestampStr)
	outBuf.WriteString(": ")
	outBuf.Write(line)
	outBuf.WriteByte('\n')
	lineBytes := outBuf.Bytes()

	// Divert to stats log and SKIP broadcasting to main log if it's telemetry
	if isStatLine && statsLog != nil {
		_, _ = statsLog.Write(lineBytes)
	} else {
		// Broadcast to UI only if NOT a stat line
		if b != nil {
			b.Broadcast("server_log", LogPayload{
				ServerID: p.serverID,
				Message:  string(line),
			})
		}

		_, _ = mainLog.Write(lineBytes)
	}

	bufferPool.Put(outBuf)
}

func (m *ProcessManager) handleGenericLogLine(p *Process, line []byte, b Broadcaster, mainLog *os.File) {
	if b != nil {
		b.Broadcast("server_log", LogPayload{
			ServerID: p.serverID,
			Message:  string(line),
		})
	}

	// Use buffer pool even for generic logs to avoid line + "\n" allocation
	outBuf, ok := bufferPool.Get().(*bytes.Buffer)
	if !ok {
		outBuf = new(bytes.Buffer)
	}
	outBuf.Reset()
	outBuf.Write(line)
	outBuf.WriteByte('\n')

	_, _ = mainLog.Write(outBuf.Bytes())

	bufferPool.Put(outBuf)
}
