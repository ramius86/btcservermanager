import React from 'react'
import { Clock, Database, Save, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface LogRetentionSettings {
  logRetentionDays: number
  logMaxTotalSizeMB: number
}

interface LogRetentionFormProps {
  settings: LogRetentionSettings
  onSave: (settings: LogRetentionSettings) => Promise<void>
}

export function LogRetentionForm({ settings, onSave }: Readonly<LogRetentionFormProps>) {
  const [localSettings, setLocalSettings] = React.useState(settings)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(localSettings)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-surface/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-md font-bold">Log Retention Policy</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Automatic Cleanup Rules
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Max Age (Days)
              </label>
              <div className="relative">
                <Input 
                  type="number"
                  min="0"
                  className="bg-surface border-border focus:border-primary/50 h-10 text-sm pr-12"
                  value={localSettings.logRetentionDays} 
                  onChange={e => setLocalSettings({ ...localSettings, logRetentionDays: Number.parseInt(e.target.value, 10) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Days</span>
              </div>
              <p className="text-[9px] text-muted-foreground italic px-1">Set to 0 to disable age-based cleanup.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Database className="w-3 h-3" />
                Max Total Size (MB)
              </label>
              <div className="relative">
                <Input 
                  type="number"
                  min="0"
                  className="bg-surface border-border focus:border-primary/50 h-10 text-sm pr-12"
                  value={localSettings.logMaxTotalSizeMB} 
                  onChange={e => setLocalSettings({ ...localSettings, logMaxTotalSizeMB: Number.parseInt(e.target.value, 10) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">MB</span>
              </div>
              <p className="text-[9px] text-muted-foreground italic px-1">Deletes oldest files if directory exceeds this size.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 bg-amber-500/5 rounded-lg border border-amber-500/10 max-w-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-normal">
                Files deleted by these rules cannot be recovered.
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save Policy
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
