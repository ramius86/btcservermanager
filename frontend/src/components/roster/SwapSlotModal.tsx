import { useState, useMemo } from 'react'
import { ArrowLeftRight, Search, User } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import type { RosterSquad } from '../../services/api'

interface SwapSlotModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly sourceSlot: {
    squadId: string
    squadName: string
    slotId: string
    role: string
    playerName: string
  }
  readonly squads: RosterSquad[]
  readonly onSwap: (targetSquadId: string, targetSlotId: string, targetPlayerName: string) => void
}

interface SwapCandidate {
  squadId: string
  squadName: string
  slotId: string
  role: string
  playerName: string
  isMaybe?: boolean
  isGuest?: boolean
}

export function SwapSlotModal({
  isOpen,
  onClose,
  sourceSlot,
  squads,
  onSwap,
}: SwapSlotModalProps) {
  const [search, setSearch] = useState('')

  const candidates: SwapCandidate[] = useMemo(() => {
    const list: SwapCandidate[] = []
    for (const sq of squads) {
      for (const sl of sq.slots) {
        if (sq.id === sourceSlot.squadId && sl.id === sourceSlot.slotId) {
          continue
        }
        if (sl.assignedPlayerName?.trim()) {
          list.push({
            squadId: sq.id,
            squadName: sq.name,
            slotId: sl.id,
            role: sl.role,
            playerName: sl.assignedPlayerName,
            isMaybe: sl.isMaybe,
            isGuest: sl.isGuest,
          })
        }
      }
    }
    return list
  }, [squads, sourceSlot])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return candidates
    return candidates.filter(
      c =>
        c.playerName.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.squadName.toLowerCase().includes(q)
    )
  }, [candidates, search])

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-primary" />
            Swap Player Role
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Swap <strong>{sourceSlot.playerName}</strong> ({sourceSlot.role} in {sourceSlot.squadName}) with another assigned player in this mission.
          </p>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by player, role or squad..."
              className="h-8 pl-8 text-xs bg-surface border-border"
              autoFocus
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-1.5 pr-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs italic">
                  {search ? 'No matching players found.' : 'No other players are currently assigned in this part.'}
                </p>
              </div>
            ) : (
              filtered.map(cand => (
                <button
                  key={`${cand.squadId}_${cand.slotId}`}
                  type="button"
                  onClick={() => {
                    onSwap(cand.squadId, cand.slotId, cand.playerName)
                    onClose()
                  }}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface/40 hover:bg-primary/10 hover:border-primary/40 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
                      {cand.role}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                        {cand.playerName}
                      </span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {cand.squadName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {cand.isMaybe && (
                      <Badge variant="warning" className="text-[8px] font-bold py-0 px-1">
                        Maybe (?)
                      </Badge>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      <ArrowLeftRight className="w-3 h-3" />
                      Swap
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="p-3 border-t border-border bg-surface/30 flex items-center justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
