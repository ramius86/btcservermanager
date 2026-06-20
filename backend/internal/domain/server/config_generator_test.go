package server

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

type mockPathProvider struct {
	baseDir string
}

func (m *mockPathProvider) GetServerPath(t Type) string                       { return "" }
func (m *mockPathProvider) GetModsPath(t Type) string                         { return "" }
func (m *mockPathProvider) GetModsBaseDir() string                            { return "" }
func (m *mockPathProvider) GetModInstallationPath(modID int64, t Type) string { return "" }
func (m *mockPathProvider) GetModLinkPath(modName string, t Type) string      { return "" }
func (m *mockPathProvider) GetServerKeysPath(t Type) string                   { return "" }
func (m *mockPathProvider) GetServerKeyPath(keyName string, t Type) string    { return "" }
func (m *mockPathProvider) GetScenariosBasePath() string                      { return "" }
func (m *mockPathProvider) GetScenarioPath(scenarioName string) string        { return "" }
func (m *mockPathProvider) GetConfigFilePath(t Type, configName string) string {
	return filepath.Join(m.baseDir, configName)
}
func (m *mockPathProvider) GetProfilesDirectoryPath() string                   { return m.baseDir }
func (m *mockPathProvider) GetServerExecutable(t Type) string                  { return "" }
func (m *mockPathProvider) GetServerLogFile(t Type, id int64) string           { return "" }
func (m *mockPathProvider) GetHeadlessClientLogFile(sid int64, hid int) string { return "" }
func (m *mockPathProvider) GetSteamCmdLogFile() string                         { return "" }
func (m *mockPathProvider) GetSteamCmdExecutable() string                      { return "" }
func (m *mockPathProvider) GetSteamCmdCacheFile() string                       { return "" }

