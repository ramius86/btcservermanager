//go:build windows

package system

func (s *Service) getDiskUsage() (total, free uint64) {
	// Dummy values for Windows development
	return 100 * 1024 * 1024 * 1024, 50 * 1024 * 1024 * 1024
}
