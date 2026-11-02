-- SQLite does not index foreign-key columns automatically. These indexes keep
-- ON DELETE CASCADE and join lookups from degenerating into full scans.
CREATE INDEX IF NOT EXISTS idx_arma3server_difficulty_settings ON arma3server(difficulty_settings_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_network_settings ON arma3server(network_settings_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_cba_preset ON arma3server(cba_preset_id);

CREATE INDEX IF NOT EXISTS idx_arma3server_activedlcs_server ON arma3server_activedlcs(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_motd_server ON arma3server_motd(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_admins_server ON arma3server_admins(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_allowed_load_ext_server ON arma3server_allowed_load_ext(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_allowed_preprocess_ext_server ON arma3server_allowed_preprocess_ext(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_allowed_html_ext_server ON arma3server_allowed_html_ext(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_headless_clients_ips_server ON arma3server_headless_clients_ips(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_local_client_ips_server ON arma3server_local_client_ips(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_missions_server ON arma3server_missions(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_arma3server_active_mods_mod ON arma3server_active_mods(active_mods_id);

CREATE INDEX IF NOT EXISTS idx_dayzserver_motd_server ON dayzserver_motd(dayzserver_id);
CREATE INDEX IF NOT EXISTS idx_dayzserver_active_mods_mod ON dayzserver_active_mods(active_mods_id);

CREATE INDEX IF NOT EXISTS idx_workshop_mod_bikey_mod ON workshop_mod_bikey(workshop_mod_id);
CREATE INDEX IF NOT EXISTS idx_preset_mod_mod ON preset_mod(mod_id);

CREATE INDEX IF NOT EXISTS idx_discord_event_participations_user ON discord_event_participations(user_id);
