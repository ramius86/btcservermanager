import { useCallback, useEffect, useState, useMemo } from 'react'
import { formatUptime } from '../utils/time'

import { Cpu, MemoryStick as Memory, Server, ShieldCheck, Download, RefreshCw, Layers, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ServerService } from '../services/api'
import { Progress } from '../components/ui/Progress'
import { useToast } from '../components/ui/Toast'
import { useSystemInfo } from '../contexts/SystemInfoContext'
import { useServerStatus } from '../contexts/ServerStatusContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { AnyServerDto, ServerInstallationDto } from '../dtos/ServerDto'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/DropdownMenu'
import { FoxEasterEgg } from '../components/FoxEasterEgg'

// Map of Steam AppIDs to game types for WebSocket sync
const appIdToType: Record<number, string> = {
  107410: 'ARMA3',
  233780: 'ARMA3', // Dedicated Server AppID
  221100: 'DAYZ',
  223350: 'DAYZ', // Dedicated Server AppID
  1024020: 'DAYZ_EXP',
  1042420: 'DAYZ_EXP', // Dedicated Server AppID
  1874900: 'REFORGER',
}

function useServersStatusSync(wsStatuses: any) {
  const [servers, setServers] = useState<AnyServerDto[]>([])

  const fetchServers = useCallback(() => {
    ServerService.getAll().then((data) => {
      let list: any[] = []
      if (data) {
        list = Array.isArray(data) ? data : (data as any).servers || []
      }
      setServers(list)
    }).catch(console.error)
  }, [])

  const serversWithStatus = useMemo(() => {
    return servers.map(srv => {
      const wsStatus = wsStatuses[srv.id!]
      if (wsStatus !== undefined) {
        return { ...srv, status: wsStatus.alive ? 'Running' : 'Stopped' }
      }
      return { ...srv, status: 'Stopped' }
    })
  }, [servers, wsStatuses])

  return { servers: serversWithStatus, fetchServers }
}

function applyInstallationsUpdate(installations: ServerInstallationDto[], wsInstallations: any) {
  return installations.map(inst => {
    const matchingIds = Object.keys(appIdToType).filter(id => appIdToType[Number.parseInt(id, 10)] === inst.type)
    
    let wsInfo = null
    for (const id of matchingIds) {
      if (wsInstallations[id]) {
        wsInfo = wsInstallations[id]
        break
      }
    }
    
    if (wsInfo) {
      let status = 'INSTALLING'
      if (wsInfo.status === 'SUCCESS') status = 'FINISHED'
      else if (wsInfo.status === 'VERIFYING') status = 'VERIFYING'
      else if (wsInfo.status === 'PREALLOCATING') status = 'PREALLOCATING'
      else if (wsInfo.status === 'COMMITTING') status = 'COMMITTING'

      return { 
        ...inst, 
        progress: wsInfo.progress,
        installationStatus: status
      }
    }

    if (inst.installationStatus === 'INSTALLATION_IN_PROGRESS') {
      return { ...inst, installationStatus: 'INSTALLING' }
    }

    return inst
  })
}

function useInstallationsSync(wsInstallations: any) {
  const [installations, setInstallations] = useState<ServerInstallationDto[]>([])

  const fetchInstallations = useCallback(() => {
    ServerService.getInstallations().then(setInstallations).catch(console.error)
  }, [])

  useEffect(() => {
    setInstallations(prev => applyInstallationsUpdate(prev, wsInstallations))
  }, [wsInstallations])

  return { installations, fetchInstallations }
}

