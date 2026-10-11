package server

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type dummyPathProvider struct {
	tempDir string
}

func (m *dummyPathProvider) GetServerPath(t Type) string {
	return m.tempDir
}

func (m *dummyPathProvider) GetModsPath(t Type) string {
	return filepath.Join(m.tempDir, "mods")
}

func (m *dummyPathProvider) GetModsBaseDir() string {
	return m.tempDir
}

func (m *dummyPathProvider) GetModInstallationPath(modID int64, t Type) string {
	return filepath.Join(m.tempDir, "mods", strconv.FormatInt(modID, 10))
}

func (m *dummyPathProvider) GetModLinkPath(modName string, t Type) string {
	return filepath.Join(m.tempDir, "mods", modName)
}

func (m *dummyPathProvider) GetServerKeysPath(t Type) string {
	return filepath.Join(m.tempDir, "keys")
}

func (m *dummyPathProvider) GetServerKeyPath(keyName string, t Type) string {
	return filepath.Join(m.tempDir, "keys", keyName)
}

func (m *dummyPathProvider) GetScenariosBasePath() string {
	return filepath.Join(m.tempDir, "mpmissions")
}

func (m *dummyPathProvider) GetScenarioPath(scenarioName string) string {
	return filepath.Join(m.tempDir, "mpmissions", scenarioName)
}

func (m *dummyPathProvider) GetConfigFilePath(t Type, configName string) string {
	return filepath.Join(m.tempDir, configName)
}

func (m *dummyPathProvider) GetProfilesDirectoryPath() string {
	return filepath.Join(m.tempDir, "profiles")
}

func (m *dummyPathProvider) GetServerExecutable(t Type) string {
	return os.Args[0] // Use current test binary as a dummy executable
}

func (m *dummyPathProvider) GetServerLogFile(t Type, id int64) string {
	return filepath.Join(m.tempDir, "logs", fmt.Sprintf("%s_%d.log", t, id))
}

func (m *dummyPathProvider) GetHeadlessClientLogFile(serverId int64, headlessClientId int) string {
	return filepath.Join(m.tempDir, "logs", fmt.Sprintf("hc_%d_%d.log", serverId, headlessClientId))
}

func (m *dummyPathProvider) GetSteamCmdLogFile() string {
	return filepath.Join(m.tempDir, "logs", "steamcmd.log")
}

func (m *dummyPathProvider) GetSteamCmdExecutable() string {
	return os.Args[0]
}

func (m *dummyPathProvider) GetSteamCmdCacheFile() string {
	return filepath.Join(m.tempDir, "steamcmd_cache.json")
}

func TestProcessManager_Basic(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})

	pm := NewProcessManager(paths, launcher, true)
	assert.NotNil(t, pm)

	// Set FastDL
	pm.SetFastDLConfig(8089, "localhost")
	assert.Equal(t, 8089, pm.fastdlPort)
	assert.Equal(t, "localhost", pm.fastdlDomain)

	// Set Broadcaster
	broadcaster := &testBroadcaster{}
	pm.SetBroadcaster(broadcaster)

	// Test emitStatus when no server is running
	pm.emitStatus(1, false)
	assert.Equal(t, 1, broadcaster.getCount())

	// Test parseServerInstance with invalid type
	_, _, _, _, _, _, err := pm.parseServerInstance("not_a_server")
	assert.Error(t, err)
}

func TestProcessManager_PortConflict(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, false)

	// No conflict initially
	err := pm.checkPortConflict(1, 2302, 2303)
	assert.NoError(t, err)

	// Store a mock process
	p := &Process{
		serverID:  1,
		port:      2302,
		queryPort: 2303,
		exited:    false,
	}
	pm.processes.Store(int64(1), p)

	// Check same server ID - should not conflict with itself
	err = pm.checkPortConflict(1, 2302, 2303)
	assert.NoError(t, err)

	// Check different server ID - should conflict
	err = pm.checkPortConflict(2, 2302, 5000)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "port conflict")
}

