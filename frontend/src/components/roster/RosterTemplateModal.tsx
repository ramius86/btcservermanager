import React, { useState } from 'react'
import { Bookmark, Save, Trash2, FolderOpen, Plus, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import type { RosterSquad, RosterTemplate } from '../../services/api'
import { DiscordService } from '../../services/api'
import { generateId } from './rosterUtils'

interface RosterTemplateModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly currentSquads: RosterSquad[]
  readonly currentGameType?: string
  readonly onLoadTemplate: (squads: RosterSquad[]) => void
}

export function RosterTemplateModal({
  isOpen,
  onClose,
  currentSquads,
  currentGameType = 'all',
  onLoadTemplate,
}: RosterTemplateModalProps) {
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'load' | 'save'>('load')
  const [templates, setTemplates] = useState<RosterTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Save form state
  const [templateName, setTemplateName] = useState('')
  const [selectedGameType, setSelectedGameType] = useState(currentGameType || 'all')

  React.useEffect(() => {
    if (isOpen) {
      loadTemplates()
    }
  }, [isOpen])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await DiscordService.getRosterTemplates()
      setTemplates(data || [])
      if (!data || data.length === 0) {
        setActiveTab('save')
      }
    } catch (err: any) {
      console.error(err)
      showToast('Failed to load templates: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!templateName.trim()) {
      showToast('Please enter a template name', 'error')
      return
    }

    if (currentSquads.length === 0) {
      showToast('Cannot save an empty roster layout', 'error')
      return
    }

    // Clean squads of player assignments so the template only preserves structure & roles
    const cleanStructure = currentSquads.map(s => ({
      id: generateId('squad'),
      name: s.name,
      slots: s.slots.map(slot => ({
        id: generateId('slot'),
        role: slot.role,
        assignedPlayerName: '',
        assignedUserId: '',
        isMaybe: false,
        isGuest: false,
      })),
    }))

    try {
      setSaving(true)
      const created = await DiscordService.saveRosterTemplate({
        name: templateName.trim(),
        gameType: selectedGameType,
        structure: JSON.stringify(cleanStructure),
      })
      showToast('Template saved successfully', 'success')
      setTemplates(prev => [...prev, created])
      setTemplateName('')
      setActiveTab('load')
    } catch (err: any) {
      showToast('Failed to save template: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await DiscordService.deleteRosterTemplate(id)
      setTemplates(prev => prev.filter(t => t.id !== id))
      showToast('Template deleted', 'success')
    } catch (err: any) {
      showToast('Failed to delete template: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleApply = (tmpl: RosterTemplate) => {
    try {
      const parsed = JSON.parse(tmpl.structure) as RosterSquad[]
      // Re-generate fresh IDs for this session
      const freshSquads: RosterSquad[] = parsed.map(s => ({
        id: generateId('squad'),
        name: s.name,
        slots: s.slots.map(slot => ({
          id: generateId('slot'),
          role: slot.role,
          assignedPlayerName: '',
          assignedUserId: '',
          isMaybe: false,
          isGuest: false,
        })),
      }))
      onLoadTemplate(freshSquads)
      showToast(`Applied template: ${tmpl.name}`, 'success')
      onClose()
    } catch (err: unknown) {
      console.error('Failed to parse template structure', err)
      showToast('Failed to parse template structure', 'error')
    }
  }

  const renderTemplateList = () => {
    if (loading) {
      return (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs">Loading templates...</span>
        </div>
      )
    }

    if (templates.length === 0) {
      return (
        <div className="py-12 text-center border border-dashed border-border rounded-xl bg-surface/30">
          <Bookmark className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm font-semibold text-foreground">No templates saved yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Create your squads on the board and click "Save Current as Template" to build your custom library.
          </p>
        </div>
      )
    }

    return templates.map(tmpl => {
      let squadCount = 0
      let slotCount = 0
      try {
        const parsed = JSON.parse(tmpl.structure) as RosterSquad[]
        squadCount = parsed.length
        slotCount = parsed.reduce((acc, sq) => acc + (sq.slots?.length || 0), 0)
      } catch (err: unknown) {
        console.warn('Failed to parse template structure counts', err)
      }

      return (
        <div
          key={tmpl.id}
          className="p-3.5 rounded-lg border border-border bg-surface/40 hover:border-primary/30 transition-colors flex items-center justify-between gap-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">{tmpl.name}</span>
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 px-1.5">
                {tmpl.gameType}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {squadCount} {squadCount === 1 ? 'squad' : 'squads'} • {slotCount} slots
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleApply(tmpl)}
              className="h-8 text-xs font-semibold"
            >
              Load
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(tmpl.id)}
              disabled={deletingId === tmpl.id}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Delete template"
            >
              {deletingId === tmpl.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>
      )
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] max-h-[85vh] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            Squad Templates
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Save your current squad structure as a custom template, or load an existing one.
          </p>

          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              size="sm"
              variant={activeTab === 'load' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('load')}
              className="text-xs font-semibold h-8"
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
              Saved Templates ({templates.length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === 'save' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('save')}
              className="text-xs font-semibold h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Save Current as Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'load' ? (
            <div className="space-y-3">
              {renderTemplateList()}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="template-name-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Template Name
                </label>
                <Input
                  id="template-name-input"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="e.g. Reforger GM + 3 Fireteams"
                  className="h-9 text-xs bg-surface border-border"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="template-game-type-select" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Game Type
                </label>
                <select
                  id="template-game-type-select"
                  value={selectedGameType}
                  onChange={e => setSelectedGameType(e.target.value)}
                  className="w-full flex h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Games</option>
                  <option value="ArmA III">ArmA III</option>
                  <option value="Arma Reforger">Arma Reforger</option>
                </select>
              </div>

              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Preview Structure to Save
                </span>
                <p className="text-xs text-foreground font-medium">
                  {currentSquads.length} {currentSquads.length === 1 ? 'squad' : 'squads'} with{' '}
                  {currentSquads.reduce((acc, s) => acc + s.slots.length, 0)} slots.
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Player assignments will be cleared so the template preserves only the squad callsigns and role composition.
                </p>
              </div>

              <Button type="submit" disabled={saving} className="w-full h-9 text-xs font-semibold">
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Template
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <DialogFooter className="p-3 border-t border-border bg-surface/40">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
