package api

import (
	"btcservermanager/internal/domain/discordbot"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

const (
	errDiscordNotConfigured         = "Discord bot not configured"
	errDiscordServiceNotInitialized = "Discord service not initialized"
	eventIDRoute                    = "/events/{id}"
	errInvalidEventID               = "Invalid event ID"
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
	mux.Patch("/users/{id}/games", r.handleUpdateDiscordUserGames)
	mux.Delete("/users/{id}", r.handleDeleteDiscordUser)
	mux.Post("/users/merge", r.handleMergeDiscordUsers)
	mux.Get("/members", r.handleGetDiscordGuildMembers)
	mux.Put("/events/{id}/participants", r.handleUpdateDiscordEventParticipation)
	mux.Get("/clan-members", r.handleGetClanMembers)
	mux.Put("/clan-members/qualifications", r.handleSaveClanQualifications)
	mux.Post("/alerts/test", r.handleTestDiscordAlert)

	// Event Roster & Templates
	mux.Get("/events/{id}/roster", r.handleGetDiscordEventRoster)
	mux.Put("/events/{id}/roster", r.handleSaveDiscordEventRoster)
	mux.Post("/events/{id}/roster/publish", r.handlePublishDiscordEventRoster)
	mux.Post("/events/{id}/roster/preview", r.handleSyncDiscordEventRosterPreview)
	mux.Get("/roster/templates", r.handleGetDiscordRosterTemplates)
	mux.Post("/roster/templates", r.handleSaveDiscordRosterTemplate)
	mux.Delete("/roster/templates/{templateId}", r.handleDeleteDiscordRosterTemplate)
	mux.Get("/roster/learning-stats", r.handleGetDiscordRosterLearningStats)

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
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	events, err := r.discordService.GetAllEvents(req.Context())
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
	if r.discordService == nil {
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
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	stats, err := r.discordService.GetAttendanceStats(req.Context())
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
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	users, err := r.discordService.GetAllUsersForManagement(req.Context())
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
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	id := chi.URLParam(req, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var payload struct {
		Username string `json:"username"`
		Active   bool   `json:"active"`
	}
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.discordService.SetUserActive(req.Context(), id, payload.Username, payload.Active); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleUpdateDiscordUserGames(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	id := chi.URLParam(req, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	var payload struct {
		PlaysArma3    bool `json:"playsArma3"`
		PlaysReforger bool `json:"playsReforger"`
	}
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.discordService.SetUserGames(req.Context(), id, payload.PlaysArma3, payload.PlaysReforger); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleDeleteDiscordUser(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil {
		http.Error(w, "Discord service not configured", http.StatusInternalServerError)
		return
	}

	id := chi.URLParam(req, "id")
	if id == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	if err := r.discordService.DeleteUser(req.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

type MergeDiscordUsersRequest struct {
	SourceUserID string `json:"sourceUserId"`
	TargetUserID string `json:"targetUserId"`
}

func (r *Router) handleMergeDiscordUsers(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil {
		http.Error(w, errDiscordServiceNotInitialized, http.StatusInternalServerError)
		return
	}

	var payload MergeDiscordUsersRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.SourceUserID == "" || payload.TargetUserID == "" {
		http.Error(w, "Both sourceUserId and targetUserId are required", http.StatusBadRequest)
		return
	}
	if payload.SourceUserID == payload.TargetUserID {
		http.Error(w, "sourceUserId and targetUserId cannot be the same", http.StatusBadRequest)
		return
	}

	if err := r.discordService.MergeUsers(req.Context(), payload.SourceUserID, payload.TargetUserID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]bool{"success": true})
}

func (r *Router) handleGetDiscordGuildMembers(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	members, err := r.discordService.GetGuildMembers(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if members == nil {
		members = []discordbot.GuildMember{}
	}

	r.json(w, members)
}

func (r *Router) handleUpdateDiscordEventParticipation(w http.ResponseWriter, req *http.Request) {
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

	var payload discordbot.ManualParticipationRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.UserID == "" || payload.Username == "" || payload.Status == "" {
		http.Error(w, "userId, username, and status are required", http.StatusBadRequest)
		return
	}

	err = r.discordService.UpdateManualParticipation(req.Context(), id, payload.UserID, payload.Username, payload.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (r *Router) handleTestDiscordAlert(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	var payload struct {
		ChannelID string `json:"channelId"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.ChannelID == "" {
		http.Error(w, "channelId is required", http.StatusBadRequest)
		return
	}

	if err := r.discordService.SendTestAlert(req.Context(), payload.ChannelID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]bool{"success": true})
}
