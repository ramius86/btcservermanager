import type { RosterSquad, RosterSlot, PlayerRoleStat } from '../../services/api'

export interface RosterCandidate {
  id: string
  name: string
  isMaybe: boolean
  isGuest?: boolean
  qualifications: string[]
}

export const COMMON_ROLES = [
  // Command & Leadership
  { code: 'GM', label: 'GM (Game Master)', category: 'Command' },
  { code: 'PL', label: 'PL (Platoon Leader)', category: 'Command' },
  { code: 'Nomad', label: 'Nomad (HQ)', category: 'Command' },
  { code: 'SL', label: 'SL (Squad Leader)', category: 'Command' },
  { code: 'TL', label: 'TL (Team Leader)', category: 'Command' },
  { code: 'SL/TL', label: 'SL/TL (Leader)', category: 'Command' },

  // Medical
  { code: 'ME', label: 'ME (Medic)', category: 'Medical' },
  { code: 'TL/ME', label: 'TL/ME (Lead Medic)', category: 'Medical' },

  // Support & Machine Gun
  { code: 'MG', label: 'MG (Machine Gunner)', category: 'Support' },
  { code: 'AMG', label: 'AMG (Asst. Machine Gunner)', category: 'Support' },
  { code: 'AR', label: 'AR (Auto Rifleman)', category: 'Support' },
  { code: 'AAR', label: 'AAR (Asst. Auto Rifleman)', category: 'Support' },
  { code: 'Asst.AR', label: 'Asst.AR (Asst. Auto Rifleman)', category: 'Support' },

  // Specialist
  { code: 'AT', label: 'AT (Anti-Tank)', category: 'Specialist' },
  { code: 'SAP', label: 'SAP (Sapper)', category: 'Specialist' },
  { code: 'SAPPER', label: 'SAPPER (Combat Engineer)', category: 'Specialist' },
  { code: 'Gen', label: 'Gen (Genio / Engineer)', category: 'Specialist' },
  { code: 'MK', label: 'MK (Marksman)', category: 'Specialist' },
  { code: 'GRE', label: 'GRE (Grenadier)', category: 'Specialist' },

  // Infantry
  { code: 'RIF', label: 'RIF (Rifleman)', category: 'Infantry' },
]

/**
 * Autocomplete / next callsign generator:
 * - "ALPHA 1" -> "ALPHA 2"
 * - "OMBRA 1" -> "OMBRA 2"
 * - "TEAM 1 (SL 2)" -> "TEAM 2 (SL 2)"
 * - "DELTA 3" -> "DELTA 4"
 * - "Team 2" -> "Team 3"
 */
export function getNextCallsign(lastCallsign: string, existingSquads: RosterSquad[] = []): string {
  if (!lastCallsign?.trim()) {
    return `TEAM ${existingSquads.length + 1}`
  }

  const trimmed = lastCallsign.trim()

  // Match parenthetical suffix like "TEAM 1 (SL 2)"
  const parenMatch = /^(.*?)(\d+)(\s*\([^)]*\))$/.exec(trimmed)
  if (parenMatch) {
    const prefix = parenMatch[1]
    const num = Number.parseInt(parenMatch[2], 10) + 1
    const suffix = parenMatch[3]
    return `${prefix}${num}${suffix}`
  }

  // Match ending number like "ALPHA 1", "TEAM 1", "OMBRA 2"
  const endNumMatch = /^(.*?)(\d+)$/.exec(trimmed)
  if (endNumMatch) {
    const prefix = endNumMatch[1]
    const num = Number.parseInt(endNumMatch[2], 10) + 1
    return `${prefix}${num}`
  }

  // NATO phonetic progression if single word
  const nato = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT']
  const upper = trimmed.toUpperCase()
  const idx = nato.indexOf(upper)
  if (idx >= 0 && idx < nato.length - 1) {
    return nato[idx + 1]
  }

  // Default fallback
  return `${trimmed} ${existingSquads.length + 1}`
}

export function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return `${prefix}_${Date.now()}_${array[0].toString(36)}`
  }
  return `${prefix}_${Date.now()}`
}

