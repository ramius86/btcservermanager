CREATE TABLE IF NOT EXISTS reforger_preset_mod (
    preset_id INTEGER NOT NULL,
    mod_id TEXT NOT NULL,
    name TEXT NOT NULL,
    thumbnail TEXT,
    PRIMARY KEY (preset_id, mod_id),
    FOREIGN KEY (preset_id) REFERENCES mod_preset (id) ON DELETE CASCADE
);
