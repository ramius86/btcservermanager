//go:build integration

package workshop

import (
	"context"
	"path/filepath"
	"testing"

	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	defer database.Close()

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	repo := NewRepository(database)
	ctx := t.Context()

	t.Run("WorkshopMod CRUD", func(t *testing.T) {
		testWorkshopModCRUD(t, repo, ctx)
	})

	t.Run("GetAllMods", func(t *testing.T) {
		testGetAllMods(t, repo, ctx)
	})

	t.Run("Delete Mod", func(t *testing.T) {
		testDeleteMod(t, repo, ctx)
	})
}

func testWorkshopModCRUD(t *testing.T, repo *Repository, ctx context.Context) {
	m := &WorkshopMod{
		ID:                 123456,
		Name:               "Test Mod",
		ServerType:         server.TypeArma3,
		InstallationStatus: InstallationNotInstalled,
		BiKeys:             []string{"test.bikey"},
	}

	err := repo.Save(ctx, m)
	if err != nil {
		t.Fatalf("failed to save mod: %v", err)
	}

	saved, err := repo.GetModByID(ctx, 123456)
	if err != nil {
		t.Fatalf("failed to get mod: %v", err)
	}

	if saved.Name != "Test Mod" {
		t.Errorf("expected Name 'Test Mod', got '%s'", saved.Name)
	}

	if len(saved.BiKeys) != 1 || saved.BiKeys[0] != "test.bikey" {
		t.Errorf("bikeys not saved correctly")
	}

	saved.Name = "Updated Mod"
	saved.InstallationStatus = InstallationFinished

	err = repo.Save(ctx, saved)
	if err != nil {
		t.Fatalf("failed to update mod: %v", err)
	}

	updated, _ := repo.GetModByID(ctx, 123456)
	if updated.Name != "Updated Mod" {
		t.Errorf("name not updated")
	}

	if updated.InstallationStatus != InstallationFinished {
		t.Errorf("status not updated")
	}
}

func testGetAllMods(t *testing.T, repo *Repository, ctx context.Context) {
	mods, err := repo.GetAllMods(ctx)
	if err != nil {
		t.Fatalf("failed to get all mods: %v", err)
	}

	if len(mods) == 0 {
		t.Error("expected at least one mod")
	}
}

func testDeleteMod(t *testing.T, repo *Repository, ctx context.Context) {
	err := repo.Delete(ctx, 123456)
	if err != nil {
		t.Fatalf("failed to delete mod: %v", err)
	}

	_, err = repo.GetModByID(ctx, 123456)
	if err == nil {
		t.Error("expected error getting deleted mod, got nil")
	}
}
