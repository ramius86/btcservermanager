package api

import (
	"btcservermanager/internal/domain/server"
	"bufio"
	"cmp"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

const (
	queryAll                    = "all"
	statsLogSuffix              = ".stats.log"
	errInvalidLogFilenameFormat = "invalid log filename format"
)

func (r *Router) handleGetServerLogContent(w http.ResponseWriter, req *http.Request) {
	filename := filepath.Base(chi.URLParam(req, "filename"))
	if err := r.validateLogFilename(filename); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	linesStr := req.URL.Query().Get("lines")
	offsetStr := req.URL.Query().Get("offset")
	lines := 1000
	offset := 0

	if l, err := strconv.Atoi(linesStr); err == nil {
		lines = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil {
		offset = o
	}

	// We assume log files are in the base log directory
	logPath := filepath.Join(r.config.LogsDirectory, filename)
	logFile := server.NewLogFile(logPath)

	content, err := logFile.GetLinesFromEnd(offset, lines)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]string{"content": content})
}

func (r *Router) handleListServerLogs(w http.ResponseWriter, req *http.Request) {
	pattern, status, err := r.buildLogGlobPattern(req.Context(), chi.URLParam(req, "id"))
	if err != nil {
		http.Error(w, err.Error(), status)
		return
	}

	matches, _ := filepath.Glob(pattern)

	filenames := []string{}

	for _, m := range matches {
		if !strings.HasSuffix(m, statsLogSuffix) {
			filenames = append(filenames, filepath.Base(m))
		}
	}

	// Sort descending (latest first)
	slices.SortFunc(filenames, func(a, b string) int {
		return cmp.Compare(b, a)
	})

	r.json(w, filenames)
}

func (r *Router) buildLogGlobPattern(ctx context.Context, idStr string) (string, int, error) {
	if idStr == queryAll || idStr == "" {
		return filepath.Join(r.config.LogsDirectory, "*.log"), 0, nil
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return "", http.StatusBadRequest, errors.New("invalid server ID")
	}

	srvType, err := r.getServerType(ctx, id)
	if err != nil {
		if strings.Contains(err.Error(), "Unsupported") {
			return "", http.StatusBadRequest, errors.New("unsupported server type for logs")
		}
		return "", http.StatusNotFound, errors.New("server not found")
	}

	return filepath.Join(r.config.LogsDirectory, fmt.Sprintf("%s_%d_*.log", srvType, id)), 0, nil
}

func (r *Router) getServerType(ctx context.Context, id int64) (server.Type, error) {
	srv, err := r.serverService.GetServer(ctx, id)
	if err != nil {
		return "", err
	}
	switch v := srv.(type) {
	case *server.Arma3Server:
		return v.Type, nil
	case *server.DayZServer:
		return v.Type, nil
	case *server.ReforgerServer:
		return v.Type, nil
	default:
		return "", errors.New("unsupported server type for stats")
	}
}

func (r *Router) resolveStatsFilename(id int64, srvType server.Type, queryFilename string) string {
	filename := queryFilename
	info := r.serverService.GetInstanceInfo(id)
	if info != nil && info.CurrentLogFile != "" {
		filename = info.CurrentLogFile
	}
	if filename == "" {
		filename = r.findLatestServerLog(id, srvType)
	}
	return filename
}

func (r *Router) validateStatsFilename(filename string, id int64, srvType server.Type) (int, error) {
	filename = filepath.Base(filename)
	if err := r.validateLogFilename(filename); err != nil {
		return http.StatusForbidden, err
	}
	fType, rest, ok := extractServerTypeFromFilename(filename)
	if !ok {
		return http.StatusBadRequest, errors.New(errInvalidLogFilenameFormat)
	}
	parts := strings.Split(rest, "_")
	if len(parts) < 2 {
		return http.StatusBadRequest, errors.New(errInvalidLogFilenameFormat)
	}
	fID, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || fType != srvType || fID != id {
		return http.StatusForbidden, errors.New("access denied: log file does not match the requested server")
	}
	return 0, nil
}

