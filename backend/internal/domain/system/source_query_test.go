package system

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadString(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name     string
		input    []byte
		expected string
	}{
		{
			name:     "simple string",
			input:    []byte{'h', 'e', 'l', 'l', 'o', 0},
			expected: "hello",
		},
		{
			name:     "empty string",
			input:    []byte{0},
			expected: "",
		},
		{
			name:     "unterminated string",
			input:    []byte{'a', 'b', 'c'},
			expected: "abc",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			reader := bytes.NewReader(tt.input)
			got := readString(reader)
			assert.Equal(t, tt.expected, got)
		})
	}
}

func TestParseA2SInfo(t *testing.T) {
	t.Parallel()
	// A2S_INFO response packet format
	// Header: 0xFFFFFFFF
	// ID: 0x49
	// Protocol: 17
	// Name: "Test Server"
	// Map: "Stratis"
	// Folder: "arma3"
	// Game: "Arma 3"
	// ID: 233780 (LittleEndian: 0x54, 0x91)
	// Players: 10
	// MaxPlayers: 64
	// Bots: 0
	// ServerType: 'd' (dedicated)
	// Environment: 'w' (windows)
	// Visibility: 0 (public)
	// VAC: 1 (secured)
	// Version: "1.0.0"
	// EDF: 0x20 (Tags only)
	// Tags: "missionName:Op. Danger Zone,other:tag"

	data := []byte{
		0xFF, 0xFF, 0xFF, 0xFF, // Header
		0x49, // ID ('I')
		17,   // Protocol
	}
	data = append(data, []byte("Test Server")...)
	data = append(data, 0)
	data = append(data, []byte("Stratis")...)
	data = append(data, 0)
	data = append(data, []byte("arma3")...)
	data = append(data, 0)
	data = append(data, []byte("Arma 3")...)
	data = append(data, 0)
	data = append(data, 0x54, 0x91)     // ID 233780 (truncated to uint16 in SourceQueryInfo)
	data = append(data, 10, 64, 0)      // Players, Max, Bots
	data = append(data, 'd', 'w', 0, 1) // Type, Env, Vis, VAC
	data = append(data, []byte("1.0.0")...)
	data = append(data, 0)
	data = append(data, 0x20) // EDF (Tags)
	data = append(data, []byte("missionName:Op. Danger Zone,other:tag")...)
	data = append(data, 0)

	got, err := parseA2SInfo(data)
	assert.NoError(t, err)
	assert.NotNil(t, got)
	assert.Equal(t, "Test Server", got.Name)
	assert.Equal(t, "Stratis", got.Map)
	assert.Equal(t, "Arma 3", got.Game)
	assert.Equal(t, byte(10), got.Players)
	assert.Equal(t, byte(64), got.MaxPlayers)
	assert.Equal(t, "1.0.0", got.Version)
	assert.Equal(t, "Op. Danger Zone", got.Mission)
}

func TestParseA2SInfo_InvalidHeader(t *testing.T) {
	t.Parallel()
	data := []byte{0xFF, 0xFF, 0xFF, 0xFF, 0x48} // 'H' instead of 'I'
	got, err := parseA2SInfo(data)
	assert.Error(t, err)
	assert.Nil(t, got)
	assert.Contains(t, err.Error(), "invalid response header")
}

func TestParseA2SInfo_ShortResponse(t *testing.T) {
	t.Parallel()
	data := []byte{0xFF, 0xFF, 0xFF, 0xFF}
	got, err := parseA2SInfo(data)
	assert.Error(t, err)
	assert.Nil(t, got)
}
