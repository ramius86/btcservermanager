package workshop

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
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

	t.Run("Directory To Lowercase Collision Merge", func(t *testing.T) {
		modDir := filepath.Join(tempDir, "mod_casing_collision")
		if err := os.MkdirAll(modDir, 0o755); err != nil {
			t.Fatalf("failed to create test directory: %v", err)
		}

		// Probe whether the underlying filesystem is case-sensitive (e.g. Linux ext4).
		// On case-insensitive filesystems (Windows/macOS), 'Addons' and 'addons' resolve
		// to the exact same directory entry, making distinct colliding directories impossible.
		probeDir := filepath.Join(modDir, ".case_probe")
		_ = os.MkdirAll(filepath.Join(probeDir, "a"), 0o755)
		_ = os.WriteFile(filepath.Join(probeDir, "a", "probe.txt"), []byte("1"), 0o644)
		isCaseSensitive := false
		if _, err := os.Stat(filepath.Join(probeDir, "A", "probe.txt")); os.IsNotExist(err) {
			isCaseSensitive = true
		}
		_ = os.RemoveAll(probeDir)

		if !isCaseSensitive && runtime.GOOS == "windows" {
			_ = exec.Command("fsutil.exe", "file", "setCaseSensitiveInfo", modDir, "enable").Run()
			probeDir := filepath.Join(modDir, ".case_probe")
			_ = os.MkdirAll(filepath.Join(probeDir, "a"), 0o755)
			_ = os.WriteFile(filepath.Join(probeDir, "a", "probe.txt"), []byte("1"), 0o644)
			if _, err := os.Stat(filepath.Join(probeDir, "A", "probe.txt")); os.IsNotExist(err) {
				isCaseSensitive = true
			}
			_ = os.RemoveAll(probeDir)
		}

		if !isCaseSensitive {
			t.Skip("skipping case-collision test on case-insensitive filesystem")
		}

		upperAddons := filepath.Join(modDir, "Addons")
		lowerAddons := filepath.Join(modDir, "addons")
		allUpperAddons := filepath.Join(modDir, "ADDONS")

		if err := os.MkdirAll(upperAddons, 0o755); err != nil {
			t.Fatalf("failed to create upper Addons directory: %v", err)
		}
		if err := os.MkdirAll(lowerAddons, 0o755); err != nil {
			t.Fatalf("failed to create lower addons directory: %v", err)
		}
		if err := os.MkdirAll(allUpperAddons, 0o755); err != nil {
			t.Fatalf("failed to create all-upper ADDONS directory: %v", err)
		}

		// Create files in all three directories
		upperFile := filepath.Join(upperAddons, "ModUpper.PBO")
		lowerFile := filepath.Join(lowerAddons, "modlower.pbo")
		allUpperFile := filepath.Join(allUpperAddons, "ALLUPPER.PBO")
		if err := os.WriteFile(upperFile, []byte("upper-data"), 0o644); err != nil {
			t.Fatalf("failed to create upper file: %v", err)
		}
		if err := os.WriteFile(lowerFile, []byte("lower-data"), 0o644); err != nil {
			t.Fatalf("failed to create lower file: %v", err)
		}
		if err := os.WriteFile(allUpperFile, []byte("all-upper-data"), 0o644); err != nil {
			t.Fatalf("failed to create all-upper file: %v", err)
		}

		// Colliding file with identical lowercase name in upper and lower
		upperConflict := filepath.Join(upperAddons, "Conflict.PBO")
		lowerConflict := filepath.Join(lowerAddons, "conflict.pbo")
		if err := os.WriteFile(upperConflict, []byte("from-upper-conflict"), 0o644); err != nil {
			t.Fatalf("failed to create upper conflict file: %v", err)
		}
		if err := os.WriteFile(lowerConflict, []byte("from-lower-conflict"), 0o644); err != nil {
			t.Fatalf("failed to create lower conflict file: %v", err)
		}

		// Create colliding subdirectories: Addons/Sub and addons/sub
		upperSub := filepath.Join(upperAddons, "Sub")
		lowerSub := filepath.Join(lowerAddons, "sub")
		if err := os.MkdirAll(upperSub, 0o755); err != nil {
			t.Fatalf("failed to create upper sub dir: %v", err)
		}
		if err := os.MkdirAll(lowerSub, 0o755); err != nil {
			t.Fatalf("failed to create lower sub dir: %v", err)
		}
		if err := os.WriteFile(filepath.Join(upperSub, "NestedUpper.pbo"), []byte("nested-upper"), 0o644); err != nil {
			t.Fatalf("failed to create nested upper file: %v", err)
		}
		if err := os.WriteFile(filepath.Join(lowerSub, "nestedlower.pbo"), []byte("nested-lower"), 0o644); err != nil {
			t.Fatalf("failed to create nested lower file: %v", err)
		}

		if err := lowercaseDir(modDir); err != nil {
			t.Fatalf("lowercaseDir failed to merge colliding directories: %v", err)
		}

		// Upper Addons and ADDONS directories should no longer exist
		if _, err := os.Stat(upperAddons); !os.IsNotExist(err) {
			t.Errorf("upper Addons directory still exists after merge")
		}
		if _, err := os.Stat(allUpperAddons); !os.IsNotExist(err) {
			t.Errorf("allUpperAddons directory still exists after merge")
		}

		// All files should exist under lowercase paths
		expected := map[string]string{
			filepath.Join(lowerAddons, "modupper.pbo"): "upper-data",
			filepath.Join(lowerAddons, "modlower.pbo"): "lower-data",
			filepath.Join(lowerAddons, "allupper.pbo"): "all-upper-data",
			filepath.Join(lowerSub, "nestedupper.pbo"): "nested-upper",
			filepath.Join(lowerSub, "nestedlower.pbo"): "nested-lower",
		}
		for path, content := range expected {
			data, err := os.ReadFile(path)
			if err != nil {
				t.Errorf("expected merged file %s: %v", path, err)
				continue
			}
			if string(data) != content {
				t.Errorf("file %s content mismatch: got %q, want %q", path, string(data), content)
			}
		}

		// Conflict file should exist
		if _, err := os.Stat(filepath.Join(lowerAddons, "conflict.pbo")); err != nil {
			t.Errorf("expected conflict.pbo to exist in lowerAddons: %v", err)
		}
	})

	t.Run("renameOrMerge Directory Merge", func(t *testing.T) {
		mergeTestDir := filepath.Join(tempDir, "rename_or_merge_test")
		srcDir := filepath.Join(mergeTestDir, "src_dir")
		dstDir := filepath.Join(mergeTestDir, "dst_dir")

		if err := os.MkdirAll(filepath.Join(srcDir, "SubDir"), 0o755); err != nil {
			t.Fatalf("failed to create src SubDir: %v", err)
		}
		if err := os.MkdirAll(filepath.Join(dstDir, "subdir"), 0o755); err != nil {
			t.Fatalf("failed to create dst subdir: %v", err)
		}

		if err := os.WriteFile(filepath.Join(srcDir, "FileA.txt"), []byte("data-a"), 0o644); err != nil {
			t.Fatalf("failed to write src FileA: %v", err)
		}
		if err := os.WriteFile(filepath.Join(srcDir, "SubDir", "FileB.txt"), []byte("data-b"), 0o644); err != nil {
			t.Fatalf("failed to write src FileB: %v", err)
		}
		if err := os.WriteFile(filepath.Join(dstDir, "filec.txt"), []byte("data-c"), 0o644); err != nil {
			t.Fatalf("failed to write dst filec: %v", err)
		}
		if err := os.WriteFile(filepath.Join(dstDir, "subdir", "filed.txt"), []byte("data-d"), 0o644); err != nil {
			t.Fatalf("failed to write dst filed: %v", err)
		}

		if err := renameOrMerge(srcDir, dstDir); err != nil {
			t.Fatalf("renameOrMerge failed: %v", err)
		}

		// srcDir should be deleted
		if _, err := os.Stat(srcDir); !os.IsNotExist(err) {
			t.Errorf("expected srcDir to be removed, but still exists")
		}

		// dstDir should contain all merged files
		expected := map[string]string{
			filepath.Join(dstDir, "filea.txt"):           "data-a",
			filepath.Join(dstDir, "subdir", "fileb.txt"): "data-b",
			filepath.Join(dstDir, "filec.txt"):           "data-c",
			filepath.Join(dstDir, "subdir", "filed.txt"): "data-d",
		}
		for path, content := range expected {
			data, err := os.ReadFile(path)
			if err != nil {
				t.Errorf("expected merged file %s: %v", path, err)
				continue
			}
			if string(data) != content {
				t.Errorf("file %s content mismatch: got %q, want %q", path, string(data), content)
			}
		}

		// Edge case: empty directory merge
		emptySrc := filepath.Join(mergeTestDir, "empty_src")
		if err := os.MkdirAll(emptySrc, 0o755); err != nil {
			t.Fatalf("failed to create emptySrc: %v", err)
		}
		if err := renameOrMerge(emptySrc, dstDir); err != nil {
			t.Errorf("expected nil for empty src merge, got %v", err)
		}
		if _, err := os.Stat(emptySrc); !os.IsNotExist(err) {
			t.Errorf("expected emptySrc to be removed after merge, but still exists")
		}

		// Edge case: single file rename
		fileSrc := filepath.Join(mergeTestDir, "single_src.txt")
		fileDst := filepath.Join(mergeTestDir, "single_dst.txt")
		if err := os.WriteFile(fileSrc, []byte("single"), 0o644); err != nil {
			t.Fatalf("failed to write fileSrc: %v", err)
		}
		if err := renameOrMerge(fileSrc, fileDst); err != nil {
			t.Errorf("expected nil for file rename, got %v", err)
		}
		if data, err := os.ReadFile(fileDst); err != nil || string(data) != "single" {
			t.Errorf("unexpected file content after rename: %s, err: %v", string(data), err)
		}

		// Edge case: file overwrite
		fileOverSrc := filepath.Join(mergeTestDir, "over_src.txt")
		fileOverDst := filepath.Join(mergeTestDir, "over_dst.txt")
		_ = os.WriteFile(fileOverSrc, []byte("new-data"), 0o644)
		_ = os.WriteFile(fileOverDst, []byte("old-data"), 0o644)
		if err := renameOrMerge(fileOverSrc, fileOverDst); err != nil {
			t.Errorf("expected nil for file overwrite, got %v", err)
		}
		if data, _ := os.ReadFile(fileOverDst); string(data) != "new-data" {
			t.Errorf("expected new-data in fileOverDst, got %s", string(data))
		}

		// Edge case: src == dst returns nil (including trailing slashes)
		if err := renameOrMerge(dstDir, dstDir); err != nil {
			t.Errorf("expected nil for src == dst, got %v", err)
		}
		if err := renameOrMerge(dstDir+string(filepath.Separator), dstDir); err != nil {
			t.Errorf("expected nil for src == dst with trailing separator, got %v", err)
		}

		// Edge case: non-existent src returns nil
		if err := renameOrMerge(filepath.Join(mergeTestDir, "non_existent"), dstDir); err != nil {
			t.Errorf("expected nil for non-existent src, got %v", err)
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
