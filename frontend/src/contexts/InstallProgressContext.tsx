import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useWebSocket } from './WebSocketContext'

export interface InstallProgress {
  itemId: number
  status: string
  progress: number
  current: number
  total: number
}

interface InstallProgressContextType {
  installations: Record<string, InstallProgress>
}

const InstallProgressContext = createContext<InstallProgressContextType | undefined>(undefined)

export function InstallProgressProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe } = useWebSocket()
  const [installations, setInstallations] = useState<Record<string, InstallProgress>>({})

  useEffect(() => {
    const unsubInstall = subscribe('install_progress', (e) => {
      const i = e.payload as InstallProgress
      if (!i) return
      setInstallations((prev) => {
        if (i.status === 'FINISHED' || i.status === 'SUCCESS') {
          if (!prev[i.itemId]) return prev
          const next = { ...prev }
          delete next[i.itemId]
          return next
        }
        return { ...prev, [i.itemId]: i }
      })
    })

    return () => {
      unsubInstall()
    }
  }, [subscribe])

  const value = useMemo(() => ({ installations }), [installations])

  return (
    <InstallProgressContext.Provider value={value}>
      {children}
    </InstallProgressContext.Provider>
  )
}

export function useInstallProgress() {
  const context = useContext(InstallProgressContext)
  if (!context) throw new Error('useInstallProgress must be used within InstallProgressProvider')
  return context
}
