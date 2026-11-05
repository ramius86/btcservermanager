package steamcmd

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"bufio"
	"io"
	"regexp"
	"strconv"
	"strings"
)

/*
This file is part of the SteamCMD Executor split.
It handles the parsing of SteamCMD's stdout, progress tracking, and result handling.

Other files in this repository:
- executor.go: Core Executor struct, worker pool, and job management.
- executor_logging.go: Logging, console output, and event broadcasting.
*/

const (
	serverPrefix = "server:"
	modPrefix    = "mod:"
)

var (
	progressRegex   = regexp.MustCompile(`progress:\s+([0-9.]+)(?:\s+\(([0-9]+)\s+/\s+([0-9]+)\))?`)
	selfUpdateRegex = regexp.MustCompile(`\[\s*([0-9]+)%\].*Downloading update\s+\(([0-9,]+)\s+of\s+([0-9,]+)\s+KB\)`)
	buildIdRegex    = regexp.MustCompile(`"buildid"\s+"(\d+)"`)

	successModRegex     = regexp.MustCompile(`(?i)success\. downloaded item (\d+)`)
	downloadingModRegex = regexp.MustCompile(`(?i)downloading item (\d+)`)
	// "already up to date" is the Success line a verify run prints when nothing
	// had to be downloaded; without it the progress entry never reaches FINISHED
	// and the frontend keeps showing the job as running.
	successAppRegex = regexp.MustCompile(`(?i)success! app '\d+' (?:fully installed|already up to date)`)

	// Per-item error patterns:
	//   "ERROR! Download item 583496184 failed (Failure)."
	//   "ERROR! Timeout downloading item 1087215803"
	errorModDownloadRegex = regexp.MustCompile(`(?i)error!\s+download item (\d+) failed`)
	errorModTimeoutRegex  = regexp.MustCompile(`(?i)error!\s+timeout downloading item (\d+)`)
)

func (e *Executor) processOutput(r io.Reader, job *Job, logPath string) string {
	var fullOutput strings.Builder

	scanner := bufio.NewScanner(r)
	buf := make([]byte, 0, 64*1024)
	scanner.Buffer(buf, 10*1024*1024)

	for scanner.Scan() {
		rawLine := scanner.Text()
		line := stripANSI(rawLine)
		fullOutput.WriteString(line)
		fullOutput.WriteString("\n")

		formattedLine := e.writeLog(line, false, logPath)
		e.emitLog(formattedLine)
		e.parseProgress(line, job)
	}

	if err := scanner.Err(); err != nil {
		e.logToConsoleAndFile("Error reading process output: "+err.Error(), job, logPath)
	}

	return fullOutput.String()
}

func (e *Executor) parseProgress(line string, job *Job) {
	if e.parseCheckUpdates(line, job) {
		return
	}

	lineLower := strings.ToLower(strings.TrimSpace(line))

	if parseBootstrapperLine(line, lineLower) {
		return
	}
	if e.parseModErrors(lineLower, job) {
		return
	}
	if e.parseSuccessCases(lineLower, job) {
		return
	}
	if e.parseDownloadingMod(lineLower) {
		return
	}
	if e.parseAppUpdateState(lineLower, job) {
		return
	}

	// 6. Build ID parsing (from app_info_print)
	if matches := buildIdRegex.FindStringSubmatch(line); len(matches) >= 2 {
		e.updateFinishedServerBuildID(job, matches[1])
	}
}

func (e *Executor) parseCheckUpdates(line string, job *Job) bool {
	if job.Type != JobCheckUpdates {
		return false
	}
	if matches := buildIdRegex.FindStringSubmatch(line); len(matches) >= 2 {
		e.updateFinishedServerBuildID(job, matches[1])
	}
	return true
}

func (e *Executor) updateFinishedServerBuildID(job *Job, buildID string) {
	if job.RelatedServer != "" {
		job.ResultVersion = buildID
		info := ItemInfo{
			ItemID:  server.ServerIDs[job.RelatedServer],
			Status:  StatusFinished,
			Version: buildID,
		}
		e.itemInfo.Store(serverPrefix+string(job.RelatedServer), info)
		e.emitProgress(info)
	}
}

// parseBootstrapperLine consumes SteamCMD's own self-update output. Those lines
// belong to the bootstrapper replacing itself, not to the game install: showing
// them for the server painted the 41 MB self-update as the branch update and
// then dropped the bar back to 0% when the real app_update started. The game's
// own progress comes from the "Update state (0x..)" lines.
func parseBootstrapperLine(line, lineLower string) bool {
	if strings.Contains(lineLower, "checking for available update") ||
		strings.Contains(lineLower, "verifying installation") {
		return true
	}

	return selfUpdateRegex.MatchString(line)
}

func (e *Executor) parseModErrors(lineLower string, job *Job) bool {
	if matches := errorModDownloadRegex.FindStringSubmatch(lineLower); len(matches) >= 2 {
		e.handleModItemError(job, matches[1])
		return true
	}

	if matches := errorModTimeoutRegex.FindStringSubmatch(lineLower); len(matches) >= 2 {
		e.handleModItemError(job, matches[1])
		return true
	}
	return false
}

