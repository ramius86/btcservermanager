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

	// 5. Test DeleteUserAndParticipations cascades qualifications and role history
	_ = repo.SaveMemberQualifications(ctx, []string{"user1"}, []MemberQualification{{UserID: "user1", QualificationName: "Medic"}})
	_ = repo.RecordPlayerRoleUsage(ctx, []PlayerRoleRecord{{UserID: "user1", PlayerName: "AliceUpdated", Role: "Rifleman"}}, "arma3")

	err = repo.DeleteUserAndParticipations(ctx, "user1")
	if err != nil {
		t.Fatalf("failed to delete user and participations: %v", err)
	}

	quals, err := repo.GetMemberQualifications(ctx, []string{"user1"})
	if err != nil {
		t.Fatalf("failed to get member qualifications: %v", err)
	}
	if len(quals["user1"]) != 0 {
		t.Errorf("expected 0 qualifications for deleted user, got %v", quals["user1"])
	}

	roles, err := repo.GetPlayerRoleStats(ctx, "all")
	if err != nil {
		t.Fatalf("failed to get role history: %v", err)
	}
	for _, r := range roles {
		if r.UserID == "user1" {
			t.Errorf("expected 0 role stats for deleted user1, found: %+v", r)
		}
	}

	partsAfter, err := repo.GetEventParticipations(ctx, id)
	if err != nil {
		t.Fatalf("failed to get participations after delete: %v", err)
	}
	if len(partsAfter) != 0 {
		t.Errorf("expected 0 participations after delete, got %v", partsAfter)
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

func TestHelpers_GetInteractionUsername(t *testing.T) {
	// 1. Nick takes precedence
	i1 := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			Member: &discordgo.Member{
				Nick: "ServerNick",
				User: &discordgo.User{Username: "user", GlobalName: "GlobalNick"},
			},
		},
	}
	if got := getInteractionUsername(i1); got != "ServerNick" {
		t.Errorf("expected ServerNick, got %s", got)
	}

	// 2. GlobalName takes precedence over Username when Nick is empty
	i2 := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			Member: &discordgo.Member{
				Nick: "",
				User: &discordgo.User{Username: "user", GlobalName: "GlobalNick"},
			},
		},
	}
	if got := getInteractionUsername(i2); got != "GlobalNick" {
		t.Errorf("expected GlobalNick, got %s", got)
	}

	// 3. Fallback to Username when Nick and GlobalName are empty
	i3 := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			Member: &discordgo.Member{
				Nick: "",
				User: &discordgo.User{Username: "raw_username", GlobalName: ""},
			},
		},
	}
	if got := getInteractionUsername(i3); got != "raw_username" {
		t.Errorf("expected raw_username, got %s", got)
	}

	// 4. User interaction with GlobalName
	i4 := &discordgo.InteractionCreate{
		Interaction: &discordgo.Interaction{
			User: &discordgo.User{Username: "raw_user", GlobalName: "UserGlobal"},
		},
	}
	if got := getInteractionUsername(i4); got != "UserGlobal" {
		t.Errorf("expected UserGlobal, got %s", got)
	}
}

