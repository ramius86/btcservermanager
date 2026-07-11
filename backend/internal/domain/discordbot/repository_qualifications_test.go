package discordbot_test

import (
	"btcservermanager/internal/domain/discordbot"
	"context"
	"database/sql"
	"testing"

	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open test db: %v", err)
	}

	_, err = db.Exec(`
		CREATE TABLE member_qualifications (
			user_id            TEXT NOT NULL,
			qualification_name TEXT NOT NULL,
			PRIMARY KEY (user_id, qualification_name)
		);
	`)
	if err != nil {
		t.Fatalf("Failed to create table: %v", err)
	}

	return db
}

func TestRepository_SaveMemberQualifications(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	quals := []discordbot.MemberQualification{
		{UserID: "user1", QualificationName: "Medic"},
		{UserID: "user1", QualificationName: "AT"},
		{UserID: "user2", QualificationName: "MG"},
	}

	if err := repo.SaveMemberQualifications(ctx, []string{"user1", "user2"}, quals); err != nil {
		t.Fatalf("Failed to save qualifications: %v", err)
	}

	res, err := repo.GetMemberQualifications(ctx, []string{"user1", "user2"})
	if err != nil {
		t.Fatalf("Failed to get qualifications: %v", err)
	}

	if len(res["user1"]) != 2 {
		t.Errorf("Expected user1 to have 2 qualifications, got %v", len(res["user1"]))
	}
	if len(res["user2"]) != 1 {
		t.Errorf("Expected user2 to have 1 qualification, got %v", len(res["user2"]))
	}

	// Test Scoped Deletion: Update qualifications only for user1. user2's qualification should remain untouched if user2 is not in the scope.
	user1NewQuals := []discordbot.MemberQualification{
		{UserID: "user1", QualificationName: "Medic"}, // AT removed
	}
	if err := repo.SaveMemberQualifications(ctx, []string{"user1"}, user1NewQuals); err != nil {
		t.Fatalf("Failed to save user1 qualifications: %v", err)
	}

	res, err = repo.GetMemberQualifications(ctx, []string{"user1", "user2"})
	if err != nil {
		t.Fatalf("Failed to get qualifications: %v", err)
	}

	if len(res["user1"]) != 1 || res["user1"][0] != "Medic" {
		t.Errorf("Expected user1 to only have Medic qualification, got %v", res["user1"])
	}
	if len(res["user2"]) != 1 || res["user2"][0] != "MG" {
		t.Errorf("Expected user2 qualification to remain MG, got %v", res["user2"])
	}
}

func TestRepository_CleanupOrphanedQualifications(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	quals := []discordbot.MemberQualification{
		{UserID: "user1", QualificationName: "Medic"},
		{UserID: "user1", QualificationName: "AT"},
		{UserID: "user2", QualificationName: "MG"},
	}

	_ = repo.SaveMemberQualifications(ctx, []string{"user1", "user2"}, quals)

	if err := repo.CleanupOrphanedQualifications(ctx, []string{"Medic"}); err != nil {
		t.Fatalf("Failed to cleanup: %v", err)
	}

	res, err := repo.GetMemberQualifications(ctx, []string{"user1", "user2"})
	if err != nil {
		t.Fatalf("Failed to get qualifications: %v", err)
	}

	if len(res["user1"]) != 1 || res["user1"][0] != "Medic" {
		t.Errorf("Expected user1 to only have Medic, got %v", res["user1"])
	}
	if len(res["user2"]) != 0 {
		t.Errorf("Expected user2 to have no qualifications, got %v", res["user2"])
	}
}

func TestRepository_RenameQualification(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := discordbot.NewRepository(db)
	ctx := context.Background()

	// Initial data:
	// user1 has: Medic, AT
	// user2 has: Medic
	quals := []discordbot.MemberQualification{
		{UserID: "user1", QualificationName: "Medic"},
		{UserID: "user1", QualificationName: "AT"},
		{UserID: "user2", QualificationName: "Medic"},
	}

	_ = repo.SaveMemberQualifications(ctx, []string{"user1", "user2"}, quals)

	// Test 1: Simple rename (AT -> AntiTank)
	if err := repo.RenameQualification(ctx, "AT", "AntiTank"); err != nil {
		t.Fatalf("Failed to rename AT: %v", err)
	}

	res, err := repo.GetMemberQualifications(ctx, []string{"user1", "user2"})
	if err != nil {
		t.Fatalf("Failed to get qualifications: %v", err)
	}

	// Verify user1 now has AntiTank instead of AT
	hasAntiTank := false
	for _, q := range res["user1"] {
		if q == "AT" {
			t.Errorf("user1 should not have old name AT")
		}
		if q == "AntiTank" {
			hasAntiTank = true
		}
	}
	if !hasAntiTank {
		t.Errorf("user1 should have renamed qualification AntiTank")
	}

	// Test 2: Rename with collision (Medic -> AntiTank)
	// user1 already has AntiTank. user2 only has Medic.
	// This tests if the duplicate row for user1 gets deleted, while user2 is correctly renamed.
	if err := repo.RenameQualification(ctx, "Medic", "AntiTank"); err != nil {
		t.Fatalf("Failed to rename Medic with collision: %v", err)
	}

	res, err = repo.GetMemberQualifications(ctx, []string{"user1", "user2"})
	if err != nil {
		t.Fatalf("Failed to get qualifications: %v", err)
	}

	// Verify user1 only has AntiTank once (no duplicate and no constraint crash)
	antiTankCount := 0
	for _, q := range res["user1"] {
		if q == "AntiTank" {
			antiTankCount++
		}
	}
	if antiTankCount != 1 {
		t.Errorf("Expected user1 to have exactly 1 AntiTank, got %d", antiTankCount)
	}

	// Verify user2 now has AntiTank
	hasAntiTank = false
	for _, q := range res["user2"] {
		if q == "AntiTank" {
			hasAntiTank = true
		}
	}
	if !hasAntiTank {
		t.Errorf("user2 should have been renamed to AntiTank")
	}
}
