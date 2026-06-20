package installation

import (
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"path/filepath"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func setupService(t *testing.T) (*Service, *Repository) {
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	t.Cleanup(func() { database.Close() })
	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}
	repo := NewRepository(database)
	return NewService(repo), repo
}

func TestService_IsServerInstalled(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:               server.TypeArma3,
		InstallationStatus: workshop.InstallationFinished,
	}
	_ = repo.Save(t.Context(), si)

	if !svc.IsServerInstalled(t.Context(), server.TypeArma3) {
		t.Error("expected server to be installed")
	}
}

func TestService_SetServerBranch(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:               server.TypeArma3,
		InstallationStatus: workshop.InstallationFinished,
		Branch:             BranchPublic,
	}
	_ = repo.Save(t.Context(), si)

	err := svc.SetServerBranch(t.Context(), server.TypeArma3, BranchProfiling)
	if err != nil {
		t.Fatalf("failed to set branch: %v", err)
	}

	updated, _ := svc.GetInstallation(t.Context(), server.TypeArma3)
	if updated.Branch != BranchProfiling {
		t.Errorf("expected branch profiling, got %s", updated.Branch)
	}
}

func TestService_GetAllInstallations(t *testing.T) {
	svc, _ := setupService(t)
	list, err := svc.GetAllInstallations(t.Context())
	if err != nil {
		t.Fatalf("GetAllInstallations failed: %v", err)
	}
	if len(list) != 4 {
		t.Errorf("expected 4 installations, got %d", len(list))
	}
}

func TestService_UpdateStatus(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:               server.TypeArma3,
		InstallationStatus: workshop.InstallationFinished,
	}
	_ = repo.Save(t.Context(), si)

	err := svc.UpdateStatus(t.Context(), server.TypeArma3, workshop.InstallationError)
	if err != nil {
		t.Errorf("UpdateStatus existing failed: %v", err)
	}
	err = svc.UpdateStatus(t.Context(), server.TypeDayZ, workshop.InstallationFinished)
	if err != nil {
		t.Errorf("UpdateStatus new failed: %v", err)
	}
}

func TestService_UpdateVersion(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:    server.TypeArma3,
		Version: "2.12",
	}
	_ = repo.Save(t.Context(), si)

	err := svc.UpdateVersion(t.Context(), server.TypeArma3, "2.14")
	if err != nil {
		t.Errorf("UpdateVersion existing failed: %v", err)
	}
	err = svc.UpdateVersion(t.Context(), server.TypeReforger, "1.1.0")
	if err != nil {
		t.Errorf("UpdateVersion new failed: %v", err)
	}
}

func TestService_UpdateAvailableVersion(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:             server.TypeArma3,
		AvailableVersion: "2.12",
	}
	_ = repo.Save(t.Context(), si)

	err := svc.UpdateAvailableVersion(t.Context(), server.TypeArma3, "2.16")
	if err != nil {
		t.Errorf("UpdateAvailableVersion existing failed: %v", err)
	}
	err = svc.UpdateAvailableVersion(t.Context(), server.Type("NEWTYPE"), "1.0.0")
	if err != nil {
		t.Errorf("UpdateAvailableVersion new failed: %v", err)
	}
}

func TestService_UpdateBuildID(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:             server.TypeArma3,
		InstalledBuildID: "111",
	}
	_ = repo.Save(t.Context(), si)

	err := svc.UpdateBuildID(t.Context(), server.TypeArma3, "1234567")
	if err != nil {
		t.Errorf("UpdateBuildID existing failed: %v", err)
	}
	err = svc.UpdateBuildID(t.Context(), server.Type("NEWTYPE2"), "7654321")
	if err != nil {
		t.Errorf("UpdateBuildID new failed: %v", err)
	}
}

func TestService_UpdateInstalledBranch(t *testing.T) {
	svc, repo := setupService(t)
	si := &ServerInstallation{
		Type:            server.TypeArma3,
		InstalledBranch: BranchPublic,
	}
	_ = repo.Save(t.Context(), si)

	err := svc.UpdateInstalledBranch(t.Context(), server.TypeArma3, BranchProfiling)
	if err != nil {
		t.Errorf("UpdateInstalledBranch existing failed: %v", err)
	}
	err = svc.UpdateInstalledBranch(t.Context(), server.Type("NEWTYPE3"), BranchPublic)
	if err != nil {
		t.Errorf("UpdateInstalledBranch new failed: %v", err)
	}
}
