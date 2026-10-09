package api

import (
	"btcservermanager/internal/domain/server"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type CustomNameEntry struct {
	UID        string `json:"uid"`
	PlayerName string `json:"playerName"`
	CustomName string `json:"customName"`
}

type CustomNamesPayload struct {
	Entries []CustomNameEntry `json:"entries"`
}

func parseCustomNames(data []byte) (CustomNamesPayload, error) {
	data = bytes.TrimPrefix(data, []byte("\xef\xbb\xbf"))
	data = bytes.TrimSpace(data)
	if len(data) == 0 {
		return CustomNamesPayload{Entries: make([]CustomNameEntry, 0)}, nil
	}

	var payload CustomNamesPayload
	if err := json.Unmarshal(data, &payload); err != nil {
		return CustomNamesPayload{}, err
	}
	if payload.Entries == nil {
		payload.Entries = make([]CustomNameEntry, 0)
	}
	return payload, nil
}

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
			r.json(w, CustomNamesPayload{Entries: make([]CustomNameEntry, 0)}) // Return empty entries if it doesn't exist
			return
		}
		http.Error(w, fmt.Sprintf("Failed to read custom names file: %v", err), http.StatusInternalServerError)
		return
	}

	payload, err := parseCustomNames(data)
	if err != nil {
		// If file is corrupted, return empty to allow overriding.
		r.json(w, CustomNamesPayload{Entries: make([]CustomNameEntry, 0)})
		return
	}
	if payload.Entries == nil {
		payload.Entries = make([]CustomNameEntry, 0)
	}

	r.json(w, payload)
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

	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	payload, err := parseCustomNames(body)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}
	if payload.Entries == nil {
		payload.Entries = make([]CustomNameEntry, 0)
	}

	profilePath := filepath.Join(r.paths.GetServerPath(server.TypeReforger), fmt.Sprintf("profile_%d", refSrv.ID))
	filePath := filepath.Join(profilePath, "profile", "BTC_custom_names", "BTC_custom_names.json")

	if err := os.MkdirAll(filepath.Dir(filePath), 0o755); err != nil {
		http.Error(w, fmt.Sprintf("Failed to create directory: %v", err), http.StatusInternalServerError)
		return
	}

	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to serialize json: %v", err), http.StatusInternalServerError)
		return
	}
	data = append(data, '\n')

	if err := os.WriteFile(filePath, data, 0o644); err != nil {
		http.Error(w, fmt.Sprintf("Failed to write file: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
