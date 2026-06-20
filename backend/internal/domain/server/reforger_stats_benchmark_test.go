package server

import (
	"testing"
)

func BenchmarkParseReforgerStatLine(b *testing.B) {
	// A typical heavy log line from Arma Reforger
	line := "DEFAULT : FPS: 120.1, Mem: 4507432 kB, Player: 0, AI: 1150, Veh: 0 (5), Proj (S: 0 | 0), RplItemsS: 410"

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		ParseReforgerStatLine("2025-01-30 20:32:50", line)
	}
}

func BenchmarkParseReforgerStatLine_IgnoredLine(b *testing.B) {
	// A line that should be quickly rejected
	line := "SYSTEM : Server started successfully"

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		ParseReforgerStatLine("2025-01-30 20:32:50", line)
	}
}
