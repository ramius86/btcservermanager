package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

type testEnv struct {
	svc          *Service
	executor     *Executor
	workshopRepo *workshop.Repository
}

func setupSteamCmdService(t *testing.T) *testEnv {
	tempDir := t.TempDir()
	cfg := &config.Config{StoragePath: tempDir, LogsDirectory: filepath.Join(tempDir, "logs")}
	paths := config.NewPaths(cfg)

	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	t.Cleanup(func() { database.Close() })

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	executor := &Executor{
		queue: make(chan *Job, 10),
		paths: paths,
	}
	t.Cleanup(func() {
		executor.logMutex.Lock()
		if executor.logFile != nil {
			_ = executor.logFile.Close()
			executor.logFile = nil
		}
		executor.logMutex.Unlock()
	})

	installationService := installation.NewService(installation.NewRepository(database))
	serverRepo := server.NewRepository(database)
	workshopRepo := workshop.NewRepository(database)
	serverService := server.NewService(serverRepo, nil, nil, workshopRepo)

	workshopService := workshop.NewService(workshop.ServiceDeps{
		Repo:                workshopRepo,
		ReforgerModProvider: serverService,
	})
	t.Cleanup(func() { workshopService.Stop() })

	svc := NewService(ServiceDeps{
		Executor:      executor,
		Paths:         paths,
		Installations: installationService,
		Workshop:      workshopService,
	})
	t.Cleanup(func() { svc.Stop() })

	return &testEnv{
		svc:          svc,
		executor:     executor,
		workshopRepo: workshopRepo,
	}
}

func TestService_Install(t *testing.T) {
	env := setupSteamCmdService(t)

	// Test InstallServer
	si := &installation.ServerInstallation{
		Type:   server.TypeArma3,
		Branch: installation.BranchPublic,
	}
	job := env.svc.InstallOrUpdateServer(si)

	// Trigger callbacks
	if job.OnSuccess != nil {
		job.OnSuccess()
	}
	if job.OnFailure != nil {
		job.OnFailure(workshop.ErrorInterrupted)
	}

	select {
	case job := <-env.executor.queue:
		if job.RelatedServer != server.TypeArma3 {
			t.Errorf("wrong server type in job: %s", job.RelatedServer)
		}
	default:
		t.Error("job not submitted to queue")
	}

	// Test InstallWorkshopMods
	mods := []workshop.WorkshopMod{
		{ID: 1, Name: "Mod1", ServerType: server.TypeArma3},
	}
	jobMods := env.svc.InstallOrUpdateWorkshopMods(mods)

	// Trigger callbacks for mods
	if jobMods.OnItemSuccess != nil {
		jobMods.OnItemSuccess(1)
	}
	if jobMods.OnItemFailure != nil {
		jobMods.OnItemFailure(1)
	}
	if jobMods.OnRetryWithFailedItems != nil {
		jobMods.OnRetryWithFailedItems([]int64{1})
	}
	if jobMods.OnSuccess != nil {
		jobMods.OnSuccess()
	}
	if jobMods.OnFailure != nil {
		jobMods.OnFailure(workshop.ErrorInterrupted)
	}

	select {
	case job := <-env.executor.queue:
		if len(job.RelatedWorkshopMods) != 1 {
			t.Errorf("expected 1 mod, got %d", len(job.RelatedWorkshopMods))
		}
	default:
		t.Error("job not submitted to queue")
	}
}

func TestService_Delegations(t *testing.T) {
	env := setupSteamCmdService(t)

	// Set progress in executor
	info := ItemInfo{ItemID: 123, Progress: 45.6}
	env.executor.itemInfo.Store("test-key", info)

	p := env.svc.GetProgress("test-key")
	if p != 45.6 {
		t.Errorf("expected progress 45.6, got %f", p)
	}

	ii := env.svc.GetItemInfo("test-key")
	if ii == nil || ii.ItemID != 123 {
		t.Errorf("expected item ID 123, got %v", ii)
	}

	all := env.svc.GetAllItemInfo()
	if len(all) == 0 {
		t.Error("expected non-empty item info map")
	}

	// Log in executor
	env.executor.writeLog("test log entry", false, "")
	logs := env.svc.GetRecentLogs()
	if !strings.Contains(logs, "test log entry") {
		t.Errorf("expected logs to contain 'test log entry', got %q", logs)
	}
}

func TestService_Handlers(t *testing.T) {
	env := setupSteamCmdService(t)

	// Save mod in workshop repo first
	mod := &workshop.WorkshopMod{
		ID:                 123,
		Name:               "Test Mod",
		ServerType:         server.TypeArma3,
		InstallationStatus: workshop.InstallationInProgress,
	}
	_ = env.workshopRepo.Save(t.Context(), mod)

	env.svc.handleItemSuccess(t.Context(), 123)
	time.Sleep(100 * time.Millisecond) // Wait for async worker
	saved, err := env.workshopRepo.GetModByID(t.Context(), 123)
	if err != nil {
		t.Fatalf("failed to fetch mod: %v", err)
	}
	if saved.InstallationStatus != workshop.InstallationFinished {
		t.Errorf("expected status FINISHED, got %s", saved.InstallationStatus)
	}

	env.svc.handleItemFailure(t.Context(), 123)
	saved, _ = env.workshopRepo.GetModByID(t.Context(), 123)
	if saved.InstallationStatus != workshop.InstallationError {
		t.Errorf("expected status ERROR, got %s", saved.InstallationStatus)
	}

	env.svc.notifyModInstallInProgress(t.Context(), 123)
	saved, _ = env.workshopRepo.GetModByID(t.Context(), 123)
	if saved.InstallationStatus != workshop.InstallationInProgress {
		t.Errorf("expected status INSTALLATION_IN_PROGRESS, got %s", saved.InstallationStatus)
	}
}

func TestService_Uninstall(t *testing.T) {
	env := setupSteamCmdService(t)

	// Update status to finished to simulate a finished installation
	err := env.svc.installations.UpdateStatus(t.Context(), server.TypeArma3, workshop.InstallationFinished)
	require.NoError(t, err)

	err = env.svc.UninstallServer(t.Context(), server.TypeArma3)
	assert.NoError(t, err)

	// Verify the installation was deleted
	si, err := env.svc.installations.GetInstallation(t.Context(), server.TypeArma3)
	assert.NoError(t, err)
	assert.Equal(t, workshop.InstallationNotInstalled, si.InstallationStatus)
}

func TestService_UpdateSteamCmd(t *testing.T) {
	env := setupSteamCmdService(t)
	env.executor.SetExecCommand(helperProcess("job_success"))

	job := env.svc.UpdateSteamCmd()
	require.NotNil(t, job)

	// Since Executor is fake in setupSteamCmdService (it's not started with run()),
	// we just verify that the job was submitted to the queue.
	select {
	case <-env.executor.queue:
	default:
		t.Error("job not submitted to queue")
	}
}

func TestService_BackgroundChecks(t *testing.T) {
	env := setupSteamCmdService(t)

	// Start background check
	env.svc.StartBackgroundUpdateCheck()
	time.Sleep(10 * time.Millisecond) // Let it run briefly
}
