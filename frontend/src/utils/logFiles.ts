/**
 * Parsing of Arma 3 / DayZ log file names.
 *
 * The game type is a chain of uppercase segments (ARMA3, DAYZ, DAYZ_EXP,
 * REFORGER...); the numeric segment after it is the server ID. Segments never
 * start with a digit, which is what keeps the greedy game-type group from
 * swallowing the ID and the date.
 */
const SERVER_LOG_PATTERN =
  /^([A-Z][A-Z0-9]*(?:_[A-Z][A-Z0-9]*)*)_(\d+)(?:_HC(\d+))?_(\d{8})(?:_(\d{6}))?(?:\.stats)?\.log$/

export interface ServerLogInfo {
  gameType: string
  serverId: number
  headlessClientId: number | null
}

/**
 * Parses "<GAME>_<serverId>[_HC<n>]_<date>[_<time>][.stats].log".
 * Returns null for anything else, including steamcmd logs.
 */
export function parseServerLogName(file: string): ServerLogInfo | null {
  const match = SERVER_LOG_PATTERN.exec(file)
  if (!match) return null

  const serverId = Number.parseInt(match[2], 10)
  if (Number.isNaN(serverId)) return null

  return {
    gameType: match[1],
    serverId,
    headlessClientId: match[3] ? Number.parseInt(match[3], 10) : null,
  }
}

/**
 * Returns the part of the name that identifies the running instance, including
 * the headless client suffix ("ARMA3_1_HC2_"), so the main process and its
 * headless clients are grouped instead of being treated as separate servers.
 */
export function serverLogPrefix(file: string): string | null {
  const info = parseServerLogName(file)
  if (!info) return null

  const base = `${info.gameType}_${info.serverId}_`

  return info.headlessClientId === null ? base : `${base}HC${info.headlessClientId}_`
}
