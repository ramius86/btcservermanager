package api

import (
	"btcservermanager/internal/domain/server"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

// startServerTimeout bounds the synchronous part of a start/restart: config
// rendering, mod name resolution and the launch itself. The game server keeps
// running after the handler returns, so this is not the process lifetime.
const startServerTimeout = 60 * time.Second

/*
This file is part of the API Servers split.
It handles the HTTP endpoints for server process lifecycle (Start, Stop, Restart, Status monitoring) and auto-restart settings.

DO NOT place configuration editing or installation logic here.

Other files in this split:
- servers.go: Index/Hub file explaining the split.
- servers_crud.go: CRUD operations for server configurations.
- servers_install.go: SteamCMD installations and updates.
*/

func (r *Router) handleStartServer(w http.ResponseWriter, req *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}
	// Detached from the request so closing the tab cannot abort a start that is
	// already launching the process, but bounded: a wedged database or config
	// render must not hold the handler open forever.
	ctx, cancel := context.WithTimeout(context.Background(), startServerTimeout)
	defer cancel()

	if err := r.serverService.StartServer(ctx, id); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, server.ErrServerAlreadyRunning) || errors.Is(err, server.ErrPortConflict) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		r.respondInternalError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleStopServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}
	if err := r.serverService.StopServer(ctx, id); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, server.ErrServerNotRunning) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		r.respondInternalError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleRestartServer(w http.ResponseWriter, req *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), startServerTimeout)
	defer cancel()

	if err := r.serverService.RestartServer(ctx, id); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, server.ErrPortConflict) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		r.respondInternalError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleGetServerStatus(w http.ResponseWriter, req *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}

	// One shape for both states. Answering {"status":"Stopped"} for a stopped
	// server made the response disagree with the DTO the client declares, so
	// "which fields exist" depended on whether the process was running.
	info := r.serverService.GetInstanceInfo(id)
	if info == nil {
		info = &server.ServerInstanceInfo{}
	}

	r.json(w, info)
}

func (r *Router) handleGetAllServerStatuses(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	servers, err := r.serverService.GetAllServers(ctx)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	statuses := make(map[int64]*server.ServerInstanceInfo)

	for _, s := range servers {
		var id int64
		switch v := s.(type) {
		case *server.Arma3Server:
			id = v.ID
		case *server.DayZServer:
			id = v.ID
		case *server.ReforgerServer:
			id = v.ID
		}

		statuses[id] = r.serverService.GetInstanceInfo(id)
	}

	r.json(w, statuses)
}

func (r *Router) handleUpdateAutoRestart(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}

	var body struct {
		Enabled bool    `json:"enabled"`
		Time    *string `json:"time"`
	}

	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.serverService.SetAutomaticRestart(ctx, id, body.Enabled, body.Time); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		r.respondInternalError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
