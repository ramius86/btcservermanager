import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'
import { FileManagerService } from '../../services/api'
import { Save, Maximize2, Minimize2, AlertTriangle, Lock, FileCode, RefreshCw, X } from 'lucide-react'

interface FileEditorModalProps {
  filePath: string | null
  fileName: string | null
  isReadOnly?: boolean
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}

export const FileEditorModal: React.FC<FileEditorModalProps> = ({
  filePath,
  fileName,
  isReadOnly = false,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { showToast } = useToast()
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const isDirty = content !== originalContent

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  useEffect(() => {
    if (isOpen && filePath) {
      loadFileContent(filePath)
    } else {
      setContent('')
      setOriginalContent('')
      setIsFullscreen(false)
    }
  }, [isOpen, filePath])

  const loadFileContent = async (path: string) => {
    setLoading(true)
    try {
      const res = await FileManagerService.getContent(path)
      setContent(res.content)
      setOriginalContent(res.content)
    } catch (err: any) {
      showToast(err.message || 'Failed to load file contents', 'error')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!filePath || isReadOnly || saving) return
    setSaving(true)
    try {
      await FileManagerService.saveContent(filePath, content)
      setOriginalContent(content)
      showToast(`Successfully saved ${fileName || filePath}`, 'success')
      onSaved?.()
    } catch (err: any) {
      showToast(err.message || 'Failed to save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // Handle tab indenting in code editor
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const updated = content.substring(0, start) + '  ' + content.substring(end)
      setContent(updated)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const handleClose = () => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to exit without saving?')) {
        return
      }
    }
    onClose()
  }

  // Calculate lines for gutter
  const lineCount = content.split('\n').length

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        hideCloseButton
        className={`flex flex-col bg-surface border-border p-0 gap-0 overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-2 w-[calc(100vw-16px)] max-w-none h-[calc(100vh-16px)] rounded-xl'
            : 'w-[92vw] max-w-5xl h-[85vh] rounded-xl'
        }`}
      >
        {/* Modal Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/60 bg-surface-elevated/40 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="truncate">
              <DialogTitle className="text-base font-bold tracking-tight truncate flex items-center gap-2">
                <span className="truncate">{fileName || 'File Editor'}</span>
                {isReadOnly && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Lock className="w-3 h-3" /> Read-Only
                  </span>
                )}
                {isDirty && !isReadOnly && (
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary">
                    Unsaved Changes
                  </span>
                )}
              </DialogTitle>
              <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">{filePath}</p>
            </div>
          </div>

          {/* Window action controls */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Read-Only Warning Banner */}
        {isReadOnly && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs font-medium shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Files in /data are protected and strictly read-only for system stability. Modifications are disabled.</span>
          </div>
        )}

        {/* Editor Body */}
        <div className="relative flex-1 min-h-0 bg-neutral-950 flex overflow-hidden font-mono text-xs">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-3 text-muted-foreground">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest">Loading content...</span>
            </div>
          ) : (
            <div className="flex w-full h-full overflow-hidden">
              {/* Line Numbers Gutter */}
              <div
                ref={gutterRef}
                className="select-none py-4 px-3 bg-neutral-900/60 border-r border-border/30 text-neutral-500 text-right shrink-0 overflow-hidden font-mono text-xs leading-relaxed"
                style={{ width: `${Math.max(3, String(lineCount).length) * 9 + 28}px` }}
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i + 1} className="h-[21px] leading-[21px]">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                readOnly={isReadOnly}
                spellCheck={false}
                className="flex-1 w-full h-full p-4 pb-8 bg-transparent text-neutral-100 resize-none outline-none overflow-auto custom-scrollbar font-mono text-xs leading-[21px] whitespace-pre tab-4"
                placeholder={isReadOnly ? 'File is empty' : 'Enter text here...'}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-3 border-t border-border/60 bg-surface-elevated/40 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{new Blob([content]).size} bytes</span>
            <span>•</span>
            <span className="hidden sm:inline">Ctrl+S to save</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClose} className="border-border/60">
              Close
            </Button>
            {!isReadOnly && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
