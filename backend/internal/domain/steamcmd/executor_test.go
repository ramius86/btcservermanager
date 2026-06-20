package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

type mockBroadcaster struct {
	lastEvent   string
	lastPayload any
}

func (m *mockBroadcaster) Broadcast(eventType string, payload any) {
	m.lastEvent = eventType
	m.lastPayload = payload
}

func TestExecutor_ParseProgress_WorkshopSuccess(t *testing.T) {
	e := &Executor{}
	mb := &mockBroadcaster{}
	e.SetBroadcaster(mb)

	line := "Success. Downloaded item 12345 to \"/path/to/mod\""
	job := &Job{}
	e.parseProgress(line, job)

	if mb.lastEvent != "install_progress" {
		t.Errorf("expected install_progress event, got %s", mb.lastEvent)
	}

	info := mb.lastPayload.(map[string]any)
	if info["itemId"] != int64(12345) || info["status"] != StatusFinished {
		t.Errorf("wrong info: %+v", info)
	}
}

func TestExecutor_ParseProgress_WorkshopSuccessWithTimestamp(t *testing.T) {
	e := &Executor{}
	mb := &mockBroadcaster{}
	e.SetBroadcaster(mb)

	line := "[18:34:21] Success. Downloaded item 54321 to \"/path/to/mod\""
	job := &Job{}
	e.parseProgress(line, job)

	info := mb.lastPayload.(map[string]any)
	if info["itemId"] != int64(54321) || info["status"] != StatusFinished {
		t.Errorf("wrong info: %+v", info)
	}
}

func TestExecutor_ParseProgress_AppSuccess(t *testing.T) {
	e := &Executor{}
	mb := &mockBroadcaster{}
	e.SetBroadcaster(mb)

	line := "Success! App '233780' fully installed."
	job := &Job{RelatedServer: server.TypeArma3}
	e.parseProgress(line, job)

	info := mb.lastPayload.(map[string]any)
	if info["status"] != StatusFinished {
		t.Error("expected status finished")
	}

	if info["itemId"] != int64(233780) {
		t.Errorf("expected server AppID 233780, got %v", info["itemId"])
	}
}

func TestExecutor_ParseProgress_UpdateProgress(t *testing.T) {
	e := &Executor{}
	mb := &mockBroadcaster{}
	e.SetBroadcaster(mb)

	line := "Update state (0x61) downloading, progress: 50.00 (100 / 200)"
	job := &Job{RelatedServer: server.TypeArma3}
	e.parseProgress(line, job)

	info := mb.lastPayload.(map[string]any)
	if info["progress"] != 50.0 {
		t.Errorf("expected 50.0 progress, got %v", info["progress"])
	}

	if info["itemId"] != int64(233780) {
		t.Errorf("expected server AppID 233780, got %v", info["itemId"])
	}
}

func TestExecutor_ParseProgress_WorkshopDownloadingWithTimestamp(t *testing.T) {
	e := &Executor{}
	mb := &mockBroadcaster{}
	e.SetBroadcaster(mb)

	line := "[18:34:21] Downloading item 98765 ..."
	job := &Job{}
	e.parseProgress(line, job)

	info := mb.lastPayload.(map[string]any)
	if info["itemId"] != int64(98765) || info["status"] != StatusDownloading {
		t.Errorf("wrong info: %+v", info)
	}
}

func TestExecutor_Helper_StripANSI(t *testing.T) {
	colored := "\x1b[31mHello\x1b[0m World"
	stripped := stripANSI(colored)
	if stripped != "Hello World" {
		t.Errorf("expected 'Hello World', got %q", stripped)
	}
}

func TestExecutor_Helper_EnsureQuitLine(t *testing.T) {
	lines1 := []string{"login anonymous"}
	res1 := ensureQuitLine(lines1)
	if len(res1) != 2 || res1[1] != "quit" {
		t.Errorf("expected quit to be appended, got %v", res1)
	}

	lines2 := []string{"login anonymous", "quit"}
	res2 := ensureQuitLine(lines2)
	if len(res2) != 2 || res2[1] != "quit" {
		t.Errorf("expected no duplicate quit, got %v", res2)
	}
}

func TestExecutor_Helper_BuildScriptLines(t *testing.T) {
	params := []string{"+login", "anonymous", "+app_update", "107410", "+force_install_dir", "C:\\My Folder"}
	res := buildScriptLines(params)

	expected := []string{
		"login anonymous",
		"app_update 107410",
		"force_install_dir \"C:\\My Folder\"",
		"quit",
	}

	if len(res) != len(expected) {
		t.Fatalf("expected %d lines, got %d: %v", len(expected), len(res), res)
	}

	for i := range res {
		if res[i] != expected[i] {
			t.Errorf("expected line %d to be %q, got %q", i, expected[i], res[i])
		}
	}
}

