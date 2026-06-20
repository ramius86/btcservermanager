package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"btcservermanager/internal/domain/workshop"
	"context"
	"errors"
	"fmt"
	"io"
	"math/rand/v2"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"
)

/*
This is the core SteamCMD Executor file.
It manages the worker pool, command building, and job execution life-cycle.

Specific implementations are found in:
- executor_parser.go: SteamCMD stdout parsing and progress tracking.
- executor_logging.go: Logging, console output, and event broadcasting.
*/

type Executor struct {
	queue         chan *Job
	paths         *config.Paths
	auth          *steamauth.AuthService
	itemInfo      sync.Map // map[string]ItemInfo
	logBuffer     []string // Recent logs for real-time view
	logMutex      sync.Mutex
	logFile       *os.File
	broadcasterMu sync.RWMutex
	broadcaster   Broadcaster
	ctx           context.Context
	cancel        context.CancelFunc
	stopCh        chan struct{}
	wg            sync.WaitGroup
	execCommand   func(ctx context.Context, name string, arg ...string) *exec.Cmd
}

type Broadcaster interface {
	Broadcast(eventType string, payload any)
}

func NewExecutor(paths *config.Paths, auth *steamauth.AuthService) *Executor {
	ctx, cancel := context.WithCancel(context.Background())
	e := &Executor{
		queue:       make(chan *Job, 100),
		paths:       paths,
		auth:        auth,
		ctx:         ctx,
		cancel:      cancel,
		stopCh:      make(chan struct{}),
		execCommand: exec.CommandContext,
	}

	e.writeLog("SteamCMD Executor initialized", true, "")

	e.logMutex.Lock()
	if e.logFile != nil {
		_ = e.logFile.Close()
		e.logFile = nil
	}
	e.logMutex.Unlock()

	e.wg.Add(1)
	go e.run()

	return e
}

func (e *Executor) SetBroadcaster(b Broadcaster) {
	e.broadcasterMu.Lock()
	defer e.broadcasterMu.Unlock()
	e.broadcaster = b
}

func (e *Executor) SetExecCommand(f func(ctx context.Context, name string, arg ...string) *exec.Cmd) {
	e.execCommand = f
}

func (e *Executor) Stop() {
	e.cancel()
	close(e.stopCh)
	e.wg.Wait()
}

func (e *Executor) run() {
	defer e.wg.Done()
	defer func() {
		e.logMutex.Lock()
		if e.logFile != nil {
			e.logFile.Close()
			e.logFile = nil
		}
		e.logMutex.Unlock()
	}()

	for {
		select {
		case job, ok := <-e.queue:
			if !ok {
				return
			}

			e.execute(job)

			// Clean up and release the log file lock once job is done
			e.logMutex.Lock()
			if e.logFile != nil {
				_ = e.logFile.Close()
				e.logFile = nil
			}
			e.logMutex.Unlock()

			now := time.Now()
			job.FinishedAt = &now
			close(job.Done)
		case <-e.stopCh:
			// Drain pending jobs and signal interruption
			for {
				select {
				case job := <-e.queue:
					errStatus := workshop.ErrorInterrupted
					job.ErrorStatus = &errStatus
					if job.OnFailure != nil {
						job.OnFailure(errStatus)
					}
					close(job.Done)
				default:
					return
				}
			}
		}
	}
}

func (e *Executor) Submit(job *Job) {
	e.queue <- job
}

func (e *Executor) execute(job *Job) {
	maxAttempts := 10
	// For mod downloads, use fewer retries since we only retry failed items
	if job.Type == JobInstallMods || job.Type == JobUpdateMods {
		maxAttempts = 3
	}

	var attempts int
	jobLogPath := e.paths.GetSteamCmdLogFile()

	for attempts < maxAttempts {
		job.ErrorStatus = nil

		shouldContinue, err := e.prepareExecuteAttempt(job, attempts, jobLogPath)
		if err != nil || !shouldContinue {
			return
		}

		attempts++
		e.logToConsoleAndFile("Starting SteamCMD job (Attempt "+strconv.Itoa(attempts)+"/"+strconv.Itoa(maxAttempts)+"): "+string(job.Type), job, jobLogPath)

		e.clearProgressOnFirstAttempt(job, attempts)

		auth, err := e.getSteamCMDAuth(job, jobLogPath)
		if err != nil {
			return
		}

		output, cmdErr := e.runSteamCMDCommand(job, auth, jobLogPath)

		shouldRetry := e.handleAttemptResult(job, output, cmdErr, attempts, maxAttempts, jobLogPath)
		if !shouldRetry {
			return
		}
	}

	// If we exhausted all attempts
	e.logToConsoleAndFile(fmt.Sprintf("All %d attempts exhausted for job %s", maxAttempts, job.Type), job, jobLogPath)
	if job.OnFailure != nil && job.ErrorStatus != nil {
		job.OnFailure(*job.ErrorStatus)
	}
}

