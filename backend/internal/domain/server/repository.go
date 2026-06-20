package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

/*
This is the core Server Repository file.
It defines the Repository struct and handles base server operations common to all game types.

Specific implementations are found in:
- repository_arma3.go: Arma 3 specific operations.
- repository_dayz.go: DayZ specific operations.
- repository_reforger.go: Reforger specific operations.
- repository_helpers.go: Generic database collection helpers.
*/

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetAllServers(ctx context.Context) ([]any, error) {
	query := `SELECT id, type FROM server ORDER BY sort_order ASC, id ASC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	ids := []int64{}

	typeMap := make(map[int64]Type)

	for rows.Next() {
		var id int64

		var t Type
		if err := rows.Scan(&id, &t); err != nil {
			return nil, err
		}

		ids = append(ids, id)
		typeMap[id] = t
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(ids) == 0 {
		return []any{}, nil
	}

	// Fetch base servers
	baseServers, err := r.getBaseServersBatch(ctx, ids)
	if err != nil {
		return nil, err
	}

	arma3IDs, dayzIDs, reforgerIDs := categorizeServerIDs(typeMap)

	// Fetch typed data in batches
	resultMap, err := r.fetchTypedServers(ctx, baseServers, arma3IDs, dayzIDs, reforgerIDs)
	if err != nil {
		return nil, err
	}

	servers := []any{}

	for _, id := range ids {
		if s, ok := resultMap[id]; ok {
			servers = append(servers, s)
		}
	}

	return servers, nil
}

func categorizeServerIDs(typeMap map[int64]Type) ([]int64, []int64, []int64) {
	arma3IDs := []int64{}
	dayzIDs := []int64{}
	reforgerIDs := []int64{}

	for id, t := range typeMap {
		switch t {
		case TypeArma3:
			arma3IDs = append(arma3IDs, id)
		case TypeDayZ, TypeDayZExp:
			dayzIDs = append(dayzIDs, id)
		case TypeReforger:
			reforgerIDs = append(reforgerIDs, id)
		}
	}
	return arma3IDs, dayzIDs, reforgerIDs
}

func (r *Repository) fetchTypedServers(ctx context.Context, baseServers map[int64]*Server, arma3IDs, dayzIDs, reforgerIDs []int64) (map[int64]any, error) {
	arma3Servers, err := r.getArma3ServersBatch(ctx, arma3IDs, baseServers)
	if err != nil {
		return nil, err
	}

	dayzServers, err := r.getDayZServersBatch(ctx, dayzIDs, baseServers)
	if err != nil {
		return nil, err
	}

	reforgerServers, err := r.getReforgerServersBatch(ctx, reforgerIDs, baseServers)
	if err != nil {
		return nil, err
	}

	resultMap := make(map[int64]any)
	for _, s := range arma3Servers {
		resultMap[s.ID] = s
	}

	for _, s := range dayzServers {
		resultMap[s.ID] = s
	}

	for _, s := range reforgerServers {
		resultMap[s.ID] = s
	}

	return resultMap, nil
}

func (r *Repository) GetServerByID(ctx context.Context, id int64) (any, error) {
	var t Type

	err := r.db.QueryRowContext(ctx, "SELECT type FROM server WHERE id = ?", id).Scan(&t)
	if err != nil {
		return nil, err
	}

	switch t {
	case TypeArma3:
		return r.getArma3Server(ctx, id)
	case TypeDayZ, TypeDayZExp:
		return r.getDayZServer(ctx, id)
	case TypeReforger:
		return r.getReforgerServer(ctx, id)
	default:
		return nil, fmt.Errorf("unknown server type: %s", t)
	}
}

func (r *Repository) getBaseServersBatch(ctx context.Context, ids []int64) (map[int64]*Server, error) {
	if len(ids) == 0 {
		return make(map[int64]*Server), nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, type, description, name, port, query_port, max_players, password, admin_password, automatic_restart, automatic_restart_time, sort_order 
	          FROM server WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64]*Server)

	for rows.Next() {
		s := &Server{}

		err := rows.Scan(
			&s.ID, &s.Type, &s.Description, &s.Name, &s.Port, &s.QueryPort, &s.MaxPlayers, &s.Password, &s.AdminPassword, &s.RestartAutomatically, &s.AutomaticRestartTime, &s.SortOrder,
		)
		if err != nil {
			return nil, err
		}

		result[s.ID] = s
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Load custom launch parameters in bulk
	paramsMap, err := r.getLaunchParametersBatch(ctx, ids)
	if err == nil {
		for id, s := range result {
			s.CustomLaunchParameters = paramsMap[id]
		}
	}

	return result, nil
}

func (r *Repository) getBaseServer(ctx context.Context, id int64) (Server, error) {
	batch, err := r.getBaseServersBatch(ctx, []int64{id})
	if err != nil || len(batch) == 0 {
		return Server{}, err
	}

	return *batch[id], nil
}

func (r *Repository) getLaunchParametersBatch(ctx context.Context, serverIDs []int64) (map[int64][]LaunchParameter, error) {
	if len(serverIDs) == 0 {
		return make(map[int64][]LaunchParameter), nil
	}

	placeholders := make([]string, len(serverIDs))
	args := make([]any, len(serverIDs))

	for i, id := range serverIDs {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf("SELECT id, server_id, name, value FROM server_launch_parameters WHERE server_id IN (%s)", strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64][]LaunchParameter)

	for rows.Next() {
		var p LaunchParameter
		if err := rows.Scan(&p.ID, &p.ServerID, &p.Name, &p.Value); err != nil {
			return nil, err
		}

		result[p.ServerID] = append(result[p.ServerID], p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) Save(ctx context.Context, s any) (int64, error) {
	id, t, base, err := extractBaseServerInfo(s)
	if err != nil {
		return 0, err
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer func() { _ = tx.Rollback() }()

	id, err = upsertBaseServer(ctx, tx, id, t, base)
	if err != nil {
		return 0, err
	}

	if err := updateLaunchParameters(ctx, tx, id, base.CustomLaunchParameters); err != nil {
		return 0, err
	}

	if err := r.saveTypedServer(ctx, tx, id, s); err != nil {
		return 0, err
	}

	return id, tx.Commit()
}

func extractBaseServerInfo(s any) (int64, Type, Server, error) {
	switch v := s.(type) {
	case *Arma3Server:
		return v.ID, v.Type, v.Server, nil
	case *DayZServer:
		return v.ID, v.Type, v.Server, nil
	case *ReforgerServer:
		return v.ID, v.Type, v.Server, nil
	default:
		return 0, "", Server{}, errors.New("invalid server type")
	}
}

func upsertBaseServer(ctx context.Context, tx *sql.Tx, id int64, t Type, base Server) (int64, error) {
	if id == 0 {
		res, err := tx.ExecContext(ctx, `INSERT INTO server (type, description, name, port, query_port, max_players, password, admin_password, automatic_restart, automatic_restart_time, sort_order) 
		                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			t, base.Description, base.Name, base.Port, base.QueryPort, base.MaxPlayers, base.Password, base.AdminPassword, base.RestartAutomatically, base.AutomaticRestartTime, base.SortOrder)
		if err != nil {
			return 0, err
		}

		newId, err := res.LastInsertId()
		if err != nil {
			return 0, fmt.Errorf("failed to get last insert id: %w", err)
		}
		return newId, nil
	}

	_, err := tx.ExecContext(ctx, `UPDATE server SET description=?, name=?, port=?, query_port=?, max_players=?, password=?, admin_password=?, automatic_restart=?, automatic_restart_time=?, sort_order=? WHERE id=?`,
		base.Description, base.Name, base.Port, base.QueryPort, base.MaxPlayers, base.Password, base.AdminPassword, base.RestartAutomatically, base.AutomaticRestartTime, base.SortOrder, id)
	return id, err
}

