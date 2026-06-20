-- 001_initial_schema.up.sql
-- Consolidated schema squashed from migrations 001 through 022

CREATE TABLE IF NOT EXISTS server (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    type                   TEXT NOT NULL,
    description            TEXT,
    name                   TEXT NOT NULL,
    port                   INTEGER NOT NULL,
    query_port             INTEGER NOT NULL,
    max_players            INTEGER NOT NULL,
    password               TEXT,
    admin_password         TEXT,
    automatic_restart      BOOLEAN NOT NULL DEFAULT 0,
    automatic_restart_time TEXT
);

CREATE TABLE IF NOT EXISTS app_settings (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    log_retention_days     INTEGER NOT NULL DEFAULT 30,
    log_max_total_size_mb  INTEGER NOT NULL DEFAULT 1024
);

CREATE TABLE IF NOT EXISTS arma3_difficulty_settings (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    group_indicators  INTEGER NOT NULL DEFAULT 0,
    friendly_tags     INTEGER NOT NULL DEFAULT 0,
    enemy_tags        INTEGER NOT NULL DEFAULT 0,
    detected_mines    INTEGER NOT NULL DEFAULT 0,
    commands          INTEGER NOT NULL DEFAULT 0,
    waypoints         INTEGER NOT NULL DEFAULT 0,
    weapon_info       INTEGER NOT NULL DEFAULT 0,
    stance_indicator  INTEGER NOT NULL DEFAULT 0,
    third_person_view INTEGER NOT NULL DEFAULT 0,
    tactical_ping     INTEGER NOT NULL DEFAULT 0,
    reduced_damage    BOOLEAN NOT NULL DEFAULT 0,
    stamina_bar       BOOLEAN NOT NULL DEFAULT 0,
    weapon_crosshair  BOOLEAN NOT NULL DEFAULT 0,
    vision_aid        BOOLEAN NOT NULL DEFAULT 0,
    score_table       BOOLEAN NOT NULL DEFAULT 0,
    death_messages    BOOLEAN NOT NULL DEFAULT 0,
    vonid             BOOLEAN NOT NULL DEFAULT 0,
    map_content       BOOLEAN NOT NULL DEFAULT 0,
    auto_report       BOOLEAN NOT NULL DEFAULT 0,
    camera_shake      BOOLEAN NOT NULL DEFAULT 0,
    ai_level_preset   INTEGER NOT NULL DEFAULT 0,
    skillai          REAL NOT NULL DEFAULT 0.5,
    precisionai      REAL NOT NULL DEFAULT 0.5
);

CREATE TABLE IF NOT EXISTS arma3_network_settings (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    max_msg_send            INTEGER DEFAULT 128,
    max_size_guaranteed     INTEGER DEFAULT 512,
    max_size_nonguaranteed  INTEGER DEFAULT 256,
    min_bandwidth           INTEGER DEFAULT 0,
    max_bandwidth           INTEGER DEFAULT 2000000,
    min_error_to_send       REAL DEFAULT 0.001,
    min_error_to_send_near  REAL DEFAULT 0.01,
    max_packet_size         INTEGER DEFAULT 1400,
    max_custom_file_size    INTEGER DEFAULT 0,
    disconnect_timeout      INTEGER,
    max_ping                INTEGER,
    max_desync              INTEGER,
    max_packet_loss         INTEGER,
    steam_protocol_max_data_size INTEGER
);

CREATE TABLE IF NOT EXISTS workshop_mod (
    id                  INTEGER PRIMARY KEY,
    name                TEXT,
    last_updated        TEXT,
    file_size           INTEGER NOT NULL DEFAULT 0,
    server_only         BOOLEAN NOT NULL DEFAULT 0,
    installation_status TEXT,
    error_status        TEXT,
    server_type         TEXT NOT NULL,
    thumbnail           TEXT
);

