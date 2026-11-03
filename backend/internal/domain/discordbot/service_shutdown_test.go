package discordbot

import (
	"testing"
	"time"
)

func TestCloseCancelsServiceContext(t *testing.T) {
	svc := NewUnconfigured(nil)
	if svc.ctx == nil {
		t.Fatal("expected a service context")
	}

	svc.Close()

	select {
	case <-svc.ctx.Done():
	case <-time.After(time.Second):
		t.Fatal("Close did not cancel the service context")
	}
}

func TestZeroValueServiceHasContextAndClosesSafely(t *testing.T) {
	svc := &Service{}

	if svc.baseContext() == nil {
		t.Fatal("expected a fallback context")
	}

	svc.Close()
}
