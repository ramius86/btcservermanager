ALTER TABLE app_settings ADD COLUMN discord_reminder_hours INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_settings ADD COLUMN discord_reminder_message TEXT NOT NULL DEFAULT 'Reminder: Please update your RSVP for the upcoming event!';
ALTER TABLE discord_events ADD COLUMN reminder_sent INTEGER NOT NULL DEFAULT 0;
