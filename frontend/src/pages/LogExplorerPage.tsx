/**
 * Main Log Explorer page.
 * Logic: Global state, data fetching, and WebSocket subscriptions.
 * UI Parts:
 * - Sidebar: ../components/LogSidebar
 * - Header: ../components/LogViewerHeader
 * - Content: ../components/LogViewer
 * - Resizing: ../hooks/useResizableSidebar
 */
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LogService } from '../services/api'
import { Card } from '../components/ui/Card'
import { cn } from '../components/ui/Button'
import { Activity, ChevronLeft } from 'lucide-react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { ReforgerStatsDashboard } from '../components/ReforgerStatsDashboard'
import { LogViewer } from '../components/LogViewer'
import { LogSidebar } from '../components/LogSidebar'
import { LogViewerHeader } from '../components/LogViewerHeader'
import { useResizableSidebar } from '../hooks/useResizableSidebar'
import { useServerStatus } from '../contexts/ServerStatusContext'

const getAutoSelectedFile = (qType: string, qGame: string, qServerId: string | null, sortedFiles: string[]): string | null => {
  if (sortedFiles.length === 0) return null;
  if (qType === 'server' && qServerId) {
    const mainLog = sortedFiles.find(f => f.startsWith(`${qGame}_${qServerId}_`) && !f.includes('_HC'))
    if (mainLog) return mainLog;
    return sortedFiles.find(f => f.startsWith(`${qGame}_${qServerId}_`)) || null;
  } 
  if (qType === 'steamcmd') {
    return sortedFiles.find(f => f.startsWith('steamcmd_')) || null;
  }
  return null;
}

const serverIdRegex = /^([A-Z0-9]+)_(\d+)_/
const prefixRegex = /^([A-Z0-9]+_\d+(?:_HC\d+)?_)/

