package config

import (
	"btcservermanager/internal/domain/server"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	tests := []struct {
		name     string
		env      map[string]string
		validate func(*testing.T, *Config)
	}{
		{
			name: "full environment",
			env: map[string]string{
				"STORAGE_PATH":        "/tmp/storage",
				"VERSION":             "1.2.3",
				"STEAM_API_KEY":       "key123",
				"TIMEZONE":            "Europe/Rome",
				"STEAMCMD_PATH":       "/usr/bin/steamcmd",
				"LOG_RETENTION_DAYS":  "60",
				"MAX_SCENARIO_SIZE":   "209715200",
				"ALLOWED_ORIGIN":      "http://localhost:3000/",
				"CF_TEAM_DOMAIN":      "example.cloudflareaccess.com",
				"CSP_ENABLED":         "true",
				"CSP_MODE":            "report-only",
				"DEBUG":               "1",
				"DIRECTORY_MODS":      "/custom/mods",
				"DIRECTORY_SERVERS":   "/custom/servers",
				"DIRECTORY_LOGS":      "/custom/logs",
				"ADDITIONAL_MODS":     "mod1,mod2",
				"DATABASE_URL":        "/custom/db.sqlite",
				"STEAMCMD_CACHE_PATH": "/custom/cache",
			},
			validate: func(t *testing.T, cfg *Config) {
				assert.Equal(t, "/tmp/storage", cfg.StoragePath)
				assert.Equal(t, "1.2.3", cfg.Version)
				assert.Equal(t, "key123", cfg.SteamAPIKey)
				assert.Equal(t, "Europe/Rome", cfg.Timezone)
				assert.Equal(t, "/usr/bin/steamcmd", cfg.SteamCmdPath)
				assert.Equal(t, 60, cfg.LogRetentionDays)
				assert.Equal(t, int64(209715200), cfg.MaxScenarioSize)
				assert.Equal(t, "http://localhost:3000", cfg.AllowedOrigin)
				assert.Equal(t, "example.cloudflareaccess.com", cfg.CFTeamDomain)
				assert.True(t, cfg.CSPEnabled)
				assert.Equal(t, "report-only", cfg.CSPMode)
				assert.True(t, cfg.DebugMode)
				assert.Equal(t, "/custom/mods", cfg.ModsDirectory)
				assert.Equal(t, "/custom/servers", cfg.ServersDirectory)
				assert.Equal(t, "/custom/logs", cfg.LogsDirectory)
				assert.Equal(t, "mod1,mod2", cfg.AdditionalMods)
				assert.Equal(t, "/custom/db.sqlite", cfg.DatabaseURL)
				assert.Equal(t, "/custom/cache", cfg.SteamCmdCachePath)
			},
		},
		{
			name: "defaults",
			env:  map[string]string{},
			validate: func(t *testing.T, cfg *Config) {
				assert.Equal(t, "./storage", cfg.StoragePath)
				assert.Equal(t, "latest", cfg.Version)
				assert.Equal(t, 30, cfg.LogRetentionDays)
				assert.Equal(t, int64(100*1024*1024), cfg.MaxScenarioSize)
				assert.False(t, cfg.CSPEnabled)
				assert.False(t, cfg.DebugMode)
				assert.Equal(t, filepath.Join("./storage", "mods"), cfg.ModsDirectory)
			},
		},
		{
			name: "invalid numeric values",
			env: map[string]string{
				"LOG_RETENTION_DAYS": "abc",
				"MAX_SCENARIO_SIZE":  "def",
			},
			validate: func(t *testing.T, cfg *Config) {
				assert.Equal(t, 30, cfg.LogRetentionDays)
				assert.Equal(t, int64(100*1024*1024), cfg.MaxScenarioSize)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Clear environment
			os.Clearenv()
			for k, v := range tt.env {
				t.Setenv(k, v)
			}
			cfg := LoadConfig()
			tt.validate(t, cfg)
		})
	}
}

func TestPaths(t *testing.T) {
	cfg := &Config{
		ServersDirectory: "/servers",
		ModsDirectory:    "/mods",
		LogsDirectory:    "/logs",
		SteamCmdPath:     "/usr/bin/steamcmd",
	}
	p := NewPaths(cfg)

	t.Run("GetServerPath", func(t *testing.T) {
		expected := filepath.Join("/servers", "ARMA3")
		assert.Equal(t, expected, p.GetServerPath(server.TypeArma3))
	})

	t.Run("GetModsPath", func(t *testing.T) {
		expected := filepath.Join("/mods", "steamapps", "workshop", "content", "107410")
		assert.Equal(t, expected, p.GetModsPath(server.TypeArma3))
	})

	t.Run("GetModInstallationPath", func(t *testing.T) {
		expected := filepath.Join("/mods", "steamapps", "workshop", "content", "107410", "12345")
		assert.Equal(t, expected, p.GetModInstallationPath(12345, server.TypeArma3))
	})

	t.Run("GetServerExecutable", func(t *testing.T) {
		exec := "arma3server_x64"
		if runtime.GOOS == "windows" {
			exec = "arma3server_x64.exe"
		}
		expected := filepath.Join("/servers", "ARMA3", exec)
		assert.Equal(t, expected, p.GetServerExecutable(server.TypeArma3))
	})

	t.Run("GetScenariosBasePath", func(t *testing.T) {
		expected := filepath.Join("/servers", "ARMA3", "mpmissions")
		assert.Equal(t, expected, p.GetScenariosBasePath())
	})

	t.Run("GetSteamCmdLogFile", func(t *testing.T) {
		logFile := p.GetSteamCmdLogFile()
		assert.Contains(t, logFile, filepath.Join("/logs", "steamcmd"))
		assert.Contains(t, logFile, "steamcmd_")
		assert.Contains(t, logFile, ".log")
	})
}
