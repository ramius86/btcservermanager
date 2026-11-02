import { describe, expect, it } from 'vitest'
import { formatUptime } from './time'

describe('formatUptime', () => {
  it('renders a just-started server as 0s instead of "00:00:00"', () => {
    expect(formatUptime(0)).toBe('0s')
  })

  it('renders a missing value explicitly', () => {
    expect(formatUptime(null)).toBe('—')
    expect(formatUptime(undefined)).toBe('—')
    expect(formatUptime('')).toBe('—')
  })

  it('renders seconds and minutes', () => {
    expect(formatUptime(45)).toBe('45s')
    expect(formatUptime(600)).toBe('10m')
  })

  it('renders days, hours and minutes', () => {
    expect(formatUptime(2 * 24 * 3600 + 3 * 3600 + 4 * 60)).toBe('2d 3h 4m')
  })

  it('reports an unparsable timestamp instead of guessing "< 1m"', () => {
    expect(formatUptime('non-una-data')).toBe('Unknown')
  })

  it('keeps the future-timestamp case as "Starting..."', () => {
    const future = new Date(Date.now() + 60_000).toISOString()
    expect(formatUptime(future)).toBe('Starting...')
  })
})
