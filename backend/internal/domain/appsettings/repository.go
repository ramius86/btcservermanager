package appsettings

import (
	"context"
	"database/sql"
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

	query := `SELECT id, log_retention_days, log_max_total_size_mb FROM app_settings LIMIT 1`

	err := r.db.QueryRowContext(ctx, query).Scan(&s.ID, &s.LogRetentionDays, &s.LogMaxTotalSizeMB)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return default
			return &AppSettings{LogRetentionDays: 30, LogMaxTotalSizeMB: 1024}, nil
		}

		return nil, err
	}

	return &s, nil
}

func (r *Repository) Save(ctx context.Context, s *AppSettings) error {
	var id int64
	err := r.db.QueryRowContext(ctx, "SELECT id FROM app_settings LIMIT 1").Scan(&id)

	if errors.Is(err, sql.ErrNoRows) {
		_, err = r.db.ExecContext(ctx, "INSERT INTO app_settings (log_retention_days, log_max_total_size_mb) VALUES (?, ?)", s.LogRetentionDays, s.LogMaxTotalSizeMB)
	} else if err != nil {
		return err
	} else {
		_, err = r.db.ExecContext(ctx, "UPDATE app_settings SET log_retention_days = ?, log_max_total_size_mb = ? WHERE id = ?", s.LogRetentionDays, s.LogMaxTotalSizeMB, id)
	}

	return err
}
