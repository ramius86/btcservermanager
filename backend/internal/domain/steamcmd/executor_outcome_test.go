package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"path/filepath"
	"strings"
	"testing"
)

/*
These fixtures are the real output of the ARMA3 runs from 2026-11-05. The
dashboard reported ERROR after SteamCMD had printed "Success! App '233780'
fully installed." twice, so every line that can move the outcome is replayed
here verbatim: the bootstrapper self-update, the convar echo, the login block,
the app_update states and the closing Success line.
*/

// realBootstrapUpdate is the bootstrapper replacing itself before SteamCMD
// starts. It is not the game install and must not be reported as such.
const realBootstrapUpdate = `Redirecting stderr to '/home/steam/.local/share/Steam/logs/stderr.txt'
ILocalize::AddFile() failed to load file "public/steambootstrapper_english.txt".
[  0%] Checking for available update...
[----] Downloading update (0 of 41,429 KB)...
[  0%] Downloading update (0 of 41,429 KB)...
[  7%] Downloading update (7,756 of 41,429 KB)...
[ 18%] Downloading update (12,693 of 41,429 KB)...
[100%] Downloading update (41,429 of 41,429 KB)...
[100%] Download Complete.
[----] Extracting package...
[----] Update complete, launching...
[----] Verifying installation...
`

// realLoginAndConvars is SteamCMD starting up: the convar echo contains
// "@ShutdownOnFailedCommand", i.e. the word "Failed".
const realLoginAndConvars = `steamcmd.sh[92]: Starting  /home/steam/.local/share/Steam/steamcmd/linux32/steamcmd
Logging directory: '/home/steam/.local/share/Steam/logs'
[  0%] Checking for available updates...
[----] Verifying installation...
UpdateUI: skip show logo
Steam Console Client (c) Valve Corporation - version 1792617903
-- type 'quit' to exit --
Loading Steam API...OK
Steam>"@NoPromptForPassword" = "1"
Steam>"@ShutdownOnFailedCommand" = "1"
Steam>
Steam>Logging in using username/password.
Logging in user 'btc_hal9000' [U:1:146618591] to Steam Public...OK
Waiting for client config...OK
Waiting for user info...OK
`

// realAttempt2Tail is the second attempt of the run: the verify went up to
// 91.69% and no byte count contains "504".
const realAttempt2Tail = ` Update state (0x5) verifying install, progress: 30.28 (1642104448 / 5423767960)
 Update state (0x5) verifying install, progress: 61.19 (3318900437 / 5423767960)
 Update state (0x5) verifying install, progress: 91.69 (4973184093 / 5423767960)
 Update state (0x0) unknown, progress: 0.00 (0 / 0)
Success! App '233780' fully installed.
Steam>Unloading Steam API...OK
`

// realAttempt1Tail is the first attempt of the same run. The verify reached
// 93.11% with 5049971015 bytes, which the old substring match read as an HTTP
// 504 and turned into a pointless retry of the whole install.
const realAttempt1Tail = ` Update state (0x5) verifying install, progress: 62.41 (3385001355 / 5423767960)
 Update state (0x5) verifying install, progress: 93.11 (5049971015 / 5423767960)
 Update state (0x0) unknown, progress: 0.00 (0 / 0)
Success! App '233780' fully installed.
Steam>Unloading Steam API...OK
`

type progressRecorder struct {
	events []ItemInfo
}

func (p *progressRecorder) Broadcast(eventType string, payload any) {
	if eventType != "install_progress" {
		return
	}

	m, ok := payload.(map[string]any)
	if !ok {
		return
	}

	info := ItemInfo{}
	if id, ok := m["itemId"].(int64); ok {
		info.ItemID = id
	}
	if status, ok := m["status"].(Status); ok {
		info.Status = status
	}
	if progress, ok := m["progress"].(float64); ok {
		info.Progress = progress
	}

	p.events = append(p.events, info)
}

func newTestExecutor(t *testing.T) *Executor {
	t.Helper()

	dir := t.TempDir()

	return &Executor{
		paths: config.NewPaths(&config.Config{
			StoragePath:   dir,
			LogsDirectory: filepath.Join(dir, "logs"),
		}),
	}
}

func itemInfoKeys(e *Executor) []string {
	var keys []string
	e.itemInfo.Range(func(key, _ any) bool {
		if k, ok := key.(string); ok {
			keys = append(keys, k)
		}

		return true
	})

	return keys
}

func parseLines(e *Executor, job *Job, output string) {
	for _, line := range strings.Split(strings.TrimRight(output, "\n"), "\n") {
		e.parseProgress(line, job)
	}
}

