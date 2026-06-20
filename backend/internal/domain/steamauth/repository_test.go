package steamauth

import (
	"btcservermanager/internal/db"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	t.Setenv("SECRET_KEY", "dummy-key")

	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database)
	ctx := t.Context()

	t.Run("SteamAuth CRUD", func(t *testing.T) {
		auth := &SteamAuth{
			Username:        "steamuser",
			Password:        "steampass",
			SteamGuardToken: "token123",
		}

		err := repo.Save(ctx, auth)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		saved, err := repo.GetAuth(ctx)
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if saved.Username != "steamuser" {
			t.Errorf("expected steamuser, got %s", saved.Username)
		}

		if saved.Password != "steampass" {
			t.Errorf("password not decrypted correctly, got %s", saved.Password)
		}

		// Update
		saved.Username = "newuser"

		err = repo.Save(ctx, saved)
		if err != nil {
			t.Fatalf("failed to update: %v", err)
		}

		updated, _ := repo.GetAuth(ctx)
		if updated.Username != "newuser" {
			t.Errorf("username not updated")
		}

		// Delete
		err = repo.Delete(ctx)
		if err != nil {
			t.Fatalf("failed to delete: %v", err)
		}

		empty, _ := repo.GetAuth(ctx)
		if empty.Username != "" {
			t.Error("expected empty auth after delete")
		}
	})
}
