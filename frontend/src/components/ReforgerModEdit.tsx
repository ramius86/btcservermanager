import { useState, useRef } from 'react'
import { Search, Trash2, Plus, Package, Loader2, Info, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog'
import { Button, cn } from './ui/Button'
import { Input } from './ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table'
import { WorkshopService, ServerService } from '../services/api'
import { useToast } from './ui/Toast'

interface ReforgerMod {
  id: string
  name: string
  thumbnail?: string
}

interface ReforgerModEditProps {
  serverId: number
  serverName: string
  activeMods: ReforgerMod[]
  serverRunning?: boolean
  onSave: () => void
}

export function ReforgerModEdit({ serverId, serverName, activeMods, serverRunning, onSave }: Readonly<ReforgerModEditProps>) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [mods, setMods] = useState<ReforgerMod[]>(activeMods)
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedDetails, setSelectedDetails] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)

  const handleOpen = () => {
    setMods([...activeMods])
    setSearchValue('')
    setSearchResults([])
    setOpen(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)

    // Check for URL pattern (Reforger workshop URL)
    const urlMatch = /\/workshop\/([A-F0-9]{16})-(.+)/i.exec(value)
    if (urlMatch) {
      const id = urlMatch[1]
      const name = urlMatch[2].replaceAll('-', ' ')
      if (!mods.some(m => m.id === id)) {
        setMods(prev => [...prev, { id, name }])
        showToast(`Mod added from URL: ${name}`, 'success')
        setSearchValue('')
      }
      return
    }

    if (value.length < 2) {
      setSearchResults([])
      return
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const data = await WorkshopService.searchReforgerMods(value, 1)
        setSearchResults(Array.isArray(data) ? data : data?.mods || [])
      } catch (e) {
        console.error("Search failed", e)
      } finally {
        setIsSearching(false)
      }
    }, 500)
  }

  const handleAddMod = (mod: any) => {
    if (!mods.some(m => m.id === mod.id)) {
      setMods(prev => [...prev, { id: mod.id, name: mod.name, thumbnail: mod.thumbnail }])
      showToast(`Mod added: ${mod.name}`, 'success')
    }
    setSearchValue('')
    setSearchResults([])
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

  const handleDeleteMod = (id: string) => {
    setMods(prev => prev.filter(m => m.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const server = await ServerService.get(serverId)
      const updatedServer = { ...server, activeMods: mods, id: serverId } as any
      await ServerService.save(updatedServer)
      showToast('Mods configuration saved', 'success')
      setOpen(false)
      onSave()
    } catch (err: any) {
      showToast(err?.message || 'Failed to save mod configuration', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Package className="w-4 h-4 mr-2" />
        Mods ({activeMods.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Reforger Mods — {serverName}</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="border border-dashed border-border/50 rounded-lg p-3 space-y-2 bg-muted/50">
            <p className="text-xs text-muted-foreground/80 font-medium">Search mod by name or paste Workshop URL</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Enter mod name or paste URL..."
                value={searchValue}
                onChange={e => handleSearchChange(e.target.value)}
              />
              {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground/80" />}
            </div>
            {searchResults.length > 0 && (
              <div className="max-h-[200px] overflow-y-auto border border-border rounded-md divide-y divide-border">
                {searchResults.map((result: any) => {
                  const isActive = mods.some(m => m.id === result.id);
                  return (
                    <button
                      type="button"
                      key={result.id}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 transition-colors text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded",
                        isActive ? "opacity-60 cursor-default bg-muted/20" : "hover:bg-muted/50 cursor-pointer"
                      )}
                      onClick={() => !isActive && handleAddMod(result)}
                    >
                      {result.thumbnail && <img src={result.thumbnail} alt="Mod thumbnail" className="w-10 h-10 rounded bg-slate-900 object-cover" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">
                          {result.name}
                        </span>
                        <p className="text-xs text-muted-foreground">{result.id} {result.author ? `• by ${result.author}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {isActive ? (
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20 mr-2">
                            Already active
                          </span>
                        ) : (
                          <Plus className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        <button 
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          onClick={(e) => handleShowDetails(e, result.id)}
                          disabled={fetchingDetails}
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        <a 
                          href={`https://reforger.armaplatform.com/workshop/${result.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="View on Workshop"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Mods Table */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <p className="text-sm font-semibold mb-2">Active Mods ({mods.length})</p>
            <div className="flex-1 overflow-y-auto border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Mod ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-16 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No mods added yet. Search or paste a URL above.
                      </TableCell>
                    </TableRow>
                  ) : mods.map(mod => (
                    <TableRow key={mod.id}>
                      <TableCell>
                        {mod.thumbnail ? (
                          <img src={mod.thumbnail} alt="Mod thumbnail" className="w-8 h-8 rounded bg-slate-900 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                            <Package className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground/80 break-all">{mod.id}</TableCell>
                      <TableCell className="break-words">
                        <a 
                          href={`https://reforger.armaplatform.com/workshop/${mod.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-primary transition-colors font-medium"
                        >
                          {mod.name}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                            onClick={(e) => handleShowDetails(e, mod.id)}
                            disabled={fetchingDetails}
                          >
                            <Info className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors" onClick={() => handleDeleteMod(mod.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || serverRunning}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  )
}
