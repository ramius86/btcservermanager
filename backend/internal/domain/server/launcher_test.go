package server

import (
	"path/filepath"
	"reflect"
	"testing"
)

type launcherMockPathProvider struct{}

func (m *launcherMockPathProvider) GetServerPath(t Type) string                       { return "" }
func (m *launcherMockPathProvider) GetModsPath(t Type) string                         { return "" }
func (m *launcherMockPathProvider) GetModsBaseDir() string                            { return "/mods" }
func (m *launcherMockPathProvider) GetModInstallationPath(modID int64, t Type) string { return "" }
func (m *launcherMockPathProvider) GetModLinkPath(modName string, t Type) string      { return "" }
func (m *launcherMockPathProvider) GetServerKeysPath(t Type) string                   { return "" }
func (m *launcherMockPathProvider) GetServerKeyPath(keyName string, t Type) string    { return "" }
func (m *launcherMockPathProvider) GetScenariosBasePath() string                      { return "" }
func (m *launcherMockPathProvider) GetScenarioPath(scenarioName string) string        { return "" }
func (m *launcherMockPathProvider) GetConfigFilePath(t Type, fileName string) string {
	return "/config/" + fileName
}

func (m *launcherMockPathProvider) GetProfilesDirectoryPath() string {
	return "/profiles"
}
func (m *launcherMockPathProvider) GetServerExecutable(t Type) string { return "" }
func (m *launcherMockPathProvider) GetServerLogFile(t Type, id int64) string {
	return "/logs/server.log"
}
func (m *launcherMockPathProvider) GetHeadlessClientLogFile(sid int64, hid int) string { return "" }
func (m *launcherMockPathProvider) GetSteamCmdLogFile() string                         { return "" }
func (m *launcherMockPathProvider) GetSteamCmdExecutable() string                      { return "" }
func (m *launcherMockPathProvider) GetSteamCmdCacheFile() string                       { return "" }

func TestLauncher_GetArma3Parameters(t *testing.T) {
	t.Parallel()
	paths := &launcherMockPathProvider{}
	launcher := NewLauncher(paths, []string{"@additional"})

	s := &Arma3Server{
		Server: Server{
			ID:   1,
			Type: TypeArma3,
			Port: 2302,
		},
		ActiveMods: []int64{101, 102},
		ModNames: []ModInfo{
			{Name: "@mod1", ServerOnly: false},
			{Name: "@mod2", ServerOnly: false},
			{Name: "@server_mod1", ServerOnly: true},
		},
		ActiveDLCs: []string{"vn", "gm"},
	}

	params := launcher.getArma3Parameters(s)

	expectedParams := []string{
		"-port=2302",
		"-config=/config/ARMA3_1.cfg",
		"-profiles=/profiles",
		"-name=ARMA3_1",
		"-nosplash",
		"-skipIntro",
		"-world=empty",
		"-mod=@mod1;@mod2;vn;gm;@additional",
		"-serverMod=@server_mod1",
	}

	if !reflect.DeepEqual(params, expectedParams) {
		t.Errorf("Expected parameters %v, got %v", expectedParams, params)
	}
}

func TestLauncher_GetArma3Parameters_Advanced(t *testing.T) {
	t.Parallel()
	paths := &launcherMockPathProvider{}
	launcher := NewLauncher(paths, nil)

	limitFPS := 60
	maxMem := 4096
	cpuCount := 8
	exThreads := 7
	networkDiagInterval := 30

	s := &Arma3Server{
		Server: Server{
			ID:   1,
			Type: TypeArma3,
			Port: 2302,
		},
		LimitFPS:            &limitFPS,
		MaxMem:              &maxMem,
		CpuCount:            &cpuCount,
		ExThreads:           &exThreads,
		EnableHT:            true,
		DebugMode:           true,
		NetworkDiagInterval: &networkDiagInterval,
		LoadMissionToMemory: true,
	}

	params := launcher.getArma3Parameters(s)

	expectedParams := []string{
		"-port=2302",
		"-config=/config/ARMA3_1.cfg",
		"-profiles=/profiles",
		"-name=ARMA3_1",
		"-limitFPS=60",
		"-maxMem=4096",
		"-cpuCount=8",
		"-exThreads=7",
		"-enableHT",
		"-debug",
		"-networkDiagInterval=30",
		"-loadMissionToMemory",
		"-nosplash",
		"-skipIntro",
		"-world=empty",
	}

	if !reflect.DeepEqual(params, expectedParams) {
		t.Errorf("Expected parameters %v, got %v", expectedParams, params)
	}
}

func TestLauncher_GetReforgerParameters(t *testing.T) {
	t.Parallel()
	paths := &launcherMockPathProvider{}
	launcher := NewLauncher(paths, nil)

	interval := 5000
	s := &ReforgerServer{
		Server: Server{
			ID:   1,
			Type: TypeReforger,
			Port: 2001,
		},
		LogStats:           true,
		LogStatsIntervalMs: &interval,
	}

	params := launcher.getReforgerParameters(s)

	// Expected: actual parameters produced by getReforgerParameters
	expectedParams := []string{
		"-config", "/config/REFORGER_1.json",
		"-profile", "profile_1",
		"-addonDownloadDir", filepath.Join("/mods", "reforger"),
		"-maxFPS", "0",
		"-backendlog",
		"-logAppend",
		"-logStats", "5000",
	}

	if !reflect.DeepEqual(params, expectedParams) {
		t.Errorf("Expected parameters %v, got %v", expectedParams, params)
	}

	// Test sub-second interval
	intervalSub := 500
	s.LogStatsIntervalMs = &intervalSub
	params = launcher.getReforgerParameters(s)

	var found bool

	for i, p := range params {
		hasValidInterval := i+1 < len(params) && params[i+1] == "500"
		if p == "-logStats" && hasValidInterval {
			found = true
			break
		}
	}

	if !found {
		t.Errorf("-logStats 500 not found in parameters")
	}
}
