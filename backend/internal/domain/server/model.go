package server

import (
	"encoding/json"
	"time"
)

type Type string

const (
	TypeArma3    Type = "ARMA3"
	TypeDayZ     Type = "DAYZ"
	TypeDayZExp  Type = "DAYZ_EXP"
	TypeReforger Type = "REFORGER"
)

var GameIDs = map[Type]int64{
	TypeArma3:    107410,
	TypeDayZ:     221100,
	TypeDayZExp:  1024020,
	TypeReforger: 1874900,
}

var ServerIDs = map[Type]int64{
	TypeArma3:    233780,
	TypeDayZ:     223350,
	TypeDayZExp:  1042420,
	TypeReforger: 1874900,
}

var ServerExecutables = map[Type]string{
	TypeArma3:    "arma3server_x64",
	TypeDayZ:     "DayZServer_x64",
	TypeDayZExp:  "DayZServer_x64",
	TypeReforger: "ArmaReforgerServer",
}

type LaunchParameter struct {
	ID       int64   `json:"id"`
	ServerID int64   `json:"serverId"`
	Name     string  `json:"name"`
	Value    *string `json:"value"`
}

type ModInfo struct {
	Name       string
	ServerOnly bool
}

type Server struct {
	ID                     int64             `json:"id"`
	Type                   Type              `json:"type"`
	Description            string            `json:"description"`
	Name                   string            `json:"name"`
	Port                   int               `json:"port"`
	QueryPort              int               `json:"queryPort"`
	MaxPlayers             int               `json:"maxPlayers"`
	Password               string            `json:"password"`
	AdminPassword          string            `json:"adminPassword"`
	RestartAutomatically   bool              `json:"restartAutomatically"`
	AutomaticRestartTime   *string           `json:"automaticRestartTime"`
	CustomLaunchParameters []LaunchParameter `json:"customLaunchParameters"`
	SortOrder              int               `json:"sortOrder"`
}

const MaskedPassword = "***"

// MaskSensitive replaces sensitive fields with a mask string.
func MaskSensitive(s any) {
	switch v := s.(type) {
	case *Arma3Server:
		v.mask()
		if v.ServerCommandPassword != "" {
			v.ServerCommandPassword = MaskedPassword
		}
	case *DayZServer:
		v.mask()
	case *ReforgerServer:
		v.mask()
	case *Server:
		v.mask()
	}
}

func (s *Server) mask() {
	if s.Password != "" {
		s.Password = MaskedPassword
	}
	if s.AdminPassword != "" {
		s.AdminPassword = MaskedPassword
	}
}

// MergeMaskedPasswords retains existing passwords if the incoming ones are masked or empty.
func MergeMaskedPasswords(newSrv, oldSrv any) {
	var n, o *Server
	var newA3, oldA3 *Arma3Server

	switch v := newSrv.(type) {
	case *Arma3Server:
		n = &v.Server
		newA3 = v
	case *DayZServer:
		n = &v.Server
	case *ReforgerServer:
		n = &v.Server
	case *Server:
		n = v
	}

	switch v := oldSrv.(type) {
	case *Arma3Server:
		o = &v.Server
		oldA3 = v
	case *DayZServer:
		o = &v.Server
	case *ReforgerServer:
		o = &v.Server
	case *Server:
		o = v
	}

	if n != nil && o != nil {
		if n.Password == MaskedPassword || n.Password == "" {
			n.Password = o.Password
		}
		if n.AdminPassword == MaskedPassword || n.AdminPassword == "" {
			n.AdminPassword = o.AdminPassword
		}
	}

	if newA3 != nil && oldA3 != nil {
		if newA3.ServerCommandPassword == MaskedPassword || newA3.ServerCommandPassword == "" {
			newA3.ServerCommandPassword = oldA3.ServerCommandPassword
		}
	}
}

type Arma3DifficultySettings struct {
	ID              int64   `json:"id"`
	GroupIndicators byte    `json:"groupIndicators"`
	FriendlyTags    byte    `json:"friendlyTags"`
	EnemyTags       byte    `json:"enemyTags"`
	DetectedMines   byte    `json:"detectedMines"`
	Commands        byte    `json:"commands"`
	Waypoints       byte    `json:"waypoints"`
	WeaponInfo      byte    `json:"weaponInfo"`
	StanceIndicator byte    `json:"stanceIndicator"`
	ThirdPersonView byte    `json:"thirdPersonView"`
	TacticalPing    byte    `json:"tacticalPing"`
	ReducedDamage   bool    `json:"reducedDamage"`
	StaminaBar      bool    `json:"staminaBar"`
	WeaponCrosshair bool    `json:"weaponCrosshair"`
	VisionAid       bool    `json:"visionAid"`
	ScoreTable      bool    `json:"scoreTable"`
	DeathMessages   bool    `json:"deathMessages"`
	VonID           bool    `json:"vonID"`
	MapContent      bool    `json:"mapContent"`
	AutoReport      bool    `json:"autoReport"`
	CameraShake     bool    `json:"cameraShake"`
	AILevelPreset   byte    `json:"aiLevelPreset"`
	SkillAI         float64 `json:"skillAI"`
	PrecisionAI     float64 `json:"precisionAI"`
}

