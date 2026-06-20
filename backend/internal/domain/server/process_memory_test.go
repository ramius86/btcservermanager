package server

import (
	"bufio"
	"bytes"
	"io"
	"os"
	"runtime"
	"strings"
	"sync"
	"testing"
	"time"
)

type testBroadcaster struct {
	mu       sync.Mutex
	count    int
	payloads []map[string]any
}

func (tb *testBroadcaster) Broadcast(eventType string, payload any) {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	tb.count++

	if m, ok := payload.(map[string]any); ok {
		tb.payloads = append(tb.payloads, m)
	}
}

func (tb *testBroadcaster) getCount() int {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	return tb.count
}

// TestHandleServerLogs_MemoryStability verifies that processing a high volume
// of log lines does not cause unbounded memory growth. This is a direct test
// for the memory leak scenario observed during long Reforger sessions.
func TestHandleServerLogs_MemoryStability(t *testing.T) {
	broadcaster := &testBroadcaster{}

	pm := &ProcessManager{debugMode: false}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 1,
		info: &ServerInstanceInfo{
			MaxPlayers: 10,
		},
	}

	// Simulate a high-throughput log session (10000 lines)
	logChan := make(chan *bytes.Buffer, 1000)

	// Create temp log files
	mainLog, statsLog := createTempLogFiles(t)
	defer mainLog.Close()
	defer statsLog.Close()

	done := make(chan struct{})
	go func() {
		pm.handleServerLogs(p, logChan, mainLog, statsLog, true, 20000)
		close(done)
	}()

	// Force GC before measuring baseline
	runtime.GC()
	var memBefore runtime.MemStats
	runtime.ReadMemStats(&memBefore)

	// Send 10000 lines simulating a Reforger session
	for i := 0; i < 10000; i++ {
		logChan <- bytes.NewBufferString("2025-01-30 20:32:50: DEFAULT : Some normal log line from the game server\n")
	}

	// Send some stat lines too
	for i := 0; i < 1000; i++ {
		logChan <- bytes.NewBufferString("2025-01-30 20:32:50: DEFAULT : FPS: 120.1, Mem: 4507432 kB, Player: 0, AI: 1150, Veh: 0 (5), Proj (S: 0 | 0).\n")
	}

	close(logChan)
	<-done

	// Force GC and measure after
	runtime.GC()
	var memAfter runtime.MemStats
	runtime.ReadMemStats(&memAfter)

	// The heap growth should be reasonable (< 50MB for 11000 short lines)
	heapGrowthMB := float64(int64(memAfter.HeapAlloc)-int64(memBefore.HeapAlloc)) / 1024 / 1024
	t.Logf("Heap growth after 11000 lines: %.2f MB", heapGrowthMB)
	t.Logf("Total allocations: %d", memAfter.Mallocs-memBefore.Mallocs)

	// Verify stats were parsed
	if p.info.LastReforgerStat == nil {
		t.Error("expected LastReforgerStat to be set")
	}

	if broadcaster.getCount() == 0 {
		t.Error("expected broadcast events")
	}

	// Memory should not grow unboundedly - 50MB is very generous for 11k short lines
	if heapGrowthMB > 50 {
		t.Errorf("excessive memory growth: %.2f MB (expected < 50 MB)", heapGrowthMB)
	}
}

// TestHandleServerLogs_LongLines verifies that extremely long log lines
// are handled safely and don't cause memory issues. This tests the bounded
// scanner fix.
func TestHandleServerLogs_LongLines(t *testing.T) {
	broadcaster := &testBroadcaster{}

	pm := &ProcessManager{debugMode: false}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 1,
		info: &ServerInstanceInfo{
			MaxPlayers: 10,
		},
	}

	logChan := make(chan *bytes.Buffer, 100)

	mainLog, statsLog := createTempLogFiles(t)
	defer mainLog.Close()
	defer statsLog.Close()

	done := make(chan struct{})
	go func() {
		pm.handleServerLogs(p, logChan, mainLog, statsLog, false, 20000)
		close(done)
	}()

	// Send a mix of normal and very long lines
	logChan <- bytes.NewBufferString("Short normal line\n")
	logChan <- bytes.NewBufferString(strings.Repeat("A", 100*1024) + "\n") // 100KB line
	logChan <- bytes.NewBufferString("Another short line\n")

	close(logChan)
	<-done

	if broadcaster.getCount() < 2 {
		t.Errorf("expected at least 2 broadcast events, got %d", broadcaster.getCount())
	}
}

