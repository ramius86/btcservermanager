package main

import (
	"btcservermanager/internal/api"
	"btcservermanager/internal/config"
	"btcservermanager/internal/db"
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/discordbot"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/logs"
	"btcservermanager/internal/domain/modpreset"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"btcservermanager/internal/domain/steamcmd"
	"btcservermanager/internal/domain/system"
	"btcservermanager/internal/domain/workshop"
	"context"
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
	// Register the pprof HTTP handlers
	// NOSONAR: conditionally exposed via PPROF_ENABLED
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error: %v", err)
	}
}

func run() error {
	log.Println("Starting BTC Server Manager (Go Refactor)...")

	// 1. Load configuration
	cfg := config.LoadConfig()
	paths := config.NewPaths(cfg)

	if cfg.CFTeamDomain == "" {
		log.Println("⚠️  WARNING: CF_TEAM_DOMAIN not set. API authentication is DISABLED.")
	}
	if cfg.SecretKey == "" {
		log.Println("❌ CRITICAL: SECRET_KEY is not set! Steam credential encryption is DISABLED. All Steam auth saves will FAIL until this is configured.")
	} else {
		log.Println("✅ SECRET_KEY is configured.")
	}

	// Optional pprof debug server for memory profiling
	setupPprof()

	// Ensure data and logs directories exist
	if err := ensureDirectories(cfg); err != nil {
		return err
	}

	// 2. Connect to database
	database, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer database.Close()

	// 3. Run migrations (uses its own dedicated connection, separate from the pool)
	if err := db.Migrate(cfg.DatabaseURL); err != nil {
		return err
	}

	// 4. Initialize Repositories
	workshopRepo := workshop.NewRepository(database)
	serverRepo := server.NewRepository(database)
	modPresetRepo := modpreset.NewRepository(database, workshopRepo)
	scenarioRepo := scenario.NewRepository(database)
	installationRepo := installation.NewRepository(database)
	appSettingsRepo := appsettings.NewRepository(database)
	discordRepo := discordbot.NewRepository(database)

	// 5. Initialize Services
	additionalMods := []string{}
	if cfg.AdditionalMods != "" {
		additionalMods = strings.Split(cfg.AdditionalMods, ";")
	}

	launcher := server.NewLauncher(paths, additionalMods)
	processManager := server.NewProcessManager(paths, launcher, cfg.DebugMode)
	processManager.SetFastDLConfig(cfg.FastDLPort, cfg.FastDLDomain)
	defer processManager.Stop()

	configGenerator, err := server.NewConfigGenerator(paths)
	if err != nil {
		return err
	}
	configGenerator.SetFastDLDomain(cfg.FastDLDomain)
	// WebSocket Hub
	hub := api.NewHub()
	go hub.Run()
	defer hub.Stop()

	serverService := server.NewService(
		serverRepo,
		processManager,
		configGenerator,
		workshopRepo,
	)
	serverService.SetBroadcaster(hub)

	// Register Broadcasters
	processManager.SetBroadcaster(hub)
	hub.SetServerStatusProvider(func(serverID int64) bool {
		return processManager.GetInstanceInfo(serverID) != nil
	})

	modPresetImporter := modpreset.NewImporter(modPresetRepo, workshopRepo)
	modPresetExporter := modpreset.NewExporter()
	modPresetService := modpreset.NewService(modPresetRepo, modPresetImporter, modPresetExporter)

	scenarioService := scenario.NewService(scenarioRepo, paths, cfg)

	workshopInstaller := workshop.NewInstaller(paths, workshopRepo)
	workshopMetadata := workshop.NewMetadataFetcher(cfg.SteamAPIKey)
	workshopScraper := workshop.NewReforgerScraper()
	workshopService := workshop.NewService(workshop.ServiceDeps{
		Repo:                workshopRepo,
		Installer:           workshopInstaller,
		Metadata:            workshopMetadata,
		Scraper:             workshopScraper,
		ScenarioService:     scenarioService,
		ReforgerModProvider: serverService,
	})
	defer workshopService.Stop()
	workshopService.SetBroadcaster(hub)
	scenarioService.SetBroadcaster(hub)
	if os.Getenv("TEST_MODE") != "true" {
		workshopService.StartReforgerScenariosSyncWorker()
		// Sync mods with disk at startup to handle manually deleted directories
		log.Println("[Main] Triggering initial mod-disk synchronization...")
		go syncModsWithDisk(workshopService)
		// Populate vanilla scenarios if empty (auto-discovery on startup)
		go refreshVanillaScenarios(scenarioService)
	}

	installationService := installation.NewService(installationRepo)
	dryRunService := installation.NewDryRunService(cfg)

	steamauthRepo := steamauth.NewRepository(database)
	steamauthService := steamauth.NewAuthService(steamauthRepo)
	steamQRService := steamauth.NewQRAuthService(steamauthRepo)

	systemService := system.NewService(system.ServiceDeps{
		AppRepo:     appSettingsRepo,
		SteamAuth:   steamauthService,
		SteamAPIKey: cfg.SteamAPIKey,
	})
	hub.SetSystemInfoProvider(func() any {
		info, _ := systemService.GetSystemInfo(context.Background())
		return info
	})

	steamCmdExecutor := steamcmd.NewExecutor(paths, steamauthService)
	defer steamCmdExecutor.Stop()
	steamCmdExecutor.SetBroadcaster(hub)

	steamCmdService := steamcmd.NewService(steamcmd.ServiceDeps{
		Executor:      steamCmdExecutor,
		Paths:         paths,
		Installations: installationService,
		Workshop:      workshopService,
		DryRun:        dryRunService,
		Scenarios:     scenarioService,
	})
	defer steamCmdService.Stop()
	steamCmdService.SetBroadcaster(hub)

	// 6. Initialize Scheduler
	logManager := logs.NewLogManager(cfg.LogsDirectory)

	scheduler := system.NewScheduler(system.SchedulerDeps{
		ServerService:   serverService,
		WorkshopService: workshopService,
		SystemService:   systemService,
		LogManager:      logManager,
	})
	defer scheduler.Stop()
	scheduler.SetBroadcaster(hub)
	if os.Getenv("TEST_MODE") != "true" {
		scheduler.Start()
		steamCmdService.StartBackgroundUpdateCheck()
	}

	// 6.5 Discord Bot (optional — graceful skip if not configured)
	discordService := setupDiscordBot(cfg, discordRepo)
	if discordService != nil {
		defer discordService.Close()
	}

	// 7. Initialize Router
	router := api.NewRouter(api.RouterDeps{
		ServerService:       serverService,
		WorkshopService:     workshopService,
		ModPresetService:    modPresetService,
		ScenarioService:     scenarioService,
		InstallationService: installationService,
		SystemService:       systemService,
		SteamCmdService:     steamCmdService,
		SteamAuthService:    steamauthService,
		SteamQRService:      steamQRService,
		DiscordService:      discordService,
		DiscordRepo:         discordRepo,
		Config:              cfg,
		Paths:               paths,
		Hub:                 hub,
	})

	// 8. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// For testing, we might want to skip ListenAndServe
	if os.Getenv("TEST_MODE") == "true" {
		return nil
	}

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           router.Init(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      120 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	// Create a channel to listen for OS signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	// Start server in a goroutine
	startServer(srv)

	// Wait for stop signal
	<-stop
	log.Println("Shutting down server...")

	// Create a context with timeout for shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("server shutdown failed: %w", err)
	}

	log.Println("Server gracefully stopped")
	return nil
}