func TestConfigGeneratorGenerateArma3(t *testing.T) {
	t.Parallel()
	tempDir, err := os.MkdirTemp("", "config_test")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &mockPathProvider{baseDir: tempDir}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	server := &Arma3Server{
		Server: Server{
			ID:   1,
			Name: "Test Server",
		},
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	// Check if ARMA3_1.cfg exists
	cfgPath := filepath.Join(tempDir, "ARMA3_1.cfg")

	content, err := os.ReadFile(cfgPath)
	if err != nil {
		t.Fatalf("Failed to read generated config: %v", err)
	}

	if !strings.Contains(string(content), "hostname = \"Test Server\"") {
		t.Errorf("Config missing hostname. Content: %s", string(content))
	}
}

func TestConfigGeneratorGenerateArma3_Advanced(t *testing.T) {
	t.Parallel()
	tempDir, err := os.MkdirTemp("", "config_test_advanced")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &mockPathProvider{baseDir: tempDir}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	zeusLevel := 2
	lobbyIdle := 60
	cycleTime := 0.5
	cycleLimit := 500
	hardLimit := 5000
	enableKick := 1
	steamMaxData := 2048

	server := &Arma3Server{
		Server: Server{
			ID:   1,
			Name: "Advanced Server",
		},
		ZeusCompositionScriptLevel: &zeusLevel,
		LobbyIdleTimeout:           &lobbyIdle,
		AntiFloodCycleTime:         &cycleTime,
		AntiFloodCycleLimit:        &cycleLimit,
		AntiFloodCycleHardLimit:    &hardLimit,
		AntiFloodEnableKick:        &enableKick,
		NetworkSettings: &Arma3NetworkSettings{
			SteamProtocolMaxDataSize: &steamMaxData,
		},
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	cfgPath := filepath.Join(tempDir, "ARMA3_1.cfg")
	content, err := os.ReadFile(cfgPath)
	if err != nil {
		t.Fatalf("Failed to read generated config: %v", err)
	}

	configStr := string(content)
	expectedSubstrings := []string{
		"zeusCompositionScriptLevel = 2;",
		"lobbyIdleTimeout = 60;",
		"class AntiFlood",
		"cycleTime = 0.5;",
		"cycleLimit = 500;",
		"cycleHardLimit = 5000;",
		"enableKick = 1;",
		"steamProtocolMaxDataSize = 2048;",
	}

	for _, sub := range expectedSubstrings {
		if !strings.Contains(configStr, sub) {
			t.Errorf("Config missing expected substring: %s. Content: %s", sub, configStr)
		}
	}

	// Verify it is NOT in network config
	netPath := filepath.Join(tempDir, "ARMA3_1_network.cfg")
	netContent, err := os.ReadFile(netPath)
	if err != nil {
		t.Fatalf("Failed to read generated network config: %v", err)
	}
	if strings.Contains(string(netContent), "steamProtocolMaxDataSize") {
		t.Errorf("Network config should NOT contain steamProtocolMaxDataSize. Content: %s", string(netContent))
	}
}

func TestConfigGeneratorGenerateReforger(t *testing.T) {
	t.Parallel()
	tempDir, err := os.MkdirTemp("", "config_test_reforger")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &mockPathProvider{baseDir: tempDir}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	server := &ReforgerServer{
		Server: Server{
			ID:   2,
			Name: "Reforger Server",
		},
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	cfgPath := filepath.Join(tempDir, "REFORGER_2.json")

	content, err := os.ReadFile(cfgPath)
	if err != nil {
		t.Fatalf("Failed to read generated config: %v", err)
	}

	if !strings.Contains(string(content), "\"name\": \"Reforger Server\"") {
		t.Errorf("Config missing name. Content: %s", string(content))
	}
}

func TestConfigGeneratorEscaping(t *testing.T) {
	t.Parallel()
	tempDir, err := os.MkdirTemp("", "config_test_escaping")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &mockPathProvider{baseDir: tempDir}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	server := &ReforgerServer{
		Server: Server{
			ID:   3,
			Name: "My \"Cool\" Server",
		},
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	cfgPath := filepath.Join(tempDir, "REFORGER_3.json")

	content, err := os.ReadFile(cfgPath)
	if err != nil {
		t.Fatalf("Failed to read generated config: %v", err)
	}

	// Should be escaped as "My \"Cool\" Server"
	expected := "\"name\": \"My \\\"Cool\\\" Server\""
	if !strings.Contains(string(content), expected) {
		t.Errorf("Config missing correctly escaped name. Expected: %s, Got: %s", expected, string(content))
	}
}

func TestConfigGeneratorReforgerMissionHeader(t *testing.T) {
	t.Parallel()
	tempDir, err := os.MkdirTemp("", "config_test_reforger_mh")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &mockPathProvider{baseDir: tempDir}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	rawHeader := json.RawMessage(`{"m_ACE_Settings":{"m_ACE_Medical_Core":{"m_fBleedingRateScale":0.6}}}`)

	server := &ReforgerServer{
		Server: Server{
			ID:   4,
			Name: "Reforger MH Server",
		},
		MissionHeader: &rawHeader,
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	cfgPath := filepath.Join(tempDir, "REFORGER_4.json")
	content, err := os.ReadFile(cfgPath)
	if err != nil {
		t.Fatalf("Failed to read generated config: %v", err)
	}

	configStr := string(content)

	// 1. Verify it does NOT contain "&" in the missionHeader line
	if strings.Contains(configStr, `"missionHeader": &{`) {
		t.Errorf("Config contains invalid ampersand pointer format in missionHeader. Content: %s", configStr)
	}

	// 2. Verify it contains the actual content
	expectedSubstring := `"missionHeader": {"m_ACE_Settings":{"m_ACE_Medical_Core":{"m_fBleedingRateScale":0.6}}}`
	if !strings.Contains(configStr, expectedSubstring) {
		t.Errorf("Config missing expected missionHeader block. Expected to contain: %s. Got content: %s", expectedSubstring, configStr)
	}

	// 3. Verify it is a valid JSON document
	var parsed map[string]any
	if err := json.Unmarshal(content, &parsed); err != nil {
		t.Errorf("Generated Reforger config is not valid JSON: %v. Content: %s", err, configStr)
	}
}