CREATE TABLE IF NOT EXISTS arma3server (
    id                     INTEGER PRIMARY KEY,
    client_file_patching   BOOLEAN NOT NULL DEFAULT 0,
    server_file_patching   BOOLEAN NOT NULL DEFAULT 0,
    persistent             BOOLEAN NOT NULL DEFAULT 0,
    battl_eye              BOOLEAN NOT NULL DEFAULT 0,
    von_enabled            BOOLEAN NOT NULL DEFAULT 0,
    verify_signatures      BOOLEAN NOT NULL DEFAULT 0,
    additional_options     TEXT,
    server_command_password TEXT,
    motd_interval          INTEGER,
    difficulty_settings_id INTEGER REFERENCES arma3_difficulty_settings(id),
    network_settings_id    INTEGER REFERENCES arma3_network_settings(id),
    forced_difficulty      TEXT NOT NULL DEFAULT 'custom',
    auto_select_mission    BOOLEAN NOT NULL DEFAULT 1,
    random_mission_order   BOOLEAN NOT NULL DEFAULT 0,
    missions_to_server_restart INTEGER NOT NULL DEFAULT 0,
    vote_threshold         REAL,
    vote_mission_players   INTEGER,
    lobby_timeout          INTEGER,
    von_codec_quality      INTEGER NOT NULL DEFAULT 30,
    kick_duplicate         BOOLEAN NOT NULL DEFAULT 1,
    kick_on_slow_network_ping BOOLEAN NOT NULL DEFAULT 1,
    kick_on_slow_network_packet_loss BOOLEAN NOT NULL DEFAULT 1,
    kick_on_slow_network_desync BOOLEAN NOT NULL DEFAULT 1,
    kick_on_slow_network_disconnect BOOLEAN NOT NULL DEFAULT 1,
    disconnect_timeout     INTEGER,
    max_ping               INTEGER,
    max_desync             INTEGER,
    max_packet_loss        INTEGER,
    idle_fps_limit         INTEGER,
    skip_description_parsing BOOLEAN DEFAULT 0,
    log_object_not_found   BOOLEAN DEFAULT 0,
    enable_player_diag     BOOLEAN DEFAULT 0,
    force_rotor_lib_simulation BOOLEAN DEFAULT 0,
    drawing_in_map         BOOLEAN DEFAULT 1,
    enable_debug_console   INTEGER DEFAULT 0,
    voting_timeout         INTEGER,
    role_timeout           INTEGER,
    briefing_timeout       INTEGER,
    debriefing_timeout     INTEGER,
    skip_lobby             BOOLEAN NOT NULL DEFAULT 0,
    allow_profile_glasses  BOOLEAN NOT NULL DEFAULT 1,
    required_build         INTEGER,
    statistics_enabled     BOOLEAN NOT NULL DEFAULT 1,
    arma_units_timeout     INTEGER,
    override_haze_quality  INTEGER,
    FOREIGN KEY (id) REFERENCES server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_active_mods (
    arma3server_id INTEGER NOT NULL,
    active_mods_id INTEGER NOT NULL,
    PRIMARY KEY (arma3server_id, active_mods_id),
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE,
    FOREIGN KEY (active_mods_id) REFERENCES workshop_mod(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_activedlcs (
    arma3server_id INTEGER NOT NULL,
    activedlcs     TEXT NOT NULL,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_motd (
    arma3server_id INTEGER NOT NULL,
    motd           TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_admins (
    arma3server_id INTEGER NOT NULL,
    admin_uid      TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_allowed_load_ext (
    arma3server_id INTEGER NOT NULL,
    extension      TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_allowed_preprocess_ext (
    arma3server_id INTEGER NOT NULL,
    extension      TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_allowed_html_ext (
    arma3server_id INTEGER NOT NULL,
    extension      TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_headless_clients_ips (
    arma3server_id INTEGER NOT NULL,
    ip             TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_local_client_ips (
    arma3server_id INTEGER NOT NULL,
    ip             TEXT,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_missions (
    arma3server_id INTEGER NOT NULL,
    template       TEXT NOT NULL,
    difficulty     TEXT NOT NULL,
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_allowed_html_uris (
    arma3server_id INTEGER NOT NULL,
    uri            TEXT NOT NULL,
    PRIMARY KEY (arma3server_id, uri),
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS arma3server_debug_console_admins (
    arma3server_id INTEGER NOT NULL,
    admin_uid      TEXT NOT NULL,
    PRIMARY KEY (arma3server_id, admin_uid),
    FOREIGN KEY (arma3server_id) REFERENCES arma3server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dayzserver (
    id                        INTEGER PRIMARY KEY,
    respawn_time              INTEGER NOT NULL DEFAULT 0,
    persistent                BOOLEAN NOT NULL DEFAULT 0,
    von_enabled               BOOLEAN NOT NULL DEFAULT 0,
    force_same_build          BOOLEAN NOT NULL DEFAULT 0,
    third_person_view_enabled BOOLEAN NOT NULL DEFAULT 0,
    crosshair_enabled         BOOLEAN NOT NULL DEFAULT 0,
    client_file_patching      BOOLEAN NOT NULL DEFAULT 0,
    time_acceleration         REAL NOT NULL DEFAULT 1.0,
    night_time_acceleration   REAL NOT NULL DEFAULT 1.0,
    additional_options        TEXT,
    battl_eye                 BOOLEAN NOT NULL DEFAULT 1,
    verify_signatures         BOOLEAN NOT NULL DEFAULT 1,
    enable_whitelist          BOOLEAN NOT NULL DEFAULT 0,
    disable_banlist           BOOLEAN NOT NULL DEFAULT 0,
    disable_prioritylist      BOOLEAN NOT NULL DEFAULT 0,
    disable_von               BOOLEAN NOT NULL DEFAULT 0,
    von_codec_quality         INTEGER NOT NULL DEFAULT 20,
    disable_3rd_person        BOOLEAN NOT NULL DEFAULT 0,
    disable_crosshair         BOOLEAN NOT NULL DEFAULT 0,
    server_time               TEXT NOT NULL DEFAULT 'SystemTime',
    server_time_persistent    BOOLEAN NOT NULL DEFAULT 0,
    login_queue_concurrent    INTEGER NOT NULL DEFAULT 5,
    login_queue_max           INTEGER NOT NULL DEFAULT 500,
    instance_id               INTEGER NOT NULL DEFAULT 1,
    storage_auto_fix          BOOLEAN NOT NULL DEFAULT 1,
    motd_interval             INTEGER NOT NULL DEFAULT 5,
    time_stamp_format         TEXT NOT NULL DEFAULT 'Short',
    log_average_fps           INTEGER NOT NULL DEFAULT 1,
    log_memory                INTEGER NOT NULL DEFAULT 1,
    log_players               INTEGER NOT NULL DEFAULT 1,
    admin_log_player_hits     BOOLEAN NOT NULL DEFAULT 0,
    admin_log_placement       BOOLEAN NOT NULL DEFAULT 0,
    admin_log_build_actions   BOOLEAN NOT NULL DEFAULT 0,
    admin_log_player_list     BOOLEAN NOT NULL DEFAULT 0,
    enable_debug_monitor      BOOLEAN NOT NULL DEFAULT 0,
    allow_file_patching       BOOLEAN NOT NULL DEFAULT 0,
    simulated_players_batch   INTEGER NOT NULL DEFAULT 20,
    multithreaded_replication BOOLEAN NOT NULL DEFAULT 1,
    speedhack_detection       INTEGER NOT NULL DEFAULT 1,
    lighting_config           INTEGER NOT NULL DEFAULT 0,
    disable_personal_light    BOOLEAN NOT NULL DEFAULT 0,
    disable_base_damage       BOOLEAN NOT NULL DEFAULT 0,
    disable_container_damage  BOOLEAN NOT NULL DEFAULT 0,
    disable_respawn_dialog    BOOLEAN NOT NULL DEFAULT 0,
    ping_warning              INTEGER NOT NULL DEFAULT 200,
    ping_critical             INTEGER NOT NULL DEFAULT 250,
    max_ping_dayz             INTEGER NOT NULL DEFAULT 300,
    server_fps_warning        INTEGER NOT NULL DEFAULT 15,
    shot_validation           BOOLEAN NOT NULL DEFAULT 1,
    scenario_id               TEXT NOT NULL DEFAULT 'dayzOffline.chernarusplus',
    profiles_path             TEXT DEFAULT 'profiles',
    battleye_path             TEXT DEFAULT 'battleye',
    enable_do_logs            INTEGER DEFAULT 1,
    enable_admin_log          INTEGER DEFAULT 1,
    enable_net_log            INTEGER DEFAULT 1,
    enable_freeze_check       INTEGER DEFAULT 1,
    limit_fps                 INTEGER DEFAULT 60,
    FOREIGN KEY (id) REFERENCES server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dayzserver_active_mods (
    dayzserver_id  INTEGER NOT NULL,
    active_mods_id INTEGER NOT NULL,
    PRIMARY KEY (dayzserver_id, active_mods_id),
    FOREIGN KEY (dayzserver_id) REFERENCES dayzserver(id) ON DELETE CASCADE,
    FOREIGN KEY (active_mods_id) REFERENCES workshop_mod(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dayzserver_motd (
    dayzserver_id INTEGER NOT NULL,
    motd          TEXT,
    FOREIGN KEY (dayzserver_id) REFERENCES dayzserver(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reforger_server (
    id                        INTEGER PRIMARY KEY,
    scenario_id               TEXT,
    third_person_view_enabled BOOLEAN NOT NULL DEFAULT 0,
    battl_eye                 BOOLEAN NOT NULL DEFAULT 0,
    additional_options        TEXT,
    visible                   BOOLEAN NOT NULL DEFAULT 1,
    cross_platform            BOOLEAN NOT NULL DEFAULT 0,
    server_max_view_distance  INTEGER NOT NULL DEFAULT 2500,
    server_min_grass_distance INTEGER NOT NULL DEFAULT 50,
    network_view_distance     INTEGER NOT NULL DEFAULT 1000,
    fast_validation           BOOLEAN NOT NULL DEFAULT 1,
    disable_ai                BOOLEAN NOT NULL DEFAULT 0,
    ai_limit                  INTEGER NOT NULL DEFAULT -1,
    von_can_transmit_cross_faction BOOLEAN NOT NULL DEFAULT 0,
    auto_save_interval        INTEGER NOT NULL DEFAULT 5,
    join_queue_max_size       INTEGER NOT NULL DEFAULT 32,
    max_fps                   INTEGER NOT NULL DEFAULT 120,
    mission_header            TEXT,
    network_dynamic_simulation INTEGER,
    replication_timeout_ms    INTEGER,
    streams_delta             INTEGER,
    streaming_budget          INTEGER,
    log_stats_interval_ms     INTEGER,
    addons_verify             BOOLEAN NOT NULL DEFAULT 0,
    addons_repair             BOOLEAN NOT NULL DEFAULT 0,
    no_throw                  BOOLEAN NOT NULL DEFAULT 0,
    log_stats                 BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reforger_server_active_mods (
    reforger_server_id INTEGER NOT NULL,
    name               TEXT NOT NULL,
    id                 TEXT NOT NULL,
    thumbnail          TEXT,
    FOREIGN KEY (reforger_server_id) REFERENCES reforger_server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS server_launch_parameters (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER NOT NULL,
    name      TEXT,
    value     TEXT,
    FOREIGN KEY (server_id) REFERENCES server(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workshop_mod_bikey (
    workshop_mod_id INTEGER NOT NULL,
    bikey           TEXT NOT NULL,
    FOREIGN KEY (workshop_mod_id) REFERENCES workshop_mod(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS server_installation (
    type                TEXT PRIMARY KEY,
    version             TEXT,
    last_updated_at     TEXT,
    installation_status TEXT,
    error_status        TEXT,
    branch              TEXT NOT NULL,
    available_version   TEXT,
    installed_buildid   TEXT,
    installed_branch    TEXT
);

CREATE TABLE IF NOT EXISTS available_branches (
    type   TEXT NOT NULL,
    branch TEXT NOT NULL,
    PRIMARY KEY (type, branch),
    FOREIGN KEY (type) REFERENCES server_installation(type) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS steam_auth (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    username           TEXT,
    password           TEXT,
    steam_guard_token  TEXT,
    refresh_token      TEXT,
    account_name       TEXT
);

CREATE TABLE IF NOT EXISTS mod_preset (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS preset_mod (
    preset_id INTEGER NOT NULL,
    mod_id    INTEGER NOT NULL,
    PRIMARY KEY (preset_id, mod_id),
    FOREIGN KEY (preset_id) REFERENCES mod_preset (id) ON DELETE CASCADE,
    FOREIGN KEY (mod_id) REFERENCES workshop_mod (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reforger_mod_scenarios (
    mod_id       TEXT NOT NULL,
    mod_name     TEXT,
    scenario_id  TEXT NOT NULL,
    name         TEXT NOT NULL,
    game_mode    TEXT,
    player_count INTEGER,
    PRIMARY KEY (mod_id, scenario_id)
);

CREATE TABLE IF NOT EXISTS reforger_vanilla_scenarios (
    scenario_id TEXT PRIMARY KEY,
    name        TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_arma3server_active_mods_server ON arma3server_active_mods(arma3server_id);
CREATE INDEX IF NOT EXISTS idx_dayzserver_active_mods_server ON dayzserver_active_mods(dayzserver_id);
CREATE INDEX IF NOT EXISTS idx_reforger_server_active_mods_server ON reforger_server_active_mods(reforger_server_id);
CREATE INDEX IF NOT EXISTS idx_server_launch_parameters_server ON server_launch_parameters(server_id);
CREATE INDEX IF NOT EXISTS idx_workshop_mod_server_type ON workshop_mod(server_type);

-- Seeds
INSERT INTO app_settings (log_retention_days) VALUES (30);

INSERT INTO server_installation (type, version, last_updated_at, installation_status, branch) VALUES
('ARMA3', NULL, NULL, 'NOT_INSTALLED', 'PUBLIC'),
('DAYZ', NULL, NULL, 'NOT_INSTALLED', 'PUBLIC'),
('DAYZ_EXP', NULL, NULL, 'NOT_INSTALLED', 'PUBLIC'),
('REFORGER', NULL, NULL, 'NOT_INSTALLED', 'PUBLIC');

INSERT INTO available_branches (type, branch) VALUES
('ARMA3', 'PUBLIC'),
('ARMA3', 'PROFILING'),
('ARMA3', 'CONTACT'),
('ARMA3', 'CREATORDLC'),
('DAYZ', 'PUBLIC'),
('DAYZ_EXP', 'PUBLIC'),
('REFORGER', 'PUBLIC');
