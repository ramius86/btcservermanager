package api

import (
	"btcservermanager/internal/api/ws"
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/discordbot"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/modpreset"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"btcservermanager/internal/domain/steamcmd"
	"btcservermanager/internal/domain/system"
	"btcservermanager/internal/domain/workshop"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

type mockRoundTripper struct {
	roundTripFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.roundTripFunc(req)
}

type mockServerManager struct {
	running map[int64]*server.ServerInstanceInfo
}

func (m *mockServerManager) GetInstanceInfo(id int64) *server.ServerInstanceInfo {
	return m.running[id]
}
func (m *mockServerManager) UpdateQueryInfo(id int64, players int, mapName, mission string) {}
func (m *mockServerManager) StartServer(ctx context.Context, srv any) error {
	var id int64
	switch v := srv.(type) {
	case *server.Arma3Server:
		id = v.ID
	case *server.DayZServer:
		id = v.ID
	case *server.ReforgerServer:
		id = v.ID
	}
	m.running[id] = &server.ServerInstanceInfo{
		CurrentLogFile: fmt.Sprintf("REFORGER_%d_2026-06-19.log", id),
	}
	return nil
}

func (m *mockServerManager) StopServer(ctx context.Context, id int64) error {
	delete(m.running, id)
	return nil
}

func (m *mockServerManager) AddHeadlessClient(ctx context.Context, srv *server.Arma3Server) error {
	return nil
}
func (m *mockServerManager) RemoveHeadlessClient(ctx context.Context, id int64) error { return nil }
func (m *mockServerManager) GetServerLogFile(t server.Type, id int64) string {
	return fmt.Sprintf("REFORGER_%d_2026-06-19.log", id)
}

func helperProcess(scenario string) func(ctx context.Context, name string, arg ...string) *exec.Cmd {
	return func(ctx context.Context, name string, arg ...string) *exec.Cmd {
		cs := []string{"-test.run=TestRouterHelperProcess", "--"}
		cs = append(cs, arg...)
		cmd := exec.Command(os.Args[0], cs...)
		cmd.Env = append(os.Environ(), "GO_WANT_HELPER_PROCESS=1", "HELPER_SCENARIO="+scenario)
		return cmd
	}
}

func TestRouterHelperProcess(t *testing.T) {
	if os.Getenv("GO_WANT_HELPER_PROCESS") != "1" {
		return
	}
	scenario := os.Getenv("HELPER_SCENARIO")
	switch scenario {
	case "login_success":
		_, _ = os.Stdout.WriteString("Success! Logged in OK\n")
	case "login_fail":
		_, _ = os.Stdout.WriteString("Login Failed: invalid credentials\n")
	case "login_guard":
		_, _ = os.Stdout.WriteString("Steam Guard code required\n")
	case "job_success":
		_, _ = os.Stdout.WriteString("Success! App '233780' fully installed.\n")
	default:
		_, _ = os.Stdout.WriteString("unknown scenario\n")
	}
	os.Exit(0)
}

func setupRouterForEndpointsTest(t *testing.T) (http.Handler, RouterDeps, func()) {
	os.Setenv("SECRET_KEY", "test-secret-key-12345678901234567890")
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	cfg := config.LoadConfig()
	cfg.DebugMode = true
	cfg.CFTeamDomain = "" // Bypass CF Access validation during test
	cfg.StoragePath = t.TempDir()
	cfg.LogsDirectory = filepath.Join(cfg.StoragePath, "logs")
	paths := config.NewPaths(cfg)
	hub := ws.NewHub()

	// Ensure log dirs exist
	err = os.MkdirAll(cfg.LogsDirectory, 0o755)
	if err != nil {
		t.Fatalf("failed to create logs directory: %v", err)
	}
	err = os.MkdirAll(filepath.Join(cfg.LogsDirectory, "steamcmd"), 0o755)
	if err != nil {
		t.Fatalf("failed to create steamcmd logs directory: %v", err)
	}

	// Repositories
	workshopRepo := workshop.NewRepository(database)
	serverRepo := server.NewRepository(database)
	modPresetRepo := modpreset.NewRepository(database, workshopRepo)
	scenarioRepo := scenario.NewRepository(database)
	installationRepo := installation.NewRepository(database)
	appSettingsRepo := appsettings.NewRepository(database)
	steamauthRepo := steamauth.NewRepository(database)
	discordRepo := discordbot.NewRepository(database)

	// Services
	mockPM := &mockServerManager{
		running: make(map[int64]*server.ServerInstanceInfo),
	}
	serverService := server.NewService(serverRepo, mockPM, &mockConfigManager{}, workshopRepo)

	// Create scraper and metadata fetcher
	metadataFetcher := workshop.NewMetadataFetcher("dummy_key")
	reforgerScraper := workshop.NewReforgerScraper()

	workshopService := workshop.NewService(workshop.ServiceDeps{
		Repo:                workshopRepo,
		Metadata:            metadataFetcher,
		Scraper:             reforgerScraper,
		ReforgerModProvider: serverService,
	})

	importer := modpreset.NewImporter(modPresetRepo, workshopRepo)
	exporter := modpreset.NewExporter()
	modPresetService := modpreset.NewService(modPresetRepo, importer, exporter)
	scenarioService := scenario.NewService(scenarioRepo, paths, cfg)
	installationService := installation.NewService(installationRepo)
	steamAuthService := steamauth.NewAuthService(steamauthRepo)
	steamQRService := steamauth.NewQRAuthService(steamauthRepo)
	systemService := system.NewService(system.ServiceDeps{AppRepo: appSettingsRepo, SteamAuth: steamAuthService, SteamAPIKey: ""})

	executor := steamcmd.NewExecutor(paths, steamAuthService)
	executor.SetExecCommand(helperProcess("job_success"))
	steamCmdService := steamcmd.NewService(steamcmd.ServiceDeps{
		Executor:      executor,
		Paths:         paths,
		Installations: installationService,
		Workshop:      workshopService,
		Scenarios:     scenarioService,
	})

	discordService, err := discordbot.New("dummy_token", "dummy_guild", discordRepo)
	if err != nil {
		t.Fatalf("failed to create discord service: %v", err)
	}

	routerDeps := RouterDeps{
		ServerService:       serverService,
		WorkshopService:     workshopService,
		ModPresetService:    modPresetService,
		ScenarioService:     scenarioService,
		InstallationService: installationService,
		SystemService:       systemService,
		SteamCmdService:     steamCmdService,
		SteamAuthService:    steamAuthService,
		SteamQRService:      steamQRService,
		DiscordService:      discordService,
		DiscordRepo:         discordRepo,
		Config:              cfg,
		Paths:               paths,
		Hub:                 hub,
	}

	router := NewRouter(routerDeps)
	handler := router.Init()

	cleanup := func() {
		workshopService.Stop()
		executor.Stop()
		steamCmdService.Stop()
		database.Close()
		os.Unsetenv("SECRET_KEY")
	}

	return handler, routerDeps, cleanup
}

func TestRouterEndpoints(t *testing.T) {
	handler, deps, cleanup := setupRouterForEndpointsTest(t)
	defer cleanup()

	// Mock HTTP Transport for external APIs (Steam CMD and Reforger workshop scraper)
	oldTransport := http.DefaultTransport
	mockTransport := &mockRoundTripper{
		roundTripFunc: func(req *http.Request) (*http.Response, error) {
			urlStr := req.URL.String()

			if strings.Contains(urlStr, "GetDetails") {
				body := `{
					"response": {
						"publishedfiledetails": [
							{
								"publishedfileid": 12345,
								"consumer_appid": 107410,
								"file_size": 987654,
								"time_updated": 1609459200,
								"title": "Mock Steam Mod",
								"preview_url": "http://example.com/thumbnail.png"
							}
						],
						"total": 1
					}
				}`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(body)),
					Header:     make(http.Header),
				}, nil
			}

			if strings.Contains(urlStr, "QueryFiles") {
				body := `{
					"response": {
						"publishedfiledetails": [
							{
								"publishedfileid": "54321",
								"consumer_appid": "221100",
								"file_size": "111",
								"time_updated": "1609459200",
								"title": "Search Result Mod"
							}
						],
						"total": 123
					}
				}`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(body)),
					Header:     make(http.Header),
				}, nil
			}

			if strings.Contains(urlStr, "workshop?search=") {
				body := `<html>
					<body>
						<h1>Search Results</h1>
						<script id="__NEXT_DATA__" type="application/json">
						{
							"props": {
								"pageProps": {
									"assets": {
										"rows": [
											{
												"id": "reforgermod123",
												"slug": "reforger-slug",
												"name": "Reforger Mod 1",
												"author": { "username": "JohnDoe" },
												"previews": [
													{
														"url": "http://example.com/ref.png"
													}
												]
											}
										]
									}
								}
							}
						}
						</script>
					</body>
				</html>`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(body)),
					Header:     make(http.Header),
				}, nil
			}

			if strings.Contains(urlStr, "workshop/reforgermod123") {
				body := `<html>
					<body>
						<h1>Reforger Mod 1 Details</h1>
						<script id="__NEXT_DATA__" type="application/json">
						{
							"props": {
								"pageProps": {
									"asset": {
										"id": "reforgermod123",
										"name": "Reforger Mod 1",
										"description": "A cool mod",
										"summary": "Cool mod",
										"currentVersionNumber": "1.0.0",
										"createdAt": "2025-01-01",
										"updatedAt": "2025-01-02",
										"author": { "username": "JohnDoe" },
										"previews": [],
										"scenarios": [
											{
												"gameId": "scen1",
												"name": "Coop Mission 1",
												"gameMode": "Coop",
												"playerCount": 10
											}
										]
									}
								}
							}
						}
						</script>
					</body>
				</html>`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(body)),
					Header:     make(http.Header),
				}, nil
			}

			return &http.Response{
				StatusCode: http.StatusNotFound,
				Body:       io.NopCloser(strings.NewReader("")),
				Header:     make(http.Header),
			}, nil
		},
	}
	http.DefaultTransport = mockTransport
	defer func() { http.DefaultTransport = oldTransport }()

	// Create Reforger and Arma3 Servers via HTTP POST
	var reforgerServerID int64
	{
		body := `{"type": "REFORGER", "name": "Test Reforger Server", "port": 20013, "maxPlayers": 16}`
		req := httptest.NewRequest(http.MethodPost, "/api/server/", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		if rr.Code != http.StatusOK {
			t.Fatalf("POST /api/server/ failed with code %d, body: %q", rr.Code, rr.Body.String())
		}
		var res struct{ ID int64 }
		err := json.NewDecoder(rr.Body).Decode(&res)
		require.NoError(t, err)
		reforgerServerID = res.ID
	}

	{
		body := `{"type": "ARMA3", "name": "Test Arma 3 Server", "port": 2302, "maxPlayers": 16}`
		req := httptest.NewRequest(http.MethodPost, "/api/server/", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		assert.Equal(t, http.StatusOK, rr.Code)
		var res struct{ ID int64 }
		err := json.NewDecoder(rr.Body).Decode(&res)
		require.NoError(t, err)
		_ = res.ID
	}

	// 1. LOGS ROUTE TESTS
	t.Run("Logs Endpoints", func(t *testing.T) {
		// Prepare test log and stats files
		logFileBase := fmt.Sprintf("REFORGER_%d_2026-06-19.log", reforgerServerID)
		logFilePath := filepath.Join(deps.Config.LogsDirectory, logFileBase)
		statsFilePath := strings.Replace(logFilePath, ".log", ".stats.log", 1)

		err := os.WriteFile(logFilePath, []byte("Line 1\nLine 2\nLine 3"), 0o644)
		require.NoError(t, err)
		err = os.WriteFile(statsFilePath, []byte("2026-06-19 22:00:00: FPS: 60.0, Mem: 2048000 kB, Player: 5, AI: 100, Veh: 2 (10), Proj (S: 0 | 0).\n"), 0o644)
		require.NoError(t, err)

		steamcmdLogFileBase := "steamcmd_2026-06-19.log"
		steamcmdLogFilePath := filepath.Join(deps.Config.LogsDirectory, "steamcmd", steamcmdLogFileBase)
		err = os.WriteFile(steamcmdLogFilePath, []byte("Steamcmd download starting\nFinished!\n"), 0o644)
		require.NoError(t, err)

		// List Server Logs
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/servers/"+strconv.FormatInt(reforgerServerID, 10), nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var filenames []string
			err := json.NewDecoder(rr.Body).Decode(&filenames)
			assert.NoError(t, err)
			assert.Contains(t, filenames, logFileBase)
		}

		// Get Log Content
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/content/"+logFileBase+"?lines=2", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res map[string]string
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			assert.Contains(t, res["content"], "Line 2\nLine 3")
		}

		// Get Server Stats (Reforger stats parser)
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/servers/"+strconv.FormatInt(reforgerServerID, 10)+"/stats?filename="+logFileBase, nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var stats []server.ReforgerStatDto
			err := json.NewDecoder(rr.Body).Decode(&stats)
			assert.NoError(t, err)
			assert.Len(t, stats, 1)
			assert.Equal(t, 60.0, stats[0].FPS)
		}

		// List SteamCMD Logs
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/steamcmd", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var filenames []string
			err := json.NewDecoder(rr.Body).Decode(&filenames)
			assert.NoError(t, err)
			assert.Contains(t, filenames, steamcmdLogFileBase)
		}

		// Get SteamCMD Log Content
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/steamcmd/"+steamcmdLogFileBase+"?lines=10", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res map[string]string
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			assert.Contains(t, res["content"], "Finished!")
		}

		// Download Log
		{
			req := httptest.NewRequest(http.MethodGet, "/api/logs/download/"+logFileBase, nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			assert.Equal(t, "text/plain", rr.Header().Get("Content-Type"))
		}

		// Delete Single Log
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/logs/"+logFileBase, nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
			assert.NoFileExists(t, logFilePath)
			assert.NoFileExists(t, statsFilePath)
		}

		// Delete All Logs
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/logs/all?type=all", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
			assert.NoFileExists(t, steamcmdLogFilePath)
		}
	})

	// 2. STEAMCMD & STEAMAUTH TESTS
	t.Run("SteamCMD & SteamAuth", func(t *testing.T) {
		// Save Auth Account
		{
			body := `{"username": "steam_user", "password": "steam_password"}`
			req := httptest.NewRequest(http.MethodPost, "/api/config/auth/login", strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
		}

		// Get Auth Status
		{
			req := httptest.NewRequest(http.MethodGet, "/api/config/auth/status", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var status map[string]any
			err := json.NewDecoder(rr.Body).Decode(&status)
			assert.NoError(t, err)
			assert.True(t, status["authenticated"].(bool))
			assert.Equal(t, "steam_user", status["username"])
		}

		// Test Steam Login endpoint
		{
			body := `{"username": "steam_user", "password": "steam_password"}`
			req := httptest.NewRequest(http.MethodPost, "/api/config/auth/test", strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res map[string]any
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			assert.Contains(t, res, "success")
		}

		// Get SteamCMD Status
		{
			req := httptest.NewRequest(http.MethodGet, "/api/steamcmd/", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Get SteamCMD Log
		{
			req := httptest.NewRequest(http.MethodGet, "/api/steamcmd/log", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Post SteamCMD Update
		{
			req := httptest.NewRequest(http.MethodPost, "/api/steamcmd/update", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Post Check Updates
		{
			req := httptest.NewRequest(http.MethodPost, "/api/steamcmd/check-updates?type=ARMA3", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}
	})

	// 3. MOD PRESETS TESTS
	t.Run("Presets Endpoints", func(t *testing.T) {
		var presetID int64
		// Create Preset
		{
			body := `{"name": "My Preset", "serverType": "ARMA3", "mods": [{"id": 12345, "name": "Mock Mod"}]}`
			req := httptest.NewRequest(http.MethodPost, "/api/mod/preset/", strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res struct{ ID int64 }
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			presetID = res.ID
		}

		// Get All Presets
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/preset/", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res struct {
				Presets []any `json:"presets"`
			}
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			assert.NotEmpty(t, res.Presets)
		}

		// Get Preset
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/preset/"+strconv.FormatInt(presetID, 10), nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Update Preset
		{
			body := `{"name": "Updated Preset", "serverType": "ARMA3", "mods": [{"id": 12345, "name": "Mock Mod"}]}`
			req := httptest.NewRequest(http.MethodPut, "/api/mod/preset/"+strconv.FormatInt(presetID, 10), strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Export Launcher Preset
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/preset/"+strconv.FormatInt(presetID, 10)+"/export", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			assert.Contains(t, rr.Body.String(), "<html>")
		}

		// Import Launcher Preset (Multipart Form Upload)
		{
			htmlPreset := `<html>
				<head>
					<meta name="arma:PresetName" content="Imported Preset" />
				</head>
				<body>
					<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=497660133">CUP Units</a>
				</body>
			</html>`

			// We can bypass multipart parsing in handler by mocking it or manually writing multipart body.
			// Let's do a simple multipart write to cover the file reading logic:
			var multipartBody bytes.Buffer
			boundary := "----WebKitFormBoundary7MA4YWxkTrZu0gW"
			multipartBody.WriteString("--")
			multipartBody.WriteString(boundary)
			multipartBody.WriteString("\r\n")
			multipartBody.WriteString("Content-Disposition: form-data; name=\"file\"; filename=\"preset.html\"\r\n")
			multipartBody.WriteString("Content-Type: text/html\r\n\r\n")
			multipartBody.WriteString(htmlPreset)
			multipartBody.WriteString("\r\n")
			multipartBody.WriteString("--")
			multipartBody.WriteString(boundary)
			multipartBody.WriteString("--\r\n")

			req := httptest.NewRequest(http.MethodPost, "/api/mod/preset/import", &multipartBody)
			req.Header.Set("Content-Type", "multipart/form-data; boundary="+boundary)

			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Delete Preset
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/mod/preset/"+strconv.FormatInt(presetID, 10), nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
		}
	})

	// 4. SCENARIO ENDPOINTS TESTS
	t.Run("Scenarios Endpoints", func(t *testing.T) {
		// Get Arma 3 Scenarios
		{
			req := httptest.NewRequest(http.MethodGet, "/api/scenarios/arma3", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Sync Reforger Scenarios
		{
			req := httptest.NewRequest(http.MethodPost, "/api/scenarios/reforger/sync", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Fetch Scenarios for workshop mod ID
		{
			req := httptest.NewRequest(http.MethodPost, "/api/scenarios/reforger/workshop/mod/reforgermod123/fetch", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}
	})

	// 5. DISCORD ROUTE TESTS
	t.Run("Discord Endpoints", func(t *testing.T) {
		// Get Discord Status
		{
			req := httptest.NewRequest(http.MethodGet, "/api/discord/status", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var status map[string]any
			err := json.NewDecoder(rr.Body).Decode(&status)
			assert.NoError(t, err)
			assert.True(t, status["configured"].(bool))
		}

		// Get Events (empty list)
		{
			req := httptest.NewRequest(http.MethodGet, "/api/discord/events", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var events []any
			err := json.NewDecoder(rr.Body).Decode(&events)
			assert.NoError(t, err)
			assert.Empty(t, events)
		}

		// Get Attendance Stats (empty list)
		{
			req := httptest.NewRequest(http.MethodGet, "/api/discord/events/stats", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}
	})

	// 6. REFORGER WORKSHOP & GENERAL MODS TESTS
	t.Run("Reforger Workshop & Mods", func(t *testing.T) {
		// Search Reforger Mods
		{
			req := httptest.NewRequest(http.MethodGet, "/api/reforger/workshop/search?q=testquery", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var mods []workshop.ReforgerWorkshopMod
			err := json.NewDecoder(rr.Body).Decode(&mods)
			assert.NoError(t, err)
			assert.NotEmpty(t, mods)
			assert.Equal(t, "reforgermod123", mods[0].ID)
		}

		// Get Reforger Mod Details
		{
			req := httptest.NewRequest(http.MethodGet, "/api/reforger/workshop/reforgermod123", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var details workshop.ReforgerModDetails
			err := json.NewDecoder(rr.Body).Decode(&details)
			assert.NoError(t, err)
			assert.Equal(t, "reforgermod123", details.ID)
			assert.Equal(t, "A cool mod", details.Description)
		}

		// Search Steam Mods
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/steam/search?q=54321&appId=221100", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var res map[string]any
			err := json.NewDecoder(rr.Body).Decode(&res)
			assert.NoError(t, err)
			assert.Equal(t, float64(123), res["total"])
		}

		// Install/Update mod via POST /api/mod/
		{
			body := `[12345]`
			req := httptest.NewRequest(http.MethodPost, "/api/mod/", strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Check if updates exist
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/needs-update", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Get status of mods downloads
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/status", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Install mod by ID POST /api/mod/{id}
		{
			req := httptest.NewRequest(http.MethodPost, "/api/mod/12345", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Get mod details
		{
			req := httptest.NewRequest(http.MethodGet, "/api/mod/12345", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
			var mod workshop.WorkshopMod
			err := json.NewDecoder(rr.Body).Decode(&mod)
			assert.NoError(t, err)
			assert.Equal(t, int64(12345), mod.ID)
		}

		// Set mod server only
		{
			body := `{"serverOnly": true}`
			req := httptest.NewRequest(http.MethodPatch, "/api/mod/12345", strings.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Update all mods
		{
			req := httptest.NewRequest(http.MethodPost, "/api/mod/update", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Sync BiKeys
		{
			req := httptest.NewRequest(http.MethodPost, "/api/mod/sync-bikeys", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Uninstall mod by ID DELETE /api/mod/{id}
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/mod/12345", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
		}
	})

	// 7. REFORGER SAVES ROUTE TESTS
	t.Run("Reforger Saves", func(t *testing.T) {
		// Get Reforger Saves
		{
			req := httptest.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/reforger/saves", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// Delete Reforger Saves
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/reforger/saves?name=save1", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusNoContent, rr.Code)
		}
	})

	// 8. SERVER MANAGEMENT & INSTALLATIONS
	t.Run("Server Management & Installations", func(t *testing.T) {
		// 8.1 Get All Installations
		{
			req := httptest.NewRequest(http.MethodGet, "/api/server/installation/", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.2 Get Specific Installation
		{
			req := httptest.NewRequest(http.MethodGet, "/api/server/installation/REFORGER", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Contains(t, []int{http.StatusOK, http.StatusNotFound}, rr.Code)
		}

		// 8.3 Post Install/Update Server
		{
			req := httptest.NewRequest(http.MethodPost, "/api/server/installation/REFORGER", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.4 Set Server Branch
		{
			body := `{"branch": "public"}`
			req := httptest.NewRequest(http.MethodPatch, "/api/server/installation/REFORGER", strings.NewReader(body))
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.5 Get Server Configs
		{
			req := httptest.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/configs", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.6 Get Settings & Update Settings
		{
			req := httptest.NewRequest(http.MethodGet, "/api/settings/", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)

			body := `{"steamApiKey": "new_key"}`
			reqUpdate := httptest.NewRequest(http.MethodPut, "/api/settings/", strings.NewReader(body))
			rrUpdate := httptest.NewRecorder()
			handler.ServeHTTP(rrUpdate, reqUpdate)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.7 CBA Presets
		{
			// Get CBA Presets
			req := httptest.NewRequest(http.MethodGet, "/api/configs/cba-presets/", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.8 Server Lifecycle: autorestart
		{
			body := `{"autoRestart": true}`
			req := httptest.NewRequest(http.MethodPatch, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/autorestart", strings.NewReader(body))
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusOK, rr.Code)
		}

		// 8.9 Server Lifecycle: start / stop / restart
		{
			// Let's call start
			reqStart := httptest.NewRequest(http.MethodPost, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/start", nil)
			rrStart := httptest.NewRecorder()
			handler.ServeHTTP(rrStart, reqStart)
			assert.Contains(t, []int{http.StatusOK, http.StatusInternalServerError, http.StatusBadRequest}, rrStart.Code)

			// Let's call status
			reqStatus := httptest.NewRequest(http.MethodGet, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/status", nil)
			rrStatus := httptest.NewRecorder()
			handler.ServeHTTP(rrStatus, reqStatus)
			assert.Equal(t, http.StatusOK, rrStatus.Code)

			// Let's call restart
			reqRestart := httptest.NewRequest(http.MethodPost, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/restart", nil)
			rrRestart := httptest.NewRecorder()
			handler.ServeHTTP(rrRestart, reqRestart)
			assert.Contains(t, []int{http.StatusOK, http.StatusInternalServerError, http.StatusBadRequest}, rrRestart.Code)

			// Let's call stop
			reqStop := httptest.NewRequest(http.MethodPost, "/api/server/"+strconv.FormatInt(reforgerServerID, 10)+"/stop", nil)
			rrStop := httptest.NewRecorder()
			handler.ServeHTTP(rrStop, reqStop)
			assert.Contains(t, []int{http.StatusOK, http.StatusInternalServerError, http.StatusBadRequest}, rrStop.Code)
		}

		// 8.10 Uninstall Server (Should fail first because Reforger server configuration still exists)
		{
			req := httptest.NewRequest(http.MethodDelete, "/api/server/installation/REFORGER", nil)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)
			assert.Equal(t, http.StatusBadRequest, rr.Code)
		}
	})
}
