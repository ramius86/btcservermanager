package installation

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"database/sql"
	"errors"
	"time"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetInstallation(ctx context.Context, t server.Type) (*ServerInstallation, error) {
	query := `SELECT type, version, last_updated_at, installation_status, error_status, branch, available_version, installed_buildid, installed_branch FROM server_installation WHERE type = ?`

	var si ServerInstallation

	var version sql.NullString

	var lastUpdated sql.NullString

	var errorStatus sql.NullString

	var availableVersion sql.NullString

	var installedBuildId sql.NullString

	var installedBranch sql.NullString

	err := r.db.QueryRowContext(ctx, query, t).Scan(&si.Type, &version, &lastUpdated, &si.InstallationStatus, &errorStatus, &si.Branch, &availableVersion, &installedBuildId, &installedBranch)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Load branches even if installation record doesn't exist
			branches, _ := r.GetAvailableBranches(ctx, t)
			// Return a default installation object
			return &ServerInstallation{
				Type:               t,
				InstallationStatus: workshop.InstallationNotInstalled,
				Branch:             BranchPublic,
				InstalledBranch:    BranchPublic,
				AvailableBranches:  branches,
			}, nil
		}

		return nil, err
	}

	if version.Valid {
		si.Version = version.String
	}

	if availableVersion.Valid {
		si.AvailableVersion = availableVersion.String
	}

	if installedBuildId.Valid {
		si.InstalledBuildID = installedBuildId.String
	}

	if installedBranch.Valid {
		si.InstalledBranch = Branch(installedBranch.String)
	} else {
		si.InstalledBranch = si.Branch
	}

	if lastUpdated.Valid {
		t, err := time.Parse(time.RFC3339, lastUpdated.String)
		if err == nil {
			si.LastUpdatedAt = &t
		}
	}

	if errorStatus.Valid {
		es := workshop.ErrorStatus(errorStatus.String)
		si.ErrorStatus = &es
	}

	// Load branches
	si.AvailableBranches, _ = r.GetAvailableBranches(ctx, t)

	return &si, nil
}

func (r *Repository) GetAllInstallations(ctx context.Context) ([]*ServerInstallation, error) {
	// For each server type defined in the system
	types := []server.Type{server.TypeArma3, server.TypeDayZ, server.TypeDayZExp, server.TypeReforger}

	res := []*ServerInstallation{}

	for _, t := range types {
		si, err := r.GetInstallation(ctx, t)
		if err != nil {
			return nil, err
		}

		res = append(res, si)
	}

	return res, nil
}

func (r *Repository) GetAvailableBranches(ctx context.Context, t server.Type) ([]Branch, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT branch FROM available_branches WHERE type = ?", t)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	branches := []Branch{}

	for rows.Next() {
		var b Branch
		if err := rows.Scan(&b); err != nil {
			return nil, err
		}

		branches = append(branches, b)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return branches, nil
}

func (r *Repository) Save(ctx context.Context, si *ServerInstallation) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	query := `INSERT INTO server_installation (type, version, last_updated_at, installation_status, error_status, branch, available_version, installed_buildid, installed_branch)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			  ON CONFLICT(type) DO UPDATE SET
			  version=excluded.version, last_updated_at=excluded.last_updated_at, 
			  installation_status=excluded.installation_status, error_status=excluded.error_status, 
			  branch=excluded.branch, available_version=excluded.available_version,
			  installed_buildid=excluded.installed_buildid,
			  installed_branch=excluded.installed_branch`

	var es sql.NullString
	if si.ErrorStatus != nil {
		es.String = string(*si.ErrorStatus)
		es.Valid = true
	}

	var updatedAt any
	if si.LastUpdatedAt != nil {
		updatedAt = si.LastUpdatedAt.Format(time.RFC3339)
	}

	args := []any{
		si.Type, si.Version, updatedAt, si.InstallationStatus, es, si.Branch,
		si.AvailableVersion, si.InstalledBuildID, si.InstalledBranch,
	}
	_, err = tx.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}

	// Sync branches
	_, _ = tx.ExecContext(ctx, "DELETE FROM available_branches WHERE type = ?", si.Type)
	for _, b := range si.AvailableBranches {
		_, _ = tx.ExecContext(ctx, "INSERT INTO available_branches (type, branch) VALUES (?, ?)", si.Type, b)
	}

	return tx.Commit()
}

func (r *Repository) Delete(ctx context.Context, t server.Type) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	if _, err := tx.ExecContext(ctx, "DELETE FROM server_installation WHERE type = ?", t); err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, "DELETE FROM available_branches WHERE type = ?", t); err != nil {
		return err
	}

	return tx.Commit()
}
