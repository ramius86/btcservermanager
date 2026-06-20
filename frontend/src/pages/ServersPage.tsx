import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { formatUptime } from '../utils/time'

import { useNavigate } from 'react-router-dom'
import { Play, Square, Settings, MoreVertical, RotateCcw, Copy, Trash2, FileText, Loader2, Clock, Users, Plus, Activity, Cpu, Minus, GripVertical } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button, cn } from '../components/ui/Button'
import { ServerService } from '../services/api'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import { useToast } from '../components/ui/Toast'
import { useServerStatus } from '../contexts/ServerStatusContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { AnyServerDto, isArma3Server } from '../dtos/ServerDto'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/DropdownMenu'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

const SERVER_IMAGE_MAP: Record<string, string> = {
  DAYZ_EXP: '/dayzexp.png',
  ARMA3: '/arma3.png',
  DAYZ: '/dayz.png',
  REFORGER: '/reforger.png'
}

function getServerImage(type: string): string {
  return SERVER_IMAGE_MAP[type] ?? `/${type.toLowerCase()}.png`
}

interface ServerCardItemProps {
  instance: {
    server: AnyServerDto
    status: {
      alive: boolean
      playersOnline: number
      map: string
      mission: string
      maxPlayers: number
      startedAt: string | null
      headlessClientsCount?: number
    }
  }
  index: number
  installingGames: Record<string, { status: string; progress: number }>
  activeHCMenu: number | null
  setActiveHCMenu: (id: number | null) => void
  handleStart: (id: number) => void
  handleStop: (id: number) => void
  handleRestart: (id: number) => void
  handleDuplicate: (server: AnyServerDto) => void
  setServerToDelete: (server: AnyServerDto) => void
  handleHCAdd: (server: AnyServerDto) => void
  handleHCRemove: (server: AnyServerDto) => void
  isServerWithSamePortRunning: (server: AnyServerDto) => boolean
  navigate: any
  showToast: any
}

interface ServerControlsProps {
  server: AnyServerDto
  status: any
  isServerWithSamePortRunning: (server: AnyServerDto) => boolean
  handleStart: (id: number) => void
  handleStop: (id: number) => void
  handleRestart: (id: number) => void
  handleDuplicate: (server: AnyServerDto) => void
  setServerToDelete: (server: AnyServerDto) => void
  showToast: any
  navigate: any
}

