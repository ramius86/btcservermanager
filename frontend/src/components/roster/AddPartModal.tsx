import { useState, useEffect } from 'react'
import { Plus, Copy, LayoutTemplate, Layers } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface AddPartModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly currentPartCount: number
  readonly activePartName: string
  readonly onAddPart: (name: string, mode: 'clone_all' | 'clone_structure' | 'empty') => void
}

export function AddPartModal({
  isOpen,
  onClose,
  currentPartCount,
  activePartName,
  onAddPart,
}: AddPartModalProps) {
  const [partName, setPartName] = useState('')
  const [mode, setMode] = useState<'clone_all' | 'clone_structure' | 'empty'>('clone_all')

  useEffect(() => {
    if (isOpen) {
      setPartName(`PART ${currentPartCount + 1}`)
      setMode('clone_all')
    }
  }, [isOpen, currentPartCount])

  const handleSubmit = (e?: React.SyntheticEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const finalName = partName.trim() || `PART ${currentPartCount + 1}`
    onAddPart(finalName, mode)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add Mission Part
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Configure an additional part or mission for this event's roster (e.g. Part 2).
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="add-part-name-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Part Name
            </label>
            <Input
              id="add-part-name-input"
              value={partName}
              onChange={e => setPartName(e.target.value)}
              placeholder="e.g. PART 2"
              className="h-8 text-xs bg-surface border-border font-semibold uppercase tracking-wider"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Initial Setup
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setMode('clone_all')}
                className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                  mode === 'clone_all'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-surface/40 hover:border-border/80'
                }`}
              >
                <div className={`p-2 rounded-md shrink-0 mt-0.5 ${mode === 'clone_all' ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}>
                  <Copy className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      Duplicate from {activePartName || 'Active Part'}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Copies all squads and assigned players. You can quickly swap roles or adjust players for the second mission.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('clone_structure')}
                className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                  mode === 'clone_structure'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-surface/40 hover:border-border/80'
                }`}
              >
                <div className={`p-2 rounded-md shrink-0 mt-0.5 ${mode === 'clone_structure' ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}>
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">
                    Duplicate Structure Only
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Copies squad names and slot roles, leaving all player slots unassigned.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('empty')}
                className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                  mode === 'empty'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-surface/40 hover:border-border/80'
                }`}
              >
                <div className={`p-2 rounded-md shrink-0 mt-0.5 ${mode === 'empty' ? 'bg-primary text-primary-foreground' : 'bg-surface text-muted-foreground'}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">
                    Empty Part
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Starts with a blank board to configure new squads from scratch.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border -mx-5 -mb-5 p-4 bg-surface/30 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="text-xs font-semibold">
              Create Part
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
