package modpreset

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"database/sql"
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

func (r *Repository) GetAllPresets(ctx context.Context) ([]*ModPreset, error) {
	query := `SELECT id, name, type FROM mod_preset`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Collect base preset data first, close the cursor, then load mods.
	// Keeping rows open while calling getPresetMods would deadlock on a
	// single-connection pool (MaxOpenConns=1).
	presets := []*ModPreset{}
	for rows.Next() {
		var p ModPreset
		if err := rows.Scan(&p.ID, &p.Name, &p.Type); err != nil {
			rows.Close()
			return nil, err
		}
		presets = append(presets, &p)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return nil, err
	}
	rows.Close()

	// Now hydrate each preset's mods with the connection free.
	for _, p := range presets {
		if p.Type == server.TypeReforger {
			p.ReforgerMods, err = r.getReforgerPresetMods(ctx, p.ID)
		} else {
			p.Mods, err = r.getPresetMods(ctx, p.ID)
		}
		if err != nil {
			return nil, err
		}
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
	query := `SELECT mod_id FROM preset_mod WHERE preset_id = ?`

	rows, err := r.db.QueryContext(ctx, query, presetID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Collect all mod IDs first, then close rows before issuing further queries.
	// Keeping rows open while calling workshopRepo.GetModByID would deadlock on
	// a single-connection pool (MaxOpenConns=1) since the connection is still
	// held by the open cursor.
	modIDs := []int64{}
	for rows.Next() {
		var modID int64
		if err := rows.Scan(&modID); err != nil {
			rows.Close()
			return nil, err
		}
		modIDs = append(modIDs, modID)
	}
	if err := rows.Err(); err != nil {
		rows.Close()
		return nil, err
	}
	rows.Close()

	mods := []workshop.WorkshopMod{}
	for _, modID := range modIDs {
		m, err := r.workshopRepo.GetModByID(ctx, modID)
		if err == nil {
			mods = append(mods, *m)
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

		id, _ = res.LastInsertId()
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
		_, _ = tx.ExecContext(ctx, "DELETE FROM reforger_preset_mod WHERE preset_id = ?", id)
		for _, m := range p.ReforgerMods {
			args := []any{id, m.ID, m.Name, m.Thumbnail}
			_, _ = tx.ExecContext(ctx, "INSERT INTO reforger_preset_mod (preset_id, mod_id, name, thumbnail) VALUES (?, ?, ?, ?)", args...)
		}
	} else {
		_, _ = tx.ExecContext(ctx, "DELETE FROM preset_mod WHERE preset_id = ?", id)
		for _, m := range p.Mods {
			_, _ = tx.ExecContext(ctx, "INSERT INTO preset_mod (preset_id, mod_id) VALUES (?, ?)", id, m.ID)
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
