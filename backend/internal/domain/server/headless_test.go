package server

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHeadlessClient_PrepareParameters(t *testing.T) {
	t.Parallel()

	hc := &HeadlessClient{
		Server: &Arma3Server{
			Server: Server{
				Port:     2304,
				Password: "mypassword",
			},
			ModNames: []ModInfo{
				{Name: "@CUP_Units", ServerOnly: false},
				{Name: "@ServerLogs", ServerOnly: true},
			},
			ActiveDLCs: []string{"contact"},
		},
	}

	params := hc.prepareParameters([]string{"@CustomMod"})

	// Verify separate -connect and -port parameters for Real Virtuality engine
	assert.Contains(t, params, "-client")
	assert.Contains(t, params, "-connect=127.0.0.1")
	assert.Contains(t, params, "-port=2304")
	assert.NotContains(t, params, "-connect=127.0.0.1:2304")
	assert.Contains(t, params, "-password=mypassword")
	assert.Contains(t, params, "-mod=@CUP_Units;contact;@CustomMod")
}

type testHCPathProvider struct {
	*mockPathProvider
	logFile string
}

func (t *testHCPathProvider) GetHeadlessClientLogFile(sid int64, hid int) string {
	return t.logFile
}

func TestHeadlessClient_LogDirCreation(t *testing.T) {
	tempDir := t.TempDir()
	nestedLogDir := filepath.Join(tempDir, "nested", "logs")
	logFile := filepath.Join(nestedLogDir, "hc.log")

	paths := &testHCPathProvider{
		mockPathProvider: &mockPathProvider{baseDir: tempDir},
		logFile:          logFile,
	}

	hc := NewHeadlessClient(1, &Arma3Server{Server: Server{ID: 1}}, paths, nil)
	_ = hc.Start(nil)

	info, err := os.Stat(nestedLogDir)
	assert.NoError(t, err)
	assert.True(t, info.IsDir())
}
