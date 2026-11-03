export interface ReforgerStat {
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

/**
 * Upper bound of live samples kept for the chart. The dashboard downsamples to
 * 1500 points anyway; the rest is only useful for zooming back in time.
 */
export const MAX_STATS_SAMPLES = 15000

export interface StatsStore {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => ReforgerStat[]
  append: (stat: ReforgerStat) => void
  reset: () => void
}

const EMPTY: ReforgerStat[] = []

/**
 * Keeps the samples outside React state: a new sample publishes one snapshot
 * instead of allocating a state update, and only the components that read it
 * through useSyncExternalStore re-render.
 */
export function createStatsStore(max = MAX_STATS_SAMPLES): StatsStore {
  let items = EMPTY
  let snapshot = EMPTY
  const listeners = new Set<() => void>()

  const publish = () => {
    snapshot = items
    listeners.forEach((listener) => listener())
  }

  return {
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => snapshot,
    append: (stat) => {
      const next = [...items, stat]
      items = next.length > max ? next.slice(-max) : next
      publish()
    },
    reset: () => {
      if (items.length === 0) return
      items = EMPTY
      publish()
    },
  }
}
