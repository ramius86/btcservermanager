package steamcmd

import (
	"context"
	"errors"
	"testing"
)

func TestSubmit_QueueFullDoesNotBlock(t *testing.T) {
	e := &Executor{
		queue: make(chan *Job, 1),
		ctx:   context.Background(),
	}

	if err := e.Submit(&Job{}); err != nil {
		t.Fatalf("first submit: %v", err)
	}

	if err := e.Submit(&Job{}); !errors.Is(err, ErrQueueFull) {
		t.Fatalf("expected ErrQueueFull, got %v", err)
	}
}

func TestSubmit_StoppedExecutor(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	e := &Executor{
		queue: make(chan *Job, 1),
		ctx:   ctx,
	}

	if err := e.Submit(&Job{}); err == nil {
		t.Fatal("expected an error from a stopped executor")
	}
}

func TestSubmit_NilJob(t *testing.T) {
	e := &Executor{
		queue: make(chan *Job, 1),
		ctx:   context.Background(),
	}

	if err := e.Submit(nil); err == nil {
		t.Fatal("expected an error for a nil job")
	}
}
