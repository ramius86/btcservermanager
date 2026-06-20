/**
 * Left sidebar for Log Explorer.
 * Features: Game selection, file search, and log list.
 * Parent: LogExplorerPage
 */
import React, { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { FileText, Search, Trash2 } from 'lucide-react'
import { ConfirmationDialog } from './ui/ConfirmationDialog'

interface LogSidebarProps {
  logType: 'steamcmd' | 'server'
  selectedGame: string
  selectedFile: string | null
  searchTerm: string
  files: string[]
  liveFiles: Set<string>
  onSelectGroup: (type: 'steamcmd' | 'server', gameId?: string) => void
  onSelectFile: (file: string) => void
  onSearchChange: (term: string) => void
  onDeleteFile: (file: string, e: React.MouseEvent) => void
  onDeleteAll: () => void
}

const steamCmdRegex = /^steamcmd_(\d{4})(\d{2})(\d{2})\.log$/;
const hcRegex = /^([A-Z0-9]+)_(\d+)_HC(\d+)_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.log$/;
const serverRegex = /^([A-Z0-9]+)_(\d+)_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\.log$/;

const formatLogName = (filename: string) => {
  // steamcmd_20260614.log -> SteamCMD - 14/06/2026
  let match = steamCmdRegex.exec(filename);
  if (match) {
    return `SteamCMD - ${match[3]}/${match[2]}/${match[1]}`;
  }

  // ARMA3_2_HC1_20260614_203105.log -> [Inst 2] 14/06/2026 20:31:05 (HC 1)
  match = hcRegex.exec(filename);
  if (match) {
    return `[Inst ${match[2]}] ${match[6]}/${match[5]}/${match[4]} ${match[7]}:${match[8]}:${match[9]} (HC ${match[3]})`;
  }

  // ARMA3_2_20260614_203105.log -> [Inst 2] 14/06/2026 20:31:05
  match = serverRegex.exec(filename);
  if (match) {
    return `[Inst ${match[2]}] ${match[5]}/${match[4]}/${match[3]} ${match[6]}:${match[7]}:${match[8]}`;
  }

  return filename;
}

export const LogSidebar: React.FC<Readonly<LogSidebarProps>> = ({
  logType,
  selectedGame,
  selectedFile,
  searchTerm,
  files,
  liveFiles,
  onSelectGroup,
  onSelectFile,
  onSearchChange,
  onDeleteFile,
  onDeleteAll
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const gameGroups = [
    { id: 'SYSTEM', label: 'Steam', img: '/steam.svg', type: 'steamcmd' },
    { id: 'ARMA3', label: 'Arma 3', img: '/arma3.png', type: 'server' },
    { id: 'REFORGER', label: 'Reforger', img: '/reforger.png', type: 'server' },
    { id: 'DAYZ', label: 'DayZ', img: '/dayz.png', type: 'server' }
  ]

  const activeGroupFiles = logType === 'steamcmd' 
    ? files.filter(f => f.startsWith('steamcmd'))
    : files.filter(f => f.startsWith(selectedGame))

  return (
    <Card 
      style={{ width: 'var(--sidebar-width)' }}
      className="flex shrink-0 overflow-hidden bg-surface-elevated/50 border-border backdrop-blur-sm w-full md:w-auto h-full"
    >
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Clear All Logs"
        description={`This will permanently delete all ${logType === 'steamcmd' ? 'SteamCMD' : 'Game Server'} log files. This action cannot be undone.`}
        onConfirm={onDeleteAll}
        confirmLabel="Clear Logs"
        variant="danger"
      />

      {/* Mini Sidebar Nav */}
      <div className="w-16 flex flex-col items-center py-4 gap-4 border-r border-border bg-surface/40 shrink-0">
        {gameGroups.map(group => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.type as any, group.id)}
            className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              (logType === group.type && (group.type === 'steamcmd' || selectedGame === group.id))
                ? 'bg-primary shadow-lg shadow-primary/20'
                : 'bg-surface border border-border hover:border-primary/50'
            }`}
            title={group.label}
          >
            {group.img ? (
              <img 
                src={group.img} 
                alt={group.label} 
                className={`w-6 h-6 object-contain transition-all duration-300 dark:invert-0 invert ${
                  (logType === group.type && (group.type === 'steamcmd' || selectedGame === group.id)) 
                    ? 'brightness-100' 
                    : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
                }`} 
              />
            ) : (
              <div className={(logType === group.type && group.type === 'steamcmd') ? 'text-primary-foreground' : 'text-muted-foreground'}>
                <FileText className="w-5 h-5" />
              </div>
            )}
            
            {/* Active Indicator */}
            {(logType === group.type && (group.type === 'steamcmd' || selectedGame === group.id)) && (
              <div className="absolute -left-4 w-1.5 h-6 bg-primary rounded-r-full" />
            )}
          </button>
        ))}
        
        <div className="mt-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-10 w-10 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            title="Clear All Logs"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>


      {/* List Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="p-4 border-b border-border space-y-4 bg-surface/30">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase truncate">
              {logType === 'steamcmd' ? 'Steam Logs' : `${selectedGame} Instance Logs`}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter files..."
              className="w-full bg-surface border-border text-foreground rounded-md pl-8 pr-2 py-1.5 text-xs focus:outline-none placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {activeGroupFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-40">
              <FileText className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">No logs found</span>
            </div>
          ) : (
            activeGroupFiles.map(file => (
              <button
                key={file}
                onClick={() => onSelectFile(file)}
                className={`group w-full text-left p-2.5 rounded-lg text-[12px] transition-all flex items-center gap-2.5 border ${
                  selectedFile === file
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground border-transparent'
                }`}
              >
                <FileText className={`h-3.5 w-3.5 shrink-0 ${selectedFile === file ? 'text-primary' : 'text-muted-foreground/50'}`} />
                <span className="truncate font-medium flex-1" title={file}>{formatLogName(file)}</span>
                {liveFiles.has(file) && (
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse shrink-0 mx-1 shadow-[0_0_6px_#4ade80]" title="Live Log" />
                )}
                <button
                  onClick={(e) => onDeleteFile(file, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
