import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastProvider } from './components/ui/Toast'
import { WebSocketProvider } from './contexts/WebSocketContext'
import { ServerStatusProvider } from './contexts/ServerStatusContext'
import { SystemInfoProvider } from './contexts/SystemInfoContext'
import { SteamCmdProvider } from './contexts/SteamCmdContext'

// Lazy loaded pages
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ServersPage = lazy(() => import('./pages/ServersPage').then(m => ({ default: m.ServersPage })))
const ServerSettingsPage = lazy(() => import('./pages/ServerSettingsPage').then(m => ({ default: m.ServerSettingsPage })))
const ModsPage = lazy(() => import('./pages/ModsPage').then(m => ({ default: m.ModsPage })))
const ScenariosPage = lazy(() => import('./pages/ScenariosPage').then(m => ({ default: m.ScenariosPage })))
const LogExplorerPage = lazy(() => import('./pages/LogExplorerPage').then(m => ({ default: m.LogExplorerPage })))
const AppConfigPage = lazy(() => import('./pages/AppConfigPage').then(m => ({ default: m.AppConfigPage })))
const EventsPage = lazy(() => import('./pages/EventsPage').then(m => ({ default: m.EventsPage })))
const EventsStatsPage = lazy(() => import('./pages/EventsStatsPage').then(m => ({ default: m.EventsStatsPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Initialising Component...</span>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <ServerStatusProvider>
          <SystemInfoProvider>
            <SteamCmdProvider>
              <ToastProvider>
                <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/servers" element={<ServersPage />} />
                      <Route path="/servers/new" element={<ServerSettingsPage />} />
                      <Route path="/servers/new/:type" element={<ServerSettingsPage />} />
                      <Route path="/servers/:id" element={<ServerSettingsPage />} />
                      <Route path="/mods" element={<ModsPage />} />
                      <Route path="/scenarios" element={<ScenariosPage />} />
                      <Route path="/logs" element={<LogExplorerPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/events/stats" element={<EventsStatsPage />} />
                      <Route path="/config" element={<AppConfigPage />} />
                      <Route path="/settings" element={<Navigate to="/config" replace />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </ToastProvider>
            </SteamCmdProvider>
          </SystemInfoProvider>
        </ServerStatusProvider>
      </WebSocketProvider>
    </BrowserRouter>
  )
}