/**
 * Clones an existing squad: duplicates its role layout with empty player slots
 * and an auto-incremented callsign.
 */
export function cloneSquad(source: RosterSquad, existingSquads: RosterSquad[]): RosterSquad {
  const nextName = getNextCallsign(source.name, existingSquads)
  const newSquadId = generateId('squad')

  const clonedSlots: RosterSlot[] = source.slots.map(s => ({
    id: generateId('slot'),
    role: s.role,
    assignedPlayerName: '',
    assignedUserId: '',
    isMaybe: false,
    isGuest: false,
  }))

  return {
    id: newSquadId,
    name: nextName,
    slots: clonedSlots,
  }
}

const ROLE_MATCHERS: Array<{
  roles: string[]
  qualPatterns: string[]
}> = [
  {
    roles: ['me', 'tl/me', 'doc'],
    qualPatterns: ['med', 'sanit', 'cls', 'doc'],
  },
  {
    roles: ['sl', 'tl', 'sl/tl', 'pl', 'gm'],
    qualPatterns: ['capo', 'lead', 'comand', 'sl', 'tl', 'ufficiale'],
  },
  {
    roles: ['mg', 'ar', 'amg', 'aar', 'asst.ar'],
    qualPatterns: ['mitragli', 'mg', 'ar', 'gunner', 'support'],
  },
  {
    roles: ['at'],
    qualPatterns: ['anti', 'at', 'tank', 'rpg', 'missil'],
  },
  {
    roles: ['sap', 'sapper', 'gen'],
    qualPatterns: ['sap', 'geni', 'guastat', 'eod', 'demol', 'miner'],
  },
  {
    roles: ['mk', 'sniper'],
    qualPatterns: ['scelto', 'mark', 'snip', 'tirator', 'dmr'],
  },
  {
    roles: ['gre'],
    qualPatterns: ['grenad', 'lanciagranate', 'gre'],
  },
  {
    roles: ['rif'],
    qualPatterns: ['fucil', 'rif'],
  },
]

/**
 * Checks if a member qualification matches a given squad role code.
 */
export function qualificationMatchesRole(qualName: string, role: string): boolean {
  if (!qualName || !role) return false
  const q = qualName.toLowerCase().trim()
  const r = role.toLowerCase().trim()

  if (q === r) return true

  for (const matcher of ROLE_MATCHERS) {
    if (matcher.roles.includes(r) && matcher.qualPatterns.some(pat => q.includes(pat))) {
      return true
    }
  }

  return false
}

export interface AffinityResult {
  candidate: RosterCandidate
  score: number // 0 - 100+
  hasBrevetto: boolean
  matchedQualification?: string
  playCount: number
  isHighAffinity: boolean
}

/**
 * Calculates how well a player candidate fits a given role based on:
 * 1. Clan qualification (Brevetto)
 * 2. Historical play frequency from past rosters
 * 3. RSVP status (Going vs Maybe)
 */
export function calculateCandidateAffinity(
  candidate: RosterCandidate,
  role: string,
  learningStats: PlayerRoleStat[],
  gameType?: string
): AffinityResult {
  let score = 0
  let hasBrevetto = false
  let matchedQual: string | undefined

  // 1. Check qualification
  for (const q of candidate.qualifications) {
    if (qualificationMatchesRole(q, role)) {
      hasBrevetto = true
      matchedQual = q
      score += 60 // heavy baseline weight for official qualification
      break
    }
  }

  // 2. Check historical role frequency
  let playCount = 0
  for (const stat of learningStats) {
    const userMatch =
      (stat.userId && stat.userId === candidate.id) ||
      stat.playerName?.toLowerCase() === candidate.name.toLowerCase()

    if (userMatch && stat.role.toLowerCase() === role.toLowerCase()) {
      // Bonus if specific to this game type
      const isSameGame = !gameType || stat.gameType === 'all' || stat.gameType.toLowerCase() === gameType.toLowerCase()
      playCount += stat.playCount
      score += stat.playCount * (isSameGame ? 15 : 8)
    }
  }

  // 3. Penalty for maybe (still eligible, but going has higher certainty)
  if (candidate.isMaybe) {
    score = Math.max(0, score - 10)
  }

  const isHighAffinity = hasBrevetto || playCount > 0

  return {
    candidate,
    score,
    hasBrevetto,
    matchedQualification: matchedQual,
    playCount,
    isHighAffinity,
  }
}

