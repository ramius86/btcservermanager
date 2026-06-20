package fastdl

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type Server struct {
	httpServer *http.Server
	vaultPath  string
}

func NewServer(port int, vaultPath string) *Server {
	s := &Server{
		vaultPath: vaultPath,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", s.handleRequest)

	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf("0.0.0.0:%d", port),
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 30 * time.Minute, // Allow time for large mission files
		IdleTimeout:  120 * time.Second,
	}

	return s
}

func (s *Server) Start() error {
	log.Printf("[FastDL] Starting secure HTTP server on %s serving from %s", s.httpServer.Addr, s.vaultPath)
	if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start FastDL server: %w", err)
	}
	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	log.Println("[FastDL] Stopping HTTP server...")
	return s.httpServer.Shutdown(ctx)
}

func (s *Server) handleRequest(w http.ResponseWriter, r *http.Request) {
	// 1. Method Whitelist: Only GET and HEAD
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Clean path and prevent traversal
	path := filepath.Clean(r.URL.Path)
	if strings.Contains(path, "..") {
		http.NotFound(w, r)
		return
	}

	// 3. Extension Whitelist: Only .pbo files
	if !strings.HasSuffix(strings.ToLower(path), ".pbo") {
		http.NotFound(w, r)
		return
	}

	// 4. No directory listing or root access
	if path == "/" || path == "." {
		http.NotFound(w, r)
		return
	}

	fullPath := filepath.Join(s.vaultPath, filepath.Base(path))

	// 5. Check if file exists and is not a directory
	info, err := os.Stat(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	if info.IsDir() {
		http.NotFound(w, r)
		return
	}

	// 6. Security Headers
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Cache-Control", "public, max-age=3600")

	// 7. Serve file
	http.ServeFile(w, r, fullPath)
}
