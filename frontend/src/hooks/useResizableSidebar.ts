/**
 * Custom hook for draggable sidebar resizing.
 * Handles mouse events and width state for LogExplorerPage.
 */
import { useState, useRef, useCallback, useEffect } from 'react'

export function useResizableSidebar(initialWidth = 380) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentWidthRef = useRef(initialWidth)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = currentWidthRef.current + e.movementX
    if (newWidth > 200 && newWidth < 900) {
      currentWidthRef.current = newWidth
      if (containerRef.current) {
        containerRef.current.style.setProperty('--sidebar-width', `${newWidth}px`)
      }
    }
  }, [])

  const stopResizing = useCallback(() => {
    document.body.style.cursor = 'default'
    document.body.style.userSelect = 'auto'
    globalThis.removeEventListener('mousemove', handleMouseMove)
    globalThis.removeEventListener('mouseup', stopResizing)
    setSidebarWidth(currentWidthRef.current)
  }, [handleMouseMove])

  const startResizing = useCallback(() => {
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    globalThis.addEventListener('mousemove', handleMouseMove)
    globalThis.addEventListener('mouseup', stopResizing)
  }, [handleMouseMove, stopResizing])

  useEffect(() => {
    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove)
      globalThis.removeEventListener('mouseup', stopResizing)
    }
  }, [handleMouseMove, stopResizing])

  return {
    sidebarWidth,
    containerRef,
    startResizing
  }
}
