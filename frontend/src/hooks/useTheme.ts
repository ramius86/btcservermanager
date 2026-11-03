import { useState, useEffect, useCallback } from 'react'
import { oppositeTheme, readStoredTheme, resolveInitialTheme, systemTheme, THEME_STORAGE_KEY, type Theme } from '../utils/theme'

const darkQuery = '(prefers-color-scheme: dark)'

function prefersDark(): boolean {
  return globalThis.matchMedia?.(darkQuery).matches ?? false
}

function getDefaultTheme(): Theme {
  return resolveInitialTheme(readStoredTheme(localStorage), prefersDark())
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  // Follow the OS theme while the user has not picked one. Until v2.14 the
  // default was written to localStorage on mount, so a stored value always
  // existed and the OS change was never applied.
  useEffect(() => {
    const media = globalThis.matchMedia?.(darkQuery)
    if (!media) return

    const onChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme(localStorage)) return
      setTheme(systemTheme(event.matches))
    }

    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = oppositeTheme(theme)
    // Only an explicit choice is persisted: it is what stops the OS from
    // overriding the theme above.
    localStorage.setItem(THEME_STORAGE_KEY, next)
    setTheme(next)
  }, [theme])

  return { theme, toggleTheme }
}