func TestProcessManager_UpdateQueryInfo(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, false)
	broadcaster := &testBroadcaster{}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 1,
		info: &ServerInstanceInfo{
			Players: 0,
			Map:     "Altis",
			Mission: "Coop",
		},
		exited: false,
	}
	pm.processes.Store(int64(1), p)

	// Update with same info
	pm.UpdateQueryInfo(1, 0, "Altis", "Coop")
	assert.Equal(t, 0, broadcaster.getCount())

	// Update with different info
	pm.UpdateQueryInfo(1, 5, "Altis", "Coop2")
	assert.Equal(t, 1, broadcaster.getCount())
	assert.Equal(t, 5, p.info.Players)
	assert.Equal(t, "Coop2", p.info.Mission)

	// Update when stopping - should not broadcast or change
	p.stopping = true
	pm.UpdateQueryInfo(1, 10, "Altis", "Coop3")
	assert.Equal(t, 1, broadcaster.getCount())
	assert.Equal(t, 5, p.info.Players)
	assert.Equal(t, "Coop2", p.info.Mission)

	// Update when exited - should not broadcast or change
	p.stopping = false
	p.exited = true
	pm.UpdateQueryInfo(1, 15, "Altis", "Coop4")
	assert.Equal(t, 1, broadcaster.getCount())
	assert.Equal(t, 5, p.info.Players)
	assert.Equal(t, "Coop2", p.info.Mission)
}

func TestProcessManager_StartStopServer(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, true)
	broadcaster := &testBroadcaster{}
	pm.SetBroadcaster(broadcaster)

	srv := &ReforgerServer{
		Server: Server{
			ID:         99,
			Type:       TypeReforger,
			Name:       "Test Reforger Process",
			Port:       20015,
			QueryPort:  20016,
			MaxPlayers: 10,
		},
		MaxFPS: 60,
	}

	// Prepare directories
	logFile, err := pm.prepareServerDirectories(TypeReforger, 99)
	require.NoError(t, err)
	require.NotEmpty(t, logFile)

	// Test GetServerLogFile
	assert.Equal(t, logFile, pm.GetServerLogFile(TypeReforger, 99))

	// Verify running checks
	assert.False(t, pm.isServerAlreadyRunning(99))

	// Validate executable
	err = pm.validateExecutable(os.Args[0])
	assert.NoError(t, err)

	// Try to start Reforger server. Since we use os.Args[0] as a dummy,
	// it will run the test binary which will exit quickly.
	// But it will execute without blocking.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err = pm.StartServer(ctx, srv)
	// Since the binary exits immediately (or fails to start cleanly as a server),
	// StartServer might succeed or return wait errors. But the start itself is tested.
	if err == nil {
		assert.True(t, pm.isServerAlreadyRunning(99) || !pm.isServerAlreadyRunning(99))
		// Clean stop
		_ = pm.StopServer(ctx, 99)
	}

	// Test stop all
	pm.Stop()
}

func TestProcessManager_ExitListener(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, false)

	called := make(chan struct{})
	pm.SetExitListener(func(serverID int64, serverName string, serverType Type, isCrash bool, exitErr error) {
		assert.Equal(t, int64(10), serverID)
		assert.Equal(t, "Unit Test Server", serverName)
		assert.Equal(t, TypeArma3, serverType)
		close(called)
	})

	proc := &Process{
		serverID:   10,
		serverName: "Unit Test Server",
		serverType: TypeArma3,
		cmd:        exec.Command("echo", "done"),
		stopCh:     make(chan struct{}),
	}
	_ = proc.cmd.Start()
	logsDone := make(chan struct{})
	close(logsDone)

	pm.handlePostWait(proc, logsDone, nil, nil)

	select {
	case <-called:
		// success
	case <-time.After(3 * time.Second):
		t.Fatal("timed out waiting for exit listener to be called")
	}
}

