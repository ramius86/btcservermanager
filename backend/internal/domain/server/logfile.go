package server

import (
	"io"
	"os"
	"strings"
)

type LogFile struct {
	path string
}

func NewLogFile(path string) *LogFile {
	return &LogFile{path: path}
}

func (l *LogFile) GetLastLines(n int) (string, error) {
	return l.GetLinesFromEnd(0, n)
}

const maxReadSeekSize = 32 * 1024 * 1024 // 32 MB max seek buffer to prevent container OOM

func (l *LogFile) GetLinesFromEnd(offset, limit int) (string, error) {
	content, _, err := l.GetLinesFromEndWithStatus(offset, limit)
	return content, err
}

// GetLinesFromEndWithStatus is GetLinesFromEnd plus a truncation flag.
//
// The reader never buffers more than maxReadSeekSize, so a file whose requested
// lines fall outside that window returns fewer lines than asked. truncated=true
// means "there is more content, but it cannot be reached": callers must stop
// paging instead of silently presenting a partial log as the whole file.
func (l *LogFile) GetLinesFromEndWithStatus(offset, limit int) (string, bool, error) {
	if limit <= 0 {
		return "", false, nil
	}

	file, err := os.Open(l.path)
	if err != nil {
		if os.IsNotExist(err) {
			return "", false, nil
		}
		return "", false, err
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return "", false, err
	}

	filesize := stat.Size()
	if filesize == 0 {
		return "", false, nil
	}

	n := offset + limit
	readSize := int64(n * 250)
	if readSize > maxReadSeekSize {
		readSize = maxReadSeekSize
	}
	if readSize > filesize {
		readSize = filesize
	}

	for {
		startPos := filesize - readSize
		buf, err := readChunkAt(file, startPos, readSize)
		if err != nil {
			return "", false, err
		}

		lines := strings.Split(string(buf), "\n")

		if len(lines) > n {
			return formatLinesFromEnd(lines, offset, limit, startPos > 0), false, nil
		}
		if readSize >= filesize {
			return formatLinesFromEnd(lines, offset, limit, false), false, nil
		}
		if readSize >= maxReadSeekSize {
			return formatLinesFromEnd(lines, offset, limit, true), true, nil
		}

		readSize = doubleReadSize(readSize, filesize)
	}
}

func readChunkAt(file *os.File, startPos, readSize int64) ([]byte, error) {
	if _, err := file.Seek(startPos, io.SeekStart); err != nil {
		return nil, err
	}

	buf := make([]byte, readSize)
	n, err := io.ReadFull(file, buf)
	isRealError := err != nil && err != io.EOF && err != io.ErrUnexpectedEOF
	if isRealError {
		return nil, err
	}
	return buf[:n], nil
}

func formatLinesFromEnd(lines []string, offset, limit int, hasPrefix bool) string {
	n := offset + limit
	if len(lines) > n {
		if hasPrefix {
			lines = lines[1:] // Discard first partial line
		}

		if len(lines) > n {
			lines = lines[len(lines)-n:]
		}
	}

	// Remove trailing empty line if present
	if len(lines) > 0 && lines[len(lines)-1] == "" {
		lines = lines[:len(lines)-1]
	}

	lines = extractTargetSlice(lines, offset, limit)

	if len(lines) == 0 {
		return ""
	}

	return joinLines(lines)
}

func extractTargetSlice(lines []string, offset, limit int) []string {
	if offset > 0 {
		if len(lines) > offset {
			lines = lines[:len(lines)-offset]
		} else {
			return []string{}
		}
	}
	if len(lines) > limit {
		return lines[len(lines)-limit:]
	}
	return lines
}

func joinLines(lines []string) string {
	totalSize := len(lines) - 1 // newline separators
	for _, l := range lines {
		totalSize += len(l)
	}

	var sb strings.Builder
	sb.Grow(totalSize)
	for i, l := range lines {
		if i > 0 {
			sb.WriteByte('\n')
		}
		sb.WriteString(l)
	}
	return sb.String()
}

func doubleReadSize(current, maxSize int64) int64 {
	next := current * 2
	if next > maxReadSeekSize {
		next = maxReadSeekSize
	}
	if next > maxSize {
		return maxSize
	}
	return next
}
