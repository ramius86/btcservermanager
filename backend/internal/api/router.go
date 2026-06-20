package api

import (
	"btcservermanager/internal/api/ws"
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/discordbot"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/modpreset"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"btcservermanager/internal/domain/steamcmd"
	"btcservermanager/internal/domain/system"
	"btcservermanager/internal/domain/workshop"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

const typeParamRoute = "/{type}"

type Router struct {
	serverService       *server.Service
	workshopService     *workshop.Service
	modPresetService    *modpreset.Service
	scenarioService     *scenario.Service
	installationService *installation.Service
	systemService       *system.Service
	steamCmdService     *steamcmd.Service
	steamAuthService    *steamauth.AuthService
	steamQRService      *steamauth.QRAuthService
	discordService      *discordbot.Service
	discordRepo         *discordbot.Repository
	config              *config.Config
	paths               *config.Paths
	hub                 *ws.Hub
}

type RouterDeps struct {
	ServerService       *server.Service
	WorkshopService     *workshop.Service
	ModPresetService    *modpreset.Service
	ScenarioService     *scenario.Service
	InstallationService *installation.Service
	SystemService       *system.Service
	SteamCmdService     *steamcmd.Service
	SteamAuthService    *steamauth.AuthService
	SteamQRService      *steamauth.QRAuthService
	DiscordService      *discordbot.Service
	DiscordRepo         *discordbot.Repository
	Config              *config.Config
	Paths               *config.Paths
	Hub                 *ws.Hub
}

func NewRouter(deps RouterDeps) *Router {
	return &Router{
		serverService:       deps.ServerService,
		workshopService:     deps.WorkshopService,
		modPresetService:    deps.ModPresetService,
		scenarioService:     deps.ScenarioService,
		installationService: deps.InstallationService,
		systemService:       deps.SystemService,
		steamCmdService:     deps.SteamCmdService,
		steamAuthService:    deps.SteamAuthService,
		steamQRService:      deps.SteamQRService,
		discordService:      deps.DiscordService,
		discordRepo:         deps.DiscordRepo,
		config:              deps.Config,
		paths:               deps.Paths,
		hub:                 deps.Hub,
	}
}

func NewHub() *ws.Hub {
	return ws.NewHub()
}

func (r *Router) Init() http.Handler {
	mux := chi.NewRouter()

	if r.config.DebugMode {
		mux.Use(middleware.Logger)
	}
	mux.Use(middleware.Recoverer)
	mux.Use(CorsHandler(r.config.AllowedOrigin))
	mux.Use(r.securityHeaders)

	cfValidator := newCFAccessValidator(r.config.CFTeamDomain, r.config.DebugMode)

	// Mount the CSP report receiver outside the Cloudflare Access validation
	mux.Post("/api/csp-report", r.handleCSPReport)

	mux.Route("/api", func(mux chi.Router) {
		mux.Use(cfValidator.middleware)
		mux.Get("/ws", r.handleWebSocket)
		mux.Mount("/server", r.serverRoutes())
		mux.Mount("/configs/cba-presets", r.cbaPresetRoutes())
		mux.Mount("/mod", r.modRoutes())
		mux.Mount("/scenarios", r.scenarioRoutes())
		mux.Mount("/settings", r.settingsRoutes())
		mux.Mount("/system", r.systemRoutes())
		mux.Mount("/steamcmd", r.steamCmdRoutes())
		mux.Mount("/config/auth", r.steamAuthRoutes())
		mux.Mount("/discord", r.discordRoutes())
		mux.Mount("/reforger/workshop", r.reforgerWorkshopRoutes())
		mux.Mount("/logs", r.logRoutes())
	})

	// Health check endpoint
	mux.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		if _, err := w.Write([]byte("OK")); err != nil {
			log.Printf("[API] Failed to write health check: %v", err)
		}
	})

	// Serve static files from the "public" directory
	fs := http.FileServer(http.Dir("public"))

	mux.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// If it's a request for an asset or has an extension, and doesn't exist, don't serve index.html
		// This prevents MIME type errors on nested routes when assets fail to load
		if strings.HasPrefix(path, "/assets/") || strings.Contains(filepath.Base(path), ".") {
			fs.ServeHTTP(w, r)
			return
		}

		// Check if the requested file exists
		if _, err := os.Stat(filepath.Join("public", path)); err != nil {
			// If not, serve index.html to allow SPA routing to take over
			http.ServeFile(w, r, "public/index.html")
			return
		}

		// Otherwise, serve the static file
		fs.ServeHTTP(w, r)
	})

	return mux
}

