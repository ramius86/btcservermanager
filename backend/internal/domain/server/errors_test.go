package server

import (
	"errors"
	"fmt"
	"testing"
)

func TestSentinelErrors(t *testing.T) {
	tests := []struct {
		name     string
		err      error
		target   error
		expected bool
	}{
		{
			name:     "ErrServerNotFound exact",
			err:      ErrServerNotFound,
			target:   ErrServerNotFound,
			expected: true,
		},
		{
			name:     "ErrServerNotFound wrapped",
			err:      fmt.Errorf("context: %w", ErrServerNotFound),
			target:   ErrServerNotFound,
			expected: true,
		},
		{
			name:     "ErrServerAlreadyRunning exact",
			err:      ErrServerAlreadyRunning,
			target:   ErrServerAlreadyRunning,
			expected: true,
		},
		{
			name:     "ErrServerNotRunning exact",
			err:      ErrServerNotRunning,
			target:   ErrServerNotRunning,
			expected: true,
		},
		{
			name:     "ErrPortConflict wrapped",
			err:      fmt.Errorf("%w: port 2302 in use", ErrPortConflict),
			target:   ErrPortConflict,
			expected: true,
		},
		{
			name:     "ErrCannotModifyRunning exact",
			err:      ErrCannotModifyRunning,
			target:   ErrCannotModifyRunning,
			expected: true,
		},
		{
			name:     "ErrCannotDeleteRunning exact",
			err:      ErrCannotDeleteRunning,
			target:   ErrCannotDeleteRunning,
			expected: true,
		},
		{
			name:     "mismatch",
			err:      ErrServerNotFound,
			target:   ErrPortConflict,
			expected: false,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := errors.Is(tc.err, tc.target); got != tc.expected {
				t.Errorf("errors.Is(%v, %v) = %v; want %v", tc.err, tc.target, got, tc.expected)
			}
		})
	}
}
