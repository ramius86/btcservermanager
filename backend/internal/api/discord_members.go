package api

import (
	"btcservermanager/internal/domain/discordbot"
	"encoding/json"
	"net/http"
)

func (r *Router) handleGetClanMembers(w http.ResponseWriter, req *http.Request) {
	if r.discordService == nil || !r.discordService.IsConfigured() {
		http.Error(w, errDiscordNotConfigured, http.StatusServiceUnavailable)
		return
	}

	settings, err := r.systemService.GetAppSettings(req.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	members, err := r.discordService.GetClanMembers(req.Context(), settings.MemberRoleIDs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if members == nil {
		members = []discordbot.ClanMember{}
	}

	r.json(w, members)
}

type SaveQualificationsRequest struct {
	UserIDs        []string                         `json:"userIds"`
	Qualifications []discordbot.MemberQualification `json:"qualifications"`
}

func (r *Router) handleSaveClanQualifications(w http.ResponseWriter, req *http.Request) {
	if r.discordRepo == nil {
		http.Error(w, errDiscordRepoNotInitialized, http.StatusInternalServerError)
		return
	}

	var payload SaveQualificationsRequest
	if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.UserIDs == nil {
		payload.UserIDs = []string{}
	}
	if payload.Qualifications == nil {
		payload.Qualifications = []discordbot.MemberQualification{}
	}

	if err := r.discordRepo.SaveMemberQualifications(req.Context(), payload.UserIDs, payload.Qualifications); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
