package api

import (
	"btcservermanager/internal/domain/server"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type ReforgerSaveDto struct {
	Name         string `json:"name"`
	LastModified string `json:"lastModified"`
}

func (r *Router) handleGetReforgerSaves(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}

	srv, err := r.serverService.GetServer(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	refSrv, ok := srv.(*server.ReforgerServer)
	if !ok {
		http.Error(w, "Server is not a Reforger server", http.StatusBadRequest)
		return
	}

	profilePath := filepath.Join(r.paths.GetServerPath(server.TypeReforger), fmt.Sprintf("profile_%d", refSrv.ID))
	saveDir := filepath.Join(profilePath, "profile", ".save", "game")

	saves := []ReforgerSaveDto{}

	entries, err := os.ReadDir(saveDir)
	if err != nil {
		r.json(w, saves)
		return
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		var modTime string
		if info, err := entry.Info(); err == nil {
			modTime = info.ModTime().Format("2006-01-02 15:04:05")
		}
		saves = append(saves, ReforgerSaveDto{
			Name:         entry.Name(),
			LastModified: modTime,
		})
	}

	r.json(w, saves)
}

func (r *Router) handleDeleteReforgerSaves(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}

	srv, err := r.serverService.GetServer(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	refSrv, ok := srv.(*server.ReforgerServer)
	if !ok {
		http.Error(w, "Server is not a Reforger server", http.StatusBadRequest)
		return
	}

	// Check if running
	if r.serverService.GetInstanceInfo(id) != nil {
		http.Error(w, "Cannot delete saved scenarios while the server is running", http.StatusBadRequest)
		return
	}

	profilePath := filepath.Join(r.paths.GetServerPath(server.TypeReforger), fmt.Sprintf("profile_%d", refSrv.ID))
	saveDir := filepath.Join(profilePath, "profile", ".save", "game")

	name := req.URL.Query().Get("name")
	if name == "" {
		if err := os.RemoveAll(saveDir); err != nil {
			http.Error(w, fmt.Sprintf("Failed to delete all scenario saves: %v", err), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Sanitize name using filepath.Clean and filepath.Base to satisfy SAST path traversal analyzers
	name = filepath.Base(filepath.Clean(name))

	// Validate name against a strict whitelist (alphanumeric, dash, underscore only)
	for _, r := range name {
		if (r < 'a' || r > 'z') && (r < 'A' || r > 'Z') && (r < '0' || r > '9') && r != '-' && r != '_' {
			http.Error(w, "Invalid scenario name", http.StatusBadRequest)
			return
		}
	}

	targetPath := filepath.Join(saveDir, name)
	if err := os.RemoveAll(targetPath); err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete scenario save: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
