import React, { useState, useEffect, useMemo } from 'react'
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
  PlayerRoleStat,
  ClanMember,
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
} from '../components/roster/rosterUtils'
import { SlotPickerModal } from '../components/roster/SlotPickerModal'
import { RosterTemplateModal } from '../components/roster/RosterTemplateModal'
import { RosterExportModal } from '../components/roster/RosterExportModal'

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
                assignedPlayerName: candidate.name,
                assignedUserId: candidate.id,
                isMaybe: candidate.isMaybe,
                isGuest: candidate.isGuest,
              }
            }
            if (guestName) {
              return {
                ...sl,
                assignedPlayerName: guestName,
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

  // Main roster state
  const [squads, setSquads] = useState<RosterSquad[]>([])
  const [guests, setGuests] = useState<string[]>([])
  const [headerText, setHeaderText] = useState('')

  // Search & Filters in Sidebar
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'going' | 'maybe'>('all')
  const [showAssigned, setShowAssigned] = useState(false)
  const [guestNameInput, setGuestNameInput] = useState('')

  // Modals state
  const [pickerSlot, setPickerSlot] = useState<{ squadId: string; slotId: string; role: string; squadName: string } | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

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

      if (savedRoster?.data) {
        try {
          const parsed = JSON.parse(savedRoster.data)
          if (Array.isArray(parsed?.squads)) {
            setSquads(parsed.squads)
          }
          if (parsed.headerText && parsed.headerText !== '@here slotlist per stasera') {
            setHeaderText(parsed.headerText)
          } else {
            setHeaderText(defaultHeader)
          }
          if (Array.isArray(parsed?.guests)) {
            setGuests(parsed.guests)
          }
        } catch (e) {
          console.error('Failed to parse saved roster', e)
          setHeaderText(defaultHeader)
        }
      } else {
        setHeaderText(defaultHeader)
      }
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

  // Track who is assigned and who is unassigned
  const { assignedNames, unassignedCandidates } = useMemo(() => {
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
  }, [squads, allCandidates])

  // Filter unassigned candidates for sidebar
  const filteredUnassigned = useMemo(() => {
    return unassignedCandidates.filter(c => {
      if (filterType === 'going' && c.isMaybe) return false
      if (filterType === 'maybe' && !c.isMaybe) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.qualifications.some(qual => qual.toLowerCase().includes(q))
      }
      return true
    })
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
        squads,
        guests,
      })

      // Extract player role assignments to train the frequency model
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

      await DiscordService.saveEventRoster(eventId, {
        data: payloadData,
        gameType: eventDetail?.gameType || 'all',
        assignments,
      })

      showToast('Roster saved and role preferences updated successfully!', 'success')
      // Refresh learning stats
      DiscordService.getLearningStats().then(setLearningStats).catch(() => {})
    } catch (err: any) {
      showToast('Failed to save roster: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setSaving(false)
    }
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
    showToast('Board cleared', 'info')
  }

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
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
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
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Assigned:</span>
            <span className="font-mono font-bold text-success">{assignedNames.size}</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Unassigned:</span>
            <span className={`font-mono font-bold ${unassignedCandidates.length > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              {unassignedCandidates.length}
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase font-bold text-[10px] tracking-wider">Squads:</span>
            <span className="font-mono font-bold text-foreground">{squads.length}</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Available Players Pool */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 sticky top-4">
          <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-4 border-b border-border bg-surface/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Player Pool</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {unassignedCandidates.length} unassigned
                </Badge>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter players or brevetti..."
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

            <CardContent className="p-3 space-y-2 max-h-[550px] overflow-y-auto">
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
                  </div>
                ))
              )}

              {/* Add Guest Player */}
              <div className="pt-3 border-t border-border mt-3">
                <form onSubmit={handleAddGuestPlayer} className="space-y-1.5">
                  <label htmlFor="sidebar-guest-name-input" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
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
                      // Find which squad and slot
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
        </div>

        {/* Right Main Board: Squads and Slots */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <span>Squads & Slotlist</span>
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
                      const hasBrevetto = slot.assignedPlayerName
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
                                  <span className="text-xs font-semibold text-foreground truncate">
                                    {slot.assignedPlayerName}
                                  </span>
                                  {slot.isMaybe && (
                                    <span className="text-[8px] font-bold text-warning font-mono shrink-0">
                                      (?)
                                    </span>
                                  )}
                                  {hasBrevetto && (
                                    <span title="Specialized">
                                      <Award className="w-3 h-3 text-success shrink-0" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
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
                                    className="text-[10px] text-muted-foreground hover:text-primary px-1 font-medium"
                                  >
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUnassignSlot(squad.id, slot.id)}
                                    className="text-muted-foreground hover:text-destructive p-0.5"
                                  >
                                    <X className="w-3 h-3" />
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
                            className="text-muted-foreground/50 hover:text-destructive p-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Slot"
                          >
                            <Trash2 className="w-3 h-3" />
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
        headerText={headerText}
        onHeaderChange={setHeaderText}
        dateTime={eventDetail?.dateTime}
        gameType={eventDetail?.gameType}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear Roster Board?"
        description="Are you sure you want to remove all squads and slots? Any unsaved changes will be lost."
        onConfirm={handleReset}
        confirmLabel="Clear All"
        variant="danger"
      />
    </div>
  )
}
