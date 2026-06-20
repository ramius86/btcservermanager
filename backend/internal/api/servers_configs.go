package api

import (
	"btcservermanager/internal/domain/server"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

/*
This file is part of the API Servers split.
It handles configuration-specific operations, such as fetching configuration file previews from disk.

Other files in this split:
- servers.go: Index/Hub file.
- servers_crud.go: CRUD operations.
- servers_lifecycle.go: Server process lifecycle.
- servers_install.go: SteamCMD installations.
*/

func (r *Router) handleGetServerConfigs(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid server id", http.StatusBadRequest)
		return
	}

	configs, err := r.serverService.GetServerConfigs(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, configs)
}

func (r *Router) handleGetCBAPresets(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	presets, err := r.serverService.GetCBAPresets(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.json(w, presets)
}

func (r *Router) handleGetCBAPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid preset id", http.StatusBadRequest)
		return
	}
	preset, err := r.serverService.GetCBAPreset(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if preset == nil {
		http.Error(w, "preset not found", http.StatusNotFound)
		return
	}
	r.json(w, preset)
}

func (r *Router) handleSaveCBAPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var p server.CBAPreset
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&p); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// If ID is provided in URL, override it in the struct
	idStr := chi.URLParam(req, "id")
	if idStr != "" {
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err == nil {
			p.ID = id
		}
	}

	saved, err := r.serverService.SaveCBAPreset(ctx, &p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.json(w, saved)
}

func (r *Router) handleDeleteCBAPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid preset id", http.StatusBadRequest)
		return
	}
	if err := r.serverService.DeleteCBAPreset(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.json(w, map[string]string{"status": "ok"})
}
