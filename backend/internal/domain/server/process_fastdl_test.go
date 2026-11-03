package server

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// A failed FastDL start must not leave the shared counter incremented.
// startFastDLIfNeeded reports the failure and nobody ever decrements it, so the
// listener would stay up (and the port claimed) for the rest of the process.
func TestStartFastDLDoesNotCountFailedStart(t *testing.T) {
	paths := &dummyPathProvider{tempDir: t.TempDir()}
	pm := NewProcessManager(paths, NewLauncher(paths, []string{}), false)

	// A regular file where the mpmissions directory belongs makes MkdirAll fail.
	require.NoError(t, os.WriteFile(paths.GetScenariosBasePath(), []byte("not a directory"), 0o644))

	require.Error(t, pm.startFastDLForServer())

	pm.fastdlMu.Lock()
	count := pm.fastdlActiveCount
	srv := pm.fastdlServer
	pm.fastdlMu.Unlock()

	assert.Equal(t, 0, count, "a failed start must not keep the active count")
	assert.Nil(t, srv, "no FastDL server may be published for a failed start")

	// A cleanup arriving for an unrelated server must not drive the count negative.
	pm.stopFastDLForServer()

	pm.fastdlMu.Lock()
	count = pm.fastdlActiveCount
	pm.fastdlMu.Unlock()

	assert.Equal(t, 0, count)
}
