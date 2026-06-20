package ws

import (
	"testing"
)

func BenchmarkHub_Match(b *testing.B) {
	h := NewHub()
	sub := Subscription{
		Domain:   "server_status",
		ServerID: 1,
	}
	event := Event{
		Type: EvtServerStatus,
		Payload: map[string]any{
			"server_id": int64(1),
			"alive":     true,
		},
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_ = h.match(sub, event)
	}
}

func BenchmarkHub_BroadcastSmall(b *testing.B) {
	h := NewHub()
	// Mock 10 clients
	for i := 0; i < 10; i++ {
		c := &Client{send: make(chan Event, 10)}
		h.clients.Store(c, []Subscription{
			{Domain: "server_log", ServerID: 1},
		})
	}

	event := Event{
		Type: EvtServerLog,
		Payload: map[string]any{
			"server_id": int64(1),
			"message":   "Benchmark log message",
		},
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		h.clients.Range(func(key, value any) bool {
			client := key.(*Client)
			subs := value.([]Subscription)
			for _, sub := range subs {
				if h.match(sub, event) {
					// We don't actually send to avoid channel blocking in benchmark
					_ = client
				}
			}
			return true
		})
	}
}
