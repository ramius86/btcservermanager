import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Trash2, Globe, Loader2, ExternalLink, Info, Package, Save, FolderOpen } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button, cn } from '../ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/Dialog'
import { WorkshopService, ScenarioService, ModPresetService } from '../../services/api'
import { useToast } from '../ui/Toast'
import { Select } from '../ui/Select'

interface ReforgerMod {
  id: string
  name: string
  thumbnail: string
}

interface ReforgerModSelectorProps {
  selectedMods: ReforgerMod[]
  onChange: (mods: ReforgerMod[]) => void
}

export function ReforgerModSelector({ selectedMods, onChange }: Readonly<ReforgerModSelectorProps>) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedDetails, setSelectedDetails] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)

  // Presets state
  const [presets, setPresets] = useState<any[]>([])
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [savePresetOpen, setSavePresetOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [isSavingPreset, setIsSavingPreset] = useState(false)

  useEffect(() => {
    loadPresets()
  }, [])

  const loadPresets = async () => {
    try {
      const data = await ModPresetService.getAll('REFORGER')
      setPresets(Array.isArray(data) ? data : (data as any).presets || [])
    } catch (err) {
      console.error('Failed to load presets', err)
    }
  }

  const handleApplyPreset = () => {
    const preset = presets.find(p => String(p.id) === selectedPresetId)
    if (!preset) return

    const presetMods: ReforgerMod[] = (preset.reforgerMods || []).map((m: any) => ({
      id: String(m.id),
      name: m.name || `Mod ${m.id}`,
      thumbnail: m.thumbnail || ''
    }))
    
    onChange(presetMods)
    showToast(`Preset '${preset.name}' applied.`, 'info')
  }

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return
    setIsSavingPreset(true)
    try {
      await ModPresetService.create({
        name: newPresetName,
        serverType: 'REFORGER',
        reforgerMods: selectedMods.map(m => ({ id: m.id, name: m.name, thumbnail: m.thumbnail }))
      })
      showToast(`Preset '${newPresetName}' created.`, 'success')
      setSavePresetOpen(false)
      setNewPresetName('')
      loadPresets()
    } catch (err) {
      console.error(err)
      showToast('Failed to create preset.', 'error')
    } finally {
      setIsSavingPreset(false)
    }
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    
    // Check for URL pattern (e.g., https://reforger.armaplatform.com/workshop/59AD59368755F41A-CaptureAndHold)
    const urlMatch = /\/workshop\/([A-F0-9]{16})-(.+)/i.exec(val)
    if (urlMatch) {
      const idWithSlug = val.split('/workshop/')[1]
      const id = urlMatch[1]
      const name = urlMatch[2].replaceAll('-', ' ')
      if (!selectedMods.some(m => m.id === id)) {
        const newMod = { id, name, thumbnail: '' }
        onChange([...selectedMods, newMod])
        
        // Fetch scenarios and notify components to refresh
        ScenarioService.fetchReforgerModScenarios(idWithSlug).then(() => {
          globalThis.dispatchEvent(new Event('reforger_scenarios_updated'))
        })

        showToast(`Mod added from URL: ${name}`, 'success')
        setSearch('')
      }
      return
    }

    if (val.length < 2) {
      setSearchResults([])
      return
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const data = await WorkshopService.searchReforgerMods(val)
        setSearchResults(data)
      } catch (err) {
        console.error('Search failed', err)
      } finally {
        setIsSearching(false)
      }
    }, 500)
  }

  const addMod = (mod: any) => {
    if (!selectedMods.some(m => m.id === mod.id)) {
      onChange([...selectedMods, { id: mod.id, name: mod.name, thumbnail: mod.thumbnail }])
      
      // Fetch scenarios and notify components to refresh
      ScenarioService.fetchReforgerModScenarios(mod.id).then(() => {
        globalThis.dispatchEvent(new Event('reforger_scenarios_updated'))
      })

      showToast(`Mod added: ${mod.name}`, 'success')
    }
    setSearch('')
    setSearchResults([])
  }

  const removeMod = (id: string) => {
    onChange(selectedMods.filter(m => m.id !== id))
  }

  const handleShowDetails = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setFetchingDetails(true)
    try {
      const data = await WorkshopService.getReforgerModDetails(id)
      setSelectedDetails(data)
      setDetailsOpen(true)
    } catch (err) {
      console.error(err)
      showToast("Failed to fetch mod details", "error")
    } finally {
      setFetchingDetails(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* PRESETS TOOLBAR */}
      <div className="bg-surface-elevated/40 border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-3 w-full">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FolderOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select 
              value={selectedPresetId} 
              onChange={(e) => setSelectedPresetId(e.target.value)}
            >
              <option value="" disabled className="bg-surface-elevated">Select a preset...</option>
              {presets.map(p => (
                <option key={p.id} value={String(p.id)} className="bg-surface-elevated">{p.name} ({p.reforgerMods?.length || 0} mods)</option>
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
          disabled={selectedMods.length === 0}
          className="h-10 px-4 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto"
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          Save as Preset
        </Button>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="reforger-workshop-search" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Add Mod from Workshop</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              id="reforger-workshop-search"
              placeholder="Search by name or paste Workshop URL..." 
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="grid gap-2 max-h-60 overflow-y-auto bg-surface-elevated border border-border/50 rounded-md p-2 shadow-xl">
            {searchResults.map(mod => {
              const isActive = selectedMods.some(m => m.id === mod.id);
              return (
                <div 
                  key={mod.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md transition-colors group",
                    isActive ? "opacity-60 bg-muted/20" : "hover:bg-muted/50"
                  )}
                >
                  <button
                    type="button"
                    disabled={isActive}
                    onClick={() => addMod(mod)}
                    className="flex-1 flex items-center gap-3 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded cursor-pointer"
                  >
                    <div className="w-10 h-10 shrink-0 bg-black rounded overflow-hidden flex items-center justify-center border border-border/50">
                      {mod.thumbnail ? (
                        <img src={mod.thumbnail} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-5 h-5 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm font-bold text-foreground truncate block">
                        {mod.name}
                      </span>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">ID: {mod.id} | by {mod.author}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isActive ? (
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20 mr-2">
                        Already active
                      </span>
                    ) : (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => addMod(mod)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={(e) => handleShowDetails(e, mod.id)}
                      disabled={fetchingDetails}
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                    <a 
                      href={`https://reforger.armaplatform.com/workshop/${mod.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="View on Workshop"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80">Active Mods ({selectedMods.length})</h3>
          <span className="text-[10px] text-muted-foreground font-medium">Automatic scenario ID discovery enabled</span>
        </div>

        <div className="grid gap-3">
          {selectedMods.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/20">
              <Globe className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">No mods active on this server.</p>
              <p className="text-muted-foreground/80 text-xs mt-1">Search for mods above to add them to your configuration.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedMods.map(mod => (
                <div 
                  key={mod.id}
                  className="flex items-center justify-between p-3 bg-muted/80 border border-border rounded-xl hover:border-border/50 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-border group-hover:border-border transition-colors">
                      {mod.thumbnail ? (
                        <img src={mod.thumbnail} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-6 h-6 text-muted-foreground/20" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <a 
                        href={`https://reforger.armaplatform.com/workshop/${mod.id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm font-bold text-foreground/90 truncate pr-2 hover:text-blue-400 transition-colors block"
                        title={mod.name}
                      >
                        {mod.name}
                      </a>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] font-mono text-muted-foreground tracking-tighter truncate">ID: {mod.id}</p>
                        <button 
                          type="button"
                          className="text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1 group/info"
                          onClick={(e) => handleShowDetails(e, mod.id)}
                          disabled={fetchingDetails}
                        >
                          <Info className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-tighter opacity-0 group-hover/info:opacity-100 transition-opacity">Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeMod(mod.id)}
                    className="h-9 w-9 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden bg-surface-elevated">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
              <Info className="w-6 h-6 text-primary" />
              Mod Details
            </DialogTitle>
          </DialogHeader>

          {selectedDetails && (
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-border shadow-2xl">
                  {selectedDetails.thumbnail ? (
                    <img src={selectedDetails.thumbnail} alt="Selected mod thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">{selectedDetails.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">by {selectedDetails.author || 'Unknown Author'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Version</p>
                      <p className="text-sm font-mono font-bold text-primary">{selectedDetails.version || 'N/A'}</p>
                    </div>
                    <div className="bg-surface p-3 rounded-lg border border-border/50">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Updated</p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedDetails.updatedAt ? new Date(selectedDetails.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-border bg-surface hover:bg-surface-elevated"
                      onClick={() => window.open(`https://reforger.armaplatform.com/workshop/${selectedDetails.id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Workshop
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-1">Description</p>
                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedDetails.description || selectedDetails.summary || 'No description available.'}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-4 bg-muted/30 border-t border-border">
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SAVE PRESET DIALOG */}
      <Dialog open={savePresetOpen} onOpenChange={setSavePresetOpen}>
        <DialogContent className="sm:max-w-md bg-surface-elevated border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-primary" />
              Save Current Load Order
            </DialogTitle>
            <DialogDescription>
              Enter a name for this preset to reuse it across other Reforger instances.
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
