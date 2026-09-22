package api

import (
	"btcservermanager/internal/domain/discordbot"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type SaveRosterRequest struct {
	Data        string                        `json:"data"`
	GameType    string                        `json:"gameType"`
	Assignments []discordbot.PlayerRoleRecord `json:"assignments"`
}

type PublishRosterRequest struct {
	ChannelID string `json:"channelId"`
	Message   string `json:"message"`
}

type SyncRosterPreviewRequest struct {
	ChannelID string `json:"channelId"`
	MessageID string `json:"messageId"`
	Message   string `json:"message"`
}

type SaveTemplateRequest struct {
	Name      string `json:"name"`
	GameType  string `json:"gameType"`
	Structure string `json:"structure"`
}

func (r *Router) handleGetDiscordEventRoster(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, errInvalidEventID, http.StatusBadRequest)
		return
	}

	roster, err := r.discordRepo.GetEventRoster(req.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if roster == nil {
		r.json(w, map[string]interface{}{
			"eventId":   id,
			"data":      "",
			"updatedAt": "",
		})
		return
	}

	r.json(w, roster)
}

func (r *Router) handleSaveDiscordEventRoster(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	idStr := chi.URLParam(req, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, errInvalidEventID, http.StatusBadRequest)
		return
	}

	var payload SaveRosterRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.discordRepo.SaveEventRoster(req.Context(), id, payload.Data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(payload.Assignments) > 0 {
		_ = r.discordRepo.RecordPlayerRoleUsage(req.Context(), payload.Assignments, payload.GameType)
	}

	r.json(w, map[string]bool{"success": true})
}

func (r *Router) handlePublishDiscordEventRoster(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	var payload PublishRosterRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.ChannelID == "" || payload.Message == "" {
		http.Error(w, "channelId and message are required", http.StatusBadRequest)
		return
	}

	if err := r.discordService.PublishRosterMessage(req.Context(), payload.ChannelID, payload.Message); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]bool{"success": true})
}

func (r *Router) handleSyncDiscordEventRosterPreview(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	var payload SyncRosterPreviewRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.ChannelID == "" || payload.Message == "" {
		http.Error(w, "channelId and message are required", http.StatusBadRequest)
		return
	}

	msgID, err := r.discordService.SyncRosterPreview(req.Context(), payload.ChannelID, payload.MessageID, payload.Message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, map[string]interface{}{
		"success":   true,
		"channelId": payload.ChannelID,
		"messageId": msgID,
	})
}

func (r *Router) handleGetDiscordRosterTemplates(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	templates, err := r.discordRepo.GetRosterTemplates(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, templates)
}

func (r *Router) handleSaveDiscordRosterTemplate(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	var payload SaveTemplateRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.Name == "" || payload.Structure == "" {
		http.Error(w, "name and structure are required", http.StatusBadRequest)
		return
	}

	template, err := r.discordRepo.SaveRosterTemplate(req.Context(), payload.Name, payload.GameType, payload.Structure)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, template)
}

func (r *Router) handleDeleteDiscordRosterTemplate(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	idStr := chi.URLParam(req, "templateId")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid template ID", http.StatusBadRequest)
		return
	}

	if err := r.discordRepo.DeleteRosterTemplate(req.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleGetDiscordRosterLearningStats(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	gameType := req.URL.Query().Get("gameType")
	stats, err := r.discordRepo.GetPlayerRoleStats(req.Context(), gameType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	r.json(w, stats)
}
