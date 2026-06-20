package installation

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"io"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	for _, arg := range os.Args {
		if arg == "-listScenarios" {
			_, _ = os.Stdout.WriteString("Arma Reforger Server 1.2.0.123 (64-bit)\n")
			_, _ = os.Stdout.WriteString("--------------------------------------------------\n")
			_, _ = os.Stdout.WriteString("OFFICIAL SCENARIOS\n")
			_, _ = os.Stdout.WriteString("--------------------------------------------------\n")
			_, _ = os.Stdout.WriteString("{ECC61978EDCC2B5A}Missions/23_Campaign.conf (Conflict)\n")
			_, _ = os.Stdout.WriteString("--------------------------------------------------\n")
			_, _ = os.Stdout.WriteString("MODDED SCENARIOS\n")
			_, _ = os.Stdout.WriteString("--------------------------------------------------\n")
			_, _ = os.Stdout.WriteString("{ABC1234567890DEF}Missions/Mod_Scenario.conf (Modded Scenario)\n")
			_, _ = os.Stdout.WriteString("--------------------------------------------------\n")
			os.Exit(0)
		}
	}
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o755)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func TestDryRunService_FindFreePort(t *testing.T) {
	cfg := &config.Config{
		StoragePath:      t.TempDir(),
		ServersDirectory: t.TempDir(),
		DebugMode:        true,
	}
	svc := NewDryRunService(cfg)

	port, err := svc.findFreePort()
	if err != nil {
		t.Fatalf("failed to find free port: %v", err)
	}
	if port <= 0 {
		t.Errorf("expected positive port number, got %d", port)
	}
}

func TestDryRunService_GetExecutablePath(t *testing.T) {
	tempDir := t.TempDir()
	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: tempDir,
		DebugMode:        true,
	}
	svc := NewDryRunService(cfg)

	armaDir := filepath.Join(tempDir, string(server.TypeArma3))
	err := os.MkdirAll(armaDir, 0o755)
	if err != nil {
		t.Fatalf("failed to create arma directory: %v", err)
	}

	path, err := svc.getExecutablePath(server.TypeArma3)
	if err != nil {
		t.Fatalf("getExecutablePath failed: %v", err)
	}

	expectedExec := server.ServerExecutables[server.TypeArma3]
	if os.PathSeparator == '\\' {
		expectedExec += ".exe"
	}
	if !strings.HasSuffix(path, expectedExec) {
		t.Errorf("expected path to end with %s, got %s", expectedExec, path)
	}
}

func TestDryRunService_GetDryRunArgs(t *testing.T) {
	tempDir := t.TempDir()
	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: tempDir,
		DebugMode:        true,
	}
	svc := NewDryRunService(cfg)

	// Arma 3
	args, cleanup, err := svc.getDryRunArgs(server.TypeArma3, 2302, "config.cfg")
	if err != nil {
		t.Errorf("Arma 3 getDryRunArgs failed: %v", err)
	}
	if cleanup != nil {
		cleanup()
	}
	if len(args) == 0 {
		t.Error("expected non-empty args for Arma 3")
	}

	// DayZ
	args, cleanup, err = svc.getDryRunArgs(server.TypeDayZ, 2302, "config.cfg")
	if err != nil {
		t.Errorf("DayZ getDryRunArgs failed: %v", err)
	}
	if cleanup != nil {
		cleanup()
	}
	if len(args) == 0 {
		t.Error("expected non-empty args for DayZ")
	}

	// Reforger
	args, cleanup, err = svc.getDryRunArgs(server.TypeReforger, 2302, "config.json")
	if err != nil {
		t.Errorf("Reforger getDryRunArgs failed: %v", err)
	}
	if cleanup != nil {
		cleanup()
	}
	if len(args) == 0 {
		t.Error("expected non-empty args for Reforger")
	}

	// Unsupported
	_, _, err = svc.getDryRunArgs(server.Type("UNSUPPORTED"), 2302, "config.cfg")
	if err == nil {
		t.Error("expected error for unsupported server type")
	}
}

func TestDryRunService_CreateDryRunConfig(t *testing.T) {
	tempDir := t.TempDir()
	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: tempDir,
		DebugMode:        true,
	}
	svc := NewDryRunService(cfg)

	for _, st := range []server.Type{server.TypeArma3, server.TypeDayZ, server.TypeReforger} {
		dir := filepath.Join(tempDir, string(st))
		_ = os.MkdirAll(dir, 0o755)
	}

	// Arma 3 Config
	path, err := svc.createDryRunConfig(server.TypeArma3, 2303)
	if err != nil {
		t.Fatalf("failed to create Arma 3 config: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Errorf("expected config file to exist: %s", path)
	}
	_ = os.Remove(path)

	// DayZ Config
	path, err = svc.createDryRunConfig(server.TypeDayZ, 2303)
	if err != nil {
		t.Fatalf("failed to create DayZ config: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Errorf("expected config file to exist: %s", path)
	}
	_ = os.Remove(path)

	// Reforger Config
	path, err = svc.createDryRunConfig(server.TypeReforger, 2303)
	if err != nil {
		t.Fatalf("failed to create Reforger config: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Errorf("expected config file to exist: %s", path)
	}
	_ = os.Remove(path)
}

func TestDryRunService_PerformReforgerDryRun(t *testing.T) {
	tempDir := t.TempDir()
	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: tempDir,
		DebugMode:        true,
	}
	svc := NewDryRunService(cfg)

	// Create Reforger directory
	reforgerDir := filepath.Join(tempDir, string(server.TypeReforger))
	err := os.MkdirAll(reforgerDir, 0o755)
	require.NoError(t, err)

	// Copy test binary to Reforger executable path
	exeName := server.ServerExecutables[server.TypeReforger]
	if os.PathSeparator == '\\' {
		exeName += ".exe"
	}
	exePath := filepath.Join(reforgerDir, exeName)
	err = copyFile(os.Args[0], exePath)
	require.NoError(t, err)

	// Run Reforger Dry Run
	res, err := svc.PerformReforgerDryRun()
	require.NoError(t, err)
	assert.Equal(t, "1.2.0.123", res.Version)
	assert.Len(t, res.Scenarios, 2)
}
