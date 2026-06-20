/**
 * ModCard Component
 * Renders a single installed mod item.
 * Logic: Displays metadata, installation status, and handles user interactions (update, delete, server-only toggle).
 * Context: Used in the 'Workshop Mods' tab of the ModsPage.
 */
import React from 'react'
import { Download, Trash2, Calendar, Clock, RefreshCw } from 'lucide-react'
import { Button, cn } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Switch } from '../ui/Switch'

interface ModCardProps {
  mod: any
  onUpdate: (mod: any) => void
  onDelete: (mod: any) => void
  onToggleServerOnly: (mod: any) => void
  isUpdating: boolean
}

export const ModCard: React.FC<Readonly<ModCardProps>> = ({
  mod,
  onUpdate,
  onDelete,
  onToggleServerOnly,
  isUpdating
}) => {
  let statusVariant: 'success' | 'danger' | 'secondary' | 'warning' = 'secondary';
  if (mod.installationStatus === 'FINISHED') {
    if (mod.needsUpdate) statusVariant = 'warning';
    else statusVariant = 'success';
  }
  else if (mod.installationStatus === 'ERROR') statusVariant = 'danger';

  let statusText = mod.installationStatus;
  if (mod.installationStatus === 'FINISHED') {
    if (mod.needsUpdate) statusText = 'UPDATE AVAILABLE';
    else statusText = 'INSTALLED';
  }
  else if (mod.installationStatus === 'INSTALLATION_IN_PROGRESS') {
    statusText = (mod.needsUpdate || mod.fileSize > 0) ? 'UPDATING' : 'DOWNLOADING';
  }

  return (
    <Card key={mod.id} className="group border-border bg-surface-elevated/40 hover:bg-surface-elevated/60 transition-all duration-300">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="shrink-0">
          <a 
            href={`https://steamcommunity.com/workshop/filedetails/?id=${mod.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform hover:scale-105 active:scale-95"
          >
            {mod.thumbnail ? (
              <img src={mod.thumbnail} className="w-16 h-16 rounded-md object-cover bg-surface border border-border" alt={mod.name} />
            ) : (
              <div className="w-16 h-16 rounded-md bg-surface border border-border flex items-center justify-center text-muted-foreground/50">
                 <Download className="w-6 h-6" />
              </div>
            )}
          </a>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-foreground truncate text-base group-hover:text-primary transition-colors" title={mod.name}>
              <a 
                href={`https://steamcommunity.com/workshop/filedetails/?id=${mod.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline decoration-primary/50 underline-offset-4"
              >
                {mod.name || `Mod ${mod.id}`}
              </a>
            </h3>
            <Badge 
              variant={statusVariant} 
              className="text-[9px] uppercase tracking-widest h-5 px-2 flex items-center gap-1.5"
            >
              {mod.installationStatus === 'INSTALLATION_IN_PROGRESS' && (
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              )}
              {statusText}
            </Badge>
            <Badge variant="outline" className="text-[9px] font-mono uppercase tracking-widest h-5 px-2 text-muted-foreground border-muted-foreground/30">
              {mod.serverType}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1">
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">ID: {mod.id}</span>
            {mod.fileSize && (
              <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">
                {(mod.fileSize / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
            {mod.lastUpdated && (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                <Calendar className="w-3 h-3" />
                {new Date(mod.lastUpdated).toLocaleDateString()}
                <Clock className="w-3 h-3 ml-1.5" />
                {new Date(mod.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 md:pl-4 md:border-l border-border/50">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest transition-colors",
              mod.serverOnly ? "text-primary" : "text-muted-foreground"
            )}>
              Server Only
            </span>
            <Switch 
              checked={mod.serverOnly} 
              onCheckedChange={() => onToggleServerOnly(mod)}
            />
          </div>

          <div className="flex items-center gap-1.5 border-l border-border/50 pl-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10" 
              onClick={() => onUpdate(mod)}
              disabled={isUpdating}
              title="Update Mod"
            >
              <RefreshCw className={cn("w-4 h-4", isUpdating && "animate-spin")} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
              onClick={() => onDelete(mod)}
              title="Delete Mod"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
