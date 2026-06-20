import { useState, useEffect, useCallback } from 'react'
import { Input } from '../ui/Input'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '../ui/Button'
import { ScenarioService } from '../../services/api'
import { useToast } from '../ui/Toast'
import { useWebSocket } from '../../contexts/WebSocketContext'

interface ReforgerScenariosAutocompleteProps {
	serverId?: number
	value: string
	onChange: (value: string) => void
}

export function ReforgerScenariosAutocomplete({ serverId, value, onChange }: Readonly<ReforgerScenariosAutocompleteProps>) {
	const { showToast } = useToast()
  const { subscribe } = useWebSocket()
  const [open, setOpen] = useState(false)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadScenarios = useCallback(() => {
    setLoading(true)
    ScenarioService.getReforger(serverId)
      .then(data => setScenarios(Array.isArray(data) ? data : (data as any).scenarios || []))
      .catch(() => showToast('Failed to load scenarios', 'error'))
      .finally(() => setLoading(false))
  }, [serverId, showToast])

	useEffect(() => {
		loadScenarios()
	}, [loadScenarios])

	useEffect(() => {
		const unsub = subscribe('reforger_scenarios_updated', () => {
			loadScenarios()
		})

		return () => unsub()
	}, [subscribe, loadScenarios])

  const handleSelect = (scenarioValue: string) => {
    onChange(scenarioValue)
    setOpen(false)
  }

  const filteredScenarios = scenarios.filter((s: any) => {
    const term = value.toLowerCase()
    // If the value matches exactly a scenario ID, we might want to show everything or just that one.
    // Standard autocomplete behavior: filter by what's typed.
    if (!term) return true
    return (
      s.name?.toLowerCase().includes(term) ||
      (s.isOfficial ? 'official' : (s.modName || 'modded')).toLowerCase().includes(term) ||
      s.value?.toLowerCase().includes(term)
    )
  })

  const groupedScenarios = filteredScenarios.reduce((acc: Record<string, any[]>, s: any) => {
    const key = s.isOfficial ? 'Official' : (s.modName || 'Modded');
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort groups to put Official first
  const groupKeys = Object.keys(groupedScenarios).sort((a, b) => {
    if (a === 'Official') return -1;
    if (b === 'Official') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-2 relative">
      <label htmlFor="scenario-id-input" className="text-sm font-medium text-slate-300">Scenario ID</label>
      <div className="relative">
        <Input 
          id="scenario-id-input"
          value={value} 
          onChange={e => onChange(e.target.value)} 
          onFocus={() => setOpen(true)}
          placeholder="Search scenarios or paste ID... e.g. {59...}Missions/Eden.conf"
          className="pr-10 bg-surface/50 border-border/50 focus:border-blue-500/50 transition-all"
        />
        <button 
          type="button" 
          onClick={() => setOpen(!open)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 p-1 transition-colors"
        >
          <ChevronsUpDown className="w-4 h-4" />
        </button>
      </div>
      
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-surface-elevated border border-border/50 rounded-md shadow-2xl max-h-80 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent animate-in fade-in zoom-in-95 duration-150">
          {loading && <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Loading scenarios...</div>}

          {groupKeys.length === 0 && !loading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {value ? `No results found for "${value}"` : 'No scenarios found.'}
            </div>
          )}

          {groupKeys.map(groupName => (
            <div key={groupName} className="flex flex-col">
              <div className="px-3 py-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-muted/40 sticky top-0 border-b border-border/30 z-10 backdrop-blur-md">
                {groupName}
              </div>
              <div className="divide-y divide-border/10">
                {groupedScenarios[groupName].map((s: any) => (
                  <button
                    key={s.value}
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 flex items-center justify-between transition-colors group",
                      value === (s.value) ? "bg-blue-500/20" : ""
                    )}
                    onClick={() => handleSelect(s.value)}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium truncate text-slate-200 group-hover:text-white">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate opacity-70 group-hover:opacity-100">{s.value}</div>
                    </div>
                    {value === (s.value) && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="px-3 py-3 text-[10px] text-muted-foreground italic border-t border-border/50 bg-muted/20 mt-auto">
            Type to search in scenarios and mods. Official missions are always listed first.
          </div>
        </div>
      )}
    </div>
  )
}
