import { useState, useEffect } from 'react'
import { CheckCircle2, X, GripVertical, Save, FolderOpen, Loader2 } from 'lucide-react'
import { Input } from '../ui/Input'
import { WorkshopService, ModPresetService } from '../../services/api'
import { Button, cn } from '../ui/Button'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/Dialog'
import { Select } from '../ui/Select'
import { useToast } from '../ui/Toast'

interface SelectedModItemProps {
  mod: any
  index: number
  toggleMod: (id: number) => void
}

function SelectedModItem({ mod, index, toggleMod }: Readonly<SelectedModItemProps>) {
  return (
    <Draggable key={mod.id.toString()} draggableId={mod.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "flex items-center justify-between px-3 py-1.5 group",
            snapshot.isDragging ? "bg-primary/30 border-y border-primary z-50 shadow-2xl" : "bg-transparent hover:bg-muted/50"
          )}
          style={provided.draggableProps.style as React.CSSProperties}
        >
          <div className="flex items-center gap-3 truncate">
            <div {...provided.dragHandleProps} className="text-muted-foreground/50 group-hover:text-foreground/80 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-3 h-3" />
            </div>
            <span className="text-xs font-medium text-foreground truncate">{mod.name}</span>
          </div>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); toggleMod(mod.id); }} 
            className="p-0.5 text-muted-foreground/80 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Draggable>
  )
}

interface ModSelectorProps {
  serverType: string
  selectedModIds: number[]
  onChange: (modIds: number[]) => void
}

export function ModSelector({ serverType, selectedModIds, onChange }: Readonly<ModSelectorProps>) {
  const { showToast } = useToast()
  const [availableMods, setAvailableMods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Presets state
  const [presets, setPresets] = useState<any[]>([])
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [savePresetOpen, setSavePresetOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [isSavingPreset, setIsSavingPreset] = useState(false)

  useEffect(() => {
    loadData()
  }, [serverType])

  const loadData = () => {
    setLoading(true)
    Promise.all([
      WorkshopService.getAll(serverType),
      ModPresetService.getAll(serverType)
    ]).then(([modsData, presetsData]) => {
      setAvailableMods(Array.isArray(modsData) ? modsData : (modsData as any).workshopMods || [])
      setPresets(Array.isArray(presetsData) ? presetsData : (presetsData as any).presets || [])
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load mods or presets', err)
      setLoading(false)
    })
  }

  const toggleMod = (id: number) => {
    if (selectedModIds.includes(id)) {
      onChange(selectedModIds.filter(mid => mid !== id))
    } else {
      onChange([...selectedModIds, id])
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newItems = Array.from(selectedModIds)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)
    onChange(newItems)
  }

  const handleApplyPreset = () => {
    const preset = presets.find(p => String(p.id) === selectedPresetId)
    if (!preset) return

    const presetModIds = (preset.mods || []).map((m: any) => m.id)
    onChange(presetModIds)
    showToast(`Preset '${preset.name}' applied.`, 'info')
  }

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return
    setIsSavingPreset(true)
    try {
      await ModPresetService.create({
        name: newPresetName,
        serverType: serverType,
        mods: selectedModIds.map(id => ({ id }))
      })
      showToast(`Preset '${newPresetName}' created.`, 'success')
      setSavePresetOpen(false)
      setNewPresetName('')
      // Refresh presets list
      const updatedPresets = await ModPresetService.getAll(serverType)
      setPresets(Array.isArray(updatedPresets) ? updatedPresets : (updatedPresets as any).presets || [])
    } catch (err) {
      console.error(err)
      showToast('Failed to create preset.', 'error')
    } finally {
      setIsSavingPreset(false)
    }
  }

  const filteredAvailable = availableMods.filter(m => 
    !selectedModIds.includes(m.id) && 
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toString().includes(search))
  )

  const selectedModsList = selectedModIds
    .map(id => availableMods.find(m => m.id === id))
    .filter(Boolean)

  const renderAvailableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-xs text-muted-foreground/80 uppercase font-bold tracking-widest animate-pulse">
          Syncing Metadata...
        </div>
      )
    }

    if (filteredAvailable.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground/80 uppercase font-bold tracking-widest italic px-4 text-center">
          {search ? 'No matches found' : 'All local content assigned to instance'}
        </div>
      )
    }

    return (
      <div className="divide-y divide-border/50">
        {filteredAvailable.map(mod => (
          <button 
            key={mod.id}
            type="button"
            onClick={() => toggleMod(mod.id)}
            className="w-full text-left group flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <span className="text-xs font-medium text-foreground/80 group-hover:text-primary truncate pr-2">
              {mod.name}
            </span>
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 className="w-3 h-3 text-primary" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* PRESETS TOOLBAR */}
      <div className="bg-surface-elevated/40 border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-3 w-full">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FolderOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select 
              value={selectedPresetId} 
              onChange={(e) => setSelectedPresetId(e.target.value)}
            >
              <option value="" disabled className="bg-surface-elevated">Select a preset...</option>
              {presets.map(p => (
                <option key={p.id} value={String(p.id)} className="bg-surface-elevated">{p.name} ({p.mods?.length || 0} mods)</option>
              ))}
            </Select>
          </div>
          <Button 
            type="button"
            variant="secondary" 
            size="sm" 
            onClick={handleApplyPreset}
            disabled={!selectedPresetId}
            className="h-10 px-4 font-bold uppercase tracking-widest text-[10px]"
          >
            Apply
          </Button>
        </div>

        <div className="h-8 w-px bg-border/50 hidden sm:block" />

        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          onClick={() => setSavePresetOpen(true)}
          disabled={selectedModIds.length === 0}
          className="h-10 px-4 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto"
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          Save as Preset
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* AVAILABLE MODS */}
        <div className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Available Content</p>
            <span className="text-[10px] font-bold text-muted-foreground/80 bg-muted px-2 py-0.5 rounded border border-border">
              {filteredAvailable.length} TOTAL
            </span>
          </div>
          
          <div className="relative mb-3">
            <Input 
              placeholder="Filter installed content..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 bg-muted/50 border-border text-xs focus:ring-primary/50"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto border border-border rounded-lg bg-muted/30 no-scrollbar">
            {renderAvailableContent()}
          </div>
        </div>

        {/* LOAD ORDER / SELECTED MODS */}
        <div className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Active Load Order</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {selectedModIds.length}
              </span>
            </div>
            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground">
              Drag to prioritize
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto border border-border rounded-lg bg-muted/30 no-scrollbar">
            {selectedModIds.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground/80 uppercase font-bold tracking-widest italic px-8 text-center">
                Instance is currently unmodded.<br/>Select content from the left.
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="selected-mods-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-border/50">
                      {selectedModsList.map((mod, index) => (
                        <SelectedModItem 
                          key={mod.id} 
                          mod={mod} 
                          index={index} 
                          toggleMod={toggleMod} 
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>

      {/* SAVE PRESET DIALOG */}
      <Dialog open={savePresetOpen} onOpenChange={setSavePresetOpen}>
        <DialogContent className="sm:max-w-md bg-surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Save Current Load Order
            </DialogTitle>
            <DialogDescription>
              Enter a name for this preset to reuse it across other {serverType} instances.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Milsim Hardcore, Survival Basic..."
              value={newPresetName}
              onChange={e => setNewPresetName(e.target.value)}
              className="bg-muted/50 border-border"
              onKeyDown={e => e.key === 'Enter' && handleSavePreset()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSavePresetOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSavePreset} disabled={!newPresetName.trim() || isSavingPreset}>
              {isSavingPreset ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
