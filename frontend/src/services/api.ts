import { ServerInstanceInfoDto, CreatorDlcDto, AnyServerDto, ServerInstallationDto } from '../dtos/ServerDto'
import { ModDto, ModPresetDto, SteamCmdItemInfoDto, WorkshopResponseDto } from '../dtos/ModDto'


const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function fetchApi(path: string, options: RequestInit = {}) {
  // Add cache-busting timestamp to all GET requests
  let finalPath = path
  if (!options.method || options.method.toUpperCase() === 'GET') {
    const separator = path.includes('?') ? '&' : '?'
    finalPath = `${path}${separator}_t=${Date.now()}`
  }

  const res = await fetch(`${API_BASE}${finalPath}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(`API Error: ${res.status} ${res.statusText} ${errorBody}`)
  }
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const ServerService = {
  getAll: (): Promise<AnyServerDto[]> => fetchApi('/server'),
  get: (id: number): Promise<AnyServerDto> => fetchApi(`/server/${id}`),
  save: (server: AnyServerDto): Promise<AnyServerDto> => {
    if (server.id) {
      return fetchApi(`/server/${server.id}`, { method: 'PUT', body: JSON.stringify(server) })
    }
    return fetchApi('/server', { method: 'POST', body: JSON.stringify(server) })
  },
  delete: (id: number): Promise<void> => fetchApi(`/server/${id}`, { method: 'DELETE' }),
  getStatus: (id: number): Promise<ServerInstanceInfoDto | null> => fetchApi(`/server/${id}/status`),
  getStatuses: (): Promise<Record<number, ServerInstanceInfoDto>> => fetchApi('/server/statuses'),
  start: (id: number): Promise<void> => fetchApi(`/server/${id}/start`, { method: 'POST' }),
  stop: (id: number): Promise<void> => fetchApi(`/server/${id}/stop`, { method: 'POST' }),
  restart: (id: number): Promise<void> => fetchApi(`/server/${id}/restart`, { method: 'POST' }),
  updateAutoRestart: (id: number, enabled: boolean, time: string | null): Promise<void> => 
    fetchApi(`/server/${id}/autorestart`, { 
      method: 'PATCH', 
      body: JSON.stringify({ enabled, time }) 
    }),
  addHeadlessClient: (id: number): Promise<void> => fetchApi(`/server/${id}/hc/start`, { method: 'POST' }),
  removeHeadlessClient: (id: number): Promise<void> => fetchApi(`/server/${id}/hc/stop`, { method: 'DELETE' }),
  reorder: (payload: { id: number; sortOrder: number }[]): Promise<void> =>
    fetchApi('/server/reorder', { method: 'PUT', body: JSON.stringify(payload) }),
  getConfigs: (id: number): Promise<Record<string, string>> => fetchApi(`/server/${id}/configs`),
  getReforgerSaves: (id: number): Promise<any[]> => fetchApi(`/server/${id}/reforger/saves`),
  deleteReforgerSave: (id: number, name?: string): Promise<void> => {
    const query = name ? '?name=' + encodeURIComponent(name) : ''
    return fetchApi(`/server/${id}/reforger/saves${query}`, { method: 'DELETE' })
  },
  getCustomNames: (id: number): Promise<Record<string, { playerName: string, customName: string }>> => fetchApi(`/server/${id}/reforger/custom-names`),
  updateCustomNames: (id: number, data: Record<string, { playerName: string, customName: string }>): Promise<void> => fetchApi(`/server/${id}/reforger/custom-names`, { method: 'PUT', body: JSON.stringify(data) }),
  
  getInstallations: (): Promise<ServerInstallationDto[]> => fetchApi('/server/installation'),
  getInstallation: (type: string): Promise<ServerInstallationDto> => fetchApi(`/server/installation/${type}`),
  installOrUpdate: (type: string): Promise<void> => fetchApi(`/server/installation/${type}`, { method: 'POST' }),
  setBranch: (type: string, branch: string): Promise<void> => 
    fetchApi(`/server/installation/${type}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ branch }) 
    }),
  uninstall: (type: string): Promise<void> => fetchApi(`/server/installation/${type}`, { method: 'DELETE' }),
}