/**
 * Ranks all available candidates for a specific slot role.
 */
export function rankCandidatesForRole(
  candidates: RosterCandidate[],
  role: string,
  learningStats: PlayerRoleStat[],
  gameType?: string
): AffinityResult[] {
  return candidates
    .map(c => calculateCandidateAffinity(c, role, learningStats, gameType))
    .sort((a, b) => {
      // Higher score first
      if (b.score !== a.score) return b.score - a.score
      // Going before Maybe
      if (a.candidate.isMaybe !== b.candidate.isMaybe) return a.candidate.isMaybe ? 1 : -1
      // Alphabetical
      return a.candidate.name.localeCompare(b.candidate.name)
    })
}

/**
 * Smart Fill: Automatically fills empty slots across all squads
 * prioritizing critical specialist roles with highest-affinity players.
 */
export function smartFillSquads(
  squads: RosterSquad[],
  unassignedCandidates: RosterCandidate[],
  learningStats: PlayerRoleStat[],
  gameType?: string
): { updatedSquads: RosterSquad[]; remainingCandidates: RosterCandidate[] } {
  const availablePool = [...unassignedCandidates]
  const newSquads = structuredClone(squads) as RosterSquad[]

  // Collect all empty slots
  interface EmptySlotRef {
    squadIdx: number
    slotIdx: number
    role: string
    priority: number
  }

  const rolePriority = (r: string): number => {
    const code = r.toUpperCase()
    if (code === 'GM' || code === 'PL' || code === 'NOMAD') return 10
    if (code === 'SL' || code === 'SL/TL') return 9
    if (code === 'TL') return 8
    if (code === 'ME' || code === 'TL/ME') return 7
    if (code === 'MG' || code === 'AR') return 6
    if (code === 'AT') return 5
    if (code === 'SAP' || code === 'SAPPER' || code === 'GEN') return 4
    if (code === 'MK') return 3
    if (code === 'AMG' || code === 'AAR' || code === 'ASST.AR') return 2
    return 1 // RIF / other
  }

  const emptySlots: EmptySlotRef[] = []
  for (let sIdx = 0; sIdx < newSquads.length; sIdx++) {
    for (let slotIdx = 0; slotIdx < newSquads[sIdx].slots.length; slotIdx++) {
      const slot = newSquads[sIdx].slots[slotIdx]
      if (!slot.assignedPlayerName) {
        emptySlots.push({
          squadIdx: sIdx,
          slotIdx,
          role: slot.role,
          priority: rolePriority(slot.role),
        })
      }
    }
  }

  // Sort slots by priority (command, medics, heavy weapons first)
  emptySlots.sort((a, b) => b.priority - a.priority)

  for (const emptySlot of emptySlots) {
    if (availablePool.length === 0) break

    // Rank available candidates for this role
    const ranked = rankCandidatesForRole(availablePool, emptySlot.role, learningStats, gameType)
    if (ranked.length === 0) continue

    const best = ranked[0]
    // Assign best candidate
    const slot = newSquads[emptySlot.squadIdx].slots[emptySlot.slotIdx]
    slot.assignedPlayerName = best.candidate.name
    slot.assignedUserId = best.candidate.id
    slot.isMaybe = best.candidate.isMaybe
    slot.isGuest = best.candidate.isGuest

    // Remove from available pool
    const poolIdx = availablePool.findIndex(c => c.id === best.candidate.id && c.name === best.candidate.name)
    if (poolIdx >= 0) {
      availablePool.splice(poolIdx, 1)
    }
  }

  return {
    updatedSquads: newSquads,
    remainingCandidates: availablePool,
  }
}

/**
 * Strips trailing (?) or (?) suffixes from a player name to ensure
 * clean names even if historical data contained the suffix.
 */
