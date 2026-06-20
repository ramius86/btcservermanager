package api

import (
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/system"
	"btcservermanager/internal/domain/workshop"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/go-chi/chi/v5"
)

/*
This file is part of the API Servers split.
It handles the HTTP endpoints for SteamCMD installations, game updates, and branch management.

DO NOT place configuration editing (CRUD) or runtime process management (Lifecycle) logic here.

Other files in this split:
- servers.go: Index/Hub file explaining the split.
- servers_crud.go: CRUD operations for server configurations.
- servers_lifecycle.go: Server process lifecycle (Start, Stop, Status).
*/

func (r *Router) handleGetAllInstallations(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	insts, err := r.installationService.GetAllInstallations(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Fetch all servers to get query ports for A2S queries
	servers, _ := r.serverService.GetAllServers(ctx)
	typeToQueryPort := r.buildQueryPortMap(servers)

	// Inject progress and refresh local versions
	var wg sync.WaitGroup
	for _, inst := range insts {
		inst := inst
		wg.Add(1)

		go func(inst *installation.ServerInstallation) {
			defer wg.Done()
			r.refreshInstallationDetails(inst, typeToQueryPort)
		}(inst)
	}

	wg.Wait()

	r.json(w, insts)
}

func (r *Router) buildQueryPortMap(servers []any) map[server.Type]int {
	typeToQueryPort := make(map[server.Type]int)

	for _, srv := range servers {
		var qPort int
		var port int
		var t server.Type

		switch v := srv.(type) {
		case *server.Arma3Server:
			qPort = v.QueryPort
			port = v.Port
			t = v.Type
		case *server.DayZServer:
			qPort = v.QueryPort
			port = v.Port
			t = v.Type
		case *server.ReforgerServer:
			qPort = v.QueryPort
			port = v.Port
			t = v.Type
		}

		// Use QueryPort if available, otherwise fallback to Port+1 (common for Arma3/DayZ)
		if qPort == 0 && port != 0 {
			qPort = port + 1
		}

		if t != "" {
			typeToQueryPort[t] = qPort
		}
	}

	return typeToQueryPort
}

func (r *Router) refreshInstallationDetails(inst *installation.ServerInstallation, typeToQueryPort map[server.Type]int) {
	inst.Progress = r.steamCmdService.GetProgress("server:" + string(inst.Type))

	// Ensure InstalledBuildID is up to date from manifest if we have a finished installation
	if inst.InstallationStatus == workshop.InstallationFinished {
		serverPath := r.paths.GetServerPath(inst.Type)

		buildID := installation.ReadBuildIDFromManifest(serverPath, server.ServerIDs[inst.Type])
		if buildID != "" {
			inst.InstalledBuildID = buildID
			_ = r.installationService.UpdateBuildID(context.Background(), inst.Type, buildID)
		}
	}

	// If still unknown, try the "Old Manager" way: A2S Query (UDP)
	// This works even on Linux where steam.inf is missing, provided the server is running.
	shouldQueryA2S := (inst.Version == "" || inst.Version == "Unknown") && typeToQueryPort[inst.Type] != 0
	if shouldQueryA2S {
		addr := fmt.Sprintf("127.0.0.1:%d", typeToQueryPort[inst.Type])
		if info, err := system.QueryServerInfo(addr); err == nil && info.Version != "" {
			inst.Version = info.Version
			_ = r.installationService.UpdateVersion(context.Background(), inst.Type, info.Version)
		}
	}
}

func (r *Router) handleGetInstallation(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	t := server.Type(chi.URLParam(req, "type"))

	inst, err := r.installationService.GetInstallation(ctx, t)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	// Inject progress
	inst.Progress = r.steamCmdService.GetProgress("server:" + string(inst.Type))

	r.json(w, inst)
}

func (r *Router) handleInstallOrUpdateServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	t := server.Type(chi.URLParam(req, "type"))
	inst, err := r.installationService.GetInstallation(ctx, t)
	if err != nil {
		// If not found, create a default one to allow installation
		inst = &installation.ServerInstallation{
			Type:               t,
			InstallationStatus: workshop.InstallationNotInstalled,
			Branch:             installation.BranchPublic,
		}
	}

	r.steamCmdService.InstallOrUpdateServer(inst)
	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleSetServerBranch(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	t := server.Type(chi.URLParam(req, "type"))

	var body struct {
		Branch installation.Branch `json:"branch"`
	}

	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.installationService.SetServerBranch(ctx, t, body.Branch); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleUninstallServer(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	t := server.Type(chi.URLParam(req, "type"))

	// Strict Validation: Ensure there are NO configured server instances for this game type.
	servers, err := r.serverService.GetAllServers(ctx)
	if err == nil {
		hasConfiguredServers := false
		for _, srv := range servers {
			var sType server.Type
			switch v := srv.(type) {
			case *server.Arma3Server:
				sType = v.Type
			case *server.DayZServer:
				sType = v.Type
			case *server.ReforgerServer:
				sType = v.Type
			}

			if sType == t {
				hasConfiguredServers = true
				break
			}
		}

		if hasConfiguredServers {
			http.Error(w, fmt.Sprintf("Cannot uninstall %s because server configurations still exist. Please delete them all first.", t), http.StatusBadRequest)
			return
		}
	}

	if err := r.steamCmdService.UninstallServer(ctx, t); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
