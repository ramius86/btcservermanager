-- 1 when the server was running and must be started again after a manager
-- restart; 0 when the user stopped it or the restore gave up.
ALTER TABLE server ADD COLUMN desired_running BOOLEAN NOT NULL DEFAULT 0;

-- Feature switch shown in Settings > System.
ALTER TABLE app_settings ADD COLUMN restore_servers_on_start INTEGER NOT NULL DEFAULT 1;
