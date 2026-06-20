package scenario

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/workshop"
	"os"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func TestService(t *testing.T) {
	tempDir := t.TempDir()
	dbPath := filepath.Join(tempDir, "test.db")

	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	cfg := &config.Config{
		StoragePath:      tempDir,
		ServersDirectory: filepath.Join(tempDir, "servers"),
		ModsDirectory:    filepath.Join(tempDir, "mods"),
		LogsDirectory:    filepath.Join(tempDir, "logs"),
	}
	paths := config.NewPaths(cfg)
	repo := NewRepository(database)
	svc := NewService(repo, paths, cfg)

	t.Run("GetArma3Scenarios", func(t *testing.T) {
		mpDir := paths.GetScenariosBasePath()
		_ = os.MkdirAll(mpDir, 0o755)
		_ = os.WriteFile(filepath.Join(mpDir, "Mission1.PBO"), []byte("data"), 0o644)

		scenarios, err := svc.GetArma3Scenarios(t.Context())
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if len(scenarios) != 1 {
			t.Errorf("expected 1 scenario, got %d", len(scenarios))
		}
	})

	t.Run("ParseReforgerLine", func(t *testing.T) {
		line := `14:15:25 [INFO   ] {123}Missions/Test.conf (Test Mission)`

		sc := svc.parseReforgerLine(line, true)
		if sc.ID != "{123}Missions/Test.conf" {
			t.Errorf("expected id {123}Missions/Test.conf, got %s", sc.ID)
		}
		if sc.Name != "Test Mission" {
			t.Errorf("expected name Test Mission, got %s", sc.Name)
		}
	})

	t.Run("GetReforgerScenarios", func(t *testing.T) {
		_ = repo.SaveVanillaScenarios(t.Context(), []ReforgerScenario{{ID: "v1", Name: "V1"}})
		_ = repo.SaveModScenarios(t.Context(), "M1", []ReforgerScenario{{ID: "ms1", Name: "MS1", ModID: "M1"}})

		res, err := svc.GetReforgerScenarios(t.Context(), []string{"m1"})
		if err != nil {
			t.Fatalf("failed to get: %v", err)
		}

		if len(res) != 2 {
			t.Errorf("expected 2 scenarios, got %d", len(res))
		}
	})

	t.Run("SaveModScenarios", func(t *testing.T) {
		scraped := []workshop.ScrapedScenario{
			{ID: "{S1}", Name: "Scraped 1", GameMode: "COOP", MaxPlayers: 8},
		}

		err := svc.SaveModScenarios(t.Context(), "m2", "Mod 2", scraped)
		if err != nil {
			t.Fatalf("failed to save: %v", err)
		}

		res, _ := svc.GetReforgerScenarios(t.Context(), []string{"m2"})
		var found bool

		for _, s := range res {
			if s.ID == "{S1}" {
				found = true
				break
			}
		}

		if !found {
			t.Error("scraped scenario not found in repository")
		}
	})
}
