package db

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConnectAndMigrate(t *testing.T) {
	// Use a temp file instead of :memory: because Migrate() opens its own
	// dedicated connection. With :memory: each sql.Open() gets a separate,
	// empty in-memory database, so the migrations would not be visible to the
	// application connection. A temp file is shared across connections.
	tmpFile, err := os.CreateTemp("", "btctest-*.db")
	require.NoError(t, err)
	tmpFile.Close()
	defer os.Remove(tmpFile.Name())

	databaseURL := tmpFile.Name()

	db, err := Connect(databaseURL)
	require.NoError(t, err)
	defer db.Close()

	// Verify connection is alive
	err = db.Ping()
	assert.NoError(t, err)

	// Test migration
	err = Migrate(databaseURL)
	require.NoError(t, err)

	// Test migration again (should be no-op/ErrNoChange handled internally)
	err = Migrate(databaseURL)
	assert.NoError(t, err)

	// Verify a table exists (e.g., app_settings)
	var name string

	err = db.QueryRow("SELECT name FROM sqlite_master WHERE type='table' AND name='app_settings'").Scan(&name)
	assert.NoError(t, err)
	assert.Equal(t, "app_settings", name)
}

func TestConnect_Error(t *testing.T) {
	// sqlite doesn't fail easily on Open, but Ping might fail if URL is weird
	// or we can test an invalid driver if we were using something else.
	// For now, just test a non-writable path for a file-based DB.
	db, err := Connect("/nonexistent/path/to/db")
	if err == nil {
		db.Close()
		t.Error("expected error for nonexistent path")
	}
}
