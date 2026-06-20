package server

import (
	"strconv"
	"strings"
)

// Example line: 2025-01-30 20:32:50: DEFAULT : FPS: 120.1, ..., Mem: 4507432 kB, Player: 0, AI: 1150, Veh: 0 (5), Proj (S: 0 | 0).
func ParseReforgerStatLine(timestamp, line string) *ReforgerStatDto {
	// Look for typical Reforger stat markers
	if !strings.Contains(line, "FPS:") || !strings.Contains(line, "Mem:") {
		return nil
	}

	stat := &ReforgerStatDto{
		Timestamp:   timestamp,
		FPS:         extractFloat(line, "FPS: ", ","),
		MemoryMB:    extractMemoryMB(line),
		Players:     extractPlayers(line),
		AI:          uint16(extractFloat(line, "AI: ", ",")),
		Projectiles: extractProjectiles(line),
		RplItems:    extractRplItems(line),
	}

	extractVehicles(line, stat)

	return stat
}

func extractMemoryMB(line string) float64 {
	if strings.Contains(line, " kB") {
		return extractFloat(line, "Mem: ", " kB") / 1024.0
	} else if strings.Contains(line, " MB") {
		return extractFloat(line, "Mem: ", " MB")
	}
	return extractFloat(line, "Mem: ", ",")
}

func extractPlayers(line string) uint16 {
	players := extractFloat(line, "Player: ", ",")
	if players == 0 && !strings.Contains(line, "Player: 0") {
		players = extractFloat(line, "Players: ", ",")
	}
	return uint16(players)
}

func extractVehicles(line string, stat *ReforgerStatDto) {
	vehIdx := strings.Index(line, "Veh: ")
	if vehIdx == -1 {
		vehIdx = strings.Index(line, "Vehicles: ")
	}

	if vehIdx != -1 {
		stat.Vehicles = uint16(extractFloat(line[vehIdx:], ": ", " ("))
		stat.VehiclesTotal = uint16(extractFloat(line[vehIdx:], "(", ")"))
	}
}

func extractProjectiles(line string) uint16 {
	projIdx := strings.Index(line, "Proj ")
	if projIdx != -1 {
		projectiles := extractFloat(line[projIdx:], "| ", ")")
		if projectiles == 0 && !strings.Contains(line[projIdx:], "| 0") {
			// Fallback for simple "Projectiles: X"
			projectiles = extractFloat(line[projIdx:], ": ", ",")
		}
		return uint16(projectiles)
	}
	return 0
}

func extractRplItems(line string) uint32 {
	rplItems := extractFloat(line, "RplItemsS: ", ",")
	if rplItems == 0 && !strings.Contains(line, "RplItemsS: 0") {
		rplItems = extractFloat(line, "RplItems: ", ",")
	}
	return uint32(rplItems)
}

func extractFloat(line, prefix, suffix string) float64 {
	start := strings.Index(line, prefix)
	if start == -1 {
		return 0
	}

	start += len(prefix)

	end := len(line)

	if suffix != "" {
		relEnd := strings.Index(line[start:], suffix)
		if relEnd != -1 {
			end = start + relEnd
		}
	}

	val := strings.TrimSpace(line[start:end])
	// Remove common suffixes and punctuation
	val = strings.TrimSuffix(val, ",")
	val = strings.TrimSuffix(val, " kB")
	val = strings.TrimSuffix(val, " MB")
	val = strings.TrimSpace(val)

	f, _ := strconv.ParseFloat(val, 64)

	return f
}
