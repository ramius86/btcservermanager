package system

import (
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/logs"
	"btcservermanager/internal/domain/server"
	"context"
	"net"
	"os"
	"path/filepath"
	"testing"
	"time"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type MockBroadcaster struct {
	mock.Mock
}

func (m *MockBroadcaster) Broadcast(eventType string, payload any) {
	m.Called(eventType, payload)
}

type MockServerService struct {
	mock.Mock
}

func (m *MockServerService) GetAllServers() ([]any, error) {
	args := m.Called()
	return args.Get(0).([]any), args.Error(1)
}

func (m *MockServerService) GetInstanceInfo(id int64) *server.ServerInstanceInfo {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil
	}
	return args.Get(0).(*server.ServerInstanceInfo)
}

func (m *MockServerService) UpdateQueryInfo(id int64, players int, mapName, mission string) {
	m.Called(id, players, mapName, mission)
}

func (m *MockServerService) RestartServer(id int64) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestScheduler_CleanupLogs(t *testing.T) {
	tempDir := t.TempDir()
	logsDir := filepath.Join(tempDir, "logs")
	_ = os.MkdirAll(logsDir, 0o755)

	// Create some old and new log files
	oldLog := filepath.Join(logsDir, "old.log")
	newLog := filepath.Join(logsDir, "new.log")
	notLog := filepath.Join(logsDir, "test.txt")

	_ = os.WriteFile(oldLog, []byte("old content"), 0o644)
	_ = os.WriteFile(newLog, []byte("new content"), 0o644)
	_ = os.WriteFile(notLog, []byte("text content"), 0o644)

	// Set old.log modification time to 40 days ago
	oldTime := time.Now().AddDate(0, 0, -40)
	_ = os.Chtimes(oldLog, oldTime, oldTime)

	// DB & AppSettings Setup
	dbPath := filepath.Join(tempDir, "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	settingsRepo := appsettings.NewRepository(database)
	// Set retention to 30 days
	_ = settingsRepo.Save(t.Context(), &appsettings.AppSettings{LogRetentionDays: 30})

	sysSvc := NewService(ServiceDeps{AppRepo: settingsRepo, SteamAuth: nil, SteamAPIKey: ""})
	logManager := logs.NewLogManager(logsDir)
	scheduler := NewScheduler(SchedulerDeps{
		ServerService:   nil,
		WorkshopService: nil,
		SystemService:   sysSvc,
		LogManager:      logManager,
	})

	t.Run("CleanupLogs removes old files", func(t *testing.T) {
		scheduler.cleanupLogs()

		if _, err := os.Stat(oldLog); !os.IsNotExist(err) {
			t.Error("old.log should have been deleted")
		}

		if _, err := os.Stat(newLog); os.IsNotExist(err) {
			t.Error("new.log should NOT have been deleted")
		}

		if _, err := os.Stat(notLog); os.IsNotExist(err) {
			t.Error("test.txt should NOT have been deleted (not a .log)")
		}
	})
}

func TestScheduler_PeriodicTasks(t *testing.T) {
	scheduler := NewScheduler(SchedulerDeps{})
	scheduler.UpdateWorkshopInterval(120)

	scheduler.workshopIntervalMu.RLock()
	assert.Equal(t, 120*time.Minute, scheduler.workshopInterval)
	scheduler.workshopIntervalMu.RUnlock()

	// Minimum clamp to 5 minutes
	scheduler.UpdateWorkshopInterval(2)
	scheduler.workshopIntervalMu.RLock()
	assert.Equal(t, 5*time.Minute, scheduler.workshopInterval)
	scheduler.workshopIntervalMu.RUnlock()
}

func TestScheduler_StopIdempotent(t *testing.T) {
	scheduler := NewScheduler(SchedulerDeps{})

	// Calling Stop multiple times concurrently should not panic
	for i := 0; i < 10; i++ {
		go scheduler.Stop()
	}

	assert.NotPanics(t, func() {
		scheduler.Stop()
		scheduler.Stop()
	})
}

type mockServerRepo struct {
	server.RepositoryInterface
	servers []any
}

func (m *mockServerRepo) GetAllServers(_ context.Context) ([]any, error) {
	return m.servers, nil
}

type mockProcessManager struct {
	server.ServerManager
	mock.Mock
}

func (m *mockProcessManager) GetInstanceInfo(id int64) *server.ServerInstanceInfo {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil
	}
	return args.Get(0).(*server.ServerInstanceInfo)
}

func (m *mockProcessManager) UpdateQueryInfo(id int64, players int, mapName, mission string) {
	m.Called(id, players, mapName, mission)
}

func TestScheduler_QueryGameServers_Reforger(t *testing.T) {
	conn, err := net.ListenPacket("udp", "127.0.0.1:0")
	require.NoError(t, err)
	defer conn.Close()

	udpAddr := conn.LocalAddr().(*net.UDPAddr)
	queryPort := udpAddr.Port

	// Start a mock A2S UDP server responding with Reforger map and player count
	go func() {
		buf := make([]byte, 1400)
		n, remoteAddr, readErr := conn.ReadFrom(buf)
		if readErr != nil || n == 0 {
			return
		}
		resp := []byte{
			0xFF, 0xFF, 0xFF, 0xFF, // Header
			0x49, // 'I'
			17,   // Protocol
		}
		resp = append(resp, []byte("BTC Reforger")...)
		resp = append(resp, 0)
		resp = append(resp, []byte("35_Arland")...)
		resp = append(resp, 0)
		resp = append(resp, []byte("ArmaReforger")...)
		resp = append(resp, 0)
		resp = append(resp, []byte("Conflict - Arland")...)
		resp = append(resp, 0)
		resp = append(resp, 0x00, 0x00)     // ID
		resp = append(resp, 5, 32, 0)       // Players=5, Max=32, Bots=0
		resp = append(resp, 'd', 'l', 0, 1) // Type, Env, Vis, VAC
		resp = append(resp, []byte("1.2.1")...)
		resp = append(resp, 0)
		_, _ = conn.WriteTo(resp, remoteAddr)
	}()

	reforgerRunning := &server.ReforgerServer{
		Server: server.Server{
			ID:        4,
			Type:      server.TypeReforger,
			QueryPort: queryPort,
		},
	}
	reforgerNoPort := &server.ReforgerServer{
		Server: server.Server{
			ID:        5,
			Type:      server.TypeReforger,
			QueryPort: 0,
		},
	}
	reforgerStopped := &server.ReforgerServer{
		Server: server.Server{
			ID:        6,
			Type:      server.TypeReforger,
			QueryPort: queryPort,
		},
	}

	repo := &mockServerRepo{
		servers: []any{reforgerRunning, reforgerNoPort, reforgerStopped},
	}
	pm := &mockProcessManager{}
	pm.On("GetInstanceInfo", int64(4)).Return(&server.ServerInstanceInfo{})
	pm.On("GetInstanceInfo", int64(6)).Return(nil)
	pm.On("UpdateQueryInfo", int64(4), 5, "35_Arland", "Conflict - Arland").Return()

	srvSvc := server.NewService(repo, pm, nil, nil)
	scheduler := NewScheduler(SchedulerDeps{
		ServerService: srvSvc,
	})

	scheduler.queryGameServers()

	pm.AssertExpectations(t)
}
