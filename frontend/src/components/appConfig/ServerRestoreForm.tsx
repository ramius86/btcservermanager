import React from 'react'
import { RotateCcw, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'

interface ServerRestoreSettings {
  restoreServersOnStart: boolean
}

interface ServerRestoreFormProps {
  settings: ServerRestoreSettings
  onSave: (settings: ServerRestoreSettings) => Promise<void>
}

export function ServerRestoreForm({ settings, onSave }: Readonly<ServerRestoreFormProps>) {
  const [enabled, setEnabled] = React.useState(settings.restoreServersOnStart ?? true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setEnabled(settings.restoreServersOnStart ?? true)
  }, [settings])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave({ restoreServersOnStart: enabled })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-surface/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-md font-bold">Startup Behaviour</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Server Restore
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1 max-w-lg">
              <p className="text-sm font-bold text-foreground">Restore servers on startup</p>
              <p className="text-xs text-muted-foreground">
                Start again the servers that were running before the manager stopped. Up to three attempts per
                server; a server that keeps failing stays stopped and is reported. Applies from the next manager
                start.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save Behaviour
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
