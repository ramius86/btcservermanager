import { useState } from 'react'
import { ListOrdered, ChevronUp, ChevronDown, Check, GripVertical } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import type { RosterSquad } from '../../services/api'

interface ReorderSquadsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly squads: RosterSquad[]
  readonly partName?: string
  readonly onReorder: (squads: RosterSquad[]) => void
}

export function ReorderSquadsModal({
  isOpen,
  onClose,
  squads,
  partName,
  onReorder,
}: ReorderSquadsModalProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= squads.length || fromIndex === toIndex) return
    const updated = [...squads]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onReorder(updated)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index && dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      handleMove(draggedIndex, targetIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-primary" />
            Reorder Squads {partName ? `(${partName})` : ''}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Move squads up or down to set their sequence in the roster and Discord announcement.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-2 max-h-[60vh]">
          {squads.map((squad, index) => {
            const assignedCount = squad.slots.filter(s => s.assignedPlayerName?.trim()).length
            const isDragging = draggedIndex === index
            const isDragOver = dragOverIndex === index

            return (
              <div
                key={squad.id}
                onDragOver={e => handleDragOver(e, index)}
                onDrop={e => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isDragging
                    ? 'opacity-30 border-dashed border-primary/50'
                    : isDragOver
                    ? 'border-primary ring-2 ring-primary/40 bg-primary/10'
                    : 'border-border bg-surface/60 hover:border-border/80 hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    draggable
                    onDragStart={e => handleDragStart(e, index)}
                    className="p-1 -ml-1 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors rounded hover:bg-surface shrink-0"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-xs font-mono font-bold text-primary shrink-0 select-none">
                    #{index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-wider text-foreground truncate">
                      {squad.name || `Squad ${index + 1}`}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {squad.slots.length} slots • {assignedCount} assigned
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    title="Move Up"
                    aria-label={`Move ${squad.name} up`}
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === squads.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    title="Move Down"
                    aria-label={`Move ${squad.name} down`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="p-4 border-t border-border bg-surface/30">
          <Button type="button" onClick={onClose} className="text-xs gap-1.5 ml-auto">
            <Check className="w-3.5 h-3.5" />
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
