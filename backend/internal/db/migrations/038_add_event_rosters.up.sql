ALTER TABLE app_settings ADD COLUMN event_roster_enabled BOOLEAN NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS discord_event_rosters (
    event_id   INTEGER PRIMARY KEY,
    data       TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES discord_events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS discord_roster_templates (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    game_type   TEXT NOT NULL DEFAULT 'all',
    structure   TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS discord_player_role_history (
    user_id      TEXT NOT NULL,
    player_name  TEXT NOT NULL,
    role         TEXT NOT NULL,
    game_type    TEXT NOT NULL DEFAULT 'all',
    play_count   INTEGER NOT NULL DEFAULT 1,
    last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, role, game_type)
);
