package filemanager

import (
	"archive/zip"
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func setupTestStorage(t *testing.T) (string, *Service) {
	t.Helper()
	root := t.TempDir()

	// Create directories
	dirs := []string{
		"servers/ARMA3",
		"mods",
		"logs",
		"data",
	}
	for _, d := range dirs {
		if err := os.MkdirAll(filepath.Join(root, d), 0o755); err != nil {
			t.Fatalf("failed to create dir %s: %v", d, err)
		}
	}

	// Create test files
	files := map[string]string{
		"servers/ARMA3/server.cfg": "hostname = \"BTC Server\";",
		"data/btc.db":              "sqlite database content",
		"logs/arma3.log":           "server started successfully",
		".env":                     "SECRET_KEY=supersecret",
		".env.local":               "DEBUG=true",
		"servers/ARMA3/.env":       "NESTED_SECRET=123",
	}
	for p, content := range files {
		fullPath := filepath.Join(root, filepath.FromSlash(p))
		if err := os.WriteFile(fullPath, []byte(content), 0o644); err != nil {
			t.Fatalf("failed to write test file %s: %v", p, err)
		}
	}

	svc := NewService(root)
	return root, svc
}

func TestResolvePath_PathTraversal(t *testing.T) {
	_, svc := setupTestStorage(t)

	traversals := []string{
		"../outside.txt",
		"../../etc/passwd",
		"servers/../../outside.txt",
		"servers/../../../root",
	}

	for _, path := range traversals {
		_, _, _, err := svc.ResolvePath(path)
		if !errors.Is(err, ErrPathTraversal) {
			t.Errorf("expected ErrPathTraversal for path %s, got %v", path, err)
		}
	}
}

func TestResolvePath_HiddenEnvFiles(t *testing.T) {
	_, svc := setupTestStorage(t)

	envPaths := []string{
		".env",
		".env.local",
		".env.production",
		"servers/ARMA3/.env",
		"nested/subfolder/.env",
	}

	for _, path := range envPaths {
		_, _, _, err := svc.ResolvePath(path)
		if !errors.Is(err, ErrHiddenFile) {
			t.Errorf("expected ErrHiddenFile for path %s, got %v", path, err)
		}
	}
}

func TestList_FiltersEnvFiles(t *testing.T) {
	_, svc := setupTestStorage(t)

	// Test root list
	items, err := svc.List("")
	if err != nil {
		t.Fatalf("unexpected error listing root: %v", err)
	}

	for _, item := range items {
		if strings.HasPrefix(item.Name, ".env") {
			t.Errorf("found .env file in root listing: %s", item.Name)
		}
	}

	// Test subfolder list
	subItems, err := svc.List("servers/ARMA3")
	if err != nil {
		t.Fatalf("unexpected error listing servers/ARMA3: %v", err)
	}

	for _, item := range subItems {
		if strings.HasPrefix(item.Name, ".env") {
			t.Errorf("found .env file in subfolder listing: %s", item.Name)
		}
	}
}

func TestDataDirectory_ReadOnlyEnforcement(t *testing.T) {
	_, svc := setupTestStorage(t)

	// Reading /data is allowed
	data, err := svc.ReadFile("data/btc.db")
	if err != nil {
		t.Fatalf("failed to read from /data: %v", err)
	}
	if string(data) != "sqlite database content" {
		t.Errorf("expected data content match, got %s", string(data))
	}

	// Listing /data marks entries as isReadOnly
	items, err := svc.List("data")
	if err != nil {
		t.Fatalf("failed to list /data: %v", err)
	}
	if len(items) == 0 {
		t.Fatal("expected at least one item in /data")
	}
	for _, item := range items {
		if !item.IsReadOnly {
			t.Errorf("expected item %s in /data to be marked isReadOnly=true", item.Name)
		}
	}

	// Writing inside /data is blocked
	if err := svc.WriteFile("data/test.txt", []byte("bad")); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when writing in /data, got %v", err)
	}

	// Creating file inside /data is blocked
	if err := svc.Create("data/new.txt", false); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when creating file in /data, got %v", err)
	}

	// Creating folder inside /data is blocked
	if err := svc.Create("data/newfolder", true); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when creating folder in /data, got %v", err)
	}

	// Deleting inside /data is blocked
	if err := svc.Delete("data/btc.db"); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when deleting file in /data, got %v", err)
	}

	// Deleting /data folder itself is blocked
	if err := svc.Delete("data"); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when deleting /data folder, got %v", err)
	}

	// Renaming inside /data is blocked
	if err := svc.Rename("data/btc.db", "data/btc_backup.db"); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when renaming inside /data, got %v", err)
	}

	// Uploading into /data is blocked
	if err := svc.UploadFile("data", "upload.txt", strings.NewReader("content")); !errors.Is(err, ErrReadOnly) {
		t.Errorf("expected ErrReadOnly when uploading into /data, got %v", err)
	}
}

