package server

import (
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
)

func TestLogFile_GetLastLines_InvalidOrEmpty(t *testing.T) {
	tempDir := t.TempDir()
	logPath := filepath.Join(tempDir, "test.log")

	// 1. n <= 0
	lf := NewLogFile(logPath)
	res, err := lf.GetLastLines(0)
	if err != nil || res != "" {
		t.Errorf("expected empty string and no error for n=0, got %q, %v", res, err)
	}

	// 2. File does not exist
	res, err = lf.GetLastLines(10)
	if err != nil || res != "" {
		t.Errorf("expected empty string and no error for non-existent file, got %q, %v", res, err)
	}

	// 3. File is empty
	err = os.WriteFile(logPath, []byte(""), 0o600)
	if err != nil {
		t.Fatalf("failed to write empty file: %v", err)
	}
	res, err = lf.GetLastLines(10)
	if err != nil || res != "" {
		t.Errorf("expected empty string and no error for empty file, got %q, %v", res, err)
	}
}

func TestLogFile_GetLastLines_SmallFile(t *testing.T) {
	tempDir := t.TempDir()
	logPath := filepath.Join(tempDir, "test.log")
	lf := NewLogFile(logPath)

	lines := []string{"line1", "line2", "line3"}
	err := os.WriteFile(logPath, []byte(strings.Join(lines, "\n")+"\n"), 0o600)
	if err != nil {
		t.Fatalf("failed to write small file: %v", err)
	}
	res, err := lf.GetLastLines(5)
	if err != nil {
		t.Errorf("GetLastLines failed for small file: %v", err)
	}
	expectedSmall := "line1\nline2\nline3"
	if res != expectedSmall {
		t.Errorf("expected %q, got %q", expectedSmall, res)
	}
}

func TestLogFile_GetLastLines_LargeFile(t *testing.T) {
	tempDir := t.TempDir()
	logPath := filepath.Join(tempDir, "test.log")
	lf := NewLogFile(logPath)

	largeLines := make([]string, 100)
	for i := range 100 {
		largeLines[i] = "line " + strconv.Itoa(i)
	}
	err := os.WriteFile(logPath, []byte(strings.Join(largeLines, "\n")), 0o600)
	if err != nil {
		t.Fatalf("failed to write large file: %v", err)
	}
	res, err := lf.GetLastLines(5)
	if err != nil {
		t.Errorf("GetLastLines failed for large file: %v", err)
	}
	splitRes := strings.Split(res, "\n")
	if len(splitRes) != 5 {
		t.Errorf("expected 5 lines, got %d: %q", len(splitRes), res)
	}
	expectedLastLine := largeLines[99]
	if splitRes[4] != expectedLastLine {
		t.Errorf("expected last line to be %q, got %q", expectedLastLine, splitRes[4])
	}
}

func TestLogFile_GetLastLines_DirectoryError(t *testing.T) {
	if os.PathSeparator == '/' {
		tempDir := t.TempDir()
		dirLf := NewLogFile(tempDir)
		_, err := dirLf.GetLastLines(5)
		if err == nil {
			t.Error("expected error when reading a directory as a file, got nil")
		}
	}
}