func (e *Executor) handleModItemError(job *Job, modIDStr string) {
	if itemID, err := strconv.ParseInt(modIDStr, 10, 64); err == nil {
		job.FailedItems = append(job.FailedItems, itemID)
		info := ItemInfo{
			ItemID:   itemID,
			Status:   StatusError,
			Progress: 0.0,
		}
		e.itemInfo.Store(modPrefix+strconv.FormatInt(itemID, 10), info)
		e.emitProgress(info)

		if job.OnItemFailure != nil {
			job.OnItemFailure(itemID)
		}
	}
}

func (e *Executor) parseSuccessCases(lineLower string, job *Job) bool {
	if matches := successModRegex.FindStringSubmatch(lineLower); len(matches) >= 2 {
		if itemID, err := strconv.ParseInt(matches[1], 10, 64); err == nil {
			job.SucceededItems = append(job.SucceededItems, itemID)
			info := ItemInfo{
				ItemID:   itemID,
				Status:   StatusFinished,
				Progress: 100.0,
			}
			e.itemInfo.Store(modPrefix+strconv.FormatInt(itemID, 10), info)
			e.emitProgress(info)

			if job.OnItemSuccess != nil {
				job.OnItemSuccess(itemID)
			}
		}
		return true
	}

	if successAppRegex.MatchString(lineLower) {
		if job.RelatedServer != "" {
			info := ItemInfo{
				ItemID:   server.ServerIDs[job.RelatedServer],
				Status:   StatusFinished,
				Progress: 100.0,
			}
			e.itemInfo.Store(serverPrefix+string(job.RelatedServer), info)
			e.emitProgress(info)
		}
		return true
	}
	return false
}

func (e *Executor) parseDownloadingMod(lineLower string) bool {
	if matches := downloadingModRegex.FindStringSubmatch(lineLower); len(matches) >= 2 {
		if itemID, err := strconv.ParseInt(matches[1], 10, 64); err == nil {
			info := ItemInfo{
				ItemID:   itemID,
				Status:   StatusDownloading,
				Progress: 0.0,
			}
			e.itemInfo.Store(modPrefix+strconv.FormatInt(itemID, 10), info)
			e.emitProgress(info)
		}
		return true
	}
	return false
}

func (e *Executor) parseAppUpdateState(lineLower string, job *Job) bool {
	if !strings.Contains(lineLower, "update state") {
		return false
	}

	// SteamCMD closes an app update with "Update state (0x0) unknown, progress:
	// 0.00 (0 / 0)" right before the Success line. Treating it as a download
	// dropped the bar back to 0% after the install had already completed.
	if strings.Contains(lineLower, "update state (0x0)") {
		return true
	}

	status := StatusDownloading
	switch {
	case strings.Contains(lineLower, "preallocating"):
		status = StatusPreallocating
	case strings.Contains(lineLower, "verifying"):
		status = StatusVerifying
	case strings.Contains(lineLower, "committing"):
		status = StatusCommitting
	}

	var progress float64
	var current int64
	var total int64

	if matches := progressRegex.FindStringSubmatch(lineLower); len(matches) >= 4 {
		if p, err := strconv.ParseFloat(matches[1], 64); err == nil {
			progress = p
		}
		if c, err := strconv.ParseInt(matches[2], 10, 64); err == nil {
			current = c
		}
		if t, err := strconv.ParseInt(matches[3], 10, 64); err == nil {
			total = t
		}
	}

	if job.RelatedServer != "" {
		info := ItemInfo{
			ItemID:   server.ServerIDs[job.RelatedServer],
			Status:   status,
			Progress: progress,
			Current:  current,
			Total:    total,
		}
		e.itemInfo.Store(serverPrefix+string(job.RelatedServer), info)
		e.emitProgress(info)
	}

	return true
}

func (e *Executor) handleResult(output string, job *Job) {
	// For mod download jobs, use per-item tracking instead of coarse output scanning.
	// This prevents a few successful downloads from masking failures of other items.
	if job.Type == JobInstallMods || job.Type == JobUpdateMods {
		e.handleModResult(job)
		return
	}

	// For non-mod jobs (server installs, updates), keep coarse-grained scanning,
	// but only on the markers SteamCMD actually uses for a failure. A bare
	// "Error" substring also appears in informational output, and treating that
	// as a failed install cost ten retries.
	cleanOut := stripANSI(output)

	if !hasSteamCMDError(cleanOut) {
		return
	}

	errStatus := parseJobErrorCode(cleanOut)
	job.ErrorStatus = &errStatus
}

// steamCMDErrorMarkers are the failure strings SteamCMD prints. Matching is
// case-insensitive.
var steamCMDErrorMarkers = []string{"error!", "failed", "timed out"}

// steamCMDBenignErrorLines are diagnostic lines that contain a failure marker
// but never mean the job failed. SteamCMD prints the missing bootstrapper
// translation file on stderr at every Linux start, so scanning the raw output
// for "failed" reported every successful install and update as an error.
var steamCMDBenignErrorLines = []string{
	"ilocalize::addfile() failed to load file",
}

