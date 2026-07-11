package discordbot

import (
	"context"
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) SaveEvent(ctx context.Context, e *Event) (int64, error) {
	query := `
		INSERT INTO discord_events (channel_id, message_id, title, date_time, game_type, reminder_sent)
		VALUES (?, ?, ?, ?, ?, 0)
	`
	res, err := r.db.ExecContext(ctx, query, e.ChannelID, e.MessageID, e.Title, e.DateTime, e.GameType)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *Repository) GetAllEvents(ctx context.Context) ([]Event, error) {
	query := `
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at, reminder_sent
		FROM discord_events
		WHERE date_time >= datetime('now', '-30 days') OR created_at >= datetime('now', '-30 days')
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt, &e.ReminderSent); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

func (r *Repository) GetEventByID(ctx context.Context, id int64) (*Event, error) {
	query := `
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at, reminder_sent
		FROM discord_events
		WHERE id = ?
	`
	var e Event
	if err := r.db.QueryRowContext(ctx, query, id).Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt, &e.ReminderSent); err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *Repository) DeleteEvent(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM discord_events WHERE id = ?", id)
	return err
}

func (r *Repository) UpdateEvent(ctx context.Context, id int64, title, dateTime, gameType string) error {
	query := `
		UPDATE discord_events
		SET title = ?, date_time = ?, game_type = ?
		WHERE id = ?
	`
	_, err := r.db.ExecContext(ctx, query, title, dateTime, gameType, id)
	return err
}

func (r *Repository) UpsertUser(ctx context.Context, id, username string) error {
	query := `
		INSERT INTO discord_users (id, username, updated_at)
		VALUES (?, ?, datetime('now'))
		ON CONFLICT(id) DO UPDATE SET
			username = excluded.username,
			updated_at = excluded.updated_at
	`
	_, err := r.db.ExecContext(ctx, query, id, username)
	return err
}

func (r *Repository) UpsertParticipation(ctx context.Context, eventID int64, userID, status string) error {
	query := `
		INSERT INTO discord_event_participations (event_id, user_id, status, updated_at)
		VALUES (?, ?, ?, datetime('now'))
		ON CONFLICT(event_id, user_id) DO UPDATE SET
			status = excluded.status,
			updated_at = excluded.updated_at
	`
	_, err := r.db.ExecContext(ctx, query, eventID, userID, status)
	return err
}

func (r *Repository) GetEventParticipations(ctx context.Context, eventID int64) ([]Participation, error) {
	query := `
		SELECT p.event_id, p.user_id, u.username, p.status, p.updated_at
		FROM discord_event_participations p
		JOIN discord_users u ON p.user_id = u.id
		WHERE p.event_id = ?
	`
	rows, err := r.db.QueryContext(ctx, query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var parts []Participation
	for rows.Next() {
		var p Participation
		if err := rows.Scan(&p.EventID, &p.UserID, &p.Username, &p.Status, &p.UpdatedAt); err != nil {
			return nil, err
		}
		parts = append(parts, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return parts, nil
}

func (r *Repository) GetEventByMessageID(ctx context.Context, messageID string) (*Event, error) {
	query := `
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at, reminder_sent
		FROM discord_events
		WHERE message_id = ?
	`
	var e Event
	if err := r.db.QueryRowContext(ctx, query, messageID).Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt, &e.ReminderSent); err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *Repository) GetAttendanceStats(ctx context.Context) ([]RawAttendance, error) {
	query := `
		SELECT u.id, u.username, COALESCE(p.status, 'no_response') as status, e.date_time, e.game_type
		FROM discord_users u
		CROSS JOIN discord_events e
		LEFT JOIN discord_event_participations p ON p.user_id = u.id AND p.event_id = e.id
		WHERE u.is_active = 1 OR p.status IS NOT NULL
	`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []RawAttendance
	for rows.Next() {
		var a RawAttendance
		if err := rows.Scan(&a.UserID, &a.Username, &a.Status, &a.DateTime, &a.GameType); err != nil {
			return nil, err
		}
		result = append(result, a)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *Repository) GetPendingReminderEvents(ctx context.Context, hours int) ([]Event, error) {
	query := `
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at, reminder_sent
		FROM discord_events
		WHERE reminder_sent = 0
		  AND datetime(date_time) > datetime('now', 'localtime')
		  AND datetime(date_time) <= datetime('now', 'localtime', '+' || ? || ' hours')
	`
	rows, err := r.db.QueryContext(ctx, query, hours)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt, &e.ReminderSent); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

func (r *Repository) MarkReminderSent(ctx context.Context, eventID int64) error {
	query := `UPDATE discord_events SET reminder_sent = 1 WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, eventID)
	return err
}

