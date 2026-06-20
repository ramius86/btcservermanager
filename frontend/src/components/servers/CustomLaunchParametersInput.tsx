import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { LaunchParameter } from '../../dtos/ServerDto'

interface CustomLaunchParametersInputProps {
  parameters: LaunchParameter[]
  onChange: (parameters: LaunchParameter[]) => void
}

export function CustomLaunchParametersInput({ parameters = [], onChange }: Readonly<CustomLaunchParametersInputProps>) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const val = inputValue.trim()
    if (!val) return
    
    // Split by spaces to allow pasting multiple parameters at once
    const parts = val.split(/\s+/).filter(p => p.length > 0)
    
    const newParams: LaunchParameter[] = []
    
    parts.forEach(part => {
      let name = part
      let value: string | null = null
      
      // Strip leading dashes
      if (name.startsWith('--')) {
        name = name.substring(2)
      } else if (name.startsWith('-')) {
        name = name.substring(1)
      }
      
      // Split by =
      const eqIdx = name.indexOf('=')
      if (eqIdx !== -1) {
        value = name.substring(eqIdx + 1)
        name = name.substring(0, eqIdx)
      }
      
      if (!name) return

      // Check if we already have it
      const exists = parameters.some(p => p.name === name && p.value === value)
      if (!exists) {
        newParams.push({ name, value })
      }
    })
    
    if (newParams.length > 0) {
      onChange([...parameters, ...newParams])
    }
    setInputValue('')
  }

  const handleRemove = (paramToRemove: LaunchParameter) => {
    onChange(parameters.filter(p => p !== paramToRemove))
  }

  return (
    <div className="space-y-3 border p-4 rounded-md border-border bg-muted/30">
      <div>
        <p className="text-sm font-medium">Custom Launch Parameters</p>
        <p className="text-xs text-muted-foreground">Add custom flags like -mod=@modname or -config=server.cfg</p>
      </div>
      
      <div className="flex gap-2">
        <Input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          placeholder="e.g. -autoInit"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {parameters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted rounded-md min-h-[40px] items-center border border-border">
          {parameters.map((param) => (
            <Badge key={`${param.name}-${param.value || ''}`} variant="outline" className="pl-2 gap-1 bg-muted/50 border-border/50">
              <span className="font-mono">-{param.name}{param.value ? `=${param.value}` : ''}</span>
              <button 
                type="button" 
                onClick={() => handleRemove(param)} 
                className="text-muted-foreground/80 hover:text-red-400 p-0.5 rounded-full hover:bg-red-400/10 ml-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
