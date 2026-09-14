import React, { useState, useEffect } from 'react'
import { AlertTriangle, Bell, Clock, Package, RefreshCw, Save, Send, ShieldAlert, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Switch } from '../ui/Switch'
import { Badge } from '../ui/Badge'
import { DiscordChannel, DiscordService } from '../../services/api'
import { useToast } from '../ui/Toast'

export interface AlertsSettings {
  discordAlertChannelId: string
  discordAlertServerOffline: boolean
  discordAlertModUpdates: boolean
  discordAlertGameUpdates: boolean
  modUpdateCheckIntervalMinutes: number
  gameUpdateCheckIntervalMinutes: number
}

interface AlertsSettingsFormProps {
  settings: AlertsSettings
  onSave: (settings: AlertsSettings) => Promise<void>
}

function toFormState(settings: AlertsSettings): AlertsSettings {
  return {
    discordAlertChannelId: settings.discordAlertChannelId || '',
    discordAlertServerOffline: settings.discordAlertServerOffline ?? false,
    discordAlertModUpdates: settings.discordAlertModUpdates ?? false,
    discordAlertGameUpdates: settings.discordAlertGameUpdates ?? false,
    modUpdateCheckIntervalMinutes: settings.modUpdateCheckIntervalMinutes || 360,
    gameUpdateCheckIntervalMinutes: settings.gameUpdateCheckIntervalMinutes || 15,
  }
}

export function AlertsSettingsForm({ settings, onSave }: Readonly<AlertsSettingsFormProps>) {
  const { showToast } = useToast()
  const [localSettings, setLocalSettings] = useState<AlertsSettings>(() => toFormState(settings))

  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [botStatus, setBotStatus] = useState<{ connected: boolean; configured: boolean } | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingAlert, setTestingAlert] = useState(false)

  useEffect(() => {
    setLocalSettings(toFormState(settings))
  }, [settings])

  useEffect(() => {
    let mounted = true
    setLoadingStatus(true)

    Promise.allSettled([
      DiscordService.getStatus(),
      DiscordService.getChannels(),
    ]).then(([statusRes, channelsRes]) => {
      if (!mounted) return
      if (statusRes.status === 'fulfilled') {
        setBotStatus(statusRes.value)
      }
      if (channelsRes.status === 'fulfilled') {
        setChannels(channelsRes.value)
      }
      setLoadingStatus(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(localSettings)
    } finally {
      setSaving(false)
    }
  }

  const handleTestAlert = async () => {
    if (!localSettings.discordAlertChannelId) {
      showToast('Select an alert channel first.', 'error')
      return
    }

    setTestingAlert(true)
    try {
      await DiscordService.sendTestAlert(localSettings.discordAlertChannelId)
      showToast('Test alert sent successfully to Discord.', 'success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      showToast('Failed to send test alert: ' + message, 'error')
    } finally {
      setTestingAlert(false)
    }
  }

  const isConfigured = botStatus?.configured && botStatus?.connected

  return (
    <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-surface/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-md font-bold">Operational Alerts</CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Discord Notifications & Monitoring
              </CardDescription>
            </div>
          </div>
          <div>
            {!loadingStatus && (
              <Badge
                variant={isConfigured ? 'success' : 'secondary'}
                className="text-[9px] uppercase tracking-widest px-2 py-0.5"
              >
                {isConfigured ? 'Bot Ready' : 'Bot Not Configured'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isConfigured && !loadingStatus && (
            <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/20 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
              <p className="text-xs text-muted-foreground">
                Discord bot is not configured or offline. Set <code className="text-foreground">DISCORD_BOT_TOKEN</code> and <code className="text-foreground">DISCORD_GUILD_ID</code> in your <code className="text-foreground">.env</code> file to enable notifications.
              </p>
            </div>
          )}

          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Discord Alerts Channel
            </label>
            <Select
              className="bg-surface border-border focus:border-primary/50 h-10 text-sm"
              value={localSettings.discordAlertChannelId}
              onChange={(e) => setLocalSettings({ ...localSettings, discordAlertChannelId: e.target.value })}
              disabled={!isConfigured}
            >
              <option value="">Disabled (No channel selected)</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  #{ch.name}
                </option>
              ))}
            </Select>
            <p className="text-[9px] text-muted-foreground italic px-1">
              Select the dedicated text channel where automated operational alerts will be posted.
            </p>
          </div>

          {/* Alert Toggles & Frequencies */}
          <div className="space-y-4 pt-2 border-t border-border">
            {/* Server Offline / Crash */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface/50 rounded-lg border border-border gap-4">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                  <p className="text-sm font-bold text-foreground">Server Crash & Offline</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Send an immediate notification if a game server terminates unexpectedly or crashes.
                </p>
              </div>
              <Switch
                checked={localSettings.discordAlertServerOffline}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, discordAlertServerOffline: checked })
                }
                disabled={!isConfigured || !localSettings.discordAlertChannelId}
              />
            </div>

            {/* Mod Updates */}
            <div className="p-4 bg-surface/50 rounded-lg border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    <p className="text-sm font-bold text-foreground">Workshop Mod Updates</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send a notification when an installed mod has an update available on Steam Workshop.
                  </p>
                </div>
                <Switch
                  checked={localSettings.discordAlertModUpdates}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, discordAlertModUpdates: checked })
                  }
                  disabled={!isConfigured || !localSettings.discordAlertChannelId}
                />
              </div>

              <div className="pt-2 border-t border-border/50 grid gap-2 sm:grid-cols-2 items-center">
                <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Scan Interval (Minutes)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="5"
                    step="5"
                    className="bg-surface border-border focus:border-primary/50 h-9 text-xs pr-16"
                    value={localSettings.modUpdateCheckIntervalMinutes}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        modUpdateCheckIntervalMinutes: Number.parseInt(e.target.value, 10) || 360,
                      })
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    Min
                  </span>
                </div>
              </div>
            </div>

            {/* Game Server Updates */}
            <div className="p-4 bg-surface/50 rounded-lg border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-warning" />
                    <p className="text-sm font-bold text-foreground">Game Server Build Updates</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send a notification when a new dedicated server build is published on Steam.
                  </p>
                </div>
                <Switch
                  checked={localSettings.discordAlertGameUpdates}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, discordAlertGameUpdates: checked })
                  }
                  disabled={!isConfigured || !localSettings.discordAlertChannelId}
                />
              </div>

              <div className="pt-2 border-t border-border/50 grid gap-2 sm:grid-cols-2 items-center">
                <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Scan Interval (Minutes)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="5"
                    step="5"
                    className="bg-surface border-border focus:border-primary/50 h-9 text-xs pr-16"
                    value={localSettings.gameUpdateCheckIntervalMinutes}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        gameUpdateCheckIntervalMinutes: Number.parseInt(e.target.value, 10) || 15,
                      })
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                    Min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!isConfigured || !localSettings.discordAlertChannelId || testingAlert}
              onClick={handleTestAlert}
              className="w-full sm:w-auto min-w-[140px] text-[10px] font-bold uppercase tracking-widest"
            >
              {testingAlert ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Sending Test...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Send Test Alert
                </>
              )}
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
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
