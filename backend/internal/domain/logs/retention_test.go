package logs

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestLogManager_CleanLogs(t *testing.T) {
	// Create a temporary directory for logs
	tmpDir, err := os.MkdirTemp("", "logtest")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	m := NewLogManager(tmpDir)

	// Helper to create a log file
	createLog := func(name string, ageDays, sizeBytes int) string {
		path := filepath.Join(tmpDir, name)

		content := make([]byte, sizeBytes)
		for i := range content {
			content[i] = 'A'
		}

		err := os.WriteFile(path, content, 0o644)
		if err != nil {
			t.Fatal(err)
		}

		if ageDays > 0 {
			oldTime := time.Now().AddDate(0, 0, -ageDays).Add(-time.Hour)
			os.Chtimes(path, oldTime, oldTime)
		}

		return path
	}

	t.Run("Age-based cleanup", func(t *testing.T) {
		createLog("old.log", 10, 100)
		createLog("new.log", 0, 100)

		err := m.CleanLogs(t.Context(), 5, 0)
		if err != nil {
			t.Fatal(err)
		}

		if _, err := os.Stat(filepath.Join(tmpDir, "old.log")); !os.IsNotExist(err) {
			t.Errorf("Expected old.log to be deleted")
		}

		if _, err := os.Stat(filepath.Join(tmpDir, "new.log")); err != nil {
			t.Errorf("Expected new.log to exist")
		}
	})

	t.Run("Size-based cleanup", func(t *testing.T) {
		// Reset dir
		os.RemoveAll(tmpDir)
		os.MkdirAll(tmpDir, 0o755)

		// Create 3 files of 1MB each
		createLog("file1.log", 3, 1024*1024) // Oldest
		createLog("file2.log", 2, 1024*1024)
		createLog("file3.log", 1, 1024*1024) // Newest

		// Limit to 2MB total
		err := m.CleanLogs(t.Context(), 10, 2)
		if err != nil {
			t.Fatal(err)
		}

		if _, err := os.Stat(filepath.Join(tmpDir, "file1.log")); !os.IsNotExist(err) {
			t.Errorf("Expected file1.log (oldest) to be deleted")
		}

		if _, err := os.Stat(filepath.Join(tmpDir, "file2.log")); err != nil {
			t.Errorf("Expected file2.log to exist")
		}

		if _, err := os.Stat(filepath.Join(tmpDir, "file3.log")); err != nil {
			t.Errorf("Expected file3.log to exist")
		}
	})

	t.Run("Ignore non-log files", func(t *testing.T) {
		os.RemoveAll(tmpDir)
		os.MkdirAll(tmpDir, 0o755)

		path := filepath.Join(tmpDir, "important.txt")
		os.WriteFile(path, []byte("don't delete me"), 0o644)

		oldTime := time.Now().AddDate(0, 0, -10)
		os.Chtimes(path, oldTime, oldTime)

		err := m.CleanLogs(t.Context(), 5, 0)
		if err != nil {
			t.Fatal(err)
		}

		if _, err := os.Stat(path); err != nil {
			t.Errorf("Expected important.txt to exist")
		}
	})
}
