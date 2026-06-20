-- SQLite doesn't support DROP COLUMN in older versions. 
-- In a production environment, we would recreate the table.
-- For now, we leave the columns as they don't interfere with the application if not used.
SELECT 1;