func parseReforgerStats(f io.Reader) []server.ReforgerStatDto {
	const maxStats = 2000

	// Phase 1 — append-grow. Avoids the unconditional 160 kB pre-allocation of
	// the old make([]ReforgerStatDto, 2000) when the file has fewer entries.
	// Initial capacity of 256 covers most real sessions without reallocs
	// (256 entries × 5 s interval ≈ 21 min of history).
	stats := make([]server.ReforgerStatDto, 0, 256)
	// Phase 2 — ring buffer. Only allocated when count > maxStats.
	var ring []server.ReforgerStatDto
	count := 0

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		raw := scanner.Text()
		if strings.Contains(raw, "FPS:") && strings.Contains(raw, "Mem:") {
			// Lines are stored as "2006-01-02 15:04:05: <content>"
			// Extract timestamp (first 19 chars) and the content after ": "
			timestamp := ""
			line := raw
			if len(raw) > 21 && raw[19:21] == ": " {
				timestamp = raw[:19]
				line = raw[21:]
			}
			if stat := server.ParseReforgerStatLine(timestamp, line); stat != nil {
				count++
				if count <= maxStats {
					// Common path: simple append.
					stats = append(stats, *stat)
				} else {
					// Overflow path: promote to ring buffer once, then overwrite in-place.
					if ring == nil {
						ring = make([]server.ReforgerStatDto, maxStats)
						copy(ring, stats)
						stats = nil // release the append-grown slice
					}
					ring[(count-1)%maxStats] = *stat
				}
			}
		}
	}
	if err := scanner.Err(); err != nil {
		log.Printf("Error scanning Reforger stats: %v", err)
	}

	if count == 0 {
		return []server.ReforgerStatDto{}
	}

	if ring != nil {
		// Unwind ring buffer into chronological order.
		result := make([]server.ReforgerStatDto, maxStats)
		start := count % maxStats
		copy(result, ring[start:])
		copy(result[maxStats-start:], ring[:start])
		return result
	}

	// Common case: stats is already the exact slice we need.
	return stats
}

func (r *Router) handleGetServerStats(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	idStr := chi.URLParam(req, "id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid server ID", http.StatusBadRequest)
		return
	}

	srvType, err := r.getServerType(ctx, id)
	if err != nil {
		if err.Error() == "Unsupported server type for stats" {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else {
			http.Error(w, "Server not found", http.StatusNotFound)
		}
		return
	}

	filename := r.resolveStatsFilename(id, srvType, req.URL.Query().Get("filename"))
	if filename == "" {
		http.Error(w, "Log filename required or could not be discovered", http.StatusBadRequest)
		return
	}

	if statusCode, err := r.validateStatsFilename(filename, id, srvType); err != nil {
		http.Error(w, err.Error(), statusCode)
		return
	}

	logFilePath := filepath.Join(r.config.LogsDirectory, filepath.Base(filename))
	statsFilePath := strings.Replace(logFilePath, ".log", statsLogSuffix, 1)

	fileToRead := logFilePath
	if _, err := os.Stat(statsFilePath); err == nil {
		fileToRead = statsFilePath
	}

	f, err := os.Open(fileToRead)
	if err != nil {
		http.Error(w, "Stats file not found", http.StatusNotFound)
		return
	}
	defer f.Close()

	r.json(w, parseReforgerStats(f))
}

func (r *Router) handleListSteamCmdLogs(w http.ResponseWriter, req *http.Request) {
	logDir := filepath.Join(r.config.LogsDirectory, "steamcmd")

	files, err := os.ReadDir(logDir)
	if err != nil {
		r.json(w, []string{})
		return
	}

	filenames := []string{}

	for _, f := range files {
		name := f.Name()
		if strings.HasPrefix(name, "steamcmd_") && strings.HasSuffix(name, ".log") {
			filenames = append(filenames, name)
		}
	}

	r.json(w, filenames)
}

func (r *Router) handleGetSteamCmdLogContent(w http.ResponseWriter, req *http.Request) {
	filename := filepath.Base(chi.URLParam(req, "filename"))
	if err := r.validateLogFilename(filename); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	linesStr := req.URL.Query().Get("lines")
	offsetStr := req.URL.Query().Get("offset")
	lines := 1000
	offset := 0

	if l, err := strconv.Atoi(linesStr); err == nil {
		lines = l
	}
	if o, err := strconv.Atoi(offsetStr); err == nil {
		offset = o
	}

	logPath := filepath.Join(r.config.LogsDirectory, "steamcmd", filename)
	logFile := server.NewLogFile(logPath)

	content, err := logFile.GetLinesFromEnd(offset, lines)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]string{"content": content})
}

func (r *Router) handleDownloadLog(w http.ResponseWriter, req *http.Request) {
	filename := filepath.Base(chi.URLParam(req, "filename"))
	if err := r.validateLogFilename(filename); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	path := filepath.Join(r.config.LogsDirectory, filename)
	if strings.HasPrefix(filename, "steamcmd_") {
		path = filepath.Join(r.config.LogsDirectory, "steamcmd", filename)
	}

	w.Header().Set("Content-Disposition", "attachment; filename="+filename)
	w.Header().Set("Content-Type", "text/plain")
	http.ServeFile(w, req, path)
}

