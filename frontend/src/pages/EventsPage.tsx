import React, { useEffect, useState, useRef, useMemo } from 'react'
import { CalendarDays, Plus, Trash2, X, Pencil, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog'
import { ImageCropperModal } from '../components/ui/ImageCropperModal'
import {
  DiscordService,
  DiscordEventDetail,
  DiscordChannel,
  DiscordRole,
} from '../services/api'

type Tag = { value: string; label: string }

export function EventsPage() {
  const { showToast } = useToast()
  
  const [configured, setConfigured] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [events, setEvents] = useState<DiscordEventDetail[]>([])
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [roles, setRoles] = useState<DiscordRole[]>([])
  
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [gameType, setGameType] = useState('ArmA III')
  const [channelId, setChannelId] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  
  const [imageBase64, setImageBase64] = useState<string>('')
  const [rawImageSrc, setRawImageSrc] = useState<string>('')
  const [isCropOpen, setIsCropOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [eventToDelete, setEventToDelete] = useState<number | null>(null)
  const [eventToEdit, setEventToEdit] = useState<DiscordEventDetail | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editGameType, setEditGameType] = useState('ArmA III')

  useEffect(() => {
    // Initialize defaults from localStorage
    const savedGame = localStorage.getItem('discord_event_game')
    if (savedGame) setGameType(savedGame)

    const savedTags = localStorage.getItem('discord_event_tags')
    if (savedTags) {
      try {
        setTags(JSON.parse(savedTags))
      } catch (e) {
        console.error('Failed to parse saved tags', e)
      }
    }

    const savedTime = localStorage.getItem('lastEventTime')
    if (savedTime) {
      setTime(savedTime)
    } else {
      setTime('21:30')
    }
    
    const today = new Date().toISOString().split('T')[0]
    setDate(today)

    loadData()
  }, [])

  useEffect(() => {
    // When gameType changes, try to restore the last used channel
    if (channels.length > 0) {
      const savedChannel = localStorage.getItem('discord_event_channel')
      if (savedChannel && channels.some(c => c.id === savedChannel)) {
        setChannelId(savedChannel)
      } else {
        setChannelId(channels[0].id)
      }
    }
  }, [gameType, channels])

  useEffect(() => {
    // Polling every 30 seconds
    const interval = setInterval(() => {
      loadData(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }
      const status = await DiscordService.getStatus()
      setConfigured(status.configured)
      
      if (status.configured) {
        const [chans, evts, fetchedRoles] = await Promise.all([
          DiscordService.getChannels(),
          DiscordService.getEvents(),
          DiscordService.getRoles()
        ])
        
        setChannels(chans || [])
        setRoles(fetchedRoles || [])
        
        if (evts && evts.length > 0) {
          // Load details for each event to get RSVP counts
          const detailedEvents = await Promise.all(
            evts.map(e => DiscordService.getEventDetail(e.id))
          )
          setEvents(detailedEvents)
        } else {
          setEvents([])
        }
      }
    } catch (err: any) {
      console.error(err)
      if (showSpinner) showToast("Failed to load discord events", "error")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const result = reader.result;
        setRawImageSrc(typeof result === 'string' ? result : '')
        setIsCropOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !date || !time || !gameType || !channelId) return

    // Save preferences
    localStorage.setItem('discord_event_channel', channelId)
    localStorage.setItem('discord_event_game', gameType)
    localStorage.setItem('discord_event_tags', JSON.stringify(tags))

    const dateTime = `${date}T${time}`
    const mentions = tags.map(t => t.value).join(' ')

    try {
      setLoading(true)
      await DiscordService.createEvent({
        title,
        dateTime,
        gameType,
        channelId,
        imageBase64: imageBase64 || undefined,
        mentions
      })
      showToast("Event posted to Discord", "success")
      setTitle('')
      setImageBase64('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadData()
    } catch (err: any) {
      showToast(err.message || "Failed to post event", "error")
    }
  }

  const handleOpenEdit = (event: DiscordEventDetail) => {
    setEventToEdit(event)
    setEditTitle(event.title)
    
    if (event.dateTime?.includes('T')) {
      const parts = event.dateTime.split('T')
      setEditDate(parts[0])
      setEditTime(parts[1])
    } else if (event.dateTime) {
      const parts = event.dateTime.split(' ') // Handle possible space-separated fallback
      setEditDate(parts[0])
      setEditTime(parts[1] || '')
    } else {
      setEditDate('')
      setEditTime('')
    }
    setEditGameType(event.gameType)
  }

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!eventToEdit || !editTitle || !editDate || !editTime || !editGameType) return

    const dateTime = `${editDate}T${editTime}`

    try {
      await DiscordService.updateEvent(eventToEdit.id, {
        title: editTitle,
        dateTime,
        gameType: editGameType
      })
      showToast("Event updated", "success")
      setEventToEdit(null)
      loadData(false)
    } catch (err: any) {
      showToast(err.message || "Failed to update event", "error")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return
    try {
      await DiscordService.deleteEvent(eventToDelete)
      showToast("Event deleted", "success")
      setEventToDelete(null)
      loadData(false)
    } catch (err: any) {
      showToast(err.message || "Failed to delete event", "error")
    }
  }

  const availableTags: Tag[] = useMemo(() => [
    { value: '@everyone', label: '@everyone' },
    { value: '@here', label: '@here' },
    ...roles.map(r => ({ value: `<@&${r.id}>`, label: r.name }))
  ], [roles])

  const filteredTags = useMemo(() => {
    return availableTags.filter(t => 
      t.label.toLowerCase().includes(tagInput.toLowerCase()) && 
      !tags.some(existing => existing.value === t.value)
    )
  }, [availableTags, tagInput, tags])

  if (loading && events.length === 0 && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <CalendarDays className="w-8 h-8 animate-pulse mb-4" />
        <p>Loading events...</p>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto py-8 px-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Discord Events</h1>
        <Card className="p-8 text-center bg-surface-elevated/50 border-border">
          <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Discord Bot Not Configured</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            To use the events feature, you need to configure the Discord bot in your `.env` file with `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID`.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8 px-6">
      <ImageCropperModal 
        isOpen={isCropOpen} 
        onClose={() => {
          setIsCropOpen(false)
          if (fileInputRef.current && !imageBase64) fileInputRef.current.value = ''
        }} 
        imageSrc={rawImageSrc} 
        onCropComplete={(b64) => setImageBase64(b64)} 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Discord Events</h1>
          <p className="text-muted-foreground mt-1">Post events to Discord with RSVP buttons</p>
        </div>
        <Link to="/events/stats">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Attendance Stats
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-border bg-surface-elevated/50">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="event-title" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Title</label>
                <Input 
                  id="event-title"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Partita Ufficiale" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Date</label>
                  <Input 
                    id="event-date"
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="event-time" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Time</label>
                  <Input 
                    id="event-time"
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="event-game" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Game</label>
                <select 
                  id="event-game"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={gameType}
                  onChange={e => setGameType(e.target.value)}
                  required
                >
                  <option value="ArmA III">ArmA III</option>
                  <option value="Arma Reforger">Arma Reforger</option>
                </select>
              </div>

              <div>
                <label htmlFor="event-tags-input" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Mentions (Optional)</label>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
                    {tags.map(t => (
                      <span key={t.value} className="flex items-center gap-1 bg-surface-elevated px-2 py-0.5 rounded-md text-xs">
                        {t.label}
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); setTags(tags.filter(x => x.value !== t.value)); }} className="text-muted-foreground hover:text-destructive">
                          &times;
                        </button>
                      </span>
                    ))}
                    <input 
                      id="event-tags-input"
                      type="text" 
                      className="flex-1 bg-transparent outline-none min-w-[120px]" 
                      placeholder={tags.length === 0 ? "Type to search roles..." : ""}
                      value={tagInput}
                      onChange={e => {
                        setTagInput(e.target.value)
                        setIsTagDropdownOpen(true)
                      }}
                      onFocus={() => setIsTagDropdownOpen(true)}
                      onBlur={() => setIsTagDropdownOpen(false)}
                    />
                  </div>
                  
                  {isTagDropdownOpen && filteredTags.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-surface-elevated border border-border rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
                      {filteredTags.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-surface text-foreground transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                            setTags([...tags, t])
                            setTagInput('')
                            setIsTagDropdownOpen(false)
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="event-channel" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Discord Channel</label>
                <select 
                  id="event-channel"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={channelId}
                  onChange={e => setChannelId(e.target.value)}
                  required
                >
                  {channels.map(c => (
                    <option key={c.id} value={c.id}>#{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="event-image" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Image (Optional)</label>
                {imageBase64 ? (
                  <div className="relative rounded-md overflow-hidden border border-border mt-2">
                    <img src={imageBase64} alt="Event Preview" className="w-full h-auto object-cover aspect-[1.91/1]" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setImageBase64('')
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input 
                      id="event-image"
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      className="cursor-pointer file:cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full mt-2">
                <Plus className="w-4 h-4 mr-2" /> Post to Discord
              </Button>
            </form>
          </Card>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Recent Events
              {isRefreshing && <CalendarDays className="w-4 h-4 animate-pulse text-muted-foreground" />}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => loadData(false)}>
              Refresh
            </Button>
          </div>
          
          {events.length === 0 ? (
             <div className="p-12 text-center border border-dashed border-border rounded-xl bg-surface/30">
               <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
               <h3 className="text-lg font-semibold text-foreground">No recent events</h3>
               <p className="text-muted-foreground mt-1">Create an event to post it to Discord.</p>
             </div>
          ) : (
            events.map(event => (
              <Card key={event.id} className="p-5 border-border bg-surface-elevated/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                <div>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">{event.dateTime}</span>
                    <span>•</span>
                    <span className="text-primary">{event.gameType}</span>
                    <span>•</span>
                    <span>#{channels.find(c => c.id === event.channelId)?.name || 'unknown-channel'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-l border-border pl-6 w-full sm:w-auto">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-success mb-1">Going</span>
                      <span className="text-lg font-mono font-black">{event.going?.length || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-1">Not</span>
                      <span className="text-lg font-mono font-black">{event.notGoing?.length || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Maybe</span>
                      <span className="text-lg font-mono font-black">{event.maybe?.length || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">No Resp.</span>
                      <span className="text-lg font-mono font-black">{event.noResponse?.length || 0}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-primary hover:bg-primary/10 ml-auto"
                    onClick={() => handleOpenEdit(event)}
                    title="Edit Event"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setEventToDelete(event.id)}
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <ConfirmationDialog 
        open={!!eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event? The message will also be deleted from Discord."
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        variant="danger"
      />

      <Dialog open={!!eventToEdit} onOpenChange={(open) => !open && setEventToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div>
              <label htmlFor="edit-title" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Title</label>
              <Input 
                id="edit-title"
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-date" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Date</label>
                <Input 
                  id="edit-date"
                  type="date" 
                  value={editDate} 
                  onChange={e => setEditDate(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="edit-time" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Time</label>
                <Input 
                  id="edit-time"
                  type="time" 
                  value={editTime} 
                  onChange={e => setEditTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-game" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Game</label>
              <select 
                id="edit-game"
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editGameType}
                onChange={e => setEditGameType(e.target.value)}
                required
              >
                <option value="ArmA III">ArmA III</option>
                <option value="Arma Reforger">Arma Reforger</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEventToEdit(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
