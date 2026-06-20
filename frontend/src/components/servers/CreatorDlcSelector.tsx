import { useState, useEffect } from 'react'
import { WorkshopService } from '../../services/api'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '../ui/Button'
import { CreatorDlcDto } from '../../dtos/ServerDto'

interface CreatorDlcSelectorProps {
  selectedDlcs: string[]
  onChange: (dlcIds: string[]) => void
}

export function CreatorDlcSelector({ selectedDlcs, onChange }: Readonly<CreatorDlcSelectorProps>) {
  const [availableDlcs, setAvailableDlcs] = useState<CreatorDlcDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    WorkshopService.getCreatorDlcs()
      .then(data => {
        setAvailableDlcs(data || [])
      })
      .catch(err => console.error("Failed to load CDLCs", err))
      .finally(() => setLoading(false))
  }, [])

  const toggleDlc = (id: string) => {
    if (selectedDlcs.includes(id)) {
      onChange(selectedDlcs.filter(did => did !== id))
    } else {
      onChange([...selectedDlcs, id])
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground py-4 text-center">Loading Creator DLCs...</div>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground/80">Select official Creator DLCs to load on the server.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableDlcs.map(dlc => {
          const isSelected = selectedDlcs.includes(dlc.id)
          return (
            <button
              key={dlc.id}
              type="button"
              onClick={() => toggleDlc(dlc.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                isSelected 
                  ? "border-primary/50 bg-primary/10 text-primary-foreground" 
                  : "border-border bg-muted/50 hover:bg-muted/50 hover:border-border/50"
              )}
            >
              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/60 shrink-0" />
              )}
              <span className="text-sm font-medium">{dlc.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