func TestFileCRUD_Operations(t *testing.T) {
	_, svc := setupTestStorage(t)

	// Create directory
	if err := svc.Create("servers/ARMA3/userconfig", true); err != nil {
		t.Fatalf("failed to create directory: %v", err)
	}

	// Create file
	if err := svc.Create("servers/ARMA3/userconfig/cba_settings.sqf", false); err != nil {
		t.Fatalf("failed to create file: %v", err)
	}

	// Write content
	expectedContent := "cba_settings_test = true;"
	if err := svc.WriteFile("servers/ARMA3/userconfig/cba_settings.sqf", []byte(expectedContent)); err != nil {
		t.Fatalf("failed to write content: %v", err)
	}

	// Read content
	readContent, err := svc.ReadFile("servers/ARMA3/userconfig/cba_settings.sqf")
	if err != nil {
		t.Fatalf("failed to read content: %v", err)
	}
	if string(readContent) != expectedContent {
		t.Errorf("expected %s, got %s", expectedContent, string(readContent))
	}

	// Rename file
	if err := svc.Rename("servers/ARMA3/userconfig/cba_settings.sqf", "servers/ARMA3/userconfig/cba_settings_renamed.sqf"); err != nil {
		t.Fatalf("failed to rename file: %v", err)
	}

	// Delete file
	if err := svc.Delete("servers/ARMA3/userconfig/cba_settings_renamed.sqf"); err != nil {
		t.Fatalf("failed to delete file: %v", err)
	}

	// Delete folder
	if err := svc.Delete("servers/ARMA3/userconfig"); err != nil {
		t.Fatalf("failed to delete folder: %v", err)
	}
}

func TestZip_CompressAndExtract(t *testing.T) {
	_, svc := setupTestStorage(t)

	// Compress servers/ARMA3 to an archive
	archiveSubpath := "servers/backup.zip"
	if err := svc.CompressZip([]string{"servers/ARMA3"}, archiveSubpath); err != nil {
		t.Fatalf("failed to compress zip: %v", err)
	}

	// Verify zip exists
	rZip, err := svc.ReadFile(archiveSubpath)
	if err != nil {
		t.Fatalf("failed to read created zip: %v", err)
	}
	if len(rZip) == 0 {
		t.Fatal("created zip is empty")
	}

	// Verify .env was not included in the zip
	r, err := zip.NewReader(bytes.NewReader(rZip), int64(len(rZip)))
	if err != nil {
		t.Fatalf("failed to inspect zip: %v", err)
	}
	for _, f := range r.File {
		if strings.Contains(f.Name, ".env") {
			t.Errorf("zip contains hidden .env file: %s", f.Name)
		}
	}

	// Extract to a new directory
	destSubpath := "extracted_backup"
	if err := svc.ExtractZip(archiveSubpath, destSubpath); err != nil {
		t.Fatalf("failed to extract zip: %v", err)
	}

	// Verify extracted file
	extractedContent, err := svc.ReadFile("extracted_backup/ARMA3/server.cfg")
	if err != nil {
		t.Fatalf("failed to read extracted file: %v", err)
	}
	if string(extractedContent) != "hostname = \"BTC Server\";" {
		t.Errorf("extracted content mismatch: %s", string(extractedContent))
	}
}
