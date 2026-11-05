package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"os"
	"os/exec"
	"testing"
	"time"
)

func TestIsRetriable(t *testing.T) {
	e := &Executor{}

	cases := []struct {
		name   string
		status workshop.ErrorStatus
		output string
		want   bool
	}{
		{"wrong auth is not retried", workshop.ErrorWrongAuth, "Login Failed", false},
		{"io is not retried", workshop.ErrorIO, "Disk space", false},
		{"rate limit is retried", workshop.ErrorRateLimit, "Rate Limit Exceeded", true},
		{"timeout is retried", workshop.ErrorTimeout, "timed out", true},
		{"generic without a transient marker is not retried", workshop.ErrorGeneric, "Invalid app id", false},
		{"generic with a transient marker is retried", workshop.ErrorGeneric, "Connection closed by peer", true},
		{"generic with a timeout marker is retried", workshop.ErrorGeneric, "Request timed out", true},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			status := tc.status
			if got := e.isRetriable(&status, tc.output); got != tc.want {
				t.Fatalf("isRetriable(%q) = %v, want %v", tc.output, got, tc.want)
			}
		})
	}

	if !e.isRetriable(nil, "") {
		t.Fatal("a nil status must stay retriable: nothing indicates a permanent failure")
	}
}

func TestHasSteamCMDError(t *testing.T) {
	cases := []struct {
		name   string
		output string
		want   bool
	}{
		{"success line", "Success! App '233780' fully installed.", false},
		{"informational error word", "Error state 0x0 reported by the client", false},
		{"update required", "Update required", false},
		{"steamcmd failure", "ERROR! App '233780' state is 0x202 after update job.", true},
		{"failed", "FAILED to install app", true},
		{"timeout", "Download timed out", true},
		{
			"bootstrap translation warning printed on every linux start",
			`ILocalize::AddFile() failed to load file "public/steambootstrapper_english.txt".`,
			false,
		},
		{
			"successful install with the bootstrap warning",
			"ILocalize::AddFile() failed to load file \"public/steambootstrapper_english.txt\".\nSuccess! App '233780' fully installed.\n",
			false,
		},
		{
			"bootstrap warning must not hide a real failure later in the log",
			"ILocalize::AddFile() failed to load file \"public/steambootstrapper_english.txt\".\nERROR! Failed to install app '233780' (No subscription).\n",
			true,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := hasSteamCMDError(tc.output); got != tc.want {
				t.Fatalf("hasSteamCMDError(%q) = %v, want %v", tc.output, got, tc.want)
			}
		})
	}
}

func TestHandleResultAcceptsSuccessfulInstallWithBootstrapWarning(t *testing.T) {
	e := &Executor{}
	job := NewJob(JobInstallServer)
	job.RelatedServer = server.TypeArma3

	output := "Redirecting stderr to '/home/steam/.local/share/Steam/logs/stderr.txt'\n" +
		`ILocalize::AddFile() failed to load file "public/steambootstrapper_english.txt".` + "\n" +
		"[100%] Download Complete.\n" +
		"Success! App '233780' fully installed.\n"

	e.handleResult(output, job)

	if job.ErrorStatus != nil {
		t.Fatalf("a completed install must not be reported as failed, got %v", *job.ErrorStatus)
	}
}

// realSteamCMDConvarEcho is the exact start of a real run: SteamCMD echoes
// every convar it applies, and "@ShutdownOnFailedCommand" contains "failed".
const realSteamCMDConvarEcho = `Steam>"@NoPromptForPassword" = "1"` + "\n" +
	`Steam>"@ShutdownOnFailedCommand" = "1"` + "\n"

func TestHasSteamCMDErrorIgnoresConvarEcho(t *testing.T) {
	output := realSteamCMDConvarEcho +
		"Loading Steam API...OK\n" +
		"Update state (0x5) verifying install, progress: 91.69 (4973184093 / 5423767960)\n" +
		"Update state (0x0) unknown, progress: 0.00 (0 / 0)\n" +
		"Success! App '233780' fully installed.\n" +
		"Steam>Unloading Steam API...OK\n"

	if hasSteamCMDError(output) {
		t.Fatal("the @ShutdownOnFailedCommand echo must not count as a failure")
	}
}

func TestHandleResultAcceptsInstallAfterConvarEcho(t *testing.T) {
	e := &Executor{}
	job := NewJob(JobInstallServer)
	job.RelatedServer = server.TypeArma3

	e.handleResult(realSteamCMDConvarEcho+"Success! App '233780' fully installed.\n", job)

	if job.ErrorStatus != nil {
		t.Fatalf("a completed install must not be reported as failed, got %v", *job.ErrorStatus)
	}
}

func TestHasTransientFailureMarkerIgnoresProgressByteCounts(t *testing.T) {
	// 5049971015 contains "504": a substring match retried an install whose
	// verify had already reached 93%.
	progress := "Update state (0x5) verifying install, progress: 93.11 (5049971015 / 5423767960)"
	if hasTransientFailureMarker(progress) {
		t.Fatalf("a progress byte count must not look like a transient failure: %q", progress)
	}

	for _, output := range []string{
		"HTTP Error 503 (Service Unavailable)",
		"Connection closed by peer",
		"Download timed out",
	} {
		if !hasTransientFailureMarker(output) {
			t.Fatalf("hasTransientFailureMarker(%q) = false, want true", output)
		}
	}
}

func TestParseJobErrorCodeIsCaseInsensitive(t *testing.T) {
	cases := []struct {
		output string
		want   workshop.ErrorStatus
	}{
		{"invalid password", workshop.ErrorWrongAuth},
		{"LOGIN FAILED", workshop.ErrorWrongAuth},
		{"no disk space left", workshop.ErrorIO},
		{"rate limit exceeded", workshop.ErrorRateLimit},
		{"request timed out", workshop.ErrorTimeout},
		{"something else entirely", workshop.ErrorGeneric},
	}

	for _, tc := range cases {
		if got := parseJobErrorCode(tc.output); got != tc.want {
			t.Fatalf("parseJobErrorCode(%q) = %v, want %v", tc.output, got, tc.want)
		}
	}
}

func TestTestLoginSetsDeadlineOnSteamCMDCommand(t *testing.T) {
	logFile, err := os.CreateTemp(t.TempDir(), "steamcmd-*.log")
	if err != nil {
		t.Fatalf("creating log file: %v", err)
	}
	defer logFile.Close()

	var (
		called    bool
		hasDL     bool
		remaining time.Duration
	)

	e := &Executor{
		paths: config.NewPaths(&config.Config{}),
		// Pre-set logFile so TestLogin does not try to create a log directory.
		logFile: logFile,
		execCommand: func(ctx context.Context, name string, args ...string) *exec.Cmd {
			called = true
			deadline, ok := ctx.Deadline()
			hasDL = ok
			if ok {
				remaining = time.Until(deadline)
			}

			return exec.CommandContext(ctx, "definitely-not-a-real-steamcmd", args...)
		},
	}

	_ = e.TestLogin(context.Background(), "user", "pass", "")

	if !called {
		t.Fatal("TestLogin did not invoke the steamcmd command")
	}
	if !hasDL {
		t.Fatal("TestLogin ran steamcmd without a deadline: a login prompt can block the HTTP request forever")
	}
	if remaining <= 0 || remaining > loginTestTimeout {
		t.Fatalf("TestLogin deadline = %v, want it within (0, %v]", remaining, loginTestTimeout)
	}
}