export const LogExplorerPage: React.FC = () => {
  const [logType, setLogType] = useState<'steamcmd' | 'server'>('steamcmd')
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [lines, setLines] = useState<string[]>([])
  const [firstItemIndex, setFirstItemIndex] = useState(1000000)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedGame, setSelectedGame] = useState<string>('ARMA3')
  // Mobile: toggle between file list and log viewer
  const [showFileList, setShowFileList] = useState(true)

  const view = searchParams.get('view') || 'logs'
  const { subscribe } = useWebSocket()
  const { sidebarWidth, containerRef, startResizing } = useResizableSidebar(380)
  const { statuses, installations } = useServerStatus()

  const liveFiles = React.useMemo(() => {
    const live = new Set<string>()

    if (logType === 'steamcmd') {
      const isSteamCmdActive = Object.keys(installations).length > 0
      if (isSteamCmdActive) {
        const firstSteam = files.find(f => f.startsWith('steamcmd_'))
        if (firstSteam) live.add(firstSteam)
      }
      return live
    }

    const seenPrefixes = new Set<string>()
    for (const f of files) {
      const match = serverIdRegex.exec(f)
      if (!match) continue

      const serverId = Number(match[2])
      const prefixMatch = prefixRegex.exec(f)
      if (!prefixMatch) continue

      const prefix = prefixMatch[1]
      if (seenPrefixes.has(prefix)) continue

      seenPrefixes.add(prefix)
      if (statuses[serverId]?.alive) {
        live.add(f)
      }
    }

    return live
  }, [files, statuses, installations, logType])


  // Handle auto-scroll toggle from Virtuoso
  const handleScrollStateChange = (isAtBottom: boolean) => {
    if (autoScroll !== isAtBottom) {
      setAutoScroll(isAtBottom)
    }
  }

  // Load More logic
  const loadMore = async () => {
    if (!selectedFile || !hasMore || isFetchingMore) return
    setIsFetchingMore(true)
    try {
      const res = logType === 'steamcmd' 
        ? await LogService.getSteamCmdLog(selectedFile, lines.length, 1000) 
        : await LogService.getServerLog(selectedFile, lines.length, 1000)
      
      const newContent = res.content || ''
      const newLines = newContent ? newContent.split('\n') : []
      if (newLines.length > 0) {
        setFirstItemIndex(prev => prev - newLines.length)
        setLines(prev => [...newLines, ...prev])
      }
      setHasMore(newLines.length >= 999)
    } catch (e) {
      console.error(e)
    } finally {
      setIsFetchingMore(false)
    }
  }

  // WebSocket Live Updates
  useEffect(() => {
    if (!selectedFile) return
    if (logType === 'steamcmd') {
      if (selectedFile.startsWith('steamcmd_') && selectedFile.endsWith('.log')) {
        return subscribe('steamcmd_log', (e) => {
          setLines(prev => [...prev, ...e.payload.message.split('\n')])
        })
      }
    } else {
      const parts = selectedFile.split('_')
      if (parts.length >= 2) {
        const serverId = Number.parseInt(parts[1], 10)
        if (!Number.isNaN(serverId)) {
          return subscribe('server_log', (e) => {
            setLines(prev => [...prev, ...e.payload.message.split('\n')])
          }, serverId)
        }
      }
    }
  }, [subscribe, logType, selectedFile])

  const fetchFiles = async () => {
    const qType = searchParams.get('type') as 'steamcmd' | 'server' || 'steamcmd'
    const qGame = searchParams.get('game') || ''
    const qServerId = searchParams.get('serverId')

    try {
      let data: string[] = []
      if (qType === 'steamcmd') {
        data = await LogService.listSteamCmdLogs()
      } else {
        data = await LogService.listServerLogs(qServerId ? Number.parseInt(qServerId, 10) : 'all')
      }
      const sorted = Array.isArray(data) ? [...data].sort((a, b) => {
        const getSortKey = (filename: string) => {
          const match = /_(\d{8})(?:_(\d{6}))?\.log$/.exec(filename);
          return match ? match[1] + (match[2] || "000000") : filename;
        };
        const keyA = getSortKey(a);
        const keyB = getSortKey(b);
        return keyA === keyB ? b.localeCompare(a) : keyB.localeCompare(keyA);
      }) : []
      setFiles(sorted)

      // Auto-select logic (only if no file selected yet)
      if (!selectedFile && sorted.length > 0) {
        const autoSelected = getAutoSelectedFile(qType, qGame, qServerId, sorted);
        if (autoSelected) setSelectedFile(autoSelected);
      }
    } catch (err) { 
      console.error('Failed to fetch files:', err)
      setFiles([]) 
    }
  }

  // Sync query params to state AND trigger file fetch
  useEffect(() => {
    const qType = searchParams.get('type') as 'steamcmd' | 'server' || 'steamcmd'
    const qGame = searchParams.get('game') || ''
    
    // Sync internal state from URL
    setLogType(qType)
    setSelectedGame(qGame)

    fetchFiles()
  }, [searchParams]) // Re-run whenever URL changes

  useEffect(() => {
    if (selectedFile) {
      setLoading(true)
      const fetchInitial = async () => {
        try {
          const res = logType === 'steamcmd' 
            ? await LogService.getSteamCmdLog(selectedFile, 0, 1000) 
            : await LogService.getServerLog(selectedFile, 0, 1000)
          const newContent = res.content || ''
          const newLines = newContent ? newContent.split('\n') : []
          setLines(newLines)
          setFirstItemIndex(1000000)
          setHasMore(newLines.length >= 999)
        } catch (e) { 
          console.error('Failed to fetch log content:', e)
          setLines(['Error loading log.']) 
        }
        finally { setLoading(false) }
      }
      fetchInitial()
      setAutoScroll(true)
    } else {
      setLines([])
      setHasMore(false)
    }
  }, [selectedFile, logType])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false) }
    globalThis.addEventListener('keydown', handleEsc)
    return () => globalThis.removeEventListener('keydown', handleEsc)
  }, [])

  const handleSelectGroup = (type: 'steamcmd' | 'server', gameId?: string) => {
    setLogType(type)
    if (type === 'server' && gameId) setSelectedGame(gameId)
    setSelectedFile(null)
    setSearchParams({ type, ...(type === 'server' ? { game: gameId } : {}) })
  }

  const handleSelectFile = (file: string) => {
    setSelectedFile(file)
    // On mobile: switch to log viewer after selecting a file
    setShowFileList(false)
  }

  const handleDelete = async (file: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await LogService.deleteLog(file)
      if (selectedFile === file) setSelectedFile(null)
      fetchFiles()
    } catch (err) { console.error(err) }
  }

  const handleDeleteAll = async () => {
    try {
      await LogService.deleteAllLogs(logType)
      setSelectedFile(null)
      fetchFiles()
    } catch (err) { console.error(err) }
  }

  const renderContent = () => {
    if (view === 'performance' && logType === 'server') {
      return (
        <div className="p-6 h-full overflow-y-auto">
          <ReforgerStatsDashboard 
            serverId={Number.parseInt(selectedFile?.split('_')[1] || '0', 10)} 
            filename={selectedFile || ''} 
            logStatsInterval={1000} 
            isLive={selectedFile ? liveFiles.has(selectedFile) : false}
          />
        </div>
      )
    }
    if (loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Reading Stream...</span>
          </div>
        </div>
      )
    }
    if (selectedFile) {
      return (
        <LogViewer 
          lines={lines} 
          selectedGame={selectedGame} 
          logType={logType} 
          firstItemIndex={firstItemIndex}
          onLoadMore={loadMore}
          isFetchingMore={isFetchingMore}
          autoScroll={autoScroll}
          onScrollStateChange={handleScrollStateChange}
        />
      )
    }
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-6">
        <div className="p-10 bg-surface-elevated/50 border border-border rounded-full text-foreground/5"><Activity className="h-16 w-16" /></div>
        <div className="text-center space-y-2">
          <p className="font-bold text-foreground/50 text-lg uppercase tracking-widest">Stream Standby</p>
          <p className="text-sm max-w-xs mx-auto">Select a Steam log to begin real-time surgical analysis.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex h-screen w-full bg-background overflow-hidden" style={{ '--sidebar-width': `${sidebarWidth}px` } as any}>
      <div className="flex-1 flex overflow-hidden p-2 gap-2">

        {/* Mobile toggle button — only visible on mobile */}
        {!showFileList && (
          <button
            type="button"
            onClick={() => setShowFileList(true)}
            className="md:hidden fixed top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-2 bg-surface-elevated border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground shadow-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Files
          </button>
        )}

        {/* File sidebar — full width on mobile when showFileList, hidden otherwise */}
        <div className={cn(
          showFileList ? 'flex' : 'hidden',
          'md:flex flex-col',
          'w-full md:w-auto h-full overflow-hidden'
        )}>
          <LogSidebar 
            logType={logType} selectedGame={selectedGame} selectedFile={selectedFile}
            searchTerm={searchTerm} files={files} liveFiles={liveFiles}
            onSelectGroup={handleSelectGroup} onSelectFile={handleSelectFile}
            onSearchChange={setSearchTerm} onDeleteFile={handleDelete} onDeleteAll={handleDeleteAll}
          />
        </div>

        {/* Resize handle — desktop only */}
        <button type="button" aria-label="Resize Sidebar" onMouseDown={startResizing} className="hidden md:block w-1 hover:w-1.5 bg-border hover:bg-primary/50 cursor-col-resize transition-all rounded-full my-4" />

        {/* Log viewer — hidden on mobile when showFileList is true */}
        <div className={cn(
          showFileList ? 'hidden' : 'flex',
          'md:flex flex-1 flex-col overflow-hidden'
        )}>
          <Card className={cn("flex flex-col overflow-hidden bg-surface border-border transition-all duration-300 h-full", isFullscreen ? "fixed inset-0 z-[100] m-0 rounded-none border-none" : "flex-1")}>
            <LogViewerHeader 
              selectedFile={selectedFile} logType={logType} selectedGame={selectedGame}
              view={view} autoScroll={autoScroll} isFullscreen={isFullscreen} isLive={selectedFile ? liveFiles.has(selectedFile) : false}
              onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
              onDownload={() => selectedFile && window.open(LogService.download(selectedFile), '_blank')}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              onViewChange={(v) => setSearchParams({ ...Object.fromEntries(searchParams), view: v })}
            />

            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <section 
              aria-label="Log Output"
              className="flex-1 flex flex-col overflow-hidden bg-background font-mono text-[12px] relative custom-scrollbar p-0"
            >
              {renderContent()}
            </section>
          </Card>
        </div>
      </div>
    </div>
  )
}
