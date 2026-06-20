package api

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

func (r *Router) handleGetAllMods(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	filter := server.Type(req.URL.Query().Get("filter"))

	log.Printf("[API] handleGetAllMods called (filter: %s)", filter)

	mods, err := r.workshopService.GetAllMods(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Filter by type if provided
	filtered := make([]*workshop.WorkshopMod, 0, len(mods))

	for _, m := range mods {
		if filter == "" || m.ServerType == filter {
			filtered = append(filtered, m)
		}
	}

	// Java includes CreatorDLCs for Arma 3
	cdlcDtos := []map[string]string{}

	if filter == "" || filter == server.TypeArma3 {
		for _, c := range workshop.GetAllCDLCs() {
			cdlcDtos = append(cdlcDtos, map[string]string{
				"id":   c.GetID(),
				"name": c.GetName(),
			})
		}
	}

	r.json(w, map[string]any{
		"workshopMods": filtered,
		"creatorDlcs":  cdlcDtos,
	})
}

func (r *Router) handleGetModNeedsUpdate(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	hasUpdates, err := r.workshopService.HasModUpdates(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.json(w, map[string]bool{"hasUpdates": hasUpdates})
}

func (r *Router) handleGetMod(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid mod ID", http.StatusBadRequest)
		return
	}

	mod, err := r.workshopService.GetMod(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	r.json(w, mod)
}

func (r *Router) handleInstallOrUpdateMods(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	modIds, err := parseModIDsFromRequest(req)
	if err != nil || len(modIds) == 0 {
		http.Error(w, "No mod IDs provided", http.StatusBadRequest)
		return
	}

	// In Java: modsFacade.saveAndInstallMods(modIds)
	modsToInstall := make([]workshop.WorkshopMod, 0, len(modIds))

	for _, id := range modIds {
		// Ensure metadata is fetched/saved first
		mod, err := r.workshopService.FetchAndSaveMetadata(ctx, id, true)
		if err == nil && mod != nil {
			modsToInstall = append(modsToInstall, *mod)
		}
	}

	if len(modsToInstall) > 0 {
		r.steamCmdService.InstallOrUpdateWorkshopMods(modsToInstall)
	}

	w.WriteHeader(http.StatusOK)
}

func parseModIDsFromRequest(req *http.Request) ([]int64, error) {
	if modIds := parseQueryModIDs(req.URL.Query().Get("modIds")); len(modIds) > 0 {
		return modIds, nil
	}

	// Try body if modIds is still empty
	body, err := io.ReadAll(io.LimitReader(req.Body, 1<<20)) // 1MB limit to prevent heap exhaustion
	if err != nil || len(body) == 0 {
		return nil, err
	}

	// Try parsing as simple array of IDs first
	var modIds []int64
	if err := json.Unmarshal(body, &modIds); err == nil {
		return modIds, nil
	}

	return parseBodyAsObjectList(body), nil
}

func parseQueryModIDs(queryStr string) []int64 {
	if queryStr == "" {
		return nil
	}
	var modIds []int64
	for _, s := range strings.Split(queryStr, ",") {
		if id, err := strconv.ParseInt(strings.TrimSpace(s), 10, 64); err == nil {
			modIds = append(modIds, id)
		}
	}
	return modIds
}

func parseBodyAsObjectList(body []byte) []int64 {
	var rawMods []map[string]any
	if err := json.Unmarshal(body, &rawMods); err != nil {
		return nil
	}
	var modIds []int64
	for _, m := range rawMods {
		if idVal, ok := m["id"]; ok {
			if id, ok := extractInt64FromRawValue(idVal); ok {
				modIds = append(modIds, id)
			}
		}
	}
	return modIds
}

func extractInt64FromRawValue(v any) (int64, bool) {
	switch val := v.(type) {
	case float64:
		return int64(val), true
	case string:
		if id, err := strconv.ParseInt(val, 10, 64); err == nil {
			return id, true
		}
		if id, err := strconv.ParseInt(val, 16, 64); err == nil {
			return id, true
		}
	}
	return 0, false
}

func (r *Router) handleInstallOrUpdateMod(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		id, err = strconv.ParseInt(idStr, 16, 64)
	}

	if err != nil {
		http.Error(w, "Invalid mod ID", http.StatusBadRequest)
		return
	}

	mod, err := r.workshopService.FetchAndSaveMetadata(ctx, id, true)
	if err == nil && mod != nil {
		r.steamCmdService.InstallOrUpdateWorkshopMods([]workshop.WorkshopMod{*mod})
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleUninstallMod(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	idStr := chi.URLParam(req, "id")

	if idStr != "" {
		id, err := parseModID(idStr)
		if err != nil {
			http.Error(w, "Invalid mod ID", http.StatusBadRequest)
			return
		}

		// Preemptive validation: check if the mod is active on any running servers
		if err := r.validateModNotActive(ctx, id); err != nil {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}

		err = r.workshopService.DeleteMod(ctx, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		modIdsStr := req.URL.Query().Get("modIds")
		if modIdsStr != "" {
			if err := r.deleteMultipleMods(ctx, modIdsStr); err != nil {
				http.Error(w, err.Error(), http.StatusConflict)
				return
			}
		}
	}

	w.WriteHeader(http.StatusNoContent)
}

func parseModID(idStr string) (int64, error) {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		id, err = strconv.ParseInt(idStr, 16, 64)
	}
	return id, err
}

func (r *Router) validateModNotActive(ctx context.Context, id int64) error {
	activeServers, err := r.serverService.GetActiveServersForMod(ctx, id)
	if err != nil {
		log.Printf("[API] Error checking active servers for mod %d: %v", id, err)
	}
	if len(activeServers) > 0 {
		return fmt.Errorf("cannot delete mod because it is currently active on the running server(s): %s; please stop the server(s) first", strings.Join(activeServers, ", "))
	}
	return nil
}

func (r *Router) deleteMultipleMods(ctx context.Context, modIdsStr string) error {
	activeModsErrors := []string{}
	for _, s := range strings.Split(modIdsStr, ",") {
		id, err := parseModID(s)
		if err == nil {
			// Check active servers for this mod
			activeServers, srvErr := r.serverService.GetActiveServersForMod(ctx, id)
			if srvErr == nil && len(activeServers) > 0 {
				var modName string
				if m, fetchErr := r.workshopService.GetMod(ctx, id); fetchErr == nil && m != nil {
					modName = m.Name
				} else {
					modName = fmt.Sprintf("Mod ID %d", id)
				}
				activeModsErrors = append(activeModsErrors, fmt.Sprintf("'%s' is active on running server(s): %s", modName, strings.Join(activeServers, ", ")))
				continue
			}

			_ = r.workshopService.DeleteMod(ctx, id)
		}
	}

	if len(activeModsErrors) > 0 {
		return fmt.Errorf("some mods could not be deleted because they are active on running servers:\n%s", strings.Join(activeModsErrors, "\n"))
	}
	return nil
}

func (r *Router) handleSetModServerOnly(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid mod ID", http.StatusBadRequest)
		return
	}

	var body struct {
		ServerOnly bool `json:"serverOnly"`
	}

	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update mod server only status
	mod, err := r.workshopService.GetMod(ctx, id)
	if err != nil {
		http.Error(w, "Mod not found", http.StatusNotFound)
		return
	}

	mod.ServerOnly = body.ServerOnly
	if err := r.workshopService.SaveMod(ctx, mod); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleUpdateAllMods(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	err := r.workshopService.UpdateAllMods(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// In Java, this also queues SteamCMD. Let's get all mods and queue them.
	mods, _ := r.workshopService.GetAllMods(ctx)
	if len(mods) > 0 {
		workshopMods := []workshop.WorkshopMod{}
		for _, m := range mods {
			workshopMods = append(workshopMods, *m)
		}

		r.steamCmdService.InstallOrUpdateWorkshopMods(workshopMods)
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleSyncBiKeys(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	err := r.workshopService.SyncAllBiKeys(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleGetModStatus(w http.ResponseWriter, req *http.Request) {
	r.json(w, r.steamCmdService.GetAllItemInfo())
}

func (r *Router) handleGetCreatorDlcs(w http.ResponseWriter, req *http.Request) {
	cdlcs := workshop.GetAllCDLCs()

	dtos := []map[string]string{}

	for _, c := range cdlcs {
		dtos = append(dtos, map[string]string{
			"id":   c.GetID(),
			"name": c.GetName(),
		})
	}

	r.json(w, dtos)
}

func (r *Router) handleSearchSteamMods(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	query := req.URL.Query().Get("q")
	appIdStr := req.URL.Query().Get("appId")
	pageStr := req.URL.Query().Get("page")

	if query == "" {
		http.Error(w, "Query is required", http.StatusBadRequest)
		return
	}

	var appId int64
	if appIdStr != "" {
		var err error
		appId, err = strconv.ParseInt(appIdStr, 10, 64)
		if err != nil {
			http.Error(w, "invalid appId", http.StatusBadRequest)
			return
		}
	}
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	mods, total, err := r.workshopService.SearchSteamMods(ctx, query, appId, page)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]any{
		"mods":  mods,
		"total": total,
	})
}

// Reforger Workshop Handlers

func (r *Router) handleSearchReforgerMods(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	query := req.URL.Query().Get("q")
	pageStr := req.URL.Query().Get("page")
	page := 1

	if p, err := strconv.Atoi(pageStr); err == nil {
		page = p
	}

	if len(query) < 2 {
		http.Error(w, "Query too short", http.StatusBadRequest)
		return
	}

	mods, err := r.workshopService.SearchReforgerMods(ctx, query, page)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, mods)
}

func (r *Router) handleGetReforgerModDetails(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id := chi.URLParam(req, "id")

	details, err := r.workshopService.GetReforgerModDetails(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, details)
}
