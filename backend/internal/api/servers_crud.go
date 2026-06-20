package api

import (
	"btcservermanager/internal/domain/server"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

/*
This file is part of the API Servers split.
It handles CRUD (Create, Read, Update, Delete) HTTP operations and JSON decoding for server configurations.

DO NOT place process management or installation logic here.

Other files in this split:
- servers.go: Index/Hub file explaining the split.
- servers_lifecycle.go: Server process lifecycle (Start, Stop, Status).
- servers_install.go: SteamCMD installations and updates.
*/

func (r *Router) handleGetAllServers(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	servers, err := r.serverService.GetAllServers(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, s := range servers {
		server.MaskSensitive(s)
	}

	r.json(w, servers)
}

func (r *Router) handleReorderServers(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var payload []struct {
		ID        int64 `json:"id"`
		SortOrder int   `json:"sortOrder"`
	}

	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	orders := make(map[int64]int)
	for _, p := range payload {
		orders[p.ID] = p.SortOrder
	}

	if err := r.serverService.ReorderServers(ctx, orders); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleGetServer(w http.ResponseWriter, req *http.Request) {
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

	server.MaskSensitive(srv)

	r.json(w, srv)
}

func (r *Router) handleCreateServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	srv, err := r.decodeServer(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var name string
	switch v := srv.(type) {
	case *server.Arma3Server:
		name = v.Name
	case *server.DayZServer:
		name = v.Name
	case *server.ReforgerServer:
		name = v.Name
	}

	if name == "" {
		http.Error(w, "Server Name is required", http.StatusBadRequest)
		return
	}

	created, err := r.serverService.CreateServer(ctx, srv)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if rs, ok := created.(*server.ReforgerServer); ok {
		r.syncReforgerScenarios(rs, nil)
	}

	server.MaskSensitive(created)

	r.json(w, created)
}

func (r *Router) handleUpdateServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}

	srv, err := r.decodeServer(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Set ID from URL
	var name string

	switch v := srv.(type) {
	case *server.Arma3Server:
		v.ID = id
		name = v.Name
	case *server.DayZServer:
		v.ID = id
		name = v.Name
	case *server.ReforgerServer:
		v.ID = id
		name = v.Name
	}

	if name == "" {
		http.Error(w, "Server Name is required", http.StatusBadRequest)
		return
	}

	// Get old state for comparison
	var oldSrv *server.ReforgerServer
	if base, err := r.serverService.GetServer(ctx, id); err == nil {
		if rs, ok := base.(*server.ReforgerServer); ok {
			oldSrv = rs
		}
	}

	updated, err := r.serverService.UpdateServer(ctx, srv)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if rs, ok := updated.(*server.ReforgerServer); ok {
		r.syncReforgerScenarios(rs, oldSrv)
	}

	server.MaskSensitive(updated)

	r.json(w, updated)
}

func (r *Router) handleDeleteServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidServerID, http.StatusBadRequest)
		return
	}
	if err := r.serverService.DeleteServer(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) decodeServer(req *http.Request) (any, error) {
	var raw json.RawMessage
	if err := json.NewDecoder(http.MaxBytesReader(nil, req.Body, 1048576)).Decode(&raw); err != nil {
		return nil, err
	}

	var base struct {
		Type server.Type `json:"type"`
	}

	if err := json.Unmarshal(raw, &base); err != nil {
		return nil, err
	}

	switch base.Type {
	case server.TypeArma3:
		var s server.Arma3Server
		if err := json.Unmarshal(raw, &s); err != nil {
			return nil, err
		}

		return &s, nil
	case server.TypeDayZ, server.TypeDayZExp:
		var s server.DayZServer
		if err := json.Unmarshal(raw, &s); err != nil {
			return nil, err
		}

		return &s, nil
	case server.TypeReforger:
		var s server.ReforgerServer
		if err := json.Unmarshal(raw, &s); err != nil {
			return nil, err
		}

		return &s, nil
	default:
		return nil, fmt.Errorf("unsupported server type: %s", base.Type)
	}
}

func (r *Router) syncReforgerScenarios(newSrv, oldSrv *server.ReforgerServer) {
	var oldMods []server.ReforgerMod
	if oldSrv != nil {
		oldMods = oldSrv.ActiveMods
	}

	r.syncNewReforgerMods(newSrv.ActiveMods, oldMods)

	if oldSrv != nil {
		r.syncRemovedReforgerMods(newSrv.ID, newSrv.ActiveMods, oldMods)
	}
}

// maxConcurrentModFetches limits the number of goroutines spawned by
// syncNewReforgerMods when fetching scenario metadata for newly added mods.
const maxConcurrentModFetches = 5

func (r *Router) syncNewReforgerMods(newMods, oldMods []server.ReforgerMod) {
	sem := make(chan struct{}, maxConcurrentModFetches)
	for _, mod := range newMods {
		if !isModInList(mod.ID, oldMods) {
			sem <- struct{}{} // acquire slot; blocks if all slots are taken
			go func(modID string) {
				defer func() { <-sem }()
				r.fetchAndSaveScenarios(modID)
			}(mod.ID)
		}
	}
}

func (r *Router) fetchAndSaveScenarios(modID string) {
	bgCtx := context.Background()
	resp, err := r.workshopService.GetReforgerModScenarios(bgCtx, modID)
	if err == nil && resp != nil {
		if err := r.scenarioService.SaveModScenarios(bgCtx, modID, resp.ModName, resp.Scenarios); err != nil {
			log.Printf("[API] Failed to save scenarios for mod %s: %v", modID, err)
		}
	}
}

func (r *Router) syncRemovedReforgerMods(serverID int64, newMods, oldMods []server.ReforgerMod) {
	for _, oldMod := range oldMods {
		if !isModInList(oldMod.ID, newMods) {
			go r.checkAndDeleteScenarios(serverID, oldMod.ID)
		}
	}
}

func (r *Router) checkAndDeleteScenarios(serverID int64, modID string) {
	bgCtx := context.Background()
	servers, err := r.serverService.GetAllServers(bgCtx)
	if err != nil {
		return
	}

	var used bool
	for _, s := range servers {
		rs, ok := s.(*server.ReforgerServer)
		if !ok || rs.ID == serverID {
			continue
		}
		if isModInList(modID, rs.ActiveMods) {
			used = true
			break
		}
	}

	if !used {
		if err := r.scenarioService.DeleteModScenarios(bgCtx, modID); err != nil {
			log.Printf("[API] Failed to delete scenarios for mod %s: %v", modID, err)
		}
	}
}

func isModInList(modID string, list []server.ReforgerMod) bool {
	for _, m := range list {
		if m.ID == modID {
			return true
		}
	}
	return false
}
