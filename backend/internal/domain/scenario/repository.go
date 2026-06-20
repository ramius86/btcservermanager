package scenario

import (
	"context"
	"database/sql"
	"strings"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetVanillaReforgerScenarios(ctx context.Context) ([]ReforgerScenario, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT scenario_id, name FROM reforger_vanilla_scenarios")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	scenarios := []ReforgerScenario{}

	for rows.Next() {
		var s ReforgerScenario
		if err := rows.Scan(&s.ID, &s.Name); err != nil {
			return nil, err
		}

		s.IsOfficial = true
		scenarios = append(scenarios, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return scenarios, nil
}

func (r *Repository) GetModReforgerScenarios(ctx context.Context, modIDs []string) ([]ReforgerScenario, error) {
	if len(modIDs) == 0 {
		return []ReforgerScenario{}, nil
	}

	scenarios := []ReforgerScenario{}

	for _, modID := range modIDs {
		rows, err := r.db.QueryContext(ctx, "SELECT mod_id, mod_name, scenario_id, name, game_mode, player_count FROM reforger_mod_scenarios WHERE mod_id = ?", modID)
		if err != nil {
			continue
		}

		err = func() error {
			defer rows.Close()

			for rows.Next() {
				var s ReforgerScenario
				if err := rows.Scan(&s.ModID, &s.ModName, &s.ID, &s.Name, &s.GameMode, &s.PlayerCount); err != nil {
					return err
				}

				s.IsOfficial = false
				scenarios = append(scenarios, s)
			}

			return rows.Err()
		}()
		if err != nil {
			return nil, err
		}
	}

	return scenarios, nil
}

func (r *Repository) GetAllModReforgerScenarios(ctx context.Context) ([]ReforgerScenario, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT mod_id, mod_name, scenario_id, name, game_mode, player_count FROM reforger_mod_scenarios")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	scenarios := []ReforgerScenario{}
	for rows.Next() {
		var s ReforgerScenario
		if err := rows.Scan(&s.ModID, &s.ModName, &s.ID, &s.Name, &s.GameMode, &s.PlayerCount); err != nil {
			return nil, err
		}
		s.IsOfficial = false
		scenarios = append(scenarios, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return scenarios, nil
}

func (r *Repository) SaveVanillaScenarios(ctx context.Context, scenarios []ReforgerScenario) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	if _, err := tx.ExecContext(ctx, "DELETE FROM reforger_vanilla_scenarios"); err != nil {
		return err
	}

	for _, s := range scenarios {
		_, err := tx.ExecContext(ctx, "INSERT INTO reforger_vanilla_scenarios (scenario_id, name) VALUES (?, ?)", s.ID, s.Name)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) SaveModScenarios(ctx context.Context, modID string, scenarios []ReforgerScenario) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	if _, err := tx.ExecContext(ctx, "DELETE FROM reforger_mod_scenarios WHERE mod_id = ?", modID); err != nil {
		return err
	}

	for _, s := range scenarios {
		args := []any{modID, s.ModName, s.ID, s.Name, s.GameMode, s.PlayerCount}
		_, err := tx.ExecContext(ctx, "INSERT INTO reforger_mod_scenarios (mod_id, mod_name, scenario_id, name, game_mode, player_count) VALUES (?, ?, ?, ?, ?, ?)", args...)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) DeleteModScenarios(ctx context.Context, modID string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM reforger_mod_scenarios WHERE mod_id = ?", modID)
	return err
}

func (r *Repository) DeleteExceptMods(ctx context.Context, activeHexIDs []string) error {
	if len(activeHexIDs) == 0 {
		_, err := r.db.ExecContext(ctx, "DELETE FROM reforger_mod_scenarios")
		return err
	}

	// Build "DELETE ... WHERE mod_id NOT IN (?,?,?)" without intermediate string allocations.
	var sb strings.Builder
	sb.WriteString("DELETE FROM reforger_mod_scenarios WHERE mod_id NOT IN (")
	args := make([]any, len(activeHexIDs))
	for i, id := range activeHexIDs {
		if i > 0 {
			sb.WriteByte(',')
		}
		sb.WriteByte('?')
		args[i] = id
	}
	sb.WriteByte(')')

	_, err := r.db.ExecContext(ctx, sb.String(), args...)
	return err
}
