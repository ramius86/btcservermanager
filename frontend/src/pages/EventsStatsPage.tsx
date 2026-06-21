import { useEffect, useState, useMemo } from 'react'
import { Card } from '../components/ui/Card'
import { DiscordService, DiscordRawAttendance } from '../services/api'
import { ArrowLeft, ArrowUpDown, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

type SortField = 'username' | 'going' | 'notGoing' | 'maybe' | 'noResponse'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'all_time' | 'yearly' | 'monthly'

export function EventsStatsPage() {
  const [attendances, setAttendances] = useState<DiscordRawAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [viewMode, setViewMode] = useState<ViewMode>('all_time')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedGame, setSelectedGame] = useState<string>('All')

  const [sortField, setSortField] = useState<SortField>('going')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    DiscordService.getAttendanceStats()
      .then((data) => {
        setAttendances(data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load stats')
        setLoading(false)
      })
  }, [])

  // Extract available filter options from the raw data
  const { availableYears, availableMonths, availableGames } = useMemo(() => {
    const years = new Set<string>()
    const months = new Set<string>()
    const games = new Set<string>()

    attendances.forEach(a => {
      if (a.dateTime && a.dateTime.length >= 7) {
        years.add(a.dateTime.substring(0, 4))
        months.add(a.dateTime.substring(0, 7))
      }
      if (a.gameType) {
        games.add(a.gameType)
      }
    })

    return { 
      availableYears: Array.from(years).sort((a, b) => b.localeCompare(a)), 
      availableMonths: Array.from(months).sort((a, b) => b.localeCompare(a)),
      availableGames: Array.from(games).sort((a, b) => a.localeCompare(b))
    }
  }, [attendances])

  // Select defaults if they become available and are empty
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) setSelectedYear(availableYears[0])
    if (availableMonths.length > 0 && !selectedMonth) setSelectedMonth(availableMonths[0])
  }, [availableYears, availableMonths, selectedYear, selectedMonth])

  // Compute table data based on selected filters
  const tableData = useMemo(() => {
    // 1. Filter attendances
    const filtered = attendances.filter(a => {
      // Game filter
      if (selectedGame !== 'All' && a.gameType !== selectedGame) return false

      // Time filter
      if (viewMode === 'yearly' && selectedYear) {
        if (!a.dateTime.startsWith(selectedYear)) return false
      } else if (viewMode === 'monthly' && selectedMonth) {
        if (!a.dateTime.startsWith(selectedMonth)) return false
      }
      
      return true
    })

    // 2. Group by user
    const userMap = new Map<string, { username: string, going: number, notGoing: number, maybe: number, noResponse: number }>()
    
    filtered.forEach(a => {
      if (!userMap.has(a.userId)) {
        userMap.set(a.userId, { username: a.username, going: 0, notGoing: 0, maybe: 0, noResponse: 0 })
      }
      const u = userMap.get(a.userId)
      if (u) {
        u.username = a.username 
        if (a.status === 'going') u.going++
        else if (a.status === 'not_going') u.notGoing++
        else if (a.status === 'maybe') u.maybe++
        else if (a.status === 'no_response') u.noResponse++
      }
    })

    // 3. Convert to array and sort
    return Array.from(userMap.entries()).map(([id, data]) => ({
      id,
      ...data,
      total: data.going + data.notGoing + data.maybe + data.noResponse
    }))
    .filter(r => r.total > 0)
    .sort((a, b) => {
      let diff = 0
      if (sortField === 'username') {
        diff = a.username.localeCompare(b.username)
      } else {
        diff = a[sortField] - b[sortField]
      }
      return sortOrder === 'asc' ? diff : -diff
    })

  }, [attendances, viewMode, selectedYear, selectedMonth, selectedGame, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <CalendarDays className="w-8 h-8 animate-pulse mb-4" />
        <p>Loading stats...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="p-8 border-destructive/50 bg-destructive/10 text-destructive text-center">
          {error}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-6">
      <div className="flex items-center gap-4">
        <Link to="/events" className="p-2 rounded-full hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Attendance Stats</h1>
          <p className="text-muted-foreground mt-1">Track Discord event participations over time</p>
        </div>
      </div>

      <Card className="p-6 border-border bg-surface-elevated/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex bg-surface rounded-lg p-1 border border-border">
              {(['all_time', 'yearly', 'monthly'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === mode 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                  }`}
                  onClick={() => setViewMode(mode)}
                >
                  {{ 'all_time': 'All Time', 'yearly': 'Yearly', 'monthly': 'Monthly' }[mode]}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {viewMode === 'yearly' && (
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
              {viewMode === 'monthly' && (
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Game:</span>
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={selectedGame}
              onChange={e => setSelectedGame(e.target.value)}
            >
              <option value="All">All Games</option>
              {availableGames.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
                <th 
                  className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center gap-1">
                    Username
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'username' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('going')}
                >
                  <div className="flex items-center gap-1">
                    Going
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'going' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('notGoing')}
                >
                  <div className="flex items-center gap-1">
                    Not Going
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'notGoing' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('maybe')}
                >
                  <div className="flex items-center gap-1">
                    Maybe
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'maybe' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => handleSort('noResponse')}
                >
                  <div className="flex items-center gap-1">
                    No Response
                    <ArrowUpDown className={`w-3 h-3 ${sortField === 'noResponse' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No data available for this period and game.
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.username}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-success/10 text-success font-mono font-bold text-xs">
                        {row.going}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-destructive/10 text-destructive font-mono font-bold text-xs">
                        {row.notGoing}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                        {row.maybe}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-muted text-muted-foreground font-mono font-bold text-xs">
                        {row.noResponse}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