func hasSteamCMDError(output string) bool {
	for _, line := range strings.Split(strings.ToLower(output), "\n") {
		if isBenignSteamCMDLine(line) {
			continue
		}

		for _, marker := range steamCMDErrorMarkers {
			if strings.Contains(line, marker) {
				return true
			}
		}
	}

	return false
}

func isBenignSteamCMDLine(line string) bool {
	if isSteamCMDConvarEcho(line) {
		return true
	}

	for _, benign := range steamCMDBenignErrorLines {
		if strings.Contains(line, benign) {
			return true
		}
	}

	return false
}

// isSteamCMDConvarEcho reports whether the line is SteamCMD echoing a setting
// it just applied (`Steam>"@ShutdownOnFailedCommand" = "1"`, sometimes without
// quotes). The convar name contains "failed", so scanning that echo as a
// failure marked every install and update as failed, retried it, and left the
// installation on ERROR after SteamCMD had printed "Success! App ... fully
// installed.". A line that carries an actual failure never starts with the
// prompt plus an assignment.
func isSteamCMDConvarEcho(line string) bool {
	trimmed := strings.TrimSpace(line)

	return strings.HasPrefix(trimmed, "steam>") && strings.Contains(trimmed, "=")
}

func parseJobErrorCode(cleanOut string) workshop.ErrorStatus {
	lower := strings.ToLower(cleanOut)

	switch {
	case strings.Contains(lower, "invalid password") || strings.Contains(lower, "login failed"):
		return workshop.ErrorWrongAuth
	case strings.Contains(lower, "disk space"):
		return workshop.ErrorIO
	case strings.Contains(lower, "rate limit exceeded") || strings.Contains(lower, "too many requests"):
		return workshop.ErrorRateLimit
	case strings.Contains(lower, "timed out") || strings.Contains(lower, "timeout"):
		return workshop.ErrorTimeout
	default:
		return workshop.ErrorGeneric
	}
}

// handleModResult evaluates per-item success/failure for mod download jobs.
// A job is only successful if ALL requested items succeeded.
func (e *Executor) handleModResult(job *Job) {
	if len(job.FailedItems) == 0 && len(job.SucceededItems) == len(job.RelatedWorkshopMods) {
		// All items confirmed successful
		return
	}

	if len(job.FailedItems) > 0 {
		// Some items explicitly failed
		errStatus := workshop.ErrorPartialFailure
		job.ErrorStatus = &errStatus
		return
	}

	// Some items had neither success nor failure confirmation.
	// This happens when SteamCMD crashes or exits unexpectedly mid-batch.
	// Treat unaccounted items as failures.
	succeededSet := make(map[int64]bool, len(job.SucceededItems))
	for _, id := range job.SucceededItems {
		succeededSet[id] = true
	}

	failedSet := make(map[int64]bool, len(job.FailedItems))
	for _, id := range job.FailedItems {
		failedSet[id] = true
	}

	for _, id := range job.RelatedWorkshopMods {
		if !succeededSet[id] && !failedSet[id] {
			job.FailedItems = append(job.FailedItems, id)

			// Emit error status for the unaccounted item
			info := ItemInfo{
				ItemID:   id,
				Status:   StatusError,
				Progress: 0.0,
			}
			e.itemInfo.Store(modPrefix+strconv.FormatInt(id, 10), info)
			e.emitProgress(info)

			if job.OnItemFailure != nil {
				job.OnItemFailure(id)
			}
		}
	}

	if len(job.FailedItems) > 0 {
		errStatus := workshop.ErrorPartialFailure
		job.ErrorStatus = &errStatus
	}
}

// transientFailurePattern describes conditions that can clear on their own. A
// generic failure is retried only when one of them appears in the output.
//
// The HTTP status codes need word boundaries: a plain substring search matched
// byte counts such as "progress: 93.11 (5049971015 / 5423767960)" and turned a
// deterministic failure into another full verify of the whole install.
var transientFailurePattern = regexp.MustCompile(`(?i)\b(?:502|503|504)\b|network|connection closed|connection reset|service unavailable|temporarily unavailable|try again later|timed out|timeout|rate limit|too many requests`)

func hasTransientFailureMarker(output string) bool {
	return transientFailurePattern.MatchString(output)
}

func (e *Executor) isRetriable(status *workshop.ErrorStatus, output string) bool {
	if status == nil {
		return true
	}

	switch *status {
	case workshop.ErrorWrongAuth, workshop.ErrorIO, workshop.ErrorNoMatch, workshop.ErrorNoSubscription:
		return false
	case workshop.ErrorRateLimit, workshop.ErrorTimeout, workshop.ErrorPartialFailure:
		return true
	case workshop.ErrorGeneric:
		// Ten attempts with backoff (~4 minutes) on a deterministic error only
		// delays the report the operator needs.
		return hasTransientFailureMarker(output)
	default:
		return false
	}
}
