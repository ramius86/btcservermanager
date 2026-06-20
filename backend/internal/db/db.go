package db

import (
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	// Register the pure-Go SQLite driver
	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func Connect(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", buildDSN(databaseURL))
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// SQLite serializes all writers regardless of pool size — a pool > 1 only
	// increases lock contention without adding throughput. One connection is
	// the correct setting for a write-heavy workload on a single SQLite file.
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)

	return db, nil
}

func buildDSN(databaseURL string) string {
	// If it's already a file URI, use it as is
	if strings.HasPrefix(databaseURL, "file:") {
		return databaseURL
	}

	// Otherwise, wrap it in a file URI with mandatory pragmas for concurrent reliability.
	// _pragma=busy_timeout(30000) is critical: it makes SQLite wait instead of failing immediately with SQLITE_BUSY.
	return fmt.Sprintf("file:%s?_pragma=foreign_keys(1)&_pragma=journal_mode(WAL)&_pragma=busy_timeout(30000)&_pragma=synchronous(NORMAL)", databaseURL)
}

func Migrate(databaseURL string) error {
	// Open a separate, dedicated connection exclusively for the migration run.
	// golang-migrate's WithInstance takes ownership of the *sql.DB it receives:
	// m.Close() will close it. We must NOT pass the shared application pool or
	// we'll tear it down when the migration finishes.
	migrationDB, err := sql.Open("sqlite", buildDSN(databaseURL))
	if err != nil {
		return fmt.Errorf("failed to open migration database: %w", err)
	}
	// Single connection: migrations run serially and we want the lock released ASAP.
	migrationDB.SetMaxOpenConns(1)

	driver, err := sqlite.WithInstance(migrationDB, &sqlite.Config{})
	if err != nil {
		_ = migrationDB.Close()
		return fmt.Errorf("failed to create migrate driver: %w", err)
	}

	source, err := iofs.New(migrationsFS, "migrations")
	if err != nil {
		_ = migrationDB.Close()
		return fmt.Errorf("failed to create migrate source: %w", err)
	}

	m, err := migrate.NewWithInstance("iofs", source, "sqlite", driver)
	if err != nil {
		_ = migrationDB.Close()
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}

	upErr := m.Up()

	// m.Close() also closes migrationDB; call it in all exit paths to release
	// the lock on schema_migrations and free the connection.
	srcErr, dbErr := m.Close()
	if srcErr != nil {
		log.Printf("Warning: migrate source close error: %v", srcErr)
	}
	if dbErr != nil {
		log.Printf("Warning: migrate driver close error: %v", dbErr)
	}

	if upErr != nil && !errors.Is(upErr, migrate.ErrNoChange) {
		return fmt.Errorf("failed to run migrations: %w", upErr)
	}

	log.Println("Database migrations applied successfully")

	return nil
}
