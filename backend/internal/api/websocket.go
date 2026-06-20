package api

import (
	"btcservermanager/internal/api/ws"
	"net/http"
)

func (r *Router) handleWebSocket(w http.ResponseWriter, req *http.Request) {
	ws.ServeWs(r.hub, w, req, r.config.AllowedOrigin)
}
