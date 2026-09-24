/**
 * MaintenanceCard.tsx (Shared)
 * 
 * Purpose: Standardized UI for managing automated server restarts.
 * 
 * Where to add logic:
 * - Any global maintenance or health-check UI elements shared across games go here.
 */
import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Switch } from '../../../ui/Switch'
import { Input } from '../../../ui/Input'

interface MaintenanceCardProps {
  server: any
  onChange: (updates: any) => void
}

export function MaintenanceCard({ server, onChange }: Readonly<MaintenanceCardProps>) {
  return (
    <Card className="w-full min-w-0 max-w-full border-border/50 bg-surface-elevated/50 overflow-hidden backdrop-blur-sm group">
      <div className="h-1 bg-primary" />
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg group-hover:scale-110 transition-transform shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg">Maintenance Window</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">Automated cycle for optimal instance health.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border/50">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Switch 
              checked={server.restartAutomatically || false} 
              onCheckedChange={(c: boolean) => onChange({ restartAutomatically: c })} 
              className="mt-0.5 sm:mt-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Scheduled Reboot</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">THE SYSTEM WILL AUTOMATICALLY RESTART THE INSTANCE AT THIS SPECIFIC TIME.</p>
            </div>
          </div>
          <div className="relative self-end sm:self-auto shrink-0 w-full sm:w-auto">
            <Input 
              type="time"
              className="w-full sm:w-36 bg-muted/50 border-border h-11 text-center font-bold text-lg"
              value={server.automaticRestartTime || '04:00'} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ automaticRestartTime: e.target.value })}
            />
            <div className="absolute -top-2 left-3 px-1 bg-surface-elevated text-[8px] font-black uppercase text-primary tracking-widest">Target Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
