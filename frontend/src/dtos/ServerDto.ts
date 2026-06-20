export enum ServerType {
    ARMA3 = 'ARMA3',
    REFORGER = 'REFORGER',
    DAYZ = 'DAYZ',
    DAYZ_EXP = 'DAYZ_EXP'
}

export interface AutomaticRestartDto {
    enabled: boolean;
    time: string | null;
}

export interface CreatorDlcDto {
    id: string;
    name: string;
}

export interface ReforgerModDto {
    name: string;
    id: string;
    thumbnail: string;
}

export interface LaunchParameter {
    id?: number;
    serverId?: number;
    name: string;
    value: string | null;
}

export interface ServerDto {
    type: string;
    id?: number;
    name: string;
    description: string;
    port: number;
    queryPort: number;
    password: string;
    adminPassword: string;
    maxPlayers: number;
    customLaunchParameters: LaunchParameter[];
    restartAutomatically: boolean;
    automaticRestartTime: string | null;
    sortOrder?: number;
}

export type DifficultyLevel = 0 | 1 | 2;

export interface Arma3DifficultySettings {
    groupIndicators: DifficultyLevel;
    friendlyTags: DifficultyLevel;
    enemyTags: DifficultyLevel;
    detectedMines: DifficultyLevel;
    commands: DifficultyLevel;
    waypoints: DifficultyLevel;
    weaponInfo: DifficultyLevel;
    stanceIndicator: DifficultyLevel;
    thirdPersonView: DifficultyLevel;
    tacticalPing: 0 | 1 | 2 | 3;
    reducedDamage: boolean;
    staminaBar: boolean;
    weaponCrosshair: boolean;
    visionAid: boolean;
    scoreTable: boolean;
    deathMessages: boolean;
    vonID: boolean;
    mapContent: boolean;
    autoReport: boolean;
    cameraShake: boolean;
    aiLevelPreset: number;
    skillAI: number;
    precisionAI: number;
}

export interface Arma3NetworkSettings {
    maxMessagesSend: number | null;
    maxSizeGuaranteed: number | null;
    maxSizeNonguaranteed: number | null;
    minBandwidth: number | null;
    maxBandwidth: number | null;
    maxCustomFileSize: number | null;
    minErrorToSend: number | null;
    minErrorToSendNear: number | null;
    maxPacketSize: number | null;
    disconnectTimeout: number | null;
    maxPing: number | null;
    maxDesync: number | null;
    maxPacketLoss: number | null;
    steamProtocolMaxDataSize: number | null;
}

