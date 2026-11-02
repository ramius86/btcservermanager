package api

import (
	"btcservermanager/internal/config"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestDeleteAllLogsRequiresExplicitType(t *testing.T) {
	logsDir := t.TempDir()

	serverLog := filepath.Join(logsDir, "ARMA3_1_20260101_000000.log")
	steamDir := filepath.Join(logsDir, "steamcmd")
	steamLog := filepath.Join(steamDir, "steamcmd_1.log")

	if err := os.MkdirAll(steamDir, 0o755); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	if err := os.WriteFile(serverLog, []byte("server"), 0o644); err != nil {
		t.Fatalf("seed server log: %v", err)
	}
	if err := os.WriteFile(steamLog, []byte("steam"), 0o644); err != nil {
		t.Fatalf("seed steamcmd log: %v", err)
	}

	router := &Router{config: &config.Config{LogsDirectory: logsDir}}

	for _, logType := range []string{"", "bogus"} {
		req := httptest.NewRequest(http.MethodDelete, "/all?type="+logType, nil)
		rec := httptest.NewRecorder()

		router.handleDeleteAllLogs(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("type=%q: expected 400, got %d (%s)", logType, rec.Code, rec.Body.String())
		}
	}

	// A rejected request must not delete anything.
	if _, err := os.Stat(serverLog); err != nil {
		t.Fatalf("server log was removed by a rejected request: %v", err)
	}
	if _, err := os.Stat(steamLog); err != nil {
		t.Fatalf("steamcmd log was removed by a rejected request: %v", err)
	}

	// An explicit scope deletes only its own logs.
	req := httptest.NewRequest(http.MethodDelete, "/all?type=server", nil)
	rec := httptest.NewRecorder()
	router.handleDeleteAllLogs(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d (%s)", rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(serverLog); !os.IsNotExist(err) {
		t.Fatal("server log should be deleted for type=server")
	}
	if _, err := os.Stat(steamLog); err != nil {
		t.Fatalf("steamcmd log must survive type=server: %v", err)
	}
}
