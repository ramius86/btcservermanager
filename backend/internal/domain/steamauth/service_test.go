package steamauth

import (
	"btcservermanager/internal/db"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAuthService(t *testing.T) {
	t.Setenv("SECRET_KEY", "dummy-key")

	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database)
	service := NewAuthService(repo)
	ctx := t.Context()

	t.Run("AuthService Operations", func(t *testing.T) {
		// Test IsAuthenticated when empty
		isAuth, err := service.IsAuthenticated(ctx)
		assert.NoError(t, err)
		assert.False(t, isAuth)

		// Test SaveAuthAccount
		auth := &SteamAuth{
			Username:        "testuser",
			Password:        "testpass",
			SteamGuardToken: "token123",
		}
		err = service.SaveAuthAccount(ctx, auth)
		require.NoError(t, err)

		// Test IsAuthenticated after save
		isAuth, err = service.IsAuthenticated(ctx)
		assert.NoError(t, err)
		assert.True(t, isAuth)

		// Test GetAuthAccount
		saved, err := service.GetAuthAccount(ctx)
		require.NoError(t, err)
		assert.Equal(t, "testuser", saved.Username)
		assert.Equal(t, "testpass", saved.Password)

		// Test ClearAuthAccount
		err = service.ClearAuthAccount(ctx)
		require.NoError(t, err)

		// Verify clear
		isAuth, err = service.IsAuthenticated(ctx)
		assert.NoError(t, err)
		assert.False(t, isAuth)
	})
}
