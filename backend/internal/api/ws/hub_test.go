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
