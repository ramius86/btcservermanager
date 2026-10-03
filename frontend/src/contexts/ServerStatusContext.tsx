import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useWebSocket } from './WebSocketContext'
import { ServerService } from '../services/api'

export interface ServerStatus {
  server_id: number
  alive: boolean
  info?: {
    startedAt: string | null
    maxPlayers: number
    players: number
    map: string
    mission: string
    headlessClientsCount: number
    lastReforgerStat?: any
    currentLogFile?: string
  }
}

export interface InstallProgress {
  itemId: number
  status: string
  progress: number
  current: number
  total: number
}

export interface ServerStatusContextType {
  statuses: Record<number, ServerStatus>
  startingServers: Record<number, boolean>
  stoppingServers: Record<number, boolean>
  setServerStarting: (id: number, starting: boolean) => void
  setServerStopping: (id: number, stopping: boolean) => void
  refreshStatuses: () => Promise<void>
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined)

export function ServerStatusProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe, onReconnect } = useWebSocket()
  const [statuses, setStatuses] = useState<Record<number, ServerStatus>>({})
  const [startingServers, setStartingServers] = useState<Record<number, boolean>>({})
  const [stoppingServers, setStoppingServers] = useState<Record<number, boolean>>({})

  const setServerStarting = useCallback((id: number, starting: boolean) => {
    setStartingServers(prev => {
      if (starting) {
        return { ...prev, [id]: true }
      }
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const setServerStopping = useCallback((id: number, stopping: boolean) => {
    setStoppingServers(prev => {
      if (stopping) {
        return { ...prev, [id]: true }
      }
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const refreshStatuses = useCallback(async () => {
    try {
      const allStatuses = await ServerService.getStatuses()
      if (allStatuses) {
        const updated: Record<number, ServerStatus> = {}
        Object.entries(allStatuses).forEach(([id, info]) => {
          const numId = Number(id)
          updated[numId] = {
            server_id: numId,
            alive: !!info,
            info: info as any
          }
        })
        setStatuses(prev => ({ ...prev, ...updated }))
      }
    } catch (err) {
      console.error("Failed to refresh server statuses:", err)
    }
  }, [])

  useEffect(() => {
    // Fetch initial statuses via HTTP to avoid N+1 and provide immediate data
    refreshStatuses()
  }, [refreshStatuses])

  useEffect(() => {
    const unsubReconnect = onReconnect(() => {
      refreshStatuses()
    })
    return () => unsubReconnect()
  }, [onReconnect, refreshStatuses])

  useEffect(() => {
    const unsubStatus = subscribe('server_status', (e) => {
      const s = e.payload as ServerStatus
      if (!s || s.server_id === 0) return
      setStatuses((prev) => ({ ...prev, [s.server_id]: s }))

      if (s.alive) {
        setStartingServers(prev => {
          if (!prev[s.server_id]) return prev
          const next = { ...prev }
          delete next[s.server_id]
          return next
        })
      } else {
        setStoppingServers(prev => {
          if (!prev[s.server_id]) return prev
          const next = { ...prev }
          delete next[s.server_id]
          return next
        })
      }
    })

    const unsubServerUpdated = subscribe('server_updated', (e) => {
      if (e.payload?.type === 'reordered') return
      refreshStatuses()
    })

    return () => {
      unsubStatus()
      unsubServerUpdated()
    }
  }, [subscribe, refreshStatuses])

  const value = useMemo(() => ({
    statuses,
    startingServers,
    stoppingServers,
    setServerStarting,
    setServerStopping,
    refreshStatuses
  }), [
    statuses,
    startingServers,
    stoppingServers,
    setServerStarting,
    setServerStopping,
    refreshStatuses
  ])

  return (
    <ServerStatusContext.Provider value={value}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export function useServerStatus() {
  const context = useContext(ServerStatusContext)
  if (!context) throw new Error('useServerStatus must be used within ServerStatusProvider')
  return context
}
