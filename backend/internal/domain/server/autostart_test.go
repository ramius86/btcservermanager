package server

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// fakeRestoreRepo implements only the calls the restore makes; the embedded
// interface keeps the rest of the contract out of the test.
type fakeRestoreRepo struct {
	RepositoryInterface

	mu      sync.Mutex
	desired bool
}

func (f *fakeRestoreRepo) GetServerByID(context.Context, int64) (any, error) {
	return &Arma3Server{Server: Server{ID: 1, Name: "Altis", Type: TypeArma3}}, nil
}

func (f *fakeRestoreRepo) IsDesiredRunning(context.Context, int64) (bool, error) {
	f.mu.Lock()
	defer f.mu.Unlock()

	return f.desired, nil
}

func (f *fakeRestoreRepo) SetDesiredRunning(_ context.Context, _ int64, running bool) error {
	f.mu.Lock()
	defer f.mu.Unlock()

	f.desired = running

	return nil
}

func (f *fakeRestoreRepo) wants() bool {
	f.mu.Lock()
	defer f.mu.Unlock()

	return f.desired
}

// fakeRestoreManager simulates the process manager: it can refuse a start, die
// after a few polls or answer the query after a few polls.
type fakeRestoreManager struct {
	ServerManager

	mu              sync.Mutex
	info            *ServerInstanceInfo
	starts          int
	stops           int
	polls           int
	failStarts      int
	readyAfterPolls int
	diesAfterPolls  int
	onPoll          func(polls int, m *fakeRestoreManager)
}

func (m *fakeRestoreManager) StartServer(context.Context, any) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.starts++

	if m.starts <= m.failStarts {
		return assert.AnError
	}

	m.info = &ServerInstanceInfo{Alive: true}
	m.polls = 0

	return nil
}

func (m *fakeRestoreManager) StopServer(context.Context, int64) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.stops++
	m.info = nil

	return nil
}

func (m *fakeRestoreManager) GetInstanceInfo(int64) *ServerInstanceInfo {
	m.mu.Lock()

	if m.info != nil {
		m.polls++
		if m.diesAfterPolls > 0 && m.polls >= m.diesAfterPolls {
			m.info = nil
		} else if m.readyAfterPolls > 0 && m.polls >= m.readyAfterPolls {
			m.info.Map = "Altis"
		}
	}

	info := m.info
	polls := m.polls
	onPoll := m.onPoll
	m.mu.Unlock()

	if onPoll != nil {
		onPoll(polls, m)
	}

	return info
}

func (m *fakeRestoreManager) counts() (starts, stops int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	return m.starts, m.stops
}

func (m *fakeRestoreManager) setInfo(info *ServerInstanceInfo) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.info = info
}

func testAutostartConfig() autostartConfig {
	return autostartConfig{
		attempts: 3,
		poll:     time.Millisecond,
		backoff:  time.Millisecond,
		stagger:  time.Millisecond,
		timeout:  func(Type) time.Duration { return 5 * time.Millisecond },
		sleep: func(ctx context.Context, _ time.Duration) bool {
			select {
			case <-ctx.Done():
				return false
			default:
				return true
			}
		},
	}
}

func TestRestoreServerReadyImmediately(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{readyAfterPolls: 1}
	service := NewService(repo, manager, nil, nil)

	failures := make(chan struct{}, 1)
	service.SetRestoreFailureListener(func(int64, string, Type, int, error) { failures <- struct{}{} })

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.True(t, ok)
	assert.True(t, repo.wants())
	assert.Equal(t, 1, manager.starts)
	assert.Empty(t, failures)
}

func TestRestoreServerSucceedsOnSecondAttempt(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{failStarts: 1, readyAfterPolls: 1}
	service := NewService(repo, manager, nil, nil)

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.True(t, ok)
	assert.True(t, repo.wants())
	assert.Equal(t, 2, manager.starts)
}

func TestRestoreServerGivesUpAfterFailedStarts(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{failStarts: 3}
	service := NewService(repo, manager, nil, nil)

	failures := make(chan int, 1)
	service.SetRestoreFailureListener(func(_ int64, _ string, _ Type, attempts int, _ error) {
		failures <- attempts
	})

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.False(t, ok)
	assert.False(t, repo.wants())
	assert.Equal(t, 3, manager.starts)
	require.Eventually(t, func() bool { return len(failures) == 1 }, time.Second, 10*time.Millisecond)
	assert.Equal(t, 3, <-failures)
}

func TestRestoreServerGivesUpWhenTheProcessDies(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{diesAfterPolls: 1}
	service := NewService(repo, manager, nil, nil)

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.False(t, ok)
	assert.False(t, repo.wants())
	assert.Equal(t, 3, manager.starts)
}

func TestRestoreServerStopsAStuckProcessBeforeRetrying(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{} // alive, never answers the query
	service := NewService(repo, manager, nil, nil)

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.False(t, ok)
	assert.False(t, repo.wants())

	starts, stops := manager.counts()
	assert.Equal(t, 3, starts)
	assert.Equal(t, 3, stops)
}

func TestRestoreServerStopsWhenTheUserStopsTheServer(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{}
	manager.onPoll = func(polls int, m *fakeRestoreManager) {
		if polls >= 2 {
			_ = repo.SetDesiredRunning(context.Background(), 1, false)
			m.setInfo(nil)
		}
	}
	service := NewService(repo, manager, nil, nil)

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.False(t, ok)

	starts, _ := manager.counts()
	assert.Equal(t, 1, starts)
}

func TestRestoreServerSkipsAnAlreadyRunningServer(t *testing.T) {
	repo := &fakeRestoreRepo{desired: true}
	manager := &fakeRestoreManager{info: &ServerInstanceInfo{Alive: true, Map: "Altis"}}
	service := NewService(repo, manager, nil, nil)

	ok := service.restoreServer(t.Context(), 1, testAutostartConfig())

	assert.True(t, ok)
	assert.Equal(t, 0, manager.starts)
}

func TestAutostartTimeoutFollowsTheGame(t *testing.T) {
	assert.Equal(t, autostartReforgerTimeout, autostartTimeout(TypeReforger))
	assert.Equal(t, autostartServerTimeout, autostartTimeout(TypeArma3))
	assert.Equal(t, autostartServerTimeout, autostartTimeout(TypeDayZ))
}
