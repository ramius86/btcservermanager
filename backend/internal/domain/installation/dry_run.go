package installation

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/system"
	"bufio"
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type ReforgerDryRunResult struct {
	Version   string
	Scenarios []scenario.ReforgerScenario
}

type DryRunService struct {
	config *config.Config
}

func NewDryRunService(cfg *config.Config) *DryRunService {
	return &DryRunService{
		config: cfg,
	}
}

// PerformDryRun starts the server temporarily to extract its version via A2S query.
func (s *DryRunService) PerformDryRun(serverType server.Type) (string, error) {
	if s.config.DebugMode {
		fmt.Printf("[DryRun] Starting dry run for %s...\n", serverType)
	}

	if serverType == server.TypeReforger {
		res, err := s.PerformReforgerDryRun()
		if err != nil {
			return "", err
		}
		return res.Version, nil
	}

	// 1. Find a free port
	port, err := s.findFreePort()
	if err != nil {
		return "", err
	}

	queryPort := port + 1

	// 2. Create temporary config
	configPath, err := s.createDryRunConfig(serverType, queryPort)
	if err != nil {
		return "", err
	}
	defer os.Remove(configPath)

	// 3. Prepare command
	exePath, err := s.getExecutablePath(serverType)
	if err != nil {
		return "", err
	}

	args, cleanup, err := s.getDryRunArgs(serverType, port, configPath)
	if err != nil {
		return "", err
	}
	defer cleanup()

	cmd := exec.Command(exePath, args...)
	cmd.Dir = filepath.Join(s.config.ServersDirectory, string(serverType))

	if s.config.DebugMode {
		fmt.Printf("[DryRun] Executing: %s %s\n", exePath, strings.Join(args, " "))
		fmt.Printf("[DryRun] Working Dir: %s\n", cmd.Dir)
	}

	// Capture stderr for diagnostics
	stderr, _ := cmd.StderrPipe()

	// Start the server
	err = cmd.Start()
	if err != nil {
		return "", fmt.Errorf("failed to start server for dry run: %w", err)
	}

	// Reap the process in the background so a killed dry-run server never turns
	// into a zombie holding its stdout/stderr pipes open.
	waitCh := make(chan error, 1)
	go func() { waitCh <- cmd.Wait() }()

	defer func() {
		if cmd.Process != nil {
			_ = cmd.Process.Kill()
		}
		select {
		case <-waitCh:
		case <-time.After(5 * time.Second):
		}
	}()

	// 4. Query for version (multiple attempts)
	if s.config.DebugMode {
		fmt.Printf("[DryRun] Waiting for server to respond on port %d...\n", queryPort)
	}

	addr := fmt.Sprintf("127.0.0.1:%d", queryPort)

	return s.waitForA2SResponse(addr, stderr, waitCh)
}

func (s *DryRunService) getExecutablePath(serverType server.Type) (string, error) {
	executableName := server.ServerExecutables[serverType]
	if os.PathSeparator == '\\' {
		executableName += ".exe"
	}

	exePath := filepath.Join(s.config.ServersDirectory, string(serverType), executableName)
	if _, err := os.Stat(exePath); err == nil {
		return exePath, nil
	}

	// Arma 3 on Linux ships the server binary with an _x64 suffix.
	if os.PathSeparator == '/' && !strings.HasSuffix(executableName, "_x64") {
		altPath := exePath + "_x64"
		if _, err := os.Stat(altPath); err == nil {
			return altPath, nil
		}
	}

	return "", fmt.Errorf("%s executable not found in %s", serverType, filepath.Dir(exePath))
}

func (s *DryRunService) getDryRunArgs(serverType server.Type, port int, configPath string) ([]string, func(), error) {
	switch serverType {
	case server.TypeArma3:
		return []string{"-port=" + strconv.Itoa(port), "-config=" + configPath, "-world=empty", "-nosplash", "-skipIntro"}, func() { /* no cleanup needed for Arma 3 */ }, nil
	case server.TypeDayZ, server.TypeDayZExp:
		return []string{"-port=" + strconv.Itoa(port), "-config=" + configPath, "-limitFPS=30", "-freezeCheck"}, func() { /* no cleanup needed for DayZ */ }, nil
	case server.TypeReforger:
		profileDir := filepath.Join(s.config.StoragePath, "temp", fmt.Sprintf("dryrun_%d", port))
		if err := os.MkdirAll(profileDir, 0o755); err != nil {
			return nil, nil, fmt.Errorf("failed to create profile directory: %w", err)
		}
		cleanup := func() {
			os.RemoveAll(profileDir)
		}
		return []string{"-config", configPath, "-profile", profileDir, "-nothrow", "-maxFPS=30"}, cleanup, nil
	default:
		return nil, nil, errors.New("unsupported server type for dry run")
	}
}

