ALTER TABLE app_settings ADD COLUMN discord_alert_channel_id TEXT NOT NULL DEFAULT '';
ALTER TABLE app_settings ADD COLUMN discord_alert_server_offline INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_settings ADD COLUMN discord_alert_mod_updates INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_settings ADD COLUMN discord_alert_game_updates INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_settings ADD COLUMN mod_update_check_interval_minutes INTEGER NOT NULL DEFAULT 360;
ALTER TABLE app_settings ADD COLUMN game_update_check_interval_minutes INTEGER NOT NULL DEFAULT 15;
