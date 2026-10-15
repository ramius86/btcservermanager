import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Input } from '../ui/Input'
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Search,
  KeyRound,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Sparkles,
} from 'lucide-react'
import { WorkshopService } from '../../services/api'
import { ModSignatureReportDto } from '../../dtos/ModDto'
import { useToast } from '../ui/Toast'
import { Switch } from '../ui/Switch'
import { useWebSocket } from '../../contexts/WebSocketContext'

interface SignatureVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getModCardStyle(isError: boolean, isWarning: boolean): string {
  if (isError) return 'border-rose-500/40 bg-rose-500/5'
  if (isWarning) return 'border-amber-500/40 bg-amber-500/5'
  return 'border-border bg-surface/40'
}

function getModStatusIcon(isError: boolean, isWarning: boolean) {
  if (isError) return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
  if (isWarning) return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
  return <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
}

function getPboStatusLabel(status: string) {
  if (status === 'VALID') {
    return <span className="text-emerald-500 font-bold">VALID</span>
  }
  if (status === 'ERROR') {
    return <span className="text-rose-500 font-bold">ERROR</span>
  }
  return <span className="text-amber-500 font-bold">{status}</span>
}

export const SignatureVerificationDialog: React.FC<SignatureVerificationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { showToast } = useToast()
  const { subscribe } = useWebSocket()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number; modName: string } | null>(null)
  const [reports, setReports] = useState<ModSignatureReportDto[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ERROR' | 'WARNING' | 'VALID'>('ALL')
  const [autoExtract, setAutoExtract] = useState(true)
  const [expandedMods, setExpandedMods] = useState<Record<number, boolean>>({})

  // WebSocket progress listener
  useEffect(() => {
    if (!open) return

    const unsub = subscribe('mod_signature_progress', (e) => {
      if (!e.payload) return
      const { current, total, modName, report, completed } = e.payload
      if (typeof total === 'number' && total > 0) {
        setProgress({ current: current || 0, total, modName: modName || '' })
      }
      if (report && typeof report.modId === 'number') {
        setReports((prev) => {
          const idx = prev.findIndex((r) => r.modId === report.modId)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = report
            return next
          }
          return [...prev, report]
        })
      }
      if (completed) {
        setLoading(false)
        setProgress(null)
      }
    })

    return () => unsub()
  }, [open, subscribe])

  const runVerification = async () => {
    setLoading(true)
    setProgress({ current: 0, total: 0, modName: 'Initializing...' })
    try {
      const data = await WorkshopService.verifySignatures(autoExtract)
      setReports(Array.isArray(data) ? data : [])
      showToast('Arma 3 signature verification completed', 'success')
    } catch (err: any) {
      console.error(err)
      showToast('Failed to verify signatures: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }

  useEffect(() => {
    if (open) {
      runVerification()
    }
  }, [open])

  const toggleExpand = (modId: number) => {
    setExpandedMods((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  const stats = useMemo(() => {
    const total = reports.length
    const valid = reports.filter((r) => r.overallStatus === 'VALID').length
    const errors = reports.filter((r) => r.overallStatus === 'ERROR').length
    const warnings = reports.filter((r) => r.overallStatus === 'WARNING' || r.overallStatus === 'NO_BIKEY' || r.overallStatus === 'MISSING_SIGNATURES').length
    const extracted = reports.reduce((acc, r) => acc + (r.keysExtracted?.length || 0), 0)
    const totalPbos = reports.reduce((acc, r) => acc + (r.totalPbos || 0), 0)
    const verifiedPbos = reports.reduce((acc, r) => acc + (r.verifiedPbos || 0), 0)

    return { total, valid, errors, warnings, extracted, totalPbos, verifiedPbos }
  }, [reports])

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter === 'ERROR' && r.overallStatus !== 'ERROR') return false
      if (statusFilter === 'WARNING' && r.overallStatus !== 'WARNING' && r.overallStatus !== 'NO_BIKEY' && r.overallStatus !== 'MISSING_SIGNATURES') return false
      if (statusFilter === 'VALID' && r.overallStatus !== 'VALID') return false

      if (search.trim()) {
        const query = search.toLowerCase()
        const matchesName = (r.modName || '').toLowerCase().includes(query)
        const matchesId = String(r.modId).includes(query)
        const matchesKey = r.keysFound?.some((k) => (k || '').toLowerCase().includes(query))
        return matchesName || matchesId || Boolean(matchesKey)
      }

      return true
    })
  }, [reports, statusFilter, search])

  const renderContent = () => {
    if (loading && reports.length === 0) {
      return (
        <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm">Cryptographically verifying PBOs and signatures...</p>
        </div>
      )
    }

    if (filteredReports.length === 0) {
      return (
        <div className="py-16 text-center text-muted-foreground">
          <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No mods match the selected criteria.</p>
        </div>
      )
    }

    return filteredReports.map((mod) => {
      const isExpanded = Boolean(expandedMods[mod.modId])
      const isError = mod.overallStatus === 'ERROR'
      const isWarning = mod.overallStatus === 'WARNING' || mod.overallStatus === 'NO_BIKEY' || mod.overallStatus === 'MISSING_SIGNATURES'
      const isValid = mod.overallStatus === 'VALID'
      const keysFoundCount = mod.keysFound?.length ?? 0
      const keysExtractedCount = mod.keysExtracted?.length ?? 0
      const pboResultsList = mod.pboResults || []

      return (
        <div
          key={mod.modId}
          className={`border rounded-lg overflow-hidden transition-all duration-200 ${getModCardStyle(isError, isWarning)}`}
        >
          {/* Mod header button */}
          <button
            type="button"
            onClick={() => toggleExpand(mod.modId)}
            className="w-full text-left p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-surface/60 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getModStatusIcon(isError, isWarning)}

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-foreground truncate">{mod.modName}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">ID: {mod.modId}</span>

                  {isError && (
                    <Badge variant="danger" className="text-[9px] uppercase tracking-wider h-4 px-1.5">
                      ERROR
                    </Badge>
                  )}
                  {isWarning && (
                    <Badge variant="warning" className="text-[9px] uppercase tracking-wider h-4 px-1.5">
                      WARNING
                    </Badge>
                  )}
                  {isValid && (
                    <Badge variant="success" className="text-[9px] uppercase tracking-wider h-4 px-1.5">
                      VERIFIED
                    </Badge>
                  )}

                  {keysExtractedCount > 0 && (
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider h-4 px-1.5 text-cyan-400 border-cyan-400/40 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      AUTO-RECOVERED KEY
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-0.5 truncate">{mod.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-foreground">
                  {mod.verifiedPbos ?? 0}/{mod.totalPbos ?? 0} PBOs
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {keysFoundCount} bikey{keysFoundCount === 1 ? '' : 's'}
                </span>
              </div>
              <div className="text-muted-foreground">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {/* Accordion detail content */}
          {isExpanded && (
            <div className="border-t border-border/60 bg-surface/20 p-4 space-y-3">
              {/* Keys info bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground font-semibold">
                  <KeyRound className="w-3.5 h-3.5 text-primary" />
                  <span>Keys in mod:</span>
                </div>
                {keysFoundCount > 0 ? (
                  mod.keysFound?.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-surface border border-border font-mono text-[11px] text-foreground">
                      {k}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground italic text-xs">No .bikey packaged in mod directory</span>
                )}

                {keysExtractedCount > 0 && (
                  <div className="flex items-center gap-1.5 ml-auto text-cyan-400 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recovered from signature: {mod.keysExtracted?.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface/50 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="py-1.5 px-3">Archive (.pbo)</th>
                      <th className="py-1.5 px-3">Signature (.bisign)</th>
                      <th className="py-1.5 px-3">Matched Key</th>
                      <th className="py-1.5 px-3">Status</th>
                      <th className="py-1.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    {pboResultsList.map((pbo) => {
                      const bisignFilesList = pbo.bisignFiles && pbo.bisignFiles.length > 0
                        ? pbo.bisignFiles.join(', ')
                        : 'None'

                      return (
                        <tr key={pbo.pboPath} className="hover:bg-surface/40">
                          <td className="py-1.5 px-3 font-semibold text-foreground truncate max-w-[180px]" title={pbo.pboPath}>
                            {pbo.pboPath}
                          </td>
                          <td className="py-1.5 px-3 text-muted-foreground truncate max-w-[160px]">
                            {bisignFilesList}
                          </td>
                          <td className="py-1.5 px-3 text-muted-foreground">
                            {pbo.matchingBikey ? (
                              <span className="text-primary font-medium flex items-center gap-1">
                                {pbo.matchingBikey}
                                {pbo.keyExtracted && <Sparkles className="w-2.5 h-2.5 text-cyan-400" />}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-1.5 px-3">
                            {getPboStatusLabel(pbo.status)}
                          </td>
                          <td className="py-1.5 px-3 text-muted-foreground max-w-[220px] truncate" title={pbo.errorMessage || 'Verified OK'}>
                            {pbo.errorMessage || <span className="text-emerald-500/80">Signature intact</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden bg-surface-elevated border-border">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-border bg-surface/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Arma 3 Signature Verification</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Inspects .pbo archives against .bisign signatures and server .bikey keys.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                <Switch
                  checked={autoExtract}
                  onCheckedChange={setAutoExtract}
                  className="scale-75"
                />
                <span>Auto-recover keys</span>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={runVerification}
                disabled={loading}
                className="text-xs font-bold uppercase tracking-wider h-8"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Verifying...' : 'Re-verify All'}
              </Button>
            </div>
          </div>

          {/* Live Progress Bar when verifying */}
          {loading && progress && progress.total > 0 && (
            <div className="mt-4 p-3 bg-surface/80 border border-primary/30 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                  <span className="font-semibold text-foreground truncate">
                    Checking {progress.modName || 'mods'}...
                  </span>
                </div>
                <span className="font-mono text-muted-foreground text-[11px] shrink-0">
                  {progress.current} / {progress.total} ({Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((progress.current / Math.max(progress.total, 1)) * 100))}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
            <div className="bg-surface/60 border border-border rounded-md p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Mods</span>
              <span className="text-lg font-bold text-foreground">{stats.total}</span>
            </div>
            <div className="bg-surface/60 border border-border rounded-md p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-500 block">Valid</span>
              <span className="text-lg font-bold text-emerald-500">{stats.valid}</span>
            </div>
            <div className="bg-surface/60 border border-border rounded-md p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Errors</span>
              <span className="text-lg font-bold text-rose-500">{stats.errors}</span>
            </div>
            <div className="bg-surface/60 border border-border rounded-md p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-500 block">Warnings</span>
              <span className="text-lg font-bold text-amber-500">{stats.warnings}</span>
            </div>
            <div className="bg-surface/60 border border-border rounded-md p-2.5 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-primary block">PBOs Checked</span>
              <span className="text-lg font-bold text-foreground">
                {stats.verifiedPbos}/{stats.totalPbos}
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(['ALL', 'ERROR', 'WARNING', 'VALID'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setStatusFilter(filter)}
                  className="text-[10px] font-bold uppercase tracking-wider h-7 px-2.5"
                >
                  {filter}
                </Button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search mod or key..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 pl-8 text-xs bg-surface border-border"
              />
            </div>
          </div>
        </DialogHeader>

        {/* List of Mods */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
