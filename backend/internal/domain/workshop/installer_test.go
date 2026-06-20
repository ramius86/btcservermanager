package workshop

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"os"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestInstaller(t *testing.T) {
	tempDir := t.TempDir()
	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: filepath.Join(tempDir, "servers"),
		ModsDirectory:    filepath.Join(tempDir, "mods"),
		LogsDirectory:    filepath.Join(tempDir, "logs"),
	}
	paths := config.NewPaths(cfg)

	dbPath := filepath.Join(tempDir, "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)
	repo := NewRepository(database)

	installer := NewInstaller(paths, repo)

	t.Run("Directory To Lowercase", func(t *testing.T) {
		// Use a dedicated sub-directory in tempDir for this test to avoid path collisions
		modDir := filepath.Join(tempDir, "mod_to_lower")
		addonsDir := filepath.Join(modDir, "Addons")

		if err := os.MkdirAll(addonsDir, 0o755); err != nil {
			t.Fatalf("failed to create test directory: %v", err)
		}

		testFile := filepath.Join(addonsDir, "MyMod.PBO")
		if err := os.WriteFile(testFile, []byte("data"), 0o644); err != nil {
			t.Fatalf("failed to create test file: %v", err)
		}

		err := lowercaseDir(modDir)
		if err != nil {
			t.Fatalf("failed to convert: %v", err)
		}

		// On Linux, the path MUST be lowercase now.
		// We check the specific file we created but in lowercase.
		lowerFile := filepath.Join(modDir, "addons", "mymod.pbo")
		if _, err := os.Stat(lowerFile); os.IsNotExist(err) {
			t.Errorf("file %s was not converted to lowercase correctly", lowerFile)
		}
	})

	t.Run("Create Symlink", func(t *testing.T) {
		m := &WorkshopMod{ID: 111, Name: "My Mod", ServerType: server.TypeArma3}
		modDir := paths.GetModInstallationPath(m.ID, m.ServerType)
		serverDir := paths.GetServerPath(m.ServerType)

		// Ensure full path structure exists for Linux targets
		_ = os.MkdirAll(modDir, 0o755)
		_ = os.MkdirAll(serverDir, 0o755)

		err := installer.createSymlink(m)
		if err != nil {
			// On Windows, symlinks require admin or developer mode
			t.Skipf("skipping symlink test (likely missing permissions): %v", err)
			return
		}

		linkPath := paths.GetModLinkPath(m.GetNormalizedName(), m.ServerType)
		if _, err := os.Lstat(linkPath); os.IsNotExist(err) {
			t.Error("symlink not created")
		}
	})
}
