import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  Sparkles,
  Bookmark,
  Send,
  Save,
  Plus,
  Trash2,
  CopyPlus,
  Search,
  UserPlus,
  Loader2,
  X,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Radio,
  ListOrdered,
  ArrowLeftRight,
  Edit3,
  Check,
  Pin,
  PinOff,
  UserCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import {
  DiscordService,
  DiscordEventDetail,
  DiscordChannel,
  RosterSquad,
  RosterPart,
  PlayerRoleStat,
  ClanMember,
  RosterPreviewConfig,
} from '../services/api'
import {
  COMMON_ROLES,
  RosterCandidate,
  getNextCallsign,
  cloneSquad,
  smartFillSquads,
  qualificationMatchesRole,
  generateId,
  buildDefaultRosterHeader,
  formatRosterPartsForDiscord,
  buildRosterDiscordEmbed,
  swapPlayerSlots,
  reconcileSquadsWithCandidates,
  cleanPlayerName,
} from '../components/roster/rosterUtils'
import { SlotPickerModal } from '../components/roster/SlotPickerModal'
import { RosterTemplateModal } from '../components/roster/RosterTemplateModal'
import { RosterExportModal } from '../components/roster/RosterExportModal'
import { RosterLivePreviewModal } from '../components/roster/RosterLivePreviewModal'
import { AddPartModal } from '../components/roster/AddPartModal'
import { SwapSlotModal } from '../components/roster/SwapSlotModal'

function parseSavedRosterData(
  rawData: string,
  defaultHeader: string
): {
  parts: RosterPart[]
  activePartIndex: number
  headerText: string
  guests: string[] | null
  preview: RosterPreviewConfig | null
} {
  try {
    const parsed = JSON.parse(rawData)
    let parts: RosterPart[] = []

    if (Array.isArray(parsed?.parts) && parsed.parts.length > 0) {
      parts = parsed.parts.map((p: any, idx: number) => ({
        id: String(p.id || `part-${idx + 1}`),
        name: String(p.name || `PART ${idx + 1}`),
        squads: Array.isArray(p.squads) ? p.squads : [],
      }))
    } else if (Array.isArray(parsed?.squads)) {
      parts = [
        {
          id: 'part-1',
          name: 'PART 1',
          squads: parsed.squads,
        },
      ]
    } else {
      parts = [
        {
          id: 'part-1',
          name: 'PART 1',
          squads: [],
        },
      ]
    }

    const activePartIndex =
      typeof parsed?.activePartIndex === 'number' && parsed.activePartIndex < parts.length && parsed.activePartIndex >= 0
        ? parsed.activePartIndex
        : 0

    const headerText =
      parsed?.headerText && !parsed.headerText.includes('slotlist per stasera')
        ? parsed.headerText
        : defaultHeader

    const guests = Array.isArray(parsed?.guests) ? parsed.guests : null
    const preview =
      parsed?.preview && typeof parsed.preview === 'object'
        ? {
          enabled: Boolean(parsed.preview.enabled),
          channelId: String(parsed.preview.channelId || ''),
          messageId: String(parsed.preview.messageId || ''),
          lastSyncedAt: parsed.preview.lastSyncedAt,
        }
        : null

    return { parts, activePartIndex, headerText, guests, preview }
  } catch (e) {
    console.error('Failed to parse saved roster', e)
    return {
      parts: [{ id: 'part-1', name: 'PART 1', squads: [] }],
      activePartIndex: 0,
      headerText: defaultHeader,
      guests: null,
      preview: null,
    }
  }
}

function persistPreviewState(
  targetEventId: number,
  hText: string,
  parts: RosterPart[],
  activePartIdx: number,
  gst: string[],
  gType: string | undefined,
  cfg: RosterPreviewConfig
): void {
  const payloadData = JSON.stringify({
    eventId: targetEventId,
    headerText: hText,
    parts,
    activePartIndex: activePartIdx,
    guests: gst,
    preview: cfg,
  })
  DiscordService.saveEventRoster(targetEventId, {
    data: payloadData,
    gameType: gType || 'all',
    assignments: [],
  }).catch(err => {
    console.warn('Failed to background persist preview config', err)
  })
}

function extractCandidates(
  eventDetail: DiscordEventDetail | null,
  clanMembers: ClanMember[],
  guests: string[]
): RosterCandidate[] {
  if (!eventDetail) return []
  const list: RosterCandidate[] = []
  const seen = new Set<string>()

  const findQuals = (name: string): { id: string; quals: string[] } => {
    const lower = name.toLowerCase().trim()
    const m = clanMembers.find(cm => cm.displayName.toLowerCase().trim() === lower)
    return {
      id: m?.id || name,
      quals: m?.qualifications || [],
    }
  }

  const addParticipant = (name: string, isMaybe: boolean, isGuest = false) => {
    const lower = name.toLowerCase().trim()
    if (seen.has(lower)) return
    seen.add(lower)
    const { id: mId, quals } = findQuals(name)
    list.push({
      id: mId,
      name,
      isMaybe,
      isGuest,
      qualifications: quals,
    })
  }

  eventDetail.going?.forEach(name => addParticipant(name, false))
  eventDetail.maybe?.forEach(name => addParticipant(name, true))
  guests.forEach(name => addParticipant(name, false, true))

  return list
}

function addSlotToSquad(squads: RosterSquad[], squadId: string): RosterSquad[] {
  return squads.map(s => {
    if (s.id === squadId) {
      const hasSL = s.slots.some(sl => sl.role === 'SL')
      const defaultRole = hasSL ? 'RIF' : 'SL'
      return {
        ...s,
        slots: [
          ...s.slots,
          {
            id: generateId('slot'),
            role: defaultRole,
            assignedPlayerName: '',
            assignedUserId: '',
            isMaybe: false,
          },
        ],
      }
    }
    return s
  })
}

