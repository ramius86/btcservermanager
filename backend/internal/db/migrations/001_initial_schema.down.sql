-- 001_initial_schema.down.sql
-- Down migration to drop all created tables

DROP TABLE IF EXISTS available_branches;
DROP TABLE IF EXISTS server_launch_parameters;
DROP TABLE IF EXISTS arma3server_active_mods;
DROP TABLE IF EXISTS arma3server_activedlcs;
DROP TABLE IF EXISTS arma3server_admins;
DROP TABLE IF EXISTS arma3server_allowed_html_ext;
DROP TABLE IF EXISTS arma3server_allowed_html_uris;
DROP TABLE IF EXISTS arma3server_allowed_load_ext;
DROP TABLE IF EXISTS arma3server_allowed_preprocess_ext;
DROP TABLE IF EXISTS arma3server_debug_console_admins;
DROP TABLE IF EXISTS arma3server_headless_clients_ips;
DROP TABLE IF EXISTS arma3server_local_client_ips;
DROP TABLE IF EXISTS arma3server_missions;
DROP TABLE IF EXISTS arma3server_motd;
DROP TABLE IF EXISTS dayzserver_active_mods;
DROP TABLE IF EXISTS dayzserver_motd;
DROP TABLE IF EXISTS preset_mod;
DROP TABLE IF EXISTS reforger_server_active_mods;
DROP TABLE IF EXISTS workshop_mod_bikey;
DROP TABLE IF EXISTS arma3server;
DROP TABLE IF EXISTS dayzserver;
DROP TABLE IF EXISTS reforger_server;
DROP TABLE IF EXISTS server;
DROP TABLE IF EXISTS server_installation;
DROP TABLE IF EXISTS steam_auth;
DROP TABLE IF EXISTS mod_preset;
DROP TABLE IF EXISTS workshop_mod;
DROP TABLE IF EXISTS arma3_difficulty_settings;
DROP TABLE IF EXISTS arma3_network_settings;
DROP TABLE IF EXISTS app_settings;
DROP TABLE IF EXISTS reforger_mod_scenarios;
DROP TABLE IF EXISTS reforger_vanilla_scenarios;
