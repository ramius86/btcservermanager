//go:build integration

package modpreset

import (
	"path/filepath"
	"testing"

	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	workshopRepo := workshop.NewRepository(database)
	repo := NewRepository(database, workshopRepo)

	// Pre-create a mod
	m := &workshop.WorkshopMod{ID: 100, Name: "Test Mod", ServerType: server.TypeArma3}
	_ = workshopRepo.Save(t.Context(), m)

	t.Run("ModPreset CRUD", func(t *testing.T) {
		p := &ModPreset{
			Name: "Test Preset",
			Type: server.TypeArma3,
			Mods: []workshop.WorkshopMod{*m},
		}

		err := repo.Save(t.Context(), p)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		saved, err := repo.GetPresetByID(t.Context(), p.ID)
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if saved.Name != "Test Preset" {
			t.Errorf("expected Test Preset, got %s", saved.Name)
		}

		if len(saved.Mods) != 1 {
			t.Errorf("expected 1 mod, got %d", len(saved.Mods))
		}

		if !repo.ExistsByName(t.Context(), "Test Preset") {
			t.Error("ExistsByName should return true")
		}

		all, _ := repo.GetAllPresets(t.Context())
		if len(all) == 0 {
			t.Error("expected at least one preset")
		}

		err = repo.Delete(t.Context(), p.ID)
		if err != nil {
			t.Fatalf("failed to delete: %v", err)
		}
	})
}