func (e *Executor) prepareExecuteAttempt(job *Job, attempts int, jobLogPath string) (bool, error) {
	if attempts == 0 {
		return true, nil
	}

	// For partial failure retries, rebuild parameters with only the failed items
	if job.OnRetryWithFailedItems != nil && len(job.FailedItems) > 0 {
		e.logToConsoleAndFile(fmt.Sprintf("Retrying %d failed mod(s): %v", len(job.FailedItems), job.FailedItems), job, jobLogPath)
		newParams := job.OnRetryWithFailedItems(job.FailedItems)
		if len(newParams) > 0 {
			job.Parameters = newParams
		}
	}

	// Reset per-item tracking for this attempt
	job.FailedItems = nil

	// Exponential backoff with jitter
	baseDelay := 1 * time.Second
	maxDelay := 60 * time.Second
	delay := baseDelay * (1 << uint(attempts-1))
	if delay > maxDelay {
		delay = maxDelay
	}
	// Add jitter (up to 25% of current delay)
	jitter := time.Duration(rand.Int64N(int64(delay/4 + 1)))
	e.logToConsoleAndFile("Retrying in "+(delay+jitter).String()+"...", job, jobLogPath)

	select {
	case <-time.After(delay + jitter):
		return true, nil
	case <-e.ctx.Done():
		return false, e.ctx.Err()
	}
}

func (e *Executor) clearProgressOnFirstAttempt(job *Job, attempts int) {
	if attempts != 1 {
		return
	}

	// Clear stale progress info for this job
	if job.RelatedServer != "" {
		e.itemInfo.Delete("server:" + string(job.RelatedServer))
	}

	for _, modID := range job.RelatedWorkshopMods {
		e.itemInfo.Delete("mod:" + strconv.FormatInt(modID, 10))
	}
	// Also clear global steamcmd update info
	e.itemInfo.Delete("0")

	// Emit initial status to inform frontend immediately
	if job.RelatedServer != "" {
		info := ItemInfo{
			ItemID:   server.ServerIDs[job.RelatedServer],
			Status:   StatusDownloading,
			Progress: 0.0,
		}
		e.itemInfo.Store("server:"+string(job.RelatedServer), info)
		e.emitProgress(info)
	} else if len(job.RelatedWorkshopMods) > 0 {
		for _, modID := range job.RelatedWorkshopMods {
			info := ItemInfo{
				ItemID:   modID,
				Status:   StatusDownloading,
				Progress: 0.0,
			}
			e.itemInfo.Store("mod:"+strconv.FormatInt(modID, 10), info)
			e.emitProgress(info)
		}
	}
}

func (e *Executor) getSteamCMDAuth(job *Job, jobLogPath string) (*steamauth.SteamAuth, error) {
	auth, err := e.auth.GetAuthAccount(e.ctx)
	if err != nil {
		e.logToConsoleAndFile("Failed to get Steam auth: "+err.Error(), job, jobLogPath)
		errStatus := workshop.ErrorGeneric
		job.ErrorStatus = &errStatus
		if job.OnFailure != nil {
			job.OnFailure(errStatus)
		}
		return nil, err
	}

	if auth.Username == "" || auth.Password == "" {
		e.logToConsoleAndFile("Login failed: Missing Steam credentials in Settings.", job, jobLogPath)
		errStatus := workshop.ErrorWrongAuth
		job.ErrorStatus = &errStatus
		if job.OnFailure != nil {
			job.OnFailure(errStatus)
		}
		return nil, errors.New("missing credentials")
	}

	return auth, nil
}

