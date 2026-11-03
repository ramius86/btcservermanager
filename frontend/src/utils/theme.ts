export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

/** Returns the theme the user explicitly picked, or null when they never did. */
export function readStoredTheme(storage: Pick<Storage, 'getItem'>): Theme | null {
  const stored = storage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return null
}

export function systemTheme(prefersDark: boolean): Theme {
  return prefersDark ? 'dark' : 'light'
}

/** An explicit choice wins over the OS setting; otherwise follow the OS. */
export function resolveInitialTheme(stored: Theme | null, prefersDark: boolean): Theme {
  return stored ?? systemTheme(prefersDark)
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark'
}
