package server

import (
	"testing"
)

func TestParseReforgerStatLine(t *testing.T) {
	tests := []struct {
		name      string
		timestamp string
		line      string
		expected  *ReforgerStatDto
	}{
		{
			name:      "Standard stats line with kB memory and single player",
			timestamp: "2025-01-30 20:32:50",
			line:      "DEFAULT : FPS: 120.1, Mem: 4507432 kB, Player: 3, AI: 1150, Veh: 2 (5), Proj (S: 0 | 4), RplItemsS: 45",
			expected: &ReforgerStatDto{
				Timestamp:     "2025-01-30 20:32:50",
				FPS:           120.1,
				MemoryMB:      4401.7890625, // 4507432 / 1024
				Players:       3,
				AI:            1150,
				Vehicles:      2,
				VehiclesTotal: 5,
				Projectiles:   4,
				RplItems:      45,
			},
		},
		{
			name:      "Stats line with MB memory and plural Players and Vehicles",
			timestamp: "2025-01-30 20:32:50",
			line:      "DEFAULT : FPS: 85.5, Mem: 2048 MB, Players: 8, AI: 200, Vehicles: 5 (10), Proj (S: 0 | 0), RplItems: 12",
			expected: &ReforgerStatDto{
				Timestamp:     "2025-01-30 20:32:50",
				FPS:           85.5,
				MemoryMB:      2048.0,
				Players:       8,
				AI:            200,
				Vehicles:      5,
				VehiclesTotal: 10,
				Projectiles:   0,
				RplItems:      12,
			},
		},
		{
			name:      "No timestamp and generic memory suffix",
			timestamp: "",
			line:      "DEFAULT : FPS: 60.0, Mem: 1024, Player: 0, AI: 10, Proj : 3",
			expected: &ReforgerStatDto{
				Timestamp:   "",
				FPS:         60.0,
				MemoryMB:    1024.0,
				Players:     0,
				AI:          10,
				Projectiles: 3,
			},
		},
		{
			name:      "Invalid line lacking FPS",
			timestamp: "2025-01-30 20:32:50",
			line:      "DEFAULT : Mem: 4507432 kB, Player: 3",
			expected:  nil,
		},
		{
			name:      "Invalid line lacking Mem",
			timestamp: "2025-01-30 20:32:50",
			line:      "DEFAULT : FPS: 120.1, Player: 3",
			expected:  nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ParseReforgerStatLine(tt.timestamp, tt.line)
			assertReforgerStats(t, tt.expected, got)
		})
	}
}

func assertReforgerStats(t *testing.T, expected, got *ReforgerStatDto) {
	t.Helper()
	if expected == nil {
		if got != nil {
			t.Errorf("expected nil result, got: %+v", got)
		}
		return
	}

	if got == nil {
		t.Fatal("expected non-nil result, got nil")
	}

	if got.Timestamp != expected.Timestamp {
		t.Errorf("expected Timestamp %q, got %q", expected.Timestamp, got.Timestamp)
	}
	if got.FPS != expected.FPS {
		t.Errorf("expected FPS %f, got %f", expected.FPS, got.FPS)
	}
	if got.MemoryMB != expected.MemoryMB {
		t.Errorf("expected MemoryMB %f, got %f", expected.MemoryMB, got.MemoryMB)
	}
	if got.Players != expected.Players {
		t.Errorf("expected Players %d, got %d", expected.Players, got.Players)
	}
	if got.AI != expected.AI {
		t.Errorf("expected AI %d, got %d", expected.AI, got.AI)
	}
	if got.Vehicles != expected.Vehicles {
		t.Errorf("expected Vehicles %d, got %d", expected.Vehicles, got.Vehicles)
	}
	if got.VehiclesTotal != expected.VehiclesTotal {
		t.Errorf("expected VehiclesTotal %d, got %d", expected.VehiclesTotal, got.VehiclesTotal)
	}
	if got.Projectiles != expected.Projectiles {
		t.Errorf("expected Projectiles %d, got %d", expected.Projectiles, got.Projectiles)
	}
	if got.RplItems != expected.RplItems {
		t.Errorf("expected RplItems %d, got %d", expected.RplItems, got.RplItems)
	}
}
