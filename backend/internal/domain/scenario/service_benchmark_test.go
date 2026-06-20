package scenario

import (
	"fmt"
	"strings"
	"testing"
)

func BenchmarkParseReforgerOutput(b *testing.B) {
	// Mock a realistic Reforger output with many scenarios
	var sb strings.Builder
	sb.WriteString("Arma Reforger Server 1.2.3.4\n")
	sb.WriteString("--------------------------------------------------\n")
	sb.WriteString("Official Scenarios\n")
	sb.WriteString("--------------------------------------------------\n")
	for i := 0; i < 20; i++ {
		fmt.Fprintf(&sb, "{GUID}Missions/OfficialMission_%c.conf (Official Name %c)\n", 65+i, 65+i)
	}
	sb.WriteString("--------------------------------------------------\n")
	sb.WriteString("Modded Scenarios\n")
	sb.WriteString("--------------------------------------------------\n")
	for i := 0; i < 50; i++ {
		fmt.Fprintf(&sb, "{MOD_GUID}Missions/ModdedMission_%c.conf (Modded Name %c)\n", 65+i, 65+i)
	}
	sb.WriteString("--------------------------------------------------\n")
	output := sb.String()

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_, _ = ParseReforgerOutput(strings.NewReader(output))
	}
}

func BenchmarkParseReforgerLine(b *testing.B) {
	line := "{GUID}Missions/MyVeryLongMissionPathAndName.conf (Mission Name)"

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_ = parseReforgerLine(line, true)
	}
}
