package ws

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestHub_SubscriptionsAndStatus(t *testing.T) {
	hub := NewHub()

	hub.SetServerStatusProvider(func(serverID int64) bool {
		return serverID == 1
	})
	hub.SetSystemInfoProvider(func() any {
		return "system_ok"
	})

	go hub.Run()
	defer hub.Stop()

	// Wait for Run to start
	time.Sleep(10 * time.Millisecond)

	client := &Client{
		hub:  hub,
		send: make(chan Event, 10),
	}

	// Registration
	hub.register <- client
	time.Sleep(10 * time.Millisecond)

	// Subscribe to system_info
	hub.subscribe <- clientSub{
		client: client,
		sub: Subscription{
			Domain: "system_info",
		},
	}
	time.Sleep(10 * time.Millisecond)

	select {
	case evt := <-client.send:
		assert.Equal(t, EvtSystemInfo, evt.Type)
		assert.Equal(t, "system_ok", evt.Payload)
	case <-time.After(500 * time.Millisecond):
		t.Fatal("timeout waiting for initial system_info status")
	}

	// Subscribe to server_status
	hub.subscribe <- clientSub{
		client: client,
		sub: Subscription{
			Domain:   "server_status",
			ServerID: 1,
		},
	}
	time.Sleep(10 * time.Millisecond)

	select {
	case evt := <-client.send:
		assert.Equal(t, EvtServerStatus, evt.Type)
	case <-time.After(500 * time.Millisecond):
		t.Fatal("timeout waiting for initial server_status status")
	}

	// Unsubscribe
	hub.unsubscribe <- clientUnsub{
		client: client,
		domain: "system_info",
	}
	time.Sleep(10 * time.Millisecond)

	// Broadcast ignored
	hub.Broadcast(string(EvtSystemInfo), "ignored")
	time.Sleep(10 * time.Millisecond)

	select {
	case <-client.send:
		t.Fatal("received broadcast but should be unsubscribed")
	default:
	}

	// Test toInt64 json.Number
	jn := json.Number("100")
	assert.Equal(t, int64(100), toInt64(jn))
}