type Arma3Mission struct {
	Template   string `json:"template"`
	Difficulty string `json:"difficulty"`
}

type Arma3NetworkSettings struct {
	ID                       int64    `json:"id"`
	MaxMessagesSend          *int     `json:"maxMessagesSend"`
	MaxSizeGuaranteed        *int     `json:"maxSizeGuaranteed"`
	MaxSizeNonguaranteed     *int     `json:"maxSizeNonguaranteed"`
	MinBandwidth             *int     `json:"minBandwidth"`
	MaxBandwidth             *int     `json:"maxBandwidth"`
	MinErrorToSend           *float64 `json:"minErrorToSend"`
	MinErrorToSendNear       *float64 `json:"minErrorToSendNear"`
	MaxPacketSize            *int     `json:"maxPacketSize"`
	MaxCustomFileSize        *int     `json:"maxCustomFileSize"`
	SteamProtocolMaxDataSize *int     `json:"steamProtocolMaxDataSize"`
}

type Arma3Server struct {
	Server
	ClientFilePatching              int                      `json:"clientFilePatching"` // 0=none, 1=HC only, 2=all clients
	ServerFilePatching              bool                     `json:"serverFilePatching"`
	Persistent                      bool                     `json:"persistent"`
	BattlEye                        bool                     `json:"battlEye"`
	VonEnabled                      bool                     `json:"vonEnabled"`
	VerifySignatures                int                      `json:"verifySignatures"`
	ServerCommandPassword           string                   `json:"serverCommandPassword"`
	Motd                            []string                 `json:"motd"`
	MotdInterval                    *int                     `json:"motdInterval"`
	Admins                          []string                 `json:"admins"`
	AllowedLoadFileExtensions       []string                 `json:"allowedLoadFileExtensions"`
	AllowedPreprocessFileExtensions []string                 `json:"allowedPreprocessFileExtensions"`
	AllowedHTMLLoadExtensions       []string                 `json:"allowedHTMLLoadExtensions"`
	HeadlessClients                 []string                 `json:"headlessClients"`
	LocalClient                     []string                 `json:"localClient"`
	AdditionalOptions               string                   `json:"additionalOptions"`
	ActiveMods                      []int64                  `json:"activeMods"` // IDs of WorkshopMod
	ModNames                        []ModInfo                `json:"-"`          // Resolved mod info
	ActiveDLCs                      []string                 `json:"activeDLCs"` // Arma3CDLC IDs
	Missions                        []Arma3Mission           `json:"missions"`
	DifficultySettings              *Arma3DifficultySettings `json:"difficultySettings"`
	NetworkSettings                 *Arma3NetworkSettings    `json:"networkSettings"`
	EnableDebugConsole              int                      `json:"enableDebugConsole"`
	DebugConsoleAdmins              []string                 `json:"debugConsoleAdmins"`

	// Gameplay — Mission rotation (server.cfg)
	ForcedDifficulty        string `json:"forcedDifficulty"`
	AutoSelectMission       bool   `json:"autoSelectMission"`
	RandomMissionOrder      bool   `json:"randomMissionOrder"`
	MissionsToServerRestart int    `json:"missionsToServerRestart"`

	// Gameplay — Voting
	VoteThreshold      *float64 `json:"voteThreshold"`
	VoteMissionPlayers *int     `json:"voteMissionPlayers"`
	LobbyTimeout       *int     `json:"lobbyTimeout"`

	// VoN quality (server.cfg)
	VonCodec        *int `json:"vonCodec"`
	VonCodecQuality int  `json:"vonCodecQuality"`

	CBAPresetID *int64     `json:"cbaPresetId"`
	CBAPreset   *CBAPreset `json:"cbaPreset"`

	// Anti-cheat
	KickDuplicate bool `json:"kickDuplicate"`

	// Advanced Settings (server.cfg)
	IdleFPSLimit            *int `json:"idleFPSLimit"`
	SkipDescriptionParsing  bool `json:"skipDescriptionParsing"`
	LogObjectNotFound       bool `json:"logObjectNotFound"`
	EnablePlayerDiag        bool `json:"enablePlayerDiag"`
	ForceRotorLibSimulation int  `json:"forceRotorLibSimulation"`
	DrawingInMap            bool `json:"drawingInMap"`

	// QoS enforcement (server.cfg — NOT basic.cfg)
	DisconnectTimeout           *int `json:"disconnectTimeout"`
	MaxPing                     *int `json:"maxPing"`
	MaxDesync                   *int `json:"maxDesync"`
	MaxPacketLoss               *int `json:"maxPacketLoss"`
	KickOnSlowNetworkPing       bool `json:"kickOnSlowNetworkPing"`
	KickOnSlowNetworkPacketLoss bool `json:"kickOnSlowNetworkPacketLoss"`
	KickOnSlowNetworkDesync     bool `json:"kickOnSlowNetworkDesync"`
	KickOnSlowNetworkDisconnect bool `json:"kickOnSlowNetworkDisconnect"`

	// New extra settings from v0.22 migration
	AllowedHTMLLoadURIs []string `json:"allowedHTMLLoadURIs"`
	VotingTimeOut       *int     `json:"votingTimeOut"`
	RoleTimeOut         *int     `json:"roleTimeOut"`
	BriefingTimeOut     *int     `json:"briefingTimeOut"`
	DebriefingTimeOut   *int     `json:"debriefingTimeOut"`
	SkipLobby           bool     `json:"skipLobby"`
	AllowProfileGlasses bool     `json:"allowProfileGlasses"`
	RequiredBuild       *int     `json:"requiredBuild"`
	StatisticsEnabled   bool     `json:"statisticsEnabled"`
	ArmaUnitsTimeout    *int     `json:"armaUnitsTimeout"`
	OverrideHazeQuality *int     `json:"overrideHazeQuality"`
	FastDownloadEnabled bool     `json:"fastDownloadEnabled"`

	// Performance and Advanced Options (v0.24)
	LimitFPS                   *int     `json:"limitFPS"`
	MaxMem                     *int     `json:"maxMem"`
	CpuCount                   *int     `json:"cpuCount"`
	ExThreads                  *int     `json:"exThreads"`
	EnableHT                   bool     `json:"enableHT"`
	DebugMode                  bool     `json:"debugMode"`
	NetworkDiagInterval        *int     `json:"networkDiagInterval"`
	LoadMissionToMemory        bool     `json:"loadMissionToMemory"`
	ZeusCompositionScriptLevel *int     `json:"zeusCompositionScriptLevel"`
	LobbyIdleTimeout           *int     `json:"lobbyIdleTimeout"`
	AntiFloodCycleTime         *float64 `json:"antiFloodCycleTime"`
	AntiFloodCycleLimit        *int     `json:"antiFloodCycleLimit"`
	AntiFloodCycleHardLimit    *int     `json:"antiFloodCycleHardLimit"`
	AntiFloodEnableKick        *int     `json:"antiFloodEnableKick"`
}

