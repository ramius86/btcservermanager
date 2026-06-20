import { useState, useEffect, useRef } from 'react'
import { FileCode, Save, Plus, Trash2, Edit2, Check, AlertTriangle, List, Copy } from 'lucide-react'
import { CBAPresetService, CBAPresetDto } from '../../../../services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { Select } from '../../../ui/Select'

interface CBATabProps {
  serverId: number
  selectedPresetId: number | null
  onPresetChange: (presetId: number | null) => void
}

export function CBATab({ serverId, selectedPresetId, onPresetChange }: Readonly<CBATabProps>) {
  const [presets, setPresets] = useState<CBAPresetDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPreset, setEditingPreset] = useState<CBAPresetDto | null>(null)
  const [newPresetName, setNewPresetName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }

  const fetchPresets = async () => {
    setLoading(true)
    try {
      const data = await CBAPresetService.getAll()
      setPresets(data || [])
      if (selectedPresetId && data) {
        const selected = data.find(p => p.id === selectedPresetId)
        if (selected) setEditingPreset(selected)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch CBA presets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPresets()
  }, [])

  const handleCreatePreset = async () => {
    if (!newPresetName.trim()) return
    try {
      const newPreset = await CBAPresetService.save({
        name: newPresetName,
        content: '// New CBA Preset\n'
      })
      setPresets([...presets, newPreset])
      setNewPresetName('')
      setIsCreating(false)
      onPresetChange(newPreset.id!)
      setEditingPreset(newPreset)
    } catch (err: any) {
      setError(err.message || 'Failed to create preset')
    }
  }

  const handleSavePreset = async () => {
    if (!editingPreset) return
    try {
      const saved = await CBAPresetService.save(editingPreset)
      setPresets(presets.map(p => p.id === saved.id ? saved : p))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save preset')
    }
  }

  const handleDeletePreset = async (id: number) => {
    if (!confirm('Are you sure you want to delete this preset? This will affect all servers using it.')) return
    try {
      await CBAPresetService.delete(id)
      setPresets(presets.filter(p => p.id !== id))
      if (selectedPresetId === id) {
        onPresetChange(null)
      }
      if (editingPreset?.id === id) {
        setEditingPreset(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete preset')
    }
  }

  const handleSelectPreset = (id: number | null) => {
    onPresetChange(id)
    if (id === null) {
      setEditingPreset(null)
    } else {
      const preset = presets.find(p => p.id === id)
      if (preset) setEditingPreset(preset)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
        <div className="h-1 bg-primary" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <List className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>CBA Settings</CardTitle>
                <CardDescription>Manage global CBA settings presets and assign them to this server.</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cba-preset-select" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Assign Preset to Server</label>
              <Select 
                id="cba-preset-select"
                value={selectedPresetId || ''} 
                onChange={(e) => handleSelectPreset(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">No Preset Assigned</option>
                {presets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
              <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 italic">
                CBA SETTINGS ARE APPLIED VIA A PACKED PBO MOD (@cba_server_{serverId}).
              </p>
            </div>

            <div className="space-y-2 flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 opacity-0" aria-hidden="true">Spacer</span>
              <div className="flex items-center gap-2">
                {isCreating ? (
                  <>
                    <Input 
                      value={newPresetName} 
                      onChange={(e) => setNewPresetName(e.target.value)} 
                      placeholder="Preset Name"
                      className="h-11"
                    />
                    <Button onClick={handleCreatePreset} className="h-11 px-4">
                      <Check className="w-4 h-4 mr-2" /> Create
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCreating(false)} className="h-11 px-4">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsCreating(true)} className="h-11 px-4">
                    <Plus className="w-4 h-4 mr-2" /> Create New Preset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {editingPreset && (
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Editing Preset: {editingPreset.name}</CardTitle>
                  <CardDescription className="text-xs">cba_settings.sqf</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  onClick={handleSelectAll}
                >
                  <Copy className="w-4 h-4 mr-2" /> Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  onClick={() => {
                    const newName = prompt('Enter new name:', editingPreset.name)
                    if (newName && newName !== editingPreset.name) {
                      setEditingPreset({ ...editingPreset, name: newName })
                    }
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Rename
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="h-9"
                  onClick={() => { if (editingPreset.id) handleDeletePreset(editingPreset.id) }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
                <Button 
                  onClick={handleSavePreset} 
                  className="h-9 bg-primary hover:bg-primary/90"
                  disabled={saveSuccess}
                >
                  {saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saveSuccess ? 'Saved' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <textarea
              ref={textareaRef}
              className="w-full h-[500px] bg-background/50 p-6 font-mono text-sm focus:outline-none resize-none no-scrollbar"
              value={editingPreset.content}
              onChange={(e) => setEditingPreset({ ...editingPreset, content: e.target.value })}
              spellCheck={false}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
