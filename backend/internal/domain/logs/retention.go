package logs

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"
)

type LogManager struct {
	logsDir string
}

func NewLogManager(logsDir string) *LogManager {
	return &LogManager{logsDir: logsDir}
}

type fileInfo struct {
	path string
	size int64
	time time.Time
}

func (m *LogManager) CleanLogs(ctx context.Context, maxDays, maxSizeMB int) error {
	log.Printf("Running log cleanup (MaxDays: %d, MaxSizeMB: %d)", maxDays, maxSizeMB)

	threshold := time.Now().AddDate(0, 0, -maxDays)

	files, err := m.walkAndCleanAge(ctx, threshold, maxDays)
	if err != nil {
		return err
	}

	if maxSizeMB > 0 {
		return m.cleanSizeLimit(ctx, files, maxSizeMB)
	}

	return nil
}

func (m *LogManager) walkAndCleanAge(ctx context.Context, threshold time.Time, maxDays int) ([]fileInfo, error) {
	var files []fileInfo

	err := filepath.WalkDir(m.logsDir, func(path string, d os.DirEntry, err error) error {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		if err != nil {
			return err
		}

		if d.IsDir() || !strings.HasSuffix(d.Name(), ".log") {
			return nil
		}

		info, err := d.Info()
		if err != nil {
			return err
		}

		if maxDays > 0 && info.ModTime().Before(threshold) {
			if err := os.Remove(path); err == nil {
				log.Printf("Deleted old log file (age): %s", path)
				return nil
			}
		}

		files = append(files, fileInfo{
			path: path,
			size: info.Size(),
			time: info.ModTime(),
		})

		return nil
	})

	return files, err
}

func (m *LogManager) cleanSizeLimit(ctx context.Context, files []fileInfo, maxSizeMB int) error {
	var totalSize int64
	for _, f := range files {
		totalSize += f.size
	}

	maxSizeBytes := int64(maxSizeMB) * 1024 * 1024
	if totalSize <= maxSizeBytes {
		return nil
	}

	log.Printf("Log directory size (%d MB) exceeds limit (%d MB). Cleaning up...", totalSize/(1024*1024), maxSizeMB)

	// Sort by time (oldest first)
	slices.SortFunc(files, func(a, b fileInfo) int {
		return a.time.Compare(b.time)
	})

	for _, f := range files {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		if totalSize <= maxSizeBytes {
			break
		}

		if err := os.Remove(f.path); err == nil {
			log.Printf("Deleted old log file (size): %s", f.path)
			totalSize -= f.size
		}
	}

	return nil
}
