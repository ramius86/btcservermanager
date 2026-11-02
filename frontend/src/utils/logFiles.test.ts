import { describe, expect, it } from 'vitest'
import { parseServerLogName, serverLogPrefix } from './logFiles'

describe('parseServerLogName', () => {
  it('parses a standard Arma 3 log', () => {
    expect(parseServerLogName('ARMA3_1_20261102_101010.log')).toEqual({
      gameType: 'ARMA3',
      serverId: 1,
      headlessClientId: null,
    })
  })

  it('parses an experimental DayZ log', () => {
    // Regression: /^([A-Z0-9]+)_(\d+)_/ stopped at "DAYZ", so experimental
    // logs were never detected as live.
    expect(parseServerLogName('DAYZ_EXP_3_20261102_101010.log')).toEqual({
      gameType: 'DAYZ_EXP',
      serverId: 3,
      headlessClientId: null,
    })
  })

  it('parses a headless client log', () => {
    expect(parseServerLogName('ARMA3_1_HC2_20261102_101010.log')).toEqual({
      gameType: 'ARMA3',
      serverId: 1,
      headlessClientId: 2,
    })
  })

  it('parses a reforger stats log', () => {
    expect(parseServerLogName('REFORGER_4_20260621_213716.stats.log')).toEqual({
      gameType: 'REFORGER',
      serverId: 4,
      headlessClientId: null,
    })
  })

  it('ignores names without the game/id/date shape', () => {
    expect(parseServerLogName('steamcmd_1.log')).toBeNull()
    expect(parseServerLogName('ARMA3_1.log')).toBeNull()
    expect(parseServerLogName('')).toBeNull()
  })
})

describe('serverLogPrefix', () => {
  it('returns the prefix without the timestamp', () => {
    expect(serverLogPrefix('ARMA3_1_20261102_101010.log')).toBe('ARMA3_1_')
  })

  it('keeps the headless client segment', () => {
    expect(serverLogPrefix('ARMA3_1_HC2_20261102_101010.log')).toBe('ARMA3_1_HC2_')
  })

  it('returns null for unknown files', () => {
    expect(serverLogPrefix('steamcmd_1.log')).toBeNull()
  })
})