export function cleanPlayerName(name?: string): string {
  if (!name) return ''
  return name.replace(/\s*\(\?\)\s*$/, '').trim()
}

/**
 * Searches for a matching candidate in the pool using:
 * 1. Assigned user ID
 * 2. Exact cleaned name (case-insensitive)
 * 3. Tag-stripped clan name (e.g. "=BTC= Cpt.Ramius86" matches "Cpt.Ramius86")
 */
function matchCandidateForSlot(
  slot: RosterSlot,
  candidateById: Map<string, RosterCandidate>,
  candidateByName: Map<string, RosterCandidate>,
  candidateByStrippedName: Map<string, RosterCandidate>
): RosterCandidate | undefined {
  if (slot.assignedUserId && candidateById.has(slot.assignedUserId)) {
    return candidateById.get(slot.assignedUserId)
  }

  const cleaned = cleanPlayerName(slot.assignedPlayerName).toLowerCase()
  if (!cleaned) return undefined

  if (candidateByName.has(cleaned)) {
    return candidateByName.get(cleaned)
  }

  const strippedCleaned = cleaned.replace(/^=[^=]+=\s*/, '').trim()
  if (strippedCleaned && candidateByStrippedName.has(strippedCleaned)) {
    return candidateByStrippedName.get(strippedCleaned)
  }

  return undefined
}

/**
 * Reconciles the slots of existing squads with the latest candidate pool / Discord RSVPs.
 * For each assigned slot:
 * - Cleans any historical ' (?)' baked into assignedPlayerName
 * - Matches the player against current candidate pool
 * - Updates slot.isMaybe to match the candidate's current RSVP state
 * - If candidate is found and slot was missing assignedUserId, updates it
 */
export function reconcileSquadsWithCandidates(
  squads: RosterSquad[],
  candidates: RosterCandidate[]
): RosterSquad[] {
  if (!candidates || candidates.length === 0) {
    return squads.map(sq => ({
      ...sq,
      slots: sq.slots.map(sl => ({
        ...sl,
        assignedPlayerName: cleanPlayerName(sl.assignedPlayerName),
      })),
    }))
  }

  const candidateById = new Map<string, RosterCandidate>()
  const candidateByName = new Map<string, RosterCandidate>()
  const candidateByStrippedName = new Map<string, RosterCandidate>()

  for (const c of candidates) {
    if (c.id) {
      candidateById.set(c.id, c)
    }
    const lowerName = c.name.toLowerCase().trim()
    candidateByName.set(lowerName, c)

    const stripped = lowerName.replace(/^=[^=]+=\s*/, '').trim()
    if (stripped) {
      candidateByStrippedName.set(stripped, c)
    }
  }

  return squads.map(squad => ({
    ...squad,
    slots: squad.slots.map(slot => {
      if (!slot.assignedPlayerName?.trim()) {
        return {
          ...slot,
          assignedPlayerName: '',
          assignedUserId: '',
          isMaybe: false,
          isGuest: false,
        }
      }

      const cleanedName = cleanPlayerName(slot.assignedPlayerName)
      const matched = matchCandidateForSlot(
        { ...slot, assignedPlayerName: cleanedName },
        candidateById,
        candidateByName,
        candidateByStrippedName
      )

      if (matched) {
        const resolvedName =
          !slot.isGuest && matched.id && slot.assignedUserId && matched.id === slot.assignedUserId
            ? cleanPlayerName(matched.name)
            : cleanedName

        return {
          ...slot,
          assignedPlayerName: resolvedName,
          assignedUserId: matched.id || slot.assignedUserId,
          isMaybe: matched.isMaybe,
          isGuest: matched.isGuest ?? slot.isGuest ?? false,
        }
      }

      return {
        ...slot,
        assignedPlayerName: cleanedName,
        isMaybe: false,
      }
    }),
  }))
}

function formatPlayerSuffix(name: string, isMaybe?: boolean): string {
  if (!name) return ''
  return isMaybe ? `${name} (?)` : name
}

function isSoloFigureSquad(squadName: string, slotCount: number): boolean {
  if (slotCount !== 1) return false
  const upper = squadName.toUpperCase()
  return (
    upper.includes('NOMAD') ||
    upper.includes('COMANDO') ||
    upper === 'GM' ||
    upper === 'PL'
  )
}

