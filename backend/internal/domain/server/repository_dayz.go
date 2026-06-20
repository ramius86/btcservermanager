package server

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
)

/*
This file is part of the Server Repository split.
It contains all DayZ specific database operations.

Other files in this repository:
- repository.go: Core Repository struct and base server operations.
- repository_arma3.go: Arma 3 specific database operations.
- repository_reforger.go: Reforger specific database operations.
- repository_helpers.go: Generic database collection helpers.
*/

func (r *Repository) getDayZServersBatch(ctx context.Context, ids []int64, baseServers map[int64]*Server) ([]*DayZServer, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, enable_whitelist, disable_banlist, disable_prioritylist, verify_signatures, force_same_build, 
	                        disable_von, von_codec_quality, disable_3rd_person, disable_crosshair, server_time, 
	                        time_acceleration, night_time_acceleration, server_time_persistent, login_queue_concurrent, 
	                        login_queue_max, instance_id, storage_auto_fix, respawn_time, motd_interval, 
	                        time_stamp_format, log_average_fps, log_memory, log_players, admin_log_player_hits, 
	                        admin_log_placement, admin_log_build_actions, admin_log_player_list, enable_debug_monitor, 
	                        allow_file_patching, simulated_players_batch, multithreaded_replication, speedhack_detection, 
	                        lighting_config, disable_personal_light, disable_base_damage, disable_container_damage, 
	                        disable_respawn_dialog, ping_warning, ping_critical, max_ping_dayz, server_fps_warning, shot_validation, battl_eye, scenario_id, 
							profiles_path, battleye_path, enable_do_logs, enable_admin_log, enable_net_log, enable_freeze_check, limit_fps, additional_options 
	          FROM dayzserver WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	servers := []*DayZServer{}

	for rows.Next() {
		var id int64

		s := &DayZServer{}

		err = rows.Scan(&id, &s.EnableWhitelist, &s.DisableBanlist, &s.DisablePrioritylist, &s.VerifySignatures, &s.ForceSameBuild,
			&s.DisableVoN, &s.VonCodecQuality, &s.Disable3rdPerson, &s.DisableCrosshair, &s.ServerTime,
			&s.TimeAcceleration, &s.NightTimeAcceleration, &s.ServerTimePersistent, &s.LoginQueueConcurrent,
			&s.LoginQueueMax, &s.InstanceID, &s.StorageAutoFix, &s.RespawnTime, &s.MotdInterval,
			&s.TimeStampFormat, &s.LogAverageFps, &s.LogMemory, &s.LogPlayers, &s.AdminLogPlayerHits,
			&s.AdminLogPlacement, &s.AdminLogBuildActions, &s.AdminLogPlayerList, &s.EnableDebugMonitor,
			&s.AllowFilePatching, &s.SimulatedPlayersBatch, &s.MultithreadedReplication, &s.SpeedhackDetection,
			&s.LightingConfig, &s.DisablePersonalLight, &s.DisableBaseDamage, &s.DisableContainerDamage,
			&s.DisableRespawnDialog, &s.PingWarning, &s.PingCritical, &s.MaxPing, &s.ServerFpsWarning, &s.ShotValidation, &s.BattlEye, &s.ScenarioID,
			&s.ProfilesPath, &s.BattlEyePath, &s.EnableDoLogs, &s.EnableAdminLog, &s.EnableNetLog, &s.EnableFreezeCheck, &s.LimitFPS, &s.AdditionalOptions)
		if err != nil {
			return nil, err
		}

		s.ID = id
		if base, ok := baseServers[id]; ok {
			s.Server = *base
		}

		servers = append(servers, s)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	motdMap, err := r.getStringCollectionBatch(ctx, "dayzserver_motd", "dayzserver_id", "motd", ids)
	if err != nil {
		return nil, err
	}

	modMap, err := r.getInt64CollectionBatch(ctx, "dayzserver_active_mods", "dayzserver_id", "active_mods_id", ids)
	if err != nil {
		return nil, err
	}

	for _, s := range servers {
		s.Motd = motdMap[s.ID]
		s.ActiveMods = modMap[s.ID]
	}

	return servers, nil
}

func (r *Repository) getDayZServer(ctx context.Context, id int64) (*DayZServer, error) {
	base, err := r.getBaseServer(ctx, id)
	if err != nil {
		return nil, err
	}

	batch, err := r.getDayZServersBatch(ctx, []int64{id}, map[int64]*Server{id: &base})
	if err != nil || len(batch) == 0 {
		return nil, err
	}

	return batch[0], nil
}

func (r *Repository) saveDayZServer(ctx context.Context, tx *sql.Tx, id int64, s *DayZServer) error {
	query := `INSERT OR REPLACE INTO dayzserver (
		id, enable_whitelist, disable_banlist, disable_prioritylist, verify_signatures, force_same_build, 
		disable_von, von_codec_quality, disable_3rd_person, disable_crosshair, server_time, 
		time_acceleration, night_time_acceleration, server_time_persistent, login_queue_concurrent, 
		login_queue_max, instance_id, storage_auto_fix, respawn_time, motd_interval, 
		time_stamp_format, log_average_fps, log_memory, log_players, admin_log_player_hits, 
		admin_log_placement, admin_log_build_actions, admin_log_player_list, enable_debug_monitor, 
		allow_file_patching, simulated_players_batch, multithreaded_replication, speedhack_detection, 
		lighting_config, disable_personal_light, disable_base_damage, disable_container_damage, 
		disable_respawn_dialog, ping_warning, ping_critical, max_ping_dayz, server_fps_warning, shot_validation, battl_eye, scenario_id, 
		profiles_path, battleye_path, enable_do_logs, enable_admin_log, enable_net_log, enable_freeze_check, limit_fps, additional_options
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := tx.ExecContext(ctx, query,
		id, s.EnableWhitelist, s.DisableBanlist, s.DisablePrioritylist, s.VerifySignatures, s.ForceSameBuild,
		s.DisableVoN, s.VonCodecQuality, s.Disable3rdPerson, s.DisableCrosshair, s.ServerTime,
		s.TimeAcceleration, s.NightTimeAcceleration, s.ServerTimePersistent, s.LoginQueueConcurrent,
		s.LoginQueueMax, s.InstanceID, s.StorageAutoFix, s.RespawnTime, s.MotdInterval,
		s.TimeStampFormat, s.LogAverageFps, s.LogMemory, s.LogPlayers, s.AdminLogPlayerHits,
		s.AdminLogPlacement, s.AdminLogBuildActions, s.AdminLogPlayerList, s.EnableDebugMonitor,
		s.AllowFilePatching, s.SimulatedPlayersBatch, s.MultithreadedReplication, s.SpeedhackDetection,
		s.LightingConfig, s.DisablePersonalLight, s.DisableBaseDamage, s.DisableContainerDamage,
		s.DisableRespawnDialog, s.PingWarning, s.PingCritical, s.MaxPing, s.ServerFpsWarning, s.ShotValidation, s.BattlEye, s.ScenarioID,
		s.ProfilesPath, s.BattlEyePath, s.EnableDoLogs, s.EnableAdminLog, s.EnableNetLog, s.EnableFreezeCheck, s.LimitFPS, s.AdditionalOptions)
	if err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "dayzserver_motd", "dayzserver_id", "motd", id, s.Motd); err != nil {
		return err
	}

	return r.updateInt64Collection(ctx, tx, "dayzserver_active_mods", "dayzserver_id", "active_mods_id", id, s.ActiveMods)
}
