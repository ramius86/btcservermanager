package server

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

type cbaMockPathProvider struct {
	mockPathProvider
	serverPath string
}

func (m *cbaMockPathProvider) GetServerPath(t Type) string { return m.serverPath }

func TestCBAModGeneration(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "cba_mod_test_real")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	mockPaths := &cbaMockPathProvider{
		mockPathProvider: mockPathProvider{baseDir: tempDir},
		serverPath:       tempDir,
	}

	gen, err := NewConfigGenerator(mockPaths)
	if err != nil {
		t.Fatal(err)
	}

	presetID := int64(10)
	server := &Arma3Server{
		Server: Server{
			ID:   1,
			Type: TypeArma3,
		},
		CBAPresetID: &presetID,
		CBAPreset: &CBAPreset{
			Content: "force ace_common_checkPBOs = 1;",
		},
	}

	err = gen.Generate(t.Context(), server)
	if err != nil {
		t.Fatalf("Generate failed: %v", err)
	}

	modDir := filepath.Join(tempDir, "@cba_server_1")
	addonDir := filepath.Join(modDir, "addons")

	// Check that cba_settings.pbo exists
	pboPath := filepath.Join(addonDir, "cba_settings.pbo")
	pboContent, err := os.ReadFile(pboPath)
	if err != nil {
		t.Fatalf("Failed to read cba_settings.pbo: %v", err)
	}

	// Verify that the PBO contains our configurations
	if !strings.Contains(string(pboContent), "\x00prefix\x00cba_settings_userconfig\x00\x00") {
		t.Errorf("pbo missing prefix property in header extension")
	}
	if !strings.Contains(string(pboContent), "config.cpp") {
		t.Errorf("pbo missing config.cpp filename")
	}
	if !strings.Contains(string(pboContent), "cba_settings.sqf") {
		t.Errorf("pbo missing cba_settings.sqf filename")
	}
	if !strings.Contains(string(pboContent), "force ace_common_checkPBOs = 1;") {
		t.Errorf("pbo missing cba_settings.sqf content")
	}

	// Verify that loose files were not created/were cleaned up
	if _, err := os.Stat(filepath.Join(addonDir, "config.cpp")); !os.IsNotExist(err) {
		t.Errorf("config.cpp should not exist as a loose file")
	}
	if _, err := os.Stat(filepath.Join(addonDir, "cba_settings.sqf")); !os.IsNotExist(err) {
		t.Errorf("cba_settings.sqf should not exist as a loose file")
	}
}
