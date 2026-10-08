package server

import (
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
