package server

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
)

/*
This file is part of the Server Repository split.
It contains all Reforger specific database operations.

Other files in this repository:
- repository.go: Core Repository struct and base server operations.
- repository_arma3.go: Arma 3 specific database operations.
- repository_dayz.go: DayZ specific database operations.
- repository_helpers.go: Generic database collection helpers.
*/

func (r *Repository) getReforgerServersBatch(ctx context.Context, ids []int64, baseServers map[int64]*Server) ([]*ReforgerServer, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, scenario_id, third_person_view_enabled, battl_eye, visible, cross_platform, server_max_view_distance, server_min_grass_distance, network_view_distance, fast_validation, disable_ai, ai_limit, von_can_transmit_cross_faction, auto_save_interval, join_queue_max_size, max_fps, mission_header, network_dynamic_simulation, replication_timeout_ms, streams_delta, streaming_budget, log_stats, log_stats_interval_ms, addons_verify, addons_repair, no_throw, admins, nwk_resolution, disable_navmesh_streaming
	          FROM reforger_server WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	servers, err := scanReforgerServerRows(rows, baseServers)
	if err != nil {
		return nil, err
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	modMap, err := r.fetchReforgerModsBatch(ctx, placeholders, args)
	if err != nil {
		return nil, err
	}

	for _, s := range servers {
		s.ActiveMods = modMap[s.ID]
	}

	return servers, nil
}

func scanReforgerServerRows(rows *sql.Rows, baseServers map[int64]*Server) ([]*ReforgerServer, error) {
	servers := []*ReforgerServer{}

	for rows.Next() {
		var id int64
		var missionHeaderBytes []byte
		var adminsStr sql.NullString

		s := &ReforgerServer{}
		s.Admins = []string{}

		err := rows.Scan(&id, &s.ScenarioID, &s.ThirdPersonViewEnabled, &s.BattlEye, &s.Visible, &s.CrossPlatform, &s.ServerMaxViewDistance, &s.ServerMinGrassDistance, &s.NetworkViewDistance, &s.FastValidation, &s.DisableAI, &s.AILimit, &s.VonCanTransmitCrossFaction, &s.AutoSaveInterval, &s.JoinQueueMaxSize, &s.MaxFPS, &missionHeaderBytes, &s.NetworkDynamicSimulation, &s.ReplicationTimeoutMs, &s.StreamsDelta, &s.StreamingBudget, &s.LogStats, &s.LogStatsIntervalMs, &s.AddonsVerify, &s.AddonsRepair, &s.NoThrow, &adminsStr, &s.NwkResolution, &s.DisableNavmeshStreaming)
		if err != nil {
			return nil, err
		}

		if len(missionHeaderBytes) > 0 && !bytes.Equal(missionHeaderBytes, []byte("null")) {
			raw := json.RawMessage(missionHeaderBytes)
			s.MissionHeader = &raw
		}

		if adminsStr.Valid && adminsStr.String != "" {
			if err := json.Unmarshal([]byte(adminsStr.String), &s.Admins); err != nil {
				fmt.Printf("[ReforgerRepo] Error unmarshaling admins: %v\n", err)
			}
		}

		s.ID = id
		if base, ok := baseServers[id]; ok {
			s.Server = *base
		}

		servers = append(servers, s)
	}

	return servers, nil
}

func (r *Repository) fetchReforgerModsBatch(ctx context.Context, placeholders []string, args []any) (map[int64][]ReforgerMod, error) {
	// Fetch Reforger Mods in bulk
	modQuery := fmt.Sprintf("SELECT reforger_server_id, name, id, thumbnail FROM reforger_server_active_mods WHERE reforger_server_id IN (%s)", strings.Join(placeholders, ","))

	modRows, err := r.db.QueryContext(ctx, modQuery, args...)
	if err != nil {
		return nil, err
	}

	defer modRows.Close()

	modMap := make(map[int64][]ReforgerMod)

	for modRows.Next() {
		var m ReforgerMod

		var serverID int64
		if err := modRows.Scan(&serverID, &m.Name, &m.ID, &m.Thumbnail); err != nil {
			return nil, err
		}

		if _, ok := modMap[serverID]; !ok {
			modMap[serverID] = make([]ReforgerMod, 0, 10)
		}
		modMap[serverID] = append(modMap[serverID], m)
	}

	if err := modRows.Err(); err != nil {
		return nil, err
	}

	return modMap, nil
}

func (r *Repository) getReforgerServer(ctx context.Context, id int64) (*ReforgerServer, error) {
	base, err := r.getBaseServer(ctx, id)
	if err != nil {
		return nil, err
	}

	batch, err := r.getReforgerServersBatch(ctx, []int64{id}, map[int64]*Server{id: &base})
	if err != nil || len(batch) == 0 {
		return nil, err
	}

	return batch[0], nil
}

func (r *Repository) saveReforgerServer(ctx context.Context, tx *sql.Tx, id int64, s *ReforgerServer) error {
	var missionHeaderVal *string
	if s.MissionHeader != nil {
		str := string(*s.MissionHeader)
		if str != "" && str != "null" {
			missionHeaderVal = &str
		}
	}

	var adminsBytes []byte
	if len(s.Admins) > 0 {
		adminsBytes, _ = json.Marshal(s.Admins)
	} else {
		adminsBytes = []byte("[]")
	}

	args := []any{
		id, s.ScenarioID, s.ThirdPersonViewEnabled, s.BattlEye, s.Visible, s.CrossPlatform,
		s.ServerMaxViewDistance, s.ServerMinGrassDistance, s.NetworkViewDistance, s.FastValidation,
		s.DisableAI, s.AILimit, s.VonCanTransmitCrossFaction, s.AutoSaveInterval, s.JoinQueueMaxSize,
		s.MaxFPS, missionHeaderVal, s.NetworkDynamicSimulation, s.ReplicationTimeoutMs, s.StreamsDelta,
		s.StreamingBudget, s.LogStats, s.LogStatsIntervalMs, s.AddonsVerify, s.AddonsRepair, s.NoThrow,
		string(adminsBytes), s.NwkResolution, s.DisableNavmeshStreaming,
	}
	_, err := tx.ExecContext(ctx, "INSERT OR REPLACE INTO reforger_server (id, scenario_id, third_person_view_enabled, battl_eye, visible, cross_platform, server_max_view_distance, server_min_grass_distance, network_view_distance, fast_validation, disable_ai, ai_limit, von_can_transmit_cross_faction, auto_save_interval, join_queue_max_size, max_fps, mission_header, network_dynamic_simulation, replication_timeout_ms, streams_delta, streaming_budget, log_stats, log_stats_interval_ms, addons_verify, addons_repair, no_throw, admins, nwk_resolution, disable_navmesh_streaming) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args...)
	if err != nil {
		return err
	}

	if _, err := tx.ExecContext(ctx, "DELETE FROM reforger_server_active_mods WHERE reforger_server_id = ?", id); err != nil {
		return err
	}

	for _, m := range s.ActiveMods {
		_, err := tx.ExecContext(ctx, "INSERT INTO reforger_server_active_mods (reforger_server_id, name, id, thumbnail) VALUES (?, ?, ?, ?)", id, m.Name, m.ID, m.Thumbnail)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetAllActiveReforgerModIDs returns a slice of all unique hex IDs from active Reforger mods across all servers
func (r *Repository) GetAllActiveReforgerModIDs(ctx context.Context) ([]string, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT DISTINCT id FROM reforger_server_active_mods WHERE id IS NOT NULL AND id != ''")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
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
