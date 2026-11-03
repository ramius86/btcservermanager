package server

import (
	"context"
	"errors"
	"strings"
	"testing"
)

// AddHeadlessClient and RemoveHeadlessClient must honour their context instead
// of ignoring it: a request cancelled by the client must not still spawn (or
// kill) a headless client, while a live context keeps returning the real
// errors.
func TestHeadlessClientOperationsHonourCancelledContext(t *testing.T) {
	paths := &dummyPathProvider{tempDir: t.TempDir()}
	pm := NewProcessManager(paths, NewLauncher(paths, []string{}), false)

	cancelled, cancel := context.WithCancel(context.Background())
	cancel()

	t.Run("AddHeadlessClient", func(t *testing.T) {
		err := pm.AddHeadlessClient(cancelled, &Arma3Server{Server: Server{ID: 1}})
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("expected context.Canceled, got %v", err)
		}
		if _, ok := pm.headlessClients.Load(int64(1)); ok {
			t.Error("registered a headless client for a request that was already cancelled")
		}
	})

	t.Run("RemoveHeadlessClient", func(t *testing.T) {
		err := pm.RemoveHeadlessClient(cancelled, 1)
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("expected context.Canceled, got %v", err)
		}
	})

	t.Run("Live context keeps normal errors", func(t *testing.T) {
		if err := pm.AddHeadlessClient(context.Background(), &Arma3Server{Server: Server{ID: 2}}); !errors.Is(err, ErrServerNotRunning) {
			t.Errorf("expected ErrServerNotRunning, got %v", err)
		}

		err := pm.RemoveHeadlessClient(context.Background(), 2)
		if err == nil || !strings.Contains(err.Error(), "no headless clients") {
			t.Errorf("expected a no-headless-clients error, got %v", err)
		}
	})
}
