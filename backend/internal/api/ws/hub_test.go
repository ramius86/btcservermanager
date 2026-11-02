package ws

import (
	"testing"
	"time"
)

func TestHub(t *testing.T) {
	t.Parallel()
	hub := NewHub()
	go hub.Run()
	defer hub.Stop()

	// Test Register
	client := &Client{hub: hub, send: make(chan Event, 64)}
	hub.register <- client

	// Wait a bit for registration to complete
	time.Sleep(20 * time.Millisecond)

	if _, ok := hub.clients.Load(client); !ok {
		t.Errorf("client was not registered")
	}

	// Test Unregister
	hub.Unregister(client)

	if _, ok := hub.clients.Load(client); ok {
		t.Errorf("client was not unregistered")
	}
}

func TestHubBroadcast(t *testing.T) {
	t.Parallel()
	hub := NewHub()
	go hub.Run()
	defer hub.Stop()

	client := &Client{hub: hub, send: make(chan Event, 64)}
	hub.register <- client

	time.Sleep(10 * time.Millisecond)

	// Subscribe to a domain to receive broadcasts
	hub.subscribe <- clientSub{
		client: client,
		sub: Subscription{
			Domain: "system_info",
		},
	}
	time.Sleep(10 * time.Millisecond)

	payload := map[string]any{"info": "test"}
	hub.Broadcast(string(EvtSystemInfo), payload)

	select {
	case received := <-client.send:
		if received.Type != EvtSystemInfo {
			t.Errorf("expected type %s, got %s", EvtSystemInfo, received.Type)
		}
	case <-time.After(100 * time.Millisecond):
		t.Errorf("broadcast message not received")
	}
}

// testTypedPayload is a typed struct implementing HasServerID,
// simulating what LogPayload and ReforgerStatsPayload do in the server domain.
type testTypedPayload struct {
	ServerID int64
	Message  string
}

func (p testTypedPayload) GetServerID() int64 { return p.ServerID }

// TestHubMatch_TypedStructPayload verifies that hub.match() correctly routes
// a struct implementing HasServerID to the right subscriber by server_id.
// This is a regression test for commit 59d2908 which replaced map[string]any
// with typed structs in broadcast payloads, breaking the match() type assertion.
func TestHubMatch_TypedStructPayload(t *testing.T) {
	t.Parallel()
	hub := NewHub()
	go hub.Run()
	defer hub.Stop()

	// Client subscribed to server_log for server ID 42
	client42 := &Client{hub: hub, send: make(chan Event, 64)}
	hub.register <- client42
	time.Sleep(10 * time.Millisecond)
	hub.subscribe <- clientSub{
		client: client42,
		sub:    Subscription{Domain: "server_log", ServerID: 42},
	}

	// Client subscribed to server_log for server ID 99
	client99 := &Client{hub: hub, send: make(chan Event, 64)}
	hub.register <- client99
	time.Sleep(10 * time.Millisecond)
	hub.subscribe <- clientSub{
		client: client99,
		sub:    Subscription{Domain: "server_log", ServerID: 99},
	}
	time.Sleep(10 * time.Millisecond)

	// Broadcast a typed struct payload for server 42
	hub.Broadcast(string(EvtServerLog), testTypedPayload{ServerID: 42, Message: "hello"})
	time.Sleep(50 * time.Millisecond)

	// client42 must receive it
	select {
	case event := <-client42.send:
		if event.Type != EvtServerLog {
			t.Errorf("client42: expected %s, got %s", EvtServerLog, event.Type)
		}
	default:
		t.Error("client42 did not receive the event for server 42")
	}

	// client99 must NOT receive it
	select {
	case <-client99.send:
		t.Error("client99 incorrectly received an event destined for server 42")
	default:
		// correct: no event
	}
}

// TestHubMatch_GenericSubscriber verifies that a subscriber with ServerID=0
// (no filter) receives typed struct payloads broadcast for any server.
func TestHubMatch_GenericSubscriber(t *testing.T) {
	t.Parallel()
	hub := NewHub()
	go hub.Run()
	defer hub.Stop()

	// Generic subscriber (no server filter)
	genericClient := &Client{hub: hub, send: make(chan Event, 64)}
	hub.register <- genericClient
	time.Sleep(10 * time.Millisecond)
	hub.subscribe <- clientSub{
		client: genericClient,
		sub:    Subscription{Domain: "server_log", ServerID: 0},
	}
	time.Sleep(10 * time.Millisecond)

	// Broadcast a typed payload with a specific server_id
	hub.Broadcast(string(EvtServerLog), testTypedPayload{ServerID: 7, Message: "specific"})
	time.Sleep(50 * time.Millisecond)

	// Generic subscriber (ServerID=0) should receive all server events
	select {
	case event := <-genericClient.send:
		if event.Type != EvtServerLog {
			t.Errorf("generic client: expected %s, got %s", EvtServerLog, event.Type)
		}
	default:
		t.Error("generic client (ServerID=0) should receive all server_log events")
	}
}

