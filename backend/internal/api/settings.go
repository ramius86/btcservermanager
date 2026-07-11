package api

import (
	"btcservermanager/internal/domain/appsettings"
	"encoding/json"
	"log"
	"net/http"
)

func (r *Router) handleGetAppSettings(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	settings, err := r.systemService.GetAppSettings(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, settings)
}

func (r *Router) handleUpdateAppSettings(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var payload struct {
		appsettings.AppSettings
		Renames []struct {
			OldName string `json:"oldName"`
			NewName string `json:"newName"`
		} `json:"renames"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(payload.Renames) > 0 && r.discordRepo != nil {
		for _, rename := range payload.Renames {
			if rename.OldName != "" && rename.NewName != "" {
				if err := r.discordRepo.RenameQualification(ctx, rename.OldName, rename.NewName); err != nil {
					log.Printf("Warning: failed to rename qualification %q to %q: %v", rename.OldName, rename.NewName, err)
				}
			}
		}
	}

	if err := r.systemService.UpdateAppSettings(ctx, &payload.AppSettings); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if r.discordRepo != nil {
		if err := r.discordRepo.CleanupOrphanedQualifications(ctx, payload.QualificationNames); err != nil {
			log.Printf("Warning: failed to cleanup orphaned qualifications: %v", err)
		}
	}

	r.json(w, payload.AppSettings)
}
