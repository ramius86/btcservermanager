import { useState, useEffect, useRef } from 'react'
import { Activity, Cpu, Users, Bot, Car, Rocket, Network, AlertTriangle, Loader2, ZoomOut } from 'lucide-react'
import { Card, CardContent } from './ui/Card'
import { LogService } from '../services/api'
import { ReforgerStatsProvider, useReforgerStats } from '../contexts/ReforgerStatsContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
)

interface ReforgerStatsDashboardProps {
  serverId: number
  filename: string
  logStatsInterval?: number
  autoRefresh?: boolean
  isLive?: boolean
}

function StatCard({ title, value, unit, icon: Icon, color, max }: any) {
  const percent = max ? Math.min((Number.parseFloat(value) / max) * 100, 100) : 0
  return (
    <Card className="bg-surface border-border overflow-hidden shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
        {max && (
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ReforgerStatsDashboard(props: Readonly<ReforgerStatsDashboardProps>) {
  if (!props.logStatsInterval || props.logStatsInterval <= 0) {
    return (
      <div className="mt-4 p-4 rounded-lg border border-amber-500/30 bg-amber-900/10 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <div>
          <p className="font-medium text-amber-600 dark:text-amber-400">Performance Logging Disabled</p>
          <p className="text-xs text-muted-foreground">Set <strong>Performance Logging (ms)</strong> in server settings to see statistics.</p>
        </div>
      </div>
    )
  }

  return (
    <ReforgerStatsProvider serverId={props.serverId}>
      <ReforgerStatsContent {...props} />
    </ReforgerStatsProvider>
  )
}

function ReforgerStatsContent({ serverId, filename, isLive }: Readonly<ReforgerStatsDashboardProps>) {
  const { stats } = useReforgerStats()
  const [initialLoading, setInitialLoading] = useState(true)
  const [initialStats, setInitialStats] = useState<any[]>([])
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (serverId === 0 || !filename) {
      setInitialStats([])
      setInitialLoading(false)
      return
    }
    // Fetch initial history
    LogService.getServerStats(serverId, filename)
      .then((data) => {
        setInitialStats(data || [])
      })
      .finally(() => setInitialLoading(false))
  }, [serverId, filename])

  const seenTimestamps = new Set(initialStats.map(s => s.timestamp))
  const wsNew = stats.filter(s => !seenTimestamps.has(s.timestamp))
  const combinedAll = isLive ? [...initialStats, ...wsNew] : initialStats
  const maxHistory = 15000
  const historyStats = combinedAll.length > maxHistory ? combinedAll.slice(-maxHistory) : combinedAll

  const maxChartPoints = 1500
  let combinedStats = historyStats
  if (historyStats.length > maxChartPoints) {
    const step = Math.ceil(historyStats.length / maxChartPoints)
    const downsampled = []
    for (let i = 0; i < historyStats.length; i += step) {
      const chunk = historyStats.slice(i, i + step)
      if (chunk.length === 0) continue
      const minFpsPoint = chunk.reduce((prev, curr) => (curr.fps < prev.fps ? curr : prev), chunk[0])
      downsampled.push(minFpsPoint)
    }
    if (downsampled.length > 0 && historyStats.length > 0 && downsampled.at(-1)?.timestamp !== historyStats.at(-1)?.timestamp) {
      const lastPoint = historyStats.at(-1)
      if (lastPoint) downsampled.push(lastPoint)
    }
    combinedStats = downsampled
  }

  if (initialLoading && combinedStats.length === 0) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
  }

  if (serverId === 0 || !filename) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
        <p className="font-medium">No server log selected</p>
        <p className="text-xs">Please select a valid server log file to view telemetry.</p>
      </div>
    )
  }

  if (!initialLoading && combinedStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
        <p className="font-medium">No telemetry data found</p>
        <p className="text-xs">Waiting for the server to write performance metrics...</p>
      </div>
    )
  }

  const latest = historyStats.at(-1)

  const parseTime = (ts: string) => {
    if (!ts) return new Date()
    return new Date(ts.replace(' ', 'T'))
  }

  const chartData = {
    datasets: [
      {
        label: 'FPS',
        data: combinedStats.map(s => ({ x: parseTime(s.timestamp), y: s.fps })),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Players',
        data: combinedStats.map(s => ({ x: parseTime(s.timestamp), y: s.players })),
        borderColor: '#f59e0b',
        yAxisID: 'y1',
        tension: 0,
        pointRadius: 2,
        borderWidth: 2,
      },
      {
        label: 'AI',
        data: combinedStats.map(s => ({ x: parseTime(s.timestamp), y: s.ai })),
        borderColor: '#8b5cf6',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1.5,
      }
    ]
  }

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'HH:mm:ss',
          displayFormats: {
            millisecond: 'HH:mm:ss.SSS',
            second: 'HH:mm:ss',
            minute: 'HH:mm',
            hour: 'HH:mm'
          }
        },
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          font: { family: 'JetBrains Mono', size: 10 }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'FPS', font: { size: 10, weight: 'bold' } },
        min: 0,
        max: 140,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { font: { size: 10 } }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Count', font: { size: 10, weight: 'bold' } },
        min: 0,
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 } }
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        }
      },
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 10, weight: 'bold' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { size: 11 },
        padding: 10,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    }
  }

  return (
    <div className="space-y-4 mt-2">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <StatCard title="Server FPS" value={latest?.fps || 0} unit="" icon={Activity} color="#10b981" max={120} />
        <StatCard title="RAM" value={(latest?.memoryMb ? latest.memoryMb / 1024 : 0).toFixed(2)} unit="GB" icon={Cpu} color="#3b82f6" max={16} />
        <StatCard title="Players" value={latest?.players || 0} unit="" icon={Users} color="#f59e0b" max={128} />
        <StatCard title="AI" value={latest?.ai || 0} unit="" icon={Bot} color="#8b5cf6" max={500} />
        <StatCard title="Vehicles" value={`${latest?.vehicles || 0} (${latest?.vehiclesTotal || 0})`} unit="" icon={Car} color="#ef4444" />
        <StatCard title="Projectiles" value={latest?.projectiles || 0} unit="" icon={Rocket} color="#78350f" />
        <StatCard title="Network" value={latest?.rplItems || 0} unit="obj" icon={Network} color="#06b6d4" />
      </div>

      {/* Real-time Chart */}
      <Card className="bg-surface border-border shadow-sm overflow-hidden">
        <CardContent className="p-4 flex flex-col relative">
          <div className="flex justify-end mb-2 absolute top-2 right-2 z-10">
            <button 
              onClick={() => chartRef.current?.resetZoom()} 
              className="flex items-center gap-1 text-xs px-2 py-1 bg-surface-hover rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Zoom"
            >
              <ZoomOut className="w-3 h-3" />
              Reset Zoom
            </button>
          </div>
          <div className="h-[300px] w-full mt-4">
            <Line ref={chartRef} data={chartData as any} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

