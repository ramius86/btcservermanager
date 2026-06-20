/**
 * constants.ts
 * 
 * Purpose: Centralized configuration defaults and initial state logic.
 * 
 * Where to add logic:
 * - Add new default values for any game-specific DTO properties here.
 * - Update getInitialState when adding new fields that need to be initialized for new server instances.
 */

export const DEFAULT_ARMA3_EXTENSIONS = ["hpp", "sqs", "sqf", "fsm", "cpp", "paa", "txt", "xml", "inc", "ext", "sqm", "ods", "fxy", "lip", "csv", "kb", "bik", "bikb", "html", "htm", "biedi"];

export const getInitialState = (t: string) => {
  const base = {
    type: t,
    name: '',
    description: '',
    port: 2302,
    queryPort: 2303,
    maxPlayers: 32,
    password: '',
    adminPassword: '',
    restartAutomatically: false,
    automaticRestartTime: '04:00',
    customLaunchParameters: []
  }

  if (t === 'ARMA3') {
    return {
      ...base,
      clientFilePatching: 1,
      persistent: true,
      battlEye: true,
      vonEnabled: true,
      verifySignatures: 2,
      serverCommandPassword: '',
      motdInterval: 5,
      motd: [],
      admins: [],
      allowedLoadFileExtensions: [...DEFAULT_ARMA3_EXTENSIONS],
      allowedPreprocessFileExtensions: [...DEFAULT_ARMA3_EXTENSIONS],
      allowedHTMLLoadExtensions: ["htm", "html", "xml", "txt"],
      headlessClients: ["127.0.0.1"],
      localClient: ["127.0.0.1"],
      missions: [],
      activeDLCs: [],
      // Gameplay — Mission rotation
      forcedDifficulty: 'custom',
      autoSelectMission: true,
      randomMissionOrder: false,
      missionsToServerRestart: 0,
      skipLobby: false,
      allowProfileGlasses: true,
      statisticsEnabled: true,
      // Gameplay — Voting
      voteThreshold: null,
      voteMissionPlayers: null,
      lobbyTimeout: null,
      // VoN
      vonCodecQuality: 30,
      // Anti-cheat
      kickDuplicate: true,
      // QoS enforcement
      disconnectTimeout: null,
      maxPing: null,
      maxDesync: null,
      maxPacketLoss: null,
      kickOnSlowNetworkPing: true,
      kickOnSlowNetworkPacketLoss: true,
      kickOnSlowNetworkDesync: true,
      kickOnSlowNetworkDisconnect: true,
      // Advanced Settings
      idleFPSLimit: null,
      skipDescriptionParsing: false,
      logObjectNotFound: false,
      enablePlayerDiag: false,
      forceRotorLibSimulation: 0,
      drawingInMap: true,
      difficultySettings: {
        groupIndicators: 0,
        friendlyTags: 0,
        enemyTags: 0,
        detectedMines: 0,
        commands: 1,
        waypoints: 1,
        weaponInfo: 2,
        stanceIndicator: 2,
        thirdPersonView: 0,
        tacticalPing: 0,
        reducedDamage: false,
        staminaBar: false,
        weaponCrosshair: false,
        visionAid: false,
        scoreTable: true,
        deathMessages: true,
        vonID: true,
        mapContent: false,
        autoReport: false,
        cameraShake: true,
        aiLevelPreset: 3,
        skillAI: 0.5,
        precisionAI: 0.5
      }
    }
  }

  if (t === 'DAYZ' || t === 'DAYZ_EXP') {
    return {
      ...base,
      enableWhitelist: false,
      disableBanlist: false,
      disablePrioritylist: false,
      verifySignatures: 2,
      forceSameBuild: true,
      disableVoN: false,
      vonCodecQuality: 20,
      disable3rdPerson: false,
      disableCrosshair: false,
      serverTime: "SystemTime",
      timeAcceleration: 1,
      nightTimeAcceleration: 1,
      serverTimePersistent: false,
      loginQueueConcurrent: 5,
      loginQueueMax: 500,
      instanceId: 1,
      storageAutoFix: true,
      respawnTime: 5,
      motd: [],
      motdInterval: 5,
      timeStampFormat: "Short",
      logAverageFps: 1,
      logMemory: 1,
      logPlayers: 1,
      adminLogPlayerHits: false,
      adminLogPlacement: false,
      adminLogBuildActions: false,
      adminLogPlayerList: false,
      enableDebugMonitor: false,
      allowFilePatching: false,
      simulatedPlayersBatch: 20,
      multithreadedReplication: true,
      speedhackDetection: 1,
      lightingConfig: 0,
      disablePersonalLight: false,
      disableBaseDamage: false,
      disableContainerDamage: false,
      disableRespawnDialog: false,
      pingWarning: 200,
      pingCritical: 250,
      maxPing: 300,
      serverFpsWarning: 15,
      shotValidation: true,
      battlEye: true,
      activeMods: [],
      additionalOptions: 'class Missions\n{\n    class DayZ\n    {\n        template = "dayzOffline.chernarusplus";\n    };\n};'
    }
  }

  if (t === 'REFORGER') {
    return {
      ...base,
      port: 2001,
      queryPort: 17777,
      scenarioId: '{ECC61978EDCC2B5A}Missions/23_Campaign.conf',
      battlEye: true,
      thirdPersonViewEnabled: true,
      visible: true,
      crossPlatform: false,
      serverMaxViewDistance: 2500,
      serverMinGrassDistance: 50,
      networkViewDistance: 1000,
      fastValidation: true,
      disableAI: false,
      aiLimit: -1,
      vonCanTransmitCrossFaction: false,
      autoSaveInterval: 5,
      joinQueueMaxSize: 32,
      maxFPS: 120,
      networkDynamicSimulation: 0,
      replicationTimeoutMs: 15000,
      logStats: false,
      logStatsIntervalMs: 5000,
      addonsVerify: false,
      addonsRepair: false,
      noThrow: false,
      missionHeader: ''
    }
  }

  return base
}