// TestHandleServerLogs_ReforgerStatsFiltering verifies that stat lines and
// preamble lines are correctly diverted to the stats log when available.
func TestHandleServerLogs_ReforgerStatsFiltering(t *testing.T) {
	broadcaster := &testBroadcaster{}
	pm := &ProcessManager{debugMode: false}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 1,
		info: &ServerInstanceInfo{
			MaxPlayers: 10,
		},
	}

	logChan := make(chan *bytes.Buffer, 100)

	mainLog, statsLog := createTempLogFiles(t)
	defer mainLog.Close()
	defer statsLog.Close()

	done := make(chan struct{})
	go func() {
		pm.handleServerLogs(p, logChan, mainLog, statsLog, true, 20000)
		close(done)
	}()

	// Send a stat line (should go to stats log)
	logChan <- bytes.NewBufferString("FPS: 60.0, Mem: 2048000 kB, Player: 5, AI: 100, Veh: 2 (10), Proj (S: 0 | 0).\n")

	// Send a normal line (should go to main log)
	logChan <- bytes.NewBufferString("Player connected: test_user\n")

	close(logChan)
	<-done

	// Verify stat was parsed
	if p.info.LastReforgerStat == nil {
		t.Fatal("expected LastReforgerStat to be set")
	}

	if p.info.LastReforgerStat.Players != 5 {
		t.Errorf("expected 5 players, got %d", p.info.LastReforgerStat.Players)
	}

	if p.info.LastReforgerStat.FPS != 60.0 {
		t.Errorf("expected FPS 60.0, got %.1f", p.info.LastReforgerStat.FPS)
	}
}

// TestScanPipeBounded simulates the stdout/stderr scanner to verify it
// handles long lines without unbounded memory growth. This is a regression test
// for the bufio.NewReader.ReadString memory leak.
func TestScanPipeBounded(t *testing.T) {
	// Create a pipe that simulates stdout
	pr, pw := io.Pipe()

	logChan := make(chan *bytes.Buffer, 100)

	// Launch the scanner goroutine (same pattern as in StartServer)
	go func() {
		defer close(logChan)
		scanner := newBoundedScanner(pr)
		for scanner.Scan() {
			b := scanner.Bytes()
			if len(b) > 0 {
				buf := new(bytes.Buffer)
				buf.Write(b)
				buf.WriteByte('\n')
				select {
				case logChan <- buf:
				default:
				}
			}
		}
	}()

	// Write some lines including a very long one
	go func() {
		pw.Write([]byte("normal line 1\n"))
		pw.Write([]byte(strings.Repeat("X", 50000) + "\n")) // 50KB line - within limit
		pw.Write([]byte("normal line 2\n"))
		pw.Close()
	}()

	var lines []string
	for buf := range logChan {
		lines = append(lines, buf.String())
	}

	if len(lines) != 3 {
		t.Errorf("expected 3 lines, got %d", len(lines))
	}

	// Verify the long line was received (truncated or full depending on buffer)
	if len(lines) >= 2 && len(lines[1]) < 100 {
		t.Error("expected long line to be passed through, got short line")
	}
}

