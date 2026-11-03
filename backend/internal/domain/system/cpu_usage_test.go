package system

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCPUBusyPercent(t *testing.T) {
	tests := []struct {
		name     string
		previous cpuTimes
		current  cpuTimes
		want     float64
	}{
		{"half busy", cpuTimes{total: 1000, idle: 800}, cpuTimes{total: 1400, idle: 1000}, 50},
		{"all busy", cpuTimes{total: 1000, idle: 800}, cpuTimes{total: 1400, idle: 800}, 100},
		{"all idle", cpuTimes{total: 1000, idle: 800}, cpuTimes{total: 1400, idle: 1200}, 0},
		{"no time passed", cpuTimes{total: 1000, idle: 800}, cpuTimes{total: 1000, idle: 800}, 0},
		{"clock went backwards", cpuTimes{total: 1400, idle: 1000}, cpuTimes{total: 1000, idle: 800}, 0},
		{"idle delta larger than total", cpuTimes{total: 1000, idle: 0}, cpuTimes{total: 1100, idle: 200}, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.InDelta(t, tt.want, cpuBusyPercent(tt.previous, tt.current), 0.001)
		})
	}
}

func TestGetCPUUsageUsesProcStatDelta(t *testing.T) {
	rootDir := t.TempDir()
	procDir := filepath.Join(rootDir, "proc")
	require.NoError(t, os.MkdirAll(procDir, 0o755))

	statPath := filepath.Join(procDir, "stat")
	writeStat := func(line string) {
		require.NoError(t, os.WriteFile(statPath, []byte(line+"\n"), 0o644))
	}

	s := NewService(ServiceDeps{})
	s.SetRootPath(rootDir)

	// First sample only seeds the baseline.
	writeStat("cpu  100 0 100 800 0 0 0 0 0 0")
	assert.InDelta(t, 0, s.getCPUUsage(), 0.001)

	// 400 more jiffies, 200 of them idle: 50% busy.
	writeStat("cpu  200 0 200 1000 0 0 0 0 0 0")
	assert.InDelta(t, 50, s.getCPUUsage(), 0.001)

	// Only idle time grew.
	writeStat("cpu  200 0 200 1200 0 0 0 0 0 0")
	assert.InDelta(t, 0, s.getCPUUsage(), 0.001)
}

func TestGetCPUUsageWithoutProcStat(t *testing.T) {
	s := NewService(ServiceDeps{})
	s.SetRootPath(t.TempDir())

	assert.InDelta(t, 0, s.getCPUUsage(), 0.001)
}
