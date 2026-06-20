/**
 * SteamSearchDialog Component
 * Interactive interface for searching and installing Steam Workshop mods.
 * Logic: Handles Steam Web API queries, result rendering (Grid/List views), and one-click installation.
 * Features: Internal search bar, real-time filtering, and metadata display (size, updated date).
 */
import React, { useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Download, Layers, Search, Plus, AlertCircle, RefreshCw, LayoutGrid, List, Calendar } from 'lucide-react'
import { Button, cn } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog'

const SteamModListItem = React.memo(({ mod, isInstalled, onInstall }: { mod: any, isInstalled: boolean, onInstall: (mod: any) => void }) => {
  return (
    <div className="pb-2">
      <Card className={cn(
        "group border-border bg-surface-elevated/10 hover:border-primary/40 hover:bg-surface-elevated/30 transition-all duration-200",
        isInstalled && "opacity-75"
      )}>
        <div className="px-3 py-2 flex items-center gap-4">
          <div className="shrink-0 relative">
            {mod.thumbnail ? (
              <img 
                src={mod.thumbnail} 
                className="w-12 h-12 rounded-md object-cover bg-surface border border-border" 
                alt={mod.name}
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-surface border border-border flex items-center justify-center">
                <Layers className="w-5 h-5 text-muted-foreground/20" />
              </div>
            )}
            {isInstalled && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="success" className="h-4 w-4 p-0 flex items-center justify-center rounded-full shadow-lg border-background border">
                  <Plus className="w-2.5 h-2.5 rotate-45" />
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors" title={mod.name}>
              {mod.name}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 min-w-[100px]">
                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">ID</span>
                <span className="text-[11px] font-mono text-muted-foreground/80 font-bold tracking-tighter">{mod.id}</span>
              </div>
              {mod.lastUpdated && (
                <div className="flex items-center gap-1.5 text-muted-foreground/60 border-l border-border/30 pl-4">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {new Date(mod.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              )}
              {mod.fileSize && (
                <div className="flex items-center gap-1.5 text-muted-foreground/60 border-l border-border/30 pl-4">
                  <Download className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {(mod.fileSize / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Button 
              size="sm" 
              variant={isInstalled ? "outline" : "primary"}
              className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest min-w-[120px]"
              onClick={() => onInstall(mod)}
              disabled={isInstalled}
            >
              {isInstalled ? "Installed" : "Install Mod"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
})

const renderItemContent = (_: number, mod: any, context: { installedMods: any[], onInstall: (mod: any) => void }) => {
  const isInstalled = context.installedMods.some(m => m.id === mod.id)
  return <SteamModListItem mod={mod} isInstalled={isInstalled} onInstall={context.onInstall} />
}

interface SteamSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filter: string
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onSearch: (e?: React.KeyboardEvent) => void
  isSearching: boolean
  results: any[]
  totalResults: number
  onLoadMore: () => void
  installedMods: any[]
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onInstall: (mod: any) => void
}

export const SteamSearchDialog: React.FC<Readonly<SteamSearchDialogProps>> = ({
  open,
  onOpenChange,
  filter,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  results,
  totalResults,
  onLoadMore,
  installedMods,
  viewMode,
  onViewModeChange,
  onInstall
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (viewMode === 'list') return;
    const target = e.currentTarget
    const reachedBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100
    if (reachedBottom && !isSearching && results.length < totalResults) {
      onLoadMore()
    }
  }

  const renderContent = () => {
    if (isSearching && results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <RefreshCw className="w-14 h-14 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/70 animate-pulse">Querying Steam Servers...</p>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-30">
          <div className="w-20 h-20 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-2">
            <Search className="w-10 h-10" />
          </div>
          <p className="text-lg font-black uppercase tracking-widest">No results found</p>
          <p className="text-sm font-medium">Try searching for a different keyword or Workshop ID</p>
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <Virtuoso
          customScrollParent={scrollRef.current || undefined}
          data={results}
          context={{ installedMods, onInstall }}
          endReached={() => {
            if (!isSearching && results.length < totalResults) {
              onLoadMore()
            }
          }}
          itemContent={renderItemContent}
        />
      )
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(mod => {
          const isInstalled = installedMods.some(m => m.id === mod.id)

            return (
              <Card key={mod.id} className={cn(
                "group overflow-hidden border-border bg-surface-elevated/20 hover:border-primary/40 hover:bg-surface-elevated/40 transition-all duration-300",
                isInstalled && "opacity-75"
              )}>
                <div className="flex flex-col h-full">
                  <div className="relative aspect-video overflow-hidden border-b border-border">
                    {mod.thumbnail ? (
                      <img 
                        src={mod.thumbnail} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt={mod.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center">
                        <Layers className="w-12 h-12 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {isInstalled && (
                        <Badge variant="success" className="text-[10px] font-black uppercase tracking-tight px-2 h-5 shadow-lg">
                          Installed
                        </Badge>
                      )}
                      {mod.fileSize && (
                        <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tight px-2 h-5 bg-black/60 backdrop-blur-md border-white/10 text-white">
                          {(mod.fileSize / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 justify-between gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors" title={mod.name}>
                        {mod.name}
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Workshop ID</span>
                          <span className="text-xs font-mono text-muted-foreground font-bold tracking-tighter">{mod.id}</span>
                        </div>
                        {mod.lastUpdated && (
                          <div className="flex items-center gap-2 text-muted-foreground/60">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                              Updated: {new Date(mod.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={isInstalled ? "outline" : "primary"}
                      className="w-full h-10 text-[11px] font-bold uppercase tracking-widest"
                      onClick={() => onInstall(mod)}
                      disabled={isInstalled}
                    >
                      {isInstalled ? (
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 rotate-45" /> Already Installed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4" /> Install Mod
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-surface">
        <div className="p-6 border-b border-border/50 bg-surface-elevated/30 pr-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none">
                  Steam Workshop <span className="text-primary">Search</span>
                </DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                  Browse and install mods for {filter}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  className="pl-10 bg-surface border-border focus:border-primary/50 h-12 text-base shadow-inner"
                  placeholder="Search again (Name or ID)..."
                  value={searchQuery}
                  onChange={e => onSearchQueryChange(e.target.value)}
                  onKeyDown={onSearch}
                  autoFocus
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10"
                    onClick={() => onSearch()}
                    disabled={isSearching}
                  >
                    {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
                  </Button>
                )}
              </div>

              <div className="flex items-center bg-surface border border-border rounded-lg p-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md transition-all",
                    viewMode === 'grid' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onViewModeChange('grid')}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-10 h-10 rounded-md transition-all",
                    viewMode === 'list' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onViewModeChange('list')}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-surface"
          onScroll={handleScroll}
        >
          {renderContent()}
          
          {viewMode === 'grid' && results.length < totalResults && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              {isSearching ? (
                <div className="flex items-center gap-3 text-primary animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Loading more...</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => onLoadMore()}
                  className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest border-border bg-surface-elevated/20 hover:bg-surface-elevated/40"
                >
                  Load More Results
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/50 bg-surface-elevated/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            <AlertCircle className="w-4 h-4" />
            <span>Results provided by Steam Web API</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 h-9 rounded-lg bg-surface border border-border flex items-center gap-3 shadow-inner">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Viewing</span>
              <span className="text-sm font-black text-primary tabular-nums">
                {results.length} <span className="text-muted-foreground/30 font-medium mx-1">/</span> {totalResults}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Results</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