func (s *DryRunService) waitForA2SResponse(addr string, stderr io.Reader, waitCh <-chan error) (string, error) {
	stderrDone := make(chan struct{})
	s.scanStderrInBackground(stderr, stderrDone)

	for i := range 30 { // Wait up to 30 seconds
		time.Sleep(1 * time.Second)

		version, found, err := s.checkDryRunServerStatus(addr, i, waitCh)
		if err != nil {
			return "", err
		}
		if found {
			return version, nil
		}
	}

	return "", errors.New("timeout waiting for server response via A2S")
}

func (s *DryRunService) scanStderrInBackground(stderr io.Reader, done chan struct{}) {
	go func() {
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			if s.config.DebugMode {
				fmt.Printf("[DryRun][ServerStderr] %s\n", scanner.Text())
			}
		}
		if err := scanner.Err(); err != nil {
			if s.config.DebugMode {
				fmt.Printf("[DryRun][ServerStderr] Error scanning stderr: %v\n", err)
			}
		}
		close(done)
	}()
}

func (s *DryRunService) checkDryRunServerStatus(addr string, i int, waitCh <-chan error) (string, bool, error) {
	if info, err := system.QueryServerInfo(addr); err == nil && info.Version != "" {
		fmt.Printf("[DryRun] SUCCESS: Captured version %s\n", info.Version)
		return info.Version, true, nil
	}

	shouldLogProgress := s.config.DebugMode && i%5 == 0 && i > 0
	if shouldLogProgress {
		fmt.Printf("[DryRun] Still waiting (%ds)... addr: %s\n", i, addr)
	}

	// A process exit is observed through the background waiter: ProcessState is
	// only populated by Wait, which the deferred cleanup owns.
	select {
	case waitErr := <-waitCh:
		if waitErr != nil {
			return "", false, fmt.Errorf("server process exited prematurely during dry run: %w", waitErr)
		}
		return "", false, errors.New("server process exited during dry run without reporting a version")
	default:
	}

	return "", false, nil
}

func (s *DryRunService) PerformReforgerDryRun() (*ReforgerDryRunResult, error) {
	if s.config.DebugMode {
		fmt.Printf("[DryRun] Starting combined dry run for Reforger (-listScenarios)...\n")
	}

	executableName := server.ServerExecutables[server.TypeReforger]
	if os.PathSeparator == '\\' {
		executableName += ".exe"
	}

	exePath := filepath.Join(s.config.ServersDirectory, string(server.TypeReforger), executableName)

	// Reforger needs a profile directory to avoid using default user folders
	profileDir := filepath.Join(s.config.StoragePath, "temp", "reforger_dryrun")
	if err := os.MkdirAll(profileDir, 0o755); err != nil {
		return nil, fmt.Errorf("failed to create profile directory: %w", err)
	}
	defer os.RemoveAll(profileDir)

	args := []string{"-listScenarios", "-logStats", "1", "-profile", profileDir, "-nothrow"}

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, exePath, args...)
	cmd.Dir = filepath.Join(s.config.ServersDirectory, string(server.TypeReforger))

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		return nil, fmt.Errorf("failed to start Reforger for dry run: %w", err)
	}

	version, scenarios := scenario.ParseReforgerOutput(io.MultiReader(stdout, stderr))

	if err := cmd.Wait(); err != nil {
		if s.config.DebugMode {
			fmt.Printf("[DryRun] Reforger finished with: %v\n", err)
		}
	}

	if version == "" {
		return nil, errors.New("failed to extract Reforger version from logs")
	}

	return &ReforgerDryRunResult{
		Version:   version,
		Scenarios: scenarios,
	}, nil
}

func (s *DryRunService) findFreePort() (int, error) {
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.ParseIP("127.0.0.1"), Port: 0})
	if err != nil {
		return 0, err
	}
	defer conn.Close()

	if addr, ok := conn.LocalAddr().(*net.UDPAddr); ok {
		return addr.Port, nil
	}
	return 0, errors.New("failed to cast local address to UDPAddr")
}

func (s *DryRunService) createDryRunConfig(t server.Type, queryPort int) (string, error) {
	serverPath := filepath.Join(s.config.ServersDirectory, string(t))
	configPath := filepath.Join(serverPath, "DRY_RUN.cfg")

	var content string

	switch t {
	case server.TypeArma3:
		content = "hostname=\"DRY_RUN\";\n"
	case server.TypeDayZ, server.TypeDayZExp:
		content = fmt.Sprintf("hostname=\"DRY_RUN\";\nsteamQueryPort=%d;\n", queryPort)
	case server.TypeReforger:
		configPath = filepath.Join(serverPath, "DRY_RUN.json")
		content = fmt.Sprintf(`{"bindPort":%d,"a2s":{"address":"127.0.0.1","port":%d},"game":{"name":"DRY_RUN","scenarioId":"{ECC61978EDCC2B5A}Missions/23_Campaign.conf","visible":false}}`, queryPort-1, queryPort)
	}

	err := os.WriteFile(configPath, []byte(content), 0o600)

	return configPath, err
}
