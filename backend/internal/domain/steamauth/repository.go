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

	query := `SELECT id, username, password, steam_guard_token, COALESCE(refresh_token, ''), COALESCE(account_name, '') FROM steam_auth LIMIT 1`

	err := r.db.QueryRowContext(ctx, query).Scan(&a.ID, &a.Username, &a.Password, &a.SteamGuardToken, &a.RefreshToken, &a.AccountName)
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
	if a.RefreshToken, err = decrypt(a.RefreshToken); err != nil {
		return nil, fmt.Errorf("failed to decrypt refresh token: %w", err)
	}

	return &a, nil
}

func (r *Repository) Save(ctx context.Context, a *SteamAuth) error {
	var current struct {
		ID              int64
		Username        string
		Password        string
		SteamGuardToken string
		RefreshToken    string
		AccountName     string
	}

	query := `SELECT id, username, password, steam_guard_token, refresh_token, account_name FROM steam_auth LIMIT 1`
	err := r.db.QueryRowContext(ctx, query).Scan(&current.ID, &current.Username, &current.Password, &current.SteamGuardToken, &current.RefreshToken, &current.AccountName)

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
		enc, _ := encrypt(a.SteamGuardToken)
		tokenToSave = enc
	}

	refreshTokenToSave := current.RefreshToken
	if a.RefreshToken != "" {
		enc, _ := encrypt(a.RefreshToken)
		refreshTokenToSave = enc
	}

	accountNameToSave := a.AccountName
	if accountNameToSave == "" && exists {
		accountNameToSave = current.AccountName
	}

	if !exists {
		args := []any{
			username,
			passwordToSave,
			tokenToSave,
			refreshTokenToSave,
			accountNameToSave,
		}
		_, err := r.db.ExecContext(ctx, "INSERT INTO steam_auth (username, password, steam_guard_token, refresh_token, account_name) VALUES (?, ?, ?, ?, ?)", args...)
		return err
	}

	args := []any{
		username,
		passwordToSave,
		tokenToSave,
		refreshTokenToSave,
		accountNameToSave,
		current.ID,
	}
	_, err = r.db.ExecContext(ctx, "UPDATE steam_auth SET username = ?, password = ?, steam_guard_token = ?, refresh_token = ?, account_name = ? WHERE id = ?", args...)

	return err
}

func (r *Repository) Delete(ctx context.Context) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM steam_auth")
	return err
}