export interface CBAPresetDto {
    id?: number;
    name: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Arma3ServerDto extends ServerDto {
    clientFilePatching: number;
    serverFilePatching: boolean;
    persistent: boolean;
    battlEye: boolean;
    vonEnabled: boolean;
    verifySignatures: boolean;
    serverCommandPassword: string;
    motd: string[];
    motdInterval: number | null;
    admins: string[];
    allowedLoadFileExtensions: string[];
    allowedPreprocessFileExtensions: string[];
    allowedHTMLLoadExtensions: string[];
    headlessClients: string[];
    localClient: string[];
    activeMods: number[]; // In Go backend, this is []int64 of mod IDs
    activeDLCs: string[]; // In Go backend, this is []string of CDLC IDs
    additionalOptions: string;
    difficultySettings: Arma3DifficultySettings | null;
    networkSettings: Arma3NetworkSettings | null;
    cbaPresetId: number | null;
    cbaPreset: CBAPresetDto | null;
    enableDebugConsole: number;
    debugConsoleAdmins: string[];
    allowedHTMLLoadURIs: string[];
    votingTimeOut: number | null;
    roleTimeOut: number | null;
    briefingTimeOut: number | null;
    debriefingTimeOut: number | null;
    skipLobby: boolean;
    allowProfileGlasses: boolean;
    requiredBuild: number | null;
    statisticsEnabled: boolean;
    armaUnitsTimeout: number | null;
    overrideHazeQuality: number | null;
    fastDownloadEnabled: boolean;
    limitFPS: number | null;
    maxMem: number | null;
    cpuCount: number | null;
    exThreads: number | null;
    enableHT: boolean;
    debugMode: boolean;
    networkDiagInterval: number | null;
    loadMissionToMemory: boolean;
    zeusCompositionScriptLevel: number | null;
    lobbyIdleTimeout: number | null;
    antiFloodCycleTime: number | null;
    antiFloodCycleLimit: number | null;
    antiFloodCycleHardLimit: number | null;
    antiFloodEnableKick: number | null;
}

export interface DayZServerDto extends ServerDto {
    enableWhitelist: boolean;
    disableBanlist: boolean;
    disablePrioritylist: boolean;
    verifySignatures: number;
    forceSameBuild: boolean;
    disableVoN: boolean;
    vonCodecQuality: number;
    disable3rdPerson: boolean;
    disableCrosshair: boolean;
    serverTime: string;
    timeAcceleration: number;
    nightTimeAcceleration: number;
    serverTimePersistent: boolean;
    loginQueueConcurrent: number;
    loginQueueMax: number;
    instanceId: number;
    storageAutoFix: boolean;
    respawnTime: number;
    motd: string[];
    motdInterval: number;
    timeStampFormat: string;
    logAverageFps: number;
    logMemory: number;
    logPlayers: number;
    adminLogPlayerHits: boolean;
    adminLogPlacement: boolean;
    adminLogBuildActions: boolean;
    adminLogPlayerList: boolean;
    enableDebugMonitor: boolean;
    allowFilePatching: boolean;
    simulatedPlayersBatch: number;
    multithreadedReplication: boolean;
    speedhackDetection: number;
    lightingConfig: number;
    disablePersonalLight: boolean;
    disableBaseDamage: boolean;
    disableContainerDamage: boolean;
    disableRespawnDialog: boolean;
    pingWarning: number;
    pingCritical: number;
    maxPing: number;
    serverFpsWarning: number;
    shotValidation: boolean;
    battlEye: boolean;
    scenarioId: string;
    profilesPath: string;
    battlEyePath: string;
    enableDoLogs: boolean;
    enableAdminLog: boolean;
    enableNetLog: boolean;
    enableFreezeCheck: boolean;
    limitFPS: number;
    additionalOptions: string;
    activeMods: number[];
}


export interface ReforgerServerDto extends ServerDto {
    scenarioId: string;
    battlEye: boolean;
    thirdPersonViewEnabled: boolean;
    visible: boolean;
    crossPlatform: boolean;
    serverMaxViewDistance: number;
    serverMinGrassDistance: number;
    networkViewDistance: number;
    fastValidation: boolean;
    disableAI: boolean;
    aiLimit: number;
    vonCanTransmitCrossFaction: boolean;
    autoSaveInterval: number;
    joinQueueMaxSize: number;
    maxFPS: number;
    networkDynamicSimulation?: number;
    replicationTimeoutMs?: number;
    streamsDelta?: number;
    streamingBudget?: number;
    logStats?: boolean;
    logStatsIntervalMs?: number;
    addonsVerify?: boolean;
    addonsRepair: boolean;
    noThrow: boolean;
    missionHeader: string;
    activeMods: Array<ReforgerModDto>;
    admins?: string[];
    nwkResolution?: number;
    disableNavmeshStreaming?: boolean;
}

export type AnyServerDto = Arma3ServerDto | DayZServerDto | ReforgerServerDto;

export function isArma3Server(s: AnyServerDto): s is Arma3ServerDto {
    return s.type === ServerType.ARMA3;
}

export function isDayZServer(s: AnyServerDto): s is DayZServerDto {
    return s.type === ServerType.DAYZ || s.type === ServerType.DAYZ_EXP;
}

export function isReforgerServer(s: AnyServerDto): s is ReforgerServerDto {
    return s.type === ServerType.REFORGER;
}

export interface ServerInstanceInfoDto {
    startedAt: string | null;
    maxPlayers: number;
    currentLogFile: string;
    headlessClientsCount: number;
    // Synthesized properties used in UI
    alive?: boolean;
    playersOnline?: number;
    map?: string;
    version?: string;
}

export interface ServerInstallationDto {
    type: string;
    branch: string;
    installedBranch?: string;
    version: string;
    installationStatus: string;
    progress?: number;
    lastUpdatedAt?: string;
    availableVersion?: string;
    installedBuildId?: string;
    availableBranches?: string[];
}