export function DashboardPage() {
  const { showToast } = useToast()
  const { systemInfo: sysInfo } = useSystemInfo()
  const { installations: wsInstallations, statuses: wsStatuses } = useServerStatus()
  
  const { servers, fetchServers } = useServersStatusSync(wsStatuses)
  const { installations, fetchInstallations } = useInstallationsSync(wsInstallations)
  const { subscribe } = useWebSocket()

  useEffect(() => {
    fetchServers()
    fetchInstallations()

    const unsubscribe = subscribe('server_updated', () => {
      fetchServers()
      fetchInstallations()
    })

    return () => unsubscribe()
  }, [subscribe, fetchServers, fetchInstallations])

  const handleUpdate = async (type: string) => {
    try {
      await ServerService.installOrUpdate(type)
      showToast(`${type} installation/update started.`, 'success')
      fetchInstallations()
    } catch (err) {
      console.error(err)
      showToast(`Failed to start ${type} update.`, 'error')
    }
  }
  
  const handleSetBranch = async (type: string, branch: string) => {
    try {
      await ServerService.setBranch(type, branch)
      showToast(`Branch set to ${branch} for ${type}.`, 'success')
      fetchInstallations()
    } catch (err) {
      console.error(err)
      showToast(`Failed to set branch for ${type}.`, 'error')
    }
  }

  const handleUninstall = async (type: string) => {
    try {
      await ServerService.uninstall(type)
      showToast(`${type} successfully uninstalled.`, 'success')
      fetchInstallations()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || `Failed to uninstall ${type}.`, 'error')
    }
  }

  const activeServers = servers.filter(s => s.status === 'Running').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
      {sysInfo?.fox_easter_egg && <FoxEasterEgg />}
      {/* Primary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="CPU Load"
              value={sysInfo?.cpu_usage === undefined ? '...' : `${(sysInfo.cpu_usage * 100).toFixed(1)}%`}
              icon={Cpu}
              color="text-blue-400"
              bgColor="bg-blue-500/10"
              progress={sysInfo?.cpu_usage === undefined ? 0 : sysInfo.cpu_usage * 100}
            />
        <StatsCard
          title="Memory"
          value={sysInfo?.memory_usage === undefined ? '...' : `${(sysInfo.memory_usage / 1024 / 1024 / 1024).toFixed(1)} GB`}
          icon={Memory}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          progress={sysInfo?.memory_usage && sysInfo?.total_memory ? (sysInfo.memory_usage / sysInfo.total_memory * 100) : 0}
          subtext={sysInfo?.total_memory ? `of ${(sysInfo.total_memory / 1024 / 1024 / 1024).toFixed(1)} GB` : ''}
        />
        <StatsCard
          title="Active Servers"
          value={activeServers}
          icon={Server}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
          progress={(activeServers / (servers.length || 1)) * 100}
          subtext={`out of ${servers.length} total`}
        />
        <StatsCard
          title="Storage Used"
          value={sysInfo?.disk_total ? `${(sysInfo.disk_used / 1024 / 1024 / 1024).toFixed(1)} GB` : '0.0 GB'}
          icon={Layers}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
          progress={sysInfo?.disk_total ? (sysInfo.disk_used / sysInfo.disk_total * 100) : 0}
          subtext={sysInfo?.disk_total ? `of ${(sysInfo.disk_total / 1024 / 1024 / 1024).toFixed(1)} GB` : ''}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-border bg-surface-elevated/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Host Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface rounded-md space-y-3 border border-border">
                <DetailRow label="Hostname" value={sysInfo?.hostname || '...'} />
                <DetailRow label="Distribution" value={sysInfo?.os_name || '...'} />
                <DetailRow label="Kernel" value={sysInfo?.kernel || '...'} />
                <DetailRow label="CPU Model" value={sysInfo?.cpu_model || '...'} />
                <DetailRow label="CPU Cores" value={sysInfo?.cpu_count || '...'} />
                <div className="pt-2 border-t border-border">
                  <DetailRow label="Local IP" value={sysInfo?.local_ip || '...'} />
                  <DetailRow label="Public IP" value={sysInfo?.public_ip || '...'} />
                </div>
                <div className="pt-2 border-t border-border">
                  <DetailRow label="System Uptime" value={sysInfo?.uptime === undefined ? '...' : formatUptime(sysInfo.uptime)} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`overflow-hidden border-border backdrop-blur-sm ${sysInfo?.steam_authenticated ? 'bg-surface-elevated/50' : 'bg-amber-500/10 border-amber-500/50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${sysInfo?.steam_authenticated ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                Steam Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-black ${sysInfo?.steam_authenticated ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {sysInfo?.steam_authenticated ? 'AUTHENTICATED' : 'SETUP REQUIRED'}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                    {sysInfo?.steam_authenticated ? `Logged in as ${sysInfo.steam_username}` : 'SteamCMD requires credentials'}
                  </p>
                </div>
                {!sysInfo?.steam_authenticated && (
                  <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-500 hover:bg-amber-500/10 text-[10px] font-bold uppercase" onClick={() => globalThis.location.href = '/config'}>
                    Fix Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {sysInfo && !sysInfo.steam_api_key_configured && (
            <Card className="overflow-hidden border-red-500/50 bg-red-500/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Steam API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-red-600 dark:text-red-400">
                      MISSING
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                      STEAM_API_KEY not set in environment
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-500/50 text-red-600 dark:text-red-500 hover:bg-red-500/10 text-[10px] font-bold uppercase" 
                    onClick={() => globalThis.location.href = '/config'}
                  >
                    View Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Installations Section */}
        <Card className="lg:col-span-8 border-border bg-surface-elevated/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Download className="w-6 h-6 text-primary" />
                Core Installations
              </CardTitle>
              <CardDescription>Managed game binary versions and branches</CardDescription>
            </div>
            <Button size="icon" variant="ghost" onClick={() => fetchInstallations()} className="text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {installations.map((inst) => {
                const serversConfiguredCount = servers.filter(s => s.type === inst.type).length;
                return (
                  <InstallationItem 
                    key={inst.type} 
                    inst={inst} 
                    serversConfiguredCount={serversConfiguredCount}
                    onUpdate={handleUpdate} 
                    onSetBranch={handleSetBranch} 
                    onUninstall={handleUninstall}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function StatsCard({ title, value, icon: Icon, color, bgColor, progress, subtext }: Readonly<{ 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  bgColor: string; 
  progress?: number; 
  subtext?: string; 
}>) {
  return (
    <Card className="overflow-hidden border-border bg-surface-elevated/50 backdrop-blur-sm group hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgColor} rounded-md shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{title}</h3>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg font-black text-foreground tabular-nums leading-none">{value}</span>
              {subtext && <span className="text-[8px] text-muted-foreground font-bold uppercase truncate">{subtext}</span>}
            </div>
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-2.5">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, value }: Readonly<{ label: string, value: any }>) {
  return (
    <div className="flex justify-between items-start text-xs">
      <span className="text-muted-foreground font-medium shrink-0 pr-4">{label}</span>
      <span className="text-foreground font-bold font-mono text-right">{value}</span>
    </div>
  )
}

function getInstallationIcon(type: string) {
  if (type === 'DAYZ_EXP') return '/dayzexp.png'
  if (type === 'ARMA3') return '/arma3.png'
  if (type === 'DAYZ') return '/dayz.png'
  if (type === 'REFORGER') return '/reforger.png'
  return `/${type.toLowerCase()}.png`
}

function getInstallationLabel(status: string) {
  if (status === 'INSTALLATION_IN_PROGRESS') return 'Initializing...'
  if (status === 'INSTALLING') return 'Installing...'
  if (status === 'VERIFYING') return 'Verifying...'
  if (status === 'PREALLOCATING') return 'Allocating...'
  if (status === 'COMMITTING') return 'Finalizing...'
  return status.toLowerCase()
}

function hasNewVersion(inst: ServerInstallationDto) {
  if (inst.installationStatus !== 'FINISHED' || !inst.availableVersion) return false
  if (inst.installedBuildId) {
    return Number(inst.availableVersion) > Number(inst.installedBuildId)
  }
  return inst.version && /^\d+$/.test(inst.availableVersion) === /^\d+$/.test(inst.version) && inst.availableVersion !== inst.version
}

function BranchSelector({ inst, onSetBranch }: Readonly<{ inst: ServerInstallationDto, onSetBranch: (type: string, branch: string) => void }>) {
  if (inst.availableBranches && inst.availableBranches.length > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none group/branch flex items-center gap-1.5">
            <Badge variant="secondary" className="h-5 text-[9px] font-bold tracking-widest px-2 cursor-pointer border-transparent hover:border-primary/30 transition-all flex items-center gap-1 bg-surface-elevated">
              {inst.branch}
              <Layers className="w-2.5 h-2.5 opacity-40 group-hover/branch:opacity-100 transition-opacity" />
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 bg-surface-elevated border-border p-1">
          {inst.availableBranches.map(b => (
            <DropdownMenuItem key={b} onClick={() => onSetBranch(inst.type, b)} className="text-[10px] font-bold uppercase tracking-widest py-2 rounded-md cursor-pointer">
              {b}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  return (
    <Badge variant="secondary" className="h-5 text-[9px] font-bold tracking-widest px-2 border-transparent bg-surface-elevated">
      {inst.branch}
    </Badge>
  )
}

function InstallationItem({ 
  inst, 
  serversConfiguredCount,
  onUpdate, 
  onSetBranch,
  onUninstall
}: Readonly<{ 
  inst: ServerInstallationDto, 
  serversConfiguredCount: number,
  onUpdate: (type: string) => void, 
  onSetBranch: (type: string, branch: string) => void,
  onUninstall: (type: string) => void
}>) {
  const { showToast } = useToast()
  const isInstalling = ['INSTALLATION_IN_PROGRESS', 'INSTALLING', 'VERIFYING', 'PREALLOCATING', 'COMMITTING'].includes(inst.installationStatus)
  const isFinished = inst.installationStatus === 'FINISHED'
  const isDifferentBranch = inst.installedBranch && inst.branch !== inst.installedBranch
  const hasUpdate = hasNewVersion(inst)

  const handleUninstallClick = () => {
    if (serversConfiguredCount > 0) {
      showToast(`You must delete all configured ${inst.type} instances before uninstalling.`, 'error')
      return
    }

    if (globalThis.confirm(`DANGER: You are about to uninstall ${inst.type}.\n\nThis will permanently delete all game files, including custom scenarios in mpmissions and saved profiles.\n\nAre you absolutely sure?`)) {
      onUninstall(inst.type)
    }
  }

  return (
    <div className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 pr-12 md:p-6 md:pr-14 gap-4 md:gap-0 bg-surface/50 rounded-md border border-border hover:border-primary/30 transition-all duration-300">
      
      {inst.installationStatus !== 'NOT_INSTALLED' && !isInstalling && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface-elevated border-border min-w-[140px] mt-1">
              <DropdownMenuItem 
                onClick={handleUninstallClick}
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer font-bold text-xs py-2"
              >
                Uninstall Game
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex-1 flex items-center gap-6">
        <div className="w-14 h-14 bg-surface rounded-md flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors shrink-0">
          <img 
            src={getInstallationIcon(inst.type)} 
            alt={inst.type} 
            className="h-10 w-10 object-contain dark:invert-0 invert"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-[1.2fr_1fr_1fr] sm:gap-4 items-center">
          <div className="min-w-0">
            <h4 className="text-lg font-bold text-foreground tracking-tight truncate mb-1">
              {inst.type === 'DAYZ_EXP' ? 'DAYZ EXP' : inst.type}
            </h4>
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Version</span>
              <span className="text-xs font-mono text-primary/90 truncate">{inst.version || 'Unknown'}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Branch</span>
            <div className="flex items-center gap-2">
              <BranchSelector inst={inst} onSetBranch={onSetBranch} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Last Updated</span>
            <div className="flex flex-col">
              <span className="text-xs text-foreground/70">
                {inst.lastUpdatedAt ? new Date(inst.lastUpdatedAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Never'}
              </span>
              {hasUpdate && (
                <Badge className="mt-1 w-fit h-3.5 text-[8px] bg-yellow-500/20 text-yellow-500 border-yellow-500/30 px-1 font-bold uppercase tracking-tighter">
                  New version
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
        <div className="flex flex-col items-end min-w-[140px]">
          {isInstalling ? (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
                <span>{getInstallationLabel(inst.installationStatus)}</span>
                <span className="ml-2 font-mono">{Math.round(inst.progress || 0)}%</span>
              </div>
              <Progress value={inst.progress || 0.1} className="h-1.5 bg-primary/10" />
            </div>
          ) : (
            <Badge variant={isFinished ? 'success' : 'secondary'} className="px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em]">
              {isFinished ? 'INSTALLED' : (inst.installationStatus?.replace('_', ' ') || 'NOT INSTALLED')}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={(isFinished && !isDifferentBranch) ? 'outline' : 'primary'}
            onClick={() => onUpdate(inst.type)}
            disabled={isInstalling}
            className={`min-w-[100px] transition-all duration-500 ${
              isDifferentBranch ? 'animate-pulse shadow-[0_0_20px_var(--color-primary)]/40 border-primary' : ''
            }`}
          >
            {inst.installationStatus === 'NOT_INSTALLED' && 'Install'}
            {inst.installationStatus !== 'NOT_INSTALLED' && isDifferentBranch && 'Switch branch'}
            {inst.installationStatus !== 'NOT_INSTALLED' && !isDifferentBranch && hasUpdate && 'Update'}
            {inst.installationStatus !== 'NOT_INSTALLED' && !isDifferentBranch && !hasUpdate && 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  )
}
