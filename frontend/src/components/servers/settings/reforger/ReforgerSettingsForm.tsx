/**
 * ReforgerSettingsForm.tsx
 * 
 * Purpose: Game-specific settings for Arma Reforger (Enfusion Engine).
 * Structure: 5 Tabs (General, Security, Network, Properties, Mods).
 * 
 * Where to add logic:
 * - Reforger-specific engine parameters (simulation FPS, broadcast radius) go here.
 * - Scenario and mod selection logic specific to Reforger is managed within this form.
 */
import { useState } from 'react'
import { ServerCog, ShieldCheck, Activity, Package, Cpu, FileText, Database, Users, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/Tabs'
import { ReforgerSavesManager } from './ReforgerSavesManager'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { Switch } from '../../../ui/Switch'
import { Textarea } from '../../../ui/Textarea'
import { BaseGeneralFields } from '../shared/BaseGeneralFields'
import { MaintenanceCard } from '../shared/MaintenanceCard'
import { ConfigViewerTab } from '../shared/ConfigViewerTab'
import { LaunchParameter } from "../../../../dtos/ServerDto"
import { CustomLaunchParametersInput } from '../../CustomLaunchParametersInput'
import { ReforgerModSelector } from '../../ReforgerModSelector'
import { ReforgerScenariosAutocomplete } from '../../ReforgerScenariosAutocomplete'
import { ReforgerCustomNames } from './ReforgerCustomNames'

interface ReforgerSettingsFormProps {
  server: any
  setServer: (server: any) => void
  isInstalled?: boolean
}

export function ReforgerSettingsForm({ server, setServer, isInstalled = true }: Readonly<ReforgerSettingsFormProps>) {
  const [activeTab, setActiveTab] = useState('general')

  const updateServer = (updates: any) => {
    setServer((prev: any) => ({ ...prev, ...updates }))
  }

  const handleNumberInput = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateServer({ [field]: e.target.value === '' ? null : Number(e.target.value) })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-surface-elevated/50 p-1 border border-border rounded-lg w-fit justify-start overflow-x-auto gap-1 h-auto no-scrollbar">
        {[
          { value: 'general', label: 'General', icon: ServerCog },
          { value: 'mods', label: 'Mods', icon: Package },
          { value: 'security', label: 'Security', icon: ShieldCheck },
          { value: 'network', label: 'Network', icon: Activity },
          { value: 'properties', label: 'Properties', icon: Cpu },
          ...(server.id && isInstalled ? [
            { value: 'configs', label: 'Configs', icon: FileText },
            { value: 'saves', label: 'Saved Scenarios', icon: Database },
            { value: 'custom_names', label: 'Change Names', icon: Users }
          ] : []),
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
              isArma3={false} 
              isDayZ={false} 
              isReforger={true} 
            />

            <div className="space-y-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/90">Enfusion Engine Core</h3>
              </div>
              <ReforgerScenariosAutocomplete 
                serverId={server.id}
                value={server.scenarioId || ''}
                onChange={(val: string) => updateServer({ scenarioId: val })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label htmlFor="reforger-maxFPS" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max FPS (-maxFPS)</label>
                  <Input 
                    id="reforger-maxFPS"
                    type="number"
                    value={server.maxFPS ?? ''} 
                    onChange={handleNumberInput('maxFPS')}
                    placeholder="60"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">TARGET FRAME-RATE FOR SERVER-SIDE SIMULATION (DEFAULT: 60 FPS).</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reforger-autoSaveInterval" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Checkpoint Frequency</label>
                  <div className="relative">
                    <Input 
                      id="reforger-autoSaveInterval"
                      type="number"
                      value={server.autoSaveInterval ?? ''} 
                      onChange={handleNumberInput('autoSaveInterval')}
                      placeholder="10"
                      className="bg-muted/50 border-border pr-12 h-11"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">MIN</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">INTERVAL IN MINUTES BETWEEN PERSISTENT STATE AUTOSAVES (0 TO DISABLE, DEFAULT: 10 MIN).</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reforger-joinQueueMaxSize" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Join Queue Size</label>
                  <Input 
                    id="reforger-joinQueueMaxSize"
                    type="number"
                    value={server.joinQueueMaxSize ?? ''} 
                    onChange={handleNumberInput('joinQueueMaxSize')}
                    placeholder="0"
                    className="bg-muted/50 border-border h-11"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAXIMUM SIZE OF THE JOIN QUEUE FOR WAITING PLAYERS (0–50, DEFAULT: 0 = DISABLED).</p>
                </div>
              </div>

              <div className="space-y-2 mt-8">
                <label htmlFor="server-admins" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Admins</label>
                <Textarea 
                  id="server-admins"
                  value={server.admins?.join('\n') || ''} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const val = e.target.value;
                    updateServer({ admins: val ? val.split('\n').map(s => s.trim()).filter(Boolean) : [] });
                  }}
                  placeholder="0123456789ABCDEF&#10;76561198000000000"
                  className="bg-muted/50 border-border min-h-[100px]"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">ADMIN IDS (ONE PER LINE) - IDENTITY ID OR STEAMID64 FOR PRIORITY QUEUE AND #LOGIN WITHOUT PASSWORD.</p>
              </div>
            </div>

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
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Disable AI Spawning</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">DISABLES AI WORLD INITIALIZATION ENTIRELY. NO AI WILL FUNCTION ON THIS SERVER.</p>
                  </div>
                  <Switch checked={server.battlEye} onCheckedChange={(c: boolean) => updateServer({ battlEye: c })} className="" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Fast Integrity Checks</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">LIGHTWEIGHT WORLD-STATE VALIDATION ON CLIENT JOIN. ALWAYS KEEP ENABLED ON PUBLIC SERVERS.</p>
                  </div>
                  <Switch checked={server.visible} onCheckedChange={(c: boolean) => updateServer({ visible: c })} className="" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Cross-Play Bridge</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ALLOWS COMBINED INTERACTION FOR PC, XBOX, AND PLAYSTATION CLIENTS.</p>
                  </div>
                  <Switch checked={server.crossPlatform} onCheckedChange={(c: boolean) => updateServer({ crossPlatform: c })} className="" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Disable Error Dialogs (-noThrow)</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">SUPPRESSES ALL ERROR DIALOGS (VME, ASSERTS, CRASHES) ON THE SERVER PROCESS.</p>
                  </div>
                  <Switch checked={!!server.noThrow} onCheckedChange={(c: boolean) => updateServer({ noThrow: c })} className="" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Addons Verification</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">VERIFIES THE INTEGRITY OF ALL DOWNLOADED WORKSHOP ADDONS AT LAUNCH. SERVER SHUTS DOWN IF CORRUPTION IS FOUND.</p>
                  </div>
                  <Switch checked={!!server.addonsVerify} onCheckedChange={(c: boolean) => updateServer({ addonsVerify: c })} className="" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Addons Auto-Repair</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">VERIFIES AND AUTOMATICALLY REPAIRS CORRUPT ADDONS AT LAUNCH. SHUTS DOWN IF REPAIR FAILS.</p>
                  </div>
                  <Switch checked={!!server.addonsRepair} onCheckedChange={(c: boolean) => updateServer({ addonsRepair: c })} className="" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Cross-Faction Voice Comms</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ALLOWS PLAYERS TO TRANSMIT ON ENEMY FACTION RADIOS. IF DISABLED, LISTEN-ONLY.</p>
                  </div>
                  <Switch checked={server.vonCanTransmitCrossFaction} onCheckedChange={(c: boolean) => updateServer({ vonCanTransmitCrossFaction: c })} className="" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* NETWORK TAB */}
      <TabsContent value="network" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Network Replication</CardTitle>
                <CardDescription className="text-muted-foreground">Streaming and spatial synchronization parameters.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label htmlFor="reforger-networkViewDistance" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Broadcast Radius</label>
                <div className="relative">
                  <Input 
                    id="reforger-networkViewDistance"
                    type="number"
                    value={server.networkViewDistance ?? ''} 
                    onChange={handleNumberInput('networkViewDistance')}
                    placeholder="1500"
                    className="bg-muted/50 border-border h-11 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">M</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAXIMUM DISTANCE IN METERS FOR SPATIAL ENTITY REPLICATION & DATA STREAMING (500–5000M, DEFAULT: 1500M).</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-nwkResolution" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Network Resolution</label>
                <Input 
                  id="reforger-nwkResolution"
                  type="number"
                  value={server.nwkResolution ?? ''} 
                  onChange={handleNumberInput('nwkResolution')}
                  placeholder="250"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">SPATIAL MAP CELLS RESOLUTION IN A 100-1000M RANGE. SMALLER = LESS POP-IN BUT LOWER RANGE.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-networkDynamicSimulation" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Dynamic Scaling (-nds)</label>
                <Input 
                  id="reforger-networkDynamicSimulation"
                  type="number"
                  value={server.networkDynamicSimulation ?? ''} 
                  onChange={handleNumberInput('networkDynamicSimulation')}
                  placeholder="2"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">NDS CELL DIAMETER. 0 = ALL ENTITIES ALWAYS REPLICATED (DEFAULT: 2). HIGHER = WIDER RANGE BUT LOWER PERFORMANCE.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-replicationTimeoutMs" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Rep. Timeout</label>
                <div className="relative">
                  <Input 
                    id="reforger-replicationTimeoutMs"
                    type="number"
                    value={server.replicationTimeoutMs ?? ''} 
                    onChange={handleNumberInput('replicationTimeoutMs')}
                    placeholder="10000"
                    className="bg-muted/50 border-border h-11 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">MS</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">GRACE PERIOD IN MILLISECONDS BEFORE A STALLED CLIENT IS REPLICATION KICKED. ADJUST BASED ON CLIENT CONNECTIVITY.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-streamsDelta" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Streams Delta</label>
                <Input 
                  id="reforger-streamsDelta"
                  type="number"
                  value={server.streamsDelta ?? ''} 
                  onChange={handleNumberInput('streamsDelta')}
                  placeholder="100"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAX DIFFERENCE BETWEEN SERVER AND CLIENT OPEN STREAMS PER TICK (1–1000, DEFAULT: 100).</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-streamingBudget" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Streaming Budget</label>
                <Input 
                  id="reforger-streamingBudget"
                  type="number"
                  value={server.streamingBudget ?? ''} 
                  onChange={handleNumberInput('streamingBudget')}
                  placeholder="500"
                  className="bg-muted/50 border-border h-11"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">GLOBAL REPLICATION BUDGET PER CONNECTION PER TICK. CANNOT GO BELOW 100. LOWER = LESS SERVER LOAD BUT MORE POP-IN.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="flex items-center justify-between p-5 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Performance Logging</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">ENABLE REAL-TIME PERFORMANCE TELEMETRY IN THE CONSOLE AND LOG FILES.</p>
                  </div>
                  <Switch 
                    checked={server.logStats} 
                    onCheckedChange={(c: boolean) => updateServer({ logStats: c })} 
                    className=""
                  />
                </div>
              </div>

              {server.logStats && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="reforger-logStatsIntervalMs" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Log Stats Interval</label>
                  <div className="relative">
                    <Input 
                      id="reforger-logStatsIntervalMs"
                      type="text"
                      value={server.logStatsIntervalMs !== undefined && server.logStatsIntervalMs !== null ? String(server.logStatsIntervalMs / 1000) : ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value.replace(',', '.');
                        if (val === '') {
                          updateServer({ logStatsIntervalMs: null });
                        } else if (!Number.isNaN(Number(val))) {
                          updateServer({ logStatsIntervalMs: Math.round(Number(val) * 1000) });
                        }
                      }}
                      placeholder="5"
                      className="bg-muted/50 border-border h-11 pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">SEC</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">PERFORMANCE TELEMETRY WRITE FREQUENCY IN SECONDS (DEFAULT: 1 SECOND IF NOT SPECIFIED).</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PROPERTIES TAB */}
      <TabsContent value="properties" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Game Properties</CardTitle>
                <CardDescription className="text-muted-foreground">In-game limits and simulation constraints.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-10 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-border/50">
              <div className="space-y-2">
                <label htmlFor="reforger-serverMaxViewDistance" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max View Distance</label>
                <div className="relative">
                  <Input 
                    id="reforger-serverMaxViewDistance"
                    type="number" 
                    value={server.serverMaxViewDistance ?? ''} 
                    onChange={handleNumberInput('serverMaxViewDistance')} 
                    placeholder="1600"
                    className="bg-muted/50 border-border h-11 pr-12" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">M</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAXIMUM WORLD ENGINE GEOMETRY AND ENTITY RENDERING DISTANCE FORCE LIMIT (500–10000M, DEFAULT: 1600M).</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-serverMinGrassDistance" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Min Grass Distance</label>
                <div className="relative">
                  <Input 
                    id="reforger-serverMinGrassDistance"
                    type="number" 
                    value={server.serverMinGrassDistance ?? ''} 
                    onChange={handleNumberInput('serverMinGrassDistance')} 
                    placeholder="0"
                    className="bg-muted/50 border-border h-11 pr-12" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/80 uppercase">M</span>
                </div>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MINIMUM TERRAIN GRASS DETAIL CULLING DISTANCE FOR CLIENTS (0 OR 50–150M, DEFAULT: 0 = NOT ENFORCED).</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reforger-aiLimit" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">AI Limit</label>
                <Input 
                  id="reforger-aiLimit"
                  type="number" 
                  value={server.aiLimit ?? ''} 
                  onChange={handleNumberInput('aiLimit')} 
                  placeholder="-1"
                  className="bg-muted/50 border-border h-11" 
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">MAXIMUM SIMULTANEOUS ACTIVE AI ENTITIES SPAWNED BY THE SERVER (-1 = NO LIMIT APPLIED).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'thirdPersonViewEnabled', label: 'Third Person View', hint: 'PERMITS THIRD PERSON CAMERA IN VEHICLES AND ON FOOT.' },
                { id: 'disableAI', label: 'Disable AI Spawning', hint: 'DISABLES AI WORLD INITIALIZATION ENTIRELY. NO AI WILL FUNCTION ON THIS SERVER.' },
                { id: 'fastValidation', label: 'Fast Integrity Checks', hint: 'LIGHTWEIGHT WORLD-STATE VALIDATION ON CLIENT JOIN. ALWAYS KEEP ENABLED ON PUBLIC SERVERS.' },
              ].map(field => (
                <div key={field.id} className="flex items-center justify-between p-5 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">{field.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{field.hint}</p>
                  </div>
                  <Switch 
                    checked={!!server[field.id as keyof typeof server]} 
                    onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                    className=""
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Mission Header Custom Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Specify custom parameters (such as ACE Settings) to be embedded directly into the server's Mission Header block.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="reforger-missionHeader" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Mission Header JSON</label>
              <textarea
                id="reforger-missionHeader"
                value={server.missionHeader || ''}
                onChange={(e) => updateServer({ missionHeader: e.target.value })}
                placeholder={`{\n  "m_ACE_Settings": {\n    "m_ACE_Medical_Core": {\n      "m_fBleedingRateScale": 0.6\n    }\n  }\n}`}
                rows={15}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="flex w-full rounded-md border border-border bg-background px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-active disabled:cursor-not-allowed disabled:opacity-50 transition-all bg-muted/50 resize-y"
              />
              <p className="text-[10px] text-muted-foreground/80 font-medium ml-1">
                MUST BE A VALID JSON OBJECT REPRESENTING THE INNER CONSTRAINTS OF THE missionHeader BLOCK.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* MODS TAB */}
      <TabsContent value="mods" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardContent className="p-6 lg:p-8">
            <ReforgerModSelector 
              selectedMods={server.activeMods || []}
              onChange={(mods) => updateServer({ activeMods: mods })}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* CONFIGS PREVIEW TAB */}
      <TabsContent value="configs" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ConfigViewerTab serverId={server.id} />
      </TabsContent>

      {/* SAVES TAB */}
      {server.id && (
        <TabsContent value="saves" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ReforgerSavesManager serverId={server.id} />
        </TabsContent>
      )}

      {/* CUSTOM NAMES TAB */}
      {server.id && (
        <TabsContent value="custom_names" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {server.activeMods?.some((mod: any) => mod.id === '69C4F1D85803A966') ? (
            <ReforgerCustomNames serverId={server.id} />
          ) : (
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 text-warning rounded-xl text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-base mb-1">Mod Not Active</p>
                <p className="opacity-90">
                  The <strong className="font-black">BTC_custom_names</strong> mod (ID: 69C4F1D85803A966) is not currently active on this server.
                </p>
                <p className="opacity-90 mt-2">
                  You must add it to the active mods list in the "Mods" tab and restart the server to manage custom in-game names.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>
  )
}
