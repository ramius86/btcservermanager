package server

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
)

/*
This file is part of the Server Repository split.
It contains all Arma 3 specific database operations.

Other files in this repository:
- repository.go: Core Repository struct and base server operations.
- repository_dayz.go: DayZ specific database operations.
- repository_reforger.go: Reforger specific database operations.
- repository_helpers.go: Generic database collection helpers.
*/

func (r *Repository) getArma3ServersBatch(ctx context.Context, ids []int64, baseServers map[int64]*Server) ([]*Arma3Server, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, client_file_patching, server_file_patching, persistent, battl_eye, von_enabled, verify_signatures, additional_options, server_command_password, motd_interval, difficulty_settings_id, network_settings_id, forced_difficulty, auto_select_mission, random_mission_order, missions_to_server_restart, vote_threshold, vote_mission_players, lobby_timeout, von_codec, von_codec_quality, kick_duplicate, kick_on_slow_network_ping, kick_on_slow_network_packet_loss, kick_on_slow_network_desync, kick_on_slow_network_disconnect, disconnect_timeout, max_ping, max_desync, max_packet_loss, idle_fps_limit, skip_description_parsing, log_object_not_found, enable_player_diag, force_rotor_lib_simulation, drawing_in_map, enable_debug_console, voting_timeout, role_timeout, briefing_timeout, debriefing_timeout, skip_lobby, allow_profile_glasses, required_build, statistics_enabled, arma_units_timeout, override_haze_quality, fast_download_enabled, limit_fps, max_mem, cpu_count, ex_threads, enable_ht, debug_mode, network_diag_interval, load_mission_to_memory, zeus_composition_script_level, lobby_idle_timeout, anti_flood_cycle_time, anti_flood_cycle_limit, anti_flood_cycle_hard_limit, anti_flood_enable_kick, cba_preset_id
	          FROM arma3server WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	servers, diffIDs, netIDs, err := scanArma3ServerRows(rows, baseServers)
	if err != nil {
		return nil, err
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	data, err := r.fetchArma3AssociatedData(ctx, ids, diffIDs, netIDs, servers)
	if err != nil {
		return nil, err
	}

	for _, s := range servers {
		linkArma3ServerData(s, data)
	}

	return servers, nil
}

func scanArma3ServerRows(rows *sql.Rows, baseServers map[int64]*Server) ([]*Arma3Server, []int64, []int64, error) {
	servers := []*Arma3Server{}
	diffIDs := []int64{}
	netIDs := []int64{}

	for rows.Next() {
		var id int64
		var diffID, netID sql.NullInt64
		s := &Arma3Server{}

		err := rows.Scan(&id, &s.ClientFilePatching, &s.ServerFilePatching, &s.Persistent, &s.BattlEye, &s.VonEnabled, &s.VerifySignatures, &s.AdditionalOptions, &s.ServerCommandPassword, &s.MotdInterval, &diffID, &netID, &s.ForcedDifficulty, &s.AutoSelectMission, &s.RandomMissionOrder, &s.MissionsToServerRestart, &s.VoteThreshold, &s.VoteMissionPlayers, &s.LobbyTimeout, &s.VonCodec, &s.VonCodecQuality, &s.KickDuplicate, &s.KickOnSlowNetworkPing, &s.KickOnSlowNetworkPacketLoss, &s.KickOnSlowNetworkDesync, &s.KickOnSlowNetworkDisconnect, &s.DisconnectTimeout, &s.MaxPing, &s.MaxDesync, &s.MaxPacketLoss, &s.IdleFPSLimit, &s.SkipDescriptionParsing, &s.LogObjectNotFound, &s.EnablePlayerDiag, &s.ForceRotorLibSimulation, &s.DrawingInMap, &s.EnableDebugConsole, &s.VotingTimeOut, &s.RoleTimeOut, &s.BriefingTimeOut, &s.DebriefingTimeOut, &s.SkipLobby, &s.AllowProfileGlasses, &s.RequiredBuild, &s.StatisticsEnabled, &s.ArmaUnitsTimeout, &s.OverrideHazeQuality, &s.FastDownloadEnabled, &s.LimitFPS, &s.MaxMem, &s.CpuCount, &s.ExThreads, &s.EnableHT, &s.DebugMode, &s.NetworkDiagInterval, &s.LoadMissionToMemory, &s.ZeusCompositionScriptLevel, &s.LobbyIdleTimeout, &s.AntiFloodCycleTime, &s.AntiFloodCycleLimit, &s.AntiFloodCycleHardLimit, &s.AntiFloodEnableKick, &s.CBAPresetID)
		if err != nil {
			return nil, nil, nil, err
		}

		s.ID = id
		if base, ok := baseServers[id]; ok {
			s.Server = *base
		}

		if diffID.Valid {
			diffIDs = append(diffIDs, diffID.Int64)
			s.DifficultySettings = &Arma3DifficultySettings{ID: diffID.Int64}
		}

		if netID.Valid {
			netIDs = append(netIDs, netID.Int64)
			s.NetworkSettings = &Arma3NetworkSettings{ID: netID.Int64}
		}

		servers = append(servers, s)
	}
	return servers, diffIDs, netIDs, nil
}

func (r *Repository) fetchArma3AssociatedData(ctx context.Context, ids, diffIDs, netIDs []int64, servers []*Arma3Server) (map[string]any, error) {
	presetIDs := []int64{}
	for _, s := range servers {
		if s.CBAPresetID != nil {
			presetIDs = append(presetIDs, *s.CBAPresetID)
		}
	}

	settings, err := r.fetchArma3Settings(ctx, diffIDs, netIDs, presetIDs)
	if err != nil {
		return nil, err
	}

	collections, err := r.fetchArma3Collections(ctx, ids)
	if err != nil {
		return nil, err
	}

	return map[string]any{
		"diff":        settings.diff,
		"net":         settings.net,
		"preset":      settings.preset,
		"motd":        collections.motd,
		"admins":      collections.admins,
		"loadExt":     collections.loadExt,
		"htmlURIs":    collections.htmlURIs,
		"debugAdmins": collections.debugAdmins,
		"preprocess":  collections.preprocess,
		"htmlExt":     collections.htmlExt,
		"headless":    collections.headless,
		"local":       collections.local,
		"dlc":         collections.dlc,
		"mod":         collections.mod,
		"mission":     collections.mission,
	}, nil
}

type arma3Settings struct {
	diff   map[int64]*Arma3DifficultySettings
	net    map[int64]*Arma3NetworkSettings
	preset map[int64]*CBAPreset
}

func (r *Repository) fetchArma3Settings(ctx context.Context, diffIDs, netIDs, presetIDs []int64) (*arma3Settings, error) {
	diffMap, err := r.getArma3DifficultySettingsBatch(ctx, diffIDs)
	if err != nil {
		return nil, err
	}

	netMap, err := r.getArma3NetworkSettingsBatch(ctx, netIDs)
	if err != nil {
		return nil, err
	}

	presetMap, err := r.getCBAPresetsBatch(ctx, presetIDs)
	if err != nil {
		return nil, err
	}

	return &arma3Settings{
		diff:   diffMap,
		net:    netMap,
		preset: presetMap,
	}, nil
}

type arma3Collections struct {
	motd        map[int64][]string
	admins      map[int64][]string
	loadExt     map[int64][]string
	htmlURIs    map[int64][]string
	debugAdmins map[int64][]string
	preprocess  map[int64][]string
	htmlExt     map[int64][]string
	headless    map[int64][]string
	local       map[int64][]string
	dlc         map[int64][]string
	mod         map[int64][]int64
	mission     map[int64][]Arma3Mission
}

func (r *Repository) fetchArma3Collections(ctx context.Context, ids []int64) (*arma3Collections, error) {
	motdMap, err := r.getStringCollectionBatch(ctx, "arma3server_motd", "arma3server_id", "motd", ids)
	if err != nil {
		return nil, err
	}

	adminMap, err := r.getStringCollectionBatch(ctx, "arma3server_admins", "arma3server_id", "admin_uid", ids)
	if err != nil {
		return nil, err
	}

	loadExtMap, err := r.getStringCollectionBatch(ctx, "arma3server_allowed_load_ext", "arma3server_id", "extension", ids)
	if err != nil {
		return nil, err
	}

	htmlURIsMap, err := r.getStringCollectionBatch(ctx, "arma3server_allowed_html_uris", "arma3server_id", "uri", ids)
	if err != nil {
		return nil, err
	}

	debugConsoleAdminMap, err := r.getStringCollectionBatch(ctx, "arma3server_debug_console_admins", "arma3server_id", "admin_uid", ids)
	if err != nil {
		return nil, err
	}

	preprocessExtMap, err := r.getStringCollectionBatch(ctx, "arma3server_allowed_preprocess_ext", "arma3server_id", "extension", ids)
	if err != nil {
		return nil, err
	}

	htmlExtMap, err := r.getStringCollectionBatch(ctx, "arma3server_allowed_html_ext", "arma3server_id", "extension", ids)
	if err != nil {
		return nil, err
	}

	headlessMap, err := r.getStringCollectionBatch(ctx, "arma3server_headless_clients_ips", "arma3server_id", "ip", ids)
	if err != nil {
		return nil, err
	}

	localClientMap, err := r.getStringCollectionBatch(ctx, "arma3server_local_client_ips", "arma3server_id", "ip", ids)
	if err != nil {
		return nil, err
	}

	dlcMap, err := r.getStringCollectionBatch(ctx, "arma3server_activedlcs", "arma3server_id", "activedlcs", ids)
	if err != nil {
		return nil, err
	}

	modMap, err := r.getInt64CollectionBatch(ctx, "arma3server_active_mods", "arma3server_id", "active_mods_id", ids)
	if err != nil {
		return nil, err
	}

	missionMap, err := r.getArma3MissionsBatch(ctx, ids)
	if err != nil {
		return nil, err
	}

	return &arma3Collections{
		motd:        motdMap,
		admins:      adminMap,
		loadExt:     loadExtMap,
		htmlURIs:    htmlURIsMap,
		debugAdmins: debugConsoleAdminMap,
		preprocess:  preprocessExtMap,
		htmlExt:     htmlExtMap,
		headless:    headlessMap,
		local:       localClientMap,
		dlc:         dlcMap,
		mod:         modMap,
		mission:     missionMap,
	}, nil
}

func linkArma3ServerData(s *Arma3Server, data map[string]any) {
	linkArma3ServerSettings(s, data)
	linkArma3ServerStringSlices(s, data)
	linkArma3ServerCollections(s, data)
}

func linkArma3ServerSettings(s *Arma3Server, data map[string]any) {
	if diffMap, ok := data["diff"].(map[int64]*Arma3DifficultySettings); ok && s.DifficultySettings != nil {
		s.DifficultySettings = diffMap[s.DifficultySettings.ID]
	}

	if netMap, ok := data["net"].(map[int64]*Arma3NetworkSettings); ok && s.NetworkSettings != nil {
		s.NetworkSettings = netMap[s.NetworkSettings.ID]
	}

	if presetMap, ok := data["preset"].(map[int64]*CBAPreset); ok && s.CBAPresetID != nil {
		s.CBAPreset = presetMap[*s.CBAPresetID]
	}
}

func linkArma3ServerStringSlices(s *Arma3Server, data map[string]any) {
	if motdMap, ok := data["motd"].(map[int64][]string); ok {
		s.Motd = motdMap[s.ID]
	}

	if adminMap, ok := data["admins"].(map[int64][]string); ok {
		s.Admins = adminMap[s.ID]
	}

	if loadExtMap, ok := data["loadExt"].(map[int64][]string); ok {
		s.AllowedLoadFileExtensions = loadExtMap[s.ID]
	}

	if htmlURIsMap, ok := data["htmlURIs"].(map[int64][]string); ok {
		s.AllowedHTMLLoadURIs = htmlURIsMap[s.ID]
	}

	if debugConsoleAdminMap, ok := data["debugAdmins"].(map[int64][]string); ok {
		s.DebugConsoleAdmins = debugConsoleAdminMap[s.ID]
	}

	if preprocessExtMap, ok := data["preprocess"].(map[int64][]string); ok {
		s.AllowedPreprocessFileExtensions = preprocessExtMap[s.ID]
	}

	if htmlExtMap, ok := data["htmlExt"].(map[int64][]string); ok {
		s.AllowedHTMLLoadExtensions = htmlExtMap[s.ID]
	}
}

func linkArma3ServerCollections(s *Arma3Server, data map[string]any) {
	if headlessMap, ok := data["headless"].(map[int64][]string); ok {
		s.HeadlessClients = headlessMap[s.ID]
	}

	if localClientMap, ok := data["local"].(map[int64][]string); ok {
		s.LocalClient = localClientMap[s.ID]
	}

	if dlcMap, ok := data["dlc"].(map[int64][]string); ok {
		s.ActiveDLCs = dlcMap[s.ID]
	}

	if modMap, ok := data["mod"].(map[int64][]int64); ok {
		s.ActiveMods = modMap[s.ID]
	}

	if missionMap, ok := data["mission"].(map[int64][]Arma3Mission); ok {
		s.Missions = missionMap[s.ID]
	}
}

func (r *Repository) getArma3Server(ctx context.Context, id int64) (*Arma3Server, error) {
	base, err := r.getBaseServer(ctx, id)
	if err != nil {
		return nil, err
	}

	batch, err := r.getArma3ServersBatch(ctx, []int64{id}, map[int64]*Server{id: &base})
	if err != nil || len(batch) == 0 {
		return nil, err
	}

	return batch[0], nil
}

func (r *Repository) saveArma3Server(ctx context.Context, tx *sql.Tx, id int64, s *Arma3Server) error {
	var diffID, netID any

	if s.DifficultySettings != nil {
		dID, err := r.saveArma3DifficultySettings(ctx, tx, s.DifficultySettings)
		if err != nil {
			return err
		}

		diffID = dID
	}

	if s.NetworkSettings != nil {
		nID, err := r.saveArma3NetworkSettings(ctx, tx, s.NetworkSettings)
		if err != nil {
			return err
		}

		netID = nID
	}

	args := []any{
		id, s.ClientFilePatching, s.ServerFilePatching, s.Persistent, s.BattlEye, s.VonEnabled, s.VerifySignatures,
		s.AdditionalOptions, s.ServerCommandPassword, s.MotdInterval, diffID, netID, s.ForcedDifficulty,
		s.AutoSelectMission, s.RandomMissionOrder, s.MissionsToServerRestart, s.VoteThreshold, s.VoteMissionPlayers,
		s.LobbyTimeout, s.VonCodec, s.VonCodecQuality, s.KickDuplicate, s.KickOnSlowNetworkPing,
		s.KickOnSlowNetworkPacketLoss, s.KickOnSlowNetworkDesync, s.KickOnSlowNetworkDisconnect, s.DisconnectTimeout,
		s.MaxPing, s.MaxDesync, s.MaxPacketLoss, s.IdleFPSLimit, s.SkipDescriptionParsing, s.LogObjectNotFound,
		s.EnablePlayerDiag, s.ForceRotorLibSimulation, s.DrawingInMap, s.EnableDebugConsole, s.VotingTimeOut,
		s.RoleTimeOut, s.BriefingTimeOut, s.DebriefingTimeOut, s.SkipLobby, s.AllowProfileGlasses, s.RequiredBuild,
		s.StatisticsEnabled, s.ArmaUnitsTimeout, s.OverrideHazeQuality, s.FastDownloadEnabled, s.LimitFPS,
		s.MaxMem, s.CpuCount, s.ExThreads, s.EnableHT, s.DebugMode, s.NetworkDiagInterval, s.LoadMissionToMemory,
		s.ZeusCompositionScriptLevel, s.LobbyIdleTimeout, s.AntiFloodCycleTime, s.AntiFloodCycleLimit,
		s.AntiFloodCycleHardLimit, s.AntiFloodEnableKick, s.CBAPresetID,
	}
	_, err := tx.ExecContext(ctx, "INSERT OR REPLACE INTO arma3server (id, client_file_patching, server_file_patching, persistent, battl_eye, von_enabled, verify_signatures, additional_options, server_command_password, motd_interval, difficulty_settings_id, network_settings_id, forced_difficulty, auto_select_mission, random_mission_order, missions_to_server_restart, vote_threshold, vote_mission_players, lobby_timeout, von_codec, von_codec_quality, kick_duplicate, kick_on_slow_network_ping, kick_on_slow_network_packet_loss, kick_on_slow_network_desync, kick_on_slow_network_disconnect, disconnect_timeout, max_ping, max_desync, max_packet_loss, idle_fps_limit, skip_description_parsing, log_object_not_found, enable_player_diag, force_rotor_lib_simulation, drawing_in_map, enable_debug_console, voting_timeout, role_timeout, briefing_timeout, debriefing_timeout, skip_lobby, allow_profile_glasses, required_build, statistics_enabled, arma_units_timeout, override_haze_quality, fast_download_enabled, limit_fps, max_mem, cpu_count, ex_threads, enable_ht, debug_mode, network_diag_interval, load_mission_to_memory, zeus_composition_script_level, lobby_idle_timeout, anti_flood_cycle_time, anti_flood_cycle_limit, anti_flood_cycle_hard_limit, anti_flood_enable_kick, cba_preset_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args...)
	if err != nil {
		return err
	}

	return r.saveArma3AssociatedCollections(ctx, tx, id, s)
}

func (r *Repository) saveArma3AssociatedCollections(ctx context.Context, tx *sql.Tx, id int64, s *Arma3Server) error {
	if err := r.updateStringCollection(ctx, tx, "arma3server_motd", "arma3server_id", "motd", id, s.Motd); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_admins", "arma3server_id", "admin_uid", id, s.Admins); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_debug_console_admins", "arma3server_id", "admin_uid", id, s.DebugConsoleAdmins); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_allowed_load_ext", "arma3server_id", "extension", id, s.AllowedLoadFileExtensions); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_allowed_preprocess_ext", "arma3server_id", "extension", id, s.AllowedPreprocessFileExtensions); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_allowed_html_ext", "arma3server_id", "extension", id, s.AllowedHTMLLoadExtensions); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_allowed_html_uris", "arma3server_id", "uri", id, s.AllowedHTMLLoadURIs); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_headless_clients_ips", "arma3server_id", "ip", id, s.HeadlessClients); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_local_client_ips", "arma3server_id", "ip", id, s.LocalClient); err != nil {
		return err
	}

	if err := r.updateStringCollection(ctx, tx, "arma3server_activedlcs", "arma3server_id", "activedlcs", id, s.ActiveDLCs); err != nil {
		return err
	}

	if err := r.updateInt64Collection(ctx, tx, "arma3server_active_mods", "arma3server_id", "active_mods_id", id, s.ActiveMods); err != nil {
		return err
	}

	return r.updateArma3Missions(ctx, tx, id, s.Missions)
}

