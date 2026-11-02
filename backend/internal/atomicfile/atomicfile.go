// Package atomicfile replaces files without ever exposing partially written
// content: data goes to a temporary file in the destination directory, is
// flushed to disk, and is then renamed over the target. A crash or a failed
// write therefore leaves either the old file or the new one, never a truncated
// config that stops a game server from starting.
package atomicfile

import (
	"fmt"
	"os"
	"path/filepath"
)

// WriteFile atomically replaces path with data.
func WriteFile(path string, data []byte, perm os.FileMode) error {
	return WriteFileFunc(path, perm, func(f *os.File) error {
		_, err := f.Write(data)
		return err
	})
}

// WriteFileFunc is WriteFile for content produced by fn, so callers can stream
// into the temporary file instead of buffering it. When fn fails the
// destination is left untouched and the temporary file is removed.
func WriteFileFunc(path string, perm os.FileMode, fn func(*os.File) error) (err error) {
	dir := filepath.Dir(path)

	tmp, err := os.CreateTemp(dir, "."+filepath.Base(path)+".tmp-*")
	if err != nil {
		return fmt.Errorf("create temp file for %s: %w", path, err)
	}
	tmpName := tmp.Name()

	defer func() {
		if err == nil {
			return
		}
		_ = tmp.Close()
		_ = os.Remove(tmpName)
	}()

	if err = fn(tmp); err != nil {
		return fmt.Errorf("write %s: %w", path, err)
	}
	if err = tmp.Sync(); err != nil {
		return fmt.Errorf("sync %s: %w", path, err)
	}
	if err = tmp.Close(); err != nil {
		return fmt.Errorf("close %s: %w", path, err)
	}
	if err = os.Chmod(tmpName, perm); err != nil {
		return fmt.Errorf("chmod %s: %w", path, err)
	}
	if err = os.Rename(tmpName, path); err != nil {
		return fmt.Errorf("replace %s: %w", path, err)
	}

	return nil
}
