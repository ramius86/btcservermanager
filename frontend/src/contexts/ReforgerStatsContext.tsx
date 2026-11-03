import React, { createContext, useContext, useEffect, useRef, useSyncExternalStore } from 'react'
import { useWebSocket } from './WebSocketContext'
import { createStatsStore, MAX_STATS_SAMPLES, type ReforgerStat, type StatsStore } from './reforgerStatsStore'

interface ReforgerStatsContextType {
  stats: ReforgerStat[]
}

// The provider hands over the store, not the samples: a new sample then updates
// only the components that read it, instead of re-rendering the whole subtree.
const ReforgerStatsContext = createContext<StatsStore | undefined>(undefined)

export function ReforgerStatsProvider({ serverId, children }: Readonly<{ serverId: number, children: React.ReactNode }>) {
  const { subscribe } = useWebSocket()
  const storeRef = useRef<StatsStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createStatsStore(MAX_STATS_SAMPLES)
  }

  const store = storeRef.current

  useEffect(() => {
    // A different server must not inherit the previous server's samples.
    store.reset()

    if (serverId === 0) return

    const unsub = subscribe('reforger_stats', (e) => {
      // payload: { server_id: number, stats: ReforgerStat }
      if (!e?.payload || e.payload.server_id !== serverId || !e.payload.stats) return
      store.append(e.payload.stats)
    })

    return () => unsub()
  }, [subscribe, serverId, store])

  return (
    <ReforgerStatsContext.Provider value={store}>
      {children}
    </ReforgerStatsContext.Provider>
  )
}

export function useReforgerStats(): ReforgerStatsContextType {
  const store = useContext(ReforgerStatsContext)
  if (!store) throw new Error('useReforgerStats must be used within ReforgerStatsProvider')

  const stats = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return { stats }
}