type DayZServer struct {
	Server
	EnableWhitelist          bool      `json:"enableWhitelist"`
	DisableBanlist           bool      `json:"disableBanlist"`
	DisablePrioritylist      bool      `json:"disablePrioritylist"`
	VerifySignatures         int       `json:"verifySignatures"`
	ForceSameBuild           bool      `json:"forceSameBuild"`
	DisableVoN               bool      `json:"disableVoN"`
	VonCodecQuality          int       `json:"vonCodecQuality"`
	Disable3rdPerson         bool      `json:"disable3rdPerson"`
	DisableCrosshair         bool      `json:"disableCrosshair"`
	ServerTime               string    `json:"serverTime"`
	TimeAcceleration         float64   `json:"timeAcceleration"`
	NightTimeAcceleration    float64   `json:"nightTimeAcceleration"`
	ServerTimePersistent     bool      `json:"serverTimePersistent"`
	LoginQueueConcurrent     int       `json:"loginQueueConcurrent"`
	LoginQueueMax            int       `json:"loginQueueMax"`
	InstanceID               int       `json:"instanceId"`
	StorageAutoFix           bool      `json:"storageAutoFix"`
	RespawnTime              int       `json:"respawnTime"`
	Motd                     []string  `json:"motd"`
	MotdInterval             int       `json:"motdInterval"`
	TimeStampFormat          string    `json:"timeStampFormat"`
	LogAverageFps            int       `json:"logAverageFps"`
	LogMemory                int       `json:"logMemory"`
	LogPlayers               int       `json:"logPlayers"`
	AdminLogPlayerHits       bool      `json:"adminLogPlayerHits"`
	AdminLogPlacement        bool      `json:"adminLogPlacement"`
	AdminLogBuildActions     bool      `json:"adminLogBuildActions"`
	AdminLogPlayerList       bool      `json:"adminLogPlayerList"`
	EnableDebugMonitor       bool      `json:"enableDebugMonitor"`
	AllowFilePatching        bool      `json:"allowFilePatching"`
	SimulatedPlayersBatch    int       `json:"simulatedPlayersBatch"`
	MultithreadedReplication bool      `json:"multithreadedReplication"`
	SpeedhackDetection       int       `json:"speedhackDetection"`
	LightingConfig           int       `json:"lightingConfig"`
	DisablePersonalLight     bool      `json:"disablePersonalLight"`
	DisableBaseDamage        bool      `json:"disableBaseDamage"`
	DisableContainerDamage   bool      `json:"disableContainerDamage"`
	DisableRespawnDialog     bool      `json:"disableRespawnDialog"`
	PingWarning              int       `json:"pingWarning"`
	PingCritical             int       `json:"pingCritical"`
	MaxPing                  int       `json:"maxPing"`
	ServerFpsWarning         int       `json:"serverFpsWarning"`
	ShotValidation           bool      `json:"shotValidation"`
	BattlEye                 bool      `json:"battlEye"`
	ScenarioID               string    `json:"scenarioId"`
	ProfilesPath             string    `json:"profilesPath"`
	BattlEyePath             string    `json:"battlEyePath"`
	EnableDoLogs             bool      `json:"enableDoLogs"`
	EnableAdminLog           bool      `json:"enableAdminLog"`
	EnableNetLog             bool      `json:"enableNetLog"`
	EnableFreezeCheck        bool      `json:"enableFreezeCheck"`
	LimitFPS                 int       `json:"limitFPS"`
	AdditionalOptions        string    `json:"additionalOptions"`
	ActiveMods               []int64   `json:"activeMods"` // IDs of WorkshopMod
	ModNames                 []ModInfo `json:"-"`          // Resolved mod info
}