func (r *Repository) saveArma3DifficultySettings(ctx context.Context, tx *sql.Tx, d *Arma3DifficultySettings) (int64, error) {
	if d.ID == 0 {
		res, err := tx.ExecContext(ctx, `INSERT INTO arma3_difficulty_settings (group_indicators, friendly_tags, enemy_tags, detected_mines, commands, waypoints, weapon_info, stance_indicator, third_person_view, tactical_ping, reduced_damage, stamina_bar, weapon_crosshair, vision_aid, score_table, death_messages, vonid, map_content, auto_report, camera_shake, ai_level_preset, skillai, precisionai) 
		                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			d.GroupIndicators, d.FriendlyTags, d.EnemyTags, d.DetectedMines, d.Commands, d.Waypoints, d.WeaponInfo, d.StanceIndicator, d.ThirdPersonView, d.TacticalPing, d.ReducedDamage, d.StaminaBar, d.WeaponCrosshair, d.VisionAid, d.ScoreTable, d.DeathMessages, d.VonID, d.MapContent, d.AutoReport, d.CameraShake, d.AILevelPreset, d.SkillAI, d.PrecisionAI)
		if err != nil {
			return 0, err
		}

		id, err := res.LastInsertId()
		if err != nil {
			return 0, err
		}

		return id, nil
	}

	_, err := tx.ExecContext(ctx, `UPDATE arma3_difficulty_settings SET group_indicators=?, friendly_tags=?, enemy_tags=?, detected_mines=?, commands=?, waypoints=?, weapon_info=?, stance_indicator=?, third_person_view=?, tactical_ping=?, reduced_damage=?, stamina_bar=?, weapon_crosshair=?, vision_aid=?, score_table=?, death_messages=?, vonid=?, map_content=?, auto_report=?, camera_shake=?, ai_level_preset=?, skillai=?, precisionai=? WHERE id=?`,
		d.GroupIndicators, d.FriendlyTags, d.EnemyTags, d.DetectedMines, d.Commands, d.Waypoints, d.WeaponInfo, d.StanceIndicator, d.ThirdPersonView, d.TacticalPing, d.ReducedDamage, d.StaminaBar, d.WeaponCrosshair, d.VisionAid, d.ScoreTable, d.DeathMessages, d.VonID, d.MapContent, d.AutoReport, d.CameraShake, d.AILevelPreset, d.SkillAI, d.PrecisionAI, d.ID)
	return d.ID, err
}

func (r *Repository) saveArma3NetworkSettings(ctx context.Context, tx *sql.Tx, n *Arma3NetworkSettings) (int64, error) {
	if n.ID == 0 {
		res, err := tx.ExecContext(ctx, `INSERT INTO arma3_network_settings (max_msg_send, max_size_guaranteed, max_size_nonguaranteed, min_bandwidth, max_bandwidth, min_error_to_send, min_error_to_send_near, max_packet_size, max_custom_file_size, steam_protocol_max_data_size) 
		                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			n.MaxMessagesSend, n.MaxSizeGuaranteed, n.MaxSizeNonguaranteed, n.MinBandwidth, n.MaxBandwidth, n.MinErrorToSend, n.MinErrorToSendNear, n.MaxPacketSize, n.MaxCustomFileSize, n.SteamProtocolMaxDataSize)
		if err != nil {
			return 0, err
		}

		id, err := res.LastInsertId()
		if err != nil {
			return 0, err
		}

		return id, nil
	}

	_, err := tx.ExecContext(ctx, `UPDATE arma3_network_settings SET max_msg_send=?, max_size_guaranteed=?, max_size_nonguaranteed=?, min_bandwidth=?, max_bandwidth=?, min_error_to_send=?, min_error_to_send_near=?, max_packet_size=?, max_custom_file_size=?, steam_protocol_max_data_size=? WHERE id=?`,
		n.MaxMessagesSend, n.MaxSizeGuaranteed, n.MaxSizeNonguaranteed, n.MinBandwidth, n.MaxBandwidth, n.MinErrorToSend, n.MinErrorToSendNear, n.MaxPacketSize, n.MaxCustomFileSize, n.SteamProtocolMaxDataSize, n.ID)
	return n.ID, err
}