func (r *Router) handleDeleteLog(w http.ResponseWriter, req *http.Request) {
	filename := filepath.Base(chi.URLParam(req, "filename"))
	if err := r.validateLogFilename(filename); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	path := filepath.Join(r.config.LogsDirectory, filename)
	if strings.HasPrefix(filename, "steamcmd_") {
		path = filepath.Join(r.config.LogsDirectory, "steamcmd", filename)
	}

	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		http.Error(w, fmt.Sprintf("Failed to delete log: %v", err), http.StatusInternalServerError)
		return
	}

	// Also try to delete .stats.log if it exists (only if we're deleting a primary .log file)
	if strings.HasSuffix(filename, ".log") && !strings.HasSuffix(filename, statsLogSuffix) {
		statsPath := strings.Replace(path, ".log", statsLogSuffix, 1)
		_ = os.Remove(statsPath)
	}

	w.WriteHeader(http.StatusNoContent)
}

func deleteDirFiles(dir, pattern string) {
	files, err := filepath.Glob(filepath.Join(dir, pattern))
	if err != nil {
		log.Printf("[API] Failed to glob logs in %s: %v", dir, err)
		return
	}

	for _, f := range files {
		if !strings.HasSuffix(f, statsLogSuffix) {
			removeLogAndStats(f)
		}
	}

	// Final cleanup: delete any orphaned .stats.log files
	orphans, _ := filepath.Glob(filepath.Join(dir, "*"+statsLogSuffix))
	for _, f := range orphans {
		_ = os.Remove(f)
	}
}

func removeLogAndStats(f string) {
	if err := os.Remove(f); err != nil && !os.IsNotExist(err) {
		log.Printf("[API] Failed to remove log %s: %v", f, err)
	}

	if strings.HasSuffix(f, ".log") {
		statsFile := strings.Replace(f, ".log", statsLogSuffix, 1)
		if err := os.Remove(statsFile); err != nil && !os.IsNotExist(err) {
			log.Printf("[API] Failed to remove stats log %s: %v", statsFile, err)
		}
	}
}

func (r *Router) handleDeleteAllLogs(w http.ResponseWriter, req *http.Request) {
	logType := req.URL.Query().Get("type") // "server", "steamcmd", or "all"

	isSteamCmdDelete := logType == "steamcmd" || logType == queryAll
	if isSteamCmdDelete {
		deleteDirFiles(filepath.Join(r.config.LogsDirectory, "steamcmd"), "steamcmd_*.log")
	}

	isServerDelete := logType == "server" || logType == queryAll || logType == ""
	if isServerDelete {
		deleteDirFiles(r.config.LogsDirectory, "*.log")
	}

	w.WriteHeader(http.StatusNoContent)
}

// Helpers

func (r *Router) findLatestServerLog(id int64, srvType server.Type) string {
	pattern := filepath.Join(r.config.LogsDirectory, fmt.Sprintf("%s_%d_*.log", srvType, id))

	matches, _ := filepath.Glob(pattern)
	if len(matches) == 0 {
		return ""
	}

	// Filter out .stats.log
	filtered := []string{}

	for _, m := range matches {
		if !strings.HasSuffix(m, statsLogSuffix) {
			filtered = append(filtered, m)
		}
	}

	if len(filtered) == 0 {
		return ""
	}

	// Sort and pick latest (timestamps are sortable alphabetically)
	slices.Sort(filtered)

	return filepath.Base(filtered[len(filtered)-1])
}

func extractServerTypeFromFilename(filename string) (server.Type, string, bool) {
	knownTypes := []server.Type{
		server.TypeDayZExp,
		server.TypeDayZ,
		server.TypeArma3,
		server.TypeReforger,
	}
	for _, t := range knownTypes {
		prefix := string(t) + "_"
		if strings.HasPrefix(filename, prefix) {
			rest := strings.TrimPrefix(filename, prefix)
			return t, rest, true
		}
	}
	return "", "", false
}

func (r *Router) validateLogFilename(filename string) error {
	isReservedPath := filename == "." || filename == ".." || filename == "/" || filename == "\\" || filename == queryAll
	if isReservedPath {
		return errors.New("invalid filename")
	}

	if srvType, rest, ok := extractServerTypeFromFilename(filename); ok {
		parts := strings.Split(rest, "_")
		if len(parts) >= 2 {
			isSupportedType := srvType == server.TypeArma3 || srvType == server.TypeDayZ || srvType == server.TypeReforger || srvType == server.TypeDayZExp
			if !isSupportedType {
				return errors.New("unsupported server type in log filename")
			}

			_, err := strconv.ParseInt(parts[0], 10, 64)
			if err != nil {
				return errors.New("invalid server ID in log filename")
			}

			// Optional: we could log a warning if the server doesn't exist,
			// but we should still allow management of orphaned logs.
			return nil
		}
	} else if strings.HasPrefix(filename, "steamcmd_") {
		if !strings.HasSuffix(filename, ".log") {
			return errors.New("invalid steamcmd log filename format")
		}
		return nil
	}

	return errors.New(errInvalidLogFilenameFormat)
}
