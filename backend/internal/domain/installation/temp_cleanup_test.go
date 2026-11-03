package installation

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCleanupStaleTempDirs_RemovesDryRunProfiles(t *testing.T) {
	storage := t.TempDir()
	tempDir := filepath.Join(storage, "temp")

	require.NoError(t, os.MkdirAll(filepath.Join(tempDir, "dryrun_2302"), 0o755))
	require.NoError(t, os.MkdirAll(filepath.Join(tempDir, "dryrun_2402", "nested"), 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(tempDir, "keep.txt"), []byte("keep"), 0o644))

	removed, err := CleanupStaleTempDirs(storage, t.TempDir(), time.Now())
	require.NoError(t, err)
	assert.Equal(t, 2, removed)

	assert.NoDirExists(t, filepath.Join(tempDir, "dryrun_2302"))
	assert.NoDirExists(t, filepath.Join(tempDir, "dryrun_2402"))
	assert.FileExists(t, filepath.Join(tempDir, "keep.txt"))
}

func TestCleanupStaleTempDirs_MissingTempDirIsNotAnError(t *testing.T) {
	removed, err := CleanupStaleTempDirs(filepath.Join(t.TempDir(), "absent"), t.TempDir(), time.Now())
	require.NoError(t, err)
	assert.Zero(t, removed)
}

func TestCleanupStaleTempDirs_OnlyOldTempEntriesAreRemoved(t *testing.T) {
	tmpBase := t.TempDir()
	old := time.Now().Add(-2 * time.Hour)

	staleExtraction := filepath.Join(tmpBase, "reforger_scenario_extraction_stale")
	freshExtraction := filepath.Join(tmpBase, "reforger_scenario_extraction_fresh")
	staleScript := filepath.Join(tmpBase, "steamcmd_script_stale")
	unrelated := filepath.Join(tmpBase, "unrelated_stale")

	require.NoError(t, os.MkdirAll(staleExtraction, 0o755))
	require.NoError(t, os.MkdirAll(freshExtraction, 0o755))
	require.NoError(t, os.WriteFile(staleScript, []byte("x"), 0o600))
	require.NoError(t, os.WriteFile(unrelated, []byte("x"), 0o600))

	require.NoError(t, os.Chtimes(staleExtraction, old, old))
	require.NoError(t, os.Chtimes(staleScript, old, old))
	require.NoError(t, os.Chtimes(unrelated, old, old))

	removed, err := CleanupStaleTempDirs(t.TempDir(), tmpBase, time.Now())
	require.NoError(t, err)
	assert.Equal(t, 2, removed)

	assert.NoDirExists(t, staleExtraction)
	assert.NoFileExists(t, staleScript)
	// Fresh entries may belong to a running instance, and unrelated names are
	// never ours to delete.
	assert.DirExists(t, freshExtraction)
	assert.FileExists(t, unrelated)
}
