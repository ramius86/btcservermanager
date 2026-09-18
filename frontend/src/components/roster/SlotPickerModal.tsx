import React, { useState, useMemo } from 'react'
import { Search, Star, UserPlus, Award } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import type { RosterCandidate } from './rosterUtils'
import { rankCandidatesForRole } from './rosterUtils'
import type { PlayerRoleStat } from '../../services/api'

interface SlotPickerModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly squadName: string
  readonly roleCode: string
  readonly candidates: RosterCandidate[]
  readonly learningStats: PlayerRoleStat[]
  readonly gameType?: string
  readonly onSelectCandidate: (candidate: RosterCandidate | null, guestName?: string) => void
}

export function SlotPickerModal({
  isOpen,
  onClose,
  squadName,
  roleCode,
  candidates,
  learningStats,
  gameType,
  onSelectCandidate,
}: SlotPickerModalProps) {
  const [search, setSearch] = useState('')
  const [guestInput, setGuestInput] = useState('')

  const rankedCandidates = useMemo(() => {
    return rankCandidatesForRole(candidates, roleCode, learningStats, gameType)
  }, [candidates, roleCode, learningStats, gameType])

  const filteredCandidates = useMemo(() => {
    if (!search.trim()) return rankedCandidates
    const q = search.toLowerCase()
    return rankedCandidates.filter(item =>
      item.candidate.name.toLowerCase().includes(q) ||
      item.candidate.qualifications.some(qual => qual.toLowerCase().includes(q))
    )
  }, [rankedCandidates, search])

  const recommended = useMemo(() => {
    return filteredCandidates.filter(item => item.isHighAffinity)
  }, [filteredCandidates])

  const others = useMemo(() => {
    return filteredCandidates.filter(item => !item.isHighAffinity)
  }, [filteredCandidates])

  const handleSelect = (candidate: RosterCandidate) => {
    onSelectCandidate(candidate)
    onClose()
  }

  const handleAddGuest = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!guestInput.trim()) return
    onSelectCandidate(null, guestInput.trim())
    setGuestInput('')
    onClose()
  }

  const handleClearSlot = () => {
    onSelectCandidate(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <span>Assign Slot:</span>
                <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {roleCode}
                </span>
                <span className="text-muted-foreground text-xs font-normal">in {squadName}</span>
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                Select a player or enter a custom guest name. Qualified and frequent players appear first.
              </p>
            </div>
          </div>

          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search candidate or qualification..."
              className="h-9 pl-9 text-xs bg-surface border-border"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Recommended Section */}
          {recommended.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Star className="w-3 h-3 fill-primary/20 text-primary" />
                <span>Recommended for {roleCode}</span>
                <span className="text-[9px] text-muted-foreground font-normal">({recommended.length})</span>
              </div>
              <div className="grid gap-1.5">
                {recommended.map(({ candidate, hasBrevetto, matchedQualification, playCount, score }) => (
                  <button
                    key={candidate.id + candidate.name}
                    type="button"
                    onClick={() => handleSelect(candidate)}
                    className="w-full text-left p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {candidate.name}
                        </span>
                        {candidate.isMaybe && (
                          <Badge variant="warning" className="text-[8px] py-0 px-1 font-bold">
                            Maybe (?)
                          </Badge>
                        )}
                        {!candidate.isMaybe && (
                          <Badge variant="success" className="text-[8px] py-0 px-1 font-bold">
                            Going
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {hasBrevetto && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-success font-medium bg-success/10 px-1.5 py-0.5 rounded">
                            <Award className="w-2.5 h-2.5" />
                            {matchedQualification || 'Brevetto'}
                          </span>
                        )}
                        {playCount > 0 && (
                          <span className="text-[9px] text-muted-foreground bg-surface px-1.5 py-0.5 rounded border border-border">
                            Played {roleCode} {playCount}×
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-bold text-primary font-mono">
                        {Math.min(99, Math.max(50, score))}%
                      </span>
                      <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Affinity</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other Candidates (Override) Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>{recommended.length > 0 ? 'All Other Available Players (Override)' : 'Available Players'}</span>
              <span className="text-[9px] font-normal">({others.length})</span>
            </div>
            {others.length === 0 && recommended.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-3 text-center">
                No unassigned players found matching your search.
              </p>
            ) : (
              <div className="grid gap-1.5">
                {others.map(({ candidate }) => (
                  <button
                    key={candidate.id + candidate.name}
                    type="button"
                    onClick={() => handleSelect(candidate)}
                    className="w-full text-left p-2.5 rounded-lg border border-border bg-surface/40 hover:bg-surface-elevated hover:border-border/80 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                          {candidate.name}
                        </span>
                        {candidate.isMaybe ? (
                          <Badge variant="warning" className="text-[8px] py-0 px-1 font-bold">
                            Maybe (?)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[8px] py-0 px-1">
                            Going
                          </Badge>
                        )}
                      </div>
                      {candidate.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.qualifications.slice(0, 3).map(q => (
                            <span key={q} className="text-[8px] text-muted-foreground bg-surface px-1 py-0.2 rounded border border-border">
                              {q}
                            </span>
                          ))}
                          {candidate.qualifications.length > 3 && (
                            <span className="text-[8px] text-muted-foreground">+{candidate.qualifications.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground">
                      Assign
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Guest Entry */}
          <div className="pt-3 border-t border-border space-y-2">
            <label htmlFor="slot-picker-guest-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <UserPlus className="w-3 h-3" />
              Assign Guest Player
            </label>
            <form onSubmit={handleAddGuest} className="flex gap-2">
              <Input
                id="slot-picker-guest-input"
                value={guestInput}
                onChange={e => setGuestInput(e.target.value)}
                placeholder="Guest player name..."
                className="h-8 text-xs bg-surface border-border flex-1"
              />
              <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs font-semibold px-3">
                Assign Guest
              </Button>
            </form>
          </div>
        </div>

        <DialogFooter className="p-3 border-t border-border bg-surface/40 flex items-center justify-between sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={handleClearSlot} className="text-xs text-destructive hover:bg-destructive/10">
            Clear Slot
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