func TestRepository_NicknameSyncOperations(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	// Setup initial user
	err := repo.UpsertUser(ctx, "u100", "OldNick")
	if err != nil {
		t.Fatalf("failed to upsert user: %v", err)
	}

	// Setup Event and Participation
	event := &Event{
		ChannelID: "chan100",
		MessageID: "msg100",
		Title:     "Active Op",
		DateTime:  time.Now().Add(1 * time.Hour).Format("2006-01-02T15:04"),
		GameType:  "arma3",
	}
	eID, err := repo.SaveEvent(ctx, event)
	if err != nil {
		t.Fatalf("failed to save event: %v", err)
	}
	_ = repo.UpsertParticipation(ctx, eID, "u100", "going")

	// 1. UpdateUserNickname when changed
	updated, err := repo.UpdateUserNickname(ctx, "u100", "NewNick")
	if err != nil || !updated {
		t.Fatalf("expected UpdateUserNickname to return true, got %v, err=%v", updated, err)
	}

	// Verify participations query now reflects new nickname
	parts, err := repo.GetEventParticipations(ctx, eID)
	if err != nil || len(parts) != 1 || parts[0].Username != "NewNick" {
		t.Fatalf("expected participation username to be NewNick, got %+v", parts)
	}

	// 2. UpdateUserNickname when NOT changed
	notUpdated, err := repo.UpdateUserNickname(ctx, "u100", "NewNick")
	if err != nil || notUpdated {
		t.Fatalf("expected UpdateUserNickname to return false for unchanged name, got %v, err=%v", notUpdated, err)
	}

	// 3. Batch SyncUserNicknames
	err = repo.UpsertUser(ctx, "u200", "OldBob")
	if err != nil {
		t.Fatalf("failed to upsert user 2: %v", err)
	}

	changedCount, err := repo.SyncUserNicknames(ctx, map[string]string{
		"u100": "FinalNick",
		"u200": "NewBob",
		"u300": "NotYetInDB", // Should be ignored gracefully
	})
	if err != nil {
		t.Fatalf("SyncUserNicknames failed: %v", err)
	}
	if changedCount != 2 {
		t.Errorf("expected 2 users updated, got %d", changedCount)
	}

	// Verify u200 updated
	users, _ := repo.GetAllUsers(ctx)
	foundU200 := false
	for _, u := range users {
		if u.ID == "u200" {
			foundU200 = true
			if u.Username != "NewBob" {
				t.Errorf("expected u200 username to be NewBob, got %s", u.Username)
			}
		}
	}
	if !foundU200 {
		t.Errorf("u200 not found in users")
	}

	// 4. GetActiveEventsForUser
	activeEvents, err := repo.GetActiveEventsForUser(ctx, "u100")
	if err != nil {
		t.Fatalf("GetActiveEventsForUser failed: %v", err)
	}
	if len(activeEvents) != 1 || activeEvents[0].ID != eID {
		t.Errorf("expected active event %d, got %v", eID, activeEvents)
	}
}

