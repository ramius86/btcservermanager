package discordbot

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
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

func (r *Repository) UpdateUserNickname(ctx context.Context, id, username string) (bool, error) {
	if id == "" || username == "" {
		return false, nil
	}
	query := `
		UPDATE discord_users
		SET username = ?, updated_at = datetime('now')
		WHERE id = ? AND username != ?
	`
	res, err := r.db.ExecContext(ctx, query, username, id, username)
	if err != nil {
		return false, err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return false, err
	}
	return rows > 0, nil
}

func (r *Repository) SyncUserNicknames(ctx context.Context, memberNames map[string]string) (int, error) {
	if len(memberNames) == 0 {
		return 0, nil
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer func() { _ = tx.Rollback() }()

	stmt, err := tx.PrepareContext(ctx, `
		UPDATE discord_users
		SET username = ?, updated_at = datetime('now')
		WHERE id = ? AND username != ?
	`)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	updatedCount := 0
	for id, name := range memberNames {
		if id == "" || name == "" {
			continue
		}
		res, err := stmt.ExecContext(ctx, name, id, name)
		if err != nil {
			return 0, err
		}
		if rows, _ := res.RowsAffected(); rows > 0 {
			updatedCount++
		}
	}

	if err := tx.Commit(); err != nil {
		return 0, err
	}
	return updatedCount, nil
}

func (r *Repository) GetActiveEventsForUser(ctx context.Context, userID string) ([]Event, error) {
	query := `
		SELECT e.id, e.channel_id, e.message_id, e.title, e.date_time, e.game_type, e.created_at, e.reminder_sent
		FROM discord_events e
		JOIN discord_event_participations p ON e.id = p.event_id
		WHERE p.user_id = ? AND e.date_time >= datetime('now', '-2 hours')
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
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
	return events, rows.Err()
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
		FROM (SELECT id, username FROM discord_users WHERE is_active = 1) u
		CROSS JOIN discord_events e
		LEFT JOIN discord_event_participations p ON p.user_id = u.id AND p.event_id = e.id
		UNION ALL
		SELECT u.id, u.username, p.status, e.date_time, e.game_type
		FROM discord_event_participations p
		JOIN discord_users u ON u.id = p.user_id AND u.is_active = 0
		JOIN discord_events e ON e.id = p.event_id
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

	placeholders := make([]string, len(userIDs))
	args := make([]any, len(userIDs))
	for i, id := range userIDs {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT user_id, qualification_name FROM member_qualifications WHERE user_id IN (%s)`, strings.Join(placeholders, ","))
	rows, err := r.db.QueryContext(ctx, query, args...)
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

func (r *Repository) GetEventRoster(ctx context.Context, eventID int64) (*EventRoster, error) {
	query := `SELECT event_id, data, updated_at FROM discord_event_rosters WHERE event_id = ?`
	var roster EventRoster
	err := r.db.QueryRowContext(ctx, query, eventID).Scan(&roster.EventID, &roster.Data, &roster.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &roster, nil
}

func (r *Repository) SaveEventRoster(ctx context.Context, eventID int64, data string) error {
	query := `
		INSERT INTO discord_event_rosters (event_id, data, updated_at)
		VALUES (?, ?, datetime('now'))
		ON CONFLICT(event_id) DO UPDATE SET
			data = excluded.data,
			updated_at = excluded.updated_at
	`
	_, err := r.db.ExecContext(ctx, query, eventID, data)
	return err
}

func (r *Repository) GetRosterTemplates(ctx context.Context) ([]RosterTemplate, error) {
	query := `SELECT id, name, game_type, structure, created_at FROM discord_roster_templates ORDER BY created_at ASC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []RosterTemplate
	for rows.Next() {
		var t RosterTemplate
		if err := rows.Scan(&t.ID, &t.Name, &t.GameType, &t.Structure, &t.CreatedAt); err != nil {
			return nil, err
		}
		templates = append(templates, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if templates == nil {
		templates = []RosterTemplate{}
	}
	return templates, nil
}

func (r *Repository) SaveRosterTemplate(ctx context.Context, name, gameType, structure string) (*RosterTemplate, error) {
	query := `
		INSERT INTO discord_roster_templates (name, game_type, structure, created_at)
		VALUES (?, ?, ?, datetime('now'))
	`
	res, err := r.db.ExecContext(ctx, query, name, gameType, structure)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	return &RosterTemplate{
		ID:        id,
		Name:      name,
		GameType:  gameType,
		Structure: structure,
	}, nil
}

func (r *Repository) DeleteRosterTemplate(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM discord_roster_templates WHERE id = ?`, id)
	return err
}

func (r *Repository) GetPlayerRoleStats(ctx context.Context, gameType string) ([]PlayerRoleStat, error) {
	var rows *sql.Rows
	var err error
	if gameType == "" || gameType == "all" {
		query := `SELECT user_id, player_name, role, game_type, play_count, last_used_at FROM discord_player_role_history ORDER BY play_count DESC`
		rows, err = r.db.QueryContext(ctx, query)
	} else {
		query := `SELECT user_id, player_name, role, game_type, play_count, last_used_at FROM discord_player_role_history WHERE game_type = ? OR game_type = 'all' ORDER BY play_count DESC`
		rows, err = r.db.QueryContext(ctx, query, gameType)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []PlayerRoleStat
	for rows.Next() {
		var s PlayerRoleStat
		if err := rows.Scan(&s.UserID, &s.PlayerName, &s.Role, &s.GameType, &s.PlayCount, &s.LastUsedAt); err != nil {
			return nil, err
		}
		stats = append(stats, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if stats == nil {
		stats = []PlayerRoleStat{}
	}
	return stats, nil
}

func (r *Repository) RecordPlayerRoleUsage(ctx context.Context, records []PlayerRoleRecord, gameType string) error {
	if len(records) == 0 {
		return nil
	}
	if gameType == "" {
		gameType = "all"
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	stmt, err := tx.PrepareContext(ctx, `
		INSERT INTO discord_player_role_history (user_id, player_name, role, game_type, play_count, last_used_at)
		VALUES (?, ?, ?, ?, 1, datetime('now'))
		ON CONFLICT(user_id, role, game_type) DO UPDATE SET
			player_name = excluded.player_name,
			play_count = play_count + 1,
			last_used_at = excluded.last_used_at
	`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, rec := range records {
		if rec.UserID == "" && rec.PlayerName == "" {
			continue
		}
		uid := rec.UserID
		if uid == "" {
			uid = rec.PlayerName
		}
		if _, err := stmt.ExecContext(ctx, uid, rec.PlayerName, rec.Role, gameType); err != nil {
			return err
		}
	}

	return tx.Commit()
}

// MergeUsers merges sourceUserID into targetUserID across all discord tables and removes sourceUserID.
func (r *Repository) MergeUsers(ctx context.Context, sourceUserID, targetUserID, targetUsername string) error {
	if sourceUserID == "" || targetUserID == "" {
		return errors.New("both source and target user IDs are required")
	}
	if sourceUserID == targetUserID {
		return errors.New("source and target user IDs cannot be the same")
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	// 1. Ensure target user exists in discord_users as active
	if targetUsername != "" {
		_, err = tx.ExecContext(ctx, `
			INSERT INTO discord_users (id, username, is_active, updated_at)
			VALUES (?, ?, 1, datetime('now'))
			ON CONFLICT(id) DO UPDATE SET
				is_active = 1,
				username = excluded.username,
				updated_at = datetime('now')
		`, targetUserID, targetUsername)
	} else {
		_, err = tx.ExecContext(ctx, `
			INSERT INTO discord_users (id, username, is_active, updated_at)
			VALUES (?, COALESCE((SELECT username FROM discord_users WHERE id = ?), ?), 1, datetime('now'))
			ON CONFLICT(id) DO UPDATE SET
				is_active = 1,
				updated_at = datetime('now')
		`, targetUserID, sourceUserID, targetUserID)
	}
	if err != nil {
		return fmt.Errorf("failed to ensure target user: %w", err)
	}

	// 2. Transfer discord_event_participations
	// Delete any source user participations for events where the target user has already responded
	_, err = tx.ExecContext(ctx, `
		DELETE FROM discord_event_participations
		WHERE user_id = ? AND event_id IN (
			SELECT event_id FROM discord_event_participations WHERE user_id = ?
		)
	`, sourceUserID, targetUserID)
	if err != nil {
		return fmt.Errorf("failed to remove duplicate event participations: %w", err)
	}

	// Transfer all remaining participations to target user
	_, err = tx.ExecContext(ctx, `
		UPDATE discord_event_participations
		SET user_id = ?
		WHERE user_id = ?
	`, targetUserID, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to transfer event participations: %w", err)
	}

	// 3. Transfer member_qualifications
	_, err = tx.ExecContext(ctx, `
		INSERT OR IGNORE INTO member_qualifications (user_id, qualification_name)
		SELECT ?, qualification_name
		FROM member_qualifications
		WHERE user_id = ?
	`, targetUserID, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to transfer qualifications: %w", err)
	}

	_, err = tx.ExecContext(ctx, `DELETE FROM member_qualifications WHERE user_id = ?`, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to clean source qualifications: %w", err)
	}

	// 4. Transfer and merge discord_player_role_history
	// For conflicting (role, game_type), combine play_count and update last_used_at
	_, err = tx.ExecContext(ctx, `
		UPDATE discord_player_role_history
		SET play_count = play_count + (
			SELECT s.play_count
			FROM discord_player_role_history s
			WHERE s.user_id = ? AND s.role = discord_player_role_history.role AND s.game_type = discord_player_role_history.game_type
		),
		last_used_at = MAX(last_used_at, (
			SELECT s.last_used_at
			FROM discord_player_role_history s
			WHERE s.user_id = ? AND s.role = discord_player_role_history.role AND s.game_type = discord_player_role_history.game_type
		))
		WHERE user_id = ?
		  AND EXISTS (
			SELECT 1 FROM discord_player_role_history s
			WHERE s.user_id = ? AND s.role = discord_player_role_history.role AND s.game_type = discord_player_role_history.game_type
		  )
	`, sourceUserID, sourceUserID, targetUserID, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to update role history play counts: %w", err)
	}

	// Delete conflicting rows from source user
	_, err = tx.ExecContext(ctx, `
		DELETE FROM discord_player_role_history
		WHERE user_id = ?
		  AND EXISTS (
			SELECT 1 FROM discord_player_role_history t
			WHERE t.user_id = ? AND t.role = discord_player_role_history.role AND t.game_type = discord_player_role_history.game_type
		  )
	`, sourceUserID, targetUserID)
	if err != nil {
		return fmt.Errorf("failed to remove conflicting source role history: %w", err)
	}

	// Transfer remaining non-conflicting rows to target user
	_, err = tx.ExecContext(ctx, `
		UPDATE discord_player_role_history
		SET user_id = ?
		WHERE user_id = ?
	`, targetUserID, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to reassign role history: %w", err)
	}

	// 5. Update roster JSON data in discord_event_rosters
	_, err = tx.ExecContext(ctx, `
		UPDATE discord_event_rosters
		SET data = replace(data, ?, ?)
		WHERE data LIKE '%' || ? || '%'
	`, sourceUserID, targetUserID, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to update event rosters: %w", err)
	}

	// 6. Delete source user from discord_users
	_, err = tx.ExecContext(ctx, `DELETE FROM discord_users WHERE id = ?`, sourceUserID)
	if err != nil {
		return fmt.Errorf("failed to delete source user: %w", err)
	}

	return tx.Commit()
}
