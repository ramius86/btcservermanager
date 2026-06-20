package system

import (
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/logs"
	"btcservermanager/internal/domain/server"
	"os"
	"path/filepath"
	"testing"
	"time"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"

	"github.com/stretchr/testify/mock"
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
	// Placeholder for future tests
}
