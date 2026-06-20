package config

import (
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Version           string
	StoragePath       string
	SteamAPIKey       string
	Timezone          string
	SteamCmdPath      string
	SteamCmdCachePath string
	ModsDirectory     string
	ServersDirectory  string
	LogsDirectory     string
	AdditionalMods    string
	DatabaseURL       string
	LogRetentionDays  int
	MaxScenarioSize   int64
	AllowedOrigin     string
	CFTeamDomain      string
	CFZoneID          string
	CFAPIToken        string
	CSPEnabled        bool
	CSPMode           string
	DebugMode         bool
	SecretKey         string
	FastDLPort        int
	FastDLDomain      string
	DiscordBotToken   string
	DiscordGuildID    string
}

func LoadConfig() *Config {
	// Load .env file if it exists
	_ = godotenv.Load()             // current dir
	_ = godotenv.Load("../.env")    // one level up (if running from backend/)
	_ = godotenv.Load("../../.env") // two levels up (if running from backend/cmd/server/)

	storagePath := getEnv("STORAGE_PATH", "./storage")

	return &Config{
		Version:           getEnv("VERSION", "latest"),
		StoragePath:       storagePath,
		SteamAPIKey:       getEnv("STEAM_API_KEY", ""),
		Timezone:          getEnv("TIMEZONE", "UTC"),
		SteamCmdPath:      getEnv("STEAMCMD_PATH", "/usr/games/steamcmd"),
		SteamCmdCachePath: getEnv("STEAMCMD_CACHE_PATH", ""),
		ModsDirectory:     getEnv("DIRECTORY_MODS", filepath.Join(storagePath, "mods")),
		ServersDirectory:  getEnv("DIRECTORY_SERVERS", filepath.Join(storagePath, "servers")),
		LogsDirectory:     getEnv("DIRECTORY_LOGS", filepath.Join(storagePath, "logs")),
		AdditionalMods:    getEnv("ADDITIONAL_MODS", ""),
		DatabaseURL:       getEnv("DATABASE_URL", filepath.Join(storagePath, "data", "btc.db")),
		LogRetentionDays:  getEnvInt("LOG_RETENTION_DAYS", 30),
		MaxScenarioSize:   getEnvInt64("MAX_SCENARIO_SIZE", 100*1024*1024), // 100MB default
		AllowedOrigin:     strings.TrimSuffix(getEnv("ALLOWED_ORIGIN", ""), "/"),
		CFTeamDomain:      getEnv("CF_TEAM_DOMAIN", ""),
		CFZoneID:          getEnv("CF_ZONE_ID", ""),
		CFAPIToken:        getEnv("CF_API_TOKEN", ""),
		CSPEnabled:        getEnvBool("CSP_ENABLED", false),
		CSPMode:           getEnv("CSP_MODE", "enforce"),
		DebugMode:         getEnvBool("DEBUG", false),
		SecretKey:         getEnv("SECRET_KEY", ""),
		FastDLPort:        getEnvInt("FASTDL_PORT", 8081),
		FastDLDomain:      getEnv("FASTDL_DOMAIN", ""),
		DiscordBotToken:   getEnv("DISCORD_BOT_TOKEN", ""),
		DiscordGuildID:    getEnv("DISCORD_GUILD_ID", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}

	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("Warning: invalid value for %s: %s, using fallback %d", key, value, fallback)
			return fallback
		}

		return i
	}

	return fallback
}

func getEnvInt64(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			log.Printf("Warning: invalid value for %s: %s, using fallback %d", key, value, fallback)
			return fallback
		}

		return i
	}

	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if value, ok := os.LookupEnv(key); ok {
		lower := strings.ToLower(value)
		isTrue := lower == "true" || lower == "1" || lower == "yes" || lower == "on"
		return isTrue
	}

	return fallback
}
