package config

import (
	"btcservermanager/internal/domain/server"
	"fmt"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

type Paths struct {
	config *Config
}

func NewPaths(cfg *Config) *Paths {
	return &Paths{config: cfg}
}

func (p *Paths) GetServerPath(t server.Type) string {
	return filepath.Join(p.config.ServersDirectory, string(t))
}

func (p *Paths) GetModsPath(t server.Type) string {
	gameID := server.GameIDs[t]
	return filepath.Join(p.GetModsBaseDir(), "steamapps", "workshop", "content", strconv.FormatInt(gameID, 10))
}

func (p *Paths) GetModsBaseDir() string {
	return p.config.ModsDirectory
}

func (p *Paths) GetModInstallationPath(modID int64, t server.Type) string {
	return filepath.Join(p.GetModsPath(t), strconv.FormatInt(modID, 10))
}

func (p *Paths) GetModLinkPath(modName string, t server.Type) string {
	return filepath.Join(p.GetServerPath(t), modName)
}

func (p *Paths) GetServerKeysPath(t server.Type) string {
	return filepath.Join(p.GetServerPath(t), "keys")
}

func (p *Paths) GetServerKeyPath(keyName string, t server.Type) string {
	return filepath.Join(p.GetServerKeysPath(t), keyName)
}

func (p *Paths) GetScenariosBasePath() string {
	return filepath.Join(p.GetServerPath(server.TypeArma3), "mpmissions")
}

func (p *Paths) GetScenarioPath(scenarioName string) string {
	return filepath.Join(p.GetScenariosBasePath(), scenarioName)
}

func (p *Paths) GetConfigFilePath(t server.Type, configName string) string {
	return filepath.Join(p.GetServerPath(t), configName)
}

func (p *Paths) GetProfilesDirectoryPath() string {
	return filepath.Join(p.GetServerPath(server.TypeArma3), "custom_profiles")
}

func (p *Paths) GetServerExecutable(t server.Type) string {
	exec := server.ServerExecutables[t]
	if runtime.GOOS == "windows" && !strings.HasSuffix(strings.ToLower(exec), ".exe") {
		exec += ".exe"
	}

	return filepath.Join(p.GetServerPath(t), exec)
}

func (p *Paths) GetServerLogFile(t server.Type, id int64) string {
	timestamp := time.Now().Format("20060102_150405")
	return filepath.Join(p.config.LogsDirectory, fmt.Sprintf("%s_%d_%s.log", t, id, timestamp))
}

func (p *Paths) GetHeadlessClientLogFile(serverId int64, headlessClientId int) string {
	timestamp := time.Now().Format("20060102_150405")
	return filepath.Join(p.config.LogsDirectory, fmt.Sprintf("ARMA3_%d_HC%d_%s.log", serverId, headlessClientId, timestamp))
}

func (p *Paths) GetSteamCmdLogFile() string {
	formattedDate := time.Now().Format("20060102")
	return filepath.Join(p.config.LogsDirectory, "steamcmd", fmt.Sprintf("steamcmd_%s.log", formattedDate))
}

func (p *Paths) GetSteamCmdExecutable() string {
	return p.config.SteamCmdPath
}

func (p *Paths) GetSteamCmdCacheFile() string {
	return p.config.SteamCmdCachePath
}
