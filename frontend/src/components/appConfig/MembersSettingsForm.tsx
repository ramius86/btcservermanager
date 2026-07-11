import React, { useState, useEffect } from 'react'
import { Users, Save, Info, Plus, X, Shield, Medal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { DiscordService } from '../../services/api'
import type { DiscordRole } from '../../services/api'

interface MembersSettings {
  memberRoleIds: string[]
  qualificationNames: string[]
}

interface MembersSettingsFormProps {
  settings: MembersSettings
  onSave: (settings: MembersSettings) => Promise<void>
}

export function MembersSettingsForm({ settings, onSave }: Readonly<MembersSettingsFormProps>) {
  const [localSettings, setLocalSettings] = useState<MembersSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [roles, setRoles] = useState<DiscordRole[]>([])
  
  const [selectedRole, setSelectedRole] = useState('')
  const [newQual, setNewQual] = useState('')

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    DiscordService.getRoles().then(setRoles).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(localSettings)
    } finally {
      setSaving(false)
    }
  }

  const addRole = () => {
    if (!selectedRole || localSettings.memberRoleIds.includes(selectedRole)) return
    setLocalSettings(prev => ({
      ...prev,
      memberRoleIds: [...prev.memberRoleIds, selectedRole]
    }))
    setSelectedRole('')
  }

  const removeRole = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      memberRoleIds: prev.memberRoleIds.filter(r => r !== id)
    }))
  }

  const addQual = () => {
    const q = newQual.trim()
    if (!q || localSettings.qualificationNames.includes(q)) return
    setLocalSettings(prev => ({
      ...prev,
      qualificationNames: [...prev.qualificationNames, q]
    }))
    setNewQual('')
  }

  const removeQual = (name: string) => {
    setLocalSettings(prev => ({
      ...prev,
      qualificationNames: prev.qualificationNames.filter(q => q !== name)
    }))
  }

  return (
    <Card className="border-border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-border bg-surface/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-md font-bold">Clan Members</CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Roles & Qualifications
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Clan Roles */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Discord Roles (Members)
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="flex h-10 w-full md:w-[300px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Select a role to add...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <Button 
                  type="button" 
                  onClick={addRole} 
                  disabled={!selectedRole}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-surface rounded-md border border-border">
              {localSettings.memberRoleIds.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No roles selected.</span>
              ) : (
                localSettings.memberRoleIds.map(id => {
                  const r = roles.find(role => role.id === id)
                  return (
                    <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-2 text-xs">
                      {r ? r.name : id}
                      <button
                        type="button"
                        onClick={() => removeRole(id)}
                        className="p-0.5 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })
              )}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Medal className="w-3 h-3" />
                Qualifications
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Medico, AT, Carrista..."
                  value={newQual}
                  onChange={(e) => setNewQual(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addQual()
                    }
                  }}
                  className="md:w-[300px]"
                />
                <Button 
                  type="button" 
                  onClick={addQual} 
                  disabled={!newQual.trim()}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-surface rounded-md border border-border">
              {localSettings.qualificationNames.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No qualifications defined.</span>
              ) : (
                localSettings.qualificationNames.map(q => (
                  <Badge key={q} variant="outline" className="pl-3 pr-1 py-1 flex items-center gap-2 text-xs border-primary/30 bg-primary/5 text-primary">
                    {q}
                    <button
                      type="button"
                      onClick={() => removeQual(q)}
                      className="p-0.5 hover:bg-primary/20 rounded-full transition-colors text-primary/70 hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 max-w-sm">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-normal">
                Removing a qualification name will also delete it from all members upon saving.
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
