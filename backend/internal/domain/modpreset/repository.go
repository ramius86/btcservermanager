package modpreset

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"
)

type Repository struct {
	db           *sql.DB
	workshopRepo *workshop.Repository
}

func NewRepository(db *sql.DB, workshopRepo *workshop.Repository) *Repository {
	return &Repository{
		db:           db,
		workshopRepo: workshopRepo,
	}
}

func (r *Repository) fetchBiKeysBatch(ctx context.Context, modIDs []int64) (map[int64][]string, error) {
	result := make(map[int64][]string)
	if len(modIDs) == 0 {
		return result, nil
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

	for rows.Next() {
		var modID int64
		var bikey string
		if err := rows.Scan(&modID, &bikey); err != nil {
			return nil, err
		}
		result[modID] = append(result[modID], bikey)
	}

	return result, rows.Err()
}

func (r *Repository) GetAllPresets(ctx context.Context) ([]*ModPreset, error) {
	query := `SELECT id, name, type FROM mod_preset`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	presets := []*ModPreset{}
	presetMap := make(map[int64]*ModPreset)
	for rows.Next() {
		var p ModPreset
		if err := rows.Scan(&p.ID, &p.Name, &p.Type); err != nil {
			return nil, err
		}
		p.Mods = []workshop.WorkshopMod{}
		p.ReforgerMods = []server.ReforgerMod{}
		presets = append(presets, &p)
		presetMap[p.ID] = &p
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	rows.Close()

	if len(presets) == 0 {
		return presets, nil
	}

	// 1. Batch load all Arma 3 / DayZ preset mods in a single JOIN query
	armQuery := `
		SELECT pm.preset_id, wm.id, wm.name, wm.thumbnail, wm.last_updated, wm.installed_at,
		       wm.file_size, wm.server_only, wm.installation_status, wm.error_status, wm.server_type, wm.needs_update
		FROM preset_mod pm
		JOIN workshop_mod wm ON pm.mod_id = wm.id
		ORDER BY pm.preset_id
	`
	armRows, err := r.db.QueryContext(ctx, armQuery)
	if err != nil {
		return nil, err
	}
	defer armRows.Close()

	type presetModItem struct {
		presetID int64
		mod      workshop.WorkshopMod
	}
	var modItems []presetModItem
	var allModIDs []int64

	for armRows.Next() {
		var presetID int64
		var m workshop.WorkshopMod
		var lastUpdated sql.NullString
		var installedAt sql.NullString
		var errorStatus sql.NullString
		var thumbnail sql.NullString

		if err := armRows.Scan(&presetID, &m.ID, &m.Name, &thumbnail, &lastUpdated, &installedAt, &m.FileSize, &m.ServerOnly, &m.InstallationStatus, &errorStatus, &m.ServerType, &m.NeedsUpdate); err != nil {
			return nil, err
		}
		m.Thumbnail = thumbnail.String
		if lastUpdated.Valid {
			if t, err := time.Parse(time.RFC3339, lastUpdated.String); err == nil {
				m.LastUpdated = &t
			}
		}
		if installedAt.Valid {
			if t, err := time.Parse(time.RFC3339, installedAt.String); err == nil {
				m.InstalledAt = &t
			}
		}
		if errorStatus.Valid {
			es := workshop.ErrorStatus(errorStatus.String)
			m.ErrorStatus = &es
		}
		modItems = append(modItems, presetModItem{presetID: presetID, mod: m})
		allModIDs = append(allModIDs, m.ID)
	}
	if err := armRows.Err(); err != nil {
		return nil, err
	}
	armRows.Close()

	// Batch load bikeys for all retrieved mods
	if len(allModIDs) > 0 {
		bikeysMap, err := r.fetchBiKeysBatch(ctx, allModIDs)
		if err == nil {
			for i := range modItems {
				if keys, ok := bikeysMap[modItems[i].mod.ID]; ok {
					modItems[i].mod.BiKeys = keys
				}
			}
		}
	}

	for _, item := range modItems {
		if p, ok := presetMap[item.presetID]; ok {
			p.Mods = append(p.Mods, item.mod)
		}
	}

	// 2. Batch load all Reforger preset mods in a single query
	refQuery := `SELECT preset_id, mod_id, name, thumbnail FROM reforger_preset_mod ORDER BY preset_id`
	refRows, err := r.db.QueryContext(ctx, refQuery)
	if err != nil {
		return nil, err
	}
	defer refRows.Close()

	for refRows.Next() {
		var presetID int64
		var rm server.ReforgerMod
		var thumbnail sql.NullString
		if err := refRows.Scan(&presetID, &rm.ID, &rm.Name, &thumbnail); err != nil {
			return nil, err
		}
		if thumbnail.Valid {
			rm.Thumbnail = thumbnail.String
		}
		if p, ok := presetMap[presetID]; ok {
			p.ReforgerMods = append(p.ReforgerMods, rm)
		}
	}
	if err := refRows.Err(); err != nil {
		return nil, err
	}

	return presets, nil
}

func (r *Repository) GetPresetByID(ctx context.Context, id int64) (*ModPreset, error) {
	query := `SELECT id, name, type FROM mod_preset WHERE id = ?`
	row := r.db.QueryRowContext(ctx, query, id)

	return r.scanPreset(ctx, row)
}

func (r *Repository) scanPreset(ctx context.Context, scanner interface {
	Scan(dest ...any) error
},
) (*ModPreset, error) {
	var p ModPreset

	err := scanner.Scan(&p.ID, &p.Name, &p.Type)
	if err != nil {
		return nil, err
	}

	// Load mods
	if p.Type == server.TypeReforger {
		p.ReforgerMods, err = r.getReforgerPresetMods(ctx, p.ID)
	} else {
		p.Mods, err = r.getPresetMods(ctx, p.ID)
	}

	return &p, err
}

func (r *Repository) getPresetMods(ctx context.Context, presetID int64) ([]workshop.WorkshopMod, error) {
	query := `
		SELECT wm.id, wm.name, wm.thumbnail, wm.last_updated, wm.installed_at,
		       wm.file_size, wm.server_only, wm.installation_status, wm.error_status, wm.server_type, wm.needs_update
		FROM preset_mod pm
		JOIN workshop_mod wm ON pm.mod_id = wm.id
		WHERE pm.preset_id = ?
	`

	rows, err := r.db.QueryContext(ctx, query, presetID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	mods := []workshop.WorkshopMod{}
	var modIDs []int64
	for rows.Next() {
		var m workshop.WorkshopMod
		var lastUpdated sql.NullString
		var installedAt sql.NullString
		var errorStatus sql.NullString
		var thumbnail sql.NullString

		if err := rows.Scan(&m.ID, &m.Name, &thumbnail, &lastUpdated, &installedAt, &m.FileSize, &m.ServerOnly, &m.InstallationStatus, &errorStatus, &m.ServerType, &m.NeedsUpdate); err != nil {
			return nil, err
		}
		m.Thumbnail = thumbnail.String
		if lastUpdated.Valid {
			if t, err := time.Parse(time.RFC3339, lastUpdated.String); err == nil {
				m.LastUpdated = &t
			}
		}
		if installedAt.Valid {
			if t, err := time.Parse(time.RFC3339, installedAt.String); err == nil {
				m.InstalledAt = &t
			}
		}
		if errorStatus.Valid {
			es := workshop.ErrorStatus(errorStatus.String)
			m.ErrorStatus = &es
		}
		mods = append(mods, m)
		modIDs = append(modIDs, m.ID)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	rows.Close()

	if len(modIDs) > 0 {
		bikeysMap, err := r.fetchBiKeysBatch(ctx, modIDs)
		if err == nil {
			for i := range mods {
				if keys, ok := bikeysMap[mods[i].ID]; ok {
					mods[i].BiKeys = keys
				}
			}
		}
	}

	return mods, nil
}

func (r *Repository) getReforgerPresetMods(ctx context.Context, presetID int64) ([]server.ReforgerMod, error) {
	query := `SELECT mod_id, name, thumbnail FROM reforger_preset_mod WHERE preset_id = ?`

	rows, err := r.db.QueryContext(ctx, query, presetID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	mods := []server.ReforgerMod{}
	for rows.Next() {
		var m server.ReforgerMod
		var thumbnail sql.NullString
		if err := rows.Scan(&m.ID, &m.Name, &thumbnail); err != nil {
			rows.Close()
			return nil, err
		}
		if thumbnail.Valid {
			m.Thumbnail = thumbnail.String
		}
		mods = append(mods, m)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return nil, err
	}
	rows.Close()

	return mods, nil
}

func (r *Repository) Save(ctx context.Context, p *ModPreset) error {
	// Ensure mods exist in workshopRepo for non-Reforger presets so FK constraints are met
	if p.Type != server.TypeReforger && r.workshopRepo != nil {
		for _, m := range p.Mods {
			if _, err := r.workshopRepo.GetModByID(ctx, m.ID); err != nil {
				placeholder := &workshop.WorkshopMod{
					ID:                 m.ID,
					Name:               m.Name,
					ServerType:         p.Type,
					InstallationStatus: workshop.InstallationNotInstalled,
				}
				_ = r.workshopRepo.Save(ctx, placeholder)
			}
		}
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	var id int64

	if p.ID == 0 {
		query := `INSERT INTO mod_preset (name, type) VALUES (?, ?)`

		res, err := tx.ExecContext(ctx, query, p.Name, p.Type)
		if err != nil {
			return err
		}

		id, err = res.LastInsertId()
		if err != nil {
			return err
		}
		p.ID = id
	} else {
		query := `UPDATE mod_preset SET name = ?, type = ? WHERE id = ?`

		_, err = tx.ExecContext(ctx, query, p.Name, p.Type, p.ID)
		if err != nil {
			return err
		}

		id = p.ID
	}

	// Sync mods
	if p.Type == server.TypeReforger {
		if _, err := tx.ExecContext(ctx, "DELETE FROM reforger_preset_mod WHERE preset_id = ?", id); err != nil {
			return err
		}
		for _, m := range p.ReforgerMods {
			args := []any{id, m.ID, m.Name, m.Thumbnail}
			if _, err := tx.ExecContext(ctx, "INSERT INTO reforger_preset_mod (preset_id, mod_id, name, thumbnail) VALUES (?, ?, ?, ?)", args...); err != nil {
				return err
			}
		}
	} else {
		if _, err := tx.ExecContext(ctx, "DELETE FROM preset_mod WHERE preset_id = ?", id); err != nil {
			return err
		}
		for _, m := range p.Mods {
			if _, err := tx.ExecContext(ctx, "INSERT INTO preset_mod (preset_id, mod_id) VALUES (?, ?)", id, m.ID); err != nil {
				return err
			}
		}
	}

	return tx.Commit()
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM mod_preset WHERE id = ?", id)
	return err
}

func (r *Repository) ExistsByName(ctx context.Context, name string) bool {
	var id int64
	err := r.db.QueryRowContext(ctx, "SELECT id FROM mod_preset WHERE name = ?", name).Scan(&id)

	return err == nil
}
