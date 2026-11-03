package installation

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const (
	// dryRunDirPrefix is the per-port Reforger profile directory created under
	// <storage>/temp by DryRunService. At startup no dry run can be in flight,
	// so every match is a leftover and is removed unconditionally.
	dryRunDirPrefix = "dryrun_"

	// Scenario extraction and SteamCMD scripts live in the temporary directory.
	// Another instance (a dev shell) could be using them right now, so only
	// entries older than staleTempAge are removed.
	scenarioExtractionPrefix = "reforger_scenario_extraction_"
	steamCmdScriptPrefix     = "steamcmd_script_"
	staleTempAge             = time.Hour
)

// CleanupStaleTempDirs removes temporary directories and files that a crash, an
// OOM kill or a container stop left behind. Entries with these prefixes are
// never reused, so removing a leftover is always safe; the age filter only
// protects a concurrent instance from losing work in progress.
//
// tmpBaseDir is the temporary directory to scan (os.TempDir() in production); it
// is a parameter so the behavior can be tested without touching the real one.
//
// It returns how many entries were removed and joins the per-entry errors, so
// one undeletable path does not stop the rest of the cleanup.
func CleanupStaleTempDirs(storagePath, tmpBaseDir string, now time.Time) (int, error) {
	var errs []error

	removed := 0
	dryRunDir := filepath.Join(storagePath, "temp")

	entries, err := os.ReadDir(dryRunDir)
	if err != nil && !errors.Is(err, os.ErrNotExist) {
		errs = append(errs, fmt.Errorf("read %s: %w", dryRunDir, err))
	}

	for _, entry := range entries {
		if !strings.HasPrefix(entry.Name(), dryRunDirPrefix) {
			continue
		}

		if err := os.RemoveAll(filepath.Join(dryRunDir, entry.Name())); err != nil {
			errs = append(errs, fmt.Errorf("remove %s: %w", entry.Name(), err))
			continue
		}

		removed++
	}

	tmpEntries, err := os.ReadDir(tmpBaseDir)
	if err != nil {
		errs = append(errs, fmt.Errorf("read %s: %w", tmpBaseDir, err))
		return removed, errors.Join(errs...)
	}

	for _, entry := range tmpEntries {
		name := entry.Name()
		if !strings.HasPrefix(name, scenarioExtractionPrefix) && !strings.HasPrefix(name, steamCmdScriptPrefix) {
			continue
		}

		info, infoErr := entry.Info()
		if infoErr != nil {
			errs = append(errs, fmt.Errorf("stat %s: %w", name, infoErr))
			continue
		}

		if now.Sub(info.ModTime()) < staleTempAge {
			continue
		}

		if err := os.RemoveAll(filepath.Join(tmpBaseDir, name)); err != nil {
			errs = append(errs, fmt.Errorf("remove %s: %w", name, err))
			continue
		}

		removed++
	}

	return removed, errors.Join(errs...)
}
