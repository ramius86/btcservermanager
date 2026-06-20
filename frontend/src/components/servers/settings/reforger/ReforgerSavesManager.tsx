import { useEffect, useState } from 'react'
import { ServerService } from '../../../../services/api'
import { useServerStatus } from '../../../../contexts/ServerStatusContext'
import { useToast } from '../../../ui/Toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Button } from '../../../ui/Button'
import { Trash2, Database, AlertTriangle, RefreshCw } from 'lucide-react'

interface ReforgerSavesManagerProps {
  serverId: number
}

export function ReforgerSavesManager({ serverId }: Readonly<ReforgerSavesManagerProps>) {
  const [saves, setSaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { statuses } = useServerStatus()
  const { showToast } = useToast()

  const isServerRunning = !!statuses[serverId]?.alive

  const fetchSaves = async () => {
    setLoading(true)
    try {
      const data = await ServerService.getReforgerSaves(serverId)
      setSaves(data || [])
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch saved scenarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaves()
  }, [serverId])

  const handleDelete = async (name?: string) => {
    const message = name 
      ? `Are you sure you want to delete the save game "${name}"? This cannot be undone.`
      : `Are you sure you want to delete ALL saved scenarios for this server? This cannot be undone.`;
    
    if (!globalThis.confirm(message)) {
      return
    }

    try {
      await ServerService.deleteReforgerSave(serverId, name)
      showToast(name ? `Saved scenario deleted successfully` : 'All saved scenarios deleted successfully', 'success')
      fetchSaves()
    } catch (err: any) {
      showToast(err.message || 'Failed to delete saved scenarios', 'error')
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-muted-foreground text-sm font-medium animate-pulse">
          Loading saved scenarios...
        </div>
      )
    }

    if (saves.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl bg-muted/10 text-muted-foreground text-sm font-medium">
          No saved scenarios found in this server's profile directory.
        </div>
      )
    }

    return (
      <div className="border border-border/50 rounded-2xl overflow-hidden bg-muted/10 divide-y divide-border/50">
        {saves.map((save) => (
          <div key={save.name} className="flex items-center justify-between p-4 hover:bg-muted/25 transition-colors gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-surface border border-border/50 rounded-lg text-muted-foreground">
                <Database className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{save.name}</p>
                {save.lastModified && (
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mt-0.5">
                    Last Modified: {save.lastModified}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="danger"
              size="icon"
              disabled={isServerRunning}
              onClick={() => handleDelete(save.name)}
              className="h-8 w-8 shrink-0 hover:bg-destructive/20 text-destructive border border-destructive/20 bg-destructive/5"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
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
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Saved Scenarios</CardTitle>
              <CardDescription className="text-muted-foreground">Manage persistent savegames and scenario checkpoints generated at runtime.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchSaves}
              disabled={loading}
              className="h-9 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={loading || isServerRunning || saves.length === 0}
              onClick={() => handleDelete()}
              className="h-9 shadow-lg shadow-destructive/10 font-bold uppercase tracking-widest text-[9px] gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All Saves
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {isServerRunning && (
          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 text-warning rounded-xl text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Server is currently running</p>
              <p className="mt-1 opacity-90">To prevent data corruption and file locks, you must stop the server before deleting saved scenarios.</p>
            </div>
          </div>
        )}

        {!isServerRunning && saves.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 text-primary-light rounded-xl text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Irreversible Action</p>
              <p className="mt-1 opacity-90">Deleting scenarios will delete the server state and progress for that scenario. This action is final and cannot be recovered.</p>
            </div>
          </div>
        )}

        {renderContent()}
      </CardContent>
    </Card>
  )
}
