import { useState, useEffect, useMemo } from 'react'
import { GitMerge, AlertTriangle, ArrowRight, CheckCircle2, Search, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { ConfirmationDialog } from '../ui/ConfirmationDialog'
import { useToast } from '../ui/Toast'
import { DiscordService } from '../../services/api'
import type { DiscordUser, DiscordGuildMember } from '../../services/api'

interface MergeDiscordUsersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface UserOption {
  id: string
  displayName: string
  username: string
}

export function MergeDiscordUsersModal({ open, onOpenChange, onSuccess }: Readonly<MergeDiscordUsersModalProps>) {
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [merging, setMerging] = useState(false)
  const [users, setUsers] = useState<UserOption[]>([])

  const [sourceUserId, setSourceUserId] = useState('')
  const [targetUserId, setTargetUserId] = useState('')

  const [searchSource, setSearchSource] = useState('')
  const [searchTarget, setSearchTarget] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (open) {
      loadUsers()
    } else {
      setSourceUserId('')
      setTargetUserId('')
      setSearchSource('')
      setSearchTarget('')
    }
  }, [open])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const [dbUsers, guildMembers] = await Promise.all([
        DiscordService.getUsers().catch(() => [] as DiscordUser[]),
        DiscordService.getGuildMembers().catch(() => [] as DiscordGuildMember[])
      ])

      const map = new Map<string, UserOption>()

      // 1. Add DB users
      for (const u of dbUsers) {
        if (u.id) {
          map.set(u.id, {
            id: u.id,
            displayName: u.username,
            username: u.username
          })
        }
      }

      // 2. Add or update with guild members (which may have nicer display names)
      for (const m of guildMembers) {
        if (m.id) {
          const existing = map.get(m.id)
          map.set(m.id, {
            id: m.id,
            displayName: m.displayName || existing?.displayName || m.username,
            username: m.username || existing?.username || m.displayName
          })
        }
      }

      const list = Array.from(map.values()).sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' })
      )

      setUsers(list)
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Failed to load users for merging', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredSourceUsers = useMemo(() => {
    const q = searchSource.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.id.includes(q)
    )
  }, [users, searchSource])

  const filteredTargetUsers = useMemo(() => {
    const q = searchTarget.trim().toLowerCase()
    const available = users.filter(u => u.id !== sourceUserId)
    if (!q) return available
    return available.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.id.includes(q)
    )
  }, [users, sourceUserId, searchTarget])

  const selectedSource = users.find(u => u.id === sourceUserId)
  const selectedTarget = users.find(u => u.id === targetUserId)

  const handleStartMerge = () => {
    if (!sourceUserId || !targetUserId || sourceUserId === targetUserId) return
    setConfirmOpen(true)
  }

  const executeMerge = async () => {
    setMerging(true)
    try {
      await DiscordService.mergeUsers({ sourceUserId, targetUserId })
      showToast('Discord accounts merged successfully.', 'success')
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Failed to merge accounts', 'error')
    } finally {
      setMerging(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] flex flex-col p-6">
          <DialogHeader className="pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <GitMerge className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Merge Discord Accounts</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Unify two Discord IDs when a player created a new account.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading members...</p>
            </div>
          ) : (
            <div className="space-y-6 py-2 overflow-y-auto pr-1">
              
              {/* Account Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Source Account (Old / Suppress) */}
                <div className="space-y-2 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-destructive/90 flex items-center gap-1.5">
                      1. Old Account (To Delete)
                    </label>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Filter old user..."
                      value={searchSource}
                      onChange={(e) => setSearchSource(e.target.value)}
                      className="pl-8 h-8 text-xs bg-background"
                    />
                  </div>
                  <Select
                    value={sourceUserId}
                    onChange={(e) => {
                      setSourceUserId(e.target.value)
                      if (e.target.value === targetUserId) {
                        setTargetUserId('')
                      }
                    }}
                    className="text-xs h-9 bg-background"
                  >
                    <option value="">-- Select Old Account --</option>
                    {filteredSourceUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.displayName} {u.displayName !== u.username ? `(@${u.username})` : ''} [{u.id.slice(-6)}]
                      </option>
                    ))}
                  </Select>
                  {selectedSource && (
                    <div className="text-[11px] text-muted-foreground font-mono bg-background/80 px-2 py-1 rounded border border-border/50 truncate">
                      ID: {selectedSource.id}
                    </div>
                  )}
                </div>

                {/* Target Account (New / Inherit) */}
                <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1.5">
                      2. New Account (To Keep)
                    </label>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Filter new user..."
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(e.target.value)}
                      className="pl-8 h-8 text-xs bg-background"
                    />
                  </div>
                  <Select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    disabled={!sourceUserId}
                    className="text-xs h-9 bg-background"
                  >
                    <option value="">-- Select New Account --</option>
                    {filteredTargetUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.displayName} {u.displayName !== u.username ? `(@${u.username})` : ''} [{u.id.slice(-6)}]
                      </option>
                    ))}
                  </Select>
                  {selectedTarget && (
                    <div className="text-[11px] text-muted-foreground font-mono bg-background/80 px-2 py-1 rounded border border-border/50 truncate">
                      ID: {selectedTarget.id}
                    </div>
                  )}
                </div>

              </div>

              {/* Merge Flow Preview */}
              {selectedSource && selectedTarget && (
                <div className="p-3 bg-surface-elevated/70 rounded-lg border border-border flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Source</p>
                    <p className="font-semibold text-destructive truncate">{selectedSource.displayName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{selectedSource.id}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Destination</p>
                    <p className="font-semibold text-primary truncate">{selectedTarget.displayName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{selectedTarget.id}</p>
                  </div>
                </div>
              )}

              {/* What happens callout */}
              <div className="p-3.5 rounded-lg border border-border bg-surface/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>What will be migrated automatically:</span>
                </div>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-1 text-[11px]">
                  <li>All past event attendance records (RSVPs) will be inherited by the new account</li>
                  <li>Clan qualifications & badges (<code className="font-mono text-foreground">/members</code>) will be transferred</li>
                  <li>Player role play counts & history for event rosters will be merged</li>
                  <li>The old account ID will be permanently removed from the database</li>
                </ul>
              </div>

              {/* Discord Guild Warning Note */}
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-500/90 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed text-[11px]">
                  <span className="font-bold">Discord Server Reminder:</span> If the old Discord account is still present in your Discord server, remember to kick or ban it from Discord directly. This ensures Discord's member list does not return it.
                </div>
              </div>

            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border flex justify-between items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={merging}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleStartMerge}
              disabled={!sourceUserId || !targetUserId || sourceUserId === targetUserId || merging}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5"
            >
              {merging ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                  Merging...
                </>
              ) : (
                <>
                  <GitMerge className="w-3.5 h-3.5 mr-1" />
                  Merge Accounts
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Account Merge"
        description={`Are you sure you want to merge "${selectedSource?.displayName || sourceUserId}" into "${selectedTarget?.displayName || targetUserId}"? All historical event attendances, qualifications, and role history will be permanently transferred to the new account, and the old account will be removed from the database. This action is irreversible.`}
        confirmLabel="Merge Accounts"
        variant="danger"
        onConfirm={executeMerge}
      />
    </>
  )
}
