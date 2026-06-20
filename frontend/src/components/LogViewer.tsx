/**
 * Log content renderer with syntax highlighting.
 * Highlighting: Reforger (E/W/I), Arma 3/DayZ (Timestamps/Errors), SteamCMD (Success/Fail).
 * Parent: LogExplorerPage
 */
import React, { memo } from 'react'
import { cn } from './ui/Button'
import { Virtuoso } from 'react-virtuoso'

interface LogViewerProps {
  lines: string[]
  selectedGame?: string
  logType: 'steamcmd' | 'server'
  firstItemIndex: number
  onLoadMore: () => void
  isFetchingMore: boolean
  autoScroll: boolean
  onScrollStateChange: (isAtBottom: boolean) => void
}

const TS_REGEX = /^(?:\s*\d{1,2}|\d{4}-\d{2}-\d{2} \d{2}):\d{2}:\d{2}/
const REFORGER_LABEL_REGEX = /^(\s*)([A-Z]{3,})\s+(?=[(:])/

const CRITICAL_ERROR_REGEX = /failed|error|Cannot open|Cannot delete|refused|Error in expression|Error position|expected|Cannot create non-ai vehicle/i
const NOT_FOUND_REGEX = /(?:(?:Server|Client): Object .* not found|Object\(.*\) not found)/i
const WARNING_REGEX = /Warning Message:|Unsupported|Conflicting|duplicate|SKIPPED|Skipped|Setting invalid pitch|WARNING:/i
const POSITIVE_EVENT_REGEX = /Player .* connected|Player .* disconnected|Game finished|Waiting for next game/i
const INIT_REGEX = /initialized|Initializing|Loaded|Updating/i

const getReforgerStyles = (line: string): string | null => {
  if (line.includes('(E):')) return 'text-red-400 font-medium'
  if (line.includes('(W):')) return 'text-amber-400 font-medium'
  if (line.includes('(I):')) return 'text-sky-400'
  return null
}

const getArma3DayzStyles = (line: string): string | null => {
  if (CRITICAL_ERROR_REGEX.test(line)) return 'text-red-400 font-semibold'
  if (NOT_FOUND_REGEX.test(line)) return 'text-red-400/80'
  if (WARNING_REGEX.test(line)) return 'text-amber-400'
  if (line.includes('->Last modified by:')) return 'text-amber-400/60 italic'
  if (POSITIVE_EVENT_REGEX.test(line)) return 'text-emerald-400 font-medium'
  if (INIT_REGEX.test(line)) return 'text-cyan-400'
  if (line.includes('➥ Context:')) return 'text-zinc-500 italic'
  if (line.includes('[ACE]') && line.includes('INFO:')) return 'text-zinc-500 font-light'
  if (line.includes('TFAR_RadioRequestEvent') || line.includes('TFAR_RadioRequestResponseEvent')) return 'text-zinc-500/50'
  return null
}

const getFallbackStyles = (line: string, lowerLine: string, isSteamCmd: boolean): string | null => {
  if (lowerLine.includes('error:') || lowerLine.includes('failed') || lowerLine.includes('critical')) return 'text-red-400 font-medium'
  if (lowerLine.includes('warning:')) return 'text-amber-400 font-medium'
  
  if (isSteamCmd || lowerLine.includes('success') || lowerLine.includes(' ok ') || lowerLine.includes('finished')) {
    if (lowerLine.includes('success') || lowerLine.includes(' ok ') || lowerLine.includes('finished') || lowerLine.includes('update progress: 100')) {
      return 'text-emerald-400'
    }
  }
  
  if (line.startsWith('\t') || line.startsWith('    ')) return 'text-zinc-500 italic'
  
  return null
}

const LogViewerHeaderComponent = React.forwardRef<HTMLDivElement, { context?: { isFetchingMore: boolean } }>(
  ({ context }, ref) => {
    if (!context?.isFetchingMore) return null
    return (
      <div ref={ref} className="text-center py-4 text-muted-foreground/50 text-[10px] uppercase tracking-widest font-sans">
        Loading older logs...
      </div>
    )
  }
)
LogViewerHeaderComponent.displayName = 'LogViewerHeaderComponent'

export const LogViewer: React.FC<Readonly<LogViewerProps>> = memo(({ 
  lines, selectedGame, logType, firstItemIndex, onLoadMore, isFetchingMore, autoScroll, onScrollStateChange 
}) => {
  const virtuosoRef = React.useRef<any>(null)
  const lastScrollTopRef = React.useRef<number>(0)

  React.useEffect(() => {
    if (autoScroll && virtuosoRef.current && lines.length > 0) {
      virtuosoRef.current.scrollToIndex({ index: lines.length - 1, align: 'end' })
    }
  }, [autoScroll])

  React.useEffect(() => {
    lastScrollTopRef.current = 0
  }, [lines.length])

  if (lines.length === 0 && !isFetchingMore) {
    return <div className="p-6 h-full flex-1"><span className="text-muted-foreground italic block">The log file is currently empty.</span></div>
  }

  const normalizedGame = selectedGame?.toUpperCase().replace(/\s/g, '') || ''
  const isReforger = normalizedGame === 'REFORGER'
  const isArma3 = normalizedGame === 'ARMA3'
  const isDayZ = normalizedGame === 'DAYZ'
  const isSteamCmd = logType === 'steamcmd'

  const getLineStyles = (line: string) => {
    if (isReforger) {
      const style = getReforgerStyles(line)
      if (style) return style
    }
    
    if (isArma3 || isDayZ) {
      const style = getArma3DayzStyles(line)
      if (style) return style
    }

    const l = line.toLowerCase()
    const fallback = getFallbackStyles(line, l, isSteamCmd)
    if (fallback) return fallback

    return 'text-foreground/90'
  }

  const formatLine = (line: string) => {
    // 1. Detect Timestamps (HH:MM:SS, H:MM:SS or YYYY-MM-DD HH:MM:SS, with optional leading space)
    const tsMatch = TS_REGEX.exec(line)
    
    // 2. Reforger Labels (SCRIPT, ENTITY, etc.)
    const reforgerLabelMatch = REFORGER_LABEL_REGEX.exec(line)

    let timestamp: string | null = null
    let remaining = line

    if (tsMatch) {
      let offset = tsMatch[0].length
      // Absorb trailing colons and whitespace into the unselectable timestamp
      while (offset < line.length && (line[offset] === ':' || line[offset] === ' ' || line[offset] === '\t')) {
        offset++
      }
      timestamp = line.substring(0, offset)
      remaining = line.substring(offset)
    }

    const lineStyle = getLineStyles(remaining)

    return (
      <div className={cn("py-px px-6 min-h-[1.2em] leading-relaxed whitespace-pre-wrap break-all", lineStyle)}>
        {timestamp && (
          <span className="text-muted-foreground font-bold mr-2 select-none opacity-60 tabular-nums">
            {timestamp}
          </span>
        )}
        {reforgerLabelMatch ? (
          <>
            <span className="text-muted-foreground">{reforgerLabelMatch[1]}</span>
            <span className="text-primary font-bold tracking-wider mr-1 text-[0.9em]">
              {reforgerLabelMatch[2]}
            </span>
            <span>{remaining.substring(reforgerLabelMatch[0].length)}</span>
          </>
        ) : (
          <span>{remaining}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden bg-background font-mono text-[12px] relative selection:bg-primary/30 h-full w-full">
      <Virtuoso
        ref={virtuosoRef}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={{ index: 'LAST', align: 'end' }}
        data={lines}
        startReached={() => onLoadMore()}
        itemContent={(_index, line) => formatLine(line)}
        followOutput={autoScroll ? "smooth" : false}
        onScroll={(e) => {
          const scrollTop = e.currentTarget.scrollTop
          const prevScrollTop = lastScrollTopRef.current
          lastScrollTopRef.current = scrollTop

          if (scrollTop < prevScrollTop && autoScroll) {
            onScrollStateChange(false)
          }
        }}
        atBottomStateChange={(atBottom) => {
          if (atBottom) {
            onScrollStateChange(true)
          }
        }}
        context={{ isFetchingMore }}
        components={{
          Header: LogViewerHeaderComponent
        }}
        className="h-full w-full custom-scrollbar"
      />
    </div>
  )
})

LogViewer.displayName = 'LogViewer'
