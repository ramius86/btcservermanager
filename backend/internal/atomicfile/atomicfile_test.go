package atomicfile

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

func assertNoTempFiles(t *testing.T, dir string) {
	t.Helper()

	entries, err := os.ReadDir(dir)
	if err != nil {
		t.Fatalf("read dir: %v", err)
	}
	for _, entry := range entries {
		if strings.Contains(entry.Name(), ".tmp-") {
			t.Fatalf("temporary file left behind: %s", entry.Name())
		}
	}
}

func TestWriteFileReplacesContentAndMode(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ARMA3_1.cfg")

	if err := os.WriteFile(path, []byte("old"), 0o644); err != nil {
		t.Fatalf("seed file: %v", err)
	}

	if err := WriteFile(path, []byte("new"), 0o640); err != nil {
		t.Fatalf("write: %v", err)
	}

	got, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read back: %v", err)
	}
	if string(got) != "new" {
		t.Fatalf("expected new content, got %q", got)
	}

	info, err := os.Stat(path)
	if err != nil {
		t.Fatalf("stat: %v", err)
	}
	// Windows only models the read-only bit, so permission bits are not
	// observable there and asserting them would fail for reasons unrelated to
	// the write itself.
	if runtime.GOOS != "windows" && info.Mode().Perm() != 0o640 {
		t.Fatalf("expected mode 0640, got %v", info.Mode().Perm())
	}

	assertNoTempFiles(t, dir)
}

func TestWriteFileFuncFailureKeepsDestination(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ARMA3_1.cfg")

	if err := os.WriteFile(path, []byte("original"), 0o644); err != nil {
		t.Fatalf("seed file: %v", err)
	}

	boom := errors.New("boom")
	err := WriteFileFunc(path, 0o644, func(f *os.File) error {
		_, _ = f.Write([]byte("partial content"))
		return boom
	})
	if !errors.Is(err, boom) {
		t.Fatalf("expected boom, got %v", err)
	}

	got, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read back: %v", err)
	}
	if string(got) != "original" {
		t.Fatalf("destination was modified by a failed write: %q", got)
	}

	assertNoTempFiles(t, dir)
}

func TestWriteFileCreatesMissingFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "nested", "file.json")

	// The caller is responsible for the directory: a missing parent must fail
	// loudly instead of silently writing somewhere else.
	if err := WriteFile(path, []byte("x"), 0o644); err == nil {
		t.Fatal("expected error when the parent directory is missing")
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	if err := WriteFile(path, []byte("x"), 0o644); err != nil {
		t.Fatalf("write: %v", err)
	}

	assertNoTempFiles(t, filepath.Dir(path))
}
