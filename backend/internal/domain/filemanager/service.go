package filemanager

import (
	"archive/zip"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var (
	ErrPathTraversal = errors.New("invalid path: path traversal detected")
	ErrHiddenFile    = errors.New("access denied: file is hidden")
	ErrReadOnly      = errors.New("target directory or file is read-only")
	ErrFileTooLarge  = errors.New("file is too large to open in the web editor")
)

const (
	MaxEditableFileSize = 5 * 1024 * 1024 // 5 MB max for web text editor
	DataDirName         = "data"
)

type FileItem struct {
	Name       string    `json:"name"`
	Path       string    `json:"path"` // Relative to storage root, forward slashes
	IsDir      bool      `json:"isDir"`
	Size       int64     `json:"size"`
	ModTime    time.Time `json:"modTime"`
	IsReadOnly bool      `json:"isReadOnly"`
	Extension  string    `json:"extension"`
}

type Service struct {
	storageRoot string
}

func NewService(storageRoot string) *Service {
	abs, err := filepath.Abs(storageRoot)
	if err != nil {
		abs = filepath.Clean(storageRoot)
	}
	return &Service{storageRoot: abs}
}

// IsEnvName checks if a filename or path segment matches .env patterns.
func IsEnvName(name string) bool {
	lower := strings.ToLower(filepath.Base(name))
	return lower == ".env" || strings.HasPrefix(lower, ".env.") || strings.HasPrefix(lower, ".env")
}

// isPathInsideData checks if a cleaned relative path points to the /data directory or anything inside it.
func isPathInsideData(cleanRel string) bool {
	normalized := filepath.ToSlash(cleanRel)
	normalized = strings.TrimPrefix(normalized, "/")
	return normalized == DataDirName || strings.HasPrefix(normalized, DataDirName+"/")
}

// containsEnvSegment checks if any path segment contains an .env filename.
func containsEnvSegment(relPath string) bool {
	normalized := filepath.ToSlash(relPath)
	parts := strings.Split(normalized, "/")
	for _, part := range parts {
		if part != "" && IsEnvName(part) {
			return true
		}
	}
	return false
}

// ResolvePath sanitizes, resolves, and checks security rules for a relative path.
func (s *Service) ResolvePath(relPath string) (absPath, cleanRel string, isReadOnly bool, err error) {
	if containsEnvSegment(relPath) {
		return "", "", false, ErrHiddenFile
	}

	// Resolve absolute path and clean it
	absPath = filepath.Clean(filepath.Join(s.storageRoot, filepath.FromSlash(relPath)))

	// Path traversal check: must be inside storageRoot
	rel, err := filepath.Rel(s.storageRoot, absPath)
	if err != nil || strings.HasPrefix(rel, "..") || rel == ".." {
		return "", "", false, ErrPathTraversal
	}

	// Symlink resolution verification if file exists
	if fi, err := os.Lstat(absPath); err == nil && fi.Mode()&os.ModeSymlink != 0 {
		resolvedTarget, err := filepath.EvalSymlinks(absPath)
		if err == nil {
			relTarget, err := filepath.Rel(s.storageRoot, resolvedTarget)
			if err != nil || strings.HasPrefix(relTarget, "..") || relTarget == ".." {
				return "", "", false, ErrPathTraversal
			}
		}
	}

	cleanRel = filepath.ToSlash(rel)
	if cleanRel == "." {
		cleanRel = ""
	}

	isReadOnly = isPathInsideData(cleanRel)

	return absPath, cleanRel, isReadOnly, nil
}

// List returns the directory entries for the specified subpath.
func (s *Service) List(subpath string) ([]FileItem, error) {
	absPath, cleanRel, dirReadOnly, err := s.ResolvePath(subpath)
	if err != nil {
		return nil, err
	}

	entries, err := os.ReadDir(absPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory: %w", err)
	}

	items := make([]FileItem, 0, len(entries))
	for _, entry := range entries {
		name := entry.Name()
		if IsEnvName(name) {
			continue
		}

		entryRel := name
		if cleanRel != "" {
			entryRel = cleanRel + "/" + name
		}

		info, err := entry.Info()
		var size int64
		var modTime time.Time
		if err == nil {
			size = info.Size()
			modTime = info.ModTime()
		}

		isDir := entry.IsDir()
		itemReadOnly := dirReadOnly || isPathInsideData(entryRel)

		ext := ""
		if !isDir {
			ext = strings.ToLower(filepath.Ext(name))
		}

		items = append(items, FileItem{
			Name:       name,
			Path:       entryRel,
			IsDir:      isDir,
			Size:       size,
			ModTime:    modTime,
			IsReadOnly: itemReadOnly,
			Extension:  ext,
		})
	}

	return items, nil
}

// ReadFile reads the full contents of a text file within size limits.
func (s *Service) ReadFile(subpath string) ([]byte, error) {
	absPath, _, _, err := s.ResolvePath(subpath)
	if err != nil {
		return nil, err
	}

	fi, err := os.Stat(absPath)
	if err != nil {
		return nil, err
	}
	if fi.IsDir() {
		return nil, errors.New("cannot read a directory as a file")
	}
	if fi.Size() > MaxEditableFileSize {
		return nil, ErrFileTooLarge
	}

	return os.ReadFile(absPath)
}

// WriteFile writes content to a file. Blocked if target is in /data.
func (s *Service) WriteFile(subpath string, content []byte) error {
	absPath, _, isReadOnly, err := s.ResolvePath(subpath)
	if err != nil {
		return err
	}
	if isReadOnly {
		return ErrReadOnly
	}

	dir := filepath.Dir(absPath)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("failed to create parent directories: %w", err)
	}

	return os.WriteFile(absPath, content, 0o644)
}

