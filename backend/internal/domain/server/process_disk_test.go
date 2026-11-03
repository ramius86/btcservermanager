package server

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newDiskTestManager(t *testing.T) *ProcessManager {
	t.Helper()

	paths := &dummyPathProvider{tempDir: t.TempDir()}

	return NewProcessManager(paths, NewLauncher(paths, []string{}), false)
}

func TestProcessManager_CheckDiskSpace(t *testing.T) {
	t.Run("no probe does not block", func(t *testing.T) {
		pm := newDiskTestManager(t)
		require.NoError(t, pm.checkDiskSpace())
	})

	t.Run("unknown total does not block", func(t *testing.T) {
		pm := newDiskTestManager(t)
		pm.SetDiskSpaceProbe(func() (uint64, uint64) { return 0, 0 })
		require.NoError(t, pm.checkDiskSpace())
	})

	t.Run("enough free space passes", func(t *testing.T) {
		pm := newDiskTestManager(t)
		pm.SetDiskSpaceProbe(func() (uint64, uint64) { return 100 << 30, 50 << 30 })
		require.NoError(t, pm.checkDiskSpace())
	})

	t.Run("full volume refuses with the sentinel", func(t *testing.T) {
		pm := newDiskTestManager(t)
		pm.SetDiskSpaceProbe(func() (uint64, uint64) { return 100 << 30, 10 << 20 })

		err := pm.checkDiskSpace()
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrInsufficientDiskSpace)
		assert.Contains(t, err.Error(), "MiB")
	})
}

func TestProcessManager_StartServerRefusesOnFullVolume(t *testing.T) {
	pm := newDiskTestManager(t)
	pm.SetDiskSpaceProbe(func() (uint64, uint64) { return 100 << 30, 0 })

	// Promoted fields cannot be set in a literal, so they are assigned after
	// construction: the embedded Server struct is an implementation detail.
	srv := &Arma3Server{}
	srv.ID = 1
	srv.Name = "full-volume"
	srv.Port = 2302
	srv.QueryPort = 2303

	err := pm.StartServer(context.Background(), srv)
	require.Error(t, err)
	assert.ErrorIs(t, err, ErrInsufficientDiskSpace)

	// The refusal happens before the reservation: freeing space and retrying
	// must not hit a duplicate-start or port-claimed error.
	pm.startMu.Lock()
	defer pm.startMu.Unlock()
	assert.Empty(t, pm.starting)
}
