import React, { useState, useMemo } from 'react'
import {
  Copy,
  Check,
  Send,
  MessageSquare,
  Loader2,
  Columns,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import type { RosterSquad, DiscordChannel, RosterPart } from '../../services/api'
import { DiscordService } from '../../services/api'
import {
  formatRosterPartsForDiscord,
  buildRosterDiscordEmbed,
  buildDefaultRosterHeader,
  reconcileSquadsWithCandidates,
  type RosterCandidate,
  type RosterLanguage,
  ROSTER_HEADER_LANG_KEY,
} from './rosterUtils'
import { ChannelCombobox } from './ChannelCombobox'

interface RosterExportModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly eventId: number
  readonly defaultChannelId?: string
  readonly channels: DiscordChannel[]
  readonly squads: RosterSquad[]
  readonly parts?: RosterPart[]
  readonly candidates?: RosterCandidate[]
  readonly headerText?: string
  readonly onHeaderChange?: (header: string) => void
  readonly dateTime?: string
  readonly gameType?: string
  readonly eventTitle?: string
}

const ROSTER_CHANNEL_STORAGE_KEY = 'discord_roster_channel'

function detectHeaderLanguage(text?: string): RosterLanguage | null {
  if (!text) return null
  if (text.includes("per l'evento")) return 'ITA'
  if (text.includes("tonight's event") || text.includes('Slotlist for')) return 'ENG'
  return null
}

export function RosterExportModal({
  isOpen,
  onClose,
  eventId,
  defaultChannelId = '',
  channels,
  squads,
  parts,
  candidates,
  headerText: initialHeaderText,
  onHeaderChange,
  dateTime,
  gameType,
  eventTitle,
}: RosterExportModalProps) {
  const { showToast } = useToast()

  const [headerLanguage, setHeaderLanguage] = useState<RosterLanguage>(() => {
    const detected = detectHeaderLanguage(initialHeaderText)
    if (detected) return detected
    const saved = localStorage.getItem(ROSTER_HEADER_LANG_KEY)
    return saved === 'ITA' ? 'ITA' : 'ENG'
  })

  const [headerText, setHeaderText] = useState(() => {
    if (initialHeaderText) return initialHeaderText
    const saved = localStorage.getItem(ROSTER_HEADER_LANG_KEY)
    const lang: RosterLanguage = saved === 'ITA' ? 'ITA' : 'ENG'
    return buildDefaultRosterHeader(dateTime, gameType, lang)
  })

  React.useEffect(() => {
    if (isOpen) {
      if (initialHeaderText) {
        setHeaderText(initialHeaderText)
        const detected = detectHeaderLanguage(initialHeaderText)
        if (detected) {
          setHeaderLanguage(detected)
        }
      } else {
        const saved = localStorage.getItem(ROSTER_HEADER_LANG_KEY)
        const lang: RosterLanguage = saved === 'ITA' ? 'ITA' : 'ENG'
        setHeaderLanguage(lang)
        setHeaderText(buildDefaultRosterHeader(dateTime, gameType, lang))
      }
    }
  }, [isOpen, initialHeaderText, dateTime, gameType])

  const handleLanguageChange = (newLang: RosterLanguage) => {
    setHeaderLanguage(newLang)
    localStorage.setItem(ROSTER_HEADER_LANG_KEY, newLang)
    const newHeader = buildDefaultRosterHeader(dateTime, gameType, newLang)
    setHeaderText(newHeader)
    onHeaderChange?.(newHeader)
  }

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

  const effectiveParts: RosterPart[] = useMemo(() => {
    if (parts && parts.length > 0) {
      return parts.map(p => ({
        ...p,
        squads: candidates && candidates.length > 0
          ? reconcileSquadsWithCandidates(p.squads, candidates)
          : p.squads,
      }))
    }
    const reconciledSquads = candidates && candidates.length > 0
      ? reconcileSquadsWithCandidates(squads, candidates)
      : squads
    return [{ id: 'part-1', name: 'PART 1', squads: reconciledSquads }]
  }, [parts, squads, candidates])

  const formattedText = useMemo(() => {
    return formatRosterPartsForDiscord(headerText, effectiveParts)
  }, [headerText, effectiveParts])

  const discordEmbed = useMemo(() => {
    return buildRosterDiscordEmbed(effectiveParts, eventTitle, gameType)
  }, [effectiveParts, eventTitle, gameType])

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
      await DiscordService.publishEventRoster(eventId, selectedChannel, headerText, discordEmbed)
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
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-surface-elevated">
        <DialogHeader className="p-5 pb-3 border-b border-border bg-surface/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Export Slotlist for Discord
            </DialogTitle>
            {effectiveParts.length >= 2 && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30 flex items-center gap-1">
                <Columns className="w-3 h-3" />
                {effectiveParts.length} Parts Side-by-Side
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Copy the formatted roster directly into Discord or post it directly as an announcement embed with side-by-side columns.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="roster-header-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Header Message
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Language:</span>
                <select
                  id="roster-header-lang-select"
                  value={headerLanguage}
                  onChange={e => handleLanguageChange(e.target.value as RosterLanguage)}
                  className="h-6 px-1.5 text-[11px] font-semibold rounded bg-surface border border-border text-foreground hover:border-primary/50 focus:border-primary outline-none cursor-pointer"
                >
                  <option value="ENG">ENG</option>
                  <option value="ITA">ITA</option>
                </select>
              </div>
            </div>
            <Input
              id="roster-header-input"
              value={headerText}
              onChange={e => {
                setHeaderText(e.target.value)
                onHeaderChange?.(e.target.value)
              }}
              placeholder={
                headerLanguage === 'ITA'
                  ? "es. @here Slotlist per l'evento..."
                  : "e.g. @here Slotlist for the event..."
              }
              className="h-8 text-xs bg-surface border-border"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="roster-preview-textarea" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Formatted Text Preview (Clipboard / Fallback)
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formattedText.length} characters
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
