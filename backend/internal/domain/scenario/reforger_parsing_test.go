package scenario

import (
	"strings"
	"testing"
)

func TestParseReforgerOutput(t *testing.T) {
	t.Parallel()
	output := `
14:15:22 [INFO   ] Arma Reforger Server 1.2.0.123 (64-bit)
14:15:22 [INFO   ] Arguments: -listScenarios -nothrow -profile C:\Temp
14:15:25 [INFO   ] --------------------------------------------------
14:15:25 [INFO   ] OFFICIAL SCENARIOS
14:15:25 [INFO   ] --------------------------------------------------
14:15:25 [INFO   ] {ECC61978EDCC2B5A}Missions/23_Campaign.conf (Conflict)
14:15:25 [INFO   ] {59AD593410F960CF}Missions/Main_Menu.conf (Main Menu)
14:15:25 [INFO   ] --------------------------------------------------
14:15:25 [INFO   ] MODDED SCENARIOS
14:15:25 [INFO   ] --------------------------------------------------
14:15:25 [INFO   ] {ABC1234567890DEF}Missions/Mod_Scenario.conf (Modded Scenario)
14:15:25 [INFO   ] --------------------------------------------------
`

	version, scenarios := ParseReforgerOutput(strings.NewReader(output))

	if version != "1.2.0.123" {
		t.Errorf("expected version 1.2.0.123, got %s", version)
	}

	if len(scenarios) != 3 {
		t.Errorf("expected 3 scenarios, got %d", len(scenarios))
	}

	// Check official
	var foundConflict bool
	for _, s := range scenarios {
		if s.ID == "{ECC61978EDCC2B5A}Missions/23_Campaign.conf" {
			foundConflict = true
			if !s.IsOfficial {
				t.Error("Conflict should be official")
			}
			if s.Name != "Conflict" {
				t.Errorf("expected name Conflict, got %s", s.Name)
			}
		}
	}
	if !foundConflict {
		t.Error("Conflict scenario not found")
	}

	// Check modded
	var foundMod bool
	for _, s := range scenarios {
		if s.ID == "{ABC1234567890DEF}Missions/Mod_Scenario.conf" {
			foundMod = true
			if s.IsOfficial {
				t.Error("Mod scenario should not be official")
			}
			if s.Name != "Modded Scenario" {
				t.Errorf("expected name Modded Scenario, got %s", s.Name)
			}
		}
	}
	if !foundMod {
		t.Error("Mod scenario not found")
	}
}

func TestParseReforgerOutput_NoScenarios(t *testing.T) {
	t.Parallel()
	output := `
14:15:22 [INFO   ] Arma Reforger Server 1.2.0.123 (64-bit)
14:15:25 [INFO   ] No scenarios found.
`
	version, scenarios := ParseReforgerOutput(strings.NewReader(output))

	if version != "1.2.0.123" {
		t.Errorf("expected version 1.2.0.123, got %s", version)
	}

	if len(scenarios) != 0 {
		t.Errorf("expected 0 scenarios, got %d", len(scenarios))
	}
}