func (e *Executor) runSteamCMDCommand(job *Job, auth *steamauth.SteamAuth, jobLogPath string) (string, error) {
	params, maskIndices := e.getJobParams(job, auth)

	// Log the command (masking password)
	maskedParams := make([]string, len(params))
	copy(maskedParams, params)

	for _, idx := range maskIndices {
		if idx < len(maskedParams) {
			maskedParams[idx] = "********"
		}
	}

	e.logToConsoleAndFile("Executing: "+e.paths.GetSteamCmdExecutable()+" "+strings.Join(maskedParams, " "), job, jobLogPath)

	scriptFile, err := writeTempScript(params)
	if err != nil {
		e.logToConsoleAndFile("Failed to create temporary script: "+err.Error(), job, jobLogPath)
		errStatus := workshop.ErrorIO
		job.ErrorStatus = &errStatus
		if job.OnFailure != nil {
			job.OnFailure(errStatus)
		}
		return "", err
	}
	defer os.Remove(scriptFile)

	cmd := e.execCommand(e.ctx, e.paths.GetSteamCmdExecutable(), "+runscript", scriptFile)

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	// Use pipes to merge stdout and stderr concurrently
	pr, pw := io.Pipe()
	go func() {
		var wg sync.WaitGroup
		wg.Add(2)

		copyFunc := func(r io.Reader) {
			defer wg.Done()
			_, _ = io.Copy(pw, r)
		}
		go copyFunc(stdout)
		go copyFunc(stderr)
		wg.Wait()
		pw.Close()
	}()

	if err := cmd.Start(); err != nil {
		pw.Close() // Close pipe writer to prevent copying goroutines from leaking
		e.logToConsoleAndFile("Failed to start SteamCMD: "+err.Error(), job, jobLogPath)
		errStatus := workshop.ErrorIO
		job.ErrorStatus = &errStatus
		if job.OnFailure != nil {
			job.OnFailure(errStatus)
		}
		return "", err
	}

	output := e.processOutput(pr, job, jobLogPath)
	err = cmd.Wait()
	return output, err
}

func (e *Executor) handleAttemptResult(job *Job, output string, cmdErr error, _, _ int, jobLogPath string) bool {
	e.handleResult(output, job)

	if job.ErrorStatus == nil {
		if job.OnSuccess != nil {
			job.OnSuccess()
		}
		return false // Success, stop retries!
	}

	isGenericError := cmdErr != nil && job.ErrorStatus != nil && *job.ErrorStatus == workshop.ErrorGeneric
	if isGenericError {
		e.logToConsoleAndFile("SteamCMD exited with error: "+cmdErr.Error(), job, jobLogPath)
	}

	if *job.ErrorStatus == workshop.ErrorPartialFailure {
		e.logToConsoleAndFile(fmt.Sprintf("%d mod(s) failed, %d succeeded", len(job.FailedItems), len(job.SucceededItems)), job, jobLogPath)
	}

	// Check if the error is retriable
	if !e.isRetriable(job.ErrorStatus, output) {
		e.logToConsoleAndFile("Fatal error encountered, stopping retries.", job, jobLogPath)
		if job.OnFailure != nil && job.ErrorStatus != nil {
			job.OnFailure(*job.ErrorStatus)
		}
		return false // Fatal, stop retries!
	}

	return true // Retriable, retry!
}

func (e *Executor) getJobParams(job *Job, auth *steamauth.SteamAuth) ([]string, []int) {
	result := make([]string, 0, len(job.Parameters))
	maskIndices := make([]int, 0, len(job.Parameters))

	for _, p := range job.Parameters {
		if strings.Contains(p, SteamCredentialsPlaceholder) {
			result = append(result, auth.Username)

			// Store index for password masking
			maskIndices = append(maskIndices, len(result))
			result = append(result, auth.Password)

			if auth.SteamGuardToken != "" {
				// Store index for guard token masking
				maskIndices = append(maskIndices, len(result))
				result = append(result, auth.SteamGuardToken)
			}
		} else {
			result = append(result, p)
		}
	}

	return result, maskIndices
}

func (e *Executor) GetProgress(key string) float64 {
	if val, ok := e.itemInfo.Load(key); ok {
		if info, ok := val.(ItemInfo); ok {
			return info.Progress
		}
	}

	return 0
}

