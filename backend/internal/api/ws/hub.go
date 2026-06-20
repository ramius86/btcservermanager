package ws

import (
	"encoding/json"
	"math"
	"sync"
)

// ServerIDProvider is implemented by typed broadcast payloads that carry a server ID.
// This allows hub.match() to extract the server_id without relying on map[string]any.
type ServerIDProvider interface {
	GetServerID() int64
}

type Hub struct {
	// Map of *Client to their slice of Subscription
	clients sync.Map

	// Inbound messages from the producers
	broadcast chan Event

	// Register requests from the clients
	register chan *Client

	// Subscription requests
	subscribe chan clientSub

	// Unsubscription requests
	unsubscribe chan clientUnsub

	statusProviderMu     sync.RWMutex
	serverStatusProvider func(serverID int64) bool
	systemInfoProvider   func() any

	stop chan struct{}
}

func NewHub() *Hub {
	return &Hub{
		broadcast:   make(chan Event, 512),
		register:    make(chan *Client, 64),
		subscribe:   make(chan clientSub, 64),
		unsubscribe: make(chan clientUnsub, 64),
		stop:        make(chan struct{}),
	}
}

func (h *Hub) SetServerStatusProvider(provider func(serverID int64) bool) {
	h.statusProviderMu.Lock()
	defer h.statusProviderMu.Unlock()
	h.serverStatusProvider = provider
}

func (h *Hub) SetSystemInfoProvider(provider func() any) {
	h.statusProviderMu.Lock()
	defer h.statusProviderMu.Unlock()
	h.systemInfoProvider = provider
}

func (h *Hub) Stop() {
	close(h.stop)
}

func (h *Hub) Unregister(client *Client) {
	if _, ok := h.clients.Load(client); ok {
		h.clients.Delete(client)
		client.close()
	}
}

func (h *Hub) sendToClient(client *Client, event Event) {
	defer func() {
		if recover() != nil {
			// send channel was closed — ensure client is removed from the map.
			// This covers the race where handleSubscribe re-adds a client
			// after Unregister already deleted it.
			h.Unregister(client)
		}
	}()

	select {
	case client.send <- event:
	default:
		if !isHighFrequencyEvent(event.Type) {
			h.Unregister(client)
		}
	}
}

func (h *Hub) Run() {
	for {
		select {
		case <-h.stop:
			h.handleStop()
			return

		case client := <-h.register:
			h.handleRegister(client)

		case sub := <-h.subscribe:
			h.handleSubscribe(sub)

		case unsub := <-h.unsubscribe:
			h.handleUnsubscribe(unsub)

		case event := <-h.broadcast:
			h.handleBroadcast(event)
		}
	}
}

func (h *Hub) handleStop() {
	h.clients.Range(func(key, value any) bool {
		if client, ok := key.(*Client); ok {
			client.close()
		}
		return true
	})
}

func (h *Hub) handleRegister(client *Client) {
	h.clients.Store(client, []Subscription{})
}

func (h *Hub) handleSubscribe(sub clientSub) {
	subs, ok := h.clients.Load(sub.client)
	if !ok {
		return
	}
	sList, okList := subs.([]Subscription)
	if !okList {
		return
	}

	for _, existing := range sList {
		if existing.Domain == sub.sub.Domain && existing.ServerID == sub.sub.ServerID {
			return
		}
	}

	h.clients.Store(sub.client, append(sList, sub.sub))

	go func() {
		select {
		case <-h.stop:
			return
		default:
			h.sendInitialStatus(sub)
		}
	}()
}

