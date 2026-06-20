CREATE TABLE IF NOT EXISTS discord_users (
    id         TEXT PRIMARY KEY,
    username   TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS discord_event_participations (
    event_id   INTEGER NOT NULL,
    user_id    TEXT NOT NULL,
    status     TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES discord_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES discord_users(id) ON DELETE CASCADE
);
