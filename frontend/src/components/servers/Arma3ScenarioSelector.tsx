import { useState, useEffect } from 'react'
import { Plus, X, List } from 'lucide-react'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { ScenarioService } from '../../services/api'

interface Arma3ScenarioSelectorProps {
  missions: any[]
  onChange: (missions: any[]) => void
}

export function Arma3ScenarioSelector({ missions, onChange }: Readonly<Arma3ScenarioSelectorProps>) {
  const [availableScenarios, setAvailableScenarios] = useState<any[]>([])

  useEffect(() => {
    ScenarioService.getArma3().then(data => {
      setAvailableScenarios(Array.isArray(data) ? data : (data as any).scenarios || [])
    })
  }, [])

  const handleAdd = () => {
    onChange([...missions, { template: '', difficulty: 'Regular' }])
  }

  const handleRemove = (index: number) => {
    onChange(missions.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...missions]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <List className="w-4 h-4" />
          Mission Rotation
        </label>
        <Button type="button" variant="secondary" size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add Mission
        </Button>
      </div>

      <div className="space-y-3">
        {missions.map((mission, idx) => (
          <div key={`${mission.template || 'empty'}-${idx}`} className="flex gap-3 items-start bg-muted/50 p-3 rounded-lg border border-border">
            <div className="flex-1 space-y-2">
              <label htmlFor={`mission-template-select-${idx}`} className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mission Template (.pbo)</label>
              <Select 
                id={`mission-template-select-${idx}`}
                value={mission.template} 
                onChange={(e) => handleChange(idx, 'template', e.target.value)}
              >
                <option value="" className="bg-surface-elevated">Select a mission...</option>
                {availableScenarios.map((s) => (
                  <option key={s.name} value={s.name.replace('.pbo', '')} className="bg-surface-elevated">
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-1/3 space-y-2">
              <label htmlFor={`difficulty-select-${idx}`} className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Difficulty</label>
              <Select 
                id={`difficulty-select-${idx}`}
                value={mission.difficulty} 
                onChange={(e) => handleChange(idx, 'difficulty', e.target.value)}
              >
                <option value="Recruit" className="bg-surface-elevated">Recruit</option>
                <option value="Regular" className="bg-surface-elevated">Regular</option>
                <option value="Veteran" className="bg-surface-elevated">Veteran</option>
                <option value="Custom" className="bg-surface-elevated">Custom</option>
              </Select>
            </div>
            <button 
              type="button" 
              onClick={() => handleRemove(idx)}
              className="mt-8 text-muted-foreground hover:text-red-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {missions.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground italic border-2 border-dashed border-border rounded-lg">
            No missions in rotation. Add one to start.
          </div>
        )}
      </div>
    </div>
  )
}