export const WorkshopService = {
  getAll: (filter?: string): Promise<WorkshopResponseDto> => fetchApi(filter ? `/mod?filter=${filter}` : `/mod`),
  getUpdateStatus: (): Promise<{ hasUpdates: boolean }> => fetchApi(`/mod/needs-update`),
  get: (id: number): Promise<ModDto> => fetchApi(`/mod/${id}`),
  install: (mods: ModDto[]): Promise<void> => fetchApi(`/mod`, { method: 'POST', body: JSON.stringify(mods) }),
  delete: (id: number, filter?: string): Promise<void> => fetchApi(filter ? `/mod/${id}?serverType=${filter}` : `/mod/${id}`, { method: 'DELETE' }),
  uninstallMultiple: (ids: number[]): Promise<void> => fetchApi(`/mod?modIds=${ids.join(',')}`, { method: 'DELETE' }),
  setServerOnly: (id: number, serverOnly: boolean): Promise<void> => 
    fetchApi(`/mod/${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ serverOnly }) 
    }),
  updateAll: (): Promise<void> => fetchApi(`/mod/update`, { method: 'POST' }),
  syncBiKeys: (): Promise<void> => fetchApi(`/mod/sync-bikeys`, { method: 'POST' }),
  getCreatorDlcs: (): Promise<CreatorDlcDto[]> => fetchApi(`/mod/cdlc`),
  importFromHtml: (file: File, filter: string): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('serverType', filter)
    return fetch(`${API_BASE}/mod/preset/import`, { method: 'POST', body: formData }).then(() => undefined)
  },
  searchSteamMods: (query: string, appId: number, page: number = 1): Promise<{ mods: ModDto[], total: number }> => 
    fetchApi(`/mod/steam/search?q=${encodeURIComponent(query)}&appId=${appId}&page=${page}`),
  searchReforgerMods: (query: string, page: number = 1): Promise<any> => fetchApi(`/reforger/workshop/search?q=${encodeURIComponent(query)}&page=${page}`),
  getReforgerModDetails: (id: string): Promise<any> => fetchApi(`/reforger/workshop/${id}`),
}

export const ScenarioService = {
  getArma3: (): Promise<any[]> => fetchApi('/scenarios/arma3').then(res => res?.scenarios || []),
  deleteArma3: (name: string): Promise<void> => fetchApi(`/scenarios/arma3/${name}`, { method: 'DELETE' }),
  getReforger: (serverId?: number): Promise<any[]> => fetchApi(serverId ? `/scenarios/reforger?serverId=${serverId}` : `/scenarios/reforger`).then(res => res?.scenarios || []),
  uploadArma3: (files: FileList | File[]): Promise<Response> => {
    const formData = new FormData()
    for (const file of Array.from(files)) {
      formData.append('file', file)
    }
    return fetch(`${API_BASE}/scenarios/arma3`, {
      method: 'POST',
      body: formData,
    })
  },
  fetchReforgerModScenarios: (modId: string): Promise<any[]> => fetchApi(`/scenarios/reforger/workshop/mod/${modId}/fetch`, { method: 'POST' }),
  syncReforger: (): Promise<void> => fetchApi('/scenarios/reforger/sync', { method: 'POST' }),
}

export const ModPresetService = {
  getAll: (filter?: string): Promise<ModPresetDto[]> => fetchApi(filter ? `/mod/preset?filter=${filter}` : `/mod/preset`),
  get: (id: number): Promise<ModPresetDto> => fetchApi(`/mod/preset/${id}`),
  create: (preset: any): Promise<ModPresetDto> => fetchApi('/mod/preset', { method: 'POST', body: JSON.stringify(preset) }),
  save: (preset: ModPresetDto): Promise<ModPresetDto> => fetchApi(preset.id ? `/mod/preset/${preset.id}` : '/mod/preset', {
    method: preset.id ? 'PUT' : 'POST',
    body: JSON.stringify(preset)
  }),
  updateMods: (id: number, modIds: number[]): Promise<void> => fetchApi(`/mod/preset/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify({ id, mods: modIds.map(mid => ({ id: mid })) }) 
  }),
  delete: (id: number): Promise<void> => fetchApi(`/mod/preset/${id}`, { method: 'DELETE' }),
  import: (formData: FormData): Promise<ModPresetDto> => fetch(`${API_BASE}/mod/preset/import`, { method: 'POST', body: formData }).then(res => res.json()),
  export: async (id: number): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/mod/preset/${id}/export`)
    if (!res.ok) throw new Error('Failed to export')
    return res.blob()
  },
}

export const SteamCmdService = {
  getStatus: (): Promise<Record<string, SteamCmdItemInfoDto>> => fetchApi('/steamcmd'),
  getLog: (count = 100): Promise<{ content: string }> => fetchApi(`/steamcmd/log?count=${count}`),
  update: (): Promise<void> => fetchApi('/steamcmd/update', { method: 'POST' }),
  beginQr: (): Promise<any> => fetchApi('/config/auth/qr/begin', { method: 'POST' }),
  pollQr: (clientId: string, requestId: string): Promise<any> => fetchApi('/config/auth/qr/poll', { method: 'POST', body: JSON.stringify({ client_id: clientId, request_id: requestId }) }),
  login: (credentials: any): Promise<any> => fetchApi('/config/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  testLogin: (credentials: any): Promise<{ success: boolean, error?: string }> => fetchApi('/config/auth/test', { method: 'POST', body: JSON.stringify(credentials) }),
  getAuthStatus: (): Promise<any> => fetchApi('/config/auth/status'),
}

export const LogService = {
  getServerLog: (filename: string, offset = 0, lines = 1000): Promise<any> => fetchApi(`/logs/content/${encodeURIComponent(filename)}?offset=${offset}&lines=${lines}`),
  getServerStats: (id: number, filename: string): Promise<any[]> => fetchApi(`/logs/servers/${id}/stats?filename=${filename}`),
  listServerLogs: (id: number | 'all' = 'all'): Promise<string[]> => fetchApi(`/logs/servers/${id}`),
  listSteamCmdLogs: (): Promise<any[]> => fetchApi('/logs/steamcmd'),
  getSteamCmdLog: (filename: string, offset = 0, lines = 1000): Promise<any> => fetchApi(`/logs/steamcmd/${filename}?offset=${offset}&lines=${lines}`),
  deleteLog: (filename: string): Promise<void> => fetchApi(`/logs/${encodeURIComponent(filename)}`, { method: 'DELETE' }),
  deleteAllLogs: (type: 'server' | 'steamcmd'): Promise<void> => fetchApi(`/logs/all?type=${type}`, { method: 'DELETE' }),
  download: (filename: string): string => `${API_BASE}/logs/download/${filename}`,
}

export const SystemService = {
  getInfo: (): Promise<any> => fetchApi('/system/info'),
  getSettings: (): Promise<any> => fetchApi('/settings'),
  updateSettings: (settings: any): Promise<any> => fetchApi('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
}

export const SettingsService = SystemService

export interface CBAPresetDto {
  id?: number
  name: string
  content: string
  createdAt?: string
  updatedAt?: string
}

export const CBAPresetService = {
  getAll: (): Promise<CBAPresetDto[]> => fetchApi('/configs/cba-presets'),
  get: (id: number): Promise<CBAPresetDto> => fetchApi(`/configs/cba-presets/${id}`),
  save: (preset: CBAPresetDto): Promise<CBAPresetDto> => {
    if (preset.id) {
      return fetchApi(`/configs/cba-presets/${preset.id}`, { method: 'PUT', body: JSON.stringify(preset) })
    }
    return fetchApi('/configs/cba-presets', { method: 'POST', body: JSON.stringify(preset) })
  },
  delete: (id: number): Promise<void> => fetchApi(`/configs/cba-presets/${id}`, { method: 'DELETE' }),
}

export interface DiscordChannel {
	id: string
	name: string
}

export interface DiscordRole {
	id: string
	name: string
}

export interface DiscordEvent {
	id: number
	channelId: string
	messageId: string
	title: string
	dateTime: string
	gameType: string
	createdAt: string
}

export interface DiscordEventDetail extends DiscordEvent {
	going: string[]
	notGoing: string[]
	maybe: string[]
	noResponse: string[]
}

export interface CreateDiscordEventRequest {
	title: string
	dateTime: string
	gameType: string
	channelId: string
	imageBase64?: string
	mentions?: string
}

export interface UpdateDiscordEventRequest {
	title: string
	dateTime: string
	gameType: string
}

export interface DiscordRawAttendance {
	userId: string
	username: string
	status: string
	dateTime: string
	gameType: string
}

export interface DiscordUser {
	id: string
	username: string
	isActive: boolean
	updatedAt: string
}

export interface DiscordGuildMember {
	id: string
	username: string
	displayName: string
}

export const DiscordService = {
	getStatus: (): Promise<{ connected: boolean, configured: boolean }> => fetchApi('/discord/status'),
	getChannels: (): Promise<DiscordChannel[]> => fetchApi('/discord/channels'),
	getRoles: (): Promise<DiscordRole[]> => fetchApi('/discord/roles'),
	getEvents: (): Promise<DiscordEvent[]> => fetchApi('/discord/events'),
	getAttendanceStats: (): Promise<DiscordRawAttendance[]> => fetchApi('/discord/events/stats'),
	getEventDetail: (id: number): Promise<DiscordEventDetail> => fetchApi(`/discord/events/${id}`),
	createEvent: (data: CreateDiscordEventRequest): Promise<DiscordEvent> => fetchApi('/discord/events', { method: 'POST', body: JSON.stringify(data) }),
	updateEvent: (id: number, data: UpdateDiscordEventRequest): Promise<DiscordEvent> => fetchApi(`/discord/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
	deleteEvent: (id: number): Promise<void> => fetchApi(`/discord/events/${id}`, { method: 'DELETE' }),
	getUsers: (): Promise<DiscordUser[]> => fetchApi('/discord/users'),
	setUserActive: (id: string, active: boolean): Promise<void> => fetchApi(`/discord/users/${id}/active`, { method: 'PATCH', body: JSON.stringify({ active }) }),
	deleteUser: (id: string): Promise<void> => fetchApi(`/discord/users/${id}`, { method: 'DELETE' }),
	getGuildMembers: (): Promise<DiscordGuildMember[]> => fetchApi('/discord/members'),
	updateEventParticipation: (eventId: number, data: { userId: string, username: string, status: string }): Promise<void> => fetchApi(`/discord/events/${eventId}/participants`, { method: 'PUT', body: JSON.stringify(data) }),
}

