import { useState, useEffect } from 'react'
import { Radio, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'
import { useToast } from '../ui/Toast'
import type { DiscordChannel, RosterPreviewConfig } from '../../services/api'
import { ChannelCombobox } from './ChannelCombobox'

interface RosterLivePreviewModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly channels: DiscordChannel[]
  readonly previewConfig: RosterPreviewConfig
  readonly onSaveConfig: (config: RosterPreviewConfig, shouldSyncNow?: boolean) => Promise<void>
  readonly isSyncing?: boolean
}

export function RosterLivePreviewModal({
  isOpen,
  onClose,
  channels,
  previewConfig,
  onSaveConfig,
  isSyncing = false,
}: RosterLivePreviewModalProps) {
  const { showToast } = useToast()
  const [enabled, setEnabled] = useState(previewConfig.enabled)
  const [channelId, setChannelId] = useState(previewConfig.channelId)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setEnabled(previewConfig.enabled)
      setChannelId(previewConfig.channelId || '')
    }
  }, [isOpen, previewConfig])

  const handleSaveAndSync = async () => {
    if (enabled && !channelId) {
      showToast('Please select a Discord channel for the live preview', 'error')
      return
    }

    try {
      setSaving(true)
      const updatedConfig: RosterPreviewConfig = {
        ...previewConfig,
        enabled,
        channelId,
      }
      await onSaveConfig(updatedConfig, enabled)
      showToast(
        enabled
          ? 'Live Preview enabled! Roster synced to Discord.'
          : 'Live Preview disabled.',
        'success'
      )
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      showToast('Failed to configure preview: ' + msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDisable = async () => {
    try {
      setSaving(true)
      const updatedConfig: RosterPreviewConfig = {
        ...previewConfig,
        enabled: false,
      }
      await onSaveConfig(updatedConfig, false)
      setEnabled(false)
      showToast('Live preview turned off', 'info')
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      showToast('Failed to disable preview: ' + msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            Discord Live Roster Preview
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Stream real-time roster changes to a designated Discord organization channel (e.g. #roster).
          </p>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* Explanation Banner */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
            <div className="p-1 rounded-md bg-primary/10 text-primary mt-0.5">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-foreground/90 space-y-1">
              <p className="font-semibold text-foreground">In-Place Message Editing</p>
              <p className="text-muted-foreground leading-relaxed">
                When enabled, the bot posts an initial draft of the slotlist to the selected channel. Every time you assign a player, edit a role, or add a squad, the bot <strong>updates that exact same message</strong> in real-time without creating new messages.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
            <div className="space-y-0.5">
              <label htmlFor="preview-toggle" className="text-xs font-semibold text-foreground cursor-pointer">
                Enable Live Discord Preview
              </label>
              <p className="text-[11px] text-muted-foreground">
                Sync edits automatically in real-time as changes are made in the manager.
              </p>
            </div>
            <Switch
              id="preview-toggle"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {/* Channel Selector */}
          <div className={`space-y-1.5 transition-opacity ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label htmlFor="preview-channel-combobox" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Preview Channel
            </label>
            <ChannelCombobox
              id="preview-channel-combobox"
              channels={channels}
              selectedChannel={channelId}
              onSelectChannel={setChannelId}
              placeholder="Select #roster or preview channel..."
              dropDirection="down"
            />
            <p className="text-[11px] text-muted-foreground">
              Choose an internal or staff channel where team members discuss the slotlist.
            </p>
          </div>

          {/* Live Sync Status Info */}
          {previewConfig.enabled && previewConfig.messageId && (
            <div className="rounded-lg border border-border bg-surface/50 p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Live Sync Status:</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Active on Discord
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Message ID:</span>
                <span>{previewConfig.messageId}</span>
              </div>
              {previewConfig.lastSyncedAt && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Last synced:</span>
                  <span>{new Date(previewConfig.lastSyncedAt).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}

          {!previewConfig.enabled && !enabled && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80 px-1">
              <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Preview sync is currently disabled for this event.</span>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-border bg-surface/30 flex items-center justify-between gap-2">
          {previewConfig.enabled ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDisable}
              disabled={saving || isSyncing}
              className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
            >
              Turn Off Preview
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveAndSync}
              disabled={saving || isSyncing || (enabled && !channelId)}
              className="text-xs font-semibold"
            >
              {saving || isSyncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Syncing...
                </>
              ) : (
                'Save & Sync Now'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
