/**
 * ModPresetEditDialog Component
 * Modal for editing the contents of a mod preset.
 * Logic: Allows selecting/deselecting mods from the total installed list to update a preset.
 * Context: Triggered via the 'EDIT' action on a ModPresetCard.
 */
import React from 'react'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog'

interface ModPresetEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  presetName: string
  mods: any[]
  selectedModIds: number[]
  onChangeMod: (id: number, action: 'add' | 'remove') => void
  onSave: () => void
  filter: string
}

export const ModPresetEditDialog: React.FC<Readonly<ModPresetEditDialogProps>> = ({
  open,
  onOpenChange,
  presetName,
  mods,
  selectedModIds,
  onChangeMod,
  onSave,
  filter
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Preset: {presetName}</DialogTitle>
          <DialogDescription>
            Select which mods to include in this preset.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto border border-border rounded-lg divide-y divide-border max-h-[400px]">
          {mods.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground text-sm">No mods available for {filter}</p>
          ) : mods.map(mod => (
            <label htmlFor={`preset-mod-${mod.id}`} key={mod.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer">
              <input
                id={`preset-mod-${mod.id}`}
                type="checkbox"
                checked={selectedModIds.includes(mod.id)}
                onChange={(e) => onChangeMod(mod.id, e.target.checked ? 'add' : 'remove')}
                className="rounded border-border/50"
                aria-label={mod.name || `Mod ${mod.id}`}
              />
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium truncate">{mod.name}</span>
                <span className="block text-xs text-muted-foreground">ID: {mod.id}</span>
              </div>
            </label>
          ))}
        </div>
        <DialogFooter className="pt-3">
          <span className="text-xs text-muted-foreground mr-auto">{selectedModIds.length} mod(s) selected</span>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
