CREATE TABLE IF NOT EXISTS discord_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id TEXT    NOT NULL,
    message_id TEXT    NOT NULL,
    title      TEXT    NOT NULL,
    date_time  TEXT    NOT NULL,
    game_type  TEXT    NOT NULL DEFAULT 'arma3',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