func TestRepository_UserGamesAndStatsFilter(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	// 1. Insert users
	if err := repo.UpsertUser(ctx, "u_alice", "Alice"); err != nil {
		t.Fatalf("failed to upsert user alice: %v", err)
	}
	if err := repo.UpsertUser(ctx, "u_bob", "Bob"); err != nil {
		t.Fatalf("failed to upsert user bob: %v", err)
	}

	// Verify defaults are true
	users, err := repo.GetAllUsers(ctx)
	if err != nil {
		t.Fatalf("failed to get all users: %v", err)
	}
	for _, u := range users {
		if !u.PlaysArma3 || !u.PlaysReforger {
			t.Errorf("expected user %s to play both games by default, got arma3=%v, reforger=%v", u.Username, u.PlaysArma3, u.PlaysReforger)
		}
	}

	// 2. Create Arma 3 event and Reforger event
	evArma3 := &Event{
		ChannelID: "chan1",
		MessageID: "msg1",
		Title:     "Arma 3 Mission",
		DateTime:  "2026-10-10T20:00",
		GameType:  "ArmA III",
	}
	idA3, err := repo.SaveEvent(ctx, evArma3)
	if err != nil {
		t.Fatalf("failed to save arma 3 event: %v", err)
	}

	evReforger := &Event{
		ChannelID: "chan2",
		MessageID: "msg2",
		Title:     "Reforger Conflict",
		DateTime:  "2026-10-11T20:00",
		GameType:  "Arma Reforger",
	}
	idRef, err := repo.SaveEvent(ctx, evReforger)
	if err != nil {
		t.Fatalf("failed to save reforger event: %v", err)
	}

	// 3. Set Bob to not play Reforger
	if err := repo.SetUserGames(ctx, "u_bob", true, false); err != nil {
		t.Fatalf("failed to set bob's games: %v", err)
	}

	// Verify Bob's updated flags
	users, _ = repo.GetAllUsers(ctx)
	for _, u := range users {
		if u.ID == "u_bob" {
			if !u.PlaysArma3 || u.PlaysReforger {
				t.Errorf("expected bob to play arma3 only, got arma3=%v, reforger=%v", u.PlaysArma3, u.PlaysReforger)
			}
		}
	}

	// 4. Check stats: Bob should have no_response for Arma 3, but NO row for Reforger
	stats, err := repo.GetAttendanceStats(ctx)
	if err != nil {
		t.Fatalf("failed to get attendance stats: %v", err)
	}

	bobA3Count := 0
	bobRefCount := 0
	aliceA3Count := 0
	aliceRefCount := 0

	for _, s := range stats {
		if s.UserID == "u_bob" {
			if s.GameType == "ArmA III" && s.Status == "no_response" {
				bobA3Count++
			}
			if s.GameType == "Arma Reforger" && s.Status == "no_response" {
				bobRefCount++
			}
		}
		if s.UserID == "u_alice" {
			if s.GameType == "ArmA III" && s.Status == "no_response" {
				aliceA3Count++
			}
			if s.GameType == "Arma Reforger" && s.Status == "no_response" {
				aliceRefCount++
			}
		}
	}

	if bobA3Count != 1 {
		t.Errorf("expected bob to have 1 no_response for Arma 3, got %d", bobA3Count)
	}
	if bobRefCount != 0 {
		t.Errorf("expected bob to have 0 no_response for Reforger, got %d", bobRefCount)
	}
	if aliceA3Count != 1 || aliceRefCount != 1 {
		t.Errorf("expected alice to have 1 each, got a3=%d, ref=%d", aliceA3Count, aliceRefCount)
	}

	// 5. Test GetNoResponseUserIDs filters out non-players
	noRespReforger, err := repo.GetNoResponseUserIDs(ctx, idRef)
	if err != nil {
		t.Fatalf("failed to get no response users for reforger: %v", err)
	}
	if len(noRespReforger) != 1 || noRespReforger[0] != "u_alice" {
		t.Errorf("expected only alice in noResponse for reforger, got %v", noRespReforger)
	}

	noRespA3, err := repo.GetNoResponseUserIDs(ctx, idA3)
	if err != nil {
		t.Fatalf("failed to get no response users for arma 3: %v", err)
	}
	if len(noRespA3) != 2 {
		t.Errorf("expected both alice and bob in noResponse for arma 3, got %v", noRespA3)
	}

	// 6. If Bob explicitly votes "not_going" on Reforger, his vote IS included
	if err := repo.UpsertParticipation(ctx, idRef, "u_bob", "not_going"); err != nil {
		t.Fatalf("failed to upsert participation: %v", err)
	}
	stats, _ = repo.GetAttendanceStats(ctx)
	foundBobExplicit := false
	for _, s := range stats {
		if s.UserID == "u_bob" && s.GameType == "Arma Reforger" && s.Status == "not_going" {
			foundBobExplicit = true
		}
	}
	if !foundBobExplicit {
		t.Errorf("expected bob's explicit not_going vote to be in stats")
	}

	// 7. Auto-enable on going
	if err := repo.EnsureUserPlaysGame(ctx, "u_bob", "Arma Reforger"); err != nil {
		t.Fatalf("failed to ensure user plays game: %v", err)
	}
	users, _ = repo.GetAllUsers(ctx)
	for _, u := range users {
		if u.ID == "u_bob" {
			if !u.PlaysReforger {
				t.Errorf("expected bob's plays_reforger to be auto-enabled, got false")
			}
		}
	}
}

func TestService_ManualParticipationAutoEnableGame(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	svc, err := New("test_token", "test_guild", repo)
	if err != nil {
		t.Fatalf("failed to create service: %v", err)
	}
	svc.session = nil

	if err := repo.UpsertUser(ctx, "u_charlie", "Charlie"); err != nil {
		t.Fatalf("failed to upsert user: %v", err)
	}
	// Charlie does not play Reforger
	if err := repo.SetUserGames(ctx, "u_charlie", true, false); err != nil {
		t.Fatalf("failed to set user games: %v", err)
	}

	evReforger := &Event{
		ChannelID: "chan2",
		MessageID: "msg2",
		Title:     "Reforger Op",
		DateTime:  "2026-10-12T20:00",
		GameType:  "Arma Reforger",
	}
	eID, err := repo.SaveEvent(ctx, evReforger)
	if err != nil {
		t.Fatalf("failed to save event: %v", err)
	}

	// Admin manually sets Charlie to "going" on Reforger event
	if err := svc.UpdateManualParticipation(ctx, eID, "u_charlie", "Charlie", "going"); err != nil {
		t.Fatalf("failed to update manual participation: %v", err)
	}

	// Verify Charlie now has plays_reforger = true
	users, _ := repo.GetAllUsers(ctx)
	for _, u := range users {
		if u.ID == "u_charlie" {
			if !u.PlaysReforger {
				t.Errorf("expected charlie to have plays_reforger auto-enabled on going, got false")
			}
		}
	}
}

