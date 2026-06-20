package steamcmd

import (
	"testing"
)

func BenchmarkParseProgress(b *testing.B) {
	e := &Executor{} // Minimal executor, sync.Map and channels are nil but parseProgress only uses itemInfo and emitters

	// Create a job
	job := NewJob(JobUpdateServer)
	job.RelatedServer = "arma3"

	// Sample lines from SteamCMD output
	lines := []string{
		"Update state (0x61) downloading, progress: 18.52 (1127040 / 6084812)",
		"Update state (0x81) verifying update, progress: 99.12 (6031200 / 6084812)",
		"Success. Downloaded item 583496184",
		"[ 18%] Downloading update (11,270 of 36,457 KB)...",
		"ERROR! Download item 583496184 failed (Failure).",
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		for _, line := range lines {
			e.parseProgress(line, job)
		}
	}
}

func BenchmarkParseProgress_Table(b *testing.B) {
	e := &Executor{}
	job := NewJob(JobUpdateServer)
	job.RelatedServer = "arma3"

	tests := []struct {
		name string
		line string
	}{
		{"AppProgress", "Update state (0x61) downloading, progress: 18.52 (1127040 / 6084812)"},
		{"ModSuccess", "Success. Downloaded item 583496184"},
		{"SelfUpdate", "[ 18%] Downloading update (11,270 of 36,457 KB)..."},
		{"ModError", "ERROR! Download item 583496184 failed (Failure)."},
	}

	for _, tt := range tests {
		b.Run(tt.name, func(b *testing.B) {
			b.ReportAllocs()
			for b.Loop() {
				e.parseProgress(tt.line, job)
			}
		})
	}
}
