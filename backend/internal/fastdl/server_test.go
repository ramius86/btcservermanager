package fastdl

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestHandleRequest(t *testing.T) {
	// Create a temporary directory to act as the vault
	tempDir, err := os.MkdirTemp("", "fastdl_test_vault")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// Create a mock mission file
	missionContent := []byte("arma3_mission_pbo_binary_data")
	missionName := "operation_antigravity.pbo"
	err = os.WriteFile(filepath.Join(tempDir, missionName), missionContent, 0o644)
	if err != nil {
		t.Fatalf("failed to write mock mission file: %v", err)
	}

	// Create another non-whitelisted file
	txtContent := []byte("secret_admin_notes")
	txtName := "admin_notes.txt"
	err = os.WriteFile(filepath.Join(tempDir, txtName), txtContent, 0o644)
	if err != nil {
		t.Fatalf("failed to write mock txt file: %v", err)
	}

	// Create a directory inside the vault to test directories
	dirName := "sub_vault.pbo"
	err = os.Mkdir(filepath.Join(tempDir, dirName), 0o755)
	if err != nil {
		t.Fatalf("failed to create mock directory: %v", err)
	}

	server := NewServer(8081, tempDir)

	tests := []handleRequestTestCase{
		{
			name:           "GET valid .pbo scenario",
			method:         http.MethodGet,
			target:         "/" + missionName,
			expectedStatus: http.StatusOK,
			expectedBody:   string(missionContent),
			checkHeaders:   true,
		},
		{
			name:           "HEAD valid .pbo scenario",
			method:         http.MethodHead,
			target:         "/" + missionName,
			expectedStatus: http.StatusOK,
			expectedBody:   "",
			checkHeaders:   true,
		},
		{
			name:           "POST method rejected",
			method:         http.MethodPost,
			target:         "/" + missionName,
			expectedStatus: http.StatusMethodNotAllowed,
		},
		{
			name:           "DELETE method rejected",
			method:         http.MethodDelete,
			target:         "/" + missionName,
			expectedStatus: http.StatusMethodNotAllowed,
		},
		{
			name:           "GET non-pbo file (.txt) returns 404",
			method:         http.MethodGet,
			target:         "/" + txtName,
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "GET root folder returns 404",
			method:         http.MethodGet,
			target:         "/",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "GET dot returns 404",
			method:         http.MethodGet,
			target:         "/.",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "Path traversal with .. returns 404",
			method:         http.MethodGet,
			target:         "/../anyfile.pbo",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "Non-existent .pbo returns 404",
			method:         http.MethodGet,
			target:         "/non_existent_mission.pbo",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "Directory named .pbo returns 404",
			method:         http.MethodGet,
			target:         "/" + dirName,
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			runHandleRequestTest(t, server, tt)
		})
	}
}

type handleRequestTestCase struct {
	name           string
	method         string
	target         string
	expectedStatus int
	expectedBody   string
	checkHeaders   bool
}

func runHandleRequestTest(t *testing.T, server *Server, tt handleRequestTestCase) {
	req := httptest.NewRequest(tt.method, tt.target, nil)
	w := httptest.NewRecorder()

	server.handleRequest(w, req)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != tt.expectedStatus {
		t.Errorf("expected status %d, got %d", tt.expectedStatus, resp.StatusCode)
	}

	if tt.expectedStatus != http.StatusOK {
		return
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("failed to read response body: %v", err)
	}
	if string(bodyBytes) != tt.expectedBody {
		t.Errorf("expected body %q, got %q", tt.expectedBody, string(bodyBytes))
	}

	if !tt.checkHeaders {
		return
	}

	if got := resp.Header.Get("X-Content-Type-Options"); got != "nosniff" {
		t.Errorf("expected X-Content-Type-Options: nosniff, got %q", got)
	}
	if got := resp.Header.Get("Content-Type"); got != "application/octet-stream" {
		t.Errorf("expected Content-Type: application/octet-stream, got %q", got)
	}
	if got := resp.Header.Get("Cache-Control"); !strings.Contains(got, "public") {
		t.Errorf("expected Cache-Control to contain public, got %q", got)
	}
}

func TestServerLifecycle(t *testing.T) {
	// Find a free port dynamically
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("failed to find free TCP port: %v", err)
	}
	port := listener.Addr().(*net.TCPAddr).Port
	listener.Close()

	tempDir, err := os.MkdirTemp("", "fastdl_lifecycle_vault")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	server := NewServer(port, tempDir)

	serverErrorChan := make(chan error, 1)
	go func() {
		err := server.Start()
		if err != nil {
			serverErrorChan <- err
		}
		close(serverErrorChan)
	}()

	// Wait briefly for the server to spin up
	time.Sleep(100 * time.Millisecond)

	// Verify the server is listening by checking connection
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("127.0.0.1:%d", port), 500*time.Millisecond)
	if err != nil {
		t.Errorf("failed to connect to server: %v", err)
	} else {
		conn.Close()
	}

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Second)
	defer cancel()
	err = server.Stop(ctx)
	if err != nil {
		t.Errorf("failed to stop server gracefully: %v", err)
	}

	// Ensure Start did not return an unexpected error
	select {
	case err := <-serverErrorChan:
		if err != nil {
			t.Errorf("server start returned error: %v", err)
		}
	case <-time.After(1 * time.Second):
		t.Log("server shut down successfully without emitting errors")
	}
}
