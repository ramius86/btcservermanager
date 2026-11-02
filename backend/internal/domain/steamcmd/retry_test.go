package steamcmd

import (
	"btcservermanager/internal/config"
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
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := hasSteamCMDError(tc.output); got != tc.want {
				t.Fatalf("hasSteamCMDError(%q) = %v, want %v", tc.output, got, tc.want)
			}
		})
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
