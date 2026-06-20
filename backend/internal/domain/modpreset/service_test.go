package modpreset

import (
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"path/filepath"
	"strings"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func setupPresetService(t *testing.T) (*Service, *Repository, *workshop.Repository) {
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	t.Cleanup(func() { database.Close() })
	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	workshopRepo := workshop.NewRepository(database)
	repo := NewRepository(database, workshopRepo)
	importer := NewImporter(repo, workshopRepo)
	exporter := NewExporter()
	svc := NewService(repo, importer, exporter)
	return svc, repo, workshopRepo
}

func TestService_SaveAndGetPreset(t *testing.T) {
	svc, _, workshopRepo := setupPresetService(t)

	mod := &workshop.WorkshopMod{
		ID:                 12345,
		Name:               "Test Mod 1",
		ServerType:         server.TypeArma3,
		InstallationStatus: workshop.InstallationFinished,
	}
	_ = workshopRepo.Save(t.Context(), mod)

	p := &ModPreset{
		Name: "Svc Preset",
		Type: server.TypeArma3,
		Mods: []workshop.WorkshopMod{*mod},
	}

	err := svc.SavePreset(t.Context(), p)
	if err != nil {
		t.Fatalf("failed to save: %v", err)
	}

	got, _ := svc.GetPreset(t.Context(), p.ID)
	if got.Name != "Svc Preset" {
		t.Errorf("expected Svc Preset, got %s", got.Name)
	}
	if len(got.Mods) != 1 || got.Mods[0].ID != 12345 {
		t.Errorf("expected 1 mod with ID 12345, got %+v", got.Mods)
	}

	all, _ := svc.GetAllPresets(t.Context())
	if len(all) == 0 {
		t.Error("expected presets in list")
	}

	_ = svc.DeletePreset(t.Context(), p.ID)
}

func TestService_ExportAndImportPreset(t *testing.T) {
	svc, _, workshopRepo := setupPresetService(t)

	mod := &workshop.WorkshopMod{
		ID:                 12345,
		Name:               "Test Mod 1",
		ServerType:         server.TypeArma3,
		InstallationStatus: workshop.InstallationFinished,
	}
	_ = workshopRepo.Save(t.Context(), mod)

	p := &ModPreset{
		Name: "Svc Preset",
		Type: server.TypeArma3,
		Mods: []workshop.WorkshopMod{*mod},
	}
	_ = svc.SavePreset(t.Context(), p)

	// Test Export
	exported, err := svc.ExportPreset(t.Context(), p.ID)
	if err != nil {
		t.Fatalf("failed to export: %v", err)
	}
	exportedStr := string(exported)
	if !strings.Contains(exportedStr, "Svc Preset") || !strings.Contains(exportedStr, "id=12345") {
		t.Errorf("exported content does not look correct: %s", exportedStr)
	}

	// Test Import (with duplicate name resolution)
	imported, err := svc.ImportPreset(t.Context(), strings.NewReader(exportedStr))
	if err != nil {
		t.Fatalf("failed to import: %v", err)
	}
	if imported.Name != "Svc Preset 1" {
		t.Errorf("expected duplicate name resolution to Svc Preset 1, got %s", imported.Name)
	}
	if len(imported.Mods) != 1 || imported.Mods[0].ID != 12345 {
		t.Errorf("expected imported preset to contain mod 12345, got %+v", imported.Mods)
	}

	// Test Import with empty / invalid content
	_, err = svc.ImportPreset(t.Context(), strings.NewReader("<html><body>No mods here</body></html>"))
	if err == nil {
		t.Error("expected error importing preset with no mods")
	}

	_ = svc.DeletePreset(t.Context(), p.ID)
	_ = svc.DeletePreset(t.Context(), imported.ID)
}
