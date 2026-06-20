package server_test

import (
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestServiceNilProcessManager(t *testing.T) {
	tempDir := t.TempDir()
	dbPath := filepath.Join(tempDir, "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	db.Migrate(dbPath)
	repo := server.NewRepository(database)

	svc := server.NewService(repo, nil, nil, nil)

	t.Run("GetInstanceInfo", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("GetInstanceInfo panicked: %v", r)
			}
		}()

		info := svc.GetInstanceInfo(1)
		if info != nil {
			t.Error("expected nil info")
		}
	})

	t.Run("UpdateServer", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("UpdateServer panicked: %v", r)
			}
		}()

		srv := &server.Arma3Server{Server: server.Server{ID: 1}}
		// This will likely fail with "record not found" if repo.Save is called,
		// but it shouldn't panic on processManager access.
		svc.UpdateServer(t.Context(), srv)
	})

	t.Run("GetLogPath", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("GetLogPath panicked: %v", r)
			}
		}()

		srv := &server.Arma3Server{Server: server.Server{ID: 1}}

		path := svc.GetLogPath(srv)
		if path != "" {
			t.Errorf("expected empty path, got %s", path)
		}
	})

	t.Run("DeleteServer", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("DeleteServer panicked: %v", r)
			}
		}()
		svc.DeleteServer(t.Context(), 1)
	})

	t.Run("StartServer", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("StartServer panicked: %v", r)
			}
		}()
		svc.StartServer(t.Context(), 1)
	})

	t.Run("StopServer", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("StopServer panicked: %v", r)
			}
		}()

		err := svc.StopServer(t.Context(), 1)
		if err == nil {
			t.Error("expected error due to nil pm, but got nil")
		}
	})

	t.Run("AddHeadlessClient", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("AddHeadlessClient panicked: %v", r)
			}
		}()
		svc.AddHeadlessClient(t.Context(), 1)
	})

	t.Run("RemoveHeadlessClient", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				t.Errorf("RemoveHeadlessClient panicked: %v", r)
			}
		}()

		err := svc.RemoveHeadlessClient(t.Context(), 1)
		if err == nil {
			t.Error("expected error due to nil pm, but got nil")
		}
	})
}