// TestHubStateChangeSurvivesFullBuffer verifies that a full outbound buffer
// costs a stale log line, not the connection: the state change is queued by
// evicting the oldest event, and the client stays registered.
func TestHubStateChangeSurvivesFullBuffer(t *testing.T) {
	t.Parallel()
	hub := NewHub()

	client := &Client{hub: hub, send: make(chan Event, 2)}
	hub.clients.Store(client, []Subscription{{Domain: "server_status"}})

	client.send <- Event{Type: EvtServerLog}
	client.send <- Event{Type: EvtServerLog}

	live := Event{Type: EvtServerStatus, Payload: map[string]any{"server_id": int64(1), "alive": true}}
	hub.sendToClient(client, live)

	if _, ok := hub.clients.Load(client); !ok {
		t.Fatal("a state change must not disconnect a client whose buffer was full")
	}

	var got []Event

	for {
		select {
		case ev := <-client.send:
			got = append(got, ev)
			continue
		default:
		}

		break
	}

	if len(got) != 2 {
		t.Fatalf("expected 2 queued events after eviction, got %d", len(got))
	}

	if got[len(got)-1].Type != EvtServerStatus {
		t.Fatalf("expected the state change last, got %s", got[len(got)-1].Type)
	}
}

// TestHubInitialStatusSkippedWhenLiveEventWins covers the ordering bug: the
// snapshot is computed off the hub loop, so a live event can be queued first.
// When that happens the snapshot must be dropped, not appended on top of it.
func TestHubInitialStatusSkippedWhenLiveEventWins(t *testing.T) {
	t.Parallel()
	hub := NewHub()

	release := make(chan struct{})
	hub.SetAllServerStatusesProvider(func() []map[string]any {
		<-release

		return []map[string]any{{"server_id": int64(1), "alive": false}}
	})

	client := &Client{hub: hub, send: make(chan Event, 8)}
	sub := Subscription{Domain: "server_status"}
	hub.clients.Store(client, []Subscription{sub})

	seq := client.domainDeliveries(sub.Domain).Load()

	go hub.sendInitialStatus(clientSub{client: client, sub: sub}, seq)

	// The live event arrives while the snapshot is still being computed.
	live := Event{Type: EvtServerStatus, Payload: map[string]any{"server_id": int64(1), "alive": true}}
	hub.sendToClient(client, live)
	close(release)

	time.Sleep(100 * time.Millisecond)

	var got []Event

	for {
		select {
		case ev := <-client.send:
			got = append(got, ev)
			continue
		default:
		}

		break
	}

	if len(got) != 1 {
		t.Fatalf("stale snapshot must be dropped, got %d events", len(got))
	}

	payload, ok := got[0].Payload.(map[string]any)
	if !ok {
		t.Fatalf("unexpected payload type %T", got[0].Payload)
	}

	if alive, _ := payload["alive"].(bool); !alive {
		t.Error("the live event must be the one left in the queue, not the snapshot")
	}
}

// TestHubInitialStatusDeliveredWhenNoLiveEvent is the companion case: without
// competing traffic the snapshot must still reach the client.
func TestHubInitialStatusDeliveredWhenNoLiveEvent(t *testing.T) {
	t.Parallel()
	hub := NewHub()

	hub.SetAllServerStatusesProvider(func() []map[string]any {
		return []map[string]any{{"server_id": int64(3), "alive": false}}
	})

	client := &Client{hub: hub, send: make(chan Event, 8)}
	sub := Subscription{Domain: "server_status"}
	hub.clients.Store(client, []Subscription{sub})

	seq := client.domainDeliveries(sub.Domain).Load()
	hub.sendInitialStatus(clientSub{client: client, sub: sub}, seq)

	select {
	case ev := <-client.send:
		if ev.Type != EvtServerStatus {
			t.Fatalf("expected %s, got %s", EvtServerStatus, ev.Type)
		}
	case <-time.After(100 * time.Millisecond):
		t.Fatal("snapshot was not delivered")
	}
}