func TestRepository_NewUserNoHistoricalNoResponse(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	// 1. Create 5 historical events from months ago
	for i := 1; i <= 5; i++ {
		ev := &Event{
			ChannelID: "chan",
			MessageID: fmt.Sprintf("msg%d", i),
			Title:     fmt.Sprintf("Past Mission %d", i),
			DateTime:  fmt.Sprintf("2026-0%d-15T20:00", i), // Months 1 to 5
			GameType:  "ArmA III",
		}
		if _, err := repo.SaveEvent(ctx, ev); err != nil {
			t.Fatalf("failed to save past event: %v", err)
		}
	}

	// 2. Veteran user Alice has been here since month 1
	if err := repo.UpsertUser(ctx, "u_alice", "Alice"); err != nil {
		t.Fatalf("failed to upsert user alice: %v", err)
	}
	if err := repo.UpsertParticipation(ctx, 1, "u_alice", "going"); err != nil {
		t.Fatalf("failed to record alice participation: %v", err)
	}

	// 3. Newcomer Davide joins in month 6 and plays event 6 and event 7
	ev6 := &Event{
		ChannelID: "chan",
		MessageID: "msg6",
		Title:     "Recent Mission 6",
		DateTime:  "2026-06-01T20:00",
		GameType:  "ArmA III",
	}
	ev6ID, err := repo.SaveEvent(ctx, ev6)
	if err != nil {
		t.Fatalf("failed to save event 6: %v", err)
	}

	ev7 := &Event{
		ChannelID: "chan",
		MessageID: "msg7",
		Title:     "Recent Mission 7",
		DateTime:  "2026-06-05T20:00",
		GameType:  "ArmA III",
	}
	ev7ID, err := repo.SaveEvent(ctx, ev7)
	if err != nil {
		t.Fatalf("failed to save event 7: %v", err)
	}

	if err := repo.UpsertUser(ctx, "u_davide", "Davide"); err != nil {
		t.Fatalf("failed to upsert user davide: %v", err)
	}
	if err := repo.UpsertParticipation(ctx, ev6ID, "u_davide", "going"); err != nil {
		t.Fatalf("failed to record davide event 6: %v", err)
	}
	if err := repo.UpsertParticipation(ctx, ev7ID, "u_davide", "going"); err != nil {
		t.Fatalf("failed to record davide event 7: %v", err)
	}

	// 4. Retrieve Attendance Stats
	stats, err := repo.GetAttendanceStats(ctx)
	if err != nil {
		t.Fatalf("failed to get attendance stats: %v", err)
	}

	davideNoResponseCount := 0
	davideGoingCount := 0
	aliceNoResponseCount := 0

	for _, s := range stats {
		if s.UserID == "u_davide" {
			if s.Status == "no_response" {
				davideNoResponseCount++
			} else if s.Status == "going" {
				davideGoingCount++
			}
		}
		if s.UserID == "u_alice" {
			if s.Status == "no_response" {
				aliceNoResponseCount++
			}
		}
	}

	// Davide should have ZERO no_response for past events 1..5!
	if davideNoResponseCount != 0 {
		t.Errorf("expected davide to have 0 no_response for past events, got %d", davideNoResponseCount)
	}
	if davideGoingCount != 2 {
		t.Errorf("expected davide to have 2 going, got %d", davideGoingCount)
	}

	// Alice missed events 2..7, so she should have 6 no_response
	if aliceNoResponseCount != 6 {
		t.Errorf("expected alice to have 6 no_response, got %d", aliceNoResponseCount)
	}

	// 5. If event 8 happens AFTER Davide joined, and Davide does not respond, he DOES get 1 no_response
	ev8 := &Event{
		ChannelID: "chan",
		MessageID: "msg8",
		Title:     "Future Mission 8",
		DateTime:  "2026-06-10T20:00",
		GameType:  "ArmA III",
	}
	if _, err := repo.SaveEvent(ctx, ev8); err != nil {
		t.Fatalf("failed to save event 8: %v", err)
	}

	statsAfterEv8, err := repo.GetAttendanceStats(ctx)
	if err != nil {
		t.Fatalf("failed to get attendance stats after ev8: %v", err)
	}

	davideNoRespAfterEv8 := 0
	for _, s := range statsAfterEv8 {
		if s.UserID == "u_davide" && s.Status == "no_response" {
			davideNoRespAfterEv8++
		}
	}

	if davideNoRespAfterEv8 != 1 {
		t.Errorf("expected davide to have exactly 1 no_response for event 8 after he joined, got %d", davideNoRespAfterEv8)
	}
}
