package api

import (
	"btcservermanager/internal/api/ws"
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/modpreset"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"btcservermanager/internal/domain/steamcmd"
	"btcservermanager/internal/domain/system"
	"btcservermanager/internal/domain/workshop"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

func assertStatus(t *testing.T, expected, got int) {
	t.Helper()
	if expected != got {
		t.Errorf("expected status %d, got %d", expected, got)
	}
}

type mockConfigManager struct{}

func (m *mockConfigManager) Generate(ctx context.Context, s any) error {
	return nil
}

func (m *mockConfigManager) Delete(ctx context.Context, t server.Type, id int64) error {
	return nil
}

func (m *mockConfigManager) GetConfigContents(ctx context.Context, s any) (map[string]string, error) {
	return map[string]string{"server.cfg": "mock config content"}, nil
}

func TestRouterInit(t *testing.T) {
	// Setup dependencies
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	defer database.Close()

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	cfg := config.LoadConfig()
	cfg.DebugMode = true
	cfg.StoragePath = t.TempDir()
	cfg.LogsDirectory = filepath.Join(cfg.StoragePath, "logs")
	paths := config.NewPaths(cfg)
	hub := ws.NewHub()

	// Repositories
	workshopRepo := workshop.NewRepository(database)
	serverRepo := server.NewRepository(database)
	modPresetRepo := modpreset.NewRepository(database, workshopRepo)
	scenarioRepo := scenario.NewRepository(database)
	installationRepo := installation.NewRepository(database)
	appSettingsRepo := appsettings.NewRepository(database)
	steamauthRepo := steamauth.NewRepository(database)

	// Services
	serverService := server.NewService(serverRepo, nil, &mockConfigManager{}, workshopRepo)
	workshopService := workshop.NewService(workshop.ServiceDeps{
		Repo:                workshopRepo,
		ReforgerModProvider: serverService,
	})
	defer workshopService.Stop()
	modPresetService := modpreset.NewService(modPresetRepo, nil, nil)
	scenarioService := scenario.NewService(scenarioRepo, paths, cfg)
	installationService := installation.NewService(installationRepo)
	steamAuthService := steamauth.NewAuthService(steamauthRepo)
	steamQRService := steamauth.NewQRAuthService(steamauthRepo)
	systemService := system.NewService(system.ServiceDeps{AppRepo: appSettingsRepo, SteamAuth: steamAuthService, SteamAPIKey: ""})
	steamCmdService := steamcmd.NewService(steamcmd.ServiceDeps{
		Paths:         paths,
		Installations: installationService,
		Workshop:      workshopService,
		Scenarios:     scenarioService,
	})

	router := NewRouter(RouterDeps{
		ServerService:       serverService,
		WorkshopService:     workshopService,
		ModPresetService:    modPresetService,
		ScenarioService:     scenarioService,
		InstallationService: installationService,
		SystemService:       systemService,
		SteamCmdService:     steamCmdService,
		SteamAuthService:    steamAuthService,
		SteamQRService:      steamQRService,
		Config:              cfg,
		Paths:               paths,
		Hub:                 hub,
	})

	handler := router.Init()

	runSubtests(t, handler)
}

func runSubtests(t *testing.T, handler http.Handler) {
	// Simple endpoints
	t.Run("GET /api/nonexistent -> 404", func(t *testing.T) { testNonexistent(t, handler) })
	t.Run("GET /api/settings -> 200", func(t *testing.T) { testGetSettings(t, handler) })
	t.Run("PUT /api/settings -> 200", func(t *testing.T) { testPutSettings(t, handler) })
	t.Run("GET /api/system/info -> 200", func(t *testing.T) { testGetSystemInfo(t, handler) })
	t.Run("GET /api/server -> 200 (empty list)", func(t *testing.T) { testGetServerEmpty(t, handler) })

	// Server CRUD flow
	var createdServerID int64
	t.Run("POST /api/server -> 200", func(t *testing.T) {
		createdServerID = testPostServer(t, handler)
	})

	t.Run("GET /api/server/{id} -> 200", func(t *testing.T) { testGetServerByID(t, handler, createdServerID) })
	t.Run("GET /api/server/{id}/status -> 200", func(t *testing.T) { testGetServerStatus(t, handler, createdServerID) })
	t.Run("GET /api/server/{id}/configs -> 200", func(t *testing.T) { testGetServerConfigs(t, handler, createdServerID) })
	t.Run("PUT /api/server/{id} -> 200", func(t *testing.T) { testPutServer(t, handler, createdServerID) })
	t.Run("GET /api/server/statuses -> 200", func(t *testing.T) { testGetServerStatuses(t, handler) })
	t.Run("DELETE /api/server/{id} -> 204", func(t *testing.T) { testDeleteServer(t, handler, createdServerID) })
	t.Run("GET /api/server/{id} -> 404", func(t *testing.T) { testGetDeletedServer(t, handler, createdServerID) })

	// Mods and Scenarios
	t.Run("GET /api/mod/", func(t *testing.T) { testGetMods(t, handler) })
	t.Run("GET /api/mod/cdlc", func(t *testing.T) { testGetCdlc(t, handler) })
	t.Run("GET /api/scenarios/arma3", func(t *testing.T) { testGetScenariosArma3(t, handler) })
	t.Run("GET /api/scenarios/reforger", func(t *testing.T) { testGetScenariosReforger(t, handler) })

	// CSP
	t.Run("POST /api/csp-report -> 204", func(t *testing.T) { testPostCspReport(t, handler) })
}

func testNonexistent(t *testing.T, handler http.Handler) {
	req, _ := http.NewRequest(http.MethodGet, "/api/nonexistent", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusNotFound, rr.Code)
}

func testGetSettings(t *testing.T, handler http.Handler) {
	req, _ := http.NewRequest(http.MethodGet, "/api/settings", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testPutSettings(t *testing.T, handler http.Handler) {
	body := `{"logRetentionDays": 45, "logMaxTotalSizeMB": 512}`
	req, _ := http.NewRequest(http.MethodPut, "/api/settings", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)

	var s appsettings.AppSettings
	if err := json.NewDecoder(rr.Body).Decode(&s); err != nil {
		t.Fatalf("failed to decode updated settings: %v", err)
	}
	if s.LogRetentionDays != 45 || s.LogMaxTotalSizeMB != 512 {
		t.Errorf("expected retention=45, size=512; got retention=%d, size=%d", s.LogRetentionDays, s.LogMaxTotalSizeMB)
	}
}

func testGetSystemInfo(t *testing.T, handler http.Handler) {
	req, _ := http.NewRequest(http.MethodGet, "/api/system/info", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK && rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 200 or 500, got %d", rr.Code)
	}
}

func testGetServerEmpty(t *testing.T, handler http.Handler) {
	req, _ := http.NewRequest(http.MethodGet, "/api/server/", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
	if rr.Body.String() == "" {
		t.Errorf("expected non-empty body")
	}
}

func testPostServer(t *testing.T, handler http.Handler) int64 {
	body := `{"type": "ARMA3", "name": "API Test Server", "port": 2302, "maxPlayers": 16}`
	req, _ := http.NewRequest(http.MethodPost, "/api/server/", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)

	var created struct {
		ID int64 `json:"id"`
	}
	if err := json.NewDecoder(rr.Body).Decode(&created); err != nil {
		t.Fatalf("failed to decode created server: %v", err)
	}
	if created.ID == 0 {
		t.Error("expected non-zero server ID")
	}
	return created.ID
}

func testGetServerByID(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	req, _ := http.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(id, 10), nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testGetServerStatus(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	req, _ := http.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(id, 10)+"/status", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testGetServerConfigs(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	req, _ := http.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(id, 10)+"/configs", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testPutServer(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	body := `{"type": "ARMA3", "name": "Updated API Test Server", "port": 2302, "maxPlayers": 32}`
	req, _ := http.NewRequest(http.MethodPut, "/api/server/"+strconv.FormatInt(id, 10), strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testGetServerStatuses(t *testing.T, handler http.Handler) {
	req, _ := http.NewRequest(http.MethodGet, "/api/server/statuses", nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusOK, rr.Code)
}

func testDeleteServer(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	req, _ := http.NewRequest(http.MethodDelete, "/api/server/"+strconv.FormatInt(id, 10), nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusNoContent, rr.Code)
}

func testGetDeletedServer(t *testing.T, handler http.Handler, id int64) {
	if id == 0 {
		t.Skip("no server created")
	}
	req, _ := http.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(id, 10), nil)
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusNotFound, rr.Code)
}

func testGetMods(t *testing.T, handler http.Handler) {
	req := httptest.NewRequest(http.MethodGet, "/api/mod/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	assertStatus(t, http.StatusOK, w.Code)
}

func testGetCdlc(t *testing.T, handler http.Handler) {
	req := httptest.NewRequest(http.MethodGet, "/api/mod/cdlc", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	assertStatus(t, http.StatusOK, w.Code)
}

func testGetScenariosArma3(t *testing.T, handler http.Handler) {
	req := httptest.NewRequest(http.MethodGet, "/api/scenarios/arma3", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	assertStatus(t, http.StatusOK, w.Code)
}

func testGetScenariosReforger(t *testing.T, handler http.Handler) {
	req := httptest.NewRequest(http.MethodGet, "/api/scenarios/reforger", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	assertStatus(t, http.StatusOK, w.Code)
}

func testPostCspReport(t *testing.T, handler http.Handler) {
	body := `{"csp-report":{"document-uri":"http://test.com","blocked-uri":"http://bad.com","violated-directive":"script-src"}}`
	req, _ := http.NewRequest(http.MethodPost, "/api/csp-report", strings.NewReader(body))
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusNoContent, rr.Code)
}

func TestCSPReportRouteAuthorizationBypass(t *testing.T) {
	cfg := config.LoadConfig()
	cfg.CFTeamDomain = "https://my-team.cloudflareaccess.com"
	cfg.DebugMode = false
	paths := config.NewPaths(cfg)
	hub := ws.NewHub()

	router := NewRouter(RouterDeps{
		Config: cfg,
		Paths:  paths,
		Hub:    hub,
	})
	handler := router.Init()

	// POST /api/csp-report should NOT be blocked by CF Access (should return 204)
	body := `{"csp-report":{"document-uri":"http://test.com","blocked-uri":"http://bad.com"}}`
	req, _ := http.NewRequest(http.MethodPost, "/api/csp-report", strings.NewReader(body))
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	assertStatus(t, http.StatusNoContent, rr.Code)

	// Any other route under /api should be blocked (missing token -> 401 Unauthorized)
	reqApi, _ := http.NewRequest(http.MethodGet, "/api/settings", nil)
	rrApi := httptest.NewRecorder()
	handler.ServeHTTP(rrApi, reqApi)

	if rrApi.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 Unauthorized for settings endpoint under CF Access, got %d", rrApi.Code)
	}
}
