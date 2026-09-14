package appsettings

import (
	"btcservermanager/internal/db"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, err := db.Connect(dbPath)
	require.NoError(t, err)
	defer database.Close()
	err = db.Migrate(dbPath)
	require.NoError(t, err)

	repo := NewRepository(database)
	ctx := t.Context()

	t.Run("AppSettings CRUD", func(t *testing.T) {
		// Initial default (since table is empty after migration)
		s, err := repo.GetSettings(ctx)
		assert.NoError(t, err)
		assert.Equal(t, 30, s.LogRetentionDays)
		assert.Equal(t, 1024, s.LogMaxTotalSizeMB)
		assert.Equal(t, "", s.DiscordAlertChannelID)
		assert.False(t, s.DiscordAlertServerOffline)
		assert.False(t, s.DiscordAlertModUpdates)
		assert.False(t, s.DiscordAlertGameUpdates)
		assert.Equal(t, 360, s.ModUpdateCheckIntervalMinutes)
		assert.Equal(t, 15, s.GameUpdateCheckIntervalMinutes)

		// Save (Insert)
		s.LogRetentionDays = 60
		s.LogMaxTotalSizeMB = 2048
		s.DiscordAlertChannelID = "1234567890"
		s.DiscordAlertServerOffline = true
		s.DiscordAlertModUpdates = true
		s.DiscordAlertGameUpdates = true
		s.ModUpdateCheckIntervalMinutes = 180
		s.GameUpdateCheckIntervalMinutes = 30

		err = repo.Save(ctx, s)
		assert.NoError(t, err)

		saved, err := repo.GetSettings(ctx)
		assert.NoError(t, err)
		assert.Equal(t, 60, saved.LogRetentionDays)
		assert.Equal(t, 2048, saved.LogMaxTotalSizeMB)
		assert.Equal(t, "1234567890", saved.DiscordAlertChannelID)
		assert.True(t, saved.DiscordAlertServerOffline)
		assert.True(t, saved.DiscordAlertModUpdates)
		assert.True(t, saved.DiscordAlertGameUpdates)
		assert.Equal(t, 180, saved.ModUpdateCheckIntervalMinutes)
		assert.Equal(t, 30, saved.GameUpdateCheckIntervalMinutes)

		// Update
		saved.LogRetentionDays = 90
		saved.DiscordAlertModUpdates = false
		saved.ModUpdateCheckIntervalMinutes = 60
		err = repo.Save(ctx, saved)
		assert.NoError(t, err)

		updated, err := repo.GetSettings(ctx)
		assert.NoError(t, err)
		assert.Equal(t, 90, updated.LogRetentionDays)
		assert.Equal(t, 2048, updated.LogMaxTotalSizeMB)
		assert.False(t, updated.DiscordAlertModUpdates)
		assert.Equal(t, 60, updated.ModUpdateCheckIntervalMinutes)
	})
}
