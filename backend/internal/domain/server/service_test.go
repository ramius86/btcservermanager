package server_test

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"os"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

type MockBroadcaster struct {
	LastEvent   string
	LastPayload any
}

func (m *MockBroadcaster) Broadcast(eventType string, payload any) {
	m.LastEvent = eventType
	m.LastPayload = payload
}

func TestService(t *testing.T) {
	tempDir := t.TempDir()

	// DB Setup
	dbPath := filepath.Join(tempDir, "test.db")

	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	defer database.Close()

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	// Config & Paths Setup
	cfg := &config.Config{
		StoragePath:   tempDir,
		LogsDirectory: filepath.Join(tempDir, "logs"),
	}
	paths := config.NewPaths(cfg)

	// Dependencies
	repo := server.NewRepository(database)
	launcher := server.NewLauncher(paths, nil)
	pm := server.NewProcessManager(paths, launcher, false)
	mb := &MockBroadcaster{}
	pm.SetBroadcaster(mb)

	cg, err := server.NewConfigGenerator(paths)
	if err != nil {
		t.Fatalf("failed to create config generator: %v", err)
	}

	svc := server.NewService(repo, pm, cg, nil)

	t.Run("Create and Get Server", func(t *testing.T) {
		s := &server.Arma3Server{
			Server: server.Server{
				Type: server.TypeArma3,
				Name: "Service Test",
			},
		}

		created, err := svc.CreateServer(t.Context(), s)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}

		a3 := created.(*server.Arma3Server)
		if a3.ID == 0 {
			t.Fatal("expected non-zero ID")
		}

		// Verify file creation (ConfigGenerator)
		configPath := paths.GetConfigFilePath(server.TypeArma3, "ARMA3_1.cfg")
		if _, err := os.Stat(configPath); os.IsNotExist(err) {
			t.Errorf("config file not created at %s", configPath)
		}

		// GetServer
		got, err := svc.GetServer(t.Context(), a3.ID)
		if err != nil {
			t.Fatalf("failed to get server: %v", err)
		}

		if got.(*server.Arma3Server).Name != "Service Test" {
			t.Errorf("expected Name 'Service Test', got '%s'", got.(*server.Arma3Server).Name)
		}
	})

	t.Run("Update Server", func(t *testing.T) {
		servers, _ := svc.GetAllServers(t.Context())
		a3 := servers[0].(*server.Arma3Server)
		a3.Name = "Updated Via Service"

		updated, err := svc.UpdateServer(t.Context(), a3)
		if err != nil {
			t.Fatalf("failed to update server: %v", err)
		}

		if updated.(*server.Arma3Server).Name != "Updated Via Service" {
			t.Errorf("name not updated")
		}
	})

	t.Run("Set Automatic Restart", func(t *testing.T) {
		servers, _ := svc.GetAllServers(t.Context())
		id := servers[0].(*server.Arma3Server).ID

		restartTime := "04:00"

		err := svc.SetAutomaticRestart(t.Context(), id, true, &restartTime)
		if err != nil {
			t.Fatalf("failed to set automatic restart: %v", err)
		}

		updated, _ := svc.GetServer(t.Context(), id)
		if !updated.(*server.Arma3Server).RestartAutomatically || *updated.(*server.Arma3Server).AutomaticRestartTime != "04:00" {
			t.Errorf("automatic restart settings not saved")
		}
	})

	t.Run("Server Lifecycle (Mocked)", func(t *testing.T) {
		// We can't easily start a real server, but we can check if it tries to start
		// and fails because the executable doesn't exist.
		// Or we could "fake" the executable path in config.
		servers, _ := svc.GetAllServers(t.Context())
		id := servers[0].(*server.Arma3Server).ID

		// This should fail because executable is missing, but it tests the service -> pm flow
		err := svc.StartServer(t.Context(), id)
		if err == nil {
			t.Error("expected error starting server with missing executable, got nil")
		}
	})
}
