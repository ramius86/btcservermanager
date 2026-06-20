package workshop

import (
	"btcservermanager/internal/domain/server"
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAllMods(ctx context.Context) ([]*WorkshopMod, error) {
	query := `SELECT id, name, thumbnail, last_updated, installed_at, file_size, server_only, installation_status, error_status, server_type, needs_update FROM workshop_mod`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		fmt.Printf("[WorkshopRepo] Error querying mods: %v\n", err)
		return nil, err
	}

	defer rows.Close()

	mods := []*WorkshopMod{}
	ids := []int64{}

	for rows.Next() {
		m, err := r.scanModBasic(rows)
		if err != nil {
			fmt.Printf("[WorkshopRepo] Error scanning mod: %v\n", err)
			return nil, err
		}

		mods = append(mods, m)
		ids = append(ids, m.ID)
	}

	if err := rows.Err(); err != nil {
		fmt.Printf("[WorkshopRepo] Rows error: %v\n", err)
		return nil, err
	}

	fmt.Printf("[WorkshopRepo] GetAllMods retrieved %d mods from database\n", len(mods))

	if len(ids) > 0 {
		bikeysMap, err := r.getBiKeysBatch(ctx, ids)
		if err == nil {
			for _, m := range mods {
				m.BiKeys = bikeysMap[m.ID]
			}
		}
	}

	return mods, nil
}

func (r *Repository) HasModUpdates(ctx context.Context) (bool, error) {
	query := `SELECT 1 FROM workshop_mod WHERE needs_update = 1 LIMIT 1`
	row := r.db.QueryRowContext(ctx, query)
	var dummy int
	err := row.Scan(&dummy)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (r *Repository) GetModByID(ctx context.Context, id int64) (*WorkshopMod, error) {
	query := `SELECT id, name, thumbnail, last_updated, installed_at, file_size, server_only, installation_status, error_status, server_type, needs_update FROM workshop_mod WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)

	return r.scanMod(ctx, row)
}

func (r *Repository) scanMod(ctx context.Context, scanner interface {
	Scan(dest ...any) error
},
) (*WorkshopMod, error) {
	m, err := r.scanModBasic(scanner)
	if err != nil {
		return nil, err
	}

	// Load BiKeys
	m.BiKeys, _ = r.getBiKeys(ctx, m.ID)

	return m, nil
}

func (r *Repository) scanModBasic(scanner interface {
	Scan(dest ...any) error
},
) (*WorkshopMod, error) {
	var m WorkshopMod

	var lastUpdated sql.NullString
	var installedAt sql.NullString

	var errorStatus sql.NullString

	var thumbnail sql.NullString

	err := scanner.Scan(&m.ID, &m.Name, &thumbnail, &lastUpdated, &installedAt, &m.FileSize, &m.ServerOnly, &m.InstallationStatus, &errorStatus, &m.ServerType, &m.NeedsUpdate)
	if err != nil {
		return nil, err
	}

	m.Thumbnail = thumbnail.String

	if lastUpdated.Valid {
		t, err := time.Parse(time.RFC3339, lastUpdated.String)
		if err == nil {
			m.LastUpdated = &t
		}
	}

	if installedAt.Valid {
		t, err := time.Parse(time.RFC3339, installedAt.String)
		if err == nil {
			m.InstalledAt = &t
		}
	}

	if errorStatus.Valid {
		es := ErrorStatus(errorStatus.String)
		m.ErrorStatus = &es
	}

	return &m, nil
}

func (r *Repository) getBiKeys(ctx context.Context, modID int64) ([]string, error) {
	batch, err := r.getBiKeysBatch(ctx, []int64{modID})
	if err != nil {
		return nil, err
	}

	return batch[modID], nil
}

func (r *Repository) getBiKeysBatch(ctx context.Context, modIDs []int64) (map[int64][]string, error) {
	if len(modIDs) == 0 {
		return make(map[int64][]string), nil
	}

	placeholders := make([]string, len(modIDs))
	args := make([]any, len(modIDs))

	for i, id := range modIDs {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf("SELECT workshop_mod_id, bikey FROM workshop_mod_bikey WHERE workshop_mod_id IN (%s)", strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64][]string)

	for rows.Next() {
		var modID int64

		var s string
		if err := rows.Scan(&modID, &s); err != nil {
			return nil, err
		}

		result[modID] = append(result[modID], s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) Save(ctx context.Context, m *WorkshopMod) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	query := `INSERT INTO workshop_mod (id, name, thumbnail, last_updated, installed_at, file_size, server_only, installation_status, error_status, server_type, needs_update)
	          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			  ON CONFLICT(id) DO UPDATE SET
			  name=excluded.name, thumbnail=excluded.thumbnail, last_updated=excluded.last_updated, file_size=excluded.file_size, 
			  server_only=excluded.server_only, installation_status=excluded.installation_status, 
			  error_status=excluded.error_status, server_type=excluded.server_type, needs_update=excluded.needs_update`

	var es sql.NullString
	if m.ErrorStatus != nil {
		es.String = string(*m.ErrorStatus)
		es.Valid = true
	}

	var lastUpdated sql.NullString
	if m.LastUpdated != nil {
		lastUpdated.String = m.LastUpdated.Format(time.RFC3339)
		lastUpdated.Valid = true
	}

	var installedAt sql.NullString
	if m.InstalledAt != nil {
		installedAt.String = m.InstalledAt.Format(time.RFC3339)
		installedAt.Valid = true
	}

	_, err = tx.ExecContext(ctx, query, m.ID, m.Name, m.Thumbnail, lastUpdated, installedAt, m.FileSize, m.ServerOnly, m.InstallationStatus, es, m.ServerType, m.NeedsUpdate)
	if err != nil {
		return err
	}

	// Sync BiKeys
	if _, err := tx.ExecContext(ctx, "DELETE FROM workshop_mod_bikey WHERE workshop_mod_id = ?", m.ID); err != nil {
		return err
	}

	for _, k := range m.BiKeys {
		if _, err := tx.ExecContext(ctx, "INSERT INTO workshop_mod_bikey (workshop_mod_id, bikey) VALUES (?, ?)", m.ID, k); err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM workshop_mod WHERE id = ?", id)
	return err
}

func (r *Repository) ResolveModNames(ctx context.Context, ids []int64) ([]server.ModInfo, error) {
	if len(ids) == 0 {
		return []server.ModInfo{}, nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	// We only need name and server_only to build ModInfo.
	// GetNormalizedName() needs ID and Name.
	query := fmt.Sprintf(`SELECT id, name, server_only FROM workshop_mod WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	modMap := make(map[int64]*WorkshopMod)

	for rows.Next() {
		var m WorkshopMod
		if err := rows.Scan(&m.ID, &m.Name, &m.ServerOnly); err != nil {
			return nil, err
		}

		modMap[m.ID] = &m
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	infos := []server.ModInfo{}

	for _, id := range ids {
		if m, ok := modMap[id]; ok {
			infos = append(infos, server.ModInfo{
				Name:       m.GetNormalizedName(),
				ServerOnly: m.ServerOnly,
			})
		}
	}

	return infos, nil
}
