ALTER TABLE reforger_server ADD COLUMN admins TEXT DEFAULT '[]';
ALTER TABLE reforger_server ADD COLUMN nwk_resolution INTEGER;
ALTER TABLE reforger_server ADD COLUMN disable_navmesh_streaming BOOLEAN DEFAULT 0;