function deleteSlotFromSquad(squads: RosterSquad[], squadId: string, slotId: string): RosterSquad[] {
  return squads.map(s => {
    if (s.id === squadId) {
      return {
        ...s,
        slots: s.slots.filter(sl => sl.id !== slotId),
      }
    }
    return s
  })
}

function updateSlotRoleInSquads(squads: RosterSquad[], squadId: string, slotId: string, role: string): RosterSquad[] {
  return squads.map(s => {
    if (s.id === squadId) {
      return {
        ...s,
        slots: s.slots.map(sl => (sl.id === slotId ? { ...sl, role } : sl)),
      }
    }
    return s
  })
}

function unassignSlotInSquads(squads: RosterSquad[], squadId: string, slotId: string): RosterSquad[] {
  return squads.map(s => {
    if (s.id === squadId) {
      return {
        ...s,
        slots: s.slots.map(sl =>
          sl.id === slotId
            ? {
              ...sl,
              assignedPlayerName: '',
              assignedUserId: '',
              isMaybe: false,
              isGuest: false,
            }
            : sl
        ),
      }
    }
    return s
  })
}

function assignCandidateInSquads(
  squads: RosterSquad[],
  squadId: string,
  slotId: string,
  candidate: RosterCandidate | null,
  guestName?: string
): RosterSquad[] {
  return squads.map(s => {
    if (s.id === squadId) {
      return {
        ...s,
        slots: s.slots.map(sl => {
          if (sl.id === slotId) {
            if (candidate) {
              return {
                ...sl,
                assignedPlayerName: cleanPlayerName(candidate.name),
                assignedUserId: candidate.id,
                isMaybe: candidate.isMaybe,
                isGuest: candidate.isGuest,
              }
            }
            if (guestName) {
              return {
                ...sl,
                assignedPlayerName: cleanPlayerName(guestName),
                assignedUserId: '',
                isMaybe: false,
                isGuest: true,
              }
            }
            return {
              ...sl,
              assignedPlayerName: '',
              assignedUserId: '',
              isMaybe: false,
              isGuest: false,
            }
          }
          return sl
        }),
      }
    }
    return s
  })
}

function computeAssignedAndUnassigned(squads: RosterSquad[], allCandidates: RosterCandidate[]) {
  const assignedSet = new Set<string>()
  for (const sq of squads) {
    for (const sl of sq.slots) {
      if (sl.assignedPlayerName) {
        assignedSet.add(sl.assignedPlayerName.toLowerCase().trim())
      }
    }
  }
  const unassigned = allCandidates.filter(c => !assignedSet.has(c.name.toLowerCase().trim()))
  return { assignedNames: assignedSet, unassignedCandidates: unassigned }
}

function filterCandidateList(
  candidates: RosterCandidate[],
  filterType: 'all' | 'going' | 'maybe',
  searchQuery: string
) {
  const q = searchQuery.trim().toLowerCase()
  return candidates.filter(c => {
    if (filterType === 'going' && c.isMaybe) return false
    if (filterType === 'maybe' && !c.isMaybe) return false
    if (q) {
      return c.name.toLowerCase().includes(q) || c.qualifications.some(qual => qual.toLowerCase().includes(q))
    }
    return true
  })
}

function extractRosterAssignments(squads: RosterSquad[]) {
  const assignments: { userId: string; playerName: string; role: string }[] = []
  for (const sq of squads) {
    for (const sl of sq.slots) {
      if (sl.assignedPlayerName && sl.role) {
        assignments.push({
          userId: sl.assignedUserId || sl.assignedPlayerName,
          playerName: sl.assignedPlayerName,
          role: sl.role,
        })
      }
    }
  }
  return assignments
}

function parseInitialRosterState(savedRoster: any, defaultHeader: string) {
  if (savedRoster?.data) {
    const parsed = parseSavedRosterData(savedRoster.data, defaultHeader)
    return {
      parts: parsed.parts,
      activePartIndex: parsed.activePartIndex,
      headerText: parsed.headerText,
      guests: parsed.guests || [],
      preview: parsed.preview || null,
    }
  }
  return {
    parts: [{ id: 'part-1', name: 'PART 1', squads: [] }] as RosterPart[],
    activePartIndex: 0,
    headerText: defaultHeader,
    guests: [] as string[],
    preview: null,
  }
}