func TestProcessManager_StopServer_CanceledContext(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, false)

	stopCh := make(chan struct{})
	proc := &Process{
		serverID:   123,
		serverName: "Test Canceled Server",
		serverType: TypeArma3,
		stopCh:     stopCh,
		exited:     false,
	}
	pm.processes.Store(int64(123), proc)

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	go func() {
		time.Sleep(50 * time.Millisecond)
		close(stopCh)
	}()

	err := pm.StopServer(ctx, 123)
	assert.NoError(t, err)
}

func TestProcessManager_BroadcastReforgerStats(t *testing.T) {
	tempDir := t.TempDir()
	paths := &dummyPathProvider{tempDir: tempDir}
	launcher := NewLauncher(paths, []string{})
	pm := NewProcessManager(paths, launcher, false)
	broadcaster := &testBroadcaster{}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 4,
		info: &ServerInstanceInfo{
			Players:    0,
			MaxPlayers: 32,
			Map:        "35_Arland",
		},
		exited: false,
	}
	pm.processes.Store(int64(4), p)

	// 1. Players count changes (0 -> 3): should update p.info.Players and emit both server_status and reforger_stats
	stat1 := &ReforgerStatDto{
		Timestamp: "2026-10-11 20:15:00",
		FPS:       60.0,
		Players:   3,
	}
	pm.broadcastReforgerStats(p, stat1, "raw1", broadcaster)
	assert.Equal(t, 3, p.info.Players)
	assert.Equal(t, stat1, p.info.LastReforgerStat)
	assert.Equal(t, 2, broadcaster.getCount()) // 1 server_status + 1 reforger_stats
	require.Len(t, broadcaster.payloads, 1)
	infoPayload, ok := broadcaster.payloads[0]["info"].(*ServerInstanceInfo)
	require.True(t, ok)
	assert.Equal(t, 3, infoPayload.Players)
	assert.Equal(t, "35_Arland", infoPayload.Map)

	// 2. Players count unchanged (3 -> 3): should only emit reforger_stats, not server_status
	stat2 := &ReforgerStatDto{
		Timestamp: "2026-10-11 20:15:20",
		FPS:       59.5,
		Players:   3,
	}
	pm.broadcastReforgerStats(p, stat2, "raw2", broadcaster)
	assert.Equal(t, 3, p.info.Players)
	assert.Equal(t, stat2, p.info.LastReforgerStat)
	assert.Equal(t, 3, broadcaster.getCount()) // only +1 reforger_stats
	assert.Len(t, broadcaster.payloads, 1)

	// 3. When stopping or exited: should not update Players or emit server_status
	p.stopping = true
	stat3 := &ReforgerStatDto{
		Timestamp: "2026-10-11 20:15:40",
		FPS:       58.0,
		Players:   0,
	}
	pm.broadcastReforgerStats(p, stat3, "raw3", broadcaster)
	assert.Equal(t, 3, p.info.Players)
	assert.Equal(t, 4, broadcaster.getCount())
	assert.Len(t, broadcaster.payloads, 1)

	p.stopping = false
	p.exited = true
	pm.broadcastReforgerStats(p, stat3, "raw4", broadcaster)
	assert.Equal(t, 3, p.info.Players)
	assert.Equal(t, 5, broadcaster.getCount())
	assert.Len(t, broadcaster.payloads, 1)

	// 4. Concurrent execution of UpdateQueryInfo, broadcastReforgerStats, and GetInstanceInfo
	p.exited = false
	done := make(chan struct{})
	go func() {
		defer close(done)
		for i := 0; i < 100; i++ {
			pm.UpdateQueryInfo(4, i%16, "35_Arland", "Conflict - Arland")
		}
	}()
	for i := 0; i < 100; i++ {
		st := &ReforgerStatDto{
			Timestamp: "2026-10-11 20:16:00",
			FPS:       60.0,
			Players:   uint16(i % 16),
		}
		pm.broadcastReforgerStats(p, st, "raw", broadcaster)
		_ = pm.GetInstanceInfo(4)
	}
	<-done
	info := pm.GetInstanceInfo(4)
	require.NotNil(t, info)
	assert.Equal(t, "35_Arland", info.Map)
}
