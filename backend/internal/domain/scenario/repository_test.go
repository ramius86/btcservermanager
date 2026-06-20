//go:build integration

package scenario

import (
	"path/filepath"
	"testing"

	"btcservermanager/internal/db"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database)

	t.Run("Vanilla Scenarios", func(t *testing.T) {
		scenarios := []ReforgerScenario{
			{ID: "v1", Name: "Vanilla 1"},
		}

		err := repo.SaveVanillaScenarios(t.Context(), scenarios)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		got, _ := repo.GetVanillaReforgerScenarios(t.Context())
		if len(got) != 1 || got[0].ID != "v1" {
			t.Errorf("expected v1, got %v", got)
		}
	})

	t.Run("Mod Scenarios", func(t *testing.T) {
		scenarios := []ReforgerScenario{
			{ID: "m1", Name: "Mod Scenario 1", ModID: "mod1", ModName: "Mod 1", GameMode: "COOP", PlayerCount: 10},
		}

		err := repo.SaveModScenarios(t.Context(), "mod1", scenarios)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		got, _ := repo.GetModReforgerScenarios(t.Context(), []string{"mod1"})
		if len(got) != 1 || got[0].ID != "m1" {
			t.Errorf("expected m1, got %v", got)
		}
	})
}
