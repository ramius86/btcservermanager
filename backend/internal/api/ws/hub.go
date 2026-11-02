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

	statusProviderMu          sync.RWMutex
	serverStatusProvider      func(serverID int64) bool
	allServerStatusesProvider func() []map[string]any
	systemInfoProvider        func() any

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

func (h *Hub) SetAllServerStatusesProvider(provider func() []map[string]any) {
	h.statusProviderMu.Lock()
	defer h.statusProviderMu.Unlock()
	h.allServerStatusesProvider = provider
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

	if h.enqueue(client, event, domainForEvent(event.Type)) == enqueueOverflow {
		h.Unregister(client)
	}
}

type enqueueResult int

const (
	enqueueOK enqueueResult = iota
	// enqueueDropped means the event was discarded on purpose (high-frequency
	// traffic while the buffer is full). The client stays connected.
	enqueueDropped
	// enqueueOverflow means the client could not accept a state change even
	// after stale traffic was evicted: it is disconnected so that it can
	// reconnect and resubscribe instead of being fed stale state forever.
	enqueueOverflow
)

// enqueue places event in the client's outbound buffer. The hub loop is
// single-threaded and must never block on a slow peer, so every write is
// non-blocking: high-frequency events (logs, stats) are dropped when the
// buffer is full, while a state change evicts the oldest queued event rather
// than being lost or costing the client its connection.
func (h *Hub) enqueue(client *Client, event Event, domain string) enqueueResult {
	client.sendMu.Lock()
	defer client.sendMu.Unlock()

	select {
	case client.send <- event:
		client.domainDeliveries(domain).Add(1)
		return enqueueOK
	default:
	}

	if isHighFrequencyEvent(event.Type) {
		return enqueueDropped
	}

	// Make room by discarding the oldest queued event: during a log burst the
	// head of the queue is stale telemetry, not the state change we are about
	// to deliver.
	select {
	case <-client.send:
	default:
	}

	select {
	case client.send <- event:
		client.domainDeliveries(domain).Add(1)
		return enqueueOK
	default:
		return enqueueOverflow
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

	client := sub.client
	domain := sub.sub.Domain

	h.clients.Store(client, append(sList, sub.sub))

	// Capture the counter before computing the snapshot: if a live event for
	// the same domain is queued in the meantime it is newer than the snapshot,
	// which is then dropped instead of overwriting it.
	seq := client.domainDeliveries(domain).Load()

	go func() {
		select {
		case <-h.stop:
			return
		default:
			h.sendInitialStatus(sub, seq)
		}
	}()
}

func (h *Hub) sendInitialStatus(sub clientSub, seq uint64) {
	domain := sub.sub.Domain

	h.statusProviderMu.RLock()
	provider := h.serverStatusProvider
	allProvider := h.allServerStatusesProvider
	sysProvider := h.systemInfoProvider
	h.statusProviderMu.RUnlock()

	var events []Event

	switch domain {
	case "server_status":
		if sub.sub.ServerID == 0 && allProvider != nil {
			for _, payload := range allProvider() {
				events = append(events, Event{
					Type:    EvtServerStatus,
					Payload: payload,
				})
			}
		} else if sub.sub.ServerID != 0 && provider != nil {
			events = append(events, Event{
				Type: EvtServerStatus,
				Payload: map[string]any{
					"server_id": sub.sub.ServerID,
					"alive":     provider(sub.sub.ServerID),
				},
			})
		}
	case "system_info":
		if sysProvider != nil {
			events = append(events, Event{
				Type:    EvtSystemInfo,
				Payload: sysProvider(),
			})
		}
	}

	if len(events) == 0 {
		return
	}

	h.deliverSnapshot(sub.client, domain, seq, events)
}

// deliverSnapshot queues a computed snapshot only if no live event for the
// same domain was queued since the subscription. enqueue and deliverSnapshot
// both hold sendMu, so the check and the writes cannot interleave with a
// broadcast that would make the snapshot stale.
func (h *Hub) deliverSnapshot(client *Client, domain string, seq uint64, events []Event) {
	client.sendMu.Lock()
	defer client.sendMu.Unlock()

	if client.domainDeliveries(domain).Load() != seq {
		return
	}

	for _, event := range events {
		select {
		case client.send <- event:
			client.domainDeliveries(domain).Add(1)
		default:
			// A snapshot is best effort: do not evict live events for it.
			return
		}
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

// domainForEvent maps an event type to the subscription domain it belongs to.
// It is shared by match() and by the per-domain delivery counters.
func domainForEvent(t EventType) string {
	switch t {
	case EvtServerStatus:
		return "server_status"
	case EvtInstallProgress:
		return "install_progress"
	case EvtSystemInfo:
		return "system_info"
	case EvtSteamCmdLog:
		return "steamcmd_log"
	case EvtReforgerStats:
		return "reforger_stats"
	case EvtServerLog:
		return "server_log"
	case EvtServerUpdated:
		return "server_updated"
	case EvtReforgerScenariosUpdated:
		return "reforger_scenarios_updated"
	case EvtModMetadataUpdated:
		return "mod_metadata_updated"
	case EvtModDeleted:
		return "mod_deleted"
	case EvtDiscordEventRsvpUpdated:
		return "discord_event_rsvp_updated"
	case EvtDiscordEventUpdated:
		return "discord_event_updated"
	case EvtModSignatureProgress:
		return "mod_signature_progress"
	case EvtModSignatureChecked:
		return "mod_signature_checked"
	}

	return ""
}

func (h *Hub) match(sub Subscription, event Event) bool {
	if sub.Domain != domainForEvent(event.Type) {
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
	evt := Event{
		Type:    EventType(eventType),
		Payload: payload,
	}

	if isHighFrequencyEvent(evt.Type) {
		select {
		case <-h.stop:
			// hub is stopped, discard
		case h.broadcast <- evt:
		default:
			// High-frequency event dropped when channel is full to prevent backpressure
		}
		return
	}

	select {
	case <-h.stop:
		// hub is stopped, discard
	case h.broadcast <- evt:
	}
}

func isHighFrequencyEvent(t EventType) bool {
	isHighFreq := t == EvtServerLog || t == EvtSteamCmdLog || t == EvtReforgerStats
	return isHighFreq
}
