package api

import (
	"btcservermanager/internal/domain/modpreset"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

const errInvalidPresetID = "invalid preset ID"

func (r *Router) handleGetAllPresets(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	filter := server.Type(req.URL.Query().Get("filter"))

	presets, err := r.modPresetService.GetAllPresets(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	filtered := []*modpreset.ModPreset{}

	for _, p := range presets {
		if filter == "" || p.Type == filter {
			filtered = append(filtered, p)
		}
	}

	r.json(w, map[string]any{"presets": filtered})
}

func (r *Router) handleGetPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidPresetID, http.StatusBadRequest)
		return
	}

	preset, err := r.modPresetService.GetPreset(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	r.json(w, preset)
}

func (r *Router) handleCreatePreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var p modpreset.ModPreset
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.modPresetService.SavePreset(ctx, &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, p)
}

func (r *Router) handleUpdatePreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidPresetID, http.StatusBadRequest)
		return
	}

	var p modpreset.ModPreset
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	p.ID = id

	if err := r.modPresetService.SavePreset(ctx, &p); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, p)
}

func (r *Router) handleDeletePreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidPresetID, http.StatusBadRequest)
		return
	}
	if err := r.modPresetService.DeletePreset(ctx, id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleUploadLauncherPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	if err := req.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, header, err := req.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	preset, err := r.modPresetService.ImportPreset(ctx, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Optional: if preset name was not found in meta tags, use filename
	if preset.Name == "Imported Preset" && header.Filename != "" {
		preset.Name = header.Filename
		if err := r.modPresetService.SavePreset(ctx, preset); err != nil {
			log.Printf("[API] Failed to update imported preset name: %v", err)
		}
	}

	// Trigger background metadata fetch and installation for all mods in the preset
	r.installPresetMods(preset)

	r.json(w, preset)
}

func (r *Router) installPresetMods(preset *modpreset.ModPreset) {
	go func() {
		bgCtx := context.Background()
		modsToInstall := make([]workshop.WorkshopMod, 0, len(preset.Mods))

		for _, m := range preset.Mods {
			// Fetch fresh metadata (name, icon, size)
			updatedMod, err := r.workshopService.FetchAndSaveMetadata(bgCtx, m.ID, true)
			if err == nil && updatedMod != nil {
				// If mod is not installed, queue for installation
				if updatedMod.InstallationStatus != workshop.InstallationFinished {
					modsToInstall = append(modsToInstall, *updatedMod)
				}
			}
		}

		if len(modsToInstall) > 0 {
			// Trigger a single SteamCMD job for all missing mods
			r.steamCmdService.InstallOrUpdateWorkshopMods(modsToInstall)
		}
	}()
}

func (r *Router) handleExportLauncherPreset(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, errInvalidPresetID, http.StatusBadRequest)
		return
	}

	content, err := r.modPresetService.ExportPreset(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	if _, err := w.Write(content); err != nil {
		log.Printf("[API] Failed to write preset export: %v", err)
	}
}
