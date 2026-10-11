package steamauth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAuth(ctx context.Context) (*SteamAuth, error) {
	var a SteamAuth

	query := `SELECT id, username, password, steam_guard_token FROM steam_auth LIMIT 1`

	err := r.db.QueryRowContext(ctx, query).Scan(&a.ID, &a.Username, &a.Password, &a.SteamGuardToken)
	if errors.Is(err, sql.ErrNoRows) {
		return &SteamAuth{}, nil
	}

	if err != nil {
		return nil, err
	}

	// Decrypt sensitive fields
	if a.Password, err = decrypt(a.Password); err != nil {
		return nil, fmt.Errorf("failed to decrypt password: %w", err)
	}
	if a.SteamGuardToken, err = decrypt(a.SteamGuardToken); err != nil {
		return nil, fmt.Errorf("failed to decrypt steam guard token: %w", err)
	}

	return &a, nil
}

func (r *Repository) Save(ctx context.Context, a *SteamAuth) error {
	var current struct {
		ID              int64
		Username        string
		Password        string
		SteamGuardToken string
	}

	query := `SELECT id, username, password, steam_guard_token FROM steam_auth LIMIT 1`
	err := r.db.QueryRowContext(ctx, query).Scan(&current.ID, &current.Username, &current.Password, &current.SteamGuardToken)

	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	exists := err == nil

	// Prepare values to save
	username := a.Username
	if username == "" && exists {
		username = current.Username
	}

	passwordToSave := current.Password
	if a.Password != "" {
		enc, err := encrypt(a.Password)
		if err != nil {
			return err
		}
		passwordToSave = enc
	}

	tokenToSave := current.SteamGuardToken
	if a.SteamGuardToken != "" {
		enc, err := encrypt(a.SteamGuardToken)
		if err != nil {
			return err
		}
		tokenToSave = enc
	}

	if !exists {
		args := []any{
			username,
			passwordToSave,
			tokenToSave,
		}
		_, err := r.db.ExecContext(ctx, "INSERT INTO steam_auth (username, password, steam_guard_token) VALUES (?, ?, ?)", args...)
		return err
	}

	args := []any{
		username,
		passwordToSave,
		tokenToSave,
		current.ID,
	}
	_, err = r.db.ExecContext(ctx, "UPDATE steam_auth SET username = ?, password = ?, steam_guard_token = ? WHERE id = ?", args...)

	return err
}

func (r *Repository) Delete(ctx context.Context) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM steam_auth")
	return err
}
