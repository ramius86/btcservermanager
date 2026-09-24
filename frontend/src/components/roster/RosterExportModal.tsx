import React, { useState, useMemo } from 'react'
import {
  Copy,
  Check,
  Send,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useToast } from '../ui/Toast'
import type { RosterSquad, DiscordChannel } from '../../services/api'
import { DiscordService } from '../../services/api'
import {
  formatRosterForDiscord,
  buildDefaultRosterHeader,
  reconcileSquadsWithCandidates,
  type RosterCandidate,
} from './rosterUtils'
import { ChannelCombobox } from './ChannelCombobox'

interface RosterExportModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly eventId: number
  readonly defaultChannelId?: string
  readonly channels: DiscordChannel[]
  readonly squads: RosterSquad[]
  readonly candidates?: RosterCandidate[]
  readonly headerText?: string
  readonly onHeaderChange?: (header: string) => void
  readonly dateTime?: string
  readonly gameType?: string
}

const ROSTER_CHANNEL_STORAGE_KEY = 'discord_roster_channel'


export function RosterExportModal({
  isOpen,
  onClose,
  eventId,
  defaultChannelId = '',
  channels,
  squads,
  candidates,
  headerText: initialHeaderText,
  onHeaderChange,
  dateTime,
  gameType,
}: RosterExportModalProps) {
  const { showToast } = useToast()

  const [headerText, setHeaderText] = useState(() => {
    return initialHeaderText || buildDefaultRosterHeader(dateTime, gameType)
  })

  React.useEffect(() => {
    if (isOpen) {
      if (initialHeaderText) {
        setHeaderText(initialHeaderText)
      } else {
        setHeaderText(buildDefaultRosterHeader(dateTime, gameType))
      }
    }
  }, [isOpen, initialHeaderText, dateTime, gameType])

  const [copied, setCopied] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string>(() => {
    const saved = localStorage.getItem(ROSTER_CHANNEL_STORAGE_KEY)
    if (saved && channels.some(c => c.id === saved)) {
      return saved
    }
    return defaultChannelId
  })
  const [sending, setSending] = useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem(ROSTER_CHANNEL_STORAGE_KEY)
    if (saved && channels.some(c => c.id === saved)) {
      setSelectedChannel(saved)
    } else if (defaultChannelId && channels.some(c => c.id === defaultChannelId)) {
      setSelectedChannel(defaultChannelId)
    }
  }, [defaultChannelId, channels])

  const formattedText = useMemo(() => {
    const reconciledSquads = candidates && candidates.length > 0
      ? reconcileSquadsWithCandidates(squads, candidates)
      : squads
    return formatRosterForDiscord(headerText, reconciledSquads)
  }, [headerText, squads, candidates])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText)
      setCopied(true)
      showToast('Slotlist copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch (err: unknown) {
      console.error('Failed to copy to clipboard', err)
      showToast('Failed to copy to clipboard', 'error')
    }
  }

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannel(channelId)
    if (channelId) {
      localStorage.setItem(ROSTER_CHANNEL_STORAGE_KEY, channelId)
    }
  }

  const handleSendToDiscord = async () => {
    if (!selectedChannel) {
      showToast('Please select a Discord channel', 'error')
      return
    }

    try {
      setSending(true)
      localStorage.setItem(ROSTER_CHANNEL_STORAGE_KEY, selectedChannel)
      await DiscordService.publishEventRoster(eventId, selectedChannel, formattedText)
      showToast('Slotlist published to Discord channel!', 'success')
      onClose()
    } catch (err: any) {
      showToast('Failed to publish to Discord: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Export Slotlist for Discord
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Copy the formatted roster directly into Discord or send it directly to an announcement channel.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="roster-header-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Header Message
            </label>
            <Input
              id="roster-header-input"
              value={headerText}
              onChange={e => {
                setHeaderText(e.target.value)
                onHeaderChange?.(e.target.value)
              }}
              placeholder="e.g. @here Slotlist per l'evento di questa sera..."
              className="h-8 text-xs bg-surface border-border"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="roster-preview-textarea" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Discord Formatted Preview
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formattedText.length} / 2000 characters
              </span>
            </div>
            <Textarea
              id="roster-preview-textarea"
              value={formattedText}
              readOnly
              className="font-mono text-xs bg-surface border-border h-64 select-all resize-none leading-relaxed p-3"
            />
          </div>

          {channels.length > 0 && (
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="roster-channel-button"
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-primary" />
                  Target Discord Channel
                </label>
                <span className="text-[10px] text-muted-foreground italic">
                  (remembered for future events)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <ChannelCombobox
                  channels={channels}
                  selectedChannel={selectedChannel}
                  defaultChannelId={defaultChannelId}
                  onSelectChannel={handleSelectChannel}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSendToDiscord}
                  disabled={sending || !selectedChannel}
                  className="w-full sm:w-auto h-8 text-xs font-semibold shrink-0"
                >
                  {sending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Post to Discord
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-3 border-t border-border bg-surface/40 flex items-center justify-between sm:justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            className="h-8 text-xs font-bold uppercase tracking-wider min-w-[150px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
