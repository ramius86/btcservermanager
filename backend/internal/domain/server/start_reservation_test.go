package server

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestProcessManager(t *testing.T) *ProcessManager {
	t.Helper()

	paths := &dummyPathProvider{tempDir: t.TempDir()}

	return NewProcessManager(paths, NewLauncher(paths, []string{}), false)
}

func TestReserveStartRejectsDuplicateAndConflictingPorts(t *testing.T) {
	pm := newTestProcessManager(t)

	require.NoError(t, pm.reserveStart(1, 2302, 2303))
	defer pm.releaseStart(1)

	// No process exists yet, but the start is in flight: a second one must be
	// refused instead of spawning a duplicate game server.
	assert.ErrorIs(t, pm.reserveStart(1, 2310, 2311), ErrServerAlreadyRunning)

	// The ports of an in-flight start are claimed too.
	assert.ErrorIs(t, pm.reserveStart(2, 2302, 2500), ErrPortConflict)
	assert.ErrorIs(t, pm.reserveStart(3, 2400, 2303), ErrPortConflict)

	require.NoError(t, pm.reserveStart(4, 2600, 2601))
	pm.releaseStart(4)
}

func TestReserveStartDoesNotSerialiseOtherServers(t *testing.T) {
	pm := newTestProcessManager(t)

	require.NoError(t, pm.reserveStart(1, 2302, 2303))
	defer pm.releaseStart(1)

	done := make(chan error, 1)
	go func() { done <- pm.reserveStart(2, 2400, 2401) }()

	select {
	case err := <-done:
		require.NoError(t, err)
		pm.releaseStart(2)
	case <-time.After(2 * time.Second):
		t.Fatal("a second start waited on the first: startMu is still held across the start")
	}
}

func TestReleaseStartAllowsRetry(t *testing.T) {
	pm := newTestProcessManager(t)

	require.NoError(t, pm.reserveStart(1, 2302, 2303))
	pm.releaseStart(1)

	// A failed start must not leave the server permanently unstartable.
	require.NoError(t, pm.reserveStart(1, 2302, 2303))
	pm.releaseStart(1)
}