// Create creates an empty file or directory. Blocked if in /data.
func (s *Service) Create(subpath string, isDir bool) error {
	absPath, cleanRel, isReadOnly, err := s.ResolvePath(subpath)
	if err != nil {
		return err
	}
	if isReadOnly || cleanRel == "" {
		return ErrReadOnly
	}

	if isDir {
		return os.MkdirAll(absPath, 0o755)
	}

	dir := filepath.Dir(absPath)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("failed to create parent directories: %w", err)
	}

	f, err := os.OpenFile(absPath, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	return f.Close()
}

// Delete removes a file or directory recursively. Blocked if in /data or if root.
func (s *Service) Delete(subpath string) error {
	absPath, cleanRel, isReadOnly, err := s.ResolvePath(subpath)
	if err != nil {
		return err
	}
	if isReadOnly || cleanRel == "" {
		return ErrReadOnly
	}

	return os.RemoveAll(absPath)
}

// Rename moves or renames a file or directory. Blocked if old or new path is in /data.
func (s *Service) Rename(oldPath, newPath string) error {
	oldAbs, oldRel, oldReadOnly, err := s.ResolvePath(oldPath)
	if err != nil {
		return err
	}
	if oldReadOnly || oldRel == "" {
		return ErrReadOnly
	}

	newAbs, newRel, newReadOnly, err := s.ResolvePath(newPath)
	if err != nil {
		return err
	}
	if newReadOnly || newRel == "" {
		return ErrReadOnly
	}

	dir := filepath.Dir(newAbs)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("failed to create destination directory: %w", err)
	}

	return os.Rename(oldAbs, newAbs)
}

// UploadFile saves a single uploaded file into target directory. Blocked if target is in /data.
func (s *Service) UploadFile(targetDir, filename string, src io.Reader) error {
	if IsEnvName(filename) {
		return ErrHiddenFile
	}

	destSubpath := filepath.ToSlash(filepath.Join(targetDir, filename))
	absPath, _, isReadOnly, err := s.ResolvePath(destSubpath)
	if err != nil {
		return err
	}
	if isReadOnly {
		return ErrReadOnly
	}

	dir := filepath.Dir(absPath)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	dst, err := os.Create(absPath)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return fmt.Errorf("failed to write uploaded file: %w", err)
	}

	return nil
}

