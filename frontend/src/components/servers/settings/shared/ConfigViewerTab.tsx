import { useState, useEffect } from 'react'
import { FileText, RefreshCw, AlertTriangle, FileJson, FileCode } from 'lucide-react'
import { ServerService } from '../../../../services/api'
import { Card, CardContent } from '../../../ui/Card'
import { Button } from '../../../ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/Tabs'

interface ConfigViewerTabProps {
  serverId: number
  serverType?: string
}

export function ConfigViewerTab({ serverId }: Readonly<ConfigViewerTabProps>) {
  const [configs, setConfigs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<string | null>(null)

  const fetchConfigs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ServerService.getConfigs(serverId)
      setConfigs(data)
      const filenames = Object.keys(data)
      if (filenames.length > 0 && !activeFile) {
        setActiveFile(filenames[0])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch configuration files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (serverId && serverId > 0) {
      fetchConfigs()
    } else {
      setLoading(false)
    }
  }, [serverId])

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.json')) return <FileJson className="w-4 h-4" />
    if (filename.endsWith('.cfg') || filename.endsWith('.Arma3Profile')) return <FileCode className="w-4 h-4" />
    if (filename.endsWith('.sqf')) return <FileCode className="w-4 h-4 text-primary" />
    return <FileText className="w-4 h-4" />
  }

  if (!serverId || serverId <= 0) {
    return (
      <Card className="border-border/50 bg-surface-elevated/20">
        <CardContent className="py-20 flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500/50" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-muted-foreground">Server Not Deployed</h3>
            <p className="text-sm text-muted-foreground/80 max-w-md">Configuration files are generated and stored on disk only after the server has been created and started for the first time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && Object.keys(configs).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Loading physical configuration files...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-900/50 bg-red-950/10">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-red-200">Retrieval Failure</h3>
            <p className="text-sm text-red-400/80 max-w-md">{error}</p>
          </div>
          <Button variant="outline" onClick={fetchConfigs} className="border-red-900/50 hover:bg-red-900/20 text-red-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const filenames = Object.keys(configs)

  if (filenames.length === 0) {
    return (
      <Card className="border-border/50 bg-surface-elevated/20">
        <CardContent className="py-20 flex flex-col items-center text-center space-y-4">
          <FileText className="w-12 h-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-muted-foreground">No Configuration Files</h3>
            <p className="text-sm text-muted-foreground/80 max-w-md">No configuration files found on disk for this instance. They will be generated when you first start the server.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Configuration Preview</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Real-time view of files currently saved on storage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchConfigs} 
            disabled={loading}
            className="bg-surface-elevated/50 border-border hover:bg-muted/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh from Disk
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
        <div className="h-1 bg-primary" />
        <Tabs value={activeFile || ''} onValueChange={setActiveFile} className="w-full">
          <div className="px-4 pt-4 border-b border-border/50 bg-surface-elevated/30">
            <TabsList className="bg-transparent h-auto p-0 gap-4 overflow-x-auto no-scrollbar">
              {filenames.map(name => (
                <TabsTrigger 
                  key={name}
                  value={name}
                  className="rounded-none border-b-2 border-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(name)}
                    {name}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {filenames.map(name => (
            <TabsContent key={name} value={name} className="mt-0 outline-none">
              <div className="relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                  <div className="bg-muted/80 backdrop-blur border border-border rounded-md px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Read-Only
                  </div>
                </div>
                <div className="p-0 overflow-auto max-h-[600px] bg-muted/50 custom-scrollbar text-left">
                  <pre className="p-6 text-[11px] font-mono leading-relaxed text-foreground/90 whitespace-pre-wrap break-all">
                    <code>{configs[name]}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-primary" />
        <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest text-left">
          Changes made in other tabs must be saved and the server started/restarted to be reflected here.
        </p>
      </div>
    </div>
  )
}
