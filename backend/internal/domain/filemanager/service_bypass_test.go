package filemanager

import (
	"os"
	"path/filepath"
	"testing"
)

func TestPathTraversalBypass(t *testing.T) {
	tempDir := t.TempDir()
	storage := filepath.Join(tempDir, "storage")
	outside := filepath.Join(tempDir, "outside")

	os.MkdirAll(storage, 0o755)
	os.MkdirAll(outside, 0o755)

	// create symlink pointing outside
	symlinkPath := filepath.Join(storage, "link")
	if err := os.Symlink(outside, symlinkPath); err != nil {
		t.Skipf("Failed to create symlink (needs admin/dev mode on Windows?): %v", err)
	}

	svc := NewService(storage)

	// Create inside the symlink directly:
	// /storage/link/newfile.txt
	// Dir is /storage/link which resolves to /outside
	// So EvalSymlinks(dir) works and err == nil, catching the traversal
	err := svc.Create("link/newfile.txt", false)
	if err == nil {
		t.Errorf("expected error when creating directly in symlink, got nil")
	} else {
		t.Logf("correctly caught direct: %v", err)
	}

	// But what about deeper?
	// /storage/link/newdir/newfile.txt
	// Dir is /storage/link/newdir which doesn't exist
	// So EvalSymlinks(dir) returns IsNotExist
	// The check is skipped!
	err = svc.Create("link/newdir/newfile.txt", false)
	if err == nil {
		t.Errorf("VULNERABILITY: successfully bypassed path traversal check for deeper nested file in symlink!")

		// Check if it actually created outside
		if _, err := os.Stat(filepath.Join(outside, "newdir", "newfile.txt")); err == nil {
			t.Logf("Successfully wrote to outside directory!")
		}
	} else {
		t.Logf("correctly caught deep: %v", err)
	}
}
