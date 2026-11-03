package ws

import "testing"

func TestHubHasSubscribers(t *testing.T) {
	hub := NewHub()
	client := &Client{}

	if hub.HasSubscribers("system_info") {
		t.Fatal("a fresh hub has no subscribers")
	}

	hub.clients.Store(client, []Subscription{{Domain: "system_info"}})

	if !hub.HasSubscribers("system_info") {
		t.Error("expected a system_info subscriber")
	}
	if hub.HasSubscribers("server_status") {
		t.Error("another domain must not report the system_info subscription")
	}

	hub.handleUnsubscribe(clientUnsub{client: client, domain: "system_info"})
	if hub.HasSubscribers("system_info") {
		t.Error("expected no subscribers after unsubscribe")
	}
}
