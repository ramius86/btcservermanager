import { useEffect, useState } from 'react'
import { ServerService } from '../../../../services/api'
import { useToast } from '../../../ui/Toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { Users, Save, RefreshCw, Trash2 } from 'lucide-react'
import { ConfirmationDialog } from '../../../ui/ConfirmationDialog'

interface CustomNameEntry {
  playerName: string
  customName: string
}

interface ReforgerCustomNamesProps {
  serverId: number
}

export function ReforgerCustomNames({ serverId }: Readonly<ReforgerCustomNamesProps>) {
  const [namesMap, setNamesMap] = useState<Record<string, CustomNameEntry>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchCustomNames = async () => {
    setLoading(true)
    try {
      const data = await ServerService.getCustomNames(serverId)
      setNamesMap(data || {})
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch custom names', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomNames()
  }, [serverId])

  const handleCustomNameChange = (id: string, newCustomName: string) => {
    setNamesMap(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        customName: newCustomName
      }
    }))
  }

  const handleSave = async (mapToSave = namesMap) => {
    setSaving(true)
    try {
      await ServerService.updateCustomNames(serverId, mapToSave)
      showToast('Custom names saved successfully', 'success')
      fetchCustomNames() // Reload to ensure sync
    } catch (err: any) {
      showToast(err.message || 'Failed to save custom names', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return
    const newNamesMap = { ...namesMap }
    delete newNamesMap[deleteTargetId]
    setNamesMap(newNamesMap)
    setDeleteTargetId(null)
    handleSave(newNamesMap) // Automatically save after deletion
  }

  const entries = Object.entries(namesMap)

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-muted-foreground text-sm font-medium animate-pulse">
          Loading custom names...
        </div>
      )
    }

    if (entries.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl bg-muted/10 text-muted-foreground text-sm font-medium">
          No custom names found. The mod creates entries as players join.
        </div>
      )
    }

    return (
      <div className="border border-border/50 rounded-2xl overflow-hidden bg-muted/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 w-[45%]">Player Name</th>
                <th className="px-6 py-4 w-[45%]">Custom Name</th>
                <th className="px-6 py-4 w-[10%] text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {entries.map(([id, data]) => (
                <tr key={id} className="hover:bg-muted/25 transition-colors">
                  <td className="px-6 py-3 font-medium text-foreground">
                    {data.playerName}
                  </td>
                  <td className="px-6 py-3">
                    <Input
                      value={data.customName}
                      onChange={(e) => handleCustomNameChange(id, e.target.value)}
                      className="bg-background border-border/50 focus:border-primary transition-colors h-9"
                      placeholder="Enter custom name..."
                    />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetId(id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-danger hover:bg-danger/10"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
      <div className="h-1 bg-primary" />
      <CardHeader className="pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Custom Player Names</CardTitle>
              <CardDescription className="text-muted-foreground">Manage overridden in-game names for players.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchCustomNames}
              disabled={loading || saving}
              className="h-9 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSave()}
              disabled={loading || saving}
              className="h-9 font-bold uppercase tracking-widest text-[9px] gap-2"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-pulse' : ''}`} />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6 lg:p-8">
        {renderContent()}
      </CardContent>

      <ConfirmationDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Custom Name Entry"
        description={
          deleteTargetId && namesMap[deleteTargetId]
            ? `Are you sure you want to completely remove the entry for "${namesMap[deleteTargetId].playerName}"? This action cannot be undone.`
            : "Are you sure you want to completely remove this entry?"
        }
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        variant="danger"
      />
    </Card>
  )
}
