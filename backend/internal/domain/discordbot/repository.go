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
		INSERT INTO discord_events (channel_id, message_id, title, date_time, game_type)
		VALUES (?, ?, ?, ?, ?)
	`
	res, err := r.db.ExecContext(ctx, query, e.ChannelID, e.MessageID, e.Title, e.DateTime, e.GameType)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *Repository) GetAllEvents(ctx context.Context) ([]Event, error) {
	query := `
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at
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
		if err := rows.Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt); err != nil {
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
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at
		FROM discord_events
		WHERE id = ?
	`
	var e Event
	if err := r.db.QueryRowContext(ctx, query, id).Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt); err != nil {
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
		SELECT id, channel_id, message_id, title, date_time, game_type, created_at
		FROM discord_events
		WHERE message_id = ?
	`
	var e Event
	if err := r.db.QueryRowContext(ctx, query, messageID).Scan(&e.ID, &e.ChannelID, &e.MessageID, &e.Title, &e.DateTime, &e.GameType, &e.CreatedAt); err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *Repository) GetAttendanceStats(ctx context.Context) ([]RawAttendance, error) {
	query := `
		SELECT p.user_id, u.username, p.status, e.date_time, e.game_type
		FROM discord_event_participations p
		JOIN discord_users u ON p.user_id = u.id
		JOIN discord_events e ON p.event_id = e.id
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
