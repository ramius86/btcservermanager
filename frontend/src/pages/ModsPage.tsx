/**
 * ModsPage Component
 * Main orchestrator for mod and preset management.
 * Logic: State management, API synchronization, filtering/sorting, and dialog coordination.
 * Features: ARMA3/DayZ filtering, Workshop search integration, and preset CRUD.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Search, Plus, AlertCircle, RefreshCw, CheckCircle, AlertTriangle, Download } from 'lucide-react'
import { Button, cn } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { WorkshopService, ModPresetService } from '../services/api'
import { Badge } from '../components/ui/Badge'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog'
import { useToast } from '../components/ui/Toast'
import { useWebSocket } from '../contexts/WebSocketContext'

// Modular Components
import { ModCard } from '../components/mods/ModCard'
import { ModPresetCard } from '../components/mods/ModPresetCard'
import { SteamSearchDialog } from '../components/mods/SteamSearchDialog'
import { ModPresetEditDialog } from '../components/mods/ModPresetEditDialog'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { Virtuoso } from 'react-virtuoso'

function applyInstallProgress(mods: any[], itemId: number, status: string, loadData: () => void) {
  return mods.map(mod => {
    if (mod.id === itemId) {
      if (status === 'FINISHED') {
        setTimeout(loadData, 1000)
      }
      return { ...mod, installationStatus: status }
    }
    return mod
  })
}

function applyMetadataUpdated(mods: any[], updatedMod: any) {
  return mods.map(mod => mod.id === updatedMod.id ? { ...mod, ...updatedMod } : mod)
}

function applyModDeleted(mods: any[], id: number) {
  return mods.filter(mod => mod.id !== id)
}

function useModsData(filter: string) {
  const { showToast } = useToast()
  const [mods, setMods] = useState<any[]>([])
  const [presets, setPresets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { subscribe } = useWebSocket()

  const loadData = useCallback((background = false) => {
    if (!background) setLoading(true)
    Promise.all([
      WorkshopService.getAll(filter),
      ModPresetService.getAll(filter)
    ]).then(([modsData, presetsData]) => {
      setMods(Array.isArray(modsData) ? modsData : (modsData as any).workshopMods || [])
      setPresets(Array.isArray(presetsData) ? presetsData : (presetsData as any).presets || [])
    }).catch((err) => {
      console.error(err)
      showToast("Failed to load mods/presets", "error")
    }).finally(() => {
      if (!background) setLoading(false)
    })
  }, [filter, showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const triggerLoadData = useCallback(() => {
    loadData(true)
  }, [loadData])

  const handleInstallProgress = useCallback((e: any) => {
    const { itemId, status } = e.payload
    setMods(prev => applyInstallProgress(prev, itemId, status, triggerLoadData))
  }, [triggerLoadData])

  const handleMetadataUpdated = useCallback((e: any) => {
    setMods(prev => applyMetadataUpdated(prev, e.payload))
  }, [])

  const handleModDeleted = useCallback((e: any) => {
    setMods(prev => applyModDeleted(prev, e.payload.id))
  }, [])

  useEffect(() => {
    const unsub = subscribe('install_progress', handleInstallProgress)
    const unsubMetadata = subscribe('mod_metadata_updated', handleMetadataUpdated)
    const unsubDeleted = subscribe('mod_deleted', handleModDeleted)

    return () => {
      unsub()
      unsubMetadata()
      unsubDeleted()
    }
  }, [subscribe, handleInstallProgress, handleMetadataUpdated, handleModDeleted])

  return { mods, setMods, presets, setPresets, loading, setLoading, loadData }
}

function useSteamSearch(filter: string) {
  const { showToast } = useToast()
  const [steamSearchQuery, setSteamSearchQuery] = useState('')
  const [steamSearchResults, setSteamSearchResults] = useState<any[]>([])
  const [steamSearchTotal, setSteamSearchTotal] = useState(0)
  const [steamSearchPage, setSteamSearchPage] = useState(1)
  const [isSearchingSteam, setIsSearchingSteam] = useState(false)
  const [steamSearchDialogOpen, setSteamSearchDialogOpen] = useState(false)
  const [steamSearchViewMode, setSteamSearchViewMode] = useState<'grid' | 'list'>('grid')

  const handleSteamSearch = async (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return
    if (!steamSearchQuery.trim()) return

    setIsSearchingSteam(true)
    setSteamSearchDialogOpen(true)
    setSteamSearchResults([])
    setSteamSearchTotal(0)
    setSteamSearchPage(1)

    try {
      const appId = filter === 'ARMA3' ? 107410 : 221100
      const response = await WorkshopService.searchSteamMods(steamSearchQuery, appId, 1)
      setSteamSearchResults(response.mods || [])
      setSteamSearchTotal(response.total || 0)
    } catch (err) {
      console.error(err)
      showToast("Steam Workshop search failed", "error")
    } finally {
      setIsSearchingSteam(false)
    }
  }

  const handleLoadMoreSteam = async () => {
    if (isSearchingSteam || steamSearchResults.length >= steamSearchTotal) return

    const nextPage = steamSearchPage + 1
    setIsSearchingSteam(true)

    try {
      const appId = filter === 'ARMA3' ? 107410 : 221100
      const response = await WorkshopService.searchSteamMods(steamSearchQuery, appId, nextPage)
      setSteamSearchResults(prev => [...prev, ...(response.mods || [])])
      setSteamSearchPage(nextPage)
    } catch (err) {
      console.error(err)
      showToast("Failed to load more results", "error")
    } finally {
      setIsSearchingSteam(false)
    }
  }

  return {
    steamSearchQuery, setSteamSearchQuery,
    steamSearchResults, setSteamSearchResults,
    steamSearchTotal, setSteamSearchTotal,
    steamSearchPage, setSteamSearchPage,
    isSearchingSteam, setIsSearchingSteam,
    steamSearchDialogOpen, setSteamSearchDialogOpen,
    steamSearchViewMode, setSteamSearchViewMode,
    handleSteamSearch, handleLoadMoreSteam
  }
}

function useFilteredMods(mods: any[], searchQuery: string, sortBy: string) {
  const filtered = mods.filter(mod => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (mod.name?.toLowerCase().includes(q)) ||
      (String(mod.id)?.includes(q))
    )
  })

  return filtered.sort((a, b) => {
    if (sortBy === 'recent') {
      const dateA = a.installedAt ? new Date(a.installedAt).getTime() : 0
      const dateB = b.installedAt ? new Date(b.installedAt).getTime() : 0
      return dateB - dateA
    }
    if (sortBy === 'updated') {
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0
      return dateB - dateA
    }
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    if (sortBy === 'id') return String(a.id).localeCompare(String(b.id))
    if (sortBy === 'size') return (b.fileSize || 0) - (a.fileSize || 0)
    return 0
  })
}

function useProgressTracking(currentInProgress: number) {
  const [peakInProgress, setPeakInProgress] = useState(0)

  useEffect(() => {
    if (currentInProgress > peakInProgress) {
      setPeakInProgress(currentInProgress)
    } else if (currentInProgress === 0 && peakInProgress > 0) {
      setPeakInProgress(0)
    }
  }, [currentInProgress, peakInProgress])

  return { peakInProgress, setPeakInProgress }
}

function usePresetOperations(filter: string, loadData: () => void) {
  const { showToast } = useToast()
  const [createPresetOpen, setCreatePresetOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [editPresetOpen, setEditPresetOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<any>(null)
  const [editPresetMods, setEditPresetMods] = useState<number[]>([])
  const [presetToDelete, setPresetToDelete] = useState<any>(null)

  const handleCreatePreset = async () => {
    if (!newPresetName.trim()) return
    try {
      await ModPresetService.create({ name: newPresetName, serverType: filter })
      showToast(`Preset '${newPresetName}' created.`, "success")
      setCreatePresetOpen(false)
      setNewPresetName('')
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to create preset", "error")
    }
  }

  const handleEditPreset = (preset: any) => {
    setEditingPreset(preset)
    setEditPresetMods((preset.mods || []).map((m: any) => m.id || m))
    setEditPresetOpen(true)
  }

  const handleChangeModInPreset = (id: number, action: 'add' | 'remove') => {
    if (action === 'add') {
      setEditPresetMods(prev => [...prev, id])
    } else {
      setEditPresetMods(prev => prev.filter(mid => mid !== id))
    }
  }

  const handleSavePresetEdit = async () => {
    try {
      await ModPresetService.updateMods(editingPreset.id, editPresetMods)
      showToast(`Preset '${editingPreset.name}' updated.`, "success")
      setEditPresetOpen(false)
      setEditingPreset(null)
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to update preset", "error")
    }
  }

  const handleDeletePreset = async () => {
    if (!presetToDelete) return
    try {
      await ModPresetService.delete(presetToDelete.id)
      showToast(`Preset '${presetToDelete.name}' deleted.`, "success")
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to delete preset", "error")
    } finally {
      setPresetToDelete(null)
    }
  }

  const handleExportPreset = async (preset: any) => {
    try {
      const blob = await ModPresetService.export(preset.id);
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${preset.name}.html`
      a.click()
      URL.revokeObjectURL(url)
      showToast(`Preset '${preset.name}' exported successfully.`, "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to export preset", "error")
    }
  }

  return {
    createPresetOpen,
    setCreatePresetOpen,
    newPresetName,
    setNewPresetName,
    editPresetOpen,
    setEditPresetOpen,
    editingPreset,
    setEditingPreset,
    editPresetMods,
    setEditPresetMods,
    presetToDelete,
    setPresetToDelete,
    handleCreatePreset,
    handleEditPreset,
    handleChangeModInPreset,
    handleSavePresetEdit,
    handleDeletePreset,
    handleExportPreset
  }
}

interface ModItemProps {
  mod: any
  onUpdate: (mod: any) => void
  onDelete: (mod: any) => void
  onToggleServerOnly: (mod: any) => void
  isUpdating: boolean
}

const ModItem = ({ mod, onUpdate, onDelete, onToggleServerOnly, isUpdating }: ModItemProps) => (
  <div className="pb-3">
    <ModCard
      mod={mod}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onToggleServerOnly={onToggleServerOnly}
      isUpdating={isUpdating}
    />
  </div>
)

const gameInfo: Record<string, { name: string, icon: string }> = {
  'ARMA3': { name: 'Arma 3', icon: '/arma3.png' },
  'DAYZ': { name: 'DayZ', icon: '/dayz.png' },
  'DAYZ_EXP': { name: 'DayZ Experimental', icon: '/dayzexp.png' },
  'REFORGER': { name: 'Arma Reforger', icon: '/reforger.png' },
}

const ModsDashboardStatusPanel = ({ updateMods, currentInProgress, errorMods, downloadingMods, updatingMods, peakInProgress }: any) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-2 bg-surface-elevated/40 border border-border rounded-xl shadow-sm">
      <div className="flex flex-wrap items-center gap-6">
        {updateMods.length === 0 && currentInProgress === 0 && errorMods.length === 0 ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">All mods updated</span>
          </div>
        ) : (
          <>
            {updateMods.length > 0 && (
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{updateMods.length} mod{updateMods.length === 1 ? '' : 's'} need update</span>
              </div>
            )}
            {downloadingMods.length > 0 && (
              <div className="flex items-center gap-2 text-blue-400">
                <Download className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {downloadingMods.length} mod{downloadingMods.length === 1 ? '' : 's'} downloading
                </span>
              </div>
            )}
            {updatingMods.length > 0 && (
              <div className="flex items-center gap-2 text-primary">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {updatingMods.length} mod{updatingMods.length === 1 ? '' : 's'} updating
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {currentInProgress > 0 && peakInProgress > 0 && (
        <div className="flex items-center gap-3 shrink-0 bg-surface-elevated/60 px-4 py-2 rounded-lg border border-border">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Progress</span>
          <span className="text-sm font-bold text-foreground font-mono">
            {peakInProgress - currentInProgress + 1} / {peakInProgress}
          </span>
        </div>
      )}
    </div>
  )
}

const UpdateWarningAlert = ({ updateMods, handleUpdatePending, updatingAll }: any) => {
  if (updateMods.length === 0) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-amber-900/15 border border-amber-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-bold text-amber-500">
          {updateMods.length} mod{updateMods.length === 1 ? '' : 's'} have updates available
        </p>
        <p className="mt-1 text-xs text-amber-500/80">
          Click 'Update Pending' to start the installation process. Until then, the server will continue to use the currently installed versions.
        </p>
      </div>
      <Button size="sm" onClick={handleUpdatePending} disabled={updatingAll} className="shrink-0 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 hover:text-amber-400 border border-amber-500/30">
        <RefreshCw className={cn("w-3.5 h-3.5 mr-2", updatingAll && "animate-spin")} />
        Update Pending
      </Button>
    </div>
  )
}

const ErrorModsAlert = ({ errorMods }: any) => {
  if (errorMods.length === 0) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-red-900/15 border border-red-500/30 rounded-lg">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-red-400">Some mods could not be installed</p>
        <ul className="mt-1 text-xs text-red-300/80 list-disc list-inside">
          {errorMods.map((m: any) => (
            <li key={m.id}>{m.name || m.id}: {m.errorStatus || 'Unknown error'}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ModsPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('ARMA3')
  const { mods, presets, loading, setLoading, loadData } = useModsData(filter)
  const steamSearch = useSteamSearch(filter)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name') // name, id, size, date

  const [scrollParent, setScrollParent] = useState<HTMLElement | undefined>(undefined)

  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (mainEl) {
      setScrollParent(mainEl)
    }
  }, [])

  const [modToDelete, setModToDelete] = useState<any>(null)

  // Install Mod Dialog
  const [installDialogOpen, setInstallDialogOpen] = useState(false)
  const [installModId, setInstallModId] = useState('')

  const {
    createPresetOpen,
    setCreatePresetOpen,
    newPresetName,
    setNewPresetName,
    editPresetOpen,
    setEditPresetOpen,
    editingPreset,
    setEditingPreset,
    editPresetMods,
    presetToDelete,
    setPresetToDelete,
    handleCreatePreset,
    handleEditPreset,
    handleChangeModInPreset,
    handleSavePresetEdit,
    handleDeletePreset,
    handleExportPreset
  } = usePresetOperations(filter, loadData)

  const [updatingAll, setUpdatingAll] = useState(false)
  const [updatingModIds, setUpdatingModIds] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter mods by search query
  const filteredMods = useFilteredMods(mods, searchQuery, sortBy)

  // Mods with errors
  const errorMods = mods.filter(m => m.installationStatus === 'ERROR')

  // Mods that need update
  const updateMods = mods.filter(m => m.needsUpdate === true && m.installationStatus !== 'INSTALLATION_IN_PROGRESS')

  // Mods actively installing
  const updatingMods = mods.filter(m => m.installationStatus === 'INSTALLATION_IN_PROGRESS' && (m.needsUpdate || m.fileSize > 0))
  const downloadingMods = mods.filter(m => m.installationStatus === 'INSTALLATION_IN_PROGRESS' && !m.needsUpdate && !m.fileSize)

  const currentInProgress = updatingMods.length + downloadingMods.length

  const { peakInProgress } = useProgressTracking(currentInProgress)

  const handleInstallMod = async () => {
    if (!installModId.trim()) return
    try {
      await WorkshopService.install([{ id: Number(installModId), serverType: filter } as any])
      showToast("Installation started. Check dashboard for progress.", "success")
      setInstallDialogOpen(false)
      setInstallModId('')
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to queue installation", "error")
    }
  }

  const handleDeleteMod = async () => {
    if (!modToDelete) return
    try {
      await WorkshopService.delete(modToDelete.id, filter)
      showToast(`Mod '${modToDelete.name}' deleted.`, "success")
      loadData()
    } catch (err) {
      let msg = "Failed to delete mod";
      if (err instanceof Error) {
        msg = err.message.replace(/^API Error:\s*\d+\s+[a-z ]+\s*/i, '');
      }
      console.error(err)
      showToast(msg, "error")
    } finally {
      setModToDelete(null)
    }
  }

  const handleToggleServerOnly = async (mod: any) => {
    try {
      await WorkshopService.setServerOnly(mod.id, !mod.serverOnly)
      showToast(`Mod '${mod.name}' server-only ${mod.serverOnly ? 'disabled' : 'enabled'}.`, "success")
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to update mod", "error")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await WorkshopService.importFromHtml(file, filter)
      showToast("HTML Mod list imported. Installation queued.", "success")
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to import mods", "error")
    }
  }

  const onDropFiles = async (files: FileList) => {
    const file = files[0]
    if (!file.name.endsWith('.html')) {
      showToast("Only HTML mod preset files (.html) are accepted.", "error")
      return
    }

    setLoading(true)
    try {
      await WorkshopService.importFromHtml(file, filter)
      showToast("HTML Mod list imported successfully.", "success")
      loadData()
    } catch (err) {
      console.error("Preset import failed", err)
      showToast("Failed to import mod preset", "error")
    } finally {
      setLoading(false)
    }
  }

  const { isDragging, dragProps } = useDragAndDrop(onDropFiles)

  const handleUpdateAll = async () => {
    setUpdatingAll(true)
    try {
      await WorkshopService.updateAll()
      showToast("All mods update check started.", "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to update all mods", "error")
    } finally {
      setUpdatingAll(false)
    }
  }

  const handleUpdatePending = async () => {
    setUpdatingAll(true)
    try {
      await WorkshopService.install(updateMods)
      showToast(`Started updating ${updateMods.length} mods.`, "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to start updates", "error")
    } finally {
      setUpdatingAll(false)
    }
  }

  const handleUpdateMod = async (mod: any) => {
    setUpdatingModIds(prev => [...prev, mod.id])
    try {
      await WorkshopService.install([mod])
      showToast(`Update started for '${mod.name}'.`, "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to start update", "error")
    } finally {
      setUpdatingModIds(prev => prev.filter(id => id !== mod.id))
    }
  }

  const handleInstallFromSteam = async (mod: any) => {
    try {
      await WorkshopService.install([{ id: mod.id, name: mod.name, serverType: filter } as any])
      showToast(`Installation of '${mod.name}' started.`, "success")
      loadData()
    } catch (err) {
      console.error(err)
      showToast("Failed to queue installation", "error")
    }
  }

  const renderItem = useCallback((_: number, mod: any) => (
    <ModItem
      mod={mod}
      onUpdate={handleUpdateMod}
      onDelete={setModToDelete}
      onToggleServerOnly={handleToggleServerOnly}
      isUpdating={updatingModIds.includes(mod.id)}
    />
  ), [handleUpdateMod, setModToDelete, handleToggleServerOnly, updatingModIds])

  return (
    <div
      className="space-y-10 max-w-7xl mx-auto py-8 px-6 relative min-h-[500px]"
      {...dragProps}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center z-50 transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col items-center gap-4 p-8 bg-surface-elevated/80 border border-border/50 rounded-xl shadow-2xl max-w-md text-center pointer-events-none transform scale-105 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-bounce">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Import Preset</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Drop your <span className="font-semibold text-primary font-mono">.html</span> preset file here to import mods for <span className="font-bold text-foreground">{gameInfo[filter]?.name || filter}</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".html"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-surface-elevated/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-border shadow-xl">
            <img
              src={gameInfo[filter]?.icon || '/btclogo.png'}
              alt={filter}
              className="h-10 w-10 object-contain dark:invert-0 invert"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">
              Mods <span className="text-primary">{gameInfo[filter]?.name || filter}</span>
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button
            variant="outline"
            className="border-border bg-surface-elevated/50 hover:bg-surface h-10 px-4 text-[10px] font-bold uppercase tracking-widest"
            onClick={() => {
              const types = ['ARMA3', 'DAYZ']
              const nextIndex = (types.indexOf(filter) + 1) % types.length
              setFilter(types[nextIndex])
            }}
          >
            Switch to {filter === 'ARMA3' ? 'DayZ' : 'Arma 3'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleUpdateAll}
            disabled={updatingAll}
            className="bg-surface-elevated border border-border hover:bg-accent"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", updatingAll && "animate-spin")} />
            Update All
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="bg-surface-elevated border border-border hover:bg-accent">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setInstallDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Install Mod
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mods" className="w-full min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-surface-elevated/50 p-1 border border-border rounded-lg w-full sm:w-fit flex">
            <TabsTrigger value="mods" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Workshop Mods</TabsTrigger>
            <TabsTrigger value="presets" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Presets</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-surface-elevated/50 border-border focus:border-primary/50 h-11 text-sm shadow-inner"
              placeholder="Search Steam Workshop (Name or ID)..."
              value={steamSearch.steamSearchQuery}
              onChange={e => steamSearch.setSteamSearchQuery(e.target.value)}
              onKeyDown={steamSearch.handleSteamSearch}
            />
            {steamSearch.steamSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10"
                onClick={() => steamSearch.handleSteamSearch()}
              >
                Search
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Status Panel */}
        <ModsDashboardStatusPanel
          updateMods={updateMods}
          currentInProgress={currentInProgress}
          errorMods={errorMods}
          downloadingMods={downloadingMods}
          updatingMods={updatingMods}
          peakInProgress={peakInProgress}
        />

        <TabsContent value="mods" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-elevated/20 p-4 rounded-xl border border-border/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter installed mods..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-surface border-border"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface border border-border px-3 h-10 rounded-lg">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sort by</span>
                <select
                  className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer w-32"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="name">NAME</option>
                  <option value="id">ID</option>
                  <option value="size">SIZE</option>
                  <option value="recent">RECENTLY ADDED</option>
                  <option value="updated">RECENTLY UPDATED</option>
                </select>
              </div>

              <Badge variant="secondary" className="h-10 px-4 text-[10px] uppercase font-bold tracking-widest bg-surface border border-border">
                {filteredMods.length} RESULTS
              </Badge>
            </div>
          </div>

          {/* Warning Alert for Updates */}
          <UpdateWarningAlert
            updateMods={updateMods}
            handleUpdatePending={handleUpdatePending}
            updatingAll={updatingAll}
          />

          {/* Error Alert */}
          <ErrorModsAlert errorMods={errorMods} />

          {loading && (
            <div className="text-center py-10 text-muted-foreground">Loading mods...</div>
          )}

          {!loading && filteredMods.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-lg">
              {searchQuery ? `No mods match "${searchQuery}".` : `No mods found for ${filter}.`}
            </div>
          )}

          {!loading && filteredMods.length > 0 && (
            <Virtuoso
              customScrollParent={scrollParent || undefined}
              data={filteredMods}
              itemContent={renderItem}
            />
          )}
        </TabsContent>

        <TabsContent value="presets" className="space-y-6 pt-6">
          <div className="flex justify-end">
            <Button onClick={() => setCreatePresetOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Preset
            </Button>
          </div>
          {loading && (
            <div className="text-center py-20 text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Loading manifest...</div>
          )}

          {!loading && (Array.isArray(presets) ? presets : []).length === 0 && (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg bg-surface/30">
              <p className="font-bold uppercase tracking-widest text-[10px]">No presets discovered for {filter}</p>
            </div>
          )}

          {!loading && (Array.isArray(presets) ? presets : []).length > 0 && (
            <div className="flex flex-col gap-3">
              {(Array.isArray(presets) ? presets : []).map(preset => (
                <ModPresetCard
                  key={preset.id}
                  preset={preset}
                  onEdit={handleEditPreset}
                  onExport={handleExportPreset}
                  onDelete={setPresetToDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Standard Dialogs */}
      <Dialog open={installDialogOpen} onOpenChange={setInstallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Workshop Mod</DialogTitle>
            <DialogDescription>
              Enter the Steam Workshop Mod ID to install for {filter}.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g. 463939057"
            value={installModId}
            onChange={e => setInstallModId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInstallMod()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setInstallDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInstallMod} disabled={!installModId.trim()}>Install</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createPresetOpen} onOpenChange={setCreatePresetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Preset</DialogTitle>
            <DialogDescription>
              Create a new mod preset for {filter}. You can add mods to it after creation.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Preset name"
            value={newPresetName}
            onChange={e => setNewPresetName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreatePreset()}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePresetOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePreset} disabled={!newPresetName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!modToDelete}
        onOpenChange={(open) => !open && setModToDelete(null)}
        title="Delete Mod"
        description={`Are you sure you want to delete '${modToDelete?.name}'? This will remove files from disk.`}
        onConfirm={handleDeleteMod}
        confirmLabel="Delete Mod"
        variant="danger"
      />

      <ConfirmationDialog
        open={!!presetToDelete}
        onOpenChange={(open) => !open && setPresetToDelete(null)}
        title="Delete Preset"
        description={`Are you sure you want to delete preset '${presetToDelete?.name}'?`}
        onConfirm={handleDeletePreset}
        confirmLabel="Delete Preset"
        variant="danger"
      />

      {/* Modular Dialogs */}
      <ModPresetEditDialog
        open={editPresetOpen}
        onOpenChange={(o) => { if (!o) { setEditPresetOpen(false); setEditingPreset(null) } }}
        presetName={editingPreset?.name || ''}
        mods={mods}
        selectedModIds={editPresetMods}
        onChangeMod={handleChangeModInPreset}
        onSave={handleSavePresetEdit}
        filter={filter}
      />

      <SteamSearchDialog
        open={steamSearch.steamSearchDialogOpen}
        onOpenChange={steamSearch.setSteamSearchDialogOpen}
        filter={filter}
        searchQuery={steamSearch.steamSearchQuery}
        onSearchQueryChange={steamSearch.setSteamSearchQuery}
        onSearch={steamSearch.handleSteamSearch}
        isSearching={steamSearch.isSearchingSteam}
        results={steamSearch.steamSearchResults}
        totalResults={steamSearch.steamSearchTotal}
        onLoadMore={steamSearch.handleLoadMoreSteam}
        installedMods={mods}
        viewMode={steamSearch.steamSearchViewMode}
        onViewModeChange={steamSearch.setSteamSearchViewMode}
        onInstall={handleInstallFromSteam}
      />
    </div>
  )
}
