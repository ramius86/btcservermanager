package workshop

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop/signature"
	"context"
	"errors"
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
type bikeyEntry struct {
	srcAfterLower string
	name          string
}

// InstallMod installs or updates a workshop mod on disk.
func (i *Installer) InstallMod(ctx context.Context, m *WorkshopMod) error {
	if ctx == nil {
		ctx = context.Background()
	}
	if m == nil {
		return errors.New("workshop mod cannot be nil")
	}

	modDir := i.paths.GetModInstallationPath(m.ID, m.ServerType)

	bikeys, size, err := i.scanAndLowercaseModDir(modDir)
	if err != nil {
		return err
	}

	bikeys = i.autoExtractMissingBiKeys(m.ServerType, modDir, bikeys)
	i.syncBiKeys(ctx, m, bikeys)

	if err := i.createSymlink(m); err != nil {
		return fmt.Errorf("failed to create symlink: %w", err)
	}

	i.verifyArma3Signatures(m, modDir)

	m.InstallationStatus = InstallationFinished
	m.FileSize = size
	m.NeedsUpdate = false

	return i.repo.Save(ctx, m)
}

func (i *Installer) scanAndLowercaseModDir(modDir string) ([]bikeyEntry, int64, error) {
	var (
		pathsToRename []string
		bikeys        []bikeyEntry
		size          int64
	)

	err := filepath.WalkDir(modDir, func(p string, d fs.DirEntry, err error) error {
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
	})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to scan mod directory: %w", err)
	}

	for j := len(pathsToRename) - 1; j >= 0; j-- {
		p := pathsToRename[j]
		newPath := filepath.Join(filepath.Dir(p), strings.ToLower(filepath.Base(p)))
		if err := renameOrMerge(p, newPath); err != nil {
			return nil, 0, fmt.Errorf("failed to lowercase %s: %w", p, err)
		}
	}

	return bikeys, size, nil
}

func (i *Installer) autoExtractMissingBiKeys(serverType server.Type, modDir string, bikeys []bikeyEntry) []bikeyEntry {
	if len(bikeys) > 0 || (serverType != server.TypeArma3 && serverType != server.TypeDayZ && serverType != server.TypeDayZExp) {
		return bikeys
	}

	seenExtracted := make(map[string]bool)
	_ = filepath.WalkDir(modDir, func(p string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		lower := strings.ToLower(d.Name())
		if strings.HasSuffix(lower, ".bisign") {
			keyName, keyBytes, extErr := signature.ExtractBiKeyFromBiSign(p)
			if extErr == nil && len(keyBytes) > 0 {
				cleanKeyName := strings.ToLower(strings.TrimSpace(keyName)) + ".bikey"
				if !seenExtracted[cleanKeyName] {
					seenExtracted[cleanKeyName] = true
					keysFolder := filepath.Join(modDir, "keys")
					_ = os.MkdirAll(keysFolder, 0o755)
					destKeyPath := filepath.Join(keysFolder, cleanKeyName)
					if writeErr := os.WriteFile(destKeyPath, keyBytes, 0o644); writeErr == nil {
						bikeys = append(bikeys, bikeyEntry{srcAfterLower: destKeyPath, name: cleanKeyName})
						fmt.Printf("[Installer] Auto-extracted missing bikey %s from signature %s\n", cleanKeyName, p)
					}
				}
			}
		}
		return nil
	})
	return bikeys
}

func (i *Installer) syncBiKeys(ctx context.Context, m *WorkshopMod, bikeys []bikeyEntry) {
	for _, k := range m.BiKeys {
		if strings.TrimSpace(k) == "" {
			continue
		}
		if i.repo != nil {
			used, err := i.repo.IsBiKeyUsedByOtherMods(ctx, m.ID, k, m.ServerType)
			if err != nil {
				fmt.Printf("[Installer] Failed to check if bikey %s is used by other mods: %v; preserving key file\n", k, err)
				continue
			} else if used {
				continue
			}
		}
		_ = os.Remove(i.paths.GetServerKeyPath(k, m.ServerType))
	}
	m.BiKeys = m.BiKeys[:0]

	seenBiKeys := make(map[string]struct{})
	for _, bk := range bikeys {
		if _, seen := seenBiKeys[bk.name]; seen {
			continue
		}
		seenBiKeys[bk.name] = struct{}{}

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
}

func (i *Installer) verifyArma3Signatures(m *WorkshopMod, modDir string) {
	if m.ServerType != server.TypeArma3 {
		return
	}
	serverKeysDir := i.paths.GetServerKeysPath(m.ServerType)
	report, err := signature.VerifyModSignatures(modDir, serverKeysDir, false)
	if err == nil && report != nil {
		m.SignatureStatus = string(report.OverallStatus)
		m.SignatureSummary = report.Summary
		fmt.Printf("[Installer] Signature verification for mod %d (%s): %s - %s\n", m.ID, m.Name, report.OverallStatus, report.Summary)
	} else if err != nil {
		m.SignatureStatus = string(signature.StatusError)
		m.SignatureSummary = err.Error()
		fmt.Printf("[Installer] Signature check error for mod %d (%s): %v\n", m.ID, m.Name, err)
	}
}

func (i *Installer) UninstallMod(ctx context.Context, m *WorkshopMod) error {
	if ctx == nil {
		ctx = context.Background()
	}
	if m == nil {
		return nil
	}

	// Remove symlink
	link := i.paths.GetModLinkPath(m.GetNormalizedName(), m.ServerType)
	_ = os.Remove(link)

	// Remove BiKeys from server keys folder
	for _, k := range m.BiKeys {
		if strings.TrimSpace(k) == "" {
			continue
		}
		if i.repo != nil {
			used, err := i.repo.IsBiKeyUsedByOtherMods(ctx, m.ID, k, m.ServerType)
			if err != nil {
				fmt.Printf("[Installer] Failed to check if bikey %s is used by other mods: %v; preserving key file\n", k, err)
				continue
			} else if used {
				continue
			}
		}
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
		if err := renameOrMerge(p, newPath); err != nil {
			return err
		}
	}

	return nil
}

// renameOrMerge moves src to dst. If both src and dst exist as distinct directories,
// it recursively merges the contents of src into dst and removes src.
// Otherwise, it performs an os.Rename(src, dst).
func renameOrMerge(src, dst string) error {
	src = filepath.Clean(src)
	dst = filepath.Clean(dst)
	if src == dst {
		return nil
	}

	srcInfo, err := os.Lstat(src)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}

	dstInfo, err := os.Lstat(dst)
	if err == nil && srcInfo.IsDir() && dstInfo.IsDir() && !os.SameFile(srcInfo, dstInfo) {
		entries, err := os.ReadDir(src)
		if err != nil {
			if os.IsNotExist(err) {
				return nil
			}
			return err
		}

		for _, entry := range entries {
			srcChild := filepath.Join(src, entry.Name())
			dstChild := filepath.Join(dst, strings.ToLower(entry.Name()))
			if err := renameOrMerge(srcChild, dstChild); err != nil {
				return err
			}
		}

		if err := os.Remove(src); err != nil && !os.IsNotExist(err) {
			return err
		}
		return nil
	}

	if err := os.Rename(src, dst); err != nil && !os.IsNotExist(err) {
		return err
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
