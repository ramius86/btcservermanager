/**
 * Arma3SettingsForm.tsx
 * 
 * Purpose: Game-specific settings for Arma 3.
 * Structure: 6 Tabs (General, Gameplay, Security, Network, Difficulty, Mods).
 * 
 * Where to add logic:
 * - New Arma 3 specific settings should be added within the appropriate TabContent below.
 * - Global settings shared with other games should be moved to ../shared/ if applicable.
 */
import { useState } from 'react'
import { ServerCog, Gamepad2, ShieldCheck, Activity, Cpu, Package, ChevronDown, ChevronUp, FileText, Zap, ShieldAlert, Clock, Lock, AlertTriangle, List } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { Switch } from '../../../ui/Switch'
import { Select } from '../../../ui/Select'
import { ArrayField } from '../shared/ArrayField'
import { BaseGeneralFields } from '../shared/BaseGeneralFields'
import { MaintenanceCard } from '../shared/MaintenanceCard'
import { ConfigViewerTab } from '../shared/ConfigViewerTab'
import { LaunchParameter } from "../../../../dtos/ServerDto"
import { CustomLaunchParametersInput } from '../../CustomLaunchParametersInput'
import { Arma3ScenarioSelector } from '../../Arma3ScenarioSelector'
import { CreatorDlcSelector } from '../../CreatorDlcSelector'
import { ModSelector } from '../../ModSelector'
import { CBATab } from './CBATab'

interface Arma3SettingsFormProps {
  server: any
  setServer: (server: any) => void
  isInstalled?: boolean
}

