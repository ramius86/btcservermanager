package server

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
)

/*
This file is part of the Server Repository split.
It contains generic database collection helpers used by all server types.

Other files in this repository:
- repository.go: Core Repository struct and base server operations.
- repository_arma3.go: Arma 3 specific database operations.
- repository_dayz.go: DayZ specific database operations.
- repository_reforger.go: Reforger specific database operations.
*/

var (
	allowedTables = map[string]bool{
		"arma3server_motd":                   true,
		"arma3server_admins":                 true,
		"arma3server_debug_console_admins":   true,
		"arma3server_allowed_load_ext":       true,
		"arma3server_allowed_preprocess_ext": true,
		"arma3server_allowed_html_ext":       true,
		"arma3server_allowed_html_uris":      true,
		"arma3server_headless_clients_ips":   true,
		"arma3server_local_client_ips":       true,
		"arma3server_activedlcs":             true,
		"arma3server_active_mods":            true,
		"dayzserver_motd":                    true,
		"dayzserver_active_mods":             true,
	}

	allowedJoinCols = map[string]bool{
		"arma3server_id": true,
		"dayzserver_id":  true,
	}

	allowedValCols = map[string]bool{
		"motd":           true,
		"admin_uid":      true,
		"extension":      true,
		"uri":            true,
		"ip":             true,
		"activedlcs":     true,
		"active_mods_id": true,
	}
)

func validateCollectionParams(table, joinCol, valCol string) error {
	if !allowedTables[table] {
		return fmt.Errorf("forbidden table: %q", table)
	}
	if !allowedJoinCols[joinCol] {
		return fmt.Errorf("forbidden join column: %q", joinCol)
	}
	if !allowedValCols[valCol] {
		return fmt.Errorf("forbidden value column: %q", valCol)
	}
	return nil
}

func (r *Repository) updateStringCollection(ctx context.Context, tx *sql.Tx, table, joinCol, valCol string, id int64, vals []string) error {
	if err := validateCollectionParams(table, joinCol, valCol); err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, fmt.Sprintf("DELETE FROM %s WHERE %s = ?", table, joinCol), id); err != nil {
		return err
	}

	query := fmt.Sprintf("INSERT INTO %s (%s, %s) VALUES (?, ?)", table, joinCol, valCol)
	for _, v := range vals {
		if _, err := tx.ExecContext(ctx, query, id, v); err != nil {
			return err
		}
	}

	return nil
}

func (r *Repository) updateInt64Collection(ctx context.Context, tx *sql.Tx, table, joinCol, valCol string, id int64, vals []int64) error {
	if err := validateCollectionParams(table, joinCol, valCol); err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, fmt.Sprintf("DELETE FROM %s WHERE %s = ?", table, joinCol), id); err != nil {
		return err
	}

	query := fmt.Sprintf("INSERT INTO %s (%s, %s) VALUES (?, ?)", table, joinCol, valCol)
	for _, v := range vals {
		if _, err := tx.ExecContext(ctx, query, id, v); err != nil {
			return err
		}
	}

	return nil
}

// buildPlaceholders builds a "?,?,?" string for n parameters using a
// strings.Builder. This avoids the intermediate allocations produced by
// make([]string, n) + strings.Join that fmt.Sprintf triggers via sync.Pool.
func buildPlaceholders(n int) string {
	if n == 0 {
		return ""
	}
	var b strings.Builder
	// Each entry is "?" or ",?", so cap = 1 + (n-1)*2 = 2n-1
	b.Grow(2*n - 1)
	b.WriteByte('?')
	for i := 1; i < n; i++ {
		b.WriteByte(',')
		b.WriteByte('?')
	}
	return b.String()
}

func (r *Repository) getStringCollectionBatch(ctx context.Context, table, joinCol, valCol string, ids []int64) (map[int64][]string, error) {
	if err := validateCollectionParams(table, joinCol, valCol); err != nil {
		return nil, err
	}

	if len(ids) == 0 {
		return make(map[int64][]string), nil
	}

	args := make([]any, len(ids))
	for i, id := range ids {
		args[i] = id
	}

	query := "SELECT " + joinCol + ", " + valCol + " FROM " + table + " WHERE " + joinCol + " IN (" + buildPlaceholders(len(ids)) + ")"

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64][]string)

	for rows.Next() {
		var id int64

		var val string
		if err := rows.Scan(&id, &val); err != nil {
			return nil, err
		}

		if _, ok := result[id]; !ok {
			result[id] = make([]string, 0, 5)
		}
		result[id] = append(result[id], val)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) getInt64CollectionBatch(ctx context.Context, table, joinCol, valCol string, ids []int64) (map[int64][]int64, error) {
	if err := validateCollectionParams(table, joinCol, valCol); err != nil {
		return nil, err
	}

	if len(ids) == 0 {
		return make(map[int64][]int64), nil
	}

	args := make([]any, len(ids))
	for i, id := range ids {
		args[i] = id
	}

	query := "SELECT " + joinCol + ", " + valCol + " FROM " + table + " WHERE " + joinCol + " IN (" + buildPlaceholders(len(ids)) + ")"

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64][]int64)

	for rows.Next() {
		var id int64

		var val int64
		if err := rows.Scan(&id, &val); err != nil {
			return nil, err
		}

		result[id] = append(result[id], val)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}
