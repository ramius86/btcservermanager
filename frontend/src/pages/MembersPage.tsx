import React, { useState, useEffect } from 'react'
import { Users, Lock, Loader2, Save, Search, X } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import { Input } from '../components/ui/Input'
import { DiscordService, SettingsService } from '../services/api'
import type { ClanMember } from '../services/api'

export function MembersPage() {
  const { showToast } = useToast()
  
  const [qualifications, setQualifications] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // true = Read-only mode
  // false = Edit mode
  const [isLocked, setIsLocked] = useState(true)

  // Track edits in state before saving
  const [localMembers, setLocalMembers] = useState<ClanMember[]>([])
  const [originalMembers, setOriginalMembers] = useState<ClanMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [settingsData, membersData] = await Promise.all([
        SettingsService.getSettings(),
        DiscordService.getClanMembers()
      ])
      
      setQualifications(settingsData.qualificationNames || [])
      setLocalMembers(membersData || [])
      setOriginalMembers(structuredClone(membersData || []))
    } catch (err: any) {
      showToast(`Failed to load members data: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const toggleLock = async () => {
    if (isLocked) {
      // Unlock: enter edit mode
      setOriginalMembers(structuredClone(localMembers))
      setIsLocked(false)
    } else {
      // Lock: save changes
      setSaving(true)
      try {
        const payload = []
        for (const m of localMembers) {
          for (const q of m.qualifications) {
            payload.push({ userId: m.id, qualificationName: q })
          }
        }
        await DiscordService.saveClanQualifications({
          userIds: localMembers.map(m => m.id),
          qualifications: payload
        })
        setOriginalMembers(structuredClone(localMembers))
        setIsLocked(true)
        showToast('Qualifications saved successfully', 'success')
      } catch (err: any) {
        showToast(`Failed to save qualifications: ${err.message}`, 'error')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleCancel = () => {
    setLocalMembers(structuredClone(originalMembers))
    setIsLocked(true)
  }

  const toggleQualification = (memberId: string, qualName: string) => {
    if (isLocked) return

    const updateMember = (m: ClanMember) => {
      if (m.id !== memberId) return m

      const hasQual = m.qualifications.includes(qualName)
      const nextQuals = hasQual 
        ? m.qualifications.filter(q => q !== qualName)
        : [...m.qualifications, qualName]
        
      return { ...m, qualifications: nextQuals }
    }

    setLocalMembers(prev => prev.map(updateMember))
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-xs uppercase font-bold tracking-widest">Loading Roster...</p>
        </div>
      )
    }
    
    if (localMembers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">No Members Found</p>
          <p className="text-xs text-muted-foreground max-w-md text-center mt-2">
            Ensure that the correct Discord roles are configured in Settings to populate the clan roster.
          </p>
        </div>
      )
    }

    if (qualifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <MedalIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">No Qualifications Configured</p>
          <p className="text-xs text-muted-foreground max-w-md text-center mt-2">
            Define qualifications in the Settings tab to start assigning them to members.
          </p>
        </div>
      )
    }

    const filtered = localMembers.filter(m => 
      m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">No matching members</p>
          <p className="text-xs text-muted-foreground mt-2">
            Try adjusting your search query.
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-surface/50 border-b border-border sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-muted-foreground whitespace-nowrap min-w-[200px] border-r border-border/50">
                Nickname
              </th>
              {qualifications.map(q => (
                <th 
                  key={q} 
                  className="py-4 px-3 font-bold text-[10px] uppercase tracking-widest text-center min-w-[80px] border-r border-border/50 last:border-0"
                >
                  <div className="rotate-[-45deg] origin-left translate-x-6 translate-y-2 pb-6 inline-block w-4">
                    {q}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map(member => (
              <MemberRow 
                key={member.id} 
                member={member} 
                qualifications={qualifications} 
                isLocked={isLocked} 
                toggleQualification={toggleQualification} 
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  let ButtonIcon = Save
  if (saving) ButtonIcon = Loader2
  else if (isLocked) ButtonIcon = Lock

  const filteredCount = localMembers.filter(m => 
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  ).length

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-xl border border-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                Clan Members
                {!loading && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-bold font-mono">
                    {searchTerm ? `${filteredCount}/${localMembers.length}` : localMembers.length}
                  </Badge>
                )}
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Personnel & Qualifications Roster
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isLocked && (
              <>
                <span className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest mr-2">
                  Edit Mode Active
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            <Button
              variant={isLocked ? "secondary" : "primary"}
              size="sm"
              onClick={toggleLock}
              disabled={loading || saving}
              className={`transition-all ${isLocked ? '' : 'shadow-lg shadow-primary/20'}`}
            >
              <ButtonIcon className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              {isLocked ? 'Unlock Editing' : 'Save & Lock'}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {!loading && localMembers.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search member by nickname..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded-full transition-colors text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm shadow-xl shadow-black/20 overflow-hidden">
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MedalIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" />
      <path d="m13 12 5.88-9.8" />
      <path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 18v-2h-.5" />
    </svg>
  )
}

function MemberRow({ 
  member, 
  qualifications, 
  isLocked, 
  toggleQualification 
}: Readonly<{
  member: ClanMember;
  qualifications: string[];
  isLocked: boolean;
  toggleQualification: (id: string, q: string) => void;
}>) {
  return (
    <tr className={`transition-colors ${isLocked ? 'hover:bg-accent/5' : 'hover:bg-primary/5'}`}>
      <td className="py-3 px-6 font-bold text-foreground border-r border-border/50">
        {member.displayName}
      </td>
      {qualifications.map(q => {
        const hasQual = member.qualifications.includes(q)
        return (
          <td 
            key={q} 
            className={`py-3 px-3 border-r border-border/50 last:border-0 text-center transition-colors ${isLocked ? '' : 'cursor-pointer hover:bg-primary/10'}`}
            onClick={() => toggleQualification(member.id, q)}
          >
            <div className="flex justify-center items-center h-full w-full">
              {hasQual ? (
                <div className="w-4 h-4 rounded bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                  <div className="w-1.5 h-1.5 rounded-sm bg-primary" />
                </div>
              ) : (
                <div className={`w-4 h-4 rounded border ${isLocked ? 'border-transparent' : 'border-border bg-surface/50 hover:border-primary/50'}`} />
              )}
            </div>
          </td>
        )
      })}
    </tr>
  )
}
