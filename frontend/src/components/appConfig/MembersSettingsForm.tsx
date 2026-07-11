import React, { useState, useEffect } from 'react'
import { Users, Save, Info, Plus, X, Shield, Medal, ChevronLeft, ChevronRight, Pencil, Snowflake, UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { DiscordService } from '../../services/api'
import type { DiscordRole, DiscordUser } from '../../services/api'

interface MembersSettings {
  memberRoleIds: string[]
  qualificationNames: string[]
  renames?: { oldName: string, newName: string }[]
}

interface MembersSettingsFormProps {
  settings: MembersSettings
  onSave: (settings: MembersSettings) => Promise<void>
}

export function MembersSettingsForm({ settings, onSave }: Readonly<MembersSettingsFormProps>) {
  const { showToast } = useToast()
  const [localSettings, setLocalSettings] = useState<MembersSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [roles, setRoles] = useState<DiscordRole[]>([])
  
  const [selectedRole, setSelectedRole] = useState('')
  const [newQual, setNewQual] = useState('')

  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [pendingRenames, setPendingRenames] = useState<{ oldName: string, newName: string }[]>([])

  const [frozenUsers, setFrozenUsers] = useState<DiscordUser[]>([])

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    DiscordService.getRoles().then(setRoles).catch(console.error)
    fetchFrozenUsers()
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...localSettings,
        renames: pendingRenames
      })
      setPendingRenames([])
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
    setPendingRenames(prev => prev.filter(r => r.newName !== name && r.oldName !== name))
  }

  const startRename = (index: number, value: string) => {
    setEditingIdx(index)
    setEditingValue(value)
  }

  const fetchFrozenUsers = () => {
    DiscordService.getUsers()
      .then(users => {
        setFrozenUsers(users.filter(u => !u.isActive))
      })
      .catch(console.error)
  }

  const reactivateUser = async (id: string, username: string) => {
    try {
      await DiscordService.setUserActive(id, true, username)
      showToast(`${username} reactivated successfully.`, 'success')
      fetchFrozenUsers()
    } catch (err: any) {
      showToast(`Failed to reactivate member: ${err.message}`, 'error')
    }
  }

  const saveRename = (index: number) => {
    const oldName = localSettings.qualificationNames[index]
    const newName = editingValue.trim()
    
    if (!newName || newName === oldName) {
      setEditingIdx(null)
      return
    }
    
    if (localSettings.qualificationNames.some((q, idx) => q === newName && idx !== index)) {
      setEditingIdx(null)
      return
    }

    setLocalSettings(prev => {
      const arr = [...prev.qualificationNames]
      arr[index] = newName
      return {
        ...prev,
        qualificationNames: arr
      }
    })

    setPendingRenames(prev => {
      const existingIdx = prev.findIndex(r => r.newName === oldName)
      if (existingIdx !== -1) {
        const updated = [...prev]
        if (updated[existingIdx].oldName === newName) {
          updated.splice(existingIdx, 1)
        } else {
          updated[existingIdx] = { ...updated[existingIdx], newName }
        }
        return updated
      }
      return [...prev, { oldName, newName }]
    })
    
    setEditingIdx(null)
  }

  const moveQual = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= localSettings.qualificationNames.length) return
    const newQuals = [...localSettings.qualificationNames]
    const temp = newQuals[index]
    newQuals[index] = newQuals[targetIndex]
    newQuals[targetIndex] = temp
    setLocalSettings(prev => ({
      ...prev,
      qualificationNames: newQuals
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
                localSettings.qualificationNames.map((q, idx) => (
                  <Badge key={q} variant="outline" className="pl-3 pr-2 py-1 flex items-center gap-2 text-xs border-primary/30 bg-primary/5 text-primary">
                    {editingIdx === idx ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => saveRename(idx)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            saveRename(idx)
                          } else if (e.key === 'Escape') {
                            setEditingIdx(null)
                          }
                        }}
                        className="bg-transparent border-b border-primary focus:outline-none w-[80px] text-xs text-primary"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span 
                          className="font-medium cursor-pointer hover:underline"
                          onDoubleClick={() => startRename(idx, q)}
                        >
                          {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => startRename(idx, q)}
                          className="p-0.5 hover:bg-primary/20 rounded transition-colors text-primary/70 hover:text-primary"
                          title="Rename"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <div className="flex items-center gap-0.5 border-l border-primary/20 pl-1.5 ml-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveQual(idx, -1)}
                          className="p-0.5 hover:bg-primary/20 rounded transition-colors text-primary/70 hover:text-primary"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < localSettings.qualificationNames.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveQual(idx, 1)}
                          className="p-0.5 hover:bg-primary/20 rounded transition-colors text-primary/70 hover:text-primary"
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeQual(q)}
                        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors text-primary/70 hover:text-primary ml-1"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Frozen Members */}
          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Snowflake className="w-3 h-3" />
                Frozen / Absent Members
              </label>
              <p className="text-[10px] text-muted-foreground italic ml-1">
                Members listed here are hidden from the active roster. Reactivate them to restore their active status.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-surface rounded-md border border-border">
              {frozenUsers.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No frozen members.</span>
              ) : (
                frozenUsers.map(u => (
                  <Badge 
                    key={u.id} 
                    variant="outline" 
                    className="pl-3 pr-2 py-1 flex items-center gap-2 text-xs border-destructive/20 bg-destructive/5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <span>{u.username}</span>
                    <button
                      type="button"
                      onClick={() => reactivateUser(u.id, u.username)}
                      className="p-0.5 hover:bg-destructive/20 rounded-full transition-colors ml-1"
                      title={`Reactivate ${u.username}`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
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