function ServerControls({
  server,
  status,
  isServerWithSamePortRunning,
  handleStart,
  handleStop,
  handleRestart,
  handleDuplicate,
  setServerToDelete,
  showToast,
  navigate
}: Readonly<ServerControlsProps>) {
  const sId = server.id!

  return (
    <div className="flex flex-col items-end gap-1.5 pl-0 md:pl-4 border-l-0 md:border-l border-border/30">
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        <div className="flex gap-1.5 items-center mr-1.5 pr-1.5 border-r border-border/30">
          {status.alive ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleStop(sId); }} 
              className="w-9 h-9 text-destructive hover:bg-destructive/10"
              title="Stop Server"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </Button>
          ) : (
            <Button 
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleStart(sId); }} 
              disabled={isServerWithSamePortRunning(server)}
              className={cn(
                "w-9 h-9",
                isServerWithSamePortRunning(server)
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-success hover:bg-success/10"
              )}
              title={isServerWithSamePortRunning(server) ? "Port conflict" : "Start Server"}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); handleRestart(sId); }} 
            disabled={!status.alive} 
            className="w-9 h-9 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Restart Server"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); navigate(`/logs?type=server&serverId=${sId}&game=${server.type}`); }} 
            className="w-9 h-9 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Live Logs"
          >
            <FileText className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); navigate(`/servers/${sId}`); }} 
            className="w-9 h-9 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Instance Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
          {(server.type === 'REFORGER' || server.type === 'ARMA3') && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (server.type === 'ARMA3') {
                  showToast("Arma 3 Performance stats coming soon", "info");
                  return;
                }
                navigate(`/logs?type=server&serverId=${sId}&view=performance&game=${server.type}`); 
              }} 
              className={cn(
                "w-9 h-9",
                server.type === 'REFORGER' ? "text-primary hover:bg-primary/10" : "text-muted-foreground opacity-50 hover:bg-accent"
              )}
              title={server.type === 'REFORGER' ? "Performance Stats" : "Performance Stats (Coming Soon)"}
            >
              <Activity className="w-3.5 h-3.5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface-elevated border-border p-1">
              <DropdownMenuItem onClick={() => handleDuplicate(server)} className="py-2.5 rounded-md cursor-pointer">
                <Copy className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/logs?type=server&serverId=${sId}&game=${server.type}`)} className="py-2.5 rounded-md cursor-pointer">
                <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Logs</span>
              </DropdownMenuItem>
              <div className="h-px bg-border my-1" />
              <DropdownMenuItem 
                onClick={() => setServerToDelete(server)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 py-2.5 rounded-md cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                <span className="text-xs font-bold uppercase tracking-widest">Delete Instance</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isArma3Server(server) && (
        <div className="text-[9px] font-mono font-bold tracking-wider text-muted-foreground/50 flex items-center gap-1.5 mt-0.5 select-none">
          <span>CBA PRESET:</span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
            server.cbaPreset 
              ? "bg-primary/10 border-primary/20 text-primary" 
              : "bg-muted/15 border-border/40 text-muted-foreground/50"
          )}>
            {server.cbaPreset?.name || 'NONE'}
          </span>
        </div>
      )}
    </div>
  )
}

interface ServerInfoBarProps {
  server: AnyServerDto
  status: any
  activeHCMenu: number | null
  setActiveHCMenu: (id: number | null) => void
  handleHCAdd: (server: AnyServerDto) => void
  handleHCRemove: (server: AnyServerDto) => void
}

function ServerInfoBar({
  server,
  status,
  activeHCMenu,
  setActiveHCMenu,
  handleHCAdd,
  handleHCRemove
}: Readonly<ServerInfoBarProps>) {
  const sId = server.id!
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = popoverRef.current
    if (!el) return
    const stop = (e: Event) => e.stopPropagation()
    el.addEventListener('click', stop)
    el.addEventListener('keydown', stop)
    return () => {
      el.removeEventListener('click', stop)
      el.removeEventListener('keydown', stop)
    }
  }, [activeHCMenu])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-[minmax(180px,1.2fr)_minmax(180px,1.2fr)_100px_130px_auto] md:gap-8 pt-4 border-t border-border/30">
      {/* Map Section */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Map / World</span>
        <div className="flex items-center gap-2 text-xs text-foreground font-bold uppercase tracking-wider">
          <div className="w-6 h-6 rounded bg-surface border border-border/50 flex items-center justify-center shrink-0">
            <FileText className="w-3 h-3 text-primary/60" />
          </div>
          <span className="truncate">{status.map || "Initialising..."}</span>
        </div>
      </div>

      {/* Mission Section or Placeholder for alignment */}
      <div className="flex flex-col gap-1 min-w-0">
        {isArma3Server(server) ? (
          <>
            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Mission</span>
            <div className="flex items-center gap-2 text-xs text-foreground font-bold uppercase tracking-wider">
              <div className="w-6 h-6 rounded bg-surface border border-border/50 flex items-center justify-center shrink-0">
                <Activity className="w-3 h-3 text-amber-500/60" />
              </div>
              <span className="truncate">{status.mission || "Waiting..."}</span>
            </div>
          </>
        ) : (
          <div className="h-[34px]" /> // Alignment Spacer
        )}
      </div>

      {/* Uptime Section */}
      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Uptime</span>
        <div className="flex items-center gap-2 text-sm font-mono font-bold text-foreground tabular-nums">
          <div className="w-6 h-6 rounded bg-surface border border-border/50 flex items-center justify-center shrink-0">
            <Clock className="w-3 h-3 text-muted-foreground/60" />
          </div>
          {status.startedAt ? formatUptime(status.startedAt) : "00:00:00"}
        </div>
      </div>

      {/* Players Section */}
      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Players</span>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-surface border border-border/50 flex items-center justify-center shrink-0">
            <Users className="w-3 h-3 text-muted-foreground/60" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-black text-foreground tabular-nums">
              {status.playersOnline ?? 0}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">/ {status.maxPlayers}</span>
          </div>
        </div>
      </div>

      {/* Arma 3 HC Quick Status */}
      <div className="ml-auto min-w-[180px] flex justify-end">
        {isArma3Server(server) && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveHCMenu(activeHCMenu === sId ? null : sId);
              }}
              className={cn(
                "h-10 flex items-center gap-3 px-4 rounded-xl border transition-all",
                (status.headlessClientsCount || 0) > 0 ? "bg-primary/5 border-primary/20 text-primary" : "bg-surface/50 border-border/50 text-muted-foreground"
              )}
            >
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">HC</span>
              <Badge variant="outline" className="font-mono font-bold text-primary border-primary/20 bg-primary/5 px-1.5 py-0">
                {status.headlessClientsCount || 0}
              </Badge>
            </Button>

            {activeHCMenu === sId && (
              <div 
                ref={popoverRef}
                className="absolute bottom-full right-0 mb-3 p-2 bg-surface-elevated border border-border shadow-2xl rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200 z-50 backdrop-blur-xl"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleHCRemove(server)}
                  className="h-10 w-10 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                  disabled={(status.headlessClientsCount || 0) === 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="flex flex-col items-center min-w-[50px]">
                   <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">Active HC</span>
                   <span className="text-lg font-mono font-black text-primary">
                    {status.headlessClientsCount || 0}
                   </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleHCAdd(server)}
                  className="h-10 w-10 rounded-xl text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ServerCardItem({
  instance,
  index,
  installingGames,
  activeHCMenu,
  setActiveHCMenu,
  handleStart,
  handleStop,
  handleRestart,
  handleDuplicate,
  setServerToDelete,
  handleHCAdd,
  handleHCRemove,
  isServerWithSamePortRunning,
  navigate,
  showToast
}: Readonly<ServerCardItemProps>) {
  const { server, status } = instance

  let statusText = "Offline"
  if (status.alive) {
    statusText = "Online"
  } else if (installingGames[server.type]) {
    statusText = "Updating"
  }

  return (
    <Draggable draggableId={server.id!.toString()} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group relative flex flex-col p-4 md:p-5 gap-4 border-border bg-surface-elevated/50 hover:border-primary/30",
            !snapshot.isDragging && "transition-[border-color,background-color,box-shadow] duration-300",
            status.alive && "border-primary/20 bg-surface-elevated/80 shadow-lg shadow-primary/5",
            snapshot.isDragging && "z-50 border-primary/50 shadow-2xl scale-[1.01] bg-surface-elevated"
          )}
          style={provided.draggableProps.style as React.CSSProperties}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div 
              {...provided.dragHandleProps} 
              className="p-1.5 -ml-2 text-muted-foreground/20 group-hover:text-muted-foreground/60 transition-colors cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0",
              !snapshot.isDragging && "transition-all duration-500",
              status.alive ? "bg-primary/10 border-primary/20 shadow-inner shadow-primary/5" : "bg-surface border-border opacity-60"
            )}>
              <img 
                src={getServerImage(server.type)} 
                alt={server.type} 
                className={cn("h-10 w-10 object-contain drop-shadow-md dark:invert-0 invert", !status.alive && "grayscale")}
              />
            </div>

            {/* Identity Section */}
            <div className="flex-1 min-w-0 pr-12">
              <h3 className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors break-words">
                {server.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary" className="text-[10px] font-mono font-black uppercase tracking-[0.15em] h-5 px-2">
                  {server.type}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono font-bold tracking-wider">
                  PORT: {server.port}
                </span>
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-md border backdrop-blur-sm select-none",
                  !snapshot.isDragging && "transition-all duration-500",
                  status.alive ? "bg-success/10 border-success/20 text-success" : "bg-surface/50 border-border/50 text-muted-foreground/50"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    status.alive ? "bg-success animate-pulse" : "bg-muted-foreground/30"
                  )} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                    {statusText}
                  </span>
                  {installingGames[server.type] && (
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-primary ml-1" />
                  )}
                </div>
              </div>
            </div>

            <ServerControls
              server={server}
              status={status}
              isServerWithSamePortRunning={isServerWithSamePortRunning}
              handleStart={handleStart}
              handleStop={handleStop}
              handleRestart={handleRestart}
              handleDuplicate={handleDuplicate}
              setServerToDelete={setServerToDelete}
              showToast={showToast}
              navigate={navigate}
            />
          </div>

          {/* Information Bar */}
          {status.alive && (
            <ServerInfoBar
              server={server}
              status={status}
              activeHCMenu={activeHCMenu}
              setActiveHCMenu={setActiveHCMenu}
              handleHCAdd={handleHCAdd}
              handleHCRemove={handleHCRemove}
            />
          )}
        </Card>
      )}
    </Draggable>
  )
}

export function ServersPage() {
  const [servers, setServers] = useState<AnyServerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [serverToDelete, setServerToDelete] = useState<AnyServerDto | null>(null)
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<number, boolean>>({})
  const [activeHCMenu, setActiveHCMenu] = useState<number | null>(null)
  const [tick, setTick] = useState(0)
  
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { statuses: wsStatuses } = useServerStatus()
  const { subscribe } = useWebSocket()
  const [installingGames, setInstallingGames] = useState<Record<string, { status: string, progress: number }>>({})

  const onDragEnd = useCallback(async (result: DropResult) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const items = Array.from(servers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Optimistic update
    setServers(items)

    try {
      const payload = items.map((s, idx) => ({ id: s.id!, sortOrder: idx }))
      await ServerService.reorder(payload)
    } catch (err) {
      console.error("Failed to reorder servers", err)
      showToast("Failed to save new server order", "error")
      // Revert on failure
      loadServers()
    }
  }, [servers, showToast])

  // Force re-render every second to update the uptime counter dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Close Headless Client popover menu on clicking outside
  useEffect(() => {
    if (activeHCMenu === null) return
    const handleOutsideClick = () => {
      setActiveHCMenu(null)
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [activeHCMenu])

  const loadServers = async () => {
    try {
      const data = await ServerService.getAll()
      setServers(data || [])
    } catch (err) {
      console.error("Failed to load servers", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServers()
    const unsubUpdated = subscribe('server_updated', (e) => {
      // Don't reload if it's just a reorder event, as we've already done an optimistic update
      if (e.payload?.type === 'reordered') return
      loadServers()
    })
    
    const unsubProgress = subscribe('install_progress', (e) => {
      const { gameType, status, progress } = e.payload
      // If it's a server update (not a mod)
      if (gameType) {
        setInstallingGames(prev => {
          if (status === 'FINISHED' || status === 'SUCCESS') {
            const next = { ...prev }
            delete next[gameType]
            setTimeout(loadServers, 1000)
            return next
          }
          return {
            ...prev,
            [gameType]: { status, progress: progress || 0 }
          }
        })
      }
    })

    return () => {
      unsubUpdated()
      unsubProgress()
    }
  }, [subscribe])

  // Combine data into instances
  const serverInstances = useMemo(() => {
    return servers.map(server => {
      const sId = server.id!;
      const wsStatus = wsStatuses[sId];
      const isAlive = optimisticStatuses[sId] ?? !!wsStatus?.alive;
        
      return {
        server,
        status: {
          alive: isAlive,
          playersOnline: wsStatus?.info?.players ?? 0,
          map: wsStatus?.info?.map ?? '',
          mission: wsStatus?.info?.mission ?? '',
          maxPlayers: wsStatus?.info?.maxPlayers ?? server.maxPlayers,
          startedAt: wsStatus?.info?.startedAt ?? null,
          headlessClientsCount: wsStatus?.info?.headlessClientsCount ?? 0
        }
      };
    })
  }, [servers, wsStatuses, optimisticStatuses, tick]);

  const isServerWithSamePortRunning = (server: AnyServerDto) => {
    return serverInstances.some((inst: any) => 
      inst.server.id !== server.id && 
      (inst.server.port === server.port || inst.server.queryPort === server.queryPort) && 
      inst.status.alive
    );
  };

  const handleStart = async (id: number) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;
    
    if (isServerWithSamePortRunning(server)) {
      showToast("Another server with the same port is already running", "error")
      return
    }

    setOptimisticStatuses(prev => ({ ...prev, [id]: true }));
    try {
      await ServerService.start(id)
    } catch (err: any) {
      setOptimisticStatuses(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast(err?.message || "Failed to start server", "error")
    }
  };

  const handleStop = async (id: number) => {
    setOptimisticStatuses(prev => ({ ...prev, [id]: false }));
    try {
      await ServerService.stop(id)
    } catch (err: any) {
      setOptimisticStatuses(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast(err?.message || "Failed to stop server", "error")
    }
  };

  const handleRestart = async (id: number) => {
    setOptimisticStatuses(prev => ({ ...prev, [id]: false }));
    try {
      await ServerService.restart(id)
    } catch (err: any) {
      setOptimisticStatuses(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast(err?.message || "Failed to restart server", "error")
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serverToDelete?.id) return
    try {
      await ServerService.delete(serverToDelete.id)
      setServers(prev => prev.filter(s => s.id !== serverToDelete.id))
      showToast(`Server '${serverToDelete.name}' deleted`, "success")
      setServerToDelete(null)
    } catch (err) {
      console.error(err)
      showToast("Failed to delete server", "error")
    }
  }

  const handleDuplicate = async (server: AnyServerDto) => {
    try {
      const duplicated = { ...server, name: server.name + " (copy)", id: undefined }
      await ServerService.save(duplicated)
      showToast(`Server '${server.name}' duplicated`, "success")
      loadServers()
    } catch (err: any) {
      showToast(err?.message || "Failed to duplicate server", "error")
    }
  }

  const handleHCAdd = async (server: AnyServerDto) => {
    try {
      if (!isArma3Server(server) || !server.id) return
      await ServerService.addHeadlessClient(server.id)
      showToast("Headless Client started", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to start Headless Client", "error")
    }
  }

  const handleHCRemove = async (server: AnyServerDto) => {
    try {
      if (!isArma3Server(server) || !server.id) return
      await ServerService.removeHeadlessClient(server.id)
      showToast("Headless Client stopped", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to stop Headless Client", "error")
    }
  }


  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p>Loading servers...</p>
    </div>
  )

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Servers</h1>
        </div>
        <div className="flex flex-wrap gap-3">
           <Button variant="outline" size="sm" onClick={() => navigate('/servers/new/ARMA3')} className="border-border bg-surface-elevated/50 hover:bg-surface">
             <Plus className="w-4 h-4 mr-2" /> Arma 3
           </Button>
           <Button variant="outline" size="sm" onClick={() => navigate('/servers/new/REFORGER')} className="border-border bg-surface-elevated/50 hover:bg-surface">
             <Plus className="w-4 h-4 mr-2" /> Reforger
           </Button>
           <Button variant="outline" size="sm" onClick={() => navigate('/servers/new/DAYZ')} className="border-border bg-surface-elevated/50 hover:bg-surface">
             <Plus className="w-4 h-4 mr-2" /> DayZ
           </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="servers-list">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-4"
            >
              {serverInstances.length === 0 && (
                 <div className="p-20 text-center border border-dashed border-border rounded-xl bg-surface/30">
                   <div className="max-w-xs mx-auto">
                     <Plus className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                     <h3 className="text-lg font-semibold text-foreground">No servers deployed</h3>
                     <p className="text-muted-foreground mt-1">Select a game type above to initialize your first instance.</p>
                   </div>
                 </div>
              )}
              {serverInstances.map((instance, index) => (
                <ServerCardItem 
                  key={instance.server.id}
                  instance={instance}
                  index={index}
                  installingGames={installingGames}
                  activeHCMenu={activeHCMenu}
                  setActiveHCMenu={setActiveHCMenu}
                  handleStart={handleStart}
                  handleStop={handleStop}
                  handleRestart={handleRestart}
                  handleDuplicate={handleDuplicate}
                  setServerToDelete={setServerToDelete}
                  handleHCAdd={handleHCAdd}
                  handleHCRemove={handleHCRemove}
                  isServerWithSamePortRunning={isServerWithSamePortRunning}
                  navigate={navigate}
                  showToast={showToast}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ConfirmationDialog 
        open={!!serverToDelete}
        onOpenChange={(open) => !open && setServerToDelete(null)}
        title="Delete Server"
        description={`Are you sure you want to delete '${serverToDelete?.name}'? All configurations will be lost.`}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
