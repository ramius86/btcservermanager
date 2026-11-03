package system

import "testing"

type plainBroadcaster struct {
	calls int
}

func (b *plainBroadcaster) Broadcast(string, any) {
	b.calls++
}

type awareBroadcaster struct {
	plainBroadcaster
	subscribed string
}

func (b *awareBroadcaster) HasSubscribers(domain string) bool {
	return domain == b.subscribed
}

func TestShouldCollectSystemInfo(t *testing.T) {
	tests := []struct {
		name        string
		broadcaster Broadcaster
		want        bool
	}{
		{"no broadcaster", nil, false},
		{"broadcaster that cannot answer", &plainBroadcaster{}, true},
		{"system_info subscribed", &awareBroadcaster{subscribed: "system_info"}, true},
		{"only another domain subscribed", &awareBroadcaster{subscribed: "server_status"}, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := shouldCollectSystemInfo(tt.broadcaster); got != tt.want {
				t.Errorf("shouldCollectSystemInfo() = %v, want %v", got, tt.want)
			}
		})
	}
}