func (r *Repository) GetNoResponseUserIDs(ctx context.Context, eventID int64) ([]string, error) {
	query := `
		SELECT u.id
		FROM discord_users u
		WHERE u.is_active = 1
		  AND u.id NOT IN (
		      SELECT p.user_id 
		      FROM discord_event_participations p 
		      WHERE p.event_id = ?
		  )
	`
	rows, err := r.db.QueryContext(ctx, query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var userIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		userIDs = append(userIDs, id)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return userIDs, nil
}

func (r *Repository) GetAllUsers(ctx context.Context) ([]DiscordUser, error) {
	query := `SELECT id, username, is_active, updated_at FROM discord_users WHERE is_active = 1 ORDER BY username ASC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []DiscordUser
	for rows.Next() {
		var u DiscordUser
		if err := rows.Scan(&u.ID, &u.Username, &u.IsActive, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func (r *Repository) GetAllUsersForManagement(ctx context.Context) ([]DiscordUser, error) {
	query := `SELECT id, username, is_active, updated_at FROM discord_users ORDER BY username ASC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []DiscordUser
	for rows.Next() {
		var u DiscordUser
		if err := rows.Scan(&u.ID, &u.Username, &u.IsActive, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func (r *Repository) SetUserActive(ctx context.Context, userID, username string, active bool) error {
	activeVal := 0
	if active {
		activeVal = 1
	}

	if username != "" {
		query := `
			INSERT INTO discord_users (id, username, is_active, updated_at)
			VALUES (?, ?, ?, datetime('now'))
			ON CONFLICT(id) DO UPDATE SET
				username = excluded.username,
				is_active = excluded.is_active,
				updated_at = excluded.updated_at
		`
		_, err := r.db.ExecContext(ctx, query, userID, username, activeVal)
		return err
	}

	query := `UPDATE discord_users SET is_active = ?, updated_at = datetime('now') WHERE id = ?`
	_, err := r.db.ExecContext(ctx, query, activeVal, userID)
	return err
}

func (r *Repository) GetInactiveUserIDs(ctx context.Context) (map[string]bool, error) {
	query := `SELECT id FROM discord_users WHERE is_active = 0`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	inactive := make(map[string]bool)
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		inactive[id] = true
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return inactive, nil
}

func (r *Repository) DeleteParticipation(ctx context.Context, eventID int64, userID string) error {
	query := `DELETE FROM discord_event_participations WHERE event_id = ? AND user_id = ?`
	_, err := r.db.ExecContext(ctx, query, eventID, userID)
	return err
}

func (r *Repository) DeleteUserAndParticipations(ctx context.Context, userID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	if _, err := tx.ExecContext(ctx, `DELETE FROM discord_event_participations WHERE user_id = ?`, userID); err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, `DELETE FROM discord_users WHERE id = ?`, userID); err != nil {
		return err
	}

	return tx.Commit()
}

func (r *Repository) GetMemberQualifications(ctx context.Context, userIDs []string) (map[string][]string, error) {
	result := make(map[string][]string)
	if len(userIDs) == 0 {
		return result, nil
	}

	query := `SELECT user_id, qualification_name FROM member_qualifications`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var userID, qualName string
		if err := rows.Scan(&userID, &qualName); err != nil {
			return nil, err
		}
		result[userID] = append(result[userID], qualName)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) SaveMemberQualifications(ctx context.Context, userIDs []string, qualifications []MemberQualification) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	if len(userIDs) > 0 {
		query := `DELETE FROM member_qualifications WHERE user_id IN (`
		args := make([]interface{}, len(userIDs))
		for i, id := range userIDs {
			if i > 0 {
				query += `,`
			}
			query += `?`
			args[i] = id
		}
		query += `)`
		if _, err := tx.ExecContext(ctx, query, args...); err != nil {
			return err
		}
	}

	if len(qualifications) > 0 {
		stmt, err := tx.PrepareContext(ctx, `INSERT INTO member_qualifications (user_id, qualification_name) VALUES (?, ?)`)
		if err != nil {
			return err
		}
		defer stmt.Close()

		for _, q := range qualifications {
			if _, err := stmt.ExecContext(ctx, q.UserID, q.QualificationName); err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

func (r *Repository) CleanupOrphanedQualifications(ctx context.Context, validNames []string) error {
	if len(validNames) == 0 {
		_, err := r.db.ExecContext(ctx, `DELETE FROM member_qualifications`)
		return err
	}

	// Build IN clause
	query := `DELETE FROM member_qualifications WHERE qualification_name NOT IN (`
	args := make([]interface{}, len(validNames))
	for i, name := range validNames {
		if i > 0 {
			query += `,`
		}
		query += `?`
		args[i] = name
	}
	query += `)`

	_, err := r.db.ExecContext(ctx, query, args...)
	return err
}

func (r *Repository) RenameQualification(ctx context.Context, oldName, newName string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	// 1. Delete old qualification rows for users who already have the new one
	deleteDupQuery := `
		DELETE FROM member_qualifications 
		WHERE qualification_name = ? 
		  AND user_id IN (
			  SELECT user_id FROM member_qualifications WHERE qualification_name = ?
		  )`
	if _, err := tx.ExecContext(ctx, deleteDupQuery, oldName, newName); err != nil {
		return err
	}

	// 2. Update remaining old qualification rows to the new name
	updateQuery := `
		UPDATE member_qualifications 
		SET qualification_name = ? 
		WHERE qualification_name = ?`
	if _, err := tx.ExecContext(ctx, updateQuery, newName, oldName); err != nil {
		return err
	}

	return tx.Commit()
}
