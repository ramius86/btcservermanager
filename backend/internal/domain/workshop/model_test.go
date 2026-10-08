package workshop

import (
	"testing"
)

func TestWorkshopMod_GetNormalizedName(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		mod      WorkshopMod
		expected string
	}{
		{
			name: "Standard mod name",
			mod: WorkshopMod{
				ID:   497660,
				Name: "CUP Units",
			},
			expected: "@CUP_Units",
		},
		{
			name: "Non-ASCII only Cyrillic",
			mod: WorkshopMod{
				ID:   123456,
				Name: "Русский Мод",
			},
			expected: "@123456",
		},
		{
			name: "Non-ASCII only Japanese",
			mod: WorkshopMod{
				ID:   123456,
				Name: "日本語",
			},
			expected: "@123456",
		},
		{
			name: "Empty name falls back to ID",
			mod: WorkshopMod{
				ID:   123456,
				Name: "",
			},
			expected: "@123456",
		},
		{
			name: "Whitespace-only name falls back to ID",
			mod: WorkshopMod{
				ID:   123456,
				Name: "   ",
			},
			expected: "@123456",
		},
		{
			name: "Underscores-only name falls back to ID",
			mod: WorkshopMod{
				ID:   123456,
				Name: "___",
			},
			expected: "@123456",
		},
		{
			name: "Symbols and punctuation only falls back to ID",
			mod: WorkshopMod{
				ID:   789,
				Name: "!@#$%^&*()-+=<>?",
			},
			expected: "@789",
		},
		{
			name: "Emojis only falls back to ID",
			mod: WorkshopMod{
				ID:   999,
				Name: "🚀🎮👾",
			},
			expected: "@999",
		},
		{
			name: "Mixed non-ASCII and ASCII retains ASCII portion",
			mod: WorkshopMod{
				ID:   111,
				Name: "Русский Mod",
			},
			expected: "@Mod",
		},
		{
			name: "Leading and trailing underscores stripped",
			mod: WorkshopMod{
				ID:   222,
				Name: " _Custom_Mod_ ",
			},
			expected: "@Custom_Mod",
		},
		{
			name: "Zero ID with empty name",
			mod: WorkshopMod{
				ID:   0,
				Name: "",
			},
			expected: "@0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			actual := tt.mod.GetNormalizedName()
			if actual != tt.expected {
				t.Errorf("GetNormalizedName() = %q, expected %q", actual, tt.expected)
			}
		})
	}
}

func TestArma3CDLC_Methods(t *testing.T) {
	t.Parallel()

	cdlcs := GetAllCDLCs()
	if len(cdlcs) != 7 {
		t.Fatalf("expected 7 CDLCs, got %d", len(cdlcs))
	}

	for _, cdlc := range cdlcs {
		if cdlc.GetID() != string(cdlc) {
			t.Errorf("GetID() = %q, expected %q", cdlc.GetID(), string(cdlc))
		}
		if cdlc.GetName() == "" || cdlc.GetName() == string(cdlc) {
			t.Errorf("GetName() for %q returned empty or raw ID: %q", cdlc, cdlc.GetName())
		}
	}

	custom := Arma3CDLC("custom_cdlc")
	if custom.GetName() != "custom_cdlc" {
		t.Errorf("expected unknown CDLC name to be %q, got %q", "custom_cdlc", custom.GetName())
	}
}
