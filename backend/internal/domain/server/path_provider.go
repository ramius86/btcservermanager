package server

// PathProvider defines the interface for path resolution to avoid circular dependencies with the config package.
type PathProvider interface {
	GetServerPath(t Type) string
	GetModsPath(t Type) string
	GetModsBaseDir() string
	GetModInstallationPath(modID int64, t Type) string
	GetModLinkPath(modName string, t Type) string
	GetServerKeysPath(t Type) string
	GetServerKeyPath(keyName string, t Type) string
	GetScenariosBasePath() string
	GetScenarioPath(scenarioName string) string
	GetConfigFilePath(t Type, configName string) string
	GetProfilesDirectoryPath() string
	GetServerExecutable(t Type) string
	GetServerLogFile(t Type, id int64) string
	GetHeadlessClientLogFile(serverId int64, headlessClientId int) string
	GetSteamCmdLogFile() string
	GetSteamCmdExecutable() string
	GetSteamCmdCacheFile() string
}
