//go:build integration

package installation

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

	repo := NewRepository(database)

	t.Run("Installation CRUD", func(t *testing.T) {
		si := &ServerInstallation{
			Type:               server.TypeArma3,
			Version:            "1.0",
			InstallationStatus: workshop.InstallationFinished,
			Branch:             BranchPublic,
			AvailableBranches:  []Branch{BranchPublic, BranchProfiling},
		}

		err := repo.Save(t.Context(), si)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		got, err := repo.GetInstallation(t.Context(), server.TypeArma3)
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if got.Version != "1.0" {
			t.Errorf("expected version 1.0, got %s", got.Version)
		}

		if len(got.AvailableBranches) != 2 {
			t.Errorf("expected 2 branches, got %d", len(got.AvailableBranches))
		}

		all, _ := repo.GetAllInstallations(t.Context())
		if len(all) < 1 {
			t.Error("expected installations in list")
		}
	})

	t.Run("Get Non-Existent", func(t *testing.T) {
		got, err := repo.GetInstallation(t.Context(), server.TypeDayZ)
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if got.InstallationStatus != workshop.InstallationNotInstalled {
			t.Errorf("expected not installed, got %s", got.InstallationStatus)
		}
	})
}
