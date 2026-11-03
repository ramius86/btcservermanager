package steamauth

import (
	"btcservermanager/internal/db"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database, testSecretKey)
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

	// The repository seals and opens with the key it was constructed with, not
	// with whatever SECRET_KEY happens to be exported at call time.
	t.Run("Repository key wins over the environment", func(t *testing.T) {
		t.Setenv("SECRET_KEY", otherSecretKey)

		if err := repo.Save(ctx, &SteamAuth{Username: "envuser", Password: "envpass"}); err != nil {
			t.Fatalf("failed to save: %v", err)
		}
		defer func() { _ = repo.Delete(ctx) }()

		saved, err := repo.GetAuth(ctx)
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}
		if saved.Password != "envpass" {
			t.Errorf("password not decrypted with the repository key, got %q", saved.Password)
		}
	})
}
