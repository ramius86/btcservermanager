import { useState, useEffect } from 'react'
import { Upload, Trash, Download, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { ScenarioService } from '../services/api'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import { useToast } from '../components/ui/Toast'
import { Badge } from '../components/ui/Badge'

import { useDragAndDrop } from '../hooks/useDragAndDrop'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function ScenariosPage() {
  const { showToast } = useToast()
  const [arma3Scenarios, setArma3Scenarios] = useState<any[]>([])
  const [reforgerScenarios, setReforgerScenarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [a3SortField, setA3SortField] = useState<'name' | 'createdAt'>('name')
  const [a3SortOrder, setA3SortOrder] = useState<'asc' | 'desc'>('asc')
  const [rfSortField, setRfSortField] = useState<'name' | 'source' | 'gameMode' | 'playerCount'>('name')
  const [rfSortOrder, setRfSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    refreshScenarios()
  }, [])

  async function refreshScenarios() {
    setLoading(true)
    try {
      const [a3Data, rfData] = await Promise.all([
        ScenarioService.getArma3().catch(() => []),
        ScenarioService.getReforger().catch(() => []),
      ])
      setArma3Scenarios(a3Data)
      setReforgerScenarios(rfData)
    } catch (err) {
      console.error("Failed to fetch scenarios", err)
      showToast("Failed to fetch scenarios", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteA3 = async () => {
    if (!deleteConfirm) return
    try {
      await ScenarioService.deleteArma3(deleteConfirm)
      showToast(`Scenario ${deleteConfirm} deleted.`, 'success')
      refreshScenarios()
    } catch (err) {
      console.error(err)
      showToast("Failed to delete scenario", "error")
    }
    setDeleteConfirm(null)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setLoading(true)
    try {
      await ScenarioService.uploadArma3(e.target.files)
      showToast("Scenarios uploaded successfully.", 'success')
      refreshScenarios()
    } catch (err) {
      console.error("Upload failed", err)
      showToast("Failed to upload scenario", "error")
    } finally {
      setLoading(false)
    }
  }

  const onDropFiles = async (files: FileList) => {
    const pboFiles = Array.from(files).filter(file => file.name.endsWith('.pbo'))
    if (pboFiles.length === 0) {
      showToast("Only .pbo scenario files are accepted here.", "error")
      return
    }

    setLoading(true)
    try {
      await ScenarioService.uploadArma3(pboFiles)
      showToast(`${pboFiles.length} scenario(s) uploaded successfully.`, 'success')
      refreshScenarios()
    } catch (err) {
      console.error("Upload failed", err)
      showToast("Failed to upload scenario(s)", "error")
    } finally {
      setLoading(false)
    }
  }

  const { isDragging, dragProps } = useDragAndDrop(onDropFiles)

  const handleDownload = (name: string) => {
    window.open(`${API_BASE}/scenarios/arma3/${encodeURIComponent(name)}`, '_blank')
  }

  const toggleA3Sort = (field: 'name' | 'createdAt') => {
    if (a3SortField === field) {
      setA3SortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setA3SortField(field)
      setA3SortOrder('asc')
    }
  }

  const toggleRfSort = (field: 'name' | 'source' | 'gameMode' | 'playerCount') => {
    if (rfSortField === field) {
      setRfSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setRfSortField(field)
      setRfSortOrder('asc')
    }
  }

  const renderSortIcon = (currentField: string, field: string, order: 'asc' | 'desc') => {
    if (currentField !== field) return <ArrowUpDown className="w-3 h-3 ml-1.5 inline text-muted-foreground/30" />
    return order === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1.5 inline text-primary" /> 
      : <ArrowDown className="w-3 h-3 ml-1.5 inline text-primary" />
  }

  const sortedArma3Scenarios = [...arma3Scenarios].sort((a, b) => {
    let valA = a[a3SortField]
    let valB = b[a3SortField]

    if (a3SortField === 'createdAt') {
      const timeA = valA ? new Date(valA).getTime() : 0
      const timeB = valB ? new Date(valB).getTime() : 0
      return a3SortOrder === 'asc' ? timeA - timeB : timeB - timeA
    } else {
      const strA = (valA || '').toString().toLowerCase()
      const strB = (valB || '').toString().toLowerCase()
      return a3SortOrder === 'asc' 
        ? strA.localeCompare(strB) 
        : strB.localeCompare(strA)
    }
  })

  const safeReforgerScenarios = Array.isArray(reforgerScenarios) ? reforgerScenarios : []

  const sortedReforgerScenarios = [...safeReforgerScenarios].sort((a, b) => {
    let valA: any = ''
    let valB: any = ''

    if (rfSortField === 'name') {
      valA = a.name || a.value || ''
      valB = b.name || b.value || ''
    } else if (rfSortField === 'source') {
      valA = a.isOfficial ? 'Official' : (a.modName || '')
      valB = b.isOfficial ? 'Official' : (b.modName || '')
    } else if (rfSortField === 'gameMode') {
      valA = a.gameMode || ''
      valB = b.gameMode || ''
    } else if (rfSortField === 'playerCount') {
      valA = a.playerCount || 0
      valB = b.playerCount || 0
      return rfSortOrder === 'asc' ? valA - valB : valB - valA
    }

    const strA = valA.toString().toLowerCase()
    const strB = valB.toString().toLowerCase()
    return rfSortOrder === 'asc' 
      ? strA.localeCompare(strB) 
      : strB.localeCompare(strA)
  })

  return (
    <div 
      className="space-y-10 max-w-7xl mx-auto py-8 px-6 relative min-h-[500px]"
      {...dragProps}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center z-50 transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col items-center gap-4 p-8 bg-surface-elevated/80 border border-border/50 rounded-xl shadow-2xl max-w-md text-center pointer-events-none transform scale-105 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-bounce">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Upload Scenario</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Drop your <span className="font-semibold text-primary font-mono">.pbo</span> files here to upload them to the Arma 3 mission library.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Missions</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button 
            variant="secondary"
            className="border-border bg-surface-elevated/50 hover:bg-surface"
            onClick={() => document.getElementById('pbo-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload .pbo
          </Button>
          <input 
            id="pbo-upload"
            type="file" 
            multiple 
            accept=".pbo" 
            className="hidden" 
            onChange={handleUpload}
          />
        </div>
      </div>

      <Tabs defaultValue="arma3" className="w-full min-w-0">
        <TabsList className="bg-surface-elevated/50 p-1 border border-border rounded-lg w-fit inline-flex max-w-full overflow-x-auto no-scrollbar">
          <TabsTrigger value="arma3" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Arma 3 Missions</TabsTrigger>
          <TabsTrigger value="reforger" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Reforger Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="arma3" className="pt-6">
          <Card className="border-border bg-surface shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border bg-surface-elevated/30 py-5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Stored PBO missions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleA3Sort('name')}
                    >
                      Asset Name {renderSortIcon(a3SortField, 'name', a3SortOrder)}
                    </TableHead>
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleA3Sort('createdAt')}
                    >
                      Upload Date {renderSortIcon(a3SortField, 'createdAt', a3SortOrder)}
                    </TableHead>
                    <TableHead className="py-4 px-6 text-right text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Management</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Scanning mission directory...
                      </div>
                    </TableCell></TableRow>
                  )}
                  {!loading && sortedArma3Scenarios.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-muted-foreground italic">No mission assets found in the storage directory.</TableCell></TableRow>
                  )}
                  {!loading && sortedArma3Scenarios.length > 0 && sortedArma3Scenarios.map((s) => (
                    <TableRow key={s.name} className="border-border/50 hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 px-6 font-semibold text-foreground">{s.name}</TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground text-sm">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(s.name)} 
                            className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10"
                            title="Download Asset"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteConfirm(s.name)}
                            className="text-muted-foreground hover:text-red-600 dark:hover:text-red-500 hover:bg-red-500/10"
                            title="Delete Asset"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="reforger" className="pt-6">
          <Card className="border-border bg-surface shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border bg-surface-elevated/30 py-5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Available Reforger Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleRfSort('name')}
                    >
                      Scenario Display Name {renderSortIcon(rfSortField, 'name', rfSortOrder)}
                    </TableHead>
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleRfSort('source')}
                    >
                      Source {renderSortIcon(rfSortField, 'source', rfSortOrder)}
                    </TableHead>
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleRfSort('gameMode')}
                    >
                      Game Mode {renderSortIcon(rfSortField, 'gameMode', rfSortOrder)}
                    </TableHead>
                    <TableHead 
                      className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                      onClick={() => toggleRfSort('playerCount')}
                    >
                      Max Players {renderSortIcon(rfSortField, 'playerCount', rfSortOrder)}
                    </TableHead>
                    <TableHead className="py-4 px-6 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Resource ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Indexing workshop content...
                      </div>
                    </TableCell></TableRow>
                  )}
                  {!loading && sortedReforgerScenarios.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                      No Reforger scenarios found. Ensure you have installed workshop mods containing missions.
                    </TableCell></TableRow>
                  )}
                  {!loading && sortedReforgerScenarios.length > 0 && sortedReforgerScenarios.map((s: any, i: number) => (
                    <TableRow key={s.value || i} className="border-border/50 hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 px-6 font-semibold text-foreground">{s.name || s.value || 'Unknown'}</TableCell>
                      <TableCell className="py-4 px-6 text-sm text-foreground">
                        {s.isOfficial ? (
                          <Badge variant="success" className="font-semibold px-2 py-0.5 text-[10px]">Official</Badge>
                        ) : (
                          <span className="text-muted-foreground">{s.modName || 'Workshop Mod'}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground text-sm">{s.gameMode || '-'}</TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground text-sm">{s.playerCount || '-'}</TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="font-mono text-xs text-blue-400/70 bg-blue-400/5 px-2 py-1 rounded border border-blue-400/10">
                          {s.value || '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationDialog 
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete Asset Permanently?"
        description={`This will permanently remove the mission file '${deleteConfirm}' from the server storage. This action cannot be reversed.`}
        onConfirm={handleDeleteA3}
        confirmLabel="Destroy Asset"
        variant="danger"
      />
    </div>
  )
}