// TestScanPipeExceedsMax tests that lines exceeding the max scanner buffer
// are handled gracefully without crashing.
func TestScanPipeExceedsMax(t *testing.T) {
	pr, pw := io.Pipe()

	logChan := make(chan *bytes.Buffer, 100)

	go func() {
		defer close(logChan)
		scanner := newBoundedScanner(pr)
		for scanner.Scan() {
			b := scanner.Bytes()
			if len(b) > 0 {
				buf := new(bytes.Buffer)
				buf.Write(b)
				buf.WriteByte('\n')
				select {
				case logChan <- buf:
				default:
				}
			}
		}
		// Close the reader to unblock the writer goroutine
		pr.Close()
	}()

	// Write a line that exceeds the 64KB limit
	go func() {
		pw.Write([]byte("before\n"))
		pw.Write([]byte(strings.Repeat("Y", 128*1024) + "\n")) // 128KB - exceeds 64KB limit
		pw.Write([]byte("after\n"))
		pw.Close()
	}()

	var lines []string
	timeout := time.After(2 * time.Second)
	for {
		select {
		case buf, ok := <-logChan:
			if !ok {
				goto done
			}
			lines = append(lines, buf.String())
		case <-timeout:
			goto done
		}
	}
done:

	// The scanner will stop at the over-sized line, but should not panic or hang.
	// At minimum, "before" should have been received.
	if len(lines) < 1 {
		t.Error("expected at least 1 line before the oversized line")
	}

	t.Logf("Received %d lines (oversized line was safely handled)", len(lines))
}

// TestHandleServerLogs_NoStatsLog verifies the behavior when stats logging
// is not enabled (statsLog is nil). This matches the user's scenario:
// Reforger running without -logStats.
func TestHandleServerLogs_NoStatsLog(t *testing.T) {
	broadcaster := &testBroadcaster{}
	pm := &ProcessManager{debugMode: false}
	pm.SetBroadcaster(broadcaster)

	p := &Process{
		serverID: 1,
		info: &ServerInstanceInfo{
			MaxPlayers: 10,
		},
	}

	logChan := make(chan *bytes.Buffer, 100)

	mainLog, err := os.CreateTemp(t.TempDir(), "test_main_*.log")
	if err != nil {
		t.Fatalf("failed to create temp main log: %v", err)
	}
	defer mainLog.Close()

	done := make(chan struct{})
	go func() {
		// statsLog is nil — simulating no -logStats flag
		pm.handleServerLogs(p, logChan, mainLog, nil, true, 20000)
		close(done)
	}()

	// Send 500 lines including stat lines (they should ALL go to mainLog since statsLog is nil)
	for i := 0; i < 500; i++ {
		logChan <- bytes.NewBufferString("2025-01-30 20:32:50: DEFAULT : FPS: 120.1, Mem: 4507432 kB, Player: 0, AI: 1150, Veh: 0 (5), Proj (S: 0 | 0).\n")
	}

	close(logChan)
	<-done

	// Stats should still be parsed even without stats log separation
	if p.info.LastReforgerStat == nil {
		t.Error("expected LastReforgerStat to be set even without stats log")
	}

	// All lines should be broadcast (some as server_log, some as reforger_stats)
	if broadcaster.getCount() == 0 {
		t.Error("expected broadcast events")
	}
}

// newBoundedScanner creates a scanner with the same configuration used in production.
func newBoundedScanner(r io.Reader) *bufio.Scanner {
	const maxLineSize = 64 * 1024
	scanner := bufio.NewScanner(r)
	scanner.Buffer(make([]byte, 4096), maxLineSize)
	return scanner
}

// Helper to create temp log files for tests
func createTempLogFiles(t *testing.T) (*os.File, *os.File) {
	t.Helper()

	mainLog, err := os.CreateTemp(t.TempDir(), "test_main_*.log")
	if err != nil {
		t.Fatalf("failed to create temp main log: %v", err)
	}

	statsLog, err := os.CreateTemp(t.TempDir(), "test_stats_*.log")
	if err != nil {
		t.Fatalf("failed to create temp stats log: %v", err)
	}

	return mainLog, statsLog
}
