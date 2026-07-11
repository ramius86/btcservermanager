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

	query := `SELECT id, log_retention_days, log_max_total_size_mb, discord_reminder_hours, discord_reminder_message, member_role_ids, qualification_names FROM app_settings LIMIT 1`

	err := r.db.QueryRowContext(ctx, query).Scan(&s.ID, &s.LogRetentionDays, &s.LogMaxTotalSizeMB, &s.DiscordReminderHours, &s.DiscordReminderMessage, &memberRoleIDsJSON, &qualificationNamesJSON)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return default
			return &AppSettings{
				LogRetentionDays:       30,
				LogMaxTotalSizeMB:      1024,
				DiscordReminderHours:   0,
				DiscordReminderMessage: "Reminder: Please update your RSVP for the upcoming event!",
				MemberRoleIDs:          []string{},
				QualificationNames:     []string{},
			}, nil
		}
		// If columns don't exist yet (e.g. before migration), return defaults for the new fields and try again without them
		if err.Error() == "no such column: member_role_ids" {
			query = `SELECT id, log_retention_days, log_max_total_size_mb, discord_reminder_hours, discord_reminder_message FROM app_settings LIMIT 1`
			err = r.db.QueryRowContext(ctx, query).Scan(&s.ID, &s.LogRetentionDays, &s.LogMaxTotalSizeMB, &s.DiscordReminderHours, &s.DiscordReminderMessage)
			if err != nil {
				return nil, err
			}
			s.MemberRoleIDs = []string{}
			s.QualificationNames = []string{}
			return &s, nil
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

	rolesBytes, _ := json.Marshal(s.MemberRoleIDs)
	qualBytes, _ := json.Marshal(s.QualificationNames)
	rolesJSON := string(rolesBytes)
	qualJSON := string(qualBytes)

	if errors.Is(err, sql.ErrNoRows) {
		_, err = r.db.ExecContext(ctx, "INSERT INTO app_settings (log_retention_days, log_max_total_size_mb, discord_reminder_hours, discord_reminder_message, member_role_ids, qualification_names) VALUES (?, ?, ?, ?, ?, ?)", s.LogRetentionDays, s.LogMaxTotalSizeMB, s.DiscordReminderHours, s.DiscordReminderMessage, rolesJSON, qualJSON)
	} else if err != nil {
		return err
	} else {
		_, err = r.db.ExecContext(ctx, "UPDATE app_settings SET log_retention_days = ?, log_max_total_size_mb = ?, discord_reminder_hours = ?, discord_reminder_message = ?, member_role_ids = ?, qualification_names = ? WHERE id = ?", s.LogRetentionDays, s.LogMaxTotalSizeMB, s.DiscordReminderHours, s.DiscordReminderMessage, rolesJSON, qualJSON, id)
	}

	return err
}
