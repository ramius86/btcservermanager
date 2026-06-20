import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWebSocket } from './WebSocketContext'

interface SteamCmdLog {
  message: string
}

interface SteamCmdContextType {
  log: string
}

const SteamCmdContext = createContext<SteamCmdContextType | undefined>(undefined)

export function SteamCmdProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe, send } = useWebSocket()
  const [logBuffer, setLogBuffer] = useState<string[]>([])

  useEffect(() => {
    send({ type: 'subscribe', payload: { domain: 'steamcmd_log' } })

    const unsub = subscribe('steamcmd_log', (e) => {
      const { message } = e.payload as SteamCmdLog
      setLogBuffer((prev) => {
        const newBuffer = [...prev, message]
        if (newBuffer.length > 500) return newBuffer.slice(-500)
        return newBuffer
      })
    })

    return () => unsub()
  }, [subscribe, send])

  const value = React.useMemo(() => ({ log: logBuffer.join('\n') }), [logBuffer])

  return (
    <SteamCmdContext.Provider value={value}>
      {children}
    </SteamCmdContext.Provider>
  )
}

export function useSteamCmd() {
  const context = useContext(SteamCmdContext)
  if (!context) throw new Error('useSteamCmd must be used within SteamCmdProvider')
  return context
}
