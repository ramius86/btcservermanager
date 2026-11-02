package server

import (
	"sync"
	"testing"
)

func TestGetLockReturnsTheSameMutexPerServer(t *testing.T) {
	s := &Service{}

	if a, b := s.getLock(1), s.getLock(1); a != b {
		t.Fatal("getLock must return the same mutex for the same server id")
	}

	if s.getLock(1) == s.getLock(2) {
		t.Fatal("different servers must not share a lock")
	}
}

func TestGetLockIsSafeUnderConcurrentUse(t *testing.T) {
	s := &Service{}

	var wg sync.WaitGroup
	locks := make([]*sync.Mutex, 32)

	for i := range locks {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			locks[i] = s.getLock(7)
		}(i)
	}
	wg.Wait()

	for _, mu := range locks {
		if mu != locks[0] {
			t.Fatal("concurrent getLock calls returned different mutexes")
		}
	}
}
