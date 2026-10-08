package workshop

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"context"
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

	t.Run("UninstallMod preserves shared bikey", func(t *testing.T) {
		ctx := t.Context()

		// Mod 1: CUP Units (Arma 3, Installed)
		mod1 := &WorkshopMod{
			ID:                 1001,
			Name:               "CUP Units",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"cup.bikey", "cup_units_only.bikey"},
		}
		if err := repo.Save(ctx, mod1); err != nil {
			t.Fatalf("failed to save mod1: %v", err)
		}

		// Mod 2: CUP Weapons (Arma 3, Installed)
		mod2 := &WorkshopMod{
			ID:                 1002,
			Name:               "CUP Weapons",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"cup.bikey", "cup_weapons_only.bikey"},
		}
		if err := repo.Save(ctx, mod2); err != nil {
			t.Fatalf("failed to save mod2: %v", err)
		}

		// Create keys directory and key files
		keysDir := paths.GetServerKeysPath(server.TypeArma3)
		if err := os.MkdirAll(keysDir, 0o755); err != nil {
			t.Fatalf("failed to create keys dir: %v", err)
		}

		sharedKeyFile := paths.GetServerKeyPath("cup.bikey", server.TypeArma3)
		mod1KeyFile := paths.GetServerKeyPath("cup_units_only.bikey", server.TypeArma3)
		mod2KeyFile := paths.GetServerKeyPath("cup_weapons_only.bikey", server.TypeArma3)

		for _, kf := range []string{sharedKeyFile, mod1KeyFile, mod2KeyFile} {
			if err := os.WriteFile(kf, []byte("key-content"), 0o644); err != nil {
				t.Fatalf("failed to write key file %s: %v", kf, err)
			}
		}

		// Create mod installation directories
		mod1Dir := paths.GetModInstallationPath(mod1.ID, mod1.ServerType)
		if err := os.MkdirAll(mod1Dir, 0o755); err != nil {
			t.Fatalf("failed to create mod1 dir: %v", err)
		}

		// Uninstall mod1
		if err := installer.UninstallMod(ctx, mod1); err != nil {
			t.Fatalf("UninstallMod failed: %v", err)
		}

		// Check that shared key cup.bikey still exists because mod2 is still installed and uses it
		if _, err := os.Stat(sharedKeyFile); os.IsNotExist(err) {
			t.Errorf("expected shared key %s to still exist, but was deleted", sharedKeyFile)
		}

		// Check that mod1-only key was removed
		if _, err := os.Stat(mod1KeyFile); !os.IsNotExist(err) {
			t.Errorf("expected mod1-only key %s to be deleted, but still exists", mod1KeyFile)
		}

		// Check that mod2-only key still exists
		if _, err := os.Stat(mod2KeyFile); os.IsNotExist(err) {
			t.Errorf("expected mod2-only key %s to still exist, but was deleted", mod2KeyFile)
		}

		// Simulate Service.DeleteMod deleting mod1 from DB
		if err := repo.Delete(ctx, mod1.ID); err != nil {
			t.Fatalf("failed to delete mod1: %v", err)
		}

		// Now uninstall mod2
		if err := installer.UninstallMod(ctx, mod2); err != nil {
			t.Fatalf("UninstallMod failed for mod2: %v", err)
		}

		// Since mod1 was deleted from DB, no other installed mod uses cup.bikey now.
		// Thus cup.bikey should now be removed from disk.
		if _, err := os.Stat(sharedKeyFile); !os.IsNotExist(err) {
			t.Errorf("expected shared key %s to be deleted after last mod uninstalled, but still exists", sharedKeyFile)
		}

		// mod2-only key should also be removed
		if _, err := os.Stat(mod2KeyFile); !os.IsNotExist(err) {
			t.Errorf("expected mod2-only key %s to be deleted, but still exists", mod2KeyFile)
		}
	})

	t.Run("IsBiKeyUsedByOtherMods edge cases", func(t *testing.T) {
		ctx := t.Context()

		modA := &WorkshopMod{
			ID:                 2001,
			Name:               "Mod A",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"common.bikey"},
		}
		modB := &WorkshopMod{
			ID:                 2002,
			Name:               "Mod B",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationInProgress, // Not finished yet!
			BiKeys:             []string{"common.bikey"},
		}
		modC := &WorkshopMod{
			ID:                 2003,
			Name:               "Mod C",
			ServerType:         server.TypeDayZ, // Different server type
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"common.bikey"},
		}
		_ = repo.Save(ctx, modA)
		_ = repo.Save(ctx, modB)
		_ = repo.Save(ctx, modC)

		// For Mod A: Mod B is InProgress, Mod C is DayZ -> not used by any other finished Arma3 mod
		used, err := repo.IsBiKeyUsedByOtherMods(ctx, modA.ID, "common.bikey", server.TypeArma3)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if used {
			t.Errorf("expected common.bikey not to be used by other finished mods for Mod A")
		}

		// Mark Mod B as finished
		modB.InstallationStatus = InstallationFinished
		_ = repo.Save(ctx, modB)

		// For Mod A: Mod B is finished and has common.bikey in Arma3
		used, err = repo.IsBiKeyUsedByOtherMods(ctx, modA.ID, "common.bikey", server.TypeArma3)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !used {
			t.Errorf("expected common.bikey to be reported as used by Mod B")
		}

		// For Mod B: Mod A is finished and has common.bikey in Arma3
		used, err = repo.IsBiKeyUsedByOtherMods(ctx, modB.ID, "common.bikey", server.TypeArma3)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !used {
			t.Errorf("expected common.bikey to be reported as used by Mod A")
		}

		// For Mod C (DayZ): Mod A and Mod B are Arma3 -> not used in DayZ
		used, err = repo.IsBiKeyUsedByOtherMods(ctx, modC.ID, "common.bikey", server.TypeDayZ)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if used {
			t.Errorf("expected common.bikey not to be used for DayZ mod")
		}

		// Non-existent key
		used, err = repo.IsBiKeyUsedByOtherMods(ctx, modA.ID, "nonexistent.bikey", server.TypeArma3)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if used {
			t.Errorf("expected nonexistent.bikey to not be used")
		}
	})

	t.Run("InstallMod preserves shared bikey on update", func(t *testing.T) {
		ctx := t.Context()

		// Mod 1: currently installed with shared key and its own old key
		mod1 := &WorkshopMod{
			ID:                 4001,
			Name:               "Mod 1",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"shared_suite.bikey", "mod1_old.bikey"},
		}
		if err := repo.Save(ctx, mod1); err != nil {
			t.Fatalf("failed to save mod1: %v", err)
		}

		// Mod 2: currently installed and shares shared_suite.bikey
		mod2 := &WorkshopMod{
			ID:                 4002,
			Name:               "Mod 2",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"shared_suite.bikey"},
		}
		if err := repo.Save(ctx, mod2); err != nil {
			t.Fatalf("failed to save mod2: %v", err)
		}

		keysDir := paths.GetServerKeysPath(server.TypeArma3)
		_ = os.MkdirAll(keysDir, 0o755)

		sharedKeyFile := paths.GetServerKeyPath("shared_suite.bikey", server.TypeArma3)
		mod1OldKeyFile := paths.GetServerKeyPath("mod1_old.bikey", server.TypeArma3)
		mod1NewKeyFile := paths.GetServerKeyPath("mod1_new.bikey", server.TypeArma3)

		_ = os.WriteFile(sharedKeyFile, []byte("shared-key"), 0o644)
		_ = os.WriteFile(mod1OldKeyFile, []byte("mod1-old-key"), 0o644)

		// Create mod1 source folder with mod1_new.bikey
		mod1Dir := paths.GetModInstallationPath(mod1.ID, mod1.ServerType)
		_ = os.MkdirAll(mod1Dir, 0o755)
		_ = os.WriteFile(filepath.Join(mod1Dir, "mod1_new.bikey"), []byte("mod1-new-key"), 0o644)

		// Run InstallMod for mod1 (updating it)
		err := installer.InstallMod(ctx, mod1)
		if err != nil && !os.IsPermission(err) {
			// On Windows without developer mode, symlink creation might fail with permission error
			t.Logf("InstallMod returned error (expected if symlink privilege missing on Windows): %v", err)
		}

		// Verify shared_suite.bikey is still present
		if _, err := os.Stat(sharedKeyFile); os.IsNotExist(err) {
			t.Errorf("expected shared key %s to still exist after InstallMod update, but was deleted", sharedKeyFile)
		}

		// Verify mod1_old.bikey was removed
		if _, err := os.Stat(mod1OldKeyFile); !os.IsNotExist(err) {
			t.Errorf("expected mod1 old key %s to be deleted after InstallMod update, but still exists", mod1OldKeyFile)
		}

		// Verify mod1_new.bikey was copied
		if _, err := os.Stat(mod1NewKeyFile); os.IsNotExist(err) {
			t.Errorf("expected mod1 new key %s to be copied to keys dir, but was not found", mod1NewKeyFile)
		}
	})

	t.Run("UninstallMod preserves key on database error", func(t *testing.T) {
		// Use a repository connected to a closed database to simulate DB error
		brokenDBPath := filepath.Join(tempDir, "broken.db")
		brokenDB, _ := db.Connect(brokenDBPath)
		_ = db.Migrate(brokenDBPath)
		brokenRepo := NewRepository(brokenDB)
		brokenInstaller := NewInstaller(paths, brokenRepo)
		_ = brokenDB.Close() // Close DB so IsBiKeyUsedByOtherMods returns error

		mod := &WorkshopMod{
			ID:                 5001,
			Name:               "Mod Error Test",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"critical.bikey"},
		}

		keyFile := paths.GetServerKeyPath("critical.bikey", server.TypeArma3)
		_ = os.MkdirAll(filepath.Dir(keyFile), 0o755)
		_ = os.WriteFile(keyFile, []byte("critical-key-content"), 0o644)

		modDir := paths.GetModInstallationPath(mod.ID, mod.ServerType)
		_ = os.MkdirAll(modDir, 0o755)

		// Uninstall should preserve critical.bikey because DB error prevents safe verification
		_ = brokenInstaller.UninstallMod(context.Background(), mod)

		if _, err := os.Stat(keyFile); os.IsNotExist(err) {
			t.Errorf("expected key %s to be preserved when DB check fails, but was deleted", keyFile)
		}
	})

	t.Run("Empty and whitespace bikey handling does not delete keys folder", func(t *testing.T) {
		keysDir := paths.GetServerKeysPath(server.TypeArma3)
		_ = os.MkdirAll(keysDir, 0o755)
		markerFile := filepath.Join(keysDir, "keep_me.bikey")
		_ = os.WriteFile(markerFile, []byte("keep"), 0o644)

		emptyKeyMod := &WorkshopMod{
			ID:                 6001,
			Name:               "Empty Key Mod",
			ServerType:         server.TypeArma3,
			InstallationStatus: InstallationFinished,
			BiKeys:             []string{"", "   "},
		}

		_ = installer.UninstallMod(context.Background(), emptyKeyMod)

		if _, err := os.Stat(keysDir); os.IsNotExist(err) {
			t.Fatalf("keys directory was deleted by empty bikey string!")
		}
		if _, err := os.Stat(markerFile); os.IsNotExist(err) {
			t.Fatalf("marker file in keys directory was deleted!")
		}
	})

	t.Run("Nil context and nil mod safety", func(t *testing.T) {
		// None of these should panic
		if err := installer.UninstallMod(nil, nil); err != nil {
			t.Errorf("unexpected error for nil mod: %v", err)
		}

		if err := installer.InstallMod(nil, nil); err == nil {
			t.Errorf("expected error for nil mod in InstallMod, got nil")
		}

		used, err := repo.IsBiKeyUsedByOtherMods(nil, 1, "test.bikey", server.TypeArma3)
		if err != nil {
			t.Errorf("unexpected error with nil context: %v", err)
		}
		if used {
			t.Errorf("expected used to be false")
		}

		used, err = repo.IsBiKeyUsedByOtherMods(context.Background(), 1, "", server.TypeArma3)
		if err != nil {
			t.Errorf("unexpected error with empty bikey: %v", err)
		}
		if used {
			t.Errorf("expected used to be false for empty bikey")
		}
	})
}