func (e *Executor) GetItemInfo(key string) *ItemInfo {
	if val, ok := e.itemInfo.Load(key); ok {
		if info, ok := val.(ItemInfo); ok {
			return &info
		}
	}

	return nil
}

func (e *Executor) GetAllItemInfo() map[string]ItemInfo {
	result := make(map[string]ItemInfo)

	e.itemInfo.Range(func(key, value any) bool {
		keyStr, okKey := key.(string)
		valInfo, okVal := value.(ItemInfo)
		if okKey && okVal {
			result[keyStr] = valInfo
		}
		return true
	})

	return result
}

func (e *Executor) TestLogin(ctx context.Context, username, password, guardToken string) error {
	params := []string{"+@NoPromptForPassword", "1", "+login", username, password}
	if guardToken != "" {
		params = append(params, guardToken)
	}

	params = append(params, "+quit")

	scriptFile, err := writeTempScript(params)
	if err != nil {
		return fmt.Errorf("failed to create login script: %w", err)
	}
	defer os.Remove(scriptFile)

	cmd := e.execCommand(ctx, e.paths.GetSteamCmdExecutable(), "+runscript", scriptFile)
	output, _ := cmd.CombinedOutput() // Ignore direct error to parse output for better messages

	outStr := string(output)
	cleanOut := stripANSI(outStr)

	if strings.Contains(cleanOut, "Login Failed") || strings.Contains(cleanOut, "Invalid Password") {
		return errors.New("login failed: invalid credentials")
	}

	if strings.Contains(cleanOut, "Steam Guard") {
		return errors.New("login failed: steam guard required")
	}

	// Success indicators:
	// 1. "Success!" or "Logged in OK" (standard)
	// 2. "Waiting for user info...OK" (common when cached or redirected)
	if strings.Contains(cleanOut, "Success!") ||
		strings.Contains(cleanOut, "Logged in OK") ||
		(strings.Contains(cleanOut, "Waiting for user info...") && strings.Contains(cleanOut, "OK")) {
		return nil
	}

	// If we got "No cached credentials", it means the password was effectively empty for SteamCMD
	if strings.Contains(cleanOut, "No cached credentials") {
		return errors.New("login failed: no password provided or found in cache")
	}

	// Fallback to a truncated output for other failures to avoid massive update logs
	lines := strings.Split(cleanOut, "\n")

	lastLines := []string{}

	for i := len(lines) - 1; i >= 0 && len(lastLines) < 5; i-- {
		line := strings.TrimSpace(lines[i])
		if line != "" {
			lastLines = append([]string{line}, lastLines...)
		}
	}

	if len(lastLines) > 0 {
		return fmt.Errorf("login failed: %s", strings.Join(lastLines, " | "))
	}

	return errors.New("login failed: unknown error")
}

func writeTempScript(params []string) (string, error) {
	lines := buildScriptLines(params)
	content := strings.Join(lines, "\n") + "\n"

	// Create temp file
	tmpFile, err := os.CreateTemp("", "steamcmd_script_*.txt")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	if _, err := tmpFile.WriteString(content); err != nil {
		os.Remove(tmpFile.Name())
		return "", err
	}

	return tmpFile.Name(), nil
}

func buildScriptLines(params []string) []string {
	lines := make([]string, 0, len(params))
	var currentLine []string

	for _, p := range params {
		if strings.HasPrefix(p, "+") {
			if len(currentLine) > 0 {
				lines = append(lines, strings.Join(currentLine, " "))
			}
			cmd := strings.TrimPrefix(p, "+")
			currentLine = []string{cmd}
			continue
		}

		// Quote argument if it has spaces or double quotes, and escape internal quotes
		if strings.Contains(p, " ") || strings.Contains(p, `"`) {
			escaped := strings.ReplaceAll(p, `"`, `\"`)
			currentLine = append(currentLine, `"`+escaped+`"`)
		} else {
			currentLine = append(currentLine, p)
		}
	}
	if len(currentLine) > 0 {
		lines = append(lines, strings.Join(currentLine, " "))
	}

	return ensureQuitLine(lines)
}

func ensureQuitLine(lines []string) []string {
	var hasQuit bool
	for _, l := range lines {
		if strings.HasPrefix(l, "quit") {
			hasQuit = true
			break
		}
	}
	if !hasQuit {
		lines = append(lines, "quit")
	}
	return lines
}
