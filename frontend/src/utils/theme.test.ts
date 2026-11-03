import { describe, expect, it } from 'vitest'
import { oppositeTheme, readStoredTheme, resolveInitialTheme, systemTheme, THEME_STORAGE_KEY } from './theme'

function storageWith(value: string | null): Pick<Storage, 'getItem'> {
  return { getItem: (key: string) => (key === THEME_STORAGE_KEY ? value : null) }
}

describe('readStoredTheme', () => {
  it('returns the stored choice', () => {
    expect(readStoredTheme(storageWith('dark'))).toBe('dark')
    expect(readStoredTheme(storageWith('light'))).toBe('light')
  })

  it('returns null for a missing or unknown value', () => {
    expect(readStoredTheme(storageWith(null))).toBeNull()
    expect(readStoredTheme(storageWith('solarized'))).toBeNull()
  })
})

describe('resolveInitialTheme', () => {
  it('prefers an explicit choice over the system setting', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })

  it('follows the system setting when nothing was chosen', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark')
    expect(resolveInitialTheme(null, false)).toBe('light')
  })
})

describe('systemTheme', () => {
  it('maps the media query result', () => {
    expect(systemTheme(true)).toBe('dark')
    expect(systemTheme(false)).toBe('light')
  })
})

describe('oppositeTheme', () => {
  it('flips the theme', () => {
    expect(oppositeTheme('dark')).toBe('light')
    expect(oppositeTheme('light')).toBe('dark')
  })
})
