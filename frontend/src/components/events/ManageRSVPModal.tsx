import { useEffect, useState, useMemo } from 'react'
import { Search, Loader2, Check, X, HelpCircle, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useToast } from '../ui/Toast'
import { DiscordService, DiscordGuildMember, DiscordEventDetail } from '../../services/api'

type RSVPStatus = 'going' | 'not_going' | 'maybe' | 'none'

interface ManageRSVPModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly eventId: number
  readonly eventTitle: string
  readonly onUpdate: () => void
}

export function ManageRSVPModal({ isOpen, onClose, eventId, eventTitle, onUpdate }: ManageRSVPModalProps) {
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  
  const [members, setMembers] = useState<DiscordGuildMember[]>([])
  const [eventDetail, setEventDetail] = useState<DiscordEventDetail | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, eventId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [guildMembers, detail] = await Promise.all([
        DiscordService.getGuildMembers(),
        DiscordService.getEventDetail(eventId)
      ])
      setMembers(guildMembers || [])
      setEventDetail(detail)
    } catch (err: any) {
      console.error(err)
      showToast(err.message || "Failed to load guild members or event details", "error")
    } finally {
      setLoading(false)
    }
  }

  // Map to easily check current status of users
  const userStatusMap = useMemo(() => {
    const map = new Map<string, RSVPStatus>()
    if (eventDetail) {
      eventDetail.going?.forEach(username => map.set(username.toLowerCase(), 'going'))
      eventDetail.notGoing?.forEach(username => map.set(username.toLowerCase(), 'not_going'))
      eventDetail.maybe?.forEach(username => map.set(username.toLowerCase(), 'maybe'))
    }
    return map
  }, [eventDetail])

  const getUserStatus = (member: DiscordGuildMember): RSVPStatus => {
    return userStatusMap.get(member.username.toLowerCase()) || 
           userStatusMap.get(member.displayName.toLowerCase()) || 
           'none'
  }

  const handleStatusChange = async (member: DiscordGuildMember, newStatus: RSVPStatus) => {
    if (!eventDetail) return
    
    setUpdatingUserId(member.id)
    
    // Optimistic UI update
    const previousDetail = { ...eventDetail }
    
    const updatedDetail = { ...eventDetail }
    
    // Helper to remove username from list
    const removeUser = (list?: string[]) => list?.filter(u => u.toLowerCase() !== member.displayName.toLowerCase() && u.toLowerCase() !== member.username.toLowerCase()) || []
    
    updatedDetail.going = removeUser(updatedDetail.going)
    updatedDetail.notGoing = removeUser(updatedDetail.notGoing)
    updatedDetail.maybe = removeUser(updatedDetail.maybe)
    updatedDetail.noResponse = removeUser(updatedDetail.noResponse)
    
    if (newStatus === 'going') {
      updatedDetail.going.push(member.displayName)
    } else if (newStatus === 'not_going') {
      updatedDetail.notGoing.push(member.displayName)
    } else if (newStatus === 'maybe') {
      updatedDetail.maybe.push(member.displayName)
    } else {
      updatedDetail.noResponse.push(member.displayName)
    }
    
    setEventDetail(updatedDetail)

    try {
      await DiscordService.updateEventParticipation(eventId, {
        userId: member.id,
        username: member.displayName, // We pass displayName as username to upsert in DB
        status: newStatus
      })
      onUpdate() // Refresh parent component events
    } catch (err: any) {
      console.error(err)
      showToast(err.message || "Failed to update RSVP status", "error")
      // Revert optimistic update
      setEventDetail(previousDetail)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members
    const query = searchQuery.toLowerCase()
    return members.filter(m => 
      m.displayName.toLowerCase().includes(query) || 
      m.username.toLowerCase().includes(query)
    )
  }, [members, searchQuery])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <DialogTitle className="text-xl font-bold text-foreground">Manage RSVPs</DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5 max-w-[360px] truncate" title={eventTitle}>
              {eventTitle}
            </p>
          </div>
          <div className="flex gap-2 text-xs font-mono">
            <span className="bg-success/15 text-success px-2 py-0.5 rounded border border-success/20">G: {eventDetail?.going?.length || 0}</span>
            <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded border border-destructive/20">N: {eventDetail?.notGoing?.length || 0}</span>
            <span className="bg-primary/15 text-primary px-2 py-0.5 rounded border border-primary/20">M: {eventDetail?.maybe?.length || 0}</span>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Fetching guild members...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pt-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search server members..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[45vh]">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No members found matching your search.
                </div>
              ) : (
                filteredMembers.map(member => {
                  const status = getUserStatus(member)
                  const isUpdating = updatingUserId === member.id

                  return (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface/30 hover:bg-surface-elevated/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
                          {member.displayName.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">{member.displayName}</h4>
                          {member.displayName !== member.username && (
                            <p className="text-[10px] text-muted-foreground truncate">@{member.username}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mx-4" />
                        ) : (
                          <>
                            {/* Segmented RSVP Control */}
                            <div className="flex border border-border rounded-md overflow-hidden bg-background">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(member, 'going')}
                                className={`px-2.5 py-1 text-xs font-semibold transition-all border-r border-border hover:bg-success/10 ${
                                  status === 'going' 
                                    ? 'bg-success text-white font-bold' 
                                    : 'text-success bg-transparent'
                                }`}
                                title="Going"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(member, 'maybe')}
                                className={`px-2.5 py-1 text-xs font-semibold transition-all border-r border-border hover:bg-primary/10 ${
                                  status === 'maybe' 
                                    ? 'bg-primary text-white font-bold' 
                                    : 'text-primary bg-transparent'
                                }`}
                                title="Maybe"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(member, 'not_going')}
                                className={`px-2.5 py-1 text-xs font-semibold transition-all border-r border-border hover:bg-destructive/10 ${
                                  status === 'not_going' 
                                    ? 'bg-destructive text-white font-bold' 
                                    : 'text-destructive bg-transparent'
                                }`}
                                title="Not Going"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(member, 'none')}
                                disabled={status === 'none'}
                                className={`px-2.5 py-1 text-xs font-semibold transition-all hover:bg-muted/10 disabled:opacity-30 disabled:cursor-not-allowed ${
                                  status === 'none' 
                                    ? 'bg-transparent text-muted-foreground' 
                                    : 'text-muted-foreground bg-transparent hover:text-foreground'
                                }`}
                                title="Clear RSVP"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
        <div className="pt-4 border-t border-border mt-4 flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
