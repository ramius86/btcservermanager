package server

import "errors"

var (
	// ErrServerNotFound is returned when a requested server does not exist.
	ErrServerNotFound = errors.New("server not found")

	// ErrServerAlreadyRunning is returned when attempting to start an already running server.
	ErrServerAlreadyRunning = errors.New("server is already running")

	// ErrServerNotRunning is returned when an operation requires a running server but it is stopped.
	ErrServerNotRunning = errors.New("server is not running")

	// ErrCannotModifyRunning is returned when attempting to modify configuration of a running server.
	ErrCannotModifyRunning = errors.New("cannot modify running server")

	// ErrCannotDeleteRunning is returned when attempting to delete a running server.
	ErrCannotDeleteRunning = errors.New("cannot delete running server")

	// ErrPortConflict is returned when server ports conflict with another running server.
	ErrPortConflict = errors.New("port conflict detected")
)
