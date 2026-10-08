import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export type EventType = 'server_status' | 'install_progress' | 'system_info' | 'steamcmd_log' | 'reforger_stats' | 'server_log' | 'server_updated' | 'mod_metadata_updated' | 'reforger_scenarios_updated' | 'mod_deleted' | 'heartbeat'

export interface WSEvent {
  type: EventType
  payload: any
}

interface WebSocketContextType {
  subscribe: (type: EventType, cb: (e: WSEvent) => void, serverId?: number) => () => void
  send: (msg: any) => void
  isConnected: boolean
  onReconnect: (cb: () => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const isMountedRef = useRef(true)
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const listeners = useRef<Map<string, Set<(e: WSEvent) => void>>>(new Map())
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectDelay = useRef(1000)
  const messageQueue = useRef<any[]>([])
  const reconnectCallbacks = useRef<Set<() => void>>(new Set())
  const hasConnectedOnce = useRef(false)
  const watchdogTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetWatchdog = () => {
    if (watchdogTimeout.current) clearTimeout(watchdogTimeout.current)
    watchdogTimeout.current = setTimeout(() => {
      console.warn('WebSocket watchdog timed out (70s of inactivity), closing zombie connection')
      if (ws.current) {
        ws.current.close()
      }
    }, 70000)
  }

  const connect = () => {
    if (ws.current) ws.current.close()

    const protocol = globalThis.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = globalThis.location.host
    const socket = new WebSocket(`${protocol}//${host}/api/ws`)

    socket.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
      reconnectDelay.current = 1000
      resetWatchdog()

      const isReconnect = hasConnectedOnce.current
      hasConnectedOnce.current = true

      // Flush non-subscribe message queue (active listeners are registered below)
      messageQueue.current
        .filter(msg => msg.type !== 'subscribe')
        .forEach(msg => {
          socket.send(JSON.stringify(msg))
        })
      messageQueue.current = []

      // Re-subscribe all active listeners so the new backend connection registers them
      listeners.current.forEach((_, key) => {
        const [domain, serverIdStr] = key.split(':')
        const serverId = serverIdStr && serverIdStr !== '0' ? parseInt(serverIdStr, 10) : undefined
        socket.send(JSON.stringify({
          type: 'subscribe',
          payload: {
            domain,
            server_id: serverId,
          },
        }))
      })

      if (isReconnect) {
        console.log('WebSocket reconnected, triggering registered resync callbacks')
        reconnectCallbacks.current.forEach(cb => {
          try {
            cb()
          } catch (err) {
            console.error('Error executing onReconnect callback', err)
          }
        })
      }
    }

    socket.onmessage = (e) => {
      resetWatchdog()
      try {
        const event: WSEvent = JSON.parse(e.data)
        
        // Heartbeat events keep the connection alive; no listener dispatch needed
        if (event.type === 'heartbeat') {
          return
        }

        // Extract server_id if present in payload to match listener key
        const serverId = event.payload?.server_id || event.payload?.itemId
        const specificKey = `${event.type}:${serverId || 0}`
        const genericKey = `${event.type}:0`

        // Dispatch to specific listeners first
        listeners.current.get(specificKey)?.forEach(cb => cb(event))
        
        // Then generic if different
        if (specificKey !== genericKey) {
          listeners.current.get(genericKey)?.forEach(cb => cb(event))
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err)
      }
    }

    socket.onclose = () => {
      if (watchdogTimeout.current) clearTimeout(watchdogTimeout.current)
      if (!isMountedRef.current || !ws.current || ws.current !== socket) return;
      console.log('WebSocket disconnected')
      setIsConnected(false)
      scheduleReconnect()
    }

    socket.onerror = (err) => {
      console.error('WebSocket error', err)
      socket.close()
    }

    ws.current = socket
  }

  const scheduleReconnect = () => {
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
    reconnectTimeout.current = setTimeout(() => {
      connect()
      reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000)
    }, reconnectDelay.current)
  }

  useEffect(() => {
    connect()
    return () => {
      isMountedRef.current = false
      if (watchdogTimeout.current) clearTimeout(watchdogTimeout.current)
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      if (ws.current) {
        const socket = ws.current
        ws.current = null
        socket.close()
      }
    }
  }, [])

  const send = React.useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg))
    } else {
      messageQueue.current.push(msg)
    }
  }, [])

  const onReconnect = React.useCallback((cb: () => void) => {
    reconnectCallbacks.current.add(cb)
    return () => {
      reconnectCallbacks.current.delete(cb)
    }
  }, [])

  const subscribe = React.useCallback((type: EventType, cb: (e: WSEvent) => void, serverId?: number) => {
    const key = `${type}:${serverId || 0}`
    
    if (!listeners.current.has(key)) {
      listeners.current.set(key, new Set())
      
      // Notify backend ONLY if this is the first listener for this specific (type, serverId)
      send({ 
        type: 'subscribe', 
        payload: { 
          domain: type,
          server_id: serverId 
        } 
      })
    }
    
    listeners.current.get(key)!.add(cb)
    
    return () => {
      const typeListeners = listeners.current.get(key)
      if (typeListeners) {
        typeListeners.delete(cb)
        if (typeListeners.size === 0) {
          listeners.current.delete(key)
          send({ 
            type: 'unsubscribe', 
            payload: { 
              domain: type,
              server_id: serverId
            } 
          })
        }
      }
    }
  }, [send])

  const value = React.useMemo(() => ({ subscribe, send, isConnected, onReconnect }), [subscribe, send, isConnected, onReconnect])

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) throw new Error('useWebSocket must be used within WebSocketProvider')
  return context
}
