/**
 * ArrayField.tsx (Shared)
 * 
 * Purpose: Reusable UI component for managing lists of strings (e.g. MOTD, Whitelists).
 */
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '../../../ui/Input'
import { Button } from '../../../ui/Button'

interface ArrayFieldProps {
  values: string[]
  onChange: (newValues: string[]) => void
  label: string
  placeholder: string
  hint?: string
}

export function ArrayField({ values, onChange, label, placeholder, hint }: Readonly<ArrayFieldProps>) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    onChange([...values, input.trim()])
    setInput('')
  }

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{label}</label>
      <div className="flex gap-3">
        <Input 
          value={input} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
          placeholder={placeholder}
          className="bg-muted/50 border-border h-11"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
        />
        <Button 
          type="button" 
          variant="secondary" 
          size="icon" 
          onClick={handleAdd}
          className="h-11 w-11 bg-surface-elevated border border-border hover:bg-surface-elevated/50 rounded-xl"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {hint && <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">{hint}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {values.map((item, idx) => (
          <div key={`${item}-${idx}`} className="flex items-center gap-2 bg-blue-600/10 border border-border px-3 py-1.5 rounded-lg group animate-in zoom-in-95 duration-200">
            <span className="text-xs font-bold text-blue-400">{item}</span>
            <button 
              type="button" 
              onClick={() => handleRemove(idx)} 
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <div className="text-[10px] text-muted-foreground/50 italic ml-1 py-1">No entries defined.</div>
        )}
      </div>
    </div>
  )
}
