import React, { useState, useEffect } from 'react'
import { Save, ShieldCheck, Info, Terminal, Loader2, Wrench, KeyRound, QrCode } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SteamCmdService, SettingsService, WorkshopService } from '../services/api'
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog'
import { useToast } from '../components/ui/Toast'
import { LogRetentionForm } from '../components/appConfig/LogRetentionForm'
import { SteamQRAuthView } from '../components/settings/SteamQRAuthView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { useSystemInfo } from '../contexts/SystemInfoContext'
import { Badge } from '../components/ui/Badge'

export function AppConfigPage() {
  const { showToast } = useToast()
  const { systemInfo: sysInfo } = useSystemInfo()
  const [auth, setAuth] = useState({
    username: '',
    password: '',
    steamGuardToken: ''
  })
  const [settings, setSettings] = useState({
    logRetentionDays: 30,
    logMaxTotalSizeMB: 1024
  })
  const [clearConfirm, setClearConfirm] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [confirmUpdate, setConfirmUpdate] = useState(false)
  const [testingLogin, setTestingLogin] = useState(false)
  const [syncingBiKeys, setSyncingBiKeys] = useState(false)

  useEffect(() => {
    if (sysInfo?.steam_username && !auth.username) {
      setAuth(prev => ({ ...prev, username: sysInfo.steam_username }))
    }
  }, [sysInfo])

  useEffect(() => {
    SettingsService.getSettings().then(setSettings).catch(console.error)
  }, [])

  const executeAction = async (
    action: () => Promise<any>,
    setLoading: (state: boolean) => void,
    successMsg: string,
    errorPrefix: string
  ) => {
    setLoading(true)
    try {
      await action()
      showToast(successMsg, 'success')
    } catch (err: any) {
      showToast(`${errorPrefix}: ${err.message || 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAuth = (e: React.SyntheticEvent) => {
    e.preventDefault()
    executeAction(() => SteamCmdService.login(auth), () => {}, 'Steam credentials saved successfully.', 'Failed to save credentials')
  }

  const handleTestAuth = async () => {
    if (!auth.username) {
        showToast('Please enter a username first.', 'error')
        return
    }
    setTestingLogin(true)
    try {
      const res = await SteamCmdService.testLogin(auth)
      if (res.success) {
        showToast('Steam connection verified successfully!', 'success')
      } else {
        showToast('Verification failed: ' + res.error, 'error')
      }
    } catch (err: any) {
      showToast('Verification failed: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setTestingLogin(false)
    }
  }

  const handleClearAuth = () => {
    setAuth({ username: '', password: '', steamGuardToken: '' })
    showToast('Credentials cleared locally.', 'success')
    setClearConfirm(false)
  }

  const handleForceUpdate = () => {
    setConfirmUpdate(false)
    executeAction(SteamCmdService.update, setLoadingUpdate, 'SteamCMD update started.', 'Failed to start SteamCMD update')
  }

  const handleSyncBiKeys = () => {
    executeAction(WorkshopService.syncBiKeys, setSyncingBiKeys, 'BiKey re-sync task queued successfully.', 'Failed to queue BiKey re-sync task')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Platform Configuration</p>
      </div>

      <Tabs defaultValue="steam" className="w-full">
        <TabsList className="bg-surface-elevated/50 p-0.5 border border-border rounded-md mb-6 flex overflow-x-auto no-scrollbar w-full md:w-fit">
          <TabsTrigger value="steam" className="px-6 py-1.5 rounded-[4px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Steam</TabsTrigger>
          <TabsTrigger value="system" className="px-6 py-1.5 rounded-[4px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-widest">System</TabsTrigger>
        </TabsList>

        <TabsContent value="steam" className="space-y-6 outline-none">
          <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border bg-surface/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-md font-bold">Authentication</CardTitle>
                    <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Steam Network Identity
                    </CardDescription>
                  </div>
                  {sysInfo && (
                    <Badge variant={sysInfo.steam_authenticated ? "success" : "warning"} className="ml-4 text-[9px] uppercase tracking-widest px-2 py-0.5">
                      {sysInfo.steam_authenticated ? "Ready" : "Setup Required"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="qr" className="w-full">
                <div className="px-4 md:px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-2 bg-surface border border-border/50 p-1 rounded-lg h-10 min-w-0">
                    <TabsTrigger value="qr" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <QrCode className="w-3 h-3" />
                      QR Code
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <KeyRound className="w-3 h-3" />
                      Manual
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="qr" className="p-4 md:p-6 mt-0 outline-none">
                  <SteamQRAuthView />
                </TabsContent>

                <TabsContent value="manual" className="p-4 md:p-6 mt-0 outline-none">
                  <form onSubmit={handleSaveAuth} className="space-y-6">
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="steam-username" className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Username</label>
                        <Input 
                          id="steam-username"
                          value={auth.username} 
                          onChange={e => setAuth({...auth, username: e.target.value})}
                          placeholder="Steam username"
                          className="bg-surface border-border focus:border-primary/50 h-9 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="steam-password" className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Password</label>
                        <Input 
                          id="steam-password"
                          type="password"
                          value={auth.password} 
                          onChange={e => setAuth({...auth, password: e.target.value})}
                          placeholder="••••••••••••"
                          className="bg-surface border-border focus:border-primary/50 h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="steam-guardToken" className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Steam Guard Token</label>
                        <Input 
                          id="steam-guardToken"
                          value={auth.steamGuardToken} 
                          onChange={e => setAuth({...auth, steamGuardToken: e.target.value})}
                          placeholder="Enter 5-digit code"
                          className="bg-surface border-border focus:border-primary/50 h-9 font-mono tracking-widest uppercase text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-border gap-4 md:gap-0">
                      <div className="flex items-center gap-3 px-3 py-2 bg-accent/30 rounded-lg border border-border w-full md:max-w-sm">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-normal">
                          Required to securely download and update server content via SteamCMD.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
                        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive text-[10px] font-bold uppercase tracking-widest" onClick={() => setClearConfirm(true)}>
                          Reset
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] font-bold uppercase tracking-widest border-border" 
                          onClick={handleTestAuth}
                          disabled={testingLogin}
                        >
                          {testingLogin ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 mr-2" />}
                          Test
                        </Button>
                        <Button type="submit" size="sm" className="min-w-[140px] shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest">
                          <Save className="w-3.5 h-3.5 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border bg-surface/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-md font-bold">Service Maintenance</CardTitle>
                  <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Platform Management & Tools
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between bg-surface/50 p-5 rounded-lg border border-border gap-6 hover:border-primary/20 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Force Binary Update</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Triggers an immediate self-update of the SteamCMD utility.</p>
                </div>
                <Button 
                  onClick={() => setConfirmUpdate(true)} 
                  disabled={loadingUpdate}
                  variant="secondary"
                  size="sm"
                  className="h-9 w-full md:w-auto min-w-[140px] border border-border text-[10px] font-bold uppercase tracking-widest"
                >
                  {loadingUpdate ? 'Initializing...' : 'Force Update'}
                </Button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between bg-surface/50 p-5 rounded-lg border border-border gap-6 hover:border-primary/20 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Fix BiKey Extraction</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Re-scans all installed mods to extract and fix signature keys.</p>
                </div>
                <Button 
                  onClick={handleSyncBiKeys} 
                  disabled={syncingBiKeys}
                  variant="secondary"
                  size="sm"
                  className="h-9 w-full md:w-auto min-w-[140px] border border-border text-[10px] font-bold uppercase tracking-widest"
                >
                  {syncingBiKeys ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Wrench className="w-3.5 h-3.5 mr-2" />}
                  Fix BiKeys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 outline-none">
          <LogRetentionForm 
            settings={settings} 
            onSave={async (newSettings) => {
              setSettings(newSettings)
              await executeAction(() => SettingsService.updateSettings(newSettings), () => {}, 'Settings saved successfully.', 'Failed to save settings')
            }} 
          />
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear Steam Credentials"
        description="Are you sure you want to reset your Steam authentication data? You'll need to re-login to download content."
        onConfirm={handleClearAuth}
        confirmLabel="Reset Identity"
        variant="danger"
      />

      <ConfirmationDialog
        open={confirmUpdate}
        onOpenChange={setConfirmUpdate}
        title="Force SteamCMD Update?"
        description="This will trigger a binary self-update for the SteamCMD utility. Proceed?"
        onConfirm={handleForceUpdate}
        confirmLabel="Update Now"
        variant="danger"
      />

    </div>
  )
}
