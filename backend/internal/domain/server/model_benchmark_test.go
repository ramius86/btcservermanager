package server

import (
	"encoding/json"
	"testing"
)

func BenchmarkServerJSON_Marshal(b *testing.B) {
	s := &Arma3Server{
		Server: Server{
			ID:          1,
			Type:        TypeArma3,
			Name:        "Ultimate Benchmark Server",
			Description: "A very long description to test memory allocation during serialization of large strings.",
			Port:        2302,
			QueryPort:   2303,
			MaxPlayers:  100,
		},
		BattlEye:         true,
		VonEnabled:       true,
		VerifySignatures: 2,
		Motd: []string{
			"Welcome to the benchmark!",
			"Rules: 1. No lagging.",
			"2. Enjoy the performance.",
		},
		Admins:          []string{"76561197960287930", "76561197960287931"},
		ActiveMods:      []int64{101, 102, 103, 104, 105, 106, 107, 108, 109, 110},
		HeadlessClients: []string{"127.0.0.1"},
		Missions: []Arma3Mission{
			{Template: "MP_Cound_01.Altis", Difficulty: "Regular"},
			{Template: "MP_Cound_02.Stratis", Difficulty: "Regular"},
		},
		DifficultySettings: &Arma3DifficultySettings{
			SkillAI:     0.7,
			PrecisionAI: 0.5,
		},
		NetworkSettings: &Arma3NetworkSettings{},
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_, _ = json.Marshal(s)
	}
}

func BenchmarkServerJSON_Unmarshal(b *testing.B) {
	s := &Arma3Server{
		Server: Server{
			ID:   1,
			Name: "Benchmark Server",
		},
		ActiveMods: []int64{1, 2, 3, 4, 5},
	}
	data, _ := json.Marshal(s)

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		var target Arma3Server
		_ = json.Unmarshal(data, &target)
	}
}
