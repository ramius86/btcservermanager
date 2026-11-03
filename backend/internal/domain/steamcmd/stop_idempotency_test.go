package steamcmd

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

// Stop is a public lifecycle method: closing an already closed channel used to
// panic, so a second call (tests, a future shutdown path) crashed the process.
func TestServiceStopIsIdempotent(t *testing.T) {
	s := &Service{stopCh: make(chan struct{})}

	assert.NotPanics(t, func() {
		s.Stop()
		s.Stop()
	})
}

func TestExecutorStopIsIdempotent(t *testing.T) {
	e := &Executor{stopCh: make(chan struct{}), cancel: func() {}}

	assert.NotPanics(t, func() {
		e.Stop()
		e.Stop()
	})
}
