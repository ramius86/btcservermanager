package api

import (
	"btcservermanager/internal/domain/appsettings"
	"encoding/json"
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
	var s appsettings.AppSettings
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&s); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.systemService.UpdateAppSettings(ctx, &s); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, s)
}
