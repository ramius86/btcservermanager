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
	successAppRegex     = regexp.MustCompile(`(?i)success! app '\d+' fully installed`)

	// Per-item error patterns:
	//   "ERROR! Download item 583496184 failed (Failure)."
	//   "ERROR! Timeout downloading item 1087215803"
	errorModDownloadRegex = regexp.MustCompile(`(?i)error!\s+download item (\d+) failed`)
	errorModTimeoutRegex  = regexp.MustCompile(`(?i)error!\s+timeout downloading item (\d+)`)
)

func (e *Executor) processOutput(r io.Reader, job *Job, logPath string) string {
	var fullOutput strings.Builder

	scanner := bufio.NewScanner(r)

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

	if e.parseSelfUpdateOrVerify(line, lineLower, job) {
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

func (e *Executor) parseSelfUpdateOrVerify(line, lineLower string, job *Job) bool {
	if strings.Contains(lineLower, "checking for available updates") || strings.Contains(lineLower, "verifying installation") {
		if job.RelatedServer != "" {
			info := ItemInfo{
				ItemID:   server.ServerIDs[job.RelatedServer],
				Status:   StatusVerifying,
				Progress: 0.0,
			}
			e.itemInfo.Store(serverPrefix+string(job.RelatedServer), info)
			e.emitProgress(info)
		}
		return true
	}

	if matches := selfUpdateRegex.FindStringSubmatch(line); len(matches) >= 4 {
		if p, err := strconv.ParseFloat(matches[1], 64); err == nil {
			info := ItemInfo{
				Status:   StatusDownloading,
				Progress: p,
			}
			if job.RelatedServer != "" {
				info.ItemID = server.ServerIDs[job.RelatedServer]
				e.itemInfo.Store(serverPrefix+string(job.RelatedServer), info)
			}
			e.emitProgress(info)
		}
		return true
	}
	return false
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

	// For non-mod jobs (server installs, updates), keep existing coarse-grained logic
	cleanOut := stripANSI(output)
	isSuccess := strings.Contains(cleanOut, "Success!") || strings.Contains(cleanOut, "up to date") ||
		strings.Contains(cleanOut, "fully installed") || strings.Contains(cleanOut, "already up to date")
	isAuthOk := strings.Contains(cleanOut, "Waiting for user info...") && strings.Contains(cleanOut, "OK")

	if isSuccess || isAuthOk {
		return
	}

	hasErrorMarker := strings.Contains(cleanOut, "Error") || strings.Contains(cleanOut, "FAILED") || strings.Contains(cleanOut, "timed out")
	if hasErrorMarker {
		errStatus := parseJobErrorCode(cleanOut)
		job.ErrorStatus = &errStatus
	}
}

func parseJobErrorCode(cleanOut string) workshop.ErrorStatus {
	switch {
	case strings.Contains(cleanOut, "Invalid Password") || strings.Contains(cleanOut, "Login Failed"):
		return workshop.ErrorWrongAuth
	case strings.Contains(cleanOut, "Disk space"):
		return workshop.ErrorIO
	case strings.Contains(cleanOut, "Rate Limit Exceeded") || strings.Contains(cleanOut, "Too Many Requests"):
		return workshop.ErrorRateLimit
	case strings.Contains(cleanOut, "timed out") || strings.Contains(cleanOut, "Timeout"):
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
		// Check for specific substrings that might be retriable but marked as generic
		lowerOutput := strings.ToLower(output)
		if strings.Contains(lowerOutput, "connection closed") ||
			strings.Contains(lowerOutput, "service unavailable") ||
			strings.Contains(lowerOutput, "try again later") {
			return true
		}

		return true // Default to retrying generic errors
	default:
		return true
	}
}