// TestOutcome_RealAttemptsSucceed replays both attempts of the failing run.
// Neither may be reported as failed, and neither may be retried.
func TestOutcome_RealAttemptsSucceed(t *testing.T) {
	attempts := map[string]string{
		"attempt 1 with a 504 in the byte count": realBootstrapUpdate + realLoginAndConvars + realAttempt1Tail,
		"attempt 2":                              realBootstrapUpdate + realLoginAndConvars + realAttempt2Tail,
	}

	for name, output := range attempts {
		t.Run(name, func(t *testing.T) {
			e := newTestExecutor(t)
			job := NewJob(JobInstallServer)
			job.RelatedServer = server.TypeArma3

			var successes, failures int
			job.OnSuccess = func() { successes++ }
			job.OnFailure = func(workshop.ErrorStatus) { failures++ }

			retry := e.handleAttemptResult(job, output, nil, 1, 10, "")

			if job.ErrorStatus != nil {
				t.Fatalf("a completed install must not be failed, got %v", *job.ErrorStatus)
			}
			if retry {
				t.Fatal("a completed install must not be retried")
			}
			if successes != 1 || failures != 0 {
				t.Fatalf("successes=%d failures=%d, want 1/0", successes, failures)
			}
		})
	}
}

// TestOutcome_RealSessionTimeline pins the progress the dashboard sees. The
// bootstrapper used to paint its own 41 MB update on the server and then jump
// back to 0%, so the timeline must start at the real app_update state.
func TestOutcome_RealSessionTimeline(t *testing.T) {
	e := &Executor{}
	rec := &progressRecorder{}
	e.SetBroadcaster(rec)

	job := NewJob(JobInstallServer)
	job.RelatedServer = server.TypeArma3

	parseLines(e, job, realBootstrapUpdate+realLoginAndConvars+realAttempt2Tail)

	want := []struct {
		status   Status
		progress float64
	}{
		{StatusVerifying, 30.28},
		{StatusVerifying, 61.19},
		{StatusVerifying, 91.69},
		{StatusFinished, 100},
	}

	if len(rec.events) != len(want) {
		t.Fatalf("got %d events, want %d: %+v", len(rec.events), len(want), rec.events)
	}

	for i, w := range want {
		got := rec.events[i]
		if got.Status != w.status || got.Progress != w.progress || got.ItemID != 233780 {
			t.Errorf("event %d = %+v (%s %.2f), want %s %.2f", i, got, got.Status, got.Progress, w.status, w.progress)
		}
	}

	if keys := itemInfoKeys(e); len(keys) != 1 || keys[0] != "server:"+string(server.TypeArma3) {
		t.Fatalf("itemInfo keys = %v, want only the server key", keys)
	}
}

// TestOutcome_BootstrapperDoesNotLeakProgress covers both real cases: a server
// job (the self-update used to be shown as the branch update) and a mod job
// (which used to emit a phantom item 0 and keep the log viewer marked live).
func TestOutcome_BootstrapperDoesNotLeakProgress(t *testing.T) {
	e := &Executor{}
	rec := &progressRecorder{}
	e.SetBroadcaster(rec)

	serverJob := NewJob(JobInstallServer)
	serverJob.RelatedServer = server.TypeArma3

	modJob := NewJob(JobInstallMods)
	modJob.RelatedWorkshopMods = []int64{1726494027}

	for _, line := range strings.Split(strings.TrimRight(realBootstrapUpdate, "\n"), "\n") {
		e.parseProgress(line, serverJob)
		e.parseProgress(line, modJob)
	}

	if len(rec.events) != 0 {
		t.Fatalf("bootstrapper lines emitted %d progress events: %+v", len(rec.events), rec.events)
	}
	if keys := itemInfoKeys(e); len(keys) != 0 {
		t.Fatalf("bootstrapper lines wrote itemInfo keys: %v", keys)
	}
}

// TestOutcome_AppUpdateStillReportsProgress makes sure dropping the bootstrapper
// did not silence the real install: "Update state (0x..)" must still drive it.
func TestOutcome_AppUpdateStillReportsProgress(t *testing.T) {
	e := &Executor{}
	rec := &progressRecorder{}
	e.SetBroadcaster(rec)

	job := NewJob(JobUpdateServer)
	job.RelatedServer = server.TypeArma3

	parseLines(e, job, ` Update state (0x3) reconfiguring, progress: 0.00 (0 / 0)
 Update state (0x61) downloading, progress: 0.00 (0 / 92824288)
 Update state (0x61) downloading, progress: 100.00 (92824288 / 92824288)
`)

	if len(rec.events) != 3 {
		t.Fatalf("got %d events, want 3: %+v", len(rec.events), rec.events)
	}

	want := []float64{0, 0, 100}
	for i, progress := range want {
		if rec.events[i].Status != StatusDownloading || rec.events[i].Progress != progress {
			t.Errorf("event %d = %s %.2f, want DOWNLOADING %.2f", i, rec.events[i].Status, rec.events[i].Progress, progress)
		}
	}
}

