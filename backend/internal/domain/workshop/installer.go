package workshop

import (
	"btcservermanager/internal/config"
	"context"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type Installer struct {
	paths *config.Paths
	repo  *Repository
}

func NewInstaller(paths *config.Paths, repo *Repository) *Installer {
	return &Installer{
		paths: paths,
		repo:  repo,
	}
}

// InstallMod performs a single WalkDir pass over the mod directory to:
//  1. Collect paths that need to be lowercased (Linux filesystem compat)
//  2. Identify .bikey files to copy into the server's keys/ folder
//  3. Calculate total directory size
//
// This replaces the previous three separate filepath.Walk calls
// (directoryToLowercase, updateBiKeys, getDirSize).
func (i *Installer) InstallMod(ctx context.Context, m *WorkshopMod) error {
	modDir := i.paths.GetModInstallationPath(m.ID, m.ServerType)

	type bikeyEntry struct {
		// srcAfterLower is the file path after all lowercase renames have been applied.
		// Computed at walk time as: filepath.Join(modDir, strings.ToLower(rel))
		srcAfterLower string
		name          string // already lowercased basename
	}

	var (
		pathsToRename []string
		bikeys        []bikeyEntry
		size          int64
	)

	// Single WalkDir: avoids the os.FileInfo allocation per entry that filepath.Walk creates.
	if err := filepath.WalkDir(modDir, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if p == modDir {
			return nil
		}

		name := d.Name()
		lowerName := strings.ToLower(name)

		if lowerName != name {
			pathsToRename = append(pathsToRename, p)
		}

		if !d.IsDir() {
			// Compute the canonical post-rename path for this file.
			// All path components below modDir will be lowercased after the rename step.
			rel, relErr := filepath.Rel(modDir, p)
			if relErr == nil {
				srcAfterLower := filepath.Join(modDir, strings.ToLower(rel))

				if strings.HasSuffix(lowerName, ".bikey") {
					bikeys = append(bikeys, bikeyEntry{srcAfterLower: srcAfterLower, name: lowerName})
				}
			}

			info, infoErr := d.Info()
			if infoErr == nil {
				size += info.Size()
			}
		}

		return nil
	}); err != nil {
		return fmt.Errorf("failed to scan mod directory: %w", err)
	}

	// Apply renames deepest-first so parent paths remain valid while renaming children.
	for j := len(pathsToRename) - 1; j >= 0; j-- {
		p := pathsToRename[j]
		newPath := filepath.Join(filepath.Dir(p), strings.ToLower(filepath.Base(p)))
		if err := os.Rename(p, newPath); err != nil {
			// Ignore ENOENT: may occur on case-insensitive filesystems.
			if !os.IsNotExist(err) {
				return fmt.Errorf("failed to lowercase %s: %w", p, err)
			}
		}
	}

	// Remove old bikeys recorded in DB, then copy newly found ones from their
	// post-rename paths (computed above during the walk).
	for _, k := range m.BiKeys {
		_ = os.Remove(i.paths.GetServerKeyPath(k, m.ServerType))
	}
	m.BiKeys = m.BiKeys[:0]

	for _, bk := range bikeys {
		dest := i.paths.GetServerKeyPath(bk.name, m.ServerType)
		if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
			fmt.Printf("[Installer] Failed to create directory for key %s: %v\n", bk.name, err)
			continue
		}
		if err := i.copyFile(bk.srcAfterLower, dest); err != nil {
			fmt.Printf("[Installer] Failed to copy bikey %s from %s to %s: %v\n", bk.name, bk.srcAfterLower, dest, err)
			continue
		}
		m.BiKeys = append(m.BiKeys, bk.name)
	}

	// Create symlink in server directory
	if err := i.createSymlink(m); err != nil {
		return fmt.Errorf("failed to create symlink: %w", err)
	}

	m.InstallationStatus = InstallationFinished
	m.FileSize = size
	m.NeedsUpdate = false

	return i.repo.Save(ctx, m)
}

func (i *Installer) UninstallMod(m *WorkshopMod) error {
	// Remove symlink
	link := i.paths.GetModLinkPath(m.GetNormalizedName(), m.ServerType)
	_ = os.Remove(link)

	// Remove BiKeys from server keys folder
	for _, k := range m.BiKeys {
		_ = os.Remove(i.paths.GetServerKeyPath(k, m.ServerType))
	}

	// Remove physical files
	modDir := i.paths.GetModInstallationPath(m.ID, m.ServerType)

	return os.RemoveAll(modDir)
}

// lowercaseDir renames all files and directories under root to lowercase.
// Renames are applied deepest-first to avoid invalidating parent paths.
// Exposed as a package-level function so it can be tested independently.
func lowercaseDir(root string) error {
	var pathsToRename []string

	if err := filepath.WalkDir(root, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if p == root {
			return nil
		}
		if strings.ToLower(d.Name()) != d.Name() {
			pathsToRename = append(pathsToRename, p)
		}
		return nil
	}); err != nil {
		return err
	}

	for j := len(pathsToRename) - 1; j >= 0; j-- {
		p := pathsToRename[j]
		newPath := filepath.Join(filepath.Dir(p), strings.ToLower(filepath.Base(p)))
		if err := os.Rename(p, newPath); err != nil && !os.IsNotExist(err) {
			return err
		}
	}

	return nil
}

func (i *Installer) createSymlink(m *WorkshopMod) error {
	target := i.paths.GetModInstallationPath(m.ID, m.ServerType)
	link := i.paths.GetModLinkPath(m.GetNormalizedName(), m.ServerType)

	_ = os.Remove(link)

	return os.Symlink(target, link)
}

func (i *Installer) copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)

	return err
}

// getDirSize returns the total size in bytes of all files under path.
// Uses WalkDir to avoid the os.FileInfo allocation per entry of filepath.Walk.
// Errors are logged but do not fail the call — a partial or zero size is returned.
func getDirSize(path string) int64 {
	var size int64

	err := filepath.WalkDir(path, func(_ string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			info, infoErr := d.Info()
			if infoErr == nil {
				size += info.Size()
			}
		}
		return nil
	})
	if err != nil && !os.IsNotExist(err) {
		fmt.Printf("[Installer] Failed to calculate directory size for %s: %v\n", path, err)
	}

	return size
}
