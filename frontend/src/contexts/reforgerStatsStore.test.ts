import { describe, expect, it, vi } from 'vitest'
import { createStatsStore, MAX_STATS_SAMPLES, type ReforgerStat } from './reforgerStatsStore'

function stat(index: number): ReforgerStat {
  return {
    timestamp: `t${index}`,
    fps: index,
    memoryMb: 0,
    players: 0,
    ai: 0,
    vehicles: 0,
    vehiclesTotal: 0,
    projectiles: 0,
    rplItems: 0,
  }
}

describe('createStatsStore', () => {
  it('starts empty with a stable snapshot', () => {
    const store = createStatsStore()

    expect(store.getSnapshot()).toEqual([])
    expect(store.getSnapshot()).toBe(store.getSnapshot())
  })

  it('appends in order and replaces the snapshot', () => {
    const store = createStatsStore(3)
    const before = store.getSnapshot()

    store.append(stat(1))
    store.append(stat(2))

    const after = store.getSnapshot()
    expect(after).not.toBe(before)
    expect(after.map(s => s.fps)).toEqual([1, 2])
  })

  it('drops the oldest samples past the cap', () => {
    const store = createStatsStore(3)

    for (let i = 1; i <= 5; i += 1) store.append(stat(i))

    expect(store.getSnapshot().map(s => s.fps)).toEqual([3, 4, 5])
  })

  it('notifies subscribers on append and reset, and stops after unsubscribe', () => {
    const store = createStatsStore(2)
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)

    store.append(stat(1))
    expect(listener).toHaveBeenCalledTimes(1)

    store.reset()
    expect(store.getSnapshot()).toEqual([])
    expect(listener).toHaveBeenCalledTimes(2)

    // Resetting an already empty store must not wake the chart up again.
    store.reset()
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    store.append(stat(2))
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('keeps 15000 samples by default', () => {
    expect(MAX_STATS_SAMPLES).toBe(15000)
  })
})