func (r *Repository) getArma3DifficultySettingsBatch(ctx context.Context, ids []int64) (map[int64]*Arma3DifficultySettings, error) {
	if len(ids) == 0 {
		return make(map[int64]*Arma3DifficultySettings), nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, group_indicators, friendly_tags, enemy_tags, detected_mines, commands, waypoints, weapon_info, stance_indicator, third_person_view, tactical_ping, reduced_damage, stamina_bar, weapon_crosshair, vision_aid, score_table, death_messages, vonid, map_content, auto_report, camera_shake, ai_level_preset, skillai, precisionai 
	          FROM arma3_difficulty_settings WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64]*Arma3DifficultySettings)

	for rows.Next() {
		var d Arma3DifficultySettings

		err := rows.Scan(&d.ID, &d.GroupIndicators, &d.FriendlyTags, &d.EnemyTags, &d.DetectedMines, &d.Commands, &d.Waypoints, &d.WeaponInfo, &d.StanceIndicator, &d.ThirdPersonView, &d.TacticalPing, &d.ReducedDamage, &d.StaminaBar, &d.WeaponCrosshair, &d.VisionAid, &d.ScoreTable, &d.DeathMessages, &d.VonID, &d.MapContent, &d.AutoReport, &d.CameraShake, &d.AILevelPreset, &d.SkillAI, &d.PrecisionAI)
		if err == nil {
			result[d.ID] = &d
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) getArma3NetworkSettingsBatch(ctx context.Context, ids []int64) (map[int64]*Arma3NetworkSettings, error) {
	if len(ids) == 0 {
		return make(map[int64]*Arma3NetworkSettings), nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf(`SELECT id, max_msg_send, max_size_guaranteed, max_size_nonguaranteed, min_bandwidth, max_bandwidth, min_error_to_send, min_error_to_send_near, max_packet_size, max_custom_file_size, steam_protocol_max_data_size 
	          FROM arma3_network_settings WHERE id IN (%s)`, strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64]*Arma3NetworkSettings)

	for rows.Next() {
		var n Arma3NetworkSettings

		err := rows.Scan(&n.ID, &n.MaxMessagesSend, &n.MaxSizeGuaranteed, &n.MaxSizeNonguaranteed, &n.MinBandwidth, &n.MaxBandwidth, &n.MinErrorToSend, &n.MinErrorToSendNear, &n.MaxPacketSize, &n.MaxCustomFileSize, &n.SteamProtocolMaxDataSize)
		if err == nil {
			result[n.ID] = &n
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) getArma3MissionsBatch(ctx context.Context, ids []int64) (map[int64][]Arma3Mission, error) {
	if len(ids) == 0 {
		return make(map[int64][]Arma3Mission), nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf("SELECT arma3server_id, template, difficulty FROM arma3server_missions WHERE arma3server_id IN (%s)", strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64][]Arma3Mission)

	for rows.Next() {
		var m Arma3Mission

		var serverID int64
		if err := rows.Scan(&serverID, &m.Template, &m.Difficulty); err != nil {
			return nil, err
		}

		result[serverID] = append(result[serverID], m)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *Repository) updateArma3Missions(ctx context.Context, tx *sql.Tx, id int64, missions []Arma3Mission) error {
	if _, err := tx.ExecContext(ctx, "DELETE FROM arma3server_missions WHERE arma3server_id = ?", id); err != nil {
		return err
	}

	for _, m := range missions {
		if _, err := tx.ExecContext(ctx, "INSERT INTO arma3server_missions (arma3server_id, template, difficulty) VALUES (?, ?, ?)", id, m.Template, m.Difficulty); err != nil {
			return err
		}
	}

	return nil
}

func (r *Repository) GetCBAPresets(ctx context.Context) ([]CBAPreset, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT id, name, content, created_at, updated_at FROM cba_presets ORDER BY name ASC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	presets := []CBAPreset{}
	for rows.Next() {
		var p CBAPreset
		if err := rows.Scan(&p.ID, &p.Name, &p.Content, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		presets = append(presets, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return presets, nil
}

func (r *Repository) GetCBAPresetByID(ctx context.Context, id int64) (*CBAPreset, error) {
	var p CBAPreset
	err := r.db.QueryRowContext(ctx, "SELECT id, name, content, created_at, updated_at FROM cba_presets WHERE id = ?", id).
		Scan(&p.ID, &p.Name, &p.Content, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *Repository) SaveCBAPreset(ctx context.Context, p *CBAPreset) (int64, error) {
	if p.ID == 0 {
		res, err := r.db.ExecContext(ctx, "INSERT INTO cba_presets (name, content) VALUES (?, ?)", p.Name, p.Content)
		if err != nil {
			return 0, err
		}
		return res.LastInsertId()
	}

	_, err := r.db.ExecContext(ctx, "UPDATE cba_presets SET name = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", p.Name, p.Content, p.ID)
	return p.ID, err
}

func (r *Repository) DeleteCBAPreset(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM cba_presets WHERE id = ?", id)
	return err
}

func (r *Repository) getCBAPresetsBatch(ctx context.Context, ids []int64) (map[int64]*CBAPreset, error) {
	if len(ids) == 0 {
		return make(map[int64]*CBAPreset), nil
	}

	placeholders := make([]string, len(ids))
	args := make([]any, len(ids))

	for i, id := range ids {
		placeholders[i] = "?"
		args[i] = id
	}

	query := fmt.Sprintf("SELECT id, name, content, created_at, updated_at FROM cba_presets WHERE id IN (%s)", strings.Join(placeholders, ","))

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	result := make(map[int64]*CBAPreset)

	for rows.Next() {
		var p CBAPreset
		if err := rows.Scan(&p.ID, &p.Name, &p.Content, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}

		result[p.ID] = &p
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}
