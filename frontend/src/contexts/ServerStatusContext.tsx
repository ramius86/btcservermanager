import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWebSocket } from './WebSocketContext'
import { ServerService } from '../services/api'

interface ServerStatus {
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
  }
}

interface InstallProgress {
  itemId: number
  status: string
  progress: number
  current: number
  total: number
}

interface ServerStatusContextType {
  statuses: Record<number, ServerStatus>
  installations: Record<string, InstallProgress>
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined)

export function ServerStatusProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe } = useWebSocket()
  const [statuses, setStatuses] = useState<Record<number, ServerStatus>>({})
  const [installations, setInstallations] = useState<Record<string, InstallProgress>>({})

  useEffect(() => {
    // Fetch initial statuses via HTTP to avoid N+1 and provide immediate data
    ServerService.getStatuses().then(allStatuses => {
      const initial: Record<number, ServerStatus> = {}
      if (allStatuses) {
        Object.entries(allStatuses).forEach(([id, info]) => {
          initial[Number(id)] = {
            server_id: Number(id),
            alive: !!info,
            info: info as any
          }
        })
      }
      setStatuses(prev => ({ ...initial, ...prev }))
    }).catch(console.error)
  }, [])

  useEffect(() => {
    const unsubStatus = subscribe('server_status', (e) => {
      const s = e.payload as ServerStatus
      setStatuses((prev) => ({ ...prev, [s.server_id]: s }))
    })

    const unsubInstall = subscribe('install_progress', (e) => {
      const i = e.payload as InstallProgress
      setInstallations((prev) => ({ ...prev, [i.itemId]: i }))
    })

    return () => {
      unsubStatus()
      unsubInstall()
    }
  }, [subscribe])

  const value = React.useMemo(() => ({ statuses, installations }), [statuses, installations])

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
