import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Server, Package, Map, Settings, FileText, Sun, Moon, Clock, CalendarDays } from 'lucide-react'
import { cn } from './ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useSystemInfo } from '../contexts/SystemInfoContext'
import { WorkshopService } from '../services/api'
import { useWebSocket } from '../contexts/WebSocketContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Server, label: 'Servers', href: '/servers' },
  { icon: Package, label: 'Mods', href: '/mods' },
  { icon: Map, label: 'Scenarios', href: '/scenarios' },
  { icon: FileText, label: 'Logs', href: '/logs' },
  { icon: CalendarDays, label: 'Events', href: '/events' },
  { icon: Settings, label: 'Settings', href: '/config' },
]

export function Sidebar() {
  const { theme, toggleTheme } = useTheme()
  const { systemInfo } = useSystemInfo()
  const [time, setTime] = useState(new Date())
  const { subscribe } = useWebSocket()
  const [hasModUpdates, setHasModUpdates] = useState(false)

  const isEasterEggEnabled = !!systemInfo?.fox_easter_egg

  const handleLogoClick = () => {
    if (isEasterEggEnabled) {
      globalThis.dispatchEvent(new CustomEvent('trigger-fox-tactical'))
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const checkUpdates = () => {
      WorkshopService.getUpdateStatus()
        .then(res => setHasModUpdates(res.hasUpdates))
        .catch(err => console.error("Failed to check mod updates:", err))
    }
    
    checkUpdates()

    const unsubMetadata = subscribe('mod_metadata_updated', (e) => {
      if (e.payload?.needsUpdate) {
        setHasModUpdates(true)
      }
    })

    const unsubInstall = subscribe('install_progress', (e) => {
      if (e.payload?.status === 'FINISHED') {
        // Re-check global status since one finished, there might be 0 left
        checkUpdates()
      }
    })

    return () => {
      unsubMetadata()
      unsubInstall()
    }
  }, [subscribe])

  return (
    <>
      {/* ─── MOBILE: Fixed bottom navigation bar ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-row items-center justify-start overflow-x-auto no-scrollbar border-t border-border bg-surface/95 backdrop-blur-md h-16 px-2 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) => {
              let stateClasses = "text-muted-foreground"
              if (isActive) {
                stateClasses = "text-primary"
              } else if (item.label === 'Mods' && hasModUpdates) {
                stateClasses = "text-red-500"
              }
              return cn(
                "relative flex flex-col items-center justify-center shrink-0 gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 min-w-[56px]",
                stateClasses
              )
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">{item.label}</span>
                {item.label === 'Mods' && hasModUpdates && !isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center shrink-0 gap-0.5 px-2 py-1 rounded-lg text-muted-foreground transition-all min-w-[56px] ml-auto pr-4"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Theme</span>
        </button>
      </nav>

      {/* ─── DESKTOP: Vertical sidebar ─── */}
      <aside className="hidden md:flex w-[180px] flex-col border-r border-border bg-surface transition-all duration-300">
        <div className="p-4 pt-8 pb-6">
          <button
            type="button" 
            onClick={isEasterEggEnabled ? handleLogoClick : undefined}
            className={cn(
              "flex flex-col items-center gap-3 group text-center select-none w-full bg-transparent border-none appearance-none p-0 outline-none",
              isEasterEggEnabled ? "cursor-pointer" : "cursor-default"
            )}
          >
            <div className="shrink-0">
              <img src="/btclogo.png" alt="Black Templars Logo" className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-black tracking-tighter text-foreground uppercase leading-tight">BTC</span>
              <span className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">Server Manager</span>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 px-2.5 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) => {
                let stateClasses = "text-muted-foreground hover:bg-accent/30 hover:text-foreground border border-transparent"
                if (isActive) {
                  stateClasses = "bg-primary/10 text-primary border border-primary/20"
                } else if (item.label === 'Mods' && hasModUpdates) {
                  stateClasses = "text-red-500 animate-pulse border border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                }
                return cn(
                  "flex items-center gap-3 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-md transition-all duration-200 group",
                  stateClasses
                )
              }}
            >
              <item.icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border/50 bg-surface-elevated/10">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-foreground tabular-nums tracking-wider leading-none">
                {time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {systemInfo?.timezone && (
                <span className="text-[8px] font-mono font-black text-primary/70 tracking-widest uppercase mt-1">
                  {systemInfo.timezone}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Ver.</span>
              <span className="text-[9px] font-mono text-muted-foreground/60">{systemInfo?.app_version || '6.7'}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md bg-surface border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all active:scale-95"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