func TestExecutor_Helper_WriteTempScript(t *testing.T) {
	params := []string{"+login", "anonymous"}
	path, err := writeTempScript(params)
	if err != nil {
		t.Fatalf("writeTempScript failed: %v", err)
	}
	defer os.Remove(path)

	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("failed to read temp script: %v", err)
	}

	expectedContent := "login anonymous\nquit\n"
	// Normalize line endings to LF for cross-platform comparison
	normalized := strings.ReplaceAll(string(content), "\r\n", "\n")
	if normalized != expectedContent {
		t.Errorf("expected file content %q, got %q", expectedContent, normalized)
	}
}

func helperProcess(scenario string) func(ctx context.Context, name string, arg ...string) *exec.Cmd {
	return func(ctx context.Context, name string, arg ...string) *exec.Cmd {
		// Use standard os.Args[0] to run this test binary itself
		cs := []string{"-test.run=TestHelperProcess", "--"}
		cs = append(cs, arg...)
		// Using exec.Command instead of exec.CommandContext to avoid context cancellation in test helpers
		cmd := exec.Command(os.Args[0], cs...)
		cmd.Env = append(os.Environ(), "GO_WANT_HELPER_PROCESS=1", "HELPER_SCENARIO="+scenario)
		return cmd
	}
}

func TestHelperProcess(t *testing.T) {
	if os.Getenv("GO_WANT_HELPER_PROCESS") != "1" {
		return
	}
	// Output based on scenario
	scenario := os.Getenv("HELPER_SCENARIO")
	switch scenario {
	case "login_success":
		_, _ = os.Stdout.WriteString("Success! Logged in OK\n")
	case "login_fail":
		_, _ = os.Stdout.WriteString("Login Failed: invalid credentials\n")
	case "login_guard":
		_, _ = os.Stdout.WriteString("Steam Guard code required\n")
	case "login_nocache":
		_, _ = os.Stdout.WriteString("No cached credentials\n")
	case "job_success":
		_, _ = os.Stdout.WriteString("Update state (0x3) Downloading...\n")
		_, _ = os.Stdout.WriteString("Success! App '233780' fully installed.\n")
	default:
		_, _ = os.Stdout.WriteString("unknown scenario\n")
	}
	os.Exit(0)
}

func TestExecutor_TestLogin_Mocked(t *testing.T) {
	cfg := &config.Config{
		StoragePath: t.TempDir(),
	}
	paths := config.NewPaths(cfg)
	e := &Executor{
		paths: paths,
	}

	tests := []struct {
		scenario string
		wantErr  string
	}{
		{"login_success", ""},
		{"login_fail", "login failed: invalid credentials"},
		{"login_guard", "login failed: steam guard required"},
		{"login_nocache", "login failed: no password provided or found in cache"},
	}

	for _, tt := range tests {
		t.Run(tt.scenario, func(t *testing.T) {
			e.execCommand = helperProcess(tt.scenario)
			err := e.TestLogin(t.Context(), "user", "pass", "")
			if tt.wantErr == "" {
				if err != nil {
					t.Errorf("expected no error, got: %v", err)
				}
			} else {
				if err == nil || err.Error() != tt.wantErr {
					t.Errorf("expected error %q, got: %v", tt.wantErr, err)
				}
			}
		})
	}
}

func TestExecutor_ExecuteJob_Mocked(t *testing.T) {
	cfg := &config.Config{
		StoragePath: t.TempDir(),
	}
	paths := config.NewPaths(cfg)
	e := &Executor{
		paths: paths,
	}
	t.Cleanup(func() {
		e.logMutex.Lock()
		if e.logFile != nil {
			_ = e.logFile.Close()
			e.logFile = nil
		}
		e.logMutex.Unlock()
	})
	e.execCommand = helperProcess("job_success")

	job := &Job{
		RelatedServer: server.TypeArma3,
		Parameters:    []string{"+login", "anonymous", "+app_update", "107410"},
	}

	auth := &steamauth.SteamAuth{
		Username: "anonymous",
	}

	output, err := e.runSteamCMDCommand(job, auth, filepath.Join(t.TempDir(), "job.log"))
	if err != nil {
		t.Fatalf("runSteamCMDCommand failed: %v", err)
	}

	if !strings.Contains(output, "Success! App '233780' fully installed.") {
		t.Errorf("unexpected job output: %s", output)
	}
}
