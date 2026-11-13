package discordbot

import (
	"btcservermanager/internal/domain/appsettings"
	"context"
	"errors"
	"testing"
	"time"
)

func TestIsRsvpDeadlinePassed(t *testing.T) {
	eventTime := time.Date(2026, 11, 20, 20, 0, 0, 0, time.Local)
	event := &Event{DateTime: eventTime.Format(dateTimeFormat)}

	tests := []struct {
		name      string
		lockHours int
		now       time.Time
		want      bool
	}{
		{"lock disabled", 0, eventTime.Add(-time.Minute), false},
		{"negative window", -2, eventTime.Add(-time.Minute), false},
		{"well before window", 6, eventTime.Add(-7 * time.Hour), false},
		{"at window start", 6, eventTime.Add(-6 * time.Hour), true},
		{"inside window", 6, eventTime.Add(-time.Hour), true},
		{"after event start", 6, eventTime.Add(time.Hour), true},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := isRsvpDeadlinePassed(event, tc.lockHours, tc.now); got != tc.want {
				t.Errorf("isRsvpDeadlinePassed() = %v, want %v", got, tc.want)
			}
		})
	}

	t.Run("invalid event date never locks", func(t *testing.T) {
		broken := &Event{DateTime: "not-a-date"}
		if isRsvpDeadlinePassed(broken, 6, eventTime) {
			t.Error("expected invalid event date to keep the lock open")
		}
	})
}

func TestService_RsvpLockHours(t *testing.T) {
	svc := NewUnconfigured(nil)
	ctx := t.Context()

	if got := svc.rsvpLockHours(ctx); got != 0 {
		t.Errorf("expected 0 without a settings provider, got %d", got)
	}

	svc.SetAppSettingsProvider(func(context.Context) (*appsettings.AppSettings, error) {
		return &appsettings.AppSettings{RsvpLockEnabled: true, RsvpLockHours: 4}, nil
	})
	if got := svc.rsvpLockHours(ctx); got != 4 {
		t.Errorf("expected 4, got %d", got)
	}

	svc.SetAppSettingsProvider(func(context.Context) (*appsettings.AppSettings, error) {
		return &appsettings.AppSettings{RsvpLockEnabled: false, RsvpLockHours: 4}, nil
	})
	if got := svc.rsvpLockHours(ctx); got != 0 {
		t.Errorf("expected 0 when the lock is disabled, got %d", got)
	}

	svc.SetAppSettingsProvider(func(context.Context) (*appsettings.AppSettings, error) {
		return nil, errors.New("settings unavailable")
	})
	if got := svc.rsvpLockHours(ctx); got != 0 {
		t.Errorf("expected 0 on settings error, got %d", got)
	}
}

func TestRepository_HasParticipation(t *testing.T) {
	repo := setupTestDB(t)
	ctx := t.Context()

	eventID, err := repo.SaveEvent(ctx, &Event{
		ChannelID: "chan1",
		MessageID: "msg1",
		Title:     "Operation Lock",
		DateTime:  time.Now().Add(24 * time.Hour).Format(dateTimeFormat),
		GameType:  "arma3",
	})
	if err != nil {
		t.Fatalf("failed to save event: %v", err)
	}

	responded, err := repo.HasParticipation(ctx, eventID, "user_1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if responded {
		t.Error("expected no participation before any RSVP")
	}

	if err := repo.UpsertUser(ctx, "user_1", "UserOne"); err != nil {
		t.Fatalf("failed to upsert user: %v", err)
	}
	if err := repo.UpsertParticipation(ctx, eventID, "user_1", statusGoing); err != nil {
		t.Fatalf("failed to upsert participation: %v", err)
	}

	responded, err = repo.HasParticipation(ctx, eventID, "user_1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !responded {
		t.Error("expected participation after RSVP")
	}
}
