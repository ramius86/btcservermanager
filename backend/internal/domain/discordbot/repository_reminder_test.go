package discordbot

import (
	"context"
	"testing"
	"time"
)

func TestRepository_Reminders(t *testing.T) {
	repo := setupTestDB(t)
	ctx := context.Background()

	// 1. Create active and inactive users
	_ = repo.UpsertUser(ctx, "u1", "Active1")
	_ = repo.UpsertUser(ctx, "u2", "Active2")
	_ = repo.UpsertUser(ctx, "u3", "Inactive1")
	// Make u3 inactive
	_, _ = repo.db.ExecContext(ctx, "UPDATE discord_users SET is_active = 0 WHERE id = 'u3'")

	// 2. Create a future event (within 24 hours)
	futureTime := time.Now().Add(12 * time.Hour).Format("2006-01-02T15:04")
	event := &Event{
		ChannelID: "ch1",
		MessageID: "msg1",
		Title:     "Test Future Event",
		DateTime:  futureTime,
		GameType:  "arma3",
	}
	eventID, err := repo.SaveEvent(ctx, event)
	if err != nil {
		t.Fatalf("failed to save event: %v", err)
	}

	// 3. User 1 responds "going"
	_ = repo.UpsertParticipation(ctx, eventID, "u1", "going")

	// 4. Get NoResponseUserIDs (should only be "u2" since u1 responded and u3 is inactive)
	noResp, err := repo.GetNoResponseUserIDs(ctx, eventID)
	if err != nil {
		t.Fatalf("failed to get no response users: %v", err)
	}
	if len(noResp) != 1 || noResp[0] != "u2" {
		t.Errorf("expected only u2 as no response, got %v", noResp)
	}

	// 5. GetPendingReminderEvents for 24 hours (should return the event)
	pending, err := repo.GetPendingReminderEvents(ctx, 24)
	if err != nil {
		t.Fatalf("failed to get pending events: %v", err)
	}
	if len(pending) != 1 || pending[0].ID != eventID {
		t.Errorf("expected to find event %d, got %v", eventID, pending)
	}

	// 6. MarkReminderSent
	err = repo.MarkReminderSent(ctx, eventID)
	if err != nil {
		t.Fatalf("failed to mark reminder sent: %v", err)
	}

	// 7. Check if it's still pending (should not be)
	pending2, err := repo.GetPendingReminderEvents(ctx, 24)
	if err != nil {
		t.Fatalf("failed to get pending events again: %v", err)
	}
	if len(pending2) != 0 {
		t.Errorf("expected no pending events after marking as sent, got %d", len(pending2))
	}
}
