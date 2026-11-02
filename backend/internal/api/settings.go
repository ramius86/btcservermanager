package api

import (
	"btcservermanager/internal/domain/appsettings"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func (r *Router) handleGetAppSettings(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	settings, err := r.systemService.GetAppSettings(ctx)
	if err != nil {
		r.respondInternalError(w, err)
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
	body, err := io.ReadAll(http.MaxBytesReader(w, req.Body, 1048576))
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// An absent "qualificationNames" decodes into an empty slice, and an empty
	// slice makes CleanupOrphanedQualifications delete every row. Requiring the
	// field keeps "no qualifications" an explicit statement from the client and
	// stops a partial payload from erasing member data.
	var provided map[string]json.RawMessage
	if err := json.Unmarshal(body, &provided); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if _, ok := provided["qualificationNames"]; !ok {
		http.Error(w, `"qualificationNames" is required: an absent field is not an empty list, and an empty list deletes every member qualification`, http.StatusBadRequest)
		return
	}

	if len(payload.Renames) > 0 && r.discordService != nil {
		for _, rename := range payload.Renames {
			if rename.OldName != "" && rename.NewName != "" {
				if err := r.discordService.RenameQualification(ctx, rename.OldName, rename.NewName); err != nil {
					log.Printf("Warning: failed to rename qualification %q to %q: %v", rename.OldName, rename.NewName, err)
				}
			}
		}
	}

	if err := r.systemService.UpdateAppSettings(ctx, &payload.AppSettings); err != nil {
		r.respondInternalError(w, err)
		return
	}

	if r.scheduler != nil && payload.ModUpdateCheckIntervalMinutes > 0 {
		r.scheduler.UpdateWorkshopInterval(payload.ModUpdateCheckIntervalMinutes)
	}
	if r.steamCmdService != nil && payload.GameUpdateCheckIntervalMinutes > 0 {
		r.steamCmdService.UpdateCheckInterval(payload.GameUpdateCheckIntervalMinutes)
	}

	// Reached only when the client sent qualificationNames explicitly, so the
	// empty-slice branch of CleanupOrphanedQualifications is always intentional.
	if r.discordService != nil {
		if err := r.discordService.CleanupOrphanedQualifications(ctx, payload.QualificationNames); err != nil {
			log.Printf("Warning: failed to cleanup orphaned qualifications: %v", err)
		}
	}

	r.json(w, payload.AppSettings)
}
