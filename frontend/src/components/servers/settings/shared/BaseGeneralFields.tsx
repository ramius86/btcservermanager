/**
 * BaseGeneralFields.tsx (Shared)
 * 
 * Purpose: Common identity fields (Name, Ports, Passwords) used by all game types.
 * 
 * Where to add logic:
 * - Add fields here if they apply to ALL supported games (Arma 3, DayZ, Reforger).
 * - Uses conditional labels based on the game type passed via props.
 */
import { Input } from '../../../ui/Input'

interface BaseGeneralFieldsProps {
  server: any
  onChange: (updates: any) => void
  isArma3: boolean
  isDayZ: boolean
  isReforger: boolean
}

export function BaseGeneralFields({ server, onChange, isArma3, isDayZ, isReforger }: Readonly<BaseGeneralFieldsProps>) {
  let queryPortLabel = 'Steam Query';
  if (isDayZ) queryPortLabel = 'Query Port';
  else if (isReforger) queryPortLabel = 'A2S Port';

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="server-name-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Server Name</label>
        <Input 
          id="server-name-input"
          value={server.name || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ name: e.target.value })}
          placeholder="e.g. BTC Realism Unit - Alpha"
          className="bg-muted/50 border-border focus:border-border/50 h-12 text-lg font-bold"
          required
        />
        <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">THE NAME DISPLAYED IN GLOBAL SERVER BROWSERS.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label htmlFor="server-port-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{isArma3 || isDayZ ? 'Port' : 'Game Port'}</label>
          <Input 
            id="server-port-input"
            type="number"
            value={server.port || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ port: Number(e.target.value) })}
            className="bg-muted/50 border-border h-11"
            required
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">{isArma3 || isDayZ ? 'PRIMARY UDP TRAFFIC ENTRY POINT.' : 'UDP PORT FOR GAME TRAFFIC.'}</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="server-queryport-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{queryPortLabel}</label>
          <Input 
            id="server-queryport-input"
            type="number"
            value={server.queryPort || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ queryPort: Number(e.target.value) })}
            className="bg-muted/50 border-border h-11"
            required
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">PORT USED FOR STEAM BROWSER DISCOVERY.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="server-maxplayers-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max Players</label>
          <Input 
            id="server-maxplayers-input"
            type="number"
            value={server.maxPlayers || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ maxPlayers: Number(e.target.value) })}
            className="bg-muted/50 border-border h-11"
            required
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAXIMUM CONCURRENT PERSONNEL SLOTS (1–128, DEFAULT: 64).</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="server-password-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Server Password</label>
          <Input 
            id="server-password-input"
            value={server.password || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ password: e.target.value })}
            placeholder="Leave blank for public"
            className="bg-muted/50 border-border h-11"
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">PASSWORD REQUIRED TO JOIN THE INSTANCE.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="server-adminpassword-input" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Admin Password</label>
          <Input 
            id="server-adminpassword-input"
            value={server.adminPassword || ''} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ adminPassword: e.target.value })}
            placeholder="High-level access"
            className="bg-muted/50 border-border h-11"
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">PASSWORD USED TO LOG IN AS ADMIN IN-GAME. NO SPACES ALLOWED.</p>
        </div>
      </div>
    </div>
  )
}
