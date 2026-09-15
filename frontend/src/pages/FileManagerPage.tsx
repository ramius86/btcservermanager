import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Folder,
  File,
  FileCode,
  FileText,
  FolderArchive,
  ArrowUp,
  Download,
  Upload,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  Archive,
  FolderPlus,
  FilePlus,
  MoreVertical,
  Lock,
  ChevronRight,
  HardDrive,
  CheckSquare,
  Square,
  X,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/DropdownMenu'
import { useToast } from '../components/ui/Toast'
import { FileManagerService } from '../services/api'
import { FileItemDto } from '../dtos/FileDto'
import { FileEditorModal } from '../components/files/FileEditorModal'

// Quick jump targets from storage root
const QUICK_JUMPS = [
  { label: 'Storage Root', path: '' },
  { label: 'Servers', path: 'servers' },
  { label: 'Mods', path: 'mods' },
  { label: 'Logs', path: 'logs' },
  { label: 'Data', path: 'data' },
]

// Text file extensions that can be edited in the browser
const EDITABLE_EXTENSIONS = new Set([
  '.cfg',
  '.conf',
  '.json',
  '.sqf',
  '.xml',
  '.txt',
  '.log',
  '.ini',
  '.sh',
  '.bat',
  '.ps1',
  '.yaml',
  '.yml',
  '.properties',
  '.env',
  '.arma3profile',
])

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

// Item icon resolver
function getItemIcon(item: FileItemDto) {
  if (item.isDir) {
    return <Folder className="w-4 h-4 text-blue-400 fill-blue-400/10 shrink-0" />
  }
  const ext = item.extension.toLowerCase()
  if (ext === '.zip' || ext === '.tar' || ext === '.gz') {
    return <FolderArchive className="w-4 h-4 text-amber-400 shrink-0" />
  }
  if (ext === '.cfg' || ext === '.conf' || ext === '.json' || ext === '.yaml' || ext === '.yml' || ext === '.xml') {
    return <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
  }
  if (ext === '.sqf' || ext === '.sh' || ext === '.bat' || ext === '.ps1') {
    return <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
  }
  if (ext === '.log' || ext === '.txt') {
    return <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
  }
  return <File className="w-4 h-4 text-neutral-400 shrink-0" />
}

// Item name button renderer (avoiding nested ternaries)
function renderItemName(
  item: FileItemDto,
  isEditable: boolean,
  onNavigate: (path: string) => void,
  onEdit: (item: FileItemDto) => void
) {
  if (item.isDir) {
    return (
      <button
        onClick={() => onNavigate(item.path)}
        className="font-semibold text-foreground hover:text-primary hover:underline truncate text-left"
      >
        {item.name}
      </button>
    )
  }
  if (isEditable) {
    return (
      <button
        onClick={() => onEdit(item)}
        className="text-foreground/90 hover:text-primary hover:underline truncate text-left font-mono text-[12px]"
      >
        {item.name}
      </button>
    )
  }
  return (
    <span className="text-foreground/80 truncate font-mono text-[12px]">
      {item.name}
    </span>
  )
}

