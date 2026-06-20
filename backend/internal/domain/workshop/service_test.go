package workshop

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/server"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

type mockScenarioService struct {
	saveCalled   bool
	deleteCalled bool
}

func (m *mockScenarioService) SaveModScenarios(ctx context.Context, modID, modName string, scraped []ScrapedScenario) error {
	m.saveCalled = true
	return nil
}

func (m *mockScenarioService) DeleteModScenarios(ctx context.Context, modID string) error {
	m.deleteCalled = true
	return nil
}

func (m *mockScenarioService) CleanupOrphanedScenarios(ctx context.Context, activeHexIDs []string) error {
	return nil
}

type mockReforgerModProvider struct {
	ids []string
}

func (m *mockReforgerModProvider) GetAllActiveReforgerModIDs(ctx context.Context) ([]string, error) {
	return m.ids, nil
}

type mockBroadcaster struct {
	mu     sync.Mutex
	events []string
}

func (m *mockBroadcaster) Broadcast(event string, data any) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.events = append(m.events, event)
}

type dummyPathProvider struct {
	tempDir string
}

func (d *dummyPathProvider) GetServerPath(t server.Type) string { return d.tempDir }
func (d *dummyPathProvider) GetModsPath(t server.Type) string {
	return filepath.Join(d.tempDir, "mods")
}
func (d *dummyPathProvider) GetModsBaseDir() string { return d.tempDir }
func (d *dummyPathProvider) GetModInstallationPath(modID int64, t server.Type) string {
	return filepath.Join(d.tempDir, "mods", "12345")
}

func (d *dummyPathProvider) GetModLinkPath(modName string, t server.Type) string {
	return filepath.Join(d.tempDir, "mods", modName)
}

func (d *dummyPathProvider) GetServerKeysPath(t server.Type) string {
	return filepath.Join(d.tempDir, "keys")
}

func (d *dummyPathProvider) GetServerKeyPath(keyName string, t server.Type) string {
	return filepath.Join(d.tempDir, "keys", keyName)
}

func (d *dummyPathProvider) GetScenariosBasePath() string {
	return filepath.Join(d.tempDir, "mpmissions")
}

func (d *dummyPathProvider) GetScenarioPath(scenarioName string) string {
	return filepath.Join(d.tempDir, "mpmissions", scenarioName)
}

func (d *dummyPathProvider) GetConfigFilePath(t server.Type, configName string) string {
	return filepath.Join(d.tempDir, configName)
}

func (d *dummyPathProvider) GetProfilesDirectoryPath() string {
	return filepath.Join(d.tempDir, "profiles")
}

func (d *dummyPathProvider) GetServerExecutable(t server.Type) string {
	return "dummy_exe"
}

func (d *dummyPathProvider) GetServerLogFile(t server.Type, id int64) string {
	return filepath.Join(d.tempDir, "logs", "server.log")
}

func (d *dummyPathProvider) GetHeadlessClientLogFile(serverId int64, headlessClientId int) string {
	return filepath.Join(d.tempDir, "logs", "hc.log")
}

func (d *dummyPathProvider) GetSteamCmdLogFile() string {
	return filepath.Join(d.tempDir, "logs", "steamcmd.log")
}

func (d *dummyPathProvider) GetSteamCmdExecutable() string {
	return "dummy_steamcmd"
}

func (d *dummyPathProvider) GetSteamCmdCacheFile() string {
	return filepath.Join(d.tempDir, "steamcmd_cache.json")
}

func TestService_Basic(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database)
	svc := NewService(ServiceDeps{
		Repo: repo,
	})
	defer svc.Stop()

	t.Run("Mod Operations", func(t *testing.T) {
		mod := WorkshopMod{ID: 1, Name: "Test Mod"}

		err := svc.SaveMod(t.Context(), &mod)
		require.NoError(t, err)

		all, _ := svc.GetAllMods(t.Context())
		assert.Len(t, all, 1)

		got, _ := svc.GetMod(t.Context(), 1)
		assert.Equal(t, "Test Mod", got.Name)

		_ = svc.DeleteMod(t.Context(), 1)

		all, _ = svc.GetAllMods(t.Context())
		assert.Empty(t, all)
	})
}

