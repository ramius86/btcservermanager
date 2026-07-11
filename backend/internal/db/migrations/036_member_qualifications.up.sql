-- Store configured role IDs and qualification names in app_settings
ALTER TABLE app_settings ADD COLUMN member_role_ids TEXT NOT NULL DEFAULT '[]';
ALTER TABLE app_settings ADD COLUMN qualification_names TEXT NOT NULL DEFAULT '[]';

-- Store per-member qualifications
CREATE TABLE IF NOT EXISTS member_qualifications (
    user_id            TEXT NOT NULL,
    qualification_name TEXT NOT NULL,
    PRIMARY KEY (user_id, qualification_name)
);
