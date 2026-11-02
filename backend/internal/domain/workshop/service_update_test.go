package workshop

import (
	"context"
	"errors"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestUpdateConcurrentlyRespectsLimitAndRunsInParallel(t *testing.T) {
	var (
		mu      sync.Mutex
		active  int
		maxSeen int
	)

	items := make([]int, 24)

	failures := updateConcurrently(t.Context(), items, 4, func(context.Context, int) error {
		mu.Lock()
		active++
		if active > maxSeen {
			maxSeen = active
		}
		mu.Unlock()

		time.Sleep(10 * time.Millisecond)

		mu.Lock()
		active--
		mu.Unlock()

		return nil
	})

	assert.Empty(t, failures)
	assert.LessOrEqual(t, maxSeen, 4, "updateConcurrently must respect the limit")
	assert.Greater(t, maxSeen, 1, "updates must actually overlap instead of running one at a time")
}

func TestUpdateConcurrentlyReportsEveryFailure(t *testing.T) {
	firstErr := errors.New("boom")

	failures := updateConcurrently(t.Context(), []int{1, 2, 3, 4}, 2, func(_ context.Context, item int) error {
		if item%2 == 0 {
			return firstErr
		}

		return nil
	})

	assert.Len(t, failures, 2)
	assert.ErrorIs(t, failures[0], firstErr)
}

func TestUpdateConcurrentlyStopsSchedulingAfterCancellation(t *testing.T) {
	ctx, cancel := context.WithCancel(t.Context())

	var started atomic.Int32

	failures := updateConcurrently(ctx, make([]int, 50), 2, func(context.Context, int) error {
		started.Add(1)
		cancel()

		return nil
	})

	assert.Empty(t, failures)
	assert.Less(t, started.Load(), int32(50), "no new item should be scheduled once the context is cancelled")
}

func TestModUpdateErrorReportsCounts(t *testing.T) {
	err := &ModUpdateError{Failed: 2, Total: 5, Details: "mod 1: boom; mod 2: boom"}

	assert.Equal(t, "failed to update 2 of 5 mods: mod 1: boom; mod 2: boom", err.Error())
}
