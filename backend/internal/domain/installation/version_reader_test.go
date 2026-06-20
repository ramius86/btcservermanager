package installation

import (
	"os"
	"path/filepath"
	"testing"
)

func TestReadBuildIDFromManifest(t *testing.T) {
	tempDir := t.TempDir()

	// 1. Neither exists -> should return empty string
	got := ReadBuildIDFromManifest(tempDir, 107410)
	if got != "" {
		t.Errorf("expected empty string, got %q", got)
	}

	// 2. Exist in root but invalid content
	rootPath := filepath.Join(tempDir, "appmanifest_107410.acf")
	err := os.WriteFile(rootPath, []byte(`"AppState" { "name" "Arma 3" }`), 0o644)
	if err != nil {
		t.Fatalf("failed to write file: %v", err)
	}
	got = ReadBuildIDFromManifest(tempDir, 107410)
	if got != "" {
		t.Errorf("expected empty string for invalid content, got %q", got)
	}

	// 3. Exist in root with valid build ID
	err = os.WriteFile(rootPath, []byte(`"AppState" { "buildid" "12345" }`), 0o644)
	if err != nil {
		t.Fatalf("failed to write file: %v", err)
	}
	got = ReadBuildIDFromManifest(tempDir, 107410)
	if got != "12345" {
		t.Errorf("expected buildid '12345', got %q", got)
	}

	// 4. Exist in steamapps subdirectory with valid build ID (should take precedence)
	steamappsDir := filepath.Join(tempDir, "steamapps")
	err = os.MkdirAll(steamappsDir, 0o755)
	if err != nil {
		t.Fatalf("failed to create steamapps dir: %v", err)
	}
	subPath := filepath.Join(steamappsDir, "appmanifest_107410.acf")
	err = os.WriteFile(subPath, []byte(`"AppState" { "buildid" "67890" }`), 0o644)
	if err != nil {
		t.Fatalf("failed to write file: %v", err)
	}

	got = ReadBuildIDFromManifest(tempDir, 107410)
	if got != "67890" {
		t.Errorf("expected buildid '67890' from subfolder, got %q", got)
	}
}