func updateLaunchParameters(ctx context.Context, tx *sql.Tx, id int64, params []LaunchParameter) error {
	if _, err := tx.ExecContext(ctx, "DELETE FROM server_launch_parameters WHERE server_id = ?", id); err != nil {
		return err
	}

	for _, p := range params {
		if _, err := tx.ExecContext(ctx, "INSERT INTO server_launch_parameters (server_id, name, value) VALUES (?, ?, ?)", id, p.Name, p.Value); err != nil {
			return err
		}
	}
	return nil
}

func (r *Repository) saveTypedServer(ctx context.Context, tx *sql.Tx, id int64, s any) error {
	switch v := s.(type) {
	case *Arma3Server:
		return r.saveArma3Server(ctx, tx, id, v)
	case *DayZServer:
		return r.saveDayZServer(ctx, tx, id, v)
	case *ReforgerServer:
		return r.saveReforgerServer(ctx, tx, id, v)
	default:
		return errors.New("invalid server type")
	}
}

func (r *Repository) UpdateSortOrders(ctx context.Context, orders map[int64]int) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	for id, sortOrder := range orders {
		_, err := tx.ExecContext(ctx, "UPDATE server SET sort_order = ? WHERE id = ?", sortOrder, id)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM server WHERE id = ?", id)
	return err
}

func (r *Repository) FindAllServerIdsByActiveMod(ctx context.Context, modID string) ([]int64, error) {
	query := `
            SELECT arma3server_id FROM arma3server_active_mods
            WHERE active_mods_id = ?
            UNION
            SELECT dayzserver_id FROM dayzserver_active_mods
            WHERE active_mods_id = ?
            UNION
            SELECT reforger_server_id FROM reforger_server_active_mods
            WHERE id = ?
            `

	rows, err := r.db.QueryContext(ctx, query, modID, modID, modID)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	ids := []int64{}

	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}

		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ids, nil
}
