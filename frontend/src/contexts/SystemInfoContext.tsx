import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWebSocket } from './WebSocketContext'
import { SystemService } from '../services/api'

interface SystemInfo {
  cpu_usage: number
  memory_usage: number
  total_memory: number
  free_memory: number
  uptime: number
  hostname: string
  os: string
  os_name: string
  kernel: string
  arch: string
  cpu_count: number
  cpu_model: string
  disk_total: number
  disk_used: number
  local_ip: string
  public_ip: string
  timezone: string
  boot_time: string
  steam_authenticated: boolean
  steam_username: string
  steam_api_key_configured: boolean
  fox_easter_egg: boolean
  app_version?: string
}

interface SystemInfoContextType {
  systemInfo: SystemInfo | null
}

const SystemInfoContext = createContext<SystemInfoContextType | undefined>(undefined)

export function SystemInfoProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe, send } = useWebSocket()
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)

  useEffect(() => {
    // Initial fetch via REST to avoid delay
    SystemService.getInfo().then(setSystemInfo).catch(console.error)
  }, [])

  useEffect(() => {
    send({ type: 'subscribe', payload: { domain: 'system_info' } })

    const unsub = subscribe('system_info', (e) => {
      setSystemInfo(e.payload as SystemInfo)
    })

    return () => unsub()
  }, [subscribe, send])

  const value = React.useMemo(() => ({ systemInfo }), [systemInfo])

  return (
    <SystemInfoContext.Provider value={value}>
      {children}
    </SystemInfoContext.Provider>
  )
}

export function useSystemInfo() {
  const context = useContext(SystemInfoContext)
  if (!context) throw new Error('useSystemInfo must be used within SystemInfoProvider')
  return context
}
