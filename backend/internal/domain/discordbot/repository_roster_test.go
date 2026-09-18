package discordbot_test

import (
	"btcservermanager/internal/domain/discordbot"
	"context"
	"database/sql"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	_ "modernc.org/sqlite"
)

func setupRosterTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite", ":memory:")
	require.NoError(t, err)

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS discord_events (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			channel_id TEXT NOT NULL,
			message_id TEXT NOT NULL,
			title TEXT NOT NULL,
			date_time TEXT NOT NULL,
			game_type TEXT NOT NULL DEFAULT 'arma3',
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			reminder_sent INTEGER NOT NULL DEFAULT 0
		);

		CREATE TABLE IF NOT EXISTS discord_event_rosters (
			event_id   INTEGER PRIMARY KEY,
			data       TEXT NOT NULL,
			updated_at TEXT NOT NULL DEFAULT (datetime('now')),
			FOREIGN KEY (event_id) REFERENCES discord_events(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS discord_roster_templates (
			id          INTEGER PRIMARY KEY AUTOINCREMENT,
			name        TEXT NOT NULL,
			game_type   TEXT NOT NULL DEFAULT 'all',
			structure   TEXT NOT NULL,
			created_at  TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS discord_player_role_history (
			user_id      TEXT NOT NULL,
			player_name  TEXT NOT NULL,
			role         TEXT NOT NULL,
			game_type    TEXT NOT NULL DEFAULT 'all',
			play_count   INTEGER NOT NULL DEFAULT 1,
			last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
			PRIMARY KEY (user_id, role, game_type)
		);
	`)
	require.NoError(t, err)
	return db
}

func TestRepository_EventRoster(t *testing.T) {
	db := setupRosterTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	// Initial check: nil for non-existent event
	roster, err := repo.GetEventRoster(ctx, 42)
	assert.NoError(t, err)
	assert.Nil(t, roster)

	// Save roster
	testData := `{"eventId":42,"squads":[{"id":"squad-1","name":"ALPHA 1","slots":[]}]}`
	err = repo.SaveEventRoster(ctx, 42, testData)
	assert.NoError(t, err)

	// Retrieve roster
	roster, err = repo.GetEventRoster(ctx, 42)
	assert.NoError(t, err)
	require.NotNil(t, roster)
	assert.Equal(t, int64(42), roster.EventID)
	assert.Equal(t, testData, roster.Data)

	// Update roster
	updatedData := `{"eventId":42,"squads":[{"id":"squad-1","name":"ALPHA 1","slots":[{"id":"slot-1","role":"SL"}]}]}`
	err = repo.SaveEventRoster(ctx, 42, updatedData)
	assert.NoError(t, err)

	roster, err = repo.GetEventRoster(ctx, 42)
	assert.NoError(t, err)
	require.NotNil(t, roster)
	assert.Equal(t, updatedData, roster.Data)
}

func TestRepository_RosterTemplates(t *testing.T) {
	db := setupRosterTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	// Initial check: empty
	templates, err := repo.GetRosterTemplates(ctx)
	assert.NoError(t, err)
	assert.Empty(t, templates)

	// Save template
	tmpl, err := repo.SaveRosterTemplate(ctx, "Custom Fireteam", "arma3", `[{"name":"ALPHA"}]`)
	assert.NoError(t, err)
	require.NotNil(t, tmpl)
	assert.Equal(t, "Custom Fireteam", tmpl.Name)

	// List
	templates, err = repo.GetRosterTemplates(ctx)
	assert.NoError(t, err)
	assert.Len(t, templates, 1)
	assert.Equal(t, "Custom Fireteam", templates[0].Name)

	// Delete template
	err = repo.DeleteRosterTemplate(ctx, tmpl.ID)
	assert.NoError(t, err)

	templates, err = repo.GetRosterTemplates(ctx)
	assert.NoError(t, err)
	assert.Empty(t, templates)
}

func TestRepository_PlayerRoleHistory(t *testing.T) {
	db := setupRosterTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	// Record role usage
	records := []discordbot.PlayerRoleRecord{
		{UserID: "101", PlayerName: "Ramius", Role: "GM"},
		{UserID: "102", PlayerName: "Raven", Role: "SL"},
		{UserID: "103", PlayerName: "Dark", Role: "AT"},
	}
	err := repo.RecordPlayerRoleUsage(ctx, records, "reforger")
	assert.NoError(t, err)

	// Query stats
	stats, err := repo.GetPlayerRoleStats(ctx, "reforger")
	assert.NoError(t, err)
	assert.Len(t, stats, 3)

	// Record again to test increment
	err = repo.RecordPlayerRoleUsage(ctx, []discordbot.PlayerRoleRecord{
		{UserID: "101", PlayerName: "Ramius", Role: "GM"},
	}, "reforger")
	assert.NoError(t, err)

	stats, err = repo.GetPlayerRoleStats(ctx, "reforger")
	assert.NoError(t, err)
	var ramiusStat *discordbot.PlayerRoleStat
	for i := range stats {
		if stats[i].UserID == "101" && stats[i].Role == "GM" {
			ramiusStat = &stats[i]
			break
		}
	}
	require.NotNil(t, ramiusStat)
	assert.Equal(t, 2, ramiusStat.PlayCount)
}
