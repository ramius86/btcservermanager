package api

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/steamauth"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func (r *Router) handleGetSteamCmdStatus(w http.ResponseWriter, req *http.Request) {
	statusMap := r.steamCmdService.GetAllItemInfo()

	// Convert the map[string]ItemInfo to match the frontend expectations.
	// In Java it was a map of Mod ID -> Status.
	// We'll return it as a raw map for now and let frontend handle it.
	r.json(w, statusMap)
}

func (r *Router) handleUpdateSteamCmd(w http.ResponseWriter, req *http.Request) {
	r.steamCmdService.UpdateSteamCmd()
	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleCheckServerUpdates(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	serverType := server.Type(req.URL.Query().Get("type"))
	if serverType != "" {
		r.steamCmdService.CheckForUpdates(ctx, serverType)
	} else {
		r.steamCmdService.CheckAllServersForUpdates(ctx)
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleSteamLogin(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var body steamauth.SteamAuth
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.steamAuthService.SaveAuthAccount(ctx, &body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleGetSteamAuthStatus(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	auth, err := r.steamAuthService.GetAuthAccount(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]any{
		"authenticated": auth.Username != "" || auth.RefreshToken != "",
		"username":      auth.Username,
		"accountName":   auth.AccountName,
		"hasPassword":   auth.Password != "",
		"hasToken":      auth.RefreshToken != "",
	})
}

func (r *Router) handleBeginSteamQR(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	resp, err := r.steamQRService.BeginSession(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, resp.Response)
}

func (r *Router) handlePollSteamQR(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var body struct {
		ClientID  string `json:"client_id"`
		RequestID string `json:"request_id"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := r.steamQRService.PollStatus(ctx, body.ClientID, body.RequestID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, resp.Response)
}

func (r *Router) handleTestSteamLogin(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	var body steamauth.SteamAuth
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	password := body.Password
	if password == "" {
		// Fallback to saved password if provided is empty
		savedAuth, _ := r.steamAuthService.GetAuthAccount(ctx)
		if savedAuth != nil && savedAuth.Username == body.Username {
			password = savedAuth.Password
		}
	}

	err := r.steamCmdService.TestLogin(ctx, body.Username, password, body.SteamGuardToken)
	if err != nil {
		r.json(w, map[string]any{
			"success": false,
			"error":   err.Error(),
		})

		return
	}

	r.json(w, map[string]any{
		"success": true,
	})
}

func (r *Router) handleGetSteamCmdLog(w http.ResponseWriter, req *http.Request) {
	// Try to get from memory buffer first for real-time feel
	content := r.steamCmdService.GetRecentLogs()
	if content != "" {
		r.json(w, map[string]string{"content": content})
		return
	}

	// Fallback to file if memory is empty
	logPath := r.paths.GetSteamCmdLogFile()

	fileContent, err := os.ReadFile(logPath)
	if err != nil {
		r.json(w, map[string]string{"content": "Log file not found or empty."})
		return
	}

	linesStr := req.URL.Query().Get("count")
	lines := 100

	if l, err := strconv.Atoi(linesStr); err == nil {
		lines = l
	}

	linesList := strings.Split(string(fileContent), "\n")
	if len(linesList) > lines {
		linesList = linesList[len(linesList)-lines:]
	}

	r.json(w, map[string]string{"content": strings.Join(linesList, "\n")})
}