func setupDiscordBot(cfg *config.Config, discordRepo *discordbot.Repository) *discordbot.Service {
	if cfg.DiscordBotToken == "" || cfg.DiscordGuildID == "" {
		log.Println("ℹ️  Discord bot not configured (DISCORD_BOT_TOKEN / DISCORD_GUILD_ID missing)")
		return nil
	}

	discordService, err := discordbot.New(cfg.DiscordBotToken, cfg.DiscordGuildID, discordRepo)
	if err != nil {
		log.Printf("⚠️  Discord bot failed to initialize: %v", err)
		return nil
	}

	if err := discordService.Open(); err != nil {
		log.Printf("⚠️  Discord bot failed to connect: %v", err)
		return nil
	}

	log.Println("✅ Discord bot connected successfully")
	return discordService
}

func setupPprof() {
	if os.Getenv("PPROF_ENABLED") == "true" {
		pprofPort := os.Getenv("PPROF_PORT")
		if pprofPort == "" {
			pprofPort = "6060"
		}
		http.Handle("/", http.RedirectHandler("/debug/pprof/", http.StatusMovedPermanently))

		go func() {
			log.Printf("🔍 pprof debug server listening on :%s (http://localhost:%s/debug/pprof/)", pprofPort, pprofPort)
			if err := http.ListenAndServe(":"+pprofPort, nil); err != nil {
				log.Printf("pprof server error: %v", err)
			}
		}()
	}
}

func ensureDirectories(cfg *config.Config) error {
	dataDir := filepath.Dir(cfg.DatabaseURL)
	log.Printf("Ensuring directory exists: %s", dataDir)
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}

	logsDir := cfg.LogsDirectory
	log.Printf("Ensuring directory exists: %s", logsDir)
	return os.MkdirAll(logsDir, 0o755)
}

func syncModsWithDisk(workshopService *workshop.Service) {
	bgCtx := context.Background()
	if err := workshopService.SyncModsWithDisk(bgCtx); err != nil {
		log.Printf("⚠️  Failed to sync mods with disk: %v", err)
	} else {
		log.Println("[Main] Initial mod-disk synchronization triggered successfully")
	}
}

func refreshVanillaScenarios(scenarioService *scenario.Service) {
	if err := scenarioService.RefreshReforgerVanillaScenariosIfEmpty(context.Background()); err != nil {
		log.Printf("⚠️  Failed to auto-discover Reforger vanilla scenarios: %v", err)
	}
}

func startServer(srv *http.Server) {
	go func() {
		log.Printf("BTC Server Manager listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe error: %v", err)
		}
	}()
}