export function EventRosterPage() {
  const { id } = useParams<{ id: string }>()
  const eventId = Number.parseInt(id || '0', 10)
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [eventDetail, setEventDetail] = useState<DiscordEventDetail | null>(null)
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [clanMembers, setClanMembers] = useState<ClanMember[]>([])
  const [learningStats, setLearningStats] = useState<PlayerRoleStat[]>([])

  // Main multi-part roster state
  const [parts, setParts] = useState<RosterPart[]>([{ id: 'part-1', name: 'PART 1', squads: [] }])
  const [activePartIndex, setActivePartIndex] = useState(0)
  const [guests, setGuests] = useState<string[]>([])
  const [headerText, setHeaderText] = useState('')

  // Multi-part & Swap modals
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false)
  const [swapSourceSlot, setSwapSourceSlot] = useState<{
    squadId: string
    squadName: string
    slotId: string
    role: string
    playerName: string
  } | null>(null)
  const [isEditingPartName, setIsEditingPartName] = useState(false)
  const [partNameInput, setPartNameInput] = useState('')

  // Active part and squads computation
  const currentActiveIdx = Math.min(activePartIndex, Math.max(0, parts.length - 1))
  const activePart = parts[currentActiveIdx] || { id: 'part-1', name: 'PART 1', squads: [] }
  const squads = activePart.squads

  const setSquads = (updater: RosterSquad[] | ((prev: RosterSquad[]) => RosterSquad[])) => {
    setParts(prevParts => {
      const idx = Math.min(activePartIndex, Math.max(0, prevParts.length - 1))
      const current = prevParts[idx] || { id: 'part-1', name: 'PART 1', squads: [] }
      const updatedSquads = typeof updater === 'function' ? updater(current.squads) : updater
      return prevParts.map((p, pIdx) => (pIdx === idx ? { ...p, squads: updatedSquads } : p))
    })
  }

  // Search & Filters in Sidebar
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'going' | 'maybe'>('all')
  const [showAssigned, setShowAssigned] = useState(false)
  const [guestNameInput, setGuestNameInput] = useState('')

  // Modals state
  const [pickerSlot, setPickerSlot] = useState<{ squadId: string; slotId: string; role: string; squadName: string } | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState<'squads' | 'players'>('squads')

  // Player Pool Sidebar Collapse / Pin State
  const [isPoolPinned, setIsPoolPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('roster_pool_pinned') === 'true'
    } catch {
      return false
    }
  })
  const [isPoolHovered, setIsPoolHovered] = useState(false)
  const poolHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const togglePoolPin = () => {
    setIsPoolPinned(prev => {
      const next = !prev
      try {
        localStorage.setItem('roster_pool_pinned', String(next))
      } catch (e) {
        console.warn('Failed to save roster_pool_pinned', e)
      }
      return next
    })
  }

  const handlePoolMouseEnter = () => {
    if (poolHoverTimeoutRef.current) {
      clearTimeout(poolHoverTimeoutRef.current)
      poolHoverTimeoutRef.current = null
    }
    setIsPoolHovered(true)
  }

  const handlePoolMouseLeave = () => {
    poolHoverTimeoutRef.current = setTimeout(() => {
      setIsPoolHovered(false)
    }, 250)
  }

  useEffect(() => {
    return () => {
      if (poolHoverTimeoutRef.current) {
        clearTimeout(poolHoverTimeoutRef.current)
      }
    }
  }, [])

  // Live Discord Preview State
  const [previewConfig, setPreviewConfig] = useState<RosterPreviewConfig>({
    enabled: false,
    channelId: '',
    messageId: '',
  })
  const [isLiveSyncing, setIsLiveSyncing] = useState(false)
  const [lastSyncedText, setLastSyncedText] = useState('')
  const isInitialMount = React.useRef(true)

  const [refreshingRSVPs, setRefreshingRSVPs] = useState(false)

  const handleRefreshRSVPs = async () => {
    if (!eventId || refreshingRSVPs) return
    try {
      setRefreshingRSVPs(true)
      const detail = await DiscordService.getEventDetail(eventId)
      setEventDetail(detail)
      showToast('RSVP list updated from Discord', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      showToast('Failed to refresh RSVPs: ' + msg, 'error')
    } finally {
      setRefreshingRSVPs(false)
    }
  }

  const handleOpenExportModal = async () => {
    if (eventId) {
      try {
        const detail = await DiscordService.getEventDetail(eventId)
        setEventDetail(detail)
      } catch {
        // Pre-fetch is best-effort, continue to open modal
      }
    }
    setIsExportModalOpen(true)
  }

  useEffect(() => {
    if (eventId) {
      loadInitialData()
    }
  }, [eventId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [detail, fetchedChannels, members, stats, savedRoster] = await Promise.all([
        DiscordService.getEventDetail(eventId),
        DiscordService.getChannels().catch(() => []),
        DiscordService.getClanMembers().catch(() => []),
        DiscordService.getLearningStats().catch(() => []),
        DiscordService.getEventRoster(eventId).catch(() => null),
      ])

      setEventDetail(detail)
      setChannels(fetchedChannels || [])
      setClanMembers(members || [])
      setLearningStats(stats || [])

      const defaultHeader = buildDefaultRosterHeader(detail?.dateTime, detail?.gameType)
      const initial = parseInitialRosterState(savedRoster, defaultHeader)
      const loadedGuests = initial.guests.length > 0 ? initial.guests : []
      const initialCandidates = extractCandidates(detail, members || [], loadedGuests)

      const reconciledParts = initial.parts.map(p => ({
        ...p,
        squads: reconcileSquadsWithCandidates(p.squads, initialCandidates),
      }))
      setParts(reconciledParts)
      setActivePartIndex(initial.activePartIndex)
      setHeaderText(initial.headerText)
      if (initial.guests.length > 0) setGuests(initial.guests)
      if (initial.preview) setPreviewConfig(initial.preview)
    } catch (err: any) {
      console.error(err)
      showToast('Failed to load event or roster data: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  // Build candidate player pool from RSVP Going and Maybe
  const allCandidates = useMemo<RosterCandidate[]>(() => {
    return extractCandidates(eventDetail, clanMembers, guests)
  }, [eventDetail, clanMembers, guests])

  // Synchronize squads when candidate pool RSVPs change (e.g. Maybe <-> Going)
  const isInitialSyncDone = React.useRef(false)
  useEffect(() => {
    if (loading) return
    if (!isInitialSyncDone.current) {
      isInitialSyncDone.current = true
      return
    }

    setParts(prevParts => {
      return prevParts.map(part => {
        if (part.squads.length === 0) return part
        const reconciled = reconcileSquadsWithCandidates(part.squads, allCandidates)
        return {
          ...part,
          squads: reconciled,
        }
      })
    })
  }, [allCandidates, loading])

  // Background polling & Window focus auto-refresh for Discord event RSVPs
  useEffect(() => {
    if (!eventId || loading) return

    const pollDetail = async () => {
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const detail = await DiscordService.getEventDetail(eventId)
        setEventDetail(detail)
      } catch {
        // Silently ignore background polling network errors
      }
    }

    const intervalId = setInterval(pollDetail, 30000)

    const handleFocus = () => {
      pollDetail()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [eventId, loading])

  // Track who is assigned and who is unassigned
  const { assignedNames, unassignedCandidates } = useMemo(() => {
    return computeAssignedAndUnassigned(squads, allCandidates)
  }, [squads, allCandidates])

  // Filter unassigned candidates for sidebar
  const filteredUnassigned = useMemo(() => {
    return filterCandidateList(unassignedCandidates, filterType, searchQuery)
  }, [unassignedCandidates, filterType, searchQuery])

  // Squad Actions
  const handleAddSquad = () => {
    const lastSquad = squads.at(-1)?.name ?? ''
    const nextName = getNextCallsign(lastSquad, squads)
    const newSquad: RosterSquad = {
      id: generateId('squad'),
      name: nextName,
      slots: [
        {
          id: generateId('slot'),
          role: 'SL',
          assignedPlayerName: '',
          assignedUserId: '',
          isMaybe: false,
        },
      ],
    }
    setSquads(prev => [...prev, newSquad])
  }

  const handleCloneSquad = (squad: RosterSquad) => {
    const cloned = cloneSquad(squad, squads)
    setSquads(prev => [...prev, cloned])
    showToast(`Cloned ${squad.name} as ${cloned.name}`, 'success')
  }

  const handleDeleteSquad = (squadId: string) => {
    setSquads(prev => prev.filter(s => s.id !== squadId))
  }

  const handleUpdateSquadName = (squadId: string, name: string) => {
    setSquads(prev => prev.map(s => (s.id === squadId ? { ...s, name } : s)))
  }

  // Slot Actions
  const handleAddSlot = (squadId: string) => {
    setSquads(prev => addSlotToSquad(prev, squadId))
  }

  const handleDeleteSlot = (squadId: string, slotId: string) => {
    setSquads(prev => deleteSlotFromSquad(prev, squadId, slotId))
  }

  const handleUpdateSlotRole = (squadId: string, slotId: string, role: string) => {
    setSquads(prev => updateSlotRoleInSquads(prev, squadId, slotId, role))
  }

  const handleUnassignSlot = (squadId: string, slotId: string) => {
    setSquads(prev => unassignSlotInSquads(prev, squadId, slotId))
  }

  const handleAssignCandidateToSlot = (
    squadId: string,
    slotId: string,
    candidate: RosterCandidate | null,
    guestName?: string
  ) => {
    setSquads(prev => assignCandidateInSquads(prev, squadId, slotId, candidate, guestName))
  }

  // Smart Fill: Auto-assigns optimal candidates using the adaptive learning model
  const handleSmartFill = () => {
    if (unassignedCandidates.length === 0) {
      showToast('All players are already assigned', 'info')
      return
    }

    const { updatedSquads, remainingCandidates } = smartFillSquads(
      squads,
      unassignedCandidates,
      learningStats,
      eventDetail?.gameType
    )
    setSquads(updatedSquads)
    const filledCount = unassignedCandidates.length - remainingCandidates.length
    if (filledCount > 0) {
      showToast(`Smart Fill assigned ${filledCount} players based on qualifications and play habits!`, 'success')
    } else {
      showToast('No empty slots available to fill', 'info')
    }
  }

  // Save Roster to Backend & Train Learning Model
  const handleSaveRoster = async () => {
    try {
      setSaving(true)
      const payloadData = JSON.stringify({
        eventId,
        headerText,
        parts,
        activePartIndex: currentActiveIdx,
        guests,
        preview: previewConfig,
      })

      const assignments: { userId: string; playerName: string; role: string }[] = []
      for (const p of parts) {
        assignments.push(...extractRosterAssignments(p.squads))
      }

      await DiscordService.saveEventRoster(eventId, {
        data: payloadData,
        gameType: eventDetail?.gameType || 'all',
        assignments,
      })

      showToast('Roster saved and role preferences updated successfully!', 'success')
      // Refresh learning stats
      DiscordService.getLearningStats().then(setLearningStats).catch(() => { })
    } catch (err: any) {
      showToast('Failed to save roster: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  // Save or Update Live Preview Configuration
  const handleSavePreviewConfig = async (newConfig: RosterPreviewConfig, shouldSyncNow = false) => {
    setPreviewConfig(newConfig)
    let currentMessageId = newConfig.messageId
    let updatedLastSyncedAt = newConfig.lastSyncedAt

    if (shouldSyncNow && newConfig.enabled && newConfig.channelId) {
      setIsLiveSyncing(true)
      try {
        const textToSync = formatRosterPartsForDiscord(headerText, parts)
        const embedToSync = buildRosterDiscordEmbed(parts, eventDetail?.title, eventDetail?.gameType)
        const res = await DiscordService.syncEventRosterPreview(eventId, {
          channelId: newConfig.channelId,
          messageId: newConfig.messageId,
          message: headerText,
          embed: embedToSync,
        })
        currentMessageId = res.messageId
        updatedLastSyncedAt = new Date().toISOString()
        setLastSyncedText(textToSync)
        setPreviewConfig(prev => ({
          ...prev,
          messageId: res.messageId,
          lastSyncedAt: updatedLastSyncedAt,
        }))
      } catch (err: unknown) {
        console.error('Failed to sync preview message', err)
        throw err
      } finally {
        setIsLiveSyncing(false)
      }
    }

    // Persist preview config to DB in background
    try {
      persistPreviewState(
        eventId,
        headerText,
        parts,
        currentActiveIdx,
        guests,
        eventDetail?.gameType,
        {
          ...newConfig,
          messageId: currentMessageId,
          lastSyncedAt: updatedLastSyncedAt,
        }
      )
    } catch (saveErr) {
      console.warn('Failed to background persist preview config', saveErr)
    }
  }

  // Real-Time In-Place Live Preview Sync to Discord
  useEffect(() => {
    if (isInitialMount.current) {
      if (!loading) {
        isInitialMount.current = false
      }
      return
    }

    if (!previewConfig.enabled || !previewConfig.channelId || !eventId) {
      return
    }

    const currentFormatted = formatRosterPartsForDiscord(headerText, parts)
    if (currentFormatted === lastSyncedText) {
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsLiveSyncing(true)
        const embedToSync = buildRosterDiscordEmbed(parts, eventDetail?.title, eventDetail?.gameType)
        const res = await DiscordService.syncEventRosterPreview(eventId, {
          channelId: previewConfig.channelId,
          messageId: previewConfig.messageId,
          message: headerText,
          embed: embedToSync,
        })
        setLastSyncedText(currentFormatted)
        const now = new Date().toISOString()
        if (res.messageId === previewConfig.messageId) {
          setPreviewConfig(prev => ({
            ...prev,
            lastSyncedAt: now,
          }))
        } else {
          const updated: RosterPreviewConfig = {
            ...previewConfig,
            messageId: res.messageId,
            lastSyncedAt: now,
          }
          setPreviewConfig(updated)
          persistPreviewState(eventId, headerText, parts, currentActiveIdx, guests, eventDetail?.gameType, updated)
        }
      } catch (err) {
        console.error('Failed to auto-sync roster preview to Discord', err)
      } finally {
        setIsLiveSyncing(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [parts, headerText, guests, previewConfig.enabled, previewConfig.channelId, previewConfig.messageId, eventId, lastSyncedText, loading, currentActiveIdx, eventDetail])

  // Part Actions
  const handleAddPart = (name: string, mode: 'clone_all' | 'clone_structure' | 'empty') => {
    const newPartId = generateId('part')
    let newSquads: RosterSquad[] = []

    if (mode === 'clone_all') {
      newSquads = activePart.squads.map(sq => ({
        id: generateId('squad'),
        name: sq.name,
        slots: sq.slots.map(sl => ({
          ...sl,
          id: generateId('slot'),
        })),
      }))
    } else if (mode === 'clone_structure') {
      newSquads = activePart.squads.map(sq => ({
        id: generateId('squad'),
        name: sq.name,
        slots: sq.slots.map(sl => ({
          id: generateId('slot'),
          role: sl.role,
          assignedPlayerName: '',
          assignedUserId: '',
          isMaybe: false,
          isGuest: false,
        })),
      }))
    }

    const newPart: RosterPart = {
      id: newPartId,
      name,
      squads: newSquads,
    }
    setParts(prev => [...prev, newPart])
    setActivePartIndex(parts.length)
    showToast(`Added ${name}!`, 'success')
  }

  const handleDeletePart = (partIdx: number) => {
    if (parts.length <= 1) return
    const partName = parts[partIdx]?.name || `PART ${partIdx + 1}`
    setParts(prev => prev.filter((_, idx) => idx !== partIdx))
    setActivePartIndex(prev => Math.max(0, Math.min(prev, parts.length - 2)))
    showToast(`Removed ${partName}`, 'info')
  }

  const handleSavePartName = () => {
    const trimmed = partNameInput.trim()
    if (trimmed) {
      setParts(prev => prev.map((p, idx) => (idx === currentActiveIdx ? { ...p, name: trimmed } : p)))
    }
    setIsEditingPartName(false)
  }

  const handleSwapPlayer = (targetSquadId: string, targetSlotId: string, targetPlayerName: string) => {
    if (!swapSourceSlot) return
    setSquads(prev =>
      swapPlayerSlots(prev, swapSourceSlot.squadId, swapSourceSlot.slotId, targetSquadId, targetSlotId)
    )
    showToast(`Swapped ${swapSourceSlot.playerName} (${swapSourceSlot.role}) with ${targetPlayerName}`, 'success')
    setSwapSourceSlot(null)
  }

  const getPlayerRolesAcrossParts = (candidateName: string): { partName: string; role: string }[] => {
    const clean = cleanPlayerName(candidateName).toLowerCase().trim()
    const results: { partName: string; role: string }[] = []
    for (const p of parts) {
      for (const sq of p.squads) {
        for (const sl of sq.slots) {
          if (cleanPlayerName(sl.assignedPlayerName).toLowerCase().trim() === clean) {
            results.push({ partName: p.name, role: sl.role })
          }
        }
      }
    }
    return results
  }

  // Add Guest Player
  const handleAddGuestPlayer = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!guestNameInput.trim()) return
    const name = guestNameInput.trim()
    if (allCandidates.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      showToast('Player already exists in list', 'error')
      return
    }
    setGuests(prev => [...prev, name])
    setGuestNameInput('')
    showToast(`Added guest player: ${name}`, 'success')
  }

  const handleReset = () => {
    setSquads([])
    setIsResetConfirmOpen(false)
    showToast('Active part cleared', 'info')
  }

  const renderPlayerPoolCard = () => (
    <Card className="border-border bg-surface-elevated/70 backdrop-blur-sm overflow-hidden flex flex-col shadow-lg w-full">
      <CardHeader className="p-4 border-b border-border bg-surface/40 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-bold">Player Pool</CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefreshRSVPs}
              disabled={refreshingRSVPs}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              title="Refresh RSVPs from Discord"
              aria-label="Refresh RSVPs from Discord"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingRSVPs ? 'animate-spin text-primary' : ''}`} />
            </Button>
            <Badge variant="outline" className="text-[10px] font-mono">
              {unassignedCandidates.length} unassigned
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={togglePoolPin}
              className={`h-6 w-6 p-0 hidden lg:inline-flex transition-colors ${
                isPoolPinned ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isPoolPinned ? 'Unpin sidebar (collapse on hover)' : 'Pin sidebar (keep static in layout)'}
              aria-label="Toggle Pin Player Pool"
            >
              {isPoolPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </Button>
            {!isPoolPinned && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPoolHovered(false)
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hidden lg:inline-flex"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter players or qualifications..."
            className="h-8 pl-8 text-xs bg-surface border-border"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-surface p-1 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`text-[10px] font-bold uppercase tracking-wider py-1 rounded transition-colors ${
              filterType === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({unassignedCandidates.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('going')}
            className={`text-[10px] font-bold uppercase tracking-wider py-1 rounded transition-colors ${
              filterType === 'going' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Going ({unassignedCandidates.filter(c => !c.isMaybe).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('maybe')}
            className={`text-[10px] font-bold uppercase tracking-wider py-1 rounded transition-colors ${
              filterType === 'maybe' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Maybe ({unassignedCandidates.filter(c => c.isMaybe).length})
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] flex-1">
        {filteredUnassigned.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-xs italic">
              {searchQuery ? 'No players matching filter.' : 'All available players have been assigned!'}
            </p>
          </div>
        ) : (
          filteredUnassigned.map(candidate => (
            <div
              key={candidate.id + candidate.name}
              className={`p-2.5 rounded-lg border transition-all ${
                candidate.isMaybe
                  ? 'border-warning/30 bg-warning/5 hover:border-warning/50'
                  : 'border-border bg-surface/40 hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground truncate">{candidate.name}</span>
                {candidate.isMaybe ? (
                  <Badge variant="warning" className="text-[8px] font-bold py-0 px-1 shrink-0">
                    Maybe (?)
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[8px] font-bold py-0 px-1 shrink-0">
                    Going
                  </Badge>
                )}
              </div>

              {candidate.qualifications.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {candidate.qualifications.map(q => (
                    <span
                      key={q}
                      className="inline-flex items-center gap-0.5 text-[8px] font-medium text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded"
                    >
                      <Award className="w-2 h-2" />
                      {q}
                    </span>
                  ))}
                </div>
              )}

              {parts.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-border/40">
                  {getPlayerRolesAcrossParts(candidate.name).map((pr, prIdx) => (
                    <span
                      key={prIdx}
                      className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-muted-foreground bg-surface border border-border px-1.5 py-0.2 rounded"
                    >
                      <span className="text-[7px] uppercase font-semibold text-primary">{pr.partName}:</span>
                      <span>{pr.role}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Add Guest Player */}
        <div className="pt-3 border-t border-border mt-3">
          <form onSubmit={handleAddGuestPlayer} className="space-y-1.5">
            <label
              htmlFor="sidebar-guest-name-input"
              className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1"
            >
              <UserPlus className="w-3 h-3" />
              Add Guest Player
            </label>
            <div className="flex gap-1.5">
              <Input
                id="sidebar-guest-name-input"
                value={guestNameInput}
                onChange={e => setGuestNameInput(e.target.value)}
                placeholder="Player name..."
                className="h-7 text-xs bg-surface border-border flex-1"
              />
              <Button type="submit" size="sm" variant="secondary" className="h-7 px-2 text-[10px] font-bold uppercase">
                Add
              </Button>
            </div>
          </form>
        </div>

        {/* Collapsible Assigned Players Section */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setShowAssigned(!showAssigned)}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground py-1"
          >
            <span>Assigned Players ({assignedNames.size})</span>
            {showAssigned ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showAssigned && (
            <div className="mt-2 space-y-1.5">
              {Array.from(assignedNames).map(name => {
                let squadLocation = ''
                let roleLocation = ''
                let squadId = ''
                let slotId = ''
                for (const sq of squads) {
                  for (const sl of sq.slots) {
                    if (sl.assignedPlayerName?.toLowerCase().trim() === name) {
                      squadLocation = sq.name
                      roleLocation = sl.role
                      squadId = sq.id
                      slotId = sl.id
                      break
                    }
                  }
                }

                return (
                  <div
                    key={name}
                    className="flex items-center justify-between p-1.5 rounded bg-surface/30 border border-border text-xs"
                  >
                    <div className="truncate mr-2">
                      <span className="font-medium text-foreground">{name}</span>
                      <span className="text-[9px] text-muted-foreground ml-1.5">
                        ({squadLocation}: {roleLocation})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnassignSlot(squadId, slotId)}
                      className="text-muted-foreground hover:text-destructive p-0.5"
                      title="Unassign player"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Loading Event Roster...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto py-4 px-4 sm:px-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/events">
              <Button variant="ghost" size="sm" className="h-9 px-2.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Events
              </Button>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  {eventDetail?.title || 'Event Roster'}
                </h1>
                {eventDetail?.gameType && (
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                    {eventDetail.gameType}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{eventDetail?.dateTime}</span>
                <span>•</span>
                <span>#{channels.find(c => c.id === eventDetail?.channelId)?.name || 'announcements'}</span>
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateModalOpen(true)}
              className="text-xs font-semibold h-9"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Templates
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSmartFill}
              disabled={unassignedCandidates.length === 0}
              className="text-xs font-semibold h-9 text-primary hover:bg-primary/10"
              title="Automatically assign unassigned players based on qualifications and past habits"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Smart Fill
            </Button>

            <Button
              type="button"
              variant={previewConfig.enabled ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewModalOpen(true)}
              className={`text-xs font-semibold h-9 relative gap-1.5 transition-colors ${previewConfig.enabled
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : ''
                }`}
              title="Open Discord Live Preview settings"
            >
              <Radio className={`w-3.5 h-3.5 ${previewConfig.enabled ? 'animate-pulse text-emerald-400' : 'text-primary'}`} />
              <span>Preview</span>
              {previewConfig.enabled && (
                <span className="flex h-2 w-2 relative ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {isLiveSyncing && (
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400 ml-0.5" />
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenExportModal}
              disabled={squads.length === 0}
              className="text-xs font-semibold h-9"
              title="Preview, copy formatted slotlist, or publish directly to Discord"
            >
              <Send className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Publish to Discord
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-xs font-semibold h-9 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              title="Clear all squads and slots"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Clear
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSaveRoster}
              disabled={saving}
              className="text-xs font-bold uppercase tracking-wider h-9 px-4 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Roster
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-lg bg-surface-elevated/40 border border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Total RSVPs:</span>
            <span className="font-mono font-bold text-foreground">{allCandidates.length}</span>
            <span className="text-muted-foreground">
              ({eventDetail?.going?.length || 0} Going, {eventDetail?.maybe?.length || 0} Maybe)
            </span>
            <button
              type="button"
              onClick={handleRefreshRSVPs}
              disabled={refreshingRSVPs}
              className="text-muted-foreground hover:text-primary p-0.5 rounded transition-colors ml-0.5"
              title="Refresh RSVPs from Discord"
              aria-label="Refresh RSVPs from Discord"
            >
              <RefreshCw className={`w-3 h-3 ${refreshingRSVPs ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Assigned:</span>
            <span className="font-mono font-bold text-success">{assignedNames.size}</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <button
            type="button"
            onClick={() => {
              if (!isPoolPinned) setIsPoolHovered(prev => !prev)
            }}
            className={`flex items-center gap-2 transition-all ${!isPoolPinned ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
            title={!isPoolPinned ? 'Toggle Player Pool sidebar' : undefined}
          >
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Unassigned:</span>
            <span className={`font-mono font-bold ${unassignedCandidates.length > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              {unassignedCandidates.length}
            </span>
          </button>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Squads:</span>
            <span className="font-mono font-bold text-foreground">{squads.length}</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-surface p-1 rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setActiveMobileTab('squads')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeMobileTab === 'squads'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          Squads ({squads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('players')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeMobileTab === 'players'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Users className="w-3.5 h-3.5" />
          Player Pool ({unassignedCandidates.length})
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex gap-4 sm:gap-6 items-start">
        {/* Left Sidebar: Available Players Pool (Desktop in-flow dynamic collapsible sidebar) */}
        <div
          onMouseEnter={handlePoolMouseEnter}
          onMouseLeave={handlePoolMouseLeave}
          className={`hidden lg:flex flex-col shrink-0 lg:sticky lg:top-4 transition-all duration-300 ease-in-out ${
            isPoolPinned || isPoolHovered ? 'w-80 xl:w-[340px]' : 'w-11'
          }`}
        >
          {isPoolPinned || isPoolHovered ? (
            <div className="w-80 xl:w-[340px]">
              {renderPlayerPoolCard()}
            </div>
          ) : (
            <button
              type="button"
              onClick={togglePoolPin}
              className="w-11 h-[560px] py-4 rounded-xl border border-border/80 bg-surface-elevated/40 hover:bg-surface-elevated hover:border-primary/40 flex flex-col items-center justify-between cursor-pointer transition-colors group select-none shadow-sm"
              title="Player Pool (Hover to expand, click to pin)"
              aria-label="Expand Player Pool"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-1.5 rounded-lg bg-surface group-hover:bg-primary/10 transition-colors">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono px-1 py-0 bg-primary/10 text-primary border-primary/30">
                  {unassignedCandidates.length}
                </Badge>
              </div>

              {/* Vertical text label */}
              <div className="rotate-180 [writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5 py-4">
                <span>Player Pool</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
              </div>

              <div className="p-1 text-muted-foreground/50 group-hover:text-primary transition-colors">
                <Pin className="w-3.5 h-3.5" />
              </div>
            </button>
          )}
        </div>

        {/* Mobile View for Player Pool */}
        <div className={`lg:hidden space-y-4 w-full ${activeMobileTab === 'players' ? 'block' : 'hidden'}`}>
          {renderPlayerPoolCard()}
        </div>

        {/* Right Main Board: Squads and Slots */}
        <div className={`flex-1 min-w-0 space-y-4 ${activeMobileTab === 'squads' ? 'block' : 'hidden lg:block'}`}>
          {/* Mission Parts Tab Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-surface-elevated/70 border border-border rounded-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {parts.map((part, idx) => {
                const isActive = idx === currentActiveIdx
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      setActivePartIndex(idx)
                      setIsEditingPartName(false)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent'
                      }`}
                  >
                    <span>{part.name}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded font-mono ${isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-surface text-muted-foreground'
                        }`}
                    >
                      {part.squads.length}
                    </span>
                  </button>
                )
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddPartModalOpen(true)}
                className="h-7 text-xs font-semibold gap-1 text-primary hover:bg-primary/10 border-primary/30"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Part
              </Button>
            </div>

            {/* Active Part Rename / Remove Actions */}
            <div className="flex items-center gap-2">
              {isEditingPartName ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={partNameInput}
                    onChange={e => setPartNameInput(e.target.value)}
                    placeholder="Part name..."
                    className="h-7 text-xs font-bold uppercase tracking-wider w-32 bg-surface border-border"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSavePartName()
                      if (e.key === 'Escape') setIsEditingPartName(false)
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleSavePartName}
                    className="h-7 px-2 text-xs"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPartNameInput(activePart.name)
                    setIsEditingPartName(true)
                  }}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                  title="Rename active part"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Rename</span>
                </Button>
              )}

              {parts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePart(currentActiveIdx)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
                  title="Remove this mission part"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Part</span>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <span>{activePart.name} - Squads & Slotlist</span>
              <span className="text-xs font-normal text-muted-foreground">({squads.length} squads)</span>
            </h2>

            <Button
              type="button"
              size="sm"
              onClick={handleAddSquad}
              className="h-8 text-xs font-semibold gap-1.5 shadow-md shadow-primary/10"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Squad
            </Button>
          </div>

          {squads.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl bg-surface/30 space-y-4">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Squads Created Yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Start building your match structure from scratch or load a saved template.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button size="sm" onClick={handleAddSquad}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add First Squad
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
                  <Bookmark className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Load Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {squads.map(squad => (
                <Card
                  key={squad.id}
                  className="border-border bg-surface-elevated/60 backdrop-blur-sm overflow-hidden flex flex-col justify-between hover:border-border/80 transition-all"
                >
                  <CardHeader className="p-3.5 border-b border-border bg-surface/50 flex flex-row items-center justify-between gap-2 space-y-0">
                    <Input
                      value={squad.name}
                      onChange={e => handleUpdateSquadName(squad.id, e.target.value)}
                      placeholder="Squad Callsign (e.g. ALPHA 1)"
                      className="h-7 text-xs font-black tracking-wide uppercase bg-transparent border-transparent hover:border-border focus:bg-surface focus:border-primary/50 px-1.5"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Clone Squad Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCloneSquad(squad)}
                        className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Clone Squad (Duplicates roles with auto-incremented callsign)"
                      >
                        <CopyPlus className="w-3.5 h-3.5" />
                      </Button>

                      {/* Delete Squad Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSquad(squad.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Squad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 space-y-2 flex-1">
                    {squad.slots.map(slot => {
                      const hasQualification = slot.assignedPlayerName
                        ? clanMembers
                          .find(cm => cm.displayName.toLowerCase() === slot.assignedPlayerName?.toLowerCase())
                          ?.qualifications.some(q => qualificationMatchesRole(q, slot.role))
                        : false

                      return (
                        <div
                          key={slot.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg border border-border/60 bg-surface/40 hover:border-border transition-colors group"
                        >
                          {/* Role Selector / Input */}
                          <div className="w-20 shrink-0">
                            <input
                              list={`roles-list-${slot.id}`}
                              value={slot.role}
                              onChange={e => handleUpdateSlotRole(squad.id, slot.id, e.target.value.toUpperCase())}
                              className="w-full h-7 px-1.5 text-[11px] font-mono font-bold uppercase rounded bg-surface border border-border focus:border-primary text-primary"
                              placeholder="ROLE"
                            />
                            <datalist id={`roles-list-${slot.id}`}>
                              {COMMON_ROLES.map(r => (
                                <option key={r.code} value={r.code}>
                                  {r.label}
                                </option>
                              ))}
                            </datalist>
                          </div>

                          {/* Player Assignment Area */}
                          <div className="flex-1 min-w-0">
                            {slot.assignedPlayerName ? (
                              <div className="flex items-center justify-between gap-1 px-2 py-1 rounded bg-surface border border-border">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="text-xs font-semibold text-foreground truncate"
                                    title={slot.assignedPlayerName}
                                  >
                                    {slot.assignedPlayerName}
                                  </span>
                                  {slot.isMaybe && (
                                    <span className="text-[8px] font-bold text-warning font-mono shrink-0">
                                      (?)
                                    </span>
                                  )}
                                  {hasQualification && (
                                    <span title="Specialized">
                                      <Award className="w-3 h-3 text-success shrink-0" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSwapSourceSlot({
                                        squadId: squad.id,
                                        squadName: squad.name,
                                        slotId: slot.id,
                                        role: slot.role,
                                        playerName: slot.assignedPlayerName!,
                                      })
                                    }
                                    className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-surface-elevated transition-colors"
                                    title="Swap player with another slot"
                                    aria-label="Swap slot"
                                  >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPickerSlot({
                                        squadId: squad.id,
                                        slotId: slot.id,
                                        role: slot.role,
                                        squadName: squad.name,
                                      })
                                    }
                                    className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-surface-elevated transition-colors"
                                    title="Change player"
                                    aria-label="Change player"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnassignSlot(squad.id, slot.id)}
                                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    title="Remove player from slot"
                                    aria-label="Remove player from slot"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setPickerSlot({
                                    squadId: squad.id,
                                    slotId: slot.id,
                                    role: slot.role,
                                    squadName: squad.name,
                                  })
                                }
                                className="w-full text-left px-2 py-1 rounded border border-dashed border-border/80 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all truncate"
                              >
                                + Assign player
                              </button>
                            )}
                          </div>

                          {/* Delete Slot Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(squad.id, slot.id)}
                            className="text-muted-foreground/50 hover:text-destructive p-1.5 sm:p-1 shrink-0 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                            title="Remove Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      )
                    })}

                    {/* Add Slot to Squad */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddSlot(squad.id)}
                      className="w-full h-7 mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary border border-dashed border-border/60 hover:border-primary/40"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Slot
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Picker Modal */}
      {pickerSlot && (
        <SlotPickerModal
          isOpen={!!pickerSlot}
          onClose={() => setPickerSlot(null)}
          squadName={pickerSlot.squadName}
          roleCode={pickerSlot.role}
          candidates={unassignedCandidates}
          learningStats={learningStats}
          gameType={eventDetail?.gameType}
          onSelectCandidate={(candidate, guestName) => {
            handleAssignCandidateToSlot(pickerSlot.squadId, pickerSlot.slotId, candidate, guestName)
          }}
        />
      )}

      {/* Add Part Modal */}
      <AddPartModal
        isOpen={isAddPartModalOpen}
        onClose={() => setIsAddPartModalOpen(false)}
        currentPartCount={parts.length}
        activePartName={activePart.name}
        onAddPart={handleAddPart}
      />

      {/* Swap Slot Modal */}
      {swapSourceSlot && (
        <SwapSlotModal
          isOpen={!!swapSourceSlot}
          onClose={() => setSwapSourceSlot(null)}
          sourceSlot={swapSourceSlot}
          squads={squads}
          onSwap={handleSwapPlayer}
        />
      )}

      {/* Templates Modal */}
      <RosterTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentSquads={squads}
        currentGameType={eventDetail?.gameType}
        onLoadTemplate={loadedSquads => {
          setSquads(loadedSquads)
        }}
      />

      {/* Discord Export Preview Modal */}
      <RosterExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        eventId={eventId}
        defaultChannelId={eventDetail?.channelId}
        channels={channels}
        squads={squads}
        parts={parts}
        candidates={allCandidates}
        headerText={headerText}
        onHeaderChange={setHeaderText}
        dateTime={eventDetail?.dateTime}
        gameType={eventDetail?.gameType}
        eventTitle={eventDetail?.title}
      />

      {/* Discord Live Preview Modal */}
      <RosterLivePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        channels={channels}
        previewConfig={previewConfig}
        onSaveConfig={handleSavePreviewConfig}
        isSyncing={isLiveSyncing}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear Roster Board?"
        description="Are you sure you want to remove all squads and slots for the active part? Any unsaved changes will be lost."
        onConfirm={handleReset}
        confirmLabel="Clear All"
        variant="danger"
      />
    </div>
  )
}
