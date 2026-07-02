package api

import (
	"btcservermanager/internal/domain/server"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type CustomNameEntry struct {
	PlayerName string `json:"playerName"`
	CustomName string `json:"customName"`
}

type CustomNames map[string]CustomNameEntry

func (r *Router) handleGetReforgerCustomNames(w http.ResponseWriter, req *http.Request) {
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
	filePath := filepath.Join(profilePath, "profile", "BTC_custom_names", "BTC_custom_names.json")

	data, err := os.ReadFile(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			r.json(w, CustomNames{}) // Return empty object if it doesn't exist
			return
		}
		http.Error(w, fmt.Sprintf("Failed to read custom names file: %v", err), http.StatusInternalServerError)
		return
	}

	var names CustomNames
	if err := json.Unmarshal(data, &names); err != nil {
		// If file is corrupted, return empty or error. Let's return empty to allow overriding.
		r.json(w, CustomNames{})
		return
	}

	r.json(w, names)
}

func (r *Router) handleUpdateReforgerCustomNames(w http.ResponseWriter, req *http.Request) {
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

	var names CustomNames
	if err := json.NewDecoder(req.Body).Decode(&names); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	profilePath := filepath.Join(r.paths.GetServerPath(server.TypeReforger), fmt.Sprintf("profile_%d", refSrv.ID))
	filePath := filepath.Join(profilePath, "profile", "BTC_custom_names", "BTC_custom_names.json")

	data, err := json.MarshalIndent(names, "", "  ")
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to serialize json: %v", err), http.StatusInternalServerError)
		return
	}

	if err := os.WriteFile(filePath, data, 0o644); err != nil {
		http.Error(w, fmt.Sprintf("Failed to write file: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