// ExtractZip extracts a zip file into a target destination directory with Zip Slip protection.
func (s *Service) ExtractZip(zipSubpath, destDirSubpath string) error {
	zipAbs, _, _, err := s.ResolvePath(zipSubpath)
	if err != nil {
		return err
	}

	destAbs, _, destReadOnly, err := s.ResolvePath(destDirSubpath)
	if err != nil {
		return err
	}
	if destReadOnly {
		return ErrReadOnly
	}

	r, err := zip.OpenReader(zipAbs)
	if err != nil {
		return fmt.Errorf("failed to open zip file: %w", err)
	}
	defer r.Close()

	if err := os.MkdirAll(destAbs, 0o755); err != nil {
		return fmt.Errorf("failed to create destination directory: %w", err)
	}

	for _, f := range r.File {
		if containsEnvSegment(f.Name) {
			continue
		}

		cleanEntryName := filepath.Clean(f.Name)
		targetPath := filepath.Join(destAbs, cleanEntryName)

		// Zip Slip check: ensure targetPath is within destAbs
		rel, err := filepath.Rel(destAbs, targetPath)
		if err != nil || strings.HasPrefix(rel, "..") || rel == ".." {
			return fmt.Errorf("insecure zip path traversal detected in file: %s", f.Name)
		}

		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(targetPath, 0o755); err != nil {
				return fmt.Errorf("failed to create folder from zip: %w", err)
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return fmt.Errorf("failed to create parent folder: %w", err)
		}

		outFile, err := os.OpenFile(targetPath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return fmt.Errorf("failed to create unzipped file: %w", err)
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return fmt.Errorf("failed to open zip entry: %w", err)
		}

		_, err = io.Copy(outFile, rc)
		rc.Close()
		outFile.Close()
		if err != nil {
			return fmt.Errorf("failed to write unzipped file: %w", err)
		}
	}

	return nil
}

// CompressZip creates a zip file at destZipPath containing the specified source files/folders.
func (s *Service) CompressZip(sourceSubpaths []string, destZipSubpath string) error {
	destAbs, _, destReadOnly, err := s.ResolvePath(destZipSubpath)
	if err != nil {
		return err
	}
	if destReadOnly {
		return ErrReadOnly
	}

	if err := os.MkdirAll(filepath.Dir(destAbs), 0o755); err != nil {
		return fmt.Errorf("failed to create destination directory: %w", err)
	}

	zipFile, err := os.Create(destAbs)
	if err != nil {
		return fmt.Errorf("failed to create zip file: %w", err)
	}
	defer zipFile.Close()

	return s.StreamZip(zipFile, sourceSubpaths)
}

// StreamZip writes a zip archive of the given source subpaths directly to the given writer.
func (s *Service) StreamZip(w io.Writer, sourceSubpaths []string) error {
	zw := zip.NewWriter(w)
	defer zw.Close()

	for _, subpath := range sourceSubpaths {
		absPath, cleanRel, _, err := s.ResolvePath(subpath)
		if err != nil {
			continue
		}

		baseName := filepath.Base(absPath)
		if cleanRel == "" {
			baseName = "storage"
		}

		info, err := os.Stat(absPath)
		if err != nil {
			continue
		}

		if !info.IsDir() {
			if err := s.addFileToZip(zw, absPath, baseName); err != nil {
				return err
			}
			continue
		}

		// Directory: walk and add all files
		err = filepath.Walk(absPath, func(path string, fi os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if IsEnvName(fi.Name()) {
				if fi.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}

			relToWalkRoot, err := filepath.Rel(absPath, path)
			if err != nil {
				return err
			}
			if relToWalkRoot == "." {
				return nil
			}

			zipEntryPath := filepath.ToSlash(filepath.Join(baseName, relToWalkRoot))
			if fi.IsDir() {
				zipEntryPath += "/"
				_, err := zw.Create(zipEntryPath)
				return err
			}

			return s.addFileToZip(zw, path, zipEntryPath)
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *Service) addFileToZip(zw *zip.Writer, absPath, zipEntryPath string) error {
	file, err := os.Open(absPath)
	if err != nil {
		return err
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		return err
	}

	header, err := zip.FileInfoHeader(fi)
	if err != nil {
		return err
	}
	header.Name = filepath.ToSlash(zipEntryPath)
	header.Method = zip.Deflate

	writer, err := zw.CreateHeader(header)
	if err != nil {
		return err
	}

	_, err = io.Copy(writer, file)
	return err
}
