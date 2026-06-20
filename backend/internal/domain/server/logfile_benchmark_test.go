package server

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func BenchmarkGetLinesFromEnd(b *testing.B) {
	// Create a temporary 10MB dummy log file
	tmpDir := b.TempDir()
	logPath := filepath.Join(tmpDir, "dummy_server.log")

	file, err := os.Create(logPath)
	if err != nil {
		b.Fatalf("failed to create temp log file: %v", err)
	}

	// Write 10MB of data (around 100,000 lines of 100 bytes each)
	line := "2026-06-20 18:24:00 [INFO] " + strings.Repeat("A", 70) + "\n"
	for i := 0; i < 100000; i++ {
		_, err := file.WriteString(line)
		if err != nil {
			b.Fatalf("failed to write to temp log file: %v", err)
		}
	}
	file.Close()

	logFile := NewLogFile(logPath)

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		// Try to read the last 500 lines
		_, err := logFile.GetLinesFromEnd(0, 500)
		if err != nil {
			b.Fatalf("GetLinesFromEnd failed: %v", err)
		}
	}
}
