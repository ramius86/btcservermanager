//go:build linux

package system

import "syscall"

func (s *Service) getDiskUsage() (total, free uint64) {
	var stat syscall.Statfs_t
	err := syscall.Statfs("/", &stat)
	if err != nil {
		return 0, 0
	}
	return stat.Blocks * uint64(stat.Bsize), stat.Bfree * uint64(stat.Bsize)
}
