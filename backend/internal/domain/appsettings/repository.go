package appsettings

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetSettings(ctx context.Context) (*AppSettings, error) {
	var s AppSettings
	var memberRoleIDsJSON string
	var qualificationNamesJSON string

	query := `SELECT id, log_retention_days, log_max_total_size_mb, discord_reminder_hours, discord_reminder_message, member_role_ids, qualification_names, discord_alert_channel_id, discord_alert_server_offline, discord_alert_mod_updates, discord_alert_game_updates, mod_update_check_interval_minutes, game_update_check_interval_minutes, COALESCE(event_roster_enabled, 1) FROM app_settings LIMIT 1`

	err := r.db.QueryRowContext(ctx, query).Scan(
		&s.ID,
		&s.LogRetentionDays,
		&s.LogMaxTotalSizeMB,
		&s.DiscordReminderHours,
		&s.DiscordReminderMessage,
		&memberRoleIDsJSON,
		&qualificationNamesJSON,
		&s.DiscordAlertChannelID,
		&s.DiscordAlertServerOffline,
		&s.DiscordAlertModUpdates,
		&s.DiscordAlertGameUpdates,
		&s.ModUpdateCheckIntervalMinutes,
		&s.GameUpdateCheckIntervalMinutes,
		&s.EventRosterEnabled,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return default
			return &AppSettings{
				LogRetentionDays:               30,
				LogMaxTotalSizeMB:              1024,
				DiscordReminderHours:           0,
				DiscordReminderMessage:         "Reminder: Please update your RSVP for the upcoming event!",
				MemberRoleIDs:                  []string{},
				QualificationNames:             []string{},
				DiscordAlertChannelID:          "",
				DiscordAlertServerOffline:      false,
				DiscordAlertModUpdates:         false,
				DiscordAlertGameUpdates:        false,
				ModUpdateCheckIntervalMinutes:  360,
				GameUpdateCheckIntervalMinutes: 15,
				EventRosterEnabled:             true,
			}, nil
		}
		return nil, err
	}

	if memberRoleIDsJSON != "" {
		_ = json.Unmarshal([]byte(memberRoleIDsJSON), &s.MemberRoleIDs)
	}
	if s.MemberRoleIDs == nil {
		s.MemberRoleIDs = []string{}
	}

	if qualificationNamesJSON != "" {
		_ = json.Unmarshal([]byte(qualificationNamesJSON), &s.QualificationNames)
	}
	if s.QualificationNames == nil {
		s.QualificationNames = []string{}
	}

	if s.ModUpdateCheckIntervalMinutes <= 0 {
		s.ModUpdateCheckIntervalMinutes = 360
	}
	if s.GameUpdateCheckIntervalMinutes <= 0 {
		s.GameUpdateCheckIntervalMinutes = 15
	}

	return &s, nil
}

func (r *Repository) Save(ctx context.Context, s *AppSettings) error {
	var id int64
	err := r.db.QueryRowContext(ctx, "SELECT id FROM app_settings LIMIT 1").Scan(&id)

	if s.MemberRoleIDs == nil {
		s.MemberRoleIDs = []string{}
	}
	if s.QualificationNames == nil {
		s.QualificationNames = []string{}
	}
	if s.ModUpdateCheckIntervalMinutes <= 0 {
		s.ModUpdateCheckIntervalMinutes = 360
	}
	if s.GameUpdateCheckIntervalMinutes <= 0 {
		s.GameUpdateCheckIntervalMinutes = 15
	}

	rolesBytes, _ := json.Marshal(s.MemberRoleIDs)
	qualBytes, _ := json.Marshal(s.QualificationNames)
	rolesJSON := string(rolesBytes)
	qualJSON := string(qualBytes)

	if errors.Is(err, sql.ErrNoRows) {
		query := `INSERT INTO app_settings (
			log_retention_days, log_max_total_size_mb, discord_reminder_hours, discord_reminder_message, member_role_ids, qualification_names,
			discord_alert_channel_id, discord_alert_server_offline, discord_alert_mod_updates, discord_alert_game_updates, mod_update_check_interval_minutes, game_update_check_interval_minutes, event_roster_enabled
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		_, err = r.db.ExecContext(ctx, query,
			s.LogRetentionDays, s.LogMaxTotalSizeMB, s.DiscordReminderHours, s.DiscordReminderMessage, rolesJSON, qualJSON,
			s.DiscordAlertChannelID, s.DiscordAlertServerOffline, s.DiscordAlertModUpdates, s.DiscordAlertGameUpdates, s.ModUpdateCheckIntervalMinutes, s.GameUpdateCheckIntervalMinutes, s.EventRosterEnabled,
		)
	} else if err != nil {
		return err
	} else {
		query := `UPDATE app_settings SET
			log_retention_days = ?, log_max_total_size_mb = ?, discord_reminder_hours = ?, discord_reminder_message = ?, member_role_ids = ?, qualification_names = ?,
			discord_alert_channel_id = ?, discord_alert_server_offline = ?, discord_alert_mod_updates = ?, discord_alert_game_updates = ?, mod_update_check_interval_minutes = ?, game_update_check_interval_minutes = ?, event_roster_enabled = ?
			WHERE id = ?`
		_, err = r.db.ExecContext(ctx, query,
			s.LogRetentionDays, s.LogMaxTotalSizeMB, s.DiscordReminderHours, s.DiscordReminderMessage, rolesJSON, qualJSON,
			s.DiscordAlertChannelID, s.DiscordAlertServerOffline, s.DiscordAlertModUpdates, s.DiscordAlertGameUpdates, s.ModUpdateCheckIntervalMinutes, s.GameUpdateCheckIntervalMinutes, s.EventRosterEnabled,
			id,
		)
	}

	return err
}