func (h *Hub) sendInitialStatus(sub clientSub) {
	h.statusProviderMu.RLock()
	provider := h.serverStatusProvider
	sysProvider := h.systemInfoProvider
	h.statusProviderMu.RUnlock()

	if sub.sub.Domain == "server_status" && provider != nil {
		alive := provider(sub.sub.ServerID)
		event := Event{
			Type: EvtServerStatus,
			Payload: map[string]any{
				"server_id": sub.sub.ServerID,
				"alive":     alive,
			},
		}
		h.sendToClient(sub.client, event)
	}

	if sub.sub.Domain == "system_info" && sysProvider != nil {
		info := sysProvider()
		event := Event{
			Type:    EvtSystemInfo,
			Payload: info,
		}
		h.sendToClient(sub.client, event)
	}
}

func (h *Hub) handleUnsubscribe(unsub clientUnsub) {
	subs, ok := h.clients.Load(unsub.client)
	if !ok {
		return
	}
	sList, okList := subs.([]Subscription)
	if !okList {
		return
	}

	newSList := make([]Subscription, 0, len(sList))
	for _, existing := range sList {
		if existing.Domain != unsub.domain || existing.ServerID != unsub.serverID {
			newSList = append(newSList, existing)
		}
	}

	h.clients.Store(unsub.client, newSList)
}

func (h *Hub) handleBroadcast(event Event) {
	h.clients.Range(func(key, value any) bool {
		client, okClient := key.(*Client)
		subs, okSubs := value.([]Subscription)
		if !okClient || !okSubs {
			return true
		}

		for _, sub := range subs {
			if h.match(sub, event) {
				h.sendToClient(client, event)
				break
			}
		}

		return true
	})
}

func (h *Hub) match(sub Subscription, event Event) bool {
	// Mapping EventType to Domain names
	var domain string

	switch event.Type {
	case EvtServerStatus:
		domain = "server_status"
	case EvtInstallProgress:
		domain = "install_progress"
	case EvtSystemInfo:
		domain = "system_info"
	case EvtSteamCmdLog:
		domain = "steamcmd_log"
	case EvtReforgerStats:
		domain = "reforger_stats"
	case EvtServerLog:
		domain = "server_log"
	case EvtServerUpdated:
		domain = "server_updated"
	case EvtReforgerScenariosUpdated:
		domain = "reforger_scenarios_updated"
	case EvtModMetadataUpdated:
		domain = "mod_metadata_updated"
	}

	if sub.Domain != domain {
		return false
	}

	// For domain-specific filtering like server_id
	if sub.ServerID != 0 {
		var payloadID int64

		var found bool

		// Try typed interface first (struct payloads like LogPayload, ReforgerStatsPayload)
		if provider, ok := event.Payload.(ServerIDProvider); ok {
			payloadID = provider.GetServerID()
			found = true
		} else if m, ok := event.Payload.(map[string]any); ok {
			// Fallback: map-based payloads (server_status, install_progress, etc.)
			id, foundId := m["server_id"]
			if !foundId {
				id, foundId = m["itemId"]
			}
			if foundId {
				payloadID = toInt64(id)
				found = true
			}
		}

		if !found {
			// If a filter is requested but we can't find an ID, don't send it.
			return false
		}

		return payloadID == sub.ServerID
	}

	return true
}

func toInt64(v any) int64 {
	switch val := v.(type) {
	case int64:
		return val
	case int:
		return int64(val)
	case int32:
		return int64(val)
	case uint64:
		return int64(val)
	case uint32:
		return int64(val)
	case float64:
		// Potential precision loss for values > 2^53
		if val > float64(math.MaxInt64) || val < float64(math.MinInt64) {
			return 0
		}
		return int64(val)
	case json.Number:
		i, err := val.Int64()
		if err == nil {
			return i
		}
		return 0
	}

	return 0
}

func (h *Hub) Broadcast(eventType string, payload any) {
	select {
	case <-h.stop:
		// hub is stopped, discard
	case h.broadcast <- Event{
		Type:    EventType(eventType),
		Payload: payload,
	}:
	}
}

func isHighFrequencyEvent(t EventType) bool {
	isHighFreq := t == EvtServerLog || t == EvtSteamCmdLog || t == EvtReforgerStats
	return isHighFreq
}
