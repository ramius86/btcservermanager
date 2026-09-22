import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Search, X, Check, Megaphone, Hash } from 'lucide-react'
import type { DiscordChannel } from '../../services/api'

export interface ChannelComboboxProps {
  readonly channels: DiscordChannel[]
  readonly selectedChannel: string
  readonly defaultChannelId?: string
  readonly onSelectChannel: (channelId: string) => void
  readonly id?: string
  readonly placeholder?: string
  readonly dropDirection?: 'up' | 'down'
}

export function ChannelCombobox({
  channels,
  selectedChannel,
  defaultChannelId,
  onSelectChannel,
  id = 'channel-combobox-button',
  placeholder = 'Select Discord Channel...',
  dropDirection = 'up',
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

  const positionClass = dropDirection === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'

  return (
    <div ref={dropdownRef} className="relative flex-1 w-full sm:w-auto">
      <button
        id={id}
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
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute left-0 ${positionClass} w-full min-w-[280px] bg-surface-elevated border border-border rounded-md shadow-xl z-50 overflow-hidden flex flex-col`}>
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
