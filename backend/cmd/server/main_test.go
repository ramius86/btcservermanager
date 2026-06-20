package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestRun(t *testing.T) {
	// Set up temporary environment
	tempDir := t.TempDir()
	os.Setenv("STORAGE_PATH", tempDir)
	os.Setenv("TEST_MODE", "true")

	defer func() {
		os.Unsetenv("STORAGE_PATH")
		os.Unsetenv("TEST_MODE")
	}()

	// Ensure directories needed by run() exist
	dataDir := filepath.Join(tempDir, "data")
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		t.Fatalf("failed to create temp data dir: %v", err)
	}

	// Test run function
	err := run()
	if err != nil {
		t.Errorf("run() failed: %v", err)
	}
}
