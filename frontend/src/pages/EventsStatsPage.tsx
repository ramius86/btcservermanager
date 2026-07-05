import { useEffect, useState, useMemo } from 'react'
import { Card } from '../components/ui/Card'
import { DiscordService, DiscordRawAttendance, DiscordUser } from '../services/api'
import { ArrowLeft, ArrowUpDown, CalendarDays, UserX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog'
import { Button } from '../components/ui/Button'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

type SortField = 'username' | 'going' | 'notGoing' | 'maybe' | 'noResponse'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'all_time' | 'yearly' | 'monthly'

export function EventsStatsPage() {
  const [attendances, setAttendances] = useState<DiscordRawAttendance[]>([])
  const [users, setUsers] = useState<DiscordUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [viewMode, setViewMode] = useState<ViewMode>('all_time')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedGame, setSelectedGame] = useState<string>('All')

  const [sortField, setSortField] = useState<SortField>('going')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showManagement, setShowManagement] = useState(false)
  const [selectedUserForAction, setSelectedUserForAction] = useState<DiscordUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<DiscordUser | null>(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      DiscordService.getAttendanceStats(),
      DiscordService.getUsers()
    ])
      .then(([statsData, usersData]) => {
        setAttendances(statsData || [])
        setUsers(usersData || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load stats')
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
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

  const globalStats = useMemo(() => {
    let going = 0
    let notGoing = 0
    let maybe = 0
    let noResponse = 0

    tableData.forEach(row => {
      going += row.going
      notGoing += row.notGoing
      maybe += row.maybe
      noResponse += row.noResponse
    })

    const total = going + notGoing + maybe + noResponse

    return { going, notGoing, maybe, noResponse, total }
  }, [tableData])

  const barChartData = useMemo(() => {
    const chartRows = tableData.slice(0, 15)
    return {
      labels: chartRows.map(r => r.username),
      datasets: [
        {
          label: 'Going',
          data: chartRows.map(r => r.going),
          backgroundColor: '#10b981',
        },
        {
          label: 'Maybe',
          data: chartRows.map(r => r.maybe),
          backgroundColor: '#3b82f6',
        },
        {
          label: 'Not Going',
          data: chartRows.map(r => r.notGoing),
          backgroundColor: '#ef4444',
        },
        {
          label: 'No Response',
          data: chartRows.map(r => r.noResponse),
          backgroundColor: '#6b7280',
        }
      ]
    }
  }, [tableData])

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#8c909f',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#8c909f',
          font: {
            family: 'Inter',
            size: 10
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: '#334155',
        },
        ticks: {
          color: '#8c909f',
          font: {
            family: 'Inter',
            size: 10
          },
          precision: 0
        }
      }
    }
  }

  const donutData = useMemo(() => {
    return {
      labels: ['Going', 'Maybe', 'Not Going', 'No Response'],
      datasets: [
        {
          data: [
            globalStats.going,
            globalStats.maybe,
            globalStats.notGoing,
            globalStats.noResponse
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#6b7280'],
          borderWidth: 0,
        }
      ]
    }
  }, [globalStats])

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0
            const percentage = globalStats.total > 0 ? Math.round((value / globalStats.total) * 100) : 0
            return ` ${context.label}: ${value} (${percentage}%)`
          }
        }
      }
    },
    cutout: '70%'
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      await DiscordService.setUserActive(userId, !currentActive)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentActive } : u))
      
      const freshStats = await DiscordService.getAttendanceStats()
      setAttendances(freshStats || [])
    } catch (err: any) {
      alert(err.message || 'Failed to update user status')
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <Link to="/events" className="p-2 rounded-full hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Attendance Stats</h1>
              <p className="text-muted-foreground mt-1">Track Discord event participations over time</p>
            </div>
          </div>
        </div>

        {/* Global Attendance Donut Card */}
        <Card className="p-4 border-border bg-surface-elevated/50 flex items-center gap-6 shadow-sm">
          <div className="w-20 h-20 flex-shrink-0 relative">
            {globalStats.total > 0 ? (
              <Doughnut data={donutData} options={donutOptions} />
            ) : (
              <div className="w-full h-full rounded-full border-2 border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-success flex-shrink-0"></span>
              <span className="text-muted-foreground truncate">Going:</span>
              <span className="font-bold text-foreground">{globalStats.going}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
              <span className="text-muted-foreground truncate">Maybe:</span>
              <span className="font-bold text-foreground">{globalStats.maybe}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></span>
              <span className="text-muted-foreground truncate">No:</span>
              <span className="font-bold text-foreground">{globalStats.notGoing}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#6b7280] flex-shrink-0"></span>
              <span className="text-muted-foreground truncate">Ignored:</span>
              <span className="font-bold text-foreground">{globalStats.noResponse}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-border mt-1 text-[10px] text-muted-foreground">
              Total Responses: <span className="font-bold text-foreground">{globalStats.total}</span>
            </div>
          </div>
        </Card>
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

        {/* Stacked Bar Chart */}
        {tableData.length > 0 && (
          <div className="mb-8 p-4 bg-surface rounded-lg border border-border h-[280px]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top 15 User Attendance Breakdown</h3>
            <div className="h-[220px]">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        )}

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
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No data available for this period and game.
                  </td>
                </tr>
              ) : (
                tableData.map((row, index) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => {
                          const u = users.find(x => x.id === row.id)
                          if (u) setSelectedUserForAction(u)
                        }}
                        className="font-medium text-foreground hover:text-primary hover:underline transition-colors text-left"
                      >
                        {row.username}
                      </button>
                    </td>
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

      {/* Player Management Section */}
      <Card className="p-6 border-border bg-surface-elevated/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Player Management</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Freeze players who have stopped playing to exclude them from "No Response" stats.
              Their past attendance history will be preserved.
            </p>
          </div>
          <button
            onClick={() => setShowManagement(!showManagement)}
            className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-md border border-border bg-surface hover:bg-surface-elevated transition-colors text-foreground"
          >
            {showManagement ? 'Hide Players' : 'Show Players'}
          </button>
        </div>

        {showManagement && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-border mt-6">
            {users.map(user => (
              <div 
                key={user.id} 
                className={`p-4 rounded-lg border flex items-center justify-between transition-colors ${
                  user.isActive 
                    ? 'bg-surface border-border' 
                    : 'bg-surface/30 border-border/50 opacity-60'
                }`}
              >
                <div className="min-w-0 mr-4">
                  <p className="font-semibold text-foreground truncate">{user.username}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-success' : 'bg-[#6b7280]'}`}></span>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      {user.isActive ? 'Active' : 'Frozen'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggleUserActive(user.id, user.isActive)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    user.isActive 
                      ? 'bg-muted text-muted-foreground hover:bg-destructive/15 hover:text-destructive' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {user.isActive ? 'Freeze' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!selectedUserForAction} onOpenChange={(open) => !open && setSelectedUserForAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-muted-foreground" />
              Manage {selectedUserForAction?.username}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose how you want to manage this user in the stats.
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-3 border-muted-foreground/20 hover:bg-muted"
                onClick={() => {
                  if (selectedUserForAction) {
                    handleToggleUserActive(selectedUserForAction.id, selectedUserForAction.isActive)
                    setSelectedUserForAction(null)
                  }
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-foreground">
                    {selectedUserForAction?.isActive ? 'Deactivate (Hide from future)' : 'Reactivate User'}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal mt-1">
                    {selectedUserForAction?.isActive 
                      ? 'Keep past history but stop counting as "No Response" in future events.' 
                      : 'Restore the user as active in future events.'}
                  </span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-3 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setUserToDelete(selectedUserForAction)
                  setSelectedUserForAction(null)
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-destructive">Delete Completely (Purge)</span>
                  <span className="text-xs text-destructive/70 font-normal mt-1">
                    Delete all traces and history of this user. This action is irreversible.
                  </span>
                </div>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedUserForAction(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null)
        }}
        title="Delete user completely?"
        description={`You are about to permanently delete ${userToDelete?.username}. All historical stats for this user will be deleted (Hard Delete). Confirm?`}
        confirmLabel="Delete (Purge)"
        variant="danger"
        onConfirm={async () => {
          if (!userToDelete) return
          try {
            await DiscordService.deleteUser(userToDelete.id)
            loadData()
          } catch (err: any) {
            setError(err.message || 'Failed to delete user')
          }
          setUserToDelete(null)
        }}
      />
    </div>
  )
}

