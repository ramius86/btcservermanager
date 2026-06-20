/**
 * ServerSettingsPage.tsx (Orchestrator)
 * 
 * Purpose: Main entry point for server settings. Manages data fetching and saving.
 * 
 * Where to add logic:
 * - Logic for global data orchestration, API interaction, or redirection goes here.
 * - Does NOT contain game-specific UI; delegates to specific form components based on server.type.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ServerService, ScenarioService } from '../services/api'
import { useToast } from '../components/ui/Toast'
import { Badge } from '../components/ui/Badge'

import { getInitialState } from './ServerSettingsPage/constants'
import { Arma3SettingsForm } from '../components/servers/settings/arma3/Arma3SettingsForm'
import { DayZSettingsForm } from '../components/servers/settings/dayz/DayZSettingsForm'
import { ReforgerSettingsForm } from '../components/servers/settings/reforger/ReforgerSettingsForm'

export function ServerSettingsPage() {
  const { id, type: urlType } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [server, setServer] = useState<any>(getInitialState(urlType || 'ARMA3'))
  const [loading, setLoading] = useState(!!id)
  const isNew = !id

  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (id) {
      ServerService.get(Number(id)).then(data => {
        const d = data as any
        const missionHeaderStr = (d.type === 'REFORGER' && d.missionHeader) 
          ? JSON.stringify(d.missionHeader, null, 2) 
          : '';
        setServer({
          ...d,
          motd: d.motd || [],
          admins: d.admins || [],
          allowedLoadFileExtensions: d.allowedLoadFileExtensions || [],
          allowedPreprocessFileExtensions: d.allowedPreprocessFileExtensions || [],
          allowedHTMLLoadExtensions: d.allowedHTMLLoadExtensions || [],
          headlessClients: d.headlessClients || [],
          localClient: d.localClient || [],
          difficultySettings: d.difficultySettings || {},
          networkSettings: d.networkSettings || {},
          activeMods: d.activeMods || [],
          activeDLCs: d.activeDLCs || [],
          missions: d.missions || [],
          missionHeader: d.type === 'REFORGER' ? missionHeaderStr : d.missionHeader
        })
      }).finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    if (server.type === 'REFORGER') {
      ScenarioService.syncReforger().catch(console.error)
    }
  }, [server.type])

  useEffect(() => {
    if (server.type) {
      ServerService.getInstallation(server.type).then(inst => {
        setIsInstalled(inst.installationStatus === 'FINISHED')
      }).catch(() => {
        setIsInstalled(false)
      })
    }
  }, [server.type])

  const prepareReforgerPayload = (payload: any): boolean => {
    if (typeof payload.missionHeader === 'string') {
      const trimmed = payload.missionHeader.trim();
      if (trimmed === '') {
        payload.missionHeader = null;
      } else {
        try {
          payload.missionHeader = JSON.parse(trimmed);
        } catch (err: any) {
          showToast('Invalid Mission Header JSON: ' + err.message, 'error');
          return false;
        }
      }
    }
    return true;
  }

  const prepareArma3Payload = (payload: any) => {
    const parseDecimal = (val: any): number | null => {
      if (val === undefined || val === null || val === '') return null
      const num = Number(val)
      return Number.isNaN(num) ? null : num
    }

    payload.motdInterval = parseDecimal(payload.motdInterval)
    payload.voteThreshold = parseDecimal(payload.voteThreshold)

    if (payload.networkSettings) {
      payload.networkSettings.minErrorToSend = parseDecimal(payload.networkSettings.minErrorToSend)
      payload.networkSettings.minErrorToSendNear = parseDecimal(payload.networkSettings.minErrorToSendNear)
    }

    if (payload.difficultySettings) {
      payload.difficultySettings.skillAI = parseDecimal(payload.difficultySettings.skillAI)
      payload.difficultySettings.precisionAI = parseDecimal(payload.difficultySettings.precisionAI)
    }
  }

  const handleSave = async (e: React.SyntheticEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!server.name || server.name.trim() === '') {
      showToast('Instance Name is strictly required.', 'error')
      return
    }

    try {
      const payload = structuredClone(server)
      
      if (payload.type === 'REFORGER') {
        if (!prepareReforgerPayload(payload)) return;
      }

      if (payload.type === 'ARMA3') {
        prepareArma3Payload(payload);
      }

      await ServerService.save({ ...payload, id: id ? Number(id) : undefined })
      showToast(`Server ${isNew ? 'created' : 'updated'} successfully`, 'success')
      navigate('/servers')
    } catch (err: any) {
      showToast(err?.message || 'Failed to save server', 'error')
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading server data...</div>

  const renderForm = () => {
    switch (server.type) {
      case 'ARMA3':
        return <Arma3SettingsForm server={server} setServer={setServer} isInstalled={isInstalled} />
      case 'DAYZ':
      case 'DAYZ_EXP':
        return <DayZSettingsForm server={server} setServer={setServer} />
      case 'REFORGER':
        return <ReforgerSettingsForm server={server} setServer={setServer} isInstalled={isInstalled} />
      default:
        return <div className="p-8 text-center text-red-500">Unsupported server type: {server.type}</div>
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4 md:py-10 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/servers')}
          className="h-10 w-10 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground self-start"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {isNew ? 'Initialize Instance' : 'Instance Configuration'}
            </h1>
            <Badge variant="secondary" className="px-3 py-0.5 text-[10px] font-mono tracking-widest bg-primary/10 text-primary border-primary/20">
              {server.type}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {isNew ? 'Deploying a new tactical environment' : server.name || 'instance'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/servers')}
            className="flex-1 md:flex-none h-10 px-6 border-border bg-surface-elevated/50 hover:bg-surface text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
           >
             Cancel
           </Button>
           <Button type="submit" onClick={handleSave} className="flex-1 md:flex-none h-10 px-8 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px]">
             <Save className="w-4 h-4 mr-2" />
             {isNew ? 'Deploy Instance' : 'Save Data'}
           </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-8">
        {renderForm()}
      </form>
    </div>
  )
}