export function Arma3SettingsForm({ server, setServer, isInstalled = true }: Readonly<Arma3SettingsFormProps>) {
  const [activeTab, setActiveTab] = useState('general')
  const [cdlcExpanded, setCdlcExpanded] = useState(false)
  const [isWhitelistMode, setIsWhitelistMode] = useState(server.debugConsoleAdmins?.length > 0)

  const updateServer = (updates: any) => {
    setServer((prev: any) => ({ ...prev, ...updates }))
  }

  const updateDifficulty = (updates: any) => {
    setServer((prev: any) => ({
      ...prev,
      difficultySettings: { ...prev.difficultySettings, ...updates }
    }))
  }

  const updateNetwork = (updates: any) => {
    setServer((prev: any) => ({
      ...prev,
      networkSettings: { ...prev.networkSettings, ...updates }
    }))
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-surface-elevated/50 p-1 border border-border rounded-lg w-fit justify-start overflow-x-auto gap-1 h-auto no-scrollbar">
        {[
          { value: 'general', label: 'General', icon: ServerCog },
          { value: 'mods', label: 'Mods', icon: Package },
          { value: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
          { value: 'security', label: 'Security', icon: ShieldCheck },
          { value: 'network', label: 'Network', icon: Activity },
          { value: 'difficulty', label: 'Difficulty', icon: Cpu },
          { value: 'performance', label: 'Performance', icon: Zap },
          { value: 'cba', label: 'CBA', icon: List },
          ...(server.id && isInstalled ? [{ value: 'configs', label: 'Configs', icon: FileText }] : []),
        ].map(tab => (
          <TabsTrigger 
            key={tab.value}
            value={tab.value} 
            className="rounded-md px-4 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* GENERAL TAB */}
      <TabsContent value="general" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <ServerCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">General Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Essential identification and connectivity settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <BaseGeneralFields 
              server={server} 
              onChange={updateServer} 
              isArma3={true} 
              isDayZ={false} 
              isReforger={false} 
            />
            <div className="pt-8 border-t border-border/50">
              <CustomLaunchParametersInput 
                parameters={server.customLaunchParameters || []}
                onChange={(params: LaunchParameter[]) => updateServer({ customLaunchParameters: params })}
              />
            </div>
          </CardContent>
        </Card>
        <MaintenanceCard server={server} onChange={updateServer} />
      </TabsContent>

      {/* GAMEPLAY TAB */}
      <TabsContent value="gameplay" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Mission Rotation</CardTitle>
                <CardDescription className="text-muted-foreground">Mission cycle, difficulty, and persistence settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <Arma3ScenarioSelector 
              missions={server.missions || []}
              onChange={(m) => updateServer({ missions: m })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="field-1" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Forced Difficulty</label>
                <Select id="field-1" 
                  value={server.forcedDifficulty ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateServer({ forcedDifficulty: e.target.value === '' ? null : e.target.value })}
                >
                  <option value="" className="bg-surface-elevated">NOT FORCED (Mission Default)</option>
                  <option value="recruit" className="bg-surface-elevated">RECRUIT</option>
                  <option value="regular" className="bg-surface-elevated">REGULAR</option>
                  <option value="veteran" className="bg-surface-elevated">VETERAN</option>
                  <option value="custom" className="bg-surface-elevated">CUSTOM (use Difficulty tab)</option>
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">FORCES ALL MISSIONS TO USE THIS DIFFICULTY PRESET.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-2" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Missions To Restart</label>
                <Input id="field-2" 
                  type="number" min="0"
                  value={server.missionsToServerRestart ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ missionsToServerRestart: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 0 (Disabled)"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">AUTO-RESTART AFTER N MISSIONS (0 = DISABLED).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'persistent', label: 'Persistent', hint: 'SERVER STATE SURVIVES RESTART.' },
                { id: 'autoSelectMission', label: 'Auto-Select Mission', hint: 'AUTO-START NEXT MISSION IN ROTATION.' },
                { id: 'randomMissionOrder', label: 'Random Order', hint: 'RANDOMIZE MISSION ROTATION CYCLE.' },
                { id: 'drawingInMap', label: 'Map Drawing', hint: 'ENABLE/DISABLE DRAWING ON THE TACTICAL MAP.' },
                { id: 'skipLobby', label: 'Skip Lobby', hint: 'SKIP ROLE SELECTION AND ENTER DIRECTLY. (DEFAULT: OFF)' },
                { id: 'allowProfileGlasses', label: 'Allow Profile Glasses', hint: 'ALLOW PROFILE OCULAR ACCESSORIES. (DEFAULT: ON)' },
                { id: 'statisticsEnabled', label: 'Telemetry/Stats', hint: 'TRANSMIT ANONYMOUS TELEMETRY TO BOHEMIA. (DEFAULT: ON)' },
              ].map(field => (
                <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">{field.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{field.hint}</p>
                  </div>
                  <Switch 
                    checked={server[field.id] ?? (field.id === 'allowProfileGlasses' || field.id === 'statisticsEnabled' || field.id === 'drawingInMap')} 
                    onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                    className=""
                  />
                </div>
              ))}
              
              <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                <label htmlFor="field-3" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Forced AFM (RotorLib)</label>
                <Select id="field-3" 
                  value={server.forceRotorLibSimulation} 
                  onChange={(e) => updateServer({ forceRotorLibSimulation: Number(e.target.value) })}
                >
                  <option value={0} className="bg-surface-elevated">Default (Player Choice)</option>
                  <option value={1} className="bg-surface-elevated">Forced ON</option>
                  <option value={2} className="bg-surface-elevated">Forced OFF</option>
                </Select>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">FORCE ADVANCED FLIGHT MODEL SIMULATION.</p>
              </div>

              <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                <label htmlFor="field-4" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Volumetric Haze</label>
                <Select id="field-4" 
                  value={server.overrideHazeQuality ?? -1} 
                  onChange={(e) => updateServer({ overrideHazeQuality: Number(e.target.value) })}
                >
                  <option value={-1} className="bg-surface-elevated">Default (Not Forced)</option>
                  <option value={0} className="bg-surface-elevated">Very Low</option>
                  <option value={1} className="bg-surface-elevated">Low</option>
                  <option value={2} className="bg-surface-elevated">Standard</option>
                </Select>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">FORCES VOLUMETRIC HAZE QUALITY FOR CLIENTS. (DEFAULT: NOT FORCED)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Voice & Communication</CardTitle>
                <CardDescription className="text-muted-foreground">Voice-over-Net and MOTD settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">VON Enabled</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ENABLES BUILT-IN VOICE COMMUNICATION.</p>
                </div>
                <Switch checked={server.vonEnabled} onCheckedChange={(c: boolean) => updateServer({ vonEnabled: c })} className="" />
              </div>
              <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                <label htmlFor="field-5" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">VoN Codec Type</label>
                <Select id="field-5" 
                  value={server.vonCodec ?? ''} 
                  onChange={(e) => updateServer({ vonCodec: e.target.value === '' ? null : Number(e.target.value) })}
                >
                  <option value="" className="bg-surface-elevated">Not Set (Engine Default)</option>
                  <option value={0} className="bg-surface-elevated">0 - Speex (Legacy)</option>
                  <option value={1} className="bg-surface-elevated">1 - Opus (Modern - Recommended)</option>
                </Select>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">VOICE TRANSMISSION PROTOCOL.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-6" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">VoN Codec Quality</label>
                <Input id="field-6" 
                  type="number" min="1" max="30"
                  value={server.vonCodecQuality ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ vonCodecQuality: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 3"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">OPUS QUALITY (1-10: 8kHz, 11-20: 16kHz, 21-30: 32kHz).</p>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50 space-y-8">
              <div className="space-y-2 w-full md:w-1/3">
                <label htmlFor="field-7" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">MOTD Interval (seconds)</label>
                <div className="relative">
                  <Input id="field-7" 
                    type="text"
                    value={server.motdInterval?.toString() ?? ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value.replace(',', '.');
                      if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                        updateServer({ motdInterval: val });
                      }
                    }}
                    placeholder="Engine default: 5"
                    className="bg-muted/50 border-border pr-12 h-11"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">SEC</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">DELAY BETWEEN AUTOMATED CHAT MESSAGES.</p>
              </div>
              <ArrayField 
                values={server.motd || []} 
                onChange={(vals) => updateServer({ motd: vals })}
                label="MOTD Lines" 
                placeholder="Enter operational directive..." 
                hint="MESSAGES DISPLAYED TO ALL CONNECTED USERS PERIODICALLY."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Voting & Timeouts</CardTitle>
                <CardDescription className="text-muted-foreground">Player voting thresholds and step timeouts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="field-8" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Vote Threshold</label>
                <Input id="field-8" 
                  type="text"
                  value={server.voteThreshold?.toString() ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(',', '.');
                    if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                      updateServer({ voteThreshold: val });
                    }
                  }}
                  placeholder="Engine default: 0.5"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">FRACTION OF VOTES NEEDED TO APPROVE (0.0 - 1.0). LEAVE BLANK FOR ENGINE DEFAULT.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-9" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Vote Mission Players</label>
                <Input id="field-9" 
                  type="number" min="1"
                  value={server.voteMissionPlayers ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ voteMissionPlayers: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 1"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MIN PLAYERS BEFORE MISSION SELECTION SCREEN APPEARS. LEAVE BLANK FOR ENGINE DEFAULT.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-10" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Lobby Auto-Start Timeout</label>
                <Input id="field-10" 
                  type="number" min="0"
                  value={server.lobbyTimeout ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ lobbyTimeout: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 0 (Disabled)"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT IN LOBBY BEFORE AUTO-STARTING THE ACTIVE MISSION (0 = DISABLED).</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-11" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Lobby Idle Timeout</label>
                <Input id="field-11" 
                  type="number" min="0"
                  value={server.lobbyIdleTimeout ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ lobbyIdleTimeout: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 0 (Disabled)"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT IN LOBBY WITHOUT ADMINS BEFORE AUTO-STARTING ACTIVE MISSION.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-12" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Voting Timeout</label>
                <Input id="field-12" 
                  type="number" min="0"
                  value={server.votingTimeOut ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ votingTimeOut: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 60"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT FOR PLAYER VOTES TO COMPLETE. (DEFAULT: 60S)</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-13" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Role Timeout</label>
                <Input id="field-13" 
                  type="number" min="0"
                  value={server.roleTimeOut ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ roleTimeOut: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 90"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT FOR PLAYERS TO SELECT ROLES. (DEFAULT: 90S)</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-14" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Briefing Timeout</label>
                <Input id="field-14" 
                  type="number" min="0"
                  value={server.briefingTimeOut ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ briefingTimeOut: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 60"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT IN THE BRIEFING SCREEN BEFORE GAMEPLAY STARTS. (DEFAULT: 60S)</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-15" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Debriefing Timeout</label>
                <Input id="field-15" 
                  type="number" min="0"
                  value={server.debriefingTimeOut ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ debriefingTimeOut: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 45"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT IN THE DEBRIEFING SCREEN AFTER MISSION COMPLETE. (DEFAULT: 45S)</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-16" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Arma Units Timeout</label>
                <Input id="field-16" 
                  type="number" min="0"
                  value={server.armaUnitsTimeout ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ armaUnitsTimeout: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 30"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SECONDS TO WAIT FOR CONNECTION DATA RESPONSE FROM THE ARMA UNITS SYSTEM. (DEFAULT: 30S)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SECURITY TAB */}
      <TabsContent value="security" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Security & Administration</CardTitle>
                <CardDescription className="text-muted-foreground">Integrity verification and administrative authority.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Core Engine Security */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">BattlEye Enabled</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">REQUIRED FOR OFFICIAL DISCOVERY.</p>
                  </div>
                  <Switch checked={server.battlEye} onCheckedChange={(c: boolean) => updateServer({ battlEye: c })} />
                </div>
                
                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1 mb-2">
                    <p className="text-sm font-bold text-foreground">Verify Signatures</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">PREVENTS LOAD OF MODIFIED LOCAL PBOs.</p>
                  </div>
                  <Select 
                    value={server.verifySignatures ?? 2} 
                    onChange={(e) => updateServer({ verifySignatures: Number(e.target.value) })}
                  >
                    <option value={0} className="bg-surface-elevated">Disabled (0)</option>
                    <option value={1} className="bg-surface-elevated">V1 & V2 Signatures (1)</option>
                    <option value={2} className="bg-surface-elevated">V2 Signatures Only (2 - Recommended)</option>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Kick Duplicate IDs</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">KICKS A PLAYER IF A NEW CONNECTION ATTEMPTS TO USE THE SAME ID.</p>
                  </div>
                  <Switch checked={server.kickDuplicate} onCheckedChange={(c: boolean) => updateServer({ kickDuplicate: c })} />
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <label htmlFor="field-17" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Allowed File Patching</label>
                  <Select id="field-17" 
                    value={server.clientFilePatching ?? 1}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateServer({ clientFilePatching: Number(e.target.value) })}
                  >
                    <option value={0} className="bg-surface-elevated">DISABLED — No clients</option>
                    <option value={1} className="bg-surface-elevated">HC ONLY — Headless Clients only</option>
                    <option value={2} className="bg-surface-elevated">ALL CLIENTS — Everyone</option>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">CONTROLS WHO IS ALLOWED TO LOAD PATCHED FILES VIA -filePatching.</p>
                </div>

                <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <label htmlFor="field-18" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Server File Patching</label>
                    <Switch 
                      id="field-18"
                      checked={server.serverFilePatching || false} 
                      onCheckedChange={(c: boolean) => updateServer({ serverFilePatching: c })} 
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">ENABLES THE -filePatching PARAMETER ON THE SERVER STARTUP.</p>
                    <p className="text-[10px] text-amber-500/80 font-bold ml-1 uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      REQUIRED FOR CBA SETTINGS TO WORK.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Admin Tools & Advanced Logs */}
              <div className="space-y-6">
                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <label htmlFor="field-18b" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Debug Console</label>
                  <Select id="field-18b" 
                    value={isWhitelistMode ? 3 : (server.enableDebugConsole ?? 0)}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const val = Number(e.target.value);
                      if (val === 3) {
                        setIsWhitelistMode(true);
                        if (!server.debugConsoleAdmins) {
                          updateServer({ debugConsoleAdmins: [] });
                        }
                      } else {
                        setIsWhitelistMode(false);
                        updateServer({ enableDebugConsole: val, debugConsoleAdmins: [] });
                      }
                    }}
                  >
                    <option value={0} className="bg-surface-elevated">0 — Disabled (Editor only)</option>
                    <option value={1} className="bg-surface-elevated">1 — Admins & Host</option>
                    <option value={2} className="bg-surface-elevated">2 — Everyone</option>
                    <option value={3} className="bg-surface-elevated">Whitelist — Specific SteamIDs</option>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">CONTROL ACCESS TO THE IN-GAME DEBUG CONSOLE.</p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <label htmlFor="field-19" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Zeus Script Level</label>
                  <Select id="field-19" 
                    value={server.zeusCompositionScriptLevel ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateServer({ zeusCompositionScriptLevel: e.target.value === '' ? null : Number(e.target.value) })}
                  >
                    <option value="" className="bg-surface-elevated">Engine Default (All)</option>
                    <option value={0} className="bg-surface-elevated">0 — Disabled</option>
                    <option value={1} className="bg-surface-elevated">1 — Simple (No code)</option>
                    <option value={2} className="bg-surface-elevated">2 — All (Advanced)</option>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">RESTRICT SCRIPT LEVELS FOR ZEUS COMPOSITIONS.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Skip Description Parsing</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">SPEEDS UP MISSION LOADING BY IGNORING DESCRIPTION.EXT.</p>
                  </div>
                  <Switch checked={server.skipDescriptionParsing} onCheckedChange={(c: boolean) => updateServer({ skipDescriptionParsing: c })} />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Log Object Not Found</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">WRITES A WARNING TO THE LOG WHEN AN OBJECT IS MISSING.</p>
                  </div>
                  <Switch checked={server.logObjectNotFound} onCheckedChange={(c: boolean) => updateServer({ logObjectNotFound: c })} />
                </div>

                 <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <label htmlFor="field-20" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Idle FPS Limit</label>
                  <Input id="field-20" 
                    type="number" min="1"
                    value={server.idleFPSLimit ?? ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ idleFPSLimit: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="Engine default: 30"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">LIMITS SERVER FPS WHEN EMPTY TO REDUCE CPU LOAD.</p>
                </div>

                <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                  <label htmlFor="field-21" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Required Build</label>
                  <Input id="field-21" 
                    type="number" min="0"
                    value={server.requiredBuild ?? ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ requiredBuild: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="e.g. 142116"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">REJECTS CLIENTS RUNNING OLDER BUILD VERSIONS.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">Anti-Flood Protection</CardTitle>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="field-22" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Cycle Time</label>
                    <Input id="field-22" 
                      type="number" step="0.1"
                      value={server.antiFloodCycleTime ?? ''} 
                      onChange={(e) => updateServer({ antiFloodCycleTime: e.target.value === '' ? null : Number(e.target.value) })}
                      placeholder="e.g. 0.5"
                      className="bg-muted/50 border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">TIME WINDOW FOR REQUEST EVALUATION.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="field-23" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Cycle Limit</label>
                    <Input id="field-23" 
                      type="number"
                      value={server.antiFloodCycleLimit ?? ''} 
                      onChange={(e) => updateServer({ antiFloodCycleLimit: e.target.value === '' ? null : Number(e.target.value) })}
                      placeholder="e.g. 400"
                      className="bg-muted/50 border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">SOFT REQUEST THRESHOLD PER CYCLE.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="field-24" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Hard Limit</label>
                    <Input id="field-24" 
                      type="number"
                      value={server.antiFloodCycleHardLimit ?? ''} 
                      onChange={(e) => updateServer({ antiFloodCycleHardLimit: e.target.value === '' ? null : Number(e.target.value) })}
                      placeholder="e.g. 4000"
                      className="bg-muted/50 border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">HARD THRESHOLD FOR IMMEDIATE REJECTION.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="field-25" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Enable Kick</label>
                    <Select id="field-25" 
                      value={server.antiFloodEnableKick ?? ''}
                      onChange={(e) => updateServer({ antiFloodEnableKick: e.target.value === '' ? null : Number(e.target.value) })}
                    >
                      <option value="" className="bg-surface-elevated">Default (0)</option>
                      <option value={0} className="bg-surface-elevated">No (Drop only)</option>
                      <option value={1} className="bg-surface-elevated">Yes (Kick player)</option>
                    </Select>
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">KICK CLIENTS EXCEEDING LIMITS.</p>
                  </div>
               </div>
            </div>

            {isWhitelistMode && (
               <div className="mt-8 pt-8 border-t border-border/50">
                  <ArrayField 
                    values={server.debugConsoleAdmins || []} 
                    onChange={(vals) => updateServer({ debugConsoleAdmins: vals })}
                    label="Debug Console Whitelist (Steam64 IDs)" 
                    placeholder="e.g. 76561198..." 
                    hint="ONLY THESE USERS (PLUS LOGGED-IN ADMINS) WILL HAVE ACCESS TO THE DEBUG CONSOLE."
                  />
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Command Authority</CardTitle>
                <CardDescription className="text-muted-foreground">RCON and administrative identification.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <div className="space-y-8">
              <div className="space-y-2 w-full md:w-1/2">
                <label htmlFor="field-26" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">SQF serverCommand Password</label>
                <Input id="field-26" 
                  value={server.serverCommandPassword || ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ serverCommandPassword: e.target.value })}
                  placeholder="In-game script authority"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">PASSWORD REQUIRED TO AUTHORIZE IN-GAME SQF SCRIPTS TO EXECUTE ADMINISTRATIVE COMMANDS (serverCommand).</p>
              </div>
              
              <ArrayField 
                values={server.admins || []} 
                onChange={(vals) => updateServer({ admins: vals })}
                label="Logged In Admins (Steam64 IDs)" 
                placeholder="e.g. 76561198..." 
                hint="STEAM64 IDs OF USERS WHO ARE AUTOMATICALLY GIVEN ADMIN PRIVILEGES ON LOG IN (#login IS NOT REQUIRED)."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <ArrayField 
                  values={server.headlessClients || []} 
                  onChange={(vals) => updateServer({ headlessClients: vals })}
                  label="Headless Clients (IPs)" 
                  placeholder="e.g. 192.168.1.50" 
                  hint="IP ADDRESSES ALLOWED TO CONNECT AS HEADLESS CLIENTS WITH EXPEDITED DATA SYNC."
                />
                <ArrayField 
                  values={server.localClient || []} 
                  onChange={(vals) => updateServer({ localClient: vals })}
                  label="Local Clients (IPs)" 
                  placeholder="e.g. 127.0.0.1" 
                  hint="IP ADDRESSES OF LOCAL CLIENTS EXEMPT FROM BANDWIDTH LIMITS (RECOMMENDED FOR LAN AND HEADLESS CLIENTS)."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-border/50">
              <ArrayField 
                values={server.allowedLoadFileExtensions || []} 
                onChange={(vals) => updateServer({ allowedLoadFileExtensions: vals })}
                label="Whitelist: Load" 
                placeholder=".hpp" 
                hint="FILE EXTENSIONS ALLOWED TO BE READ BY MISSIONS VIA THE SQF loadFile COMMAND (PREVENTS SCRIPT EXPLOITS)."
              />
              <ArrayField 
                values={server.allowedPreprocessFileExtensions || []} 
                onChange={(vals) => updateServer({ allowedPreprocessFileExtensions: vals })}
                label="Whitelist: Preprocess" 
                placeholder=".sqf" 
                hint="FILE EXTENSIONS ALLOWED TO BE COMPILED VIA SQF preprocessFile OR preprocessFileLineNumbers."
              />
              <ArrayField 
                values={server.allowedHTMLLoadExtensions || []} 
                onChange={(vals) => updateServer({ allowedHTMLLoadExtensions: vals })}
                label="Whitelist: HTML" 
                placeholder=".html" 
                hint="FILE EXTENSIONS ALLOWED TO BE LOADED WITHIN IN-GAME HTML DIALOGS AND UI CONTEXS."
              />
              <ArrayField 
                values={server.allowedHTMLLoadURIs || []} 
                onChange={(vals) => updateServer({ allowedHTMLLoadURIs: vals })} 
                label="Whitelist: HTML URIs" 
                placeholder="http://example.com" 
                hint="EXTERNAL DOMAINS ALLOWED TO BE ACCESSED VIA SQF htmlLoad (E.G., DYNAMIC IN-GAME WEB SHEETS OR PLAYER STATISTICS)."
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* NETWORK TAB */}
      <TabsContent value="network" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid grid-cols-1 gap-8">
          <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
            <div className="h-1 bg-primary" />
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Bandwidth Tuning</CardTitle>
                  <CardDescription className="text-muted-foreground">Fine-grained network synchronization parameters.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { id: 'maxMessagesSend', label: 'Max Messages Send', def: '128 (Legacy) / 384 (Modern)', hint: 'MAXIMUM SYNC MESSAGES SENT TO EACH CLIENT PER SIMULATION FRAME. HIGHER VALUES IMPROVE POSITION SYNC BUT INCREASE CPU LOAD.' },
                  { id: 'maxBandwidth', label: 'Max Bandwidth', def: '2000000 (2 Mbps) / 25000000 (25 Mbps) Rec.', hint: 'MAXIMUM DATA BANDWIDTH (IN BYTES/SEC) THE SERVER IS ALLOWED TO TRANSMIT TO A CONNECTED CLIENT.' },
                  { id: 'minBandwidth', label: 'Min Bandwidth', def: '0 / 800000 (800 Kbps) Rec.', hint: 'MINIMUM BANDWIDTH (IN BYTES/SEC) GUARANTEED TO EACH CLIENT (PREVENTS DATA DROPS DURING INTENSE FIREFIGHTS).' },
                  { id: 'maxSizeGuaranteed', label: 'Max Size Guaranteed', def: '512', hint: 'MAXIMUM PACKET SIZE (IN BYTES) FOR RELIABLE/GUARANTEED TRANSMISSIONS. MUST BE LOWER THAN MAX PACKET SIZE.' },
                  { id: 'maxSizeNonguaranteed', label: 'Max Size Nonguaranteed', def: '256', hint: 'MAXIMUM PACKET SIZE (IN BYTES) FOR UNRELIABLE/NON-GUARANTEED TRANSMISSIONS (E.G. FREQUENT POSITION UPDATES).' },
                  { id: 'maxPacketSize', label: 'Max Packet Size', def: '1400', hint: 'MAXIMUM SIZE (IN BYTES) OF AN IP PACKET BEFORE MTU FRAGMENTATION OCCURS (DEFAULT: 1400).' },
                  { id: 'maxCustomFileSize', label: 'Max Custom File Size', def: '100000 (100 KB)', hint: 'MAXIMUM SIZE (IN BYTES) ALLOWED FOR DYNAMIC USER-CUSTOM FILE UPLOADS (E.G., SQUAD LOGOS OR IN-GAME CLAN AVATARS).' },
                  { id: 'steamProtocolMaxDataSize', label: 'Steam Protocol Max Data Size', def: '1024 / 2048 Rec.', hint: 'MAXIMUM BYTES TRANSMITTED VIA THE STEAM QUERY PROTOCOL FOR SERVER LIST INFORMATION AND DISCOVERY.' },
                ].map(field => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={`field-${field.id}`} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{field.label}</label>
                    <Input id={`field-${field.id}`} 
                      type="number"
                      value={server.networkSettings?.[field.id] ?? ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNetwork({ [field.id]: e.target.value === '' ? null : Number(e.target.value) })}
                      placeholder={`e.g. ${field.def}`}
                      className="bg-muted/50 border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">{field.hint}</p>
                  </div>
                ))}
                <div className="space-y-2">
                  <label htmlFor="field-28" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Min Error To Send</label>
                  <Input id="field-28" 
                    type="text"
                    value={server.networkSettings?.minErrorToSend?.toString() ?? ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value.replace(',', '.');
                      if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                        updateNetwork({ minErrorToSend: val });
                      }
                    }}
                    placeholder="e.g. 0.001"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MINIMUM POSITION DISCREPANCY (IN METERS) REQUIRED TO TRIGGER A SYNC UPDATE TO FARAWAY PLAYERS.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="field-29" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Min Error To Send Near</label>
                  <Input id="field-29" 
                    type="text"
                    value={server.networkSettings?.minErrorToSendNear?.toString() ?? ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value.replace(',', '.');
                      if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                        updateNetwork({ minErrorToSendNear: val });
                      }
                    }}
                    placeholder="e.g. 0.01"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MINIMUM POSITION DISCREPANCY (IN METERS) REQUIRED TO TRIGGER A SYNC UPDATE TO NEARBY PLAYERS. SHRINKS DESYNC.</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 mt-2">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Enable Player Diag</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ENABLES AUTOMATIC LOGGING OF PLAYER NETWORK DIAGNOSTICS EVERY 60 SECONDS TO THE SERVER LOG.</p>
                  </div>
                  <Switch checked={server.enablePlayerDiag} onCheckedChange={(c: boolean) => updateServer({ enablePlayerDiag: c })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
            <div className="h-1 bg-primary" />
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">QoS & Kick Enforcement</CardTitle>
                  <CardDescription className="text-muted-foreground">Official server.cfg timeout and kick parameters.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { id: 'disconnectTimeout', label: 'Disconnect Timeout', placeholder: 'e.g. 15s (Engine default)', hint: 'MAX SEC BEFORE DROP.' },
                  { id: 'maxPing', label: 'Max Ping', placeholder: 'e.g. 500ms (Disabled by default)', hint: 'MAX MS BEFORE KICK.' },
                  { id: 'maxDesync', label: 'Max Desync', placeholder: 'e.g. 100 (Disabled by default)', hint: 'MAX PACKET DRIFT.' },
                  { id: 'maxPacketLoss', label: 'Max Packet Loss', placeholder: 'e.g. 10% (Disabled by default)', hint: 'MAX % LOSS BEFORE KICK.' },
                ].map(field => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={`field-${field.id}`} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{field.label}</label>
                    <Input id={`field-${field.id}`} 
                      type="number"
                      value={server[field.id] ?? ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServer({ [field.id]: e.target.value === '' ? null : Number(e.target.value) })}
                      placeholder={field.placeholder}
                      className="bg-muted/50 border-border h-11"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">{field.hint}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-6 ml-1">Kick Enforcement Toggles</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'kickOnSlowNetworkPing', label: 'Kick on Ping', hint: 'ENFORCE MAX PING.' },
                    { id: 'kickOnSlowNetworkPacketLoss', label: 'Kick on Loss', hint: 'ENFORCE PACKET LOSS.' },
                    { id: 'kickOnSlowNetworkDesync', label: 'Kick on Desync', hint: 'ENFORCE MAX DESYNC.' },
                    { id: 'kickOnSlowNetworkDisconnect', label: 'Kick on Timeout', hint: 'ENFORCE TIMEOUT.' },
                  ].map(field => (
                    <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">{field.label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{field.hint}</p>
                      </div>
                      <Switch 
                        checked={server[field.id]} 
                        onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                        className=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <Arma3DifficultyTab server={server} updateDifficulty={updateDifficulty} />

      {/* PERFORMANCE TAB */}
      <TabsContent value="performance" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Hardware & Simulation</CardTitle>
                <CardDescription className="text-muted-foreground">CPU, Memory and FPS optimization parameters.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label htmlFor="field-35" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Limit FPS (-limitFPS)</label>
                <Input id="field-35" 
                  type="number" min="5" max="1000"
                  value={server.limitFPS ?? ''} 
                  onChange={(e) => updateServer({ limitFPS: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Engine default: 50"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAXIMUM SIMULATED FRAMES PER SECOND.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-36" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max Memory (-maxMem)</label>
                <Input id="field-36" 
                  type="number" min="256"
                  value={server.maxMem ?? ''} 
                  onChange={(e) => updateServer({ maxMem: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="MB (e.g. 2048)"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">HARD RAM ALLOCATION LIMIT IN MB.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-37" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">CPU Count (-cpuCount)</label>
                <Input id="field-37" 
                  type="number" min="1"
                  value={server.cpuCount ?? ''} 
                  onChange={(e) => updateServer({ cpuCount: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="e.g. 4"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">FORCE NUMBER OF LOGICAL CORES TO USE.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-38" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Extra Threads (-exThreads)</label>
                <Select id="field-38" 
                  value={server.exThreads ?? ''} 
                  onChange={(e) => updateServer({ exThreads: e.target.value === '' ? null : Number(e.target.value) })}
                >
                  <option value="" className="bg-surface-elevated">Default (0)</option>
                  <option value={1} className="bg-surface-elevated">1 (File Ops)</option>
                  <option value={3} className="bg-surface-elevated">3 (File + Texture)</option>
                  <option value={5} className="bg-surface-elevated">5 (File + Geometry)</option>
                  <option value={7} className="bg-surface-elevated">7 (All - Recommended)</option>
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">ALLOCATE BACKGROUND THREADS FOR ENGINE SYSTEMS.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Hyper-Threading (-enableHT)</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ENABLES USE OF HYPER-THREADED CORES.</p>
                </div>
                <Switch checked={server.enableHT} onCheckedChange={(c: boolean) => updateServer({ enableHT: c })} />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Mission Pre-cache</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">LOADS MISSION PBO DIRECTLY INTO RAM. (-loadMissionToMemory)</p>
                </div>
                <Switch checked={server.loadMissionToMemory} onCheckedChange={(c: boolean) => updateServer({ loadMissionToMemory: c })} />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">missionHTTPdownload</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">HOSTS MISSION FILES ON HIGH-SPEED HTTP FOR RAPID JOINING.</p>
                </div>
                <Switch checked={server.fastDownloadEnabled} onCheckedChange={(c: boolean) => updateServer({ fastDownloadEnabled: c })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="field-39" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Network Diag Interval</label>
                <div className="relative">
                  <Input id="field-39" 
                    type="number"
                    value={server.networkDiagInterval ?? ''} 
                    onChange={(e) => updateServer({ networkDiagInterval: e.target.value === '' ? null : Number(e.target.value) })}
                    placeholder="e.g. 60"
                    className="bg-muted/50 border-border pr-12 h-11"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">SEC</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">INTERVAL FOR LOGGING NETWORK DIAGNOSTICS. (-networkDiagInterval)</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 self-end h-11 mt-6">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Debug Mode (-debug)</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ENABLES VERBOSE ENGINE DEBUGGING LOGS.</p>
                </div>
                <Switch checked={server.debugMode} onCheckedChange={(c: boolean) => updateServer({ debugMode: c })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* MODS TAB */}
      <TabsContent value="mods" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardContent className="p-6 lg:p-8">
            <ModSelector 
              serverType="ARMA3"
              selectedModIds={server.activeMods || []}
              onChange={(mods: number[]) => updateServer({ activeMods: mods })}
            />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader 
            className="pb-6 cursor-pointer hover:bg-muted/20 transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCdlcExpanded(!cdlcExpanded);
              }
            }}
            onClick={() => setCdlcExpanded(!cdlcExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Creator DLCs</CardTitle>
                  <CardDescription className="text-muted-foreground">Official third-party content modules for Arma 3.</CardDescription>
                </div>
              </div>
              <div className="text-muted-foreground">
                {cdlcExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </CardHeader>
          {cdlcExpanded && (
            <CardContent className="p-6 lg:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
              <CreatorDlcSelector 
                selectedDlcs={server.activeDLCs || []} 
                onChange={(ids) => updateServer({ activeDLCs: ids })}
              />
              <p className="mt-8 text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest text-center border-t border-border/50 pt-6">
                THESE DLCS MUST BE OWNED BY THE CLIENT TO CONNECT TO THE INSTANCE.
              </p>
            </CardContent>
          )}
        </Card>
      </TabsContent>

      {/* CBA TAB */}
      <TabsContent value="cba" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CBATab 
          serverId={server.id}
          selectedPresetId={server.cbaPresetId}
          onPresetChange={(presetId) => updateServer({ cbaPresetId: presetId })}
        />
      </TabsContent>

      {/* CONFIGS PREVIEW TAB */}
      <TabsContent value="configs" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ConfigViewerTab 
          serverId={server.id} 
          serverType="ARMA3" 
        />
      </TabsContent>
    </Tabs>
  )
}


function Arma3DifficultyTab({ server, updateDifficulty }: Readonly<{ server: any, updateDifficulty: (updates: any) => void }>) {
  return (
    <>
      {/* DIFFICULTY TAB */}
      <TabsContent value="difficulty" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Custom Difficulty Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Rules of engagement and AI parameters.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-10 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border/50">
              <div className="space-y-2">
                <label htmlFor="field-31" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Skill AI</label>
                <Input id="field-31" 
                  type="text"
                  value={server.difficultySettings?.skillAI?.toString() ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(',', '.');
                    if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                      updateDifficulty({ skillAI: val });
                    }
                  }}
                  placeholder="Engine default: 0.5"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">AI TACTICAL PROFICIENCY (0.0 - 1.0).</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-32" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Precision AI</label>
                <Input id="field-32" 
                  type="text"
                  value={server.difficultySettings?.precisionAI?.toString() ?? ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value.replace(',', '.');
                    if (val === '' || /^\d*(?:\.\d*)?$/.test(val)) {
                      updateDifficulty({ precisionAI: val });
                    }
                  }}
                  placeholder="Engine default: 0.5"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">AI FIRING ACCURACY (0.0 - 1.0).</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="field-33" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">AI Level Preset</label>
                <Select id="field-33" 
                  value={server.difficultySettings?.aiLevelPreset || 1}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDifficulty({ aiLevelPreset: Number(e.target.value) })}
                >
                  <option value={0} className="bg-surface-elevated">RECRUIT</option>
                  <option value={1} className="bg-surface-elevated">REGULAR</option>
                  <option value={2} className="bg-surface-elevated">VETERAN</option>
                  <option value={3} className="bg-surface-elevated">CUSTOM</option>
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">RAPID DIFFICULTY DEPLOYMENT.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'groupIndicators', label: 'Group Indicators', type: 'hud', hint: 'SHOWS SQUAD MEMBER ICONS.' },
                { id: 'friendlyTags', label: 'Friendly Tags', type: 'hud', hint: 'SHOWS NAMES OVER FRIENDLY NODES.' },
                { id: 'enemyTags', label: 'Enemy Tags', type: 'hud', hint: 'SHOWS NAMES OVER ENEMY NODES.' },
                { id: 'detectedMines', label: 'Detected Mines', type: 'hud', hint: 'INDICATES KNOWN EXPLOSIVE THREATS.' },
                { id: 'commands', label: 'Commands', type: 'hud', hint: 'DISPLAY SQUAD COMMAND INTERFACE.' },
                { id: 'waypoints', label: 'Waypoints', type: 'hud', hint: 'SHOWS TASK WAYPOINTS IN 3D.' },
                { id: 'weaponInfo', label: 'Weapon Info', type: 'hud', hint: 'AMMO COUNT AND FIRE MODE DISPLAY.' },
                { id: 'stanceIndicator', label: 'Stance Indicator', type: 'hud', hint: 'DISPLAY CURRENT BODY STANCE.' },
                { id: 'thirdPersonView', label: 'Third Person View', type: 'thirdPerson', hint: 'ENABLE THIRD-PERSON CAMERA.' },
                { id: 'tacticalPing', label: 'Tactical Ping', type: 'ping', hint: 'ENHANCED 3D MARKING SYSTEM.' },
              ].map(field => {
                const getOptions = () => {
                  if (field.type === 'thirdPerson') {
                    return (
                      <>
                        <option value={0} className="bg-surface-elevated">DISABLED / CLASSIFIED</option>
                        <option value={1} className="bg-surface-elevated">ENABLED / ALWAYS</option>
                        <option value={2} className="bg-surface-elevated">VEHICLES ONLY</option>
                      </>
                    );
                  }
                  if (field.type === 'ping') {
                    return (
                      <>
                        <option value={0} className="bg-surface-elevated">DISABLED</option>
                        <option value={1} className="bg-surface-elevated">ENABLED</option>
                      </>
                    );
                  }
                  return (
                    <>
                      <option value={0} className="bg-surface-elevated">OFF / CLASSIFIED</option>
                      <option value={1} className="bg-surface-elevated">ENABLED / LIMITED</option>
                      <option value={2} className="bg-surface-elevated">PERMANENT / ALWAYS</option>
                    </>
                  );
                };

                const defaultValue = field.type === 'ping' ? 1 : 0;
                const value = server.difficultySettings?.[field.id] ?? defaultValue;

                return (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={`field-${field.id}`} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{field.label}</label>
                    <Select id={`field-${field.id}`} 
                      value={value}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDifficulty({ [field.id]: Number(e.target.value) })}
                    >
                      {getOptions()}
                    </Select>
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">{field.hint}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-border/50">
              {[
                { id: 'reducedDamage', label: 'Reduced Damage', hint: 'SURVIVABILITY BUFF.' },
                { id: 'staminaBar', label: 'Stamina Bar', hint: 'DISPLAY ENDURANCE LEVEL.' },
                { id: 'weaponCrosshair', label: 'Weapon Crosshair', hint: 'DISPLAY CENTER CROSSHAIR.' },
                { id: 'visionAid', label: 'Vision Aid', hint: 'ENHANCE HOSTILE CONTRAST.' },
                { id: 'scoreTable', label: 'Score Table', hint: 'DISPLAY MISSION STATISTICS.' },
                { id: 'deathMessages', label: 'Killed By', hint: 'DISPLAY KILLS IN CHAT.' },
                { id: 'vonID', label: 'VON ID', hint: 'SHOWS WHO IS SPEAKING.' },
                { id: 'mapContent', label: 'Extended Map Content', hint: 'SHOWS ENTITIES ON MAP.' },
                { id: 'autoReport', label: 'Auto Report', hint: 'AUTO-CALLOUT CONTACTS.' },
                { id: 'cameraShake', label: 'Camera Shake', hint: 'ENABLE EXPLOSION VIBRATION.' },
              ].map(field => (
                <div key={field.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground/90">{field.label}</p>
                    <p className="text-[8px] text-muted-foreground/80 uppercase font-black tracking-widest">{field.hint}</p>
                  </div>
                  <Switch 
                    checked={server.difficultySettings?.[field.id] ?? ['scoreTable', 'deathMessages', 'vonID', 'cameraShake'].includes(field.id)} 
                    onCheckedChange={(c: boolean) => updateDifficulty({ [field.id]: c })} 
                    className=""
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}