//go:build !linux

package server

import "os/exec"

func setProcessGroup(cmd *exec.Cmd) {
	// No-op for non-Linux development environments
}

func killProcessGroup(cmd *exec.Cmd) error {
	if cmd != nil && cmd.Process != nil {
		return cmd.Process.Kill()
	}
	return nil
}