export const FileManagerPage: React.FC = () => {
  const { showToast } = useToast()

  // Navigation & Data
  const [currentPath, setCurrentPath] = useState<string>('')
  const [items, setItems] = useState<FileItemDto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Multi-selection
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())

  // Drag & drop upload
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modals state
  const [editorState, setEditorState] = useState<{
    isOpen: boolean
    filePath: string | null
    fileName: string | null
    isReadOnly: boolean
  }>({
    isOpen: false,
    filePath: null,
    fileName: null,
    isReadOnly: false,
  })

  const [createModal, setCreateModal] = useState<{
    isOpen: boolean
    isDir: boolean
    name: string
  }>({
    isOpen: false,
    isDir: false,
    name: '',
  })

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean
    item: FileItemDto | null
    newName: string
  }>({
    isOpen: false,
    item: null,
    newName: '',
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    items: FileItemDto[]
  }>({
    isOpen: false,
    items: [],
  })

  const [compressModal, setCompressModal] = useState<{
    isOpen: boolean
    archiveName: string
  }>({
    isOpen: false,
    archiveName: '',
  })

  const [extractModal, setExtractModal] = useState<{
    isOpen: boolean
    item: FileItemDto | null
    destination: string
  }>({
    isOpen: false,
    item: null,
    destination: '',
  })

  // Load directory contents
  const loadDirectory = async (path: string) => {
    setLoading(true)
    setSelectedPaths(new Set())
    try {
      const res = await FileManagerService.list(path)
      setItems(res.items || [])
      setCurrentPath(path)
    } catch (err: any) {
      showToast(err.message || 'Failed to read directory', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDirectory(currentPath)
  }, [])

  // Check if current directory is inside /data
  const isCurrentDirReadOnly = useMemo(() => {
    const norm = currentPath.replaceAll('\\', '/').replace(/^\/+/, '')
    return norm === 'data' || norm.startsWith('data/')
  }, [currentPath])

  // Filtered & sorted items
  const filteredItems = useMemo(() => {
    let result = items
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter((item) => item.name.toLowerCase().includes(q))
    }
    return [...result].sort((a, b) => {
      if (a.isDir && !b.isDir) return -1
      if (!a.isDir && b.isDir) return 1
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    })
  }, [items, searchQuery])

  // Selection handlers
  const handleToggleSelect = (path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedPaths.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedPaths(new Set())
    } else {
      setSelectedPaths(new Set(filteredItems.map((i) => i.path)))
    }
  }

  const handleNavigate = (path: string) => {
    loadDirectory(path)
  }

  const handleNavigateUp = () => {
    if (!currentPath) return
    const parts = currentPath.replaceAll('\\', '/').split('/').filter(Boolean)
    parts.pop()
    loadDirectory(parts.join('/'))
  }

  // Breadcrumbs parsing
  const breadcrumbSegments = useMemo(() => {
    if (!currentPath) return []
    const parts = currentPath.replaceAll('\\', '/').split('/').filter(Boolean)
    return parts.map((part, index) => {
      const path = parts.slice(0, index + 1).join('/')
      return { label: part, path }
    })
  }, [currentPath])

  // Upload handlers
  const uploadFiles = async (files: File[]) => {
    if (isCurrentDirReadOnly) {
      showToast('Target directory /data is read-only for system stability', 'error')
      return
    }

    setIsUploading(true)
    try {
      await FileManagerService.upload(currentPath, files)
      showToast(`Uploaded ${files.length} file(s) successfully`, 'success')
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Failed to upload files', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)
    await uploadFiles(files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isCurrentDirReadOnly) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isCurrentDirReadOnly) {
      showToast('Directory /data is read-only', 'error')
      return
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      await uploadFiles(files)
    }
  }

  // Create file/folder
  const handleCreateConfirm = async () => {
    const trimmed = createModal.name.trim()
    if (!trimmed) return

    const newSubpath = currentPath ? `${currentPath}/${trimmed}` : trimmed
    try {
      await FileManagerService.create({
        path: newSubpath,
        isDir: createModal.isDir,
      })
      showToast(`Successfully created ${trimmed}`, 'success')
      setCreateModal({ isOpen: false, isDir: false, name: '' })
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Could not create item', 'error')
    }
  }

  // Rename item
  const handleRenameConfirm = async () => {
    if (!renameModal.item) return
    const trimmed = renameModal.newName.trim()
    if (!trimmed || trimmed === renameModal.item.name) {
      setRenameModal({ isOpen: false, item: null, newName: '' })
      return
    }

    const parentDir = currentPath
    const newPath = parentDir ? `${parentDir}/${trimmed}` : trimmed

    try {
      await FileManagerService.rename({
        oldPath: renameModal.item.path,
        newPath,
      })
      showToast(`Renamed to ${trimmed}`, 'success')
      setRenameModal({ isOpen: false, item: null, newName: '' })
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Failed to rename item', 'error')
    }
  }

  // Delete items
  const handleDeleteConfirm = async () => {
    const itemsToDelete = deleteDialog.items
    if (itemsToDelete.length === 0) return

    try {
      for (const item of itemsToDelete) {
        await FileManagerService.delete(item.path)
      }
      showToast(`Deleted ${itemsToDelete.length} item(s)`, 'success')
      setDeleteDialog({ isOpen: false, items: [] })
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Could not delete item(s)', 'error')
    }
  }

  // Compress selected items to zip
  const handleCompressConfirm = async () => {
    const selectedList = Array.from(selectedPaths)
    if (selectedList.length === 0) return

    let archiveName = compressModal.archiveName.trim()
    if (!archiveName) {
      archiveName = 'archive.zip'
    }
    if (!archiveName.toLowerCase().endsWith('.zip')) {
      archiveName += '.zip'
    }

    const destZipPath = currentPath ? `${currentPath}/${archiveName}` : archiveName

    try {
      await FileManagerService.compressZip({
        paths: selectedList,
        destinationZip: destZipPath,
      })
      showToast(`Successfully compressed ${selectedList.length} item(s) to ${archiveName}`, 'success')
      setCompressModal({ isOpen: false, archiveName: '' })
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Failed to create zip archive', 'error')
    }
  }

  // Extract zip
  const handleExtractConfirm = async () => {
    if (!extractModal.item) return
    const zipPath = extractModal.item.path
    const dest = extractModal.destination.trim() || currentPath

    try {
      await FileManagerService.extractZip({
        zipPath,
        destination: dest,
      })
      showToast(`Successfully extracted ${extractModal.item.name}`, 'success')
      setExtractModal({ isOpen: false, item: null, destination: '' })
      loadDirectory(currentPath)
    } catch (err: any) {
      showToast(err.message || 'Failed to extract zip', 'error')
    }
  }

  // Download selected items as zip
  const handleDownloadSelectedAsZip = async () => {
    const selectedList = Array.from(selectedPaths)
    if (selectedList.length === 0) return

    const defaultName = currentPath
      ? `${currentPath.split('/').pop() || 'storage'}_selection.zip`
      : 'storage_selection.zip'

    try {
      await FileManagerService.downloadZip(selectedList, defaultName)
      showToast('Packaging and downloading zip archive', 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to download zip archive', 'error')
    }
  }

  // Delete dialog labels (clean non-nested strings)
  const deleteCount = deleteDialog.items.length
  const deleteTitle = deleteCount === 1 ? 'Delete Item' : `Delete ${deleteCount} Items`
  const deleteTargetLabel = deleteCount === 1 ? `"${deleteDialog.items[0]?.name}"` : `${deleteCount} selected items`
  const deleteDescription = `Are you sure you want to permanently delete ${deleteTargetLabel}? This action cannot be undone.`

  // Table body content renderer (avoiding nested ternaries)
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="py-16 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest">Loading files...</span>
            </div>
          </td>
        </tr>
      )
    }

    if (filteredItems.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="py-16 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              <Folder className="w-8 h-8 opacity-40" />
              <span className="text-xs font-semibold">
                {searchQuery ? 'No files match your search filter' : 'This folder is empty'}
              </span>
            </div>
          </td>
        </tr>
      )
    }

    return filteredItems.map((item) => {
      const isSelected = selectedPaths.has(item.path)
      const isZip = item.extension.toLowerCase() === '.zip'
      const isEditable = !item.isDir && EDITABLE_EXTENSIONS.has(item.extension.toLowerCase())

      return (
        <tr
          key={item.path}
          className={`group transition-colors hover:bg-muted/30 ${
            isSelected ? 'bg-primary/5' : ''
          }`}
        >
          {/* Checkbox */}
          <td className="py-2.5 px-4">
            <button
              onClick={() => handleToggleSelect(item.path)}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              )}
            </button>
          </td>

          {/* Name & Icon */}
          <td className="py-2.5 px-4 font-medium text-foreground">
            <div className="flex items-center gap-2.5 min-w-0">
              {getItemIcon(item)}
              {renderItemName(
                item,
                isEditable,
                handleNavigate,
                (target) =>
                  setEditorState({
                    isOpen: true,
                    filePath: target.path,
                    fileName: target.name,
                    isReadOnly: target.isReadOnly,
                  })
              )}

              {item.isReadOnly && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Lock className="w-2.5 h-2.5" /> Read-Only
                </span>
              )}
            </div>
          </td>

          {/* Size */}
          <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
            {item.isDir ? '—' : formatFileSize(item.size)}
          </td>

          {/* Modified Date */}
          <td className="py-2.5 px-4 text-muted-foreground/80 whitespace-nowrap hidden md:table-cell text-[11px]">
            {formatDate(item.modTime)}
          </td>

          {/* Actions Dropdown */}
          <td className="py-2.5 px-4 text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-70 group-hover:opacity-100 hover:bg-muted/50"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {item.isDir && (
                  <>
                    <DropdownMenuItem onClick={() => handleNavigate(item.path)}>
                      <Folder className="w-3.5 h-3.5 mr-2 text-blue-400" />
                      Open Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(FileManagerService.downloadUrl(item.path), '_blank')
                      }
                    >
                      <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                      Download as Zip
                    </DropdownMenuItem>
                  </>
                )}

                {!item.isDir && isEditable && (
                  <DropdownMenuItem
                    onClick={() =>
                      setEditorState({
                        isOpen: true,
                        filePath: item.path,
                        fileName: item.name,
                        isReadOnly: item.isReadOnly,
                      })
                    }
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-2 text-primary" />
                    {item.isReadOnly ? 'View File' : 'Edit File'}
                  </DropdownMenuItem>
                )}

                {isZip && !item.isReadOnly && (
                  <DropdownMenuItem
                    onClick={() =>
                      setExtractModal({
                        isOpen: true,
                        item,
                        destination: currentPath,
                      })
                    }
                  >
                    <Archive className="w-3.5 h-3.5 mr-2 text-amber-400" />
                    Extract Archive
                  </DropdownMenuItem>
                )}

                {!item.isDir && (
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(FileManagerService.downloadUrl(item.path), '_blank')
                    }
                  >
                    <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                    Download File
                  </DropdownMenuItem>
                )}

                {!item.isReadOnly && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setRenameModal({
                          isOpen: true,
                          item,
                          newName: item.name,
                        })
                      }
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          items: [item],
                        })
                      }
                      className="text-red-400 focus:text-red-300 focus:bg-red-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      )
    })
  }

  return (
    <div
      className="relative space-y-6 pb-12"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary pointer-events-none animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface border border-primary/30 shadow-2xl">
            <Upload className="w-12 h-12 text-primary animate-bounce" />
            <div className="text-center">
              <h3 className="text-lg font-bold">Drop files to upload</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Files will be saved into {currentPath ? `/${currentPath}` : 'storage root'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header & Quick Jumps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-primary" />
            <span>File Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">
            Browse, upload, download, and edit server files and mod scripts
          </p>
        </div>

        {/* Quick jump pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {QUICK_JUMPS.map((q) => {
            const isActive = currentPath === q.path
            return (
              <button
                key={q.path}
                onClick={() => handleNavigate(q.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 border ${
                  isActive
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-surface-elevated/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80'
                }`}
              >
                {q.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Breadcrumbs Navigation Bar */}
      <Card className="border-border/60 bg-surface-elevated/30 p-2.5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium no-scrollbar">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateUp}
              disabled={!currentPath}
              className="h-7 px-2 text-xs border border-border/40 hover:bg-muted/30"
              title="Go to parent directory"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </Button>

            <button
              onClick={() => handleNavigate('')}
              className={`px-2 py-1 rounded hover:bg-muted/30 transition-colors flex items-center gap-1 ${
                currentPath ? 'text-muted-foreground' : 'text-primary font-bold'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>storage</span>
            </button>

            {breadcrumbSegments.map((seg, idx) => {
              const isLast = idx === breadcrumbSegments.length - 1
              return (
                <React.Fragment key={seg.path}>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  <button
                    onClick={() => handleNavigate(seg.path)}
                    className={`px-2 py-1 rounded hover:bg-muted/30 transition-colors truncate max-w-[150px] ${
                      isLast ? 'text-primary font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {seg.label}
                  </button>
                </React.Fragment>
              )
            })}
          </div>

          {isCurrentDirReadOnly && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Read-Only Directory</span>
            </div>
          )}
        </div>
      </Card>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter current folder..."
            className="pl-9 h-9 text-xs bg-surface-elevated/40 border-border/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDirectory(currentPath)}
            disabled={loading}
            className="h-9 px-3 text-xs border-border/60 bg-surface-elevated/40 hover:bg-muted/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {!isCurrentDirReadOnly && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateModal({ isOpen: true, isDir: false, name: '' })}
                className="h-9 px-3 text-xs border-border/60 bg-surface-elevated/40 hover:bg-muted/40"
              >
                <FilePlus className="w-3.5 h-3.5 mr-1.5 text-primary" />
                New File
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateModal({ isOpen: true, isDir: true, name: '' })}
                className="h-9 px-3 text-xs border-border/60 bg-surface-elevated/40 hover:bg-muted/40"
              >
                <FolderPlus className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                New Folder
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-9 px-3 text-xs gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Multi-Selection Batch Action Bar */}
      {selectedPaths.size > 0 && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" />
              <span>{selectedPaths.size} item(s) selected</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const def = currentPath ? `${currentPath.split('/').pop()}_archive.zip` : 'archive.zip'
                setCompressModal({ isOpen: true, archiveName: def })
              }}
              disabled={isCurrentDirReadOnly}
              className="h-8 px-2.5 text-xs bg-surface border-border hover:bg-muted/40"
            >
              <Archive className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Compress to Zip
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelectedAsZip}
              className="h-8 px-2.5 text-xs bg-surface border-border hover:bg-muted/40"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Download as Zip
            </Button>

            {!isCurrentDirReadOnly && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const toDelete = items.filter((i) => selectedPaths.has(i.path))
                  setDeleteDialog({ isOpen: true, items: toDelete })
                }}
                className="h-8 px-2.5 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete Selected
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPaths(new Set())}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Files Table Card */}
      <Card className="border-border/60 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/50 bg-surface-elevated/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {selectedPaths.size > 0 && selectedPaths.size === filteredItems.length ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 w-28">Size</th>
                <th className="py-3 px-4 w-44 hidden md:table-cell">Modified</th>
                <th className="py-3 px-4 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </Card>

      {/* In-Browser Text Editor Modal */}
      <FileEditorModal
        isOpen={editorState.isOpen}
        filePath={editorState.filePath}
        fileName={editorState.fileName}
        isReadOnly={editorState.isReadOnly}
        onClose={() => setEditorState((prev) => ({ ...prev, isOpen: false }))}
        onSaved={() => loadDirectory(currentPath)}
      />

      {/* New File / New Folder Dialog */}
      <Dialog
        open={createModal.isOpen}
        onOpenChange={(open) => setCreateModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {createModal.isDir ? (
                <>
                  <FolderPlus className="w-5 h-5 text-blue-400" />
                  <span>Create New Folder</span>
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5 text-primary" />
                  <span>Create New File</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Enter name for the new {createModal.isDir ? 'folder' : 'file'} in{' '}
              <span className="font-mono text-foreground">{currentPath ? `/${currentPath}` : 'storage root'}</span>
            </p>
            <Input
              value={createModal.name}
              onChange={(e) => setCreateModal((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={createModal.isDir ? 'folder_name' : 'config.cfg'}
              className="h-9 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateConfirm()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateConfirm}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renameModal.isOpen}
        onOpenChange={(open) => setRenameModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              <span>Rename Item</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Enter a new name for <span className="font-mono text-foreground">{renameModal.item?.name}</span>
            </p>
            <Input
              value={renameModal.newName}
              onChange={(e) => setRenameModal((prev) => ({ ...prev, newName: e.target.value }))}
              className="h-9 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRenameModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRenameConfirm}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compress to Zip Dialog */}
      <Dialog
        open={compressModal.isOpen}
        onOpenChange={(open) => setCompressModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-400" />
              <span>Compress Items into Zip</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Specify archive filename for {selectedPaths.size} selected item(s).
            </p>
            <Input
              value={compressModal.archiveName}
              onChange={(e) => setCompressModal((prev) => ({ ...prev, archiveName: e.target.value }))}
              placeholder="archive.zip"
              className="h-9 text-xs font-mono"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCompressConfirm()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompressModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCompressConfirm}>
              Create Zip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extract Zip Dialog */}
      <Dialog
        open={extractModal.isOpen}
        onOpenChange={(open) => setExtractModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-md bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-amber-400" />
              <span>Extract Zip Archive</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Extract <span className="font-mono text-foreground">{extractModal.item?.name}</span> into:
            </p>
            <Input
              value={extractModal.destination}
              onChange={(e) => setExtractModal((prev) => ({ ...prev, destination: e.target.value }))}
              placeholder="Destination path (e.g. servers/ARMA3)"
              className="h-9 text-xs font-mono"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleExtractConfirm()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExtractModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleExtractConfirm}>
              Extract Here
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, items: [] })}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
