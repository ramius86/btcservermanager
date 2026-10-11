package api

import (
	"btcservermanager/internal/domain/server"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (r *Router) handleAddHeadlessClient(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid server ID", http.StatusBadRequest)
		return
	}
	if err := r.serverService.AddHeadlessClient(ctx, id); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, server.ErrServerNotRunning) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleRemoveHeadlessClient(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id, err := strconv.ParseInt(chi.URLParam(req, "id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid server ID", http.StatusBadRequest)
		return
	}
	if err := r.serverService.RemoveHeadlessClient(ctx, id); err != nil {
		if errors.Is(err, server.ErrServerNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		if errors.Is(err, server.ErrServerNotRunning) {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