/**
 * Formats the entire roster structure into a Discord-ready text message:
 * - Header (e.g. "@here slotlist per stasera")
 * - Single figure squads (e.g. "NOMAD - Raven" or "GM - Ramius")
 * - Numbered squads with role lines ("SL - Giallustio", "ME - Freeman68")
 * - Unfilled slots as "ROLE - "
 * - Maybe players appended with " (?)"
 */
export function formatRosterForDiscord(headerText: string, squads: RosterSquad[]): string {
  const lines: string[] = []

  if (headerText?.trim()) {
    lines.push(headerText.trim(), '')
  }

  for (const squad of squads) {
    const squadName = squad.name.trim()

    // Solo figure squad (e.g., Squad with 1 slot whose name is NOMAD or GM or COMANDO)
    if (isSoloFigureSquad(squadName, squad.slots.length)) {
      const slot = squad.slots[0]
      const cleanName = cleanPlayerName(slot.assignedPlayerName)
      const playerName = formatPlayerSuffix(cleanName, slot.isMaybe)
      lines.push(`${squadName} - ${playerName}`, '')
      continue
    }

    // Standard squad block
    if (squadName) {
      lines.push(squadName)
    }

    for (const slot of squad.slots) {
      const role = slot.role.trim() || 'SL'
      const cleanName = cleanPlayerName(slot.assignedPlayerName)
      const playerName = formatPlayerSuffix(cleanName, slot.isMaybe)
      lines.push(`${role} - ${playerName}`)
    }

    lines.push('')
  }

  return lines.join('\n').trim()
}

const IT_DAYS = [
  'domenica',
  'lunedì',
  'martedì',
  'mercoledì',
  'giovedì',
  'venerdì',
  'sabato',
] as const

const IT_MONTHS = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
] as const

/**
 * Formats an event date string (e.g. "2026-09-23T20:30") into Italian localized text:
 * e.g. "mercoledì 23 Settembre"
 */
export function formatItalianEventDate(dateTimeStr?: string): string {
  if (!dateTimeStr) return ''

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateTimeStr.trim())
  let dateObj: Date | null = null

  if (match) {
    const year = Number.parseInt(match[1], 10)
    const month = Number.parseInt(match[2], 10) - 1
    const day = Number.parseInt(match[3], 10)
    dateObj = new Date(year, month, day)
  } else {
    const parsed = new Date(dateTimeStr)
    if (!Number.isNaN(parsed.getTime())) {
      dateObj = parsed
    }
  }

  if (!dateObj || Number.isNaN(dateObj.getTime())) {
    return ''
  }

  const dayOfWeek = IT_DAYS[dateObj.getDay()]
  const dayOfMonth = dateObj.getDate()
  const monthName = IT_MONTHS[dateObj.getMonth()]

  return `${dayOfWeek} ${dayOfMonth} ${monthName}`
}

/**
 * Normalizes game type name for Discord export:
 * "ArmA III" or "ArmA Reforger"
 */
export function formatRosterGameName(gameType?: string): string {
  if (!gameType) return 'ArmA III'
  const lower = gameType.toLowerCase().trim()
  if (lower.includes('reforger')) {
    return 'ArmA Reforger'
  }
  if (lower.includes('arma') || lower.includes('arma3') || lower.includes('arma iii')) {
    return 'ArmA III'
  }
  return gameType
}

/**
 * Constructs the default Discord roster header message based on date and game:
 * e.g. "@here Slotlist per l'evento di questa sera, mercoledì 23 Settembre su ArmA III"
 */
export function buildDefaultRosterHeader(dateTimeStr?: string, gameType?: string): string {
  const formattedDate = formatItalianEventDate(dateTimeStr)
  const formattedGame = formatRosterGameName(gameType)

  if (formattedDate) {
    return `@here Slotlist per l'evento di questa sera, ${formattedDate} su ${formattedGame}`
  }
  return `@here Slotlist per l'evento di questa sera su ${formattedGame}`
}

