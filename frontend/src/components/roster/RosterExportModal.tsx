import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Copy,
  Check,
  Send,
  MessageSquare,
  Loader2,
  Search,
  X,
  ChevronDown,
  Hash,
  Megaphone,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useToast } from '../ui/Toast'
import type { RosterSquad, DiscordChannel } from '../../services/api'
import { DiscordService } from '../../services/api'
import { formatRosterForDiscord } from './rosterUtils'

interface RosterExportModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly eventId: number
  readonly defaultChannelId?: string
  readonly channels: DiscordChannel[]
  readonly squads: RosterSquad[]
}

const ROSTER_CHANNEL_STORAGE_KEY = 'discord_roster_channel'

interface ChannelComboboxProps {
  readonly channels: DiscordChannel[]
  readonly selectedChannel: string
  readonly defaultChannelId?: string
  readonly onSelectChannel: (channelId: string) => void
}

function ChannelCombobox({
  channels,
  selectedChannel,
  defaultChannelId,
  onSelectChannel,
}: ChannelComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedChannelObj = useMemo(() => {
    return channels.find(c => c.id === selectedChannel)
  }, [channels, selectedChannel])

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return channels
    const q = search.toLowerCase().trim()
    return channels.filter(c => c.name.toLowerCase().includes(q))
  }, [channels, search])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative flex-1 w-full sm:w-auto">
      <button
        id="roster-channel-button"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground hover:border-border-active transition-colors text-left"
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedChannelObj ? (
            <>
              {selectedChannelObj.type === 5 ? (
                <Megaphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
              <span className="font-medium text-foreground truncate">
                {selectedChannelObj.name}
              </span>
              {selectedChannelObj.type === 5 && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30 text-amber-400 bg-amber-500/10 shrink-0">
                  Announcements
                </span>
              )}
              {selectedChannelObj.id === defaultChannelId && (
                <span className="text-[9px] text-muted-foreground bg-surface-elevated border border-border px-1.5 py-0.2 rounded shrink-0">
                  Event Default
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Select Discord Channel...</span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1.5 w-full min-w-[280px] bg-surface-elevated border border-border rounded-md shadow-xl z-50 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="p-2 border-b border-border bg-surface/50 relative">
            <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search channel name..."
              className="w-full h-7 pl-7 pr-6 text-xs bg-surface border border-border rounded px-2 text-foreground focus:outline-none focus:border-primary"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* List of Channels */}
          <div className="overflow-y-auto max-h-52 divide-y divide-border/20">
            {filteredChannels.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No channels matching &quot;{search}&quot;
              </div>
            ) : (
              filteredChannels.map(c => {
                const isSelected = c.id === selectedChannel
                const isAnnouncement = c.type === 5
                const isDefault = c.id === defaultChannelId

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectChannel(c.id)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors hover:bg-surface ${
                      isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isAnnouncement ? (
                        <Megaphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">{c.name}</span>
                      {isAnnouncement && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30 text-amber-400 bg-amber-500/10 shrink-0">
                          Announcements
                        </span>
                      )}
                      {isDefault && (
                        <span className="text-[9px] text-muted-foreground bg-surface border border-border px-1 py-0.2 rounded shrink-0">
                          Default
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1.5" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function RosterExportModal({
  isOpen,
  onClose,
  eventId,
  defaultChannelId = '',
  channels,
  squads,
}: RosterExportModalProps) {
  const { showToast } = useToast()

  const [headerText, setHeaderText] = useState('@here slotlist per stasera')
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
    return formatRosterForDiscord(headerText, squads)
  }, [headerText, squads])

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
              onChange={e => setHeaderText(e.target.value)}
              placeholder="e.g. @here slotlist per stasera"
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
