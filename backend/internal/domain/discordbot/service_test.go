package discordbot

import (
	"btcservermanager/internal/db"
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/bwmarrin/discordgo"
	// blank import needed to register sqlite driver for tests
	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) *Repository {
	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Connect(dbPath)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	t.Cleanup(func() { database.Close() })
	if err := db.Migrate(dbPath); err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	return NewRepository(database)
}

func TestRepository_EventOperations(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	// 1. SaveEvent
	event := &Event{
		ChannelID: "chan123",
		MessageID: "msg456",
		Title:     "Operation Red Dawn",
		DateTime:  time.Now().Format("2006-01-02T15:04"),
		GameType:  "arma3",
	}

	id, err := repo.SaveEvent(ctx, event)
	if err != nil {
		t.Fatalf("failed to save event: %v", err)
	}
	event.ID = id

	// 2. GetEventByID
	got, err := repo.GetEventByID(ctx, id)
	if err != nil {
		t.Fatalf("failed to get event by ID: %v", err)
	}
	if got.Title != event.Title || got.MessageID != event.MessageID {
		t.Errorf("expected %+v, got %+v", event, got)
	}

	// 3. GetEventByMessageID
	gotMsg, err := repo.GetEventByMessageID(ctx, "msg456")
	if err != nil {
		t.Fatalf("failed to get event by Message ID: %v", err)
	}
	if gotMsg.ID != id {
		t.Errorf("expected ID %d, got %d", id, gotMsg.ID)
	}

	// 4. UpdateEvent
	err = repo.UpdateEvent(ctx, id, "Updated Title", event.DateTime, "reforger")
	if err != nil {
		t.Fatalf("failed to update event: %v", err)
	}
	gotUpdated, err := repo.GetEventByID(ctx, id)
	if err != nil {
		t.Fatalf("failed to get updated event: %v", err)
	}
	if gotUpdated.Title != "Updated Title" || gotUpdated.GameType != "reforger" {
		t.Errorf("update failed, got %+v", gotUpdated)
	}

	// 5. GetAllEvents
	all, err := repo.GetAllEvents(ctx)
	if err != nil {
		t.Fatalf("failed to get all events: %v", err)
	}
	if len(all) != 1 || all[0].ID != id {
		t.Errorf("expected 1 event with ID %d, got %d events", id, len(all))
	}

	// 6. DeleteEvent
	err = repo.DeleteEvent(ctx, id)
	if err != nil {
		t.Fatalf("failed to delete event: %v", err)
	}
	_, err = repo.GetEventByID(ctx, id)
	if err == nil {
		t.Error("expected error getting deleted event, got nil")
	}
}

func TestRepository_UserAndParticipationOperations(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	// Setup Event
	event := &Event{
		ChannelID: "chan123",
		MessageID: "msg456",
		Title:     "Operation Red Dawn",
		DateTime:  time.Now().Format("2006-01-02T15:04"),
		GameType:  "arma3",
	}
	id, _ := repo.SaveEvent(ctx, event)

	// 1. UpsertUser
	err := repo.UpsertUser(ctx, "user1", "Alice")
	if err != nil {
		t.Fatalf("failed to upsert user: %v", err)
	}
	// Update username
	err = repo.UpsertUser(ctx, "user1", "AliceUpdated")
	if err != nil {
		t.Fatalf("failed to update user: %v", err)
	}

	// 2. UpsertParticipation
	err = repo.UpsertParticipation(ctx, id, "user1", "going")
	if err != nil {
		t.Fatalf("failed to upsert participation: %v", err)
	}

	// 3. GetEventParticipations
	parts, err := repo.GetEventParticipations(ctx, id)
	if err != nil {
		t.Fatalf("failed to get participations: %v", err)
	}
	if len(parts) != 1 || parts[0].UserID != "user1" || parts[0].Username != "AliceUpdated" || parts[0].Status != "going" {
		t.Errorf("unexpected participations list: %+v", parts)
	}

	// 4. GetAttendanceStats
	stats, err := repo.GetAttendanceStats(ctx)
	if err != nil {
		t.Fatalf("failed to get attendance stats: %v", err)
	}
	if len(stats) != 1 || stats[0].UserID != "user1" || stats[0].Username != "AliceUpdated" || stats[0].Status != "going" {
		t.Errorf("unexpected attendance stats: %+v", stats)
	}
}

