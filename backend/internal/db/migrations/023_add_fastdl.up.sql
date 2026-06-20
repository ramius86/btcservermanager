-- 023_add_fastdl.up.sql
ALTER TABLE arma3server ADD COLUMN fast_download_enabled BOOLEAN NOT NULL DEFAULT 0;
