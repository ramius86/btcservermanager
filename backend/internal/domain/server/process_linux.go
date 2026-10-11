//go:build linux

package server

import (
	"errors"
	"os/exec"
	"syscall"
)

func setProcessGroup(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
}

func killProcessGroup(cmd *exec.Cmd) error {
	if cmd == nil || cmd.Process == nil {
		return nil
	}
	pgid := cmd.Process.Pid
	// In POSIX/Linux, sending a signal to negative PID delivers it to the entire process group
	err := syscall.Kill(-pgid, syscall.SIGKILL)
	if err != nil && (errors.Is(err, syscall.ESRCH) || errors.Is(err, syscall.EPERM)) {
		// Process group already exited or cleaned up
		return nil
	}
	return err
}