func TestService_NotConfigured(t *testing.T) {
	// Try creating with empty token/guildID
	_, err := New("", "", nil)
	if err == nil {
		t.Error("expected error creating Service with empty credentials, got nil")
	}

	// Try create with valid dummy credentials (it won't connect unless Open() is called)
	svc, err := New("dummy_token", "dummy_guild", nil)
	if err != nil {
		t.Fatalf("failed to create Service: %v", err)
	}

	if !svc.IsConfigured() {
		t.Error("expected IsConfigured to be true when session is not nil")
	}

	// Test calls that fail with errBotNotConfigured if session is nil
	svcNil := &Service{session: nil}

	_, err = svcNil.GetChannels()
	if err == nil || !strings.Contains(err.Error(), errBotNotConfigured) {
		t.Errorf("expected error %q, got %v", errBotNotConfigured, err)
	}

	_, err = svcNil.GetRoles(context.Background())
	if err == nil || !strings.Contains(err.Error(), errBotNotConfigured) {
		t.Errorf("expected error %q, got %v", errBotNotConfigured, err)
	}

	_, err = svcNil.CreateEventMessage(context.Background(), "c", "t", "d", "g", "", "")
	if err == nil || !strings.Contains(err.Error(), errBotNotConfigured) {
		t.Errorf("expected error %q, got %v", errBotNotConfigured, err)
	}

	_, err = svcNil.UpdateEventMessage(context.Background(), 1, "t", "d", "g")
	if err == nil || !strings.Contains(err.Error(), errBotNotConfigured) {
		t.Errorf("expected error %q, got %v", errBotNotConfigured, err)
	}
}

func TestHelpers(t *testing.T) {
	// Test statusFromCustomID
	if got := statusFromCustomID(goingCustomID); got != "going" {
		t.Errorf("expected going, got %s", got)
	}
	if got := statusFromCustomID(notGoingCustomID); got != "not_going" {
		t.Errorf("expected not_going, got %s", got)
	}
	if got := statusFromCustomID(maybeCustomID); got != "maybe" {
		t.Errorf("expected maybe, got %s", got)
	}
	if got := statusFromCustomID("invalid"); got != "" {
		t.Errorf("expected empty string, got %s", got)
	}

	// Test getInteractionUserID
	mUser := &discordgo.User{ID: "member123"}
	memberInteraction := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			Member: &discordgo.Member{
				User: mUser,
			},
		},
	}
	if got := getInteractionUserID(memberInteraction); got != "member123" {
		t.Errorf("expected member123, got %s", got)
	}

	userInteraction := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			User: &discordgo.User{ID: "user456"},
		},
	}
	if got := getInteractionUserID(userInteraction); got != "user456" {
		t.Errorf("expected user456, got %s", got)
	}

	emptyInteraction := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{},
	}
	if got := getInteractionUserID(emptyInteraction); got != "" {
		t.Errorf("expected empty string, got %s", got)
	}

	// Test groupParticipants
	parts := []Participation{
		{Username: "Alice", Status: "going"},
		{Username: "Bob", Status: "not_going"},
		{Username: "Charlie", Status: "maybe"},
		{Username: "Dave", Status: "going"},
	}
	going, notGoing, maybe := groupParticipants(parts)
	if len(going) != 2 || going[0] != "Alice" || going[1] != "Dave" {
		t.Errorf("unexpected going list: %v", going)
	}
	if len(notGoing) != 1 || notGoing[0] != "Bob" {
		t.Errorf("unexpected notGoing list: %v", notGoing)
	}
	if len(maybe) != 1 || maybe[0] != "Charlie" {
		t.Errorf("unexpected maybe list: %v", maybe)
	}
}

func TestFormatUsersForField(t *testing.T) {
	// Case 1: empty list
	if got := formatUsersForField(nil); got != "-" {
		t.Errorf("expected -, got %s", got)
	}

	// Case 2: single user
	if got := formatUsersForField([]string{"Alice"}); got != "Alice" {
		t.Errorf("expected Alice, got %s", got)
	}

	// Case 3: multiple users
	if got := formatUsersForField([]string{"Alice", "Bob"}); got != "Alice\nBob" {
		t.Errorf("expected Alice\\nBob, got %s", got)
	}

	// Case 4: truncating due to length limit
	var users []string
	for i := 0; i < 200; i++ {
		users = append(users, fmt.Sprintf("User%d_with_a_very_long_name_to_trigger_limit", i))
	}
	got := formatUsersForField(users)
	if !strings.Contains(got, "... e altri") {
		t.Errorf("expected result to contain truncating message, got: %s", got)
	}
}
