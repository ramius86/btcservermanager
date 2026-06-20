/**
 * ModPresetCard Component
 * Displays a saved mod configuration preset.
 * Logic: Shows mod count and provides actions for editing, exporting, and deleting presets.
 * Context: Used in the 'Presets' tab of the ModsPage.
 */
import React from 'react'
import { Layers, Trash2, Edit, Share } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface ModPresetCardProps {
  preset: any
  onEdit: (preset: any) => void
  onExport: (preset: any) => void
  onDelete: (preset: any) => void
}

export const ModPresetCard: React.FC<Readonly<ModPresetCardProps>> = ({
  preset,
  onEdit,
  onExport,
  onDelete
}) => {
  return (
    <Card key={preset.id} className="group overflow-hidden border-border bg-surface hover:border-primary/20 transition-all duration-300">
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 overflow-hidden min-w-0">
          <div className="w-12 h-12 rounded-md bg-surface-elevated flex items-center justify-center border border-border shrink-0">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">{preset.name}</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-1">{preset.mods?.length || 0} MODS DEFINED</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
           <Button variant="ghost" size="sm" onClick={() => onEdit(preset)} className="h-8 text-muted-foreground hover:text-foreground">
             <Edit className="w-3.5 h-3.5 mr-1.5" /> EDIT
           </Button>
           <Button variant="ghost" size="sm" onClick={() => onExport(preset)} className="h-8 text-muted-foreground hover:text-foreground">
             <Share className="w-3.5 h-3.5 mr-1.5" /> EXPORT
           </Button>
           <Button 
             variant="ghost" 
             size="icon" 
             className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 ml-1" 
             onClick={() => onDelete(preset)}
           >
              <Trash2 className="w-3.5 h-3.5" />
           </Button>
        </div>
      </div>
    </Card>
  )
}