func TestService_Advanced(t *testing.T) {
	// Mock HTTP Transport for external APIs
	oldTransport := http.DefaultTransport
	mockTransport := &mockRoundTripper{
		roundTripFunc: func(req *http.Request) (*http.Response, error) {
			urlStr := req.URL.String()

			if strings.Contains(urlStr, "GetDetails") {
				publishedFileID := "12345"
				consumerAppID := 107410
				title := "Mock Steam Mod"
				if strings.Contains(urlStr, "publishedfileids[0]=67890") {
					publishedFileID = "67890"
					consumerAppID = 1874900
					title = "Mock Reforger Mod"
				}

				body := fmt.Sprintf(`{
					"response": {
						"publishedfiledetails": [
							{
								"publishedfileid": %s,
								"consumer_appid": %d,
								"file_size": 987654,
								"time_updated": 1609459200,
								"title": "%s",
								"preview_url": "http://example.com/thumbnail.png"
							}
						],
						"total": 1
					}
				}`, publishedFileID, consumerAppID, title)
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
						"total": 1
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

	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	tempDir := t.TempDir()
	cfg := &config.Config{StoragePath: tempDir}
	paths := config.NewPaths(cfg)
	repo := NewRepository(database)
	_ = NewInstaller(paths, repo)
	metadata := NewMetadataFetcher("dummy_key")
	scraper := NewReforgerScraper()
	scenarios := &mockScenarioService{}
	provider := &mockReforgerModProvider{ids: []string{"reforgermod123"}}
	broadcaster := &mockBroadcaster{}

	svc := NewService(ServiceDeps{
		Repo:                repo,
		Installer:           nil, // Use nil installer to bypass symlink permission issues on Windows
		Metadata:            metadata,
		Scraper:             scraper,
		ScenarioService:     scenarios,
		ReforgerModProvider: provider,
	})
	svc.SetBroadcaster(broadcaster)
	defer svc.Stop()

	// 1. Save mods
	mod1 := &WorkshopMod{
		ID:                 12345,
		Name:               "Mock Steam Mod",
		ServerType:         server.TypeArma3,
		InstallationStatus: InstallationNotInstalled,
	}
	err := svc.SaveMod(t.Context(), mod1)
	require.NoError(t, err)

	mod2 := &WorkshopMod{
		ID:                 67890,
		Name:               "Mock Reforger Mod",
		ServerType:         server.TypeReforger,
		InstallationStatus: InstallationNotInstalled,
	}
	err = svc.SaveMod(t.Context(), mod2)
	require.NoError(t, err)

	// 2. HasModUpdates
	hasUpdates, err := svc.HasModUpdates(t.Context())
	assert.NoError(t, err)
	assert.False(t, hasUpdates)

	// 3. SearchReforgerMods
	reforgerMods, err := svc.SearchReforgerMods(t.Context(), "query", 1)
	assert.NoError(t, err)
	assert.NotEmpty(t, reforgerMods)

	// 4. SearchSteamMods
	steamMods, _, err := svc.SearchSteamMods(t.Context(), "54321", 221100, 1)
	assert.NoError(t, err)
	assert.NotEmpty(t, steamMods)

	// 5. GetReforgerModDetails
	details, err := svc.GetReforgerModDetails(t.Context(), "reforgermod123")
	assert.NoError(t, err)
	assert.Equal(t, "reforgermod123", details.ID)

	// 6. GetReforgerModScenarios
	scens, err := svc.GetReforgerModScenarios(t.Context(), "reforgermod123")
	assert.NoError(t, err)
	assert.NotEmpty(t, scens)

	// 7. UpdateModStatus
	err = svc.UpdateModStatus(t.Context(), 12345, InstallationFinished)
	assert.NoError(t, err)
	gotMod, err := svc.GetMod(t.Context(), 12345)
	assert.NoError(t, err)
	assert.Equal(t, InstallationFinished, gotMod.InstallationStatus)

	err = svc.UpdateModStatus(t.Context(), 67890, InstallationFinished)
	assert.NoError(t, err)

	// 8. FetchAndSaveMetadata
	_, err = svc.FetchAndSaveMetadata(t.Context(), 12345, true)
	assert.NoError(t, err)

	// 9. SyncAllBiKeys
	err = svc.SyncAllBiKeys(t.Context())
	assert.NoError(t, err)

	// 10. SyncReforgerScenarios
	err = svc.SyncReforgerScenarios(t.Context())
	assert.NoError(t, err)

	// 11. SyncModsWithDisk
	// Create mod directories so SyncModsWithDisk doesn't delete them
	err = os.MkdirAll(paths.GetModInstallationPath(12345, server.TypeArma3), 0o755)
	require.NoError(t, err)
	err = os.MkdirAll(paths.GetModInstallationPath(67890, server.TypeReforger), 0o755)
	require.NoError(t, err)

	err = svc.SyncModsWithDisk(t.Context())
	assert.NoError(t, err)

	// 12. FinishModInstallation
	err = svc.FinishModInstallation(t.Context(), 12345)
	assert.NoError(t, err)
	err = svc.FinishModInstallation(t.Context(), 67890)
	assert.NoError(t, err)

	// Wait briefly for post-install worker queue to process
	time.Sleep(150 * time.Millisecond)

	// 13. UpdateAllMods
	err = svc.UpdateAllMods(t.Context())
	assert.NoError(t, err)

	// 14. DeleteMod
	err = svc.DeleteMod(t.Context(), 12345)
	assert.NoError(t, err)
	err = svc.DeleteMod(t.Context(), 67890)
	assert.NoError(t, err)
	assert.True(t, scenarios.deleteCalled)
}