type ReforgerMod struct {
	Name      string `json:"name"`
	ID        string `json:"id"`
	Thumbnail string `json:"thumbnail"`
}

type ServerInstanceInfo struct {
	StartedAt            *time.Time       `json:"startedAt"`
	MaxPlayers           int              `json:"maxPlayers"`
	CurrentLogFile       string           `json:"currentLogFile"`
	HeadlessClientsCount int              `json:"headlessClientsCount"`
	LastReforgerStat     *ReforgerStatDto `json:"lastReforgerStat"`
	Players              int              `json:"players"`
	Map                  string           `json:"map"`
	Mission              string           `json:"mission"`
}

type ReforgerStatDto struct {
	Timestamp     string  `json:"timestamp"`
	FPS           float64 `json:"fps"`
	MemoryMB      float64 `json:"memoryMb"`
	Players       uint16  `json:"players"`
	AI            uint16  `json:"ai"`
	Vehicles      uint16  `json:"vehicles"`
	VehiclesTotal uint16  `json:"vehiclesTotal"`
	Projectiles   uint16  `json:"projectiles"`
	RplItems      uint32  `json:"rplItems"`
}

type ReforgerServer struct {
	Server
	Admins                     []string         `json:"admins"`
	ScenarioID                 string           `json:"scenarioId"`
	ThirdPersonViewEnabled     bool             `json:"thirdPersonViewEnabled"`
	BattlEye                   bool             `json:"battlEye"`
	Visible                    bool             `json:"visible"`
	CrossPlatform              bool             `json:"crossPlatform"`
	ServerMaxViewDistance      int              `json:"serverMaxViewDistance"`
	ServerMinGrassDistance     int              `json:"serverMinGrassDistance"`
	NetworkViewDistance        int              `json:"networkViewDistance"`
	NwkResolution              *int             `json:"nwkResolution"`
	FastValidation             bool             `json:"fastValidation"`
	DisableAI                  bool             `json:"disableAI"`
	DisableNavmeshStreaming    bool             `json:"disableNavmeshStreaming"`
	AILimit                    int              `json:"aiLimit"`
	VonCanTransmitCrossFaction bool             `json:"vonCanTransmitCrossFaction"`
	AutoSaveInterval           int              `json:"autoSaveInterval"`
	JoinQueueMaxSize           int              `json:"joinQueueMaxSize"`
	MaxFPS                     int              `json:"maxFPS"`
	MissionHeader              *json.RawMessage `json:"missionHeader"`
	NetworkDynamicSimulation   *int             `json:"networkDynamicSimulation"`
	ReplicationTimeoutMs       *int             `json:"replicationTimeoutMs"`
	StreamsDelta               *int             `json:"streamsDelta"`
	StreamingBudget            *int             `json:"streamingBudget"`
	LogStats                   bool             `json:"logStats"`
	LogStatsIntervalMs         *int             `json:"logStatsIntervalMs"`
	AddonsVerify               bool             `json:"addonsVerify"`
	AddonsRepair               bool             `json:"addonsRepair"`
	NoThrow                    bool             `json:"noThrow"`
	ActiveMods                 []ReforgerMod    `json:"activeMods"`
}
