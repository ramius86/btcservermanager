import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useWebSocket } from './WebSocketContext'

interface ReforgerStat {
  timestamp: string
  fps: number
  memoryMb: number
  players: number
  ai: number
  vehicles: number
  vehiclesTotal: number
  projectiles: number
  rplItems: number
}

interface ReforgerStatsContextType {
  stats: ReforgerStat[]
}

const ReforgerStatsContext = createContext<ReforgerStatsContextType | undefined>(undefined)

export function ReforgerStatsProvider({ serverId, children }: Readonly<{ serverId: number, children: React.ReactNode }>) {
  const { subscribe, send } = useWebSocket()
  const [stats, setStats] = useState<ReforgerStat[]>([])

  useEffect(() => {
    if (serverId === 0) return

    send({ type: 'subscribe', payload: { domain: 'reforger_stats', server_id: serverId } })

    const unsub = subscribe('reforger_stats', (e) => {
      // payload: { server_id: number, stats: ReforgerStat }
      if (e.payload.server_id === serverId) {
        setStats((prev) => {
          const newStats = [...prev, e.payload.stats]
          if (newStats.length > 15000) return newStats.slice(-15000)
          return newStats
        })
      }
    })

    return () => {
      send({ type: 'unsubscribe', payload: { domain: 'reforger_stats', server_id: serverId } })
      unsub()
    }
  }, [subscribe, send, serverId])

  const contextValue = useMemo(() => ({ stats }), [stats])

  return (
    <ReforgerStatsContext.Provider value={contextValue}>
      {children}
    </ReforgerStatsContext.Provider>
  )
}

export function useReforgerStats() {
  const context = useContext(ReforgerStatsContext)
  if (!context) throw new Error('useReforgerStats must be used within ReforgerStatsProvider')
  return context
}
