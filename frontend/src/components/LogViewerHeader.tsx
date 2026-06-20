/**
 * Log viewer header.
 * Features: Live status, Export/Fullscreen/Autoscroll controls, View tabs.
 * Parent: LogExplorerPage
 */
import React from 'react'
import { Button } from './ui/Button'
import { Download, FileText, Activity, LayoutDashboard, Maximize2, Minimize2 } from 'lucide-react'

interface LogViewerHeaderProps {
  selectedFile: string | null
  logType: 'steamcmd' | 'server'
  selectedGame: string
  view: string
  autoScroll: boolean
  isFullscreen: boolean
  onToggleAutoScroll: () => void
  onDownload: () => void
  onToggleFullscreen: () => void
  onViewChange: (view: string) => void
  isLive: boolean
}

export const LogViewerHeader: React.FC<Readonly<LogViewerHeaderProps>> = ({
  selectedFile,
  logType,
  selectedGame,
  view,
  autoScroll,
  isFullscreen,
  onToggleAutoScroll,
  onDownload,
  onToggleFullscreen,
  onViewChange,
  isLive
}) => {
  return (
    <div className="p-3 md:p-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-surface-elevated/30">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-8 h-8 bg-surface rounded-md flex items-center justify-center border border-border">
          <Activity className={`h-4 w-4 ${isLive ? 'text-success animate-pulse' : 'text-primary'}`} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground tracking-tight truncate max-w-[40vw]">{selectedFile || 'Standby for Source Selection'}</h3>
          {isLive && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <p className="text-[9px] uppercase font-bold text-success tracking-widest">Live Stream Active</p>
            </div>
          )}
        </div>
      </div>

      {/* View Tabs */}
      {logType === 'server' && selectedGame === 'REFORGER' && (
        <div className="flex bg-muted p-1 rounded-lg border border-border">
          <button 
            onClick={() => onViewChange('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'logs' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Logs
          </button>
          <button 
            onClick={() => onViewChange('performance')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'performance' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Performance
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2 md:mt-0 self-end md:self-auto">
          {view === 'logs' && (
            <>
              {isLive && (
                <div className="flex items-center gap-1 bg-surface border border-border rounded-md pl-2.5 pr-1 h-8">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mr-1 select-none">
                    Live Feed
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onToggleAutoScroll} 
                    className={`h-6 px-2 text-[10px] font-bold uppercase tracking-widest ${autoScroll ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {autoScroll ? 'On' : 'Off'}
                  </Button>
                </div>
              )}
              <Button onClick={onDownload} size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFullscreen} 
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}
