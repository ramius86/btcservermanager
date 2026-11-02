import { describe, expect, it } from 'vitest'
import { isTerminalInstallStatus } from './installStatus'

describe('isTerminalInstallStatus', () => {
  it('treats successful completions as terminal', () => {
    expect(isTerminalInstallStatus('FINISHED')).toBe(true)
    expect(isTerminalInstallStatus('SUCCESS')).toBe(true)
  })

  it('treats ERROR as terminal so the progress entry is dropped', () => {
    expect(isTerminalInstallStatus('ERROR')).toBe(true)
  })

  it('keeps in-flight states', () => {
    expect(isTerminalInstallStatus('DOWNLOADING')).toBe(false)
    expect(isTerminalInstallStatus('')).toBe(false)
    expect(isTerminalInstallStatus(null)).toBe(false)
    expect(isTerminalInstallStatus(undefined)).toBe(false)
  })
})