func (r *Router) serverRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/", r.handleGetAllServers)
	mux.Post("/", r.handleCreateServer)
	mux.Put("/reorder", r.handleReorderServers)
	mux.Get("/statuses", r.handleGetAllServerStatuses)
	mux.Get("/{id}", r.handleGetServer)
	mux.Put("/{id}", r.handleUpdateServer)
	mux.Delete("/{id}", r.handleDeleteServer)
	mux.Get("/{id}/status", r.handleGetServerStatus)
	mux.Get("/{id}/configs", r.handleGetServerConfigs)
	mux.Post("/{id}/start", r.handleStartServer)
	mux.Post("/{id}/stop", r.handleStopServer)
	mux.Post("/{id}/restart", r.handleRestartServer)
	mux.Patch("/{id}/autorestart", r.handleUpdateAutoRestart)

	mux.Route("/{id}/hc", func(mux chi.Router) {
		mux.Post("/start", r.handleAddHeadlessClient)
		mux.Delete("/stop", r.handleRemoveHeadlessClient)
	})

	mux.Route("/{id}/reforger", func(mux chi.Router) {
		mux.Get("/saves", r.handleGetReforgerSaves)
		mux.Delete("/saves", r.handleDeleteReforgerSaves)
	})

	mux.Route("/installation", func(mux chi.Router) {
		mux.Get("/", r.handleGetAllInstallations)
		mux.Get(typeParamRoute, r.handleGetInstallation)
		mux.Post(typeParamRoute, r.handleInstallOrUpdateServer)
		mux.Patch(typeParamRoute, r.handleSetServerBranch)
		mux.Delete(typeParamRoute, r.handleUninstallServer)
	})

	return mux
}

func (r *Router) modRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/", r.handleGetAllMods)
	mux.Post("/", r.handleInstallOrUpdateMods)
	mux.Delete("/", r.handleUninstallMod) // Simplified plural/single
	mux.Post("/update", r.handleUpdateAllMods)
	mux.Post("/sync-bikeys", r.handleSyncBiKeys)
	mux.Get("/status", r.handleGetModStatus)
	mux.Get("/needs-update", r.handleGetModNeedsUpdate)
	mux.Get("/cdlc", r.handleGetCreatorDlcs)
	mux.Get("/steam/search", r.handleSearchSteamMods)

	mux.Route("/{id}", func(mux chi.Router) {
		mux.Get("/", r.handleGetMod)
		mux.Post("/", r.handleInstallOrUpdateMod)
		mux.Delete("/", r.handleUninstallMod)
		mux.Patch("/", r.handleSetModServerOnly)
	})

	mux.Route("/preset", func(mux chi.Router) {
		mux.Get("/", r.handleGetAllPresets)
		mux.Get("/{id}", r.handleGetPreset)
		mux.Post("/", r.handleCreatePreset)
		mux.Put("/{id}", r.handleUpdatePreset)
		mux.Delete("/{id}", r.handleDeletePreset)
		mux.Get("/{id}/export", r.handleExportLauncherPreset)
		mux.Post("/import", r.handleUploadLauncherPreset)
	})

	return mux
}

func (r *Router) scenarioRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/arma3", r.handleGetArma3Scenarios)
	mux.Post("/arma3", r.handleUploadArma3Scenario)
	mux.Get("/arma3/{name}", r.handleDownloadArma3Scenario)
	mux.Delete("/arma3/{name}", r.handleDeleteArma3Scenario)
	mux.Get("/reforger", r.handleGetReforgerScenarios)
	mux.Post("/reforger/sync", r.handleSyncReforgerScenarios)
	mux.Post("/reforger/workshop/mod/{id}/fetch", r.handleFetchReforgerScenarios)

	return mux
}

func (r *Router) settingsRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/", r.handleGetAppSettings)
	mux.Put("/", r.handleUpdateAppSettings)

	return mux
}

func (r *Router) systemRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/info", r.handleGetSystemInfo)

	return mux
}

func (r *Router) steamCmdRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/", r.handleGetSteamCmdStatus)
	mux.Get("/log", r.handleGetSteamCmdLog)
	mux.Post("/update", r.handleUpdateSteamCmd)
	mux.Post("/check-updates", r.handleCheckServerUpdates)

	return mux
}

func (r *Router) steamAuthRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Post("/login", r.handleSteamLogin)
	mux.Post("/test", r.handleTestSteamLogin)
	mux.Get("/status", r.handleGetSteamAuthStatus)
	mux.Post("/qr/begin", r.handleBeginSteamQR)
	mux.Post("/qr/poll", r.handlePollSteamQR)

	return mux
}

func (r *Router) reforgerWorkshopRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/search", r.handleSearchReforgerMods)
	mux.Get("/{id}", r.handleGetReforgerModDetails)

	return mux
}

func (r *Router) logRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/servers/{id}", r.handleListServerLogs)
	mux.Get("/servers/{id}/stats", r.handleGetServerStats)
	mux.Get("/content/{filename}", r.handleGetServerLogContent)
	mux.Get("/steamcmd", r.handleListSteamCmdLogs)
	mux.Get("/steamcmd/{filename}", r.handleGetSteamCmdLogContent)
	mux.Get("/download/{filename}", r.handleDownloadLog)
	mux.Delete("/all", r.handleDeleteAllLogs)
	mux.Delete("/{filename}", r.handleDeleteLog)

	return mux
}

func (r *Router) json(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("[API] Failed to encode/write JSON response: %v", err)
	}
}

func (r *Router) cbaPresetRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/", r.handleGetCBAPresets)
	mux.Post("/", r.handleSaveCBAPreset)
	mux.Get("/{id}", r.handleGetCBAPreset)
	mux.Put("/{id}", r.handleSaveCBAPreset)
	mux.Delete("/{id}", r.handleDeleteCBAPreset)
	return mux
}
