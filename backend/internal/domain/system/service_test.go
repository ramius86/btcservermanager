package system

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestParseMemLine(t *testing.T) {
	s := &Service{}

	tests := []struct {
		line     string
		expected int64
	}{
		{"MemTotal:       16384224 kB", 16384224},
		{"MemFree:          123456 kB", 123456},
		{"MemAvailable:     987654 kB", 987654},
		{"InvalidLine", 0},
		{"Empty: ", 0},
		{"OnePart:", 0},
		{"ThreeParts: 100 kB extra", 100},
	}

	for _, tt := range tests {
		result := s.parseMemLine(tt.line)
		if result != tt.expected {
			t.Errorf("parseMemLine(%q) = %d; expected %d", tt.line, result, tt.expected)
		}
	}
}

func TestGetSystemInfo(t *testing.T) {
	// Create a temporary directory to mock /proc and /etc
	tmpDir := t.TempDir()

	// Create mock files
	procDir := filepath.Join(tmpDir, "proc")
	etcDir := filepath.Join(tmpDir, "etc")
	err := os.MkdirAll(procDir, 0o755)
	assert.NoError(t, err)
	err = os.MkdirAll(etcDir, 0o755)
	assert.NoError(t, err)

	err = os.WriteFile(filepath.Join(procDir, "meminfo"), []byte("MemTotal: 16000000 kB\nMemAvailable: 8000000 kB\n"), 0o644)
	assert.NoError(t, err)
	err = os.WriteFile(filepath.Join(procDir, "loadavg"), []byte("0.50 0.40 0.30 1/100 1234\n"), 0o644)
	assert.NoError(t, err)
	err = os.WriteFile(filepath.Join(procDir, "version"), []byte("Linux version 5.15.0 (build@worker) #1 SMP\n"), 0o644)
	assert.NoError(t, err)
	err = os.WriteFile(filepath.Join(procDir, "uptime"), []byte("3600.00 7200.00\n"), 0o644)
	assert.NoError(t, err)
	err = os.WriteFile(filepath.Join(procDir, "cpuinfo"), []byte("model name : AMD Ryzen 7 3700X\n"), 0o644)
	assert.NoError(t, err)
	err = os.WriteFile(filepath.Join(etcDir, "os-release"), []byte("PRETTY_NAME=\"Ubuntu 22.04.1 LTS\"\n"), 0o644)
	assert.NoError(t, err)

	s := NewService(ServiceDeps{AppRepo: nil, SteamAuth: nil, SteamAPIKey: "api-key"})
	s.SetRootPath(tmpDir)

	info, err := s.GetSystemInfo(t.Context())
	assert.NoError(t, err)
	assert.NotNil(t, info)

	assert.Equal(t, int64(16000000*1024), info.MemoryTotal)
	assert.Equal(t, int64(8000000*1024), info.MemoryFree)
	assert.Equal(t, 0.50/float64(runtime.NumCPU()), info.CPUUsage)
	assert.Equal(t, "5.15.0", info.Kernel)
	assert.Equal(t, 3600.00, info.Uptime)
	assert.Equal(t, "AMD Ryzen 7 3700X", info.CPUModel)
	assert.Equal(t, "Ubuntu 22.04.1 LTS", info.OSName)
	assert.True(t, info.SteamAPIKeyConfigured)
	assert.Equal(t, "dev", info.AppVersion)
}

func TestGetPublicIP(t *testing.T) {
	s := NewService(ServiceDeps{AppRepo: nil, SteamAuth: nil, SteamAPIKey: ""})

	// Test caching
	s.lastPublicIP = "1.2.3.4"
	s.lastPublicIPFetch = time.Now()

	ip := s.getPublicIP(t.Context())
	assert.Equal(t, "1.2.3.4", ip)
}
