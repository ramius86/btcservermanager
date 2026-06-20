//go:build integration

package server

import (
	"encoding/json"
	"path/filepath"
	"testing"

	"btcservermanager/internal/db"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestRepository(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")

	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	defer database.Close()

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	repo := NewRepository(database)

	t.Run("Arma3Server CRUD", func(t *testing.T) {
		limitFPS := 60
		zeusLevel := 2
		antiFloodTime := 0.5

		s := &Arma3Server{
			Server: Server{
				Type:        TypeArma3,
				Name:        "Arma 3 Test",
				Description: "Test Description",
				Port:        2302,
				MaxPlayers:  64,
			},
			Persistent: true,
			Motd:       []string{"Welcome", "Have fun"},
			Admins:     []string{"76561198000000000"},
			DifficultySettings: &Arma3DifficultySettings{
				ThirdPersonView: 1,
				SkillAI:         0.7,
			},
			LimitFPS:                   &limitFPS,
			ZeusCompositionScriptLevel: &zeusLevel,
			AntiFloodCycleTime:         &antiFloodTime,
			EnableHT:                   true,
		}

		id, err := repo.Save(t.Context(), s)
		if err != nil {
			t.Fatalf("failed to save Arma3 server: %v", err)
		}

		if id == 0 {
			t.Fatal("expected non-zero ID")
		}

		// Verify GetByID
		saved, err := repo.GetServerByID(t.Context(), id)
		if err != nil {
			t.Fatalf("failed to get Arma3 server: %v", err)
		}

		a3, ok := saved.(*Arma3Server)
		if !ok {
			t.Fatalf("expected *Arma3Server, got %T", saved)
		}

		if a3.Name != "Arma 3 Test" {
			t.Errorf("expected Name 'Arma 3 Test', got '%s'", a3.Name)
		}

		if len(a3.Motd) != 2 {
			t.Errorf("expected 2 MOTD lines, got %d", len(a3.Motd))
		}

		if a3.DifficultySettings == nil || a3.DifficultySettings.SkillAI != 0.7 {
			t.Errorf("difficulty settings not saved correctly")
		}

		if a3.LimitFPS == nil || *a3.LimitFPS != 60 {
			t.Errorf("expected LimitFPS 60, got %v", a3.LimitFPS)
		}

		if a3.ZeusCompositionScriptLevel == nil || *a3.ZeusCompositionScriptLevel != 2 {
			t.Errorf("expected ZeusCompositionScriptLevel 2, got %v", a3.ZeusCompositionScriptLevel)
		}

		if a3.AntiFloodCycleTime == nil || *a3.AntiFloodCycleTime != 0.5 {
			t.Errorf("expected AntiFloodCycleTime 0.5, got %v", a3.AntiFloodCycleTime)
		}

		if !a3.EnableHT {
			t.Errorf("expected EnableHT true, got %v", a3.EnableHT)
		}

		// Update
		a3.Name = "Updated Name"
		a3.Motd = append(a3.Motd, "New Line")
		newFPS := 120
		a3.LimitFPS = &newFPS

		_, err = repo.Save(t.Context(), a3)
		if err != nil {
			t.Fatalf("failed to update Arma3 server: %v", err)
		}

		updated, _ := repo.GetServerByID(t.Context(), id)
		uA3 := updated.(*Arma3Server)
		if uA3.Name != "Updated Name" {
			t.Errorf("name not updated")
		}

		if len(uA3.Motd) != 3 {
			t.Errorf("MOTD not updated")
		}

		if uA3.LimitFPS == nil || *uA3.LimitFPS != 120 {
			t.Errorf("expected updated LimitFPS 120, got %v", uA3.LimitFPS)
		}
	})

	t.Run("DayZServer CRUD", func(t *testing.T) {
		s := &DayZServer{
			Server: Server{
				Type: TypeDayZ,
				Name: "DayZ Test",
			},
			Disable3rdPerson: false,
			TimeAcceleration: 12.0,
			BattlEye:         true,
			VerifySignatures: 2,
		}

		id, err := repo.Save(t.Context(), s)
		if err != nil {
			t.Fatalf("failed to save DayZ server: %v", err)
		}

		saved, err := repo.GetServerByID(t.Context(), id)
		if err != nil {
			t.Fatalf("failed to get DayZ server: %v", err)
		}

		dz, ok := saved.(*DayZServer)
		if !ok {
			t.Fatalf("expected *DayZServer, got %T", saved)
		}

		if dz.TimeAcceleration != 12.0 {
			t.Errorf("expected TimeAcceleration 12.0, got %f", dz.TimeAcceleration)
		}

		if dz.BattlEye != true {
			t.Errorf("expected BattlEye true, got %v", dz.BattlEye)
		}

		if dz.VerifySignatures != 2 {
			t.Errorf("expected VerifySignatures 2, got %d", dz.VerifySignatures)
		}
	})

	t.Run("ReforgerServer CRUD", func(t *testing.T) {
		header := json.RawMessage([]byte(`{"test":"value"}`))
		s := &ReforgerServer{
			Server: Server{
				Type: TypeReforger,
				Name: "Reforger Test",
			},
			ScenarioID: "TestScenario",
			ActiveMods: []ReforgerMod{
				{ID: "Mod1", Name: "Test Mod"},
			},
			MissionHeader: &header,
		}

		id, err := repo.Save(t.Context(), s)
		if err != nil {
			t.Fatalf("failed to save Reforger server: %v", err)
		}

		saved, err := repo.GetServerByID(t.Context(), id)
		if err != nil {
			t.Fatalf("failed to get Reforger server: %v", err)
		}

		ref, ok := saved.(*ReforgerServer)
		if !ok {
			t.Fatalf("expected *ReforgerServer, got %T", saved)
		}

		if ref.ScenarioID != "TestScenario" {
			t.Errorf("expected ScenarioID 'TestScenario', got '%s'", ref.ScenarioID)
		}

		if len(ref.ActiveMods) != 1 || ref.ActiveMods[0].ID != "Mod1" {
			t.Errorf("active mods not saved correctly")
		}

		if ref.MissionHeader == nil {
			t.Errorf("expected MissionHeader to be not nil")
		} else if string(*ref.MissionHeader) != `{"test":"value"}` {
			t.Errorf("expected MissionHeader '{\"test\":\"value\"}', got '%s'", string(*ref.MissionHeader))
		}
	})

	t.Run("GetAllServers", func(t *testing.T) {
		servers, err := repo.GetAllServers(t.Context())
		if err != nil {
			t.Fatalf("failed to get all servers: %v", err)
		}

		if len(servers) < 3 {
			t.Errorf("expected at least 3 servers, got %d", len(servers))
		}
	})

	t.Run("Delete Server", func(t *testing.T) {
		// Create a server to delete
		s := &DayZServer{Server: Server{Type: TypeDayZ, Name: "To Delete"}}
		id, _ := repo.Save(t.Context(), s)

		err := repo.Delete(t.Context(), id)
		if err != nil {
			t.Fatalf("failed to delete server: %v", err)
		}

		_, err = repo.GetServerByID(t.Context(), id)
		if err == nil {
			t.Error("expected error getting deleted server, got nil")
		}
	})
}
