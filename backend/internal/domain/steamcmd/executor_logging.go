package steamcmd

import (
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

/*
This file is part of the SteamCMD Executor split.
It handles logging, console output, and event broadcasting (WebSockets).

Other files in this repository:
- executor.go: Core Executor struct, worker pool, and job management.
- executor_parser.go: SteamCMD stdout parsing and progress tracking.
*/

func (e *Executor) emitLog(message string) {
	e.broadcasterMu.RLock()
	b := e.broadcaster
	e.broadcasterMu.RUnlock()

	if b != nil {
		b.Broadcast("steamcmd_log", map[string]any{
			"message": message,
		})
	}
}

func (e *Executor) emitProgress(info ItemInfo) {
	e.broadcasterMu.RLock()
	b := e.broadcaster
	e.broadcasterMu.RUnlock()

	if b != nil {
		// Broadcast as map to ensure compatibility with hub.go filtering
		b.Broadcast("install_progress", map[string]any{
			"itemId":    info.ItemID,
			"status":    info.Status,
			"progress":  info.Progress,
			"current":   info.Current,
			"total":     info.Total,
			"server_id": info.ItemID, // Include for WebSocket filtering
		})
	}
}

func (e *Executor) logToConsoleAndFile(message string, _ *Job, logPath string) {
	e.writeLog(message, true, logPath)
}

func (e *Executor) writeLog(message string, toSystemLog bool, overrideLogPath string) string {
	if toSystemLog {
		log.Println(message)
	}

	timestamp := time.Now().Format("[15:04:05]")
	formattedLine := timestamp + " " + message

	e.logMutex.Lock()
	defer e.logMutex.Unlock()

	e.ensureLogFileLocked(overrideLogPath)

	if e.logFile != nil {
		_, _ = e.logFile.WriteString(formattedLine + "\n")
		// Sync the file to ensure it's written to disk
		_ = e.logFile.Sync()
	}

	e.logBuffer = append(e.logBuffer, formattedLine)
	if len(e.logBuffer) > 500 {
		e.logBuffer = e.logBuffer[len(e.logBuffer)-500:]
	}

	return formattedLine
}

// ensureLogFileLocked ensures the log file is open and points to the correct path.
// It MUST be called with e.logMutex held.
func (e *Executor) ensureLogFileLocked(overrideLogPath string) {
	logPath := overrideLogPath
	if logPath == "" {
		logPath = e.paths.GetSteamCmdLogFile()
	}

	// If we have a file open, check if it's the correct one for today
	if e.logFile != nil {
		if strings.EqualFold(filepath.Clean(e.logFile.Name()), filepath.Clean(logPath)) {
			return
		}

		// Day changed, close old log file
		_ = e.logFile.Close()
		e.logFile = nil
	}

	// Open/Create the log file
	_ = os.MkdirAll(filepath.Dir(logPath), 0o755)
	file, err := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err == nil {
		e.logFile = file
	}
}

func (e *Executor) GetRecentLogs() string {
	e.logMutex.Lock()
	defer e.logMutex.Unlock()

	return strings.Join(e.logBuffer, "\n")
}

var ansiRegex = regexp.MustCompile(`\x1b\[[0-9;]*[a-zA-Z]`)

func stripANSI(str string) string {
	return ansiRegex.ReplaceAllString(str, "")
}
