import { useState } from 'react'
import { ServerCog, Package, Sun, FileText, ShieldCheck, Activity, Volume2, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { Switch } from '../../../ui/Switch'
import { Select } from '../../../ui/Select'
import { BaseGeneralFields } from '../shared/BaseGeneralFields'
import { MaintenanceCard } from '../shared/MaintenanceCard'
import { ConfigViewerTab } from '../shared/ConfigViewerTab'
import { LaunchParameter } from "../../../../dtos/ServerDto"
import { CustomLaunchParametersInput } from '../../CustomLaunchParametersInput'
import { ModSelector } from '../../ModSelector'

interface DayZSettingsFormProps {
  server: any
  setServer: (server: any) => void
}

export function DayZSettingsForm({ server, setServer }: Readonly<DayZSettingsFormProps>) {
  const [activeTab, setActiveTab] = useState('general')

  const updateServer = (fields: any) => {
    setServer({
      ...server,
      ...fields
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Server Configuration</h2>
          <p className="text-sm text-muted-foreground">Audit, optimize and deploy configurations for the DayZ Dedicated Engine.</p>
        </div>
        <TabsList className="bg-muted/40 p-1 border border-border/50 rounded-xl w-full lg:w-auto grid grid-cols-3 lg:flex gap-1">
          <TabsTrigger value="general" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <ServerCog className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="gameplay" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <Sun className="w-4 h-4" /> Gameplay
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <ShieldCheck className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <Activity className="w-4 h-4" /> Performance
          </TabsTrigger>
          <TabsTrigger value="mods" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <Package className="w-4 h-4" /> Mods
          </TabsTrigger>
          <TabsTrigger value="configs" className="rounded-lg text-xs font-bold uppercase tracking-wider gap-2 px-4 py-2.5">
            <FileText className="w-4 h-4" /> Preview
          </TabsTrigger>
        </TabsList>
      </div>

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
              isDayZ={true} 
              isReforger={false} 
            />
            
            <div className="space-y-4 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/90">Mission Configuration</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label htmlFor="dayz-scenarioId" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Mission Template (Scenario ID)</label>
                  <Input 
                    id="dayz-scenarioId"
                    value={server.scenarioId || ''} 
                    onChange={(e) => updateServer({ scenarioId: e.target.value })}
                    className="bg-muted/50 border-border h-11 font-mono text-xs"
                    placeholder="dayzOffline.chernarusplus"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">THE FOLDER NAME OF THE MISSION WITHIN MPMISSIONS (EG, dayzOffline.chernarusplus).</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dayz-additionalOptions" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Additional Configuration (serverDZ.cfg)</label>
                  <textarea
                    id="dayz-additionalOptions"
                    className="w-full h-32 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground/90 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all"
                    value={server.additionalOptions || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateServer({ additionalOptions: e.target.value })}
                    placeholder={'// Custom configuration here...'}
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 text-balance uppercase">APPENDED TO THE END OF THE CONFIGURATION FILE. USE THIS FOR CUSTOM CLASSES OR PARAMETERS NOT PRESENT ABOVE.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground/90">Launcher Configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="dayz-profilesPath" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Profiles Directory</label>
                  <Input 
                    id="dayz-profilesPath"
                    value={server.profilesPath || ''} 
                    onChange={(e) => updateServer({ profilesPath: e.target.value })}
                    className="bg-muted/50 border-border h-11 font-mono text-xs"
                    placeholder="profiles"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">STORAGE PATH ISOLATION FOR LOGS, SYSTEM DUMPS, ADMIN SCRIPTS AND BATTLEYE RUNTIME CONTEXT (DEFAULT: "profiles").</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="dayz-battlEyePath" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">BattlEye Directory</label>
                  <Input 
                    id="dayz-battlEyePath"
                    value={server.battlEyePath || ''} 
                    onChange={(e) => updateServer({ battlEyePath: e.target.value })}
                    className="bg-muted/50 border-border h-11 font-mono text-xs"
                    placeholder="battleye"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">STORAGE DIRECTORY FOR BATTLEYE BINARIES, DYNAMIC KEYS AND SECURITY PROTOCOL SCHEMAS (DEFAULT: "battleye").</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {[
                  { id: 'enableDoLogs', label: 'Basic Logging', hint: '(-DOLOGS) FORCES COMPREHENSIVE RUNTIME SIMULATION STACK TRACE GENERATION IN LOGS.' },
                  { id: 'enableAdminLog', label: 'Admin Log', hint: '(-ADMINLOG) GENERATES EXPANDED TRANSACTIONAL AUDIT HISTORIES FOR ADMIN ANALYSIS.' },
                  { id: 'enableNetLog', label: 'Network Log', hint: '(-NETLOG) STREAMS NETWORK DATA AND CONGESTION METRICS FOR NETWORK TROUBLESHOOTING.' },
                  { id: 'enableFreezeCheck', label: 'Freeze Check', hint: '(-FREEZECHECK) RUNS A CONCURRENCY MONITOR THREAD TO RECOVER HANGING INSTANCES.' },
                ].map(field => (
                  <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-foreground tracking-wide uppercase">{field.label}</p>
                      <p className="text-[8px] text-muted-foreground font-medium tracking-tight uppercase">{field.hint}</p>
                    </div>
                    <Switch 
                      checked={server[field.id]} 
                      onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                      className="scale-75"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label htmlFor="dayz-limitFPS" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Server FPS Limit</label>
                  <Input 
                    id="dayz-limitFPS"
                    type="number"
                    value={server.limitFPS || ''} 
                    onChange={(e) => updateServer({ limitFPS: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="bg-muted/50 border-border h-11"
                    placeholder="60"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAXIMUM SERVER PERFORMANCE THRESHOLD FPS LIMIT (1-200, DEFAULT: 60).</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="dayz-instanceId" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Instance ID</label>
                  <Input 
                    id="dayz-instanceId"
                    type="number"
                    value={server.instanceId || ''} 
                    onChange={(e) => updateServer({ instanceId: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="bg-muted/50 border-border h-11"
                    placeholder="1"
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">UNIQUE INSTANCE IDENTIFIER FOR MULTI-SERVER PERSISTENT SAVINGS ISOLATION (DEFAULT: 1).</p>
                </div>
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

      {/* GAMEPLAY TAB */}
      <TabsContent value="gameplay" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <Sun className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Environment & Survival</CardTitle>
                <CardDescription className="text-muted-foreground">World rules, time acceleration, and damage mechanics.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'serverTime', label: 'Initial Server Time', placeholder: 'SystemTime', hint: 'INITIAL DATE AND TIME ON BOOT. SET TO "SystemTime" OR USE EXACT FORMAT "YYYY/MM/DD/HH/MM".' },
                { id: 'timeAcceleration', label: 'Daytime Speed', placeholder: '1.0', hint: 'CHRONOLOGICAL TIME PASSAGE ACCELERATION MULTIPLIER FOR THE ENTIRE CYCLE (0.1 TO 64.0, DEFAULT: 1.0).' },
                { id: 'nightTimeAcceleration', label: 'Nocturnal Speed', placeholder: '1.0', hint: 'SPECIFIC CHRONOLOGICAL SPEED ACCELERATION FOR NOCTURNAL HOURS (0.1 TO 64.0, DEFAULT: 1.0).' },
              ].map(field => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={`dayz-${field.id}`} className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{field.label}</label>
                  <Input 
                    id={`dayz-${field.id}`}
                    value={server[field.id] || ''} 
                    onChange={(e) => {
                      let val: string | number | undefined;
                      if (field.id === 'serverTime') {
                        val = e.target.value;
                      } else {
                        val = e.target.value === '' ? undefined : Number(e.target.value);
                      }
                      updateServer({ [field.id]: val });
                    }}
                    className="bg-muted/50 border-border h-11"
                    placeholder={field.placeholder}
                  />
                  <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">{field.hint}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {[
                { id: 'disable3rdPerson', label: 'Disable 3rd Person', hint: 'FORCES CAMERA VIEWPORT PERSPECTIVE EXCLUSIVELY INTO HARDCORE FIRST-PERSON (1PP).' },
                { id: 'disableCrosshair', label: 'Disable Crosshair', hint: 'HIDES SCREEN HUD FIRING CROSSHAIR RETICLE FOR IMMERSION.' },
                { id: 'serverTimePersistent', label: 'Persistent Time', hint: 'SAVES TIME PROGRESSION ON HEARTBEAT DISCONNECTS TO PRESERVE CONTINUITY.' },
                { id: 'enableDebugMonitor', label: 'Debug Monitor', hint: 'DISPLAYS REAL-TIME DIAGNOSTIC CHARTS DIRECTLY ON ACTIVE PLAYER SCREENS.' },
                { id: 'disableBaseDamage', label: 'No Base Damage', hint: 'IMMUNIZES BASE STRUCTURE FENCES AND WATCHTOWERS FROM DAMAGE DEGRADATION.' },
                { id: 'disableContainerDamage', label: 'No Container Damage', hint: 'PREVENTS DEGRADATION DAMAGE TO ITEMS PLACED IN TENTS AND OUTDOOR STORAGE.' },
                { id: 'disablePersonalLight', label: 'No Personal Light', hint: 'BLOCKS NATURAL GLOW LUMINESCENCE FORCED AROUND PLAYER bodies AT NIGHT.' },
                { id: 'disableRespawnDialog', label: 'No Respawn Dialog', hint: 'BYPASS SPAWN SELECTION WINDOWS TO DIRECTLY FORCE A COMPLETELY RANDOM SPAWN.' },
                { id: 'shotValidation', label: 'Shot Validation', hint: 'ENFORCES RUNTIME SERVER-SIDE BALLISTICS COMPUTATIONS TO COUNTER DAMAGE HACKS.' },
              ].map(field => (
                <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">{field.label}</p>
                    <p className="text-[9px] text-muted-foreground font-medium tracking-tight uppercase">{field.hint}</p>
                  </div>
                  <Switch 
                    checked={server[field.id]} 
                    onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                    className="scale-75"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="dayz-lightingConfig" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Lighting Configuration</label>
                <Select 
                  id="dayz-lightingConfig"
                  value={server.lightingConfig} 
                  onChange={(e) => updateServer({ lightingConfig: Number(e.target.value) })}
                >
                  <option value={0} className="bg-surface-elevated">Brighter Nights (0)</option>
                  <option value={1} className="bg-surface-elevated">Darker Nights (1) - AUTHENTIC SURVIVAL</option>
                  <option value={2} className="bg-surface-elevated">Sakhal / Frostline (2) - POLAR EXPEDITION</option>
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">SELECTS THE VISUAL ATMOSPHERIC LIGHTING PROFILE FOR THE WORLD ENVIRONMENT.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="dayz-respawnTime" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Respawn Delay (Seconds)</label>
                <Input 
                  id="dayz-respawnTime"
                  type="number"
                  value={server.respawnTime || ''} 
                  onChange={(e) => updateServer({ respawnTime: e.target.value === '' ? undefined : Number(e.target.value) })}
                  className="bg-muted/50 border-border h-11"
                  placeholder="5"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">DELAY IN SECONDS BEFORE NEW SURVIVOR ENTRY TRIGGER SPAWNS (DEFAULT: 5).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MESSAGE OF THE DAY (MOTD) CARD */}
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <Volume2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Message of the Day (MOTD)</CardTitle>
                <CardDescription className="text-muted-foreground">Configure global chat broadcast alerts and intervals.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">MOTD Messages</div>
              <div className="space-y-3">
                {(server.motd || []).map((message: string, index: number) => (
                  <div key={`motd-${index}-${message.substring(0,10)}`} className="flex gap-2 items-center">
                    <Input
                      value={message}
                      onChange={(e) => {
                        const newMotd = [...(server.motd || [])]
                        newMotd[index] = e.target.value
                        updateServer({ motd: newMotd })
                      }}
                      className="bg-muted/50 border-border h-11"
                      placeholder={`Message #${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newMotd = (server.motd || []).filter((_: any, i: number) => i !== index)
                        updateServer({ motd: newMotd })
                      }}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newMotd = [...(server.motd || []), '']
                    updateServer({ motd: newMotd })
                  }}
                  className="flex items-center justify-center gap-2 w-full h-11 border border-dashed border-primary/30 rounded-xl text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Message
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <label htmlFor="dayz-motdInterval" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">MOTD Interval (Seconds)</label>
              <Input
                id="dayz-motdInterval"
                type="number"
                value={server.motdInterval || ''}
                onChange={(e) => updateServer({ motdInterval: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="bg-muted/50 border-border h-11 w-full md:w-1/3"
                placeholder="1"
              />
              <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">
                TIME DELAY IN SECONDS BETWEEN CONSECUTIVE CHAT BROADCASTS (DEFAULT: 1 SECOND).
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SECURITY & LOGS TAB */}
      <TabsContent value="security" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Security & Audit Logs</CardTitle>
                <CardDescription className="text-muted-foreground">Protection systems and detailed server logging.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Core Security</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'battlEye', label: 'BattlEye Anti-Cheat', hint: 'ENFORCES SECURE BATTLEYE MODULES. MANDATORY FOR GLOBAL DISCOVERY PUBLIC VISIBILITY.' },
                    { id: 'enableWhitelist', label: 'Whitelist Mode', hint: 'RESTRICTS SERVER LOGINS EXCLUSIVELY TO SURVIVORS REGISTERED IN whitelist.txt.' },
                    { id: 'forceSameBuild', label: 'Force Same Build', hint: 'BLOCKS LOGINS FROM CLIENTS RUNNING MISMATCHED PROTOCOL VERSION ENGINE BUILDS.' },
                    { id: 'disableBanlist', label: 'Disable Banlist Checking', hint: 'BYPASSES VERIFICATIONS AGAINST BLOCKED ACCOUNTS DEFINED IN THE LOCAL ban.txt SYSTEM.' },
                    { id: 'disablePrioritylist', label: 'Disable Priority List', hint: 'DISMISSES QUEUE RESERVED VIP PRIVILEGES CONFIGURED IN priority.txt FOR LOBBY CONNECTIONS.' },
                    { id: 'disableVoN', label: 'Disable Voice Over Network', hint: 'MUTILATES ALL DIRECT VOIP COMMUNICATIONS AND IN-GAME CHAT VOICE (VON) STREAMS.' },
                  ].map(field => (
                    <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-foreground tracking-wide uppercase">{field.label}</p>
                        <p className="text-[9px] text-muted-foreground font-medium tracking-tight uppercase">{field.hint}</p>
                      </div>
                      <Switch 
                        checked={server[field.id]} 
                        onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                        className="scale-75"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label htmlFor="dayz-verifySignatures" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Signature Verification (verifySignatures)</label>
                    <Select 
                      id="dayz-verifySignatures"
                      value={server.verifySignatures ?? 2} 
                      onChange={(e) => updateServer({ verifySignatures: Number(e.target.value) })}
                    >
                      <option value={0} className="bg-surface-elevated">Disabled (0) - HIGH CHEAT RISK</option>
                      <option value={2} className="bg-surface-elevated">V2 Only (2) - MAXIMUM PROTECTION</option>
                    </Select>
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">
                      VERIFIES DIGITAL PBO MOD SIGNATURES. ONLY VALUE 2 IS OFFICIALLY SUPPORTED AND RECOMMENDED FOR PUBLIC SERVERS.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audit Logs & Telemetry</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="dayz-timeStampFormat" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Log Timestamp Format</label>
                    <Select 
                      id="dayz-timeStampFormat"
                      value={server.timeStampFormat || 'Short'} 
                      onChange={(e) => updateServer({ timeStampFormat: e.target.value })}
                    >
                      <option value="Short" className="bg-surface-elevated">Short (HH:MM:SS)</option>
                      <option value="Full" className="bg-surface-elevated">Full (YYYY/MM/DD HH:MM:SS)</option>
                    </Select>
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">
                      SELECTS THE DETAILED TIMESTAMP DATE FORMAT PREPENDED TO CONSOLE LOG MESSAGES AND REPORT CHANNELS.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'adminLogPlayerHits', label: 'Log Player Hits Only', hint: 'LOGS TRANSCRIPT EVENTS CONCERNING HITS AND DAMAGE TAKEN BY SURVIVORS.' },
                      { id: 'adminLogPlacement', label: 'Log Object Placement', hint: 'LOGS PLACEMENT DUMPS OF PHYSICAL TENTS, LOCKERS, BARRELS AND BOXES.' },
                      { id: 'adminLogBuildActions', label: 'Log Build Actions', hint: 'LOGS CONSTRUCTION ACTIONS, REPAIRS, AND DISMANTLING OF FENCE STAGES.' },
                      { id: 'adminLogPlayerList', label: 'Periodic Player List', hint: 'PERIODICALLY APPENDS COMPLETE PLAYER LIST INCLUDES GPS POSITIONS (EVERY 5 MINS).' },
                      { id: 'logAverageFps', label: 'Log Average FPS', hint: 'RECORDS AVERAGED HISTORICAL PERFORMANCE FPS DUMPS AT DETAILED RUNTIME HEURISTICS.' },
                      { id: 'logMemory', label: 'Log Memory Usage', hint: 'TRACKS ALLOCATED SYSTEM RAM MEMORY IN ENGINE REPORTS AT LOG PERIODS.' },
                      { id: 'logPlayers', label: 'Log Player Count', hint: 'TRACES ACTIVE PLAYER CONCURRENT SENSOR COUNTS IN DIAGNOSTIC REPORTS.' },
                    ].map(field => (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-foreground tracking-wide uppercase">{field.label}</p>
                          <p className="text-[8px] text-muted-foreground font-medium tracking-tight uppercase">{field.hint}</p>
                        </div>
                        <Switch 
                          checked={server[field.id]} 
                          onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                          className="scale-75"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PERFORMANCE TAB */}
      <TabsContent value="performance" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Card className="border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Performance & Network</CardTitle>
                <CardDescription className="text-muted-foreground">Engine optimization and network traffic control.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Queue Management</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="dayz-loginQueueConcurrent" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Concurrent Logins</label>
                    <Input 
                      id="dayz-loginQueueConcurrent"
                      type="number"
                      value={server.loginQueueConcurrent || ''} 
                      onChange={(e) => updateServer({ loginQueueConcurrent: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="5"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAX CONCURRENT PLAYER LOGIN LOADING CYCLES IN THE WAITING BUFFER.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dayz-loginQueueMax" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max Queue Size</label>
                    <Input 
                      id="dayz-loginQueueMax"
                      type="number"
                      value={server.loginQueueMax || ''} 
                      onChange={(e) => updateServer({ loginQueueMax: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="500"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAX BUFFERED PLAYERS PERMITTED TO REMAIN IN LOBBY ALLOCATION QUEUES.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-1 md:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Network QoS & FPS Telemetry</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="dayz-pingWarning" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Ping Warning (MS)</label>
                    <Input 
                      id="dayz-pingWarning"
                      type="number"
                      value={server.pingWarning || ''} 
                      onChange={(e) => updateServer({ pingWarning: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="200"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">THRESHOLD FOR PING WARNING ALERTS (DEFAULT: 200 MS).</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dayz-pingCritical" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Ping Critical (MS)</label>
                    <Input 
                      id="dayz-pingCritical"
                      type="number"
                      value={server.pingCritical || ''} 
                      onChange={(e) => updateServer({ pingCritical: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="250"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">THRESHOLD FOR CRITICAL LATENCY ALERTS (DEFAULT: 250 MS).</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dayz-maxPing" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Max Ping Kick (MS)</label>
                    <Input 
                      id="dayz-maxPing"
                      type="number"
                      value={server.maxPing || ''} 
                      onChange={(e) => updateServer({ maxPing: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="300"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAX PING THRESHOLD BEFORE DISCONNECTING CLIENTS (DEFAULT: 300 MS).</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dayz-serverFpsWarning" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Server FPS Warning</label>
                    <Input 
                      id="dayz-serverFpsWarning"
                      type="number"
                      value={server.serverFpsWarning || ''} 
                      onChange={(e) => updateServer({ serverFpsWarning: e.target.value === '' ? undefined : Number(e.target.value) })}
                      className="bg-muted/50 border-border h-11"
                      placeholder="15"
                    />
                    <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">ALERTS SYSTEM IF SERVER SIMULATION FPS DROPS BELOW THRESHOLD (MIN: 11, DEFAULT: 15).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
              {[
                { id: 'multithreadedReplication', label: 'MT Replication', hint: 'ALLOCATES DEDICATED CPU CORES FOR NETWORK PACKET REPLICATION RUNTIME PIPELINES.' },
                { id: 'storageAutoFix', label: 'Storage AutoFix', hint: 'AUTOMATICALLY HEALS PERSISTENCE FILES IN CASE OF POWER OUTAGES OR CORRUPTIONS.' },
                { id: 'allowFilePatching', label: 'File Patching', hint: 'ALLOWS CLIENT-SIDE MODIFIED LOCAL DIRECTORIES FOR DEVELOPMENT AND TESTING.' },
                { id: 'shotValidation', label: 'Shot Validation', hint: 'ENFORCES RUNTIME SERVER-SIDE HIT-REGISTRATION CALCULATIONS TO COUNTER DAMAGE HACKS.' },
              ].map(field => (
                <div key={field.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-foreground tracking-wide uppercase">{field.label}</p>
                    <p className="text-[8px] text-muted-foreground font-medium tracking-tight uppercase">{field.hint}</p>
                  </div>
                  <Switch 
                    checked={server[field.id]} 
                    onCheckedChange={(c: boolean) => updateServer({ [field.id]: c })} 
                    className="scale-75"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <label htmlFor="dayz-speedhackDetection" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Speedhack Sensitivity</label>
                <Select 
                  id="dayz-speedhackDetection"
                  value={server.speedhackDetection ?? 1} 
                  onChange={(e) => updateServer({ speedhackDetection: Number(e.target.value) })}
                >
                  <option value={1} className="bg-surface-elevated">1 - Strict (High Kick Rate)</option>
                  {[2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="bg-surface-elevated">{n}</option>)}
                  <option value={10} className="bg-surface-elevated">10 - Benevolent (Safe)</option>
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">TOLERANCE SENSITIVITY THRESHOLD RATIO FOR ANOMALOUS PLAYER MOVEMENT CHECKS.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="dayz-simulatedPlayersBatch" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Simulated Batch Size</label>
                <Input 
                  id="dayz-simulatedPlayersBatch"
                  type="number"
                  value={server.simulatedPlayersBatch || ''} 
                  onChange={(e) => updateServer({ simulatedPlayersBatch: e.target.value === '' ? undefined : Number(e.target.value) })}
                  className="bg-muted/50 border-border h-11"
                  placeholder="20"
                />
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">MAX PLAYERS SIMULATED PER SERVER BATCH CYCLE FRAME TO LOAD BALANCE CPU.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="dayz-vonCodecQuality" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">VON Codec Quality</label>
                <Select 
                  id="dayz-vonCodecQuality"
                  value={server.vonCodecQuality ?? 20} 
                  onChange={(e) => updateServer({ vonCodecQuality: Number(e.target.value) })}
                >
                  {[...new Array(21).keys()].map(n => <option key={n} value={n} className="bg-surface-elevated">{n} (Max 20)</option>)}
                </Select>
                <p className="text-[10px] text-muted-foreground/80 font-medium ml-1 uppercase">VOICE QUALITY CODEC COMPRESSION FACTOR MULTIPLIER ENFORCEMENT.</p>
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
              serverType={server.type}
              selectedModIds={server.activeMods || []}
              onChange={(mods: number[]) => updateServer({ activeMods: mods })}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* CONFIGS PREVIEW TAB */}
      <TabsContent value="configs" className="pt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ConfigViewerTab serverId={server.id} />
      </TabsContent>
    </Tabs>
  )
}
