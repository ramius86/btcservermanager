package api

import (
	"net/http"
)

func (r *Router) handleGetSystemInfo(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	info, err := r.systemService.GetSystemInfo(ctx)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	r.json(w, info)
}