// TestOutcome_ConvarEchoVariants covers the quoted, unquoted, indented and CRLF
// forms SteamCMD uses when it echoes a convar it applied.
func TestOutcome_ConvarEchoVariants(t *testing.T) {
	lines := []string{
		`Steam>"@ShutdownOnFailedCommand" = "1"`,
		`Steam>@ShutdownOnFailedCommand = 1`,
		`   Steam>"@ShutdownOnFailedCommand" = "1"`,
		"Steam>\"@ShutdownOnFailedCommand\" = \"1\"\r",
		`Steam>"@NoPromptForPassword" = "1"`,
	}

	for _, line := range lines {
		output := line + "\nSuccess! App '233780' fully installed.\n"
		if hasSteamCMDError(output) {
			t.Errorf("convar echo %q counted as a failure", line)
		}
	}
}

// TestOutcome_CRLFOutput replays the whole run with Windows line endings.
func TestOutcome_CRLFOutput(t *testing.T) {
	output := strings.ReplaceAll(realBootstrapUpdate+realLoginAndConvars+realAttempt1Tail, "\n", "\r\n")

	if hasSteamCMDError(output) {
		t.Fatal("a CRLF log must not look like a failure")
	}
}

// TestOutcome_RealFailuresStillFail keeps the detection the case-insensitive
// scan was introduced for: real SteamCMD errors must still fail the job.
func TestOutcome_RealFailuresStillFail(t *testing.T) {
	cases := []struct {
		name   string
		output string
		want   workshop.ErrorStatus
		retry  bool
	}{
		{
			"no subscription",
			realLoginAndConvars + "ERROR! Failed to install app '233780' (No subscription).\n",
			workshop.ErrorGeneric,
			false,
		},
		{
			"state 0x202 after update job",
			realLoginAndConvars + "Error! App '233780' state is 0x202 after update job.\n",
			workshop.ErrorGeneric,
			false,
		},
		{
			"failed login",
			realLoginAndConvars + "FAILED (Invalid Password)\n",
			workshop.ErrorWrongAuth,
			false,
		},
		{
			"timeout",
			realLoginAndConvars + "ERROR! Failed to update app '233780' (Timeout).\n",
			workshop.ErrorTimeout,
			true,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			e := newTestExecutor(t)
			job := NewJob(JobUpdateServer)
			job.RelatedServer = server.TypeArma3

			var successes, failures int
			job.OnSuccess = func() { successes++ }
			job.OnFailure = func(workshop.ErrorStatus) { failures++ }

			retry := e.handleAttemptResult(job, tc.output, nil, 1, 10, "")

			if job.ErrorStatus == nil {
				t.Fatal("a real SteamCMD failure must not be reported as success")
			}
			if *job.ErrorStatus != tc.want {
				t.Fatalf("status = %v, want %v", *job.ErrorStatus, tc.want)
			}
			if retry != tc.retry {
				t.Fatalf("retry = %v, want %v", retry, tc.retry)
			}

			// A retriable failure is owned by the retry loop: OnFailure only
			// fires once the attempts are exhausted.
			wantFailures := 1
			if tc.retry {
				wantFailures = 0
			}
			if successes != 0 || failures != wantFailures {
				t.Fatalf("successes=%d failures=%d, want 0/%d", successes, failures, wantFailures)
			}
		})
	}
}

// TestOutcome_TransientMarkers separates what can clear on its own from what
// only looks like it: an HTTP code inside a byte count is not a network error.
func TestOutcome_TransientMarkers(t *testing.T) {
	cases := []struct {
		output string
		want   bool
	}{
		{" Update state (0x5) verifying install, progress: 93.11 (5049971015 / 5423767960)", false},
		{"progress: 50.2 (1502337489 / 5423767960)", false},
		{"Error code 0x503", false},
		{"HTTP Error 503 (Service Unavailable)", true},
		{"HTTP Error 502 Bad Gateway", true},
		{"Connection closed by peer", true},
		{"Download timed out", true},
		{"Rate limit exceeded", true},
		{"SQL error: no such column", false},
	}

	for _, tc := range cases {
		if got := hasTransientFailureMarker(tc.output); got != tc.want {
			t.Errorf("hasTransientFailureMarker(%q) = %v, want %v", tc.output, got, tc.want)
		}
	}
}

// TestOutcome_SuccessLines covers the two Success forms SteamCMD prints.
func TestOutcome_SuccessLines(t *testing.T) {
	cases := []struct {
		name   string
		line   string
		status Status
	}{
		{"fresh install", "Success! App '233780' fully installed.", StatusFinished},
		{"verify only", "Success! App '233780' already up to date.", StatusFinished},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			e := &Executor{}
			rec := &progressRecorder{}
			e.SetBroadcaster(rec)

			job := NewJob(JobInstallServer)
			job.RelatedServer = server.TypeArma3

			e.parseProgress(tc.line, job)

			if len(rec.events) != 1 {
				t.Fatalf("got %d events, want 1: %+v", len(rec.events), rec.events)
			}
			if got := rec.events[0]; got.Status != tc.status || got.Progress != 100 || got.ItemID != 233780 {
				t.Fatalf("event = %+v, want %s 100 for 233780", got, tc.status)
			}
		})
	}
}
