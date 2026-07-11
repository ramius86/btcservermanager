import React from 'react'
import { Clock, MessageSquare, Save, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'

interface EventsSettings {
  discordReminderHours: number
  discordReminderMessage: string
}

interface EventsSettingsFormProps {
  settings: EventsSettings
  onSave: (settings: EventsSettings) => Promise<void>
}

export function EventsSettingsForm({ settings, onSave }: Readonly<EventsSettingsFormProps>) {
  const [localSettings, setLocalSettings] = React.useState(settings)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-md font-bold">Event Reminders</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              No Response Reminders
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
                Hours Before Event
              </label>
              <div className="relative">
                <Input 
                  type="number"
                  min="0"
                  className="bg-surface border-border focus:border-primary/50 h-10 text-sm pr-12"
                  value={localSettings.discordReminderHours} 
                  onChange={e => setLocalSettings({ ...localSettings, discordReminderHours: Number.parseInt(e.target.value, 10) || 0 })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Hours</span>
              </div>
              <p className="text-[9px] text-muted-foreground italic px-1">Set to 0 to disable automatic reminders.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Custom Reminder Message
            </label>
            <Textarea
              className="bg-surface border-border focus:border-primary/50 text-sm min-h-[100px]"
              placeholder="Reminder: Please update your RSVP for the upcoming event!"
              value={localSettings.discordReminderMessage}
              onChange={e => setLocalSettings({ ...localSettings, discordReminderMessage: e.target.value })}
            />
            <p className="text-[9px] text-muted-foreground italic px-1">This text will be prepended to the event details in the DM.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 max-w-sm">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-normal">
                Reminders are only sent once per event to users who haven't RSVP'd.
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
