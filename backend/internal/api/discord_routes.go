package api

import (
	"btcservermanager/internal/domain/discordbot"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

const (
	errDiscordNotConfigured       = "Discord bot not configured"
	errDiscordRepoNotInitialized  = "Discord repository not initialized"
	eventIDRoute                  = "/events/{id}"
	errInvalidEventID             = "Invalid event ID"
)

func (r *Router) discordRoutes() chi.Router {
	mux := chi.NewRouter()

	mux.Get("/status", r.handleGetDiscordStatus)
	mux.Get("/channels", r.handleGetDiscordChannels)
	mux.Get("/roles", r.handleGetDiscordRoles)
	mux.Get("/events", r.handleGetDiscordEvents)
	mux.Post("/events", r.handleCreateDiscordEvent)
	mux.Get("/events/stats", r.handleGetDiscordEventStats)
	mux.Get(eventIDRoute, r.handleGetDiscordEventDetail)
	mux.Put(eventIDRoute, r.handleUpdateDiscordEvent)
	mux.Delete(eventIDRoute, r.handleDeleteDiscordEvent)
	mux.Get("/users", r.handleGetDiscordUsers)
	mux.Patch("/users/{id}/active", r.handleUpdateDiscordUserActive)

	return mux
}

func (r *Router) handleGetDiscordStatus(w http.ResponseWriter, req *http.Request) {
	status := map[string]bool{
		"connected":  false,
		"configured": false,
	}

	if r.discordService != nil {
		status["configured"] = true
		status["connected"] = r.discordService.IsConfigured()
	}

	r.json(w, status)
}

func (r *Router) handleGetDiscordChannels(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	channels, err := r.discordService.GetChannels()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, channels)
}

func (r *Router) handleGetDiscordRoles(w http.ResponseWriter, req *http.Request) {
	roles, err := r.discordService.GetRoles(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if roles == nil {
		roles = []discordbot.DiscordRole{}
	}

	r.json(w, roles)
}

func (r *Router) handleCreateDiscordEvent(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	var payload discordbot.CreateEventRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Title == "" || payload.DateTime == "" || payload.GameType == "" || payload.ChannelID == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	event, err := r.discordService.CreateEventMessage(req.Context(), payload.ChannelID, payload.Title, payload.DateTime, payload.GameType, payload.ImageBase64, payload.Mentions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, event)
}

func (r *Router) handleGetDiscordEvents(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	events, err := r.discordRepo.GetAllEvents(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if events == nil {
		events = []discordbot.Event{}
	}

	r.json(w, events)
}

func (r *Router) handleGetDiscordEventDetail(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, errInvalidEventID, http.StatusBadRequest)
		return
	}

	detail, err := r.discordService.GetEvent(req.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, detail)
}

func (r *Router) handleUpdateDiscordEvent(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, errInvalidEventID, http.StatusBadRequest)
		return
	}

	var payload discordbot.UpdateEventRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Title == "" || payload.DateTime == "" || payload.GameType == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	event, err := r.discordService.UpdateEventMessage(req.Context(), id, payload.Title, payload.DateTime, payload.GameType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, event)
}

func (r *Router) handleDeleteDiscordEvent(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || r.discordRepo == nil {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, errInvalidEventID, http.StatusBadRequest)
		return
	}

	if err := r.discordService.DeleteEvent(req.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleGetDiscordEventStats(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	stats, err := r.discordRepo.GetAttendanceStats(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if stats == nil {
		stats = []discordbot.RawAttendance{}
	}

	r.json(w, stats)
}

func (r *Router) handleGetDiscordUsers(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	users, err := r.discordRepo.GetAllUsersForManagement(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if users == nil {
		users = []discordbot.DiscordUser{}
	}

	r.json(w, users)
}

func (r *Router) handleUpdateDiscordUserActive(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	id := chi.URLParam(req, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var payload struct {
		Active bool `json:"active"`
	}
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.discordRepo.SetUserActive(req.Context(), id, payload.Active); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
