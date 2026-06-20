package system

import (
	"btcservermanager/internal/domain/appsettings"
	"btcservermanager/internal/domain/steamauth"
	"bufio"
	"context"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"
)

const unknownVal = "Unknown"

// Version is the application version, injected at build time.
var Version = "dev"

type SystemInfo struct {
	CPUUsage              float64 `json:"cpu_usage"`
	MemoryTotal           int64   `json:"total_memory"`
	MemoryUsed            int64   `json:"memory_usage"`
	MemoryFree            int64   `json:"free_memory"`
	Uptime                float64 `json:"uptime"`
	Hostname              string  `json:"hostname"`
	OS                    string  `json:"os"`
	Kernel                string  `json:"kernel"`
	Arch                  string  `json:"arch"`
	CPUCount              int     `json:"cpu_count"`
	DiskTotal             uint64  `json:"disk_total"`
	DiskUsed              uint64  `json:"disk_used"`
	CPUModel              string  `json:"cpu_model"`
	OSName                string  `json:"os_name"`
	LocalIP               string  `json:"local_ip"`
	PublicIP              string  `json:"public_ip"`
	Timezone              string  `json:"timezone"`
	BootTime              string  `json:"boot_time"`
	SteamAuthenticated    bool    `json:"steam_authenticated"`
	SteamUsername         string  `json:"steam_username"`
	SteamAPIKeyConfigured bool    `json:"steam_api_key_configured"`
	FoxEasterEgg          bool    `json:"fox_easter_egg"`
	AppVersion            string  `json:"app_version"`
}

// staticInfo holds values that never change after boot.
// They are computed once on first call and cached forever.
type staticInfo struct {
	kernelVersion string
	cpuModel      string
	osName        string
}

// localIPCache holds a cached local IP with a short TTL.
// Local IP could theoretically change (e.g. DHCP lease renewal) so we
// refresh it at most every 5 minutes rather than caching forever.
type localIPCache struct {
	mu        sync.Mutex
	value     string
	expiresAt time.Time
}

const localIPTTL = 5 * time.Minute

type Service struct {
	appSettingsRepo   *appsettings.Repository
	steamAuthService  *steamauth.AuthService
	steamAPIKey       string
	mu                sync.RWMutex
	lastPublicIP      string
	lastPublicIPFetch time.Time
	publicIPFetchMu   sync.Mutex
	rootPath          string

	// Cached static system values (computed once, never change)
	staticOnce sync.Once
	static     staticInfo

	// Cached local IP with TTL
	localIP localIPCache
}

type ServiceDeps struct {
	AppRepo     *appsettings.Repository
	SteamAuth   *steamauth.AuthService
	SteamAPIKey string
}

func NewService(deps ServiceDeps) *Service {
	return &Service{
		appSettingsRepo:  deps.AppRepo,
		steamAuthService: deps.SteamAuth,
		steamAPIKey:      deps.SteamAPIKey,
	}
}

func (s *Service) SetRootPath(path string) {
	s.rootPath = path
}

func (s *Service) getSystemPath(path string) string {
	if s.rootPath == "" {
		return path
	}

	// On Windows or Linux, we need to join carefully if we want to mock /proc or /etc
	return filepath.Join(s.rootPath, filepath.FromSlash(path))
}

// initStatic populates the staticInfo fields exactly once.
// Called via sync.Once so it runs at most one time per process lifetime.
func (s *Service) initStatic() {
	s.static.kernelVersion = s.readKernelVersion()
	s.static.cpuModel = s.readCPUModel()
	s.static.osName = s.readOSName()
}

func (s *Service) GetSystemInfo(ctx context.Context) (*SystemInfo, error) {
	// Ensure one-time static fields are populated.
	s.staticOnce.Do(s.initStatic)

	info := &SystemInfo{}

	// Memory from /proc/meminfo
	memTotal, memAvail := s.getMemoryInfo()
	info.MemoryTotal = memTotal * 1024
	info.MemoryFree = memAvail * 1024
	info.MemoryUsed = (memTotal - memAvail) * 1024

	// CPU usage (simplified as in Java)
	info.CPUUsage = s.getCPUUsage()

	// Uptime from /proc/uptime
	info.Uptime = s.getUptime()

	// Static host info
	info.Hostname, _ = os.Hostname()
	info.OS = runtime.GOOS
	info.Arch = runtime.GOARCH
	info.CPUCount = runtime.NumCPU()
	info.Kernel = s.static.kernelVersion

	totalDisk, freeDisk := s.getDiskUsage()
	info.DiskTotal = totalDisk
	info.DiskUsed = totalDisk - freeDisk

	// New detailed info
	info.CPUModel = s.static.cpuModel
	info.OSName = s.static.osName
	info.LocalIP = s.getLocalIP()
	info.PublicIP = s.getPublicIP(ctx)
	timezone, _ := time.Now().Zone()
	info.Timezone = timezone
	info.BootTime = time.Now().Add(-time.Duration(info.Uptime) * time.Second).Format("02 Jan 2006, 15:04")

	if s.steamAuthService != nil {
		auth, _ := s.steamAuthService.GetAuthAccount(ctx)
		if auth != nil {
			info.SteamAuthenticated = auth.Username != "" && auth.Password != ""
			info.SteamUsername = auth.Username
		}
	}

	info.SteamAPIKeyConfigured = s.steamAPIKey != ""
	info.FoxEasterEgg = os.Getenv("FOX_EASTER_EGG") == "true"
	info.AppVersion = Version

	return info, nil
}

func (s *Service) getMemoryInfo() (total, avail int64) {
	f, err := os.Open(s.getSystemPath("/proc/meminfo"))
	if err != nil {
		return 0, 0
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "MemTotal:") {
			total = s.parseMemLine(line)
		} else if strings.HasPrefix(line, "MemAvailable:") {
			avail = s.parseMemLine(line)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Printf("Warning: failed to scan /proc/meminfo: %v", err)
	}

	return total, avail
}

// parseMemLine extracts the numeric kB value from a /proc/meminfo line
// of the form "MemTotal:   12345 kB" without allocating a []string.
func (s *Service) parseMemLine(line string) int64 {
	// Skip past the colon.
	colon := strings.IndexByte(line, ':')
	if colon < 0 {
		return 0
	}
	// Trim leading spaces and find the start of the number.
	rest := strings.TrimLeft(line[colon+1:], " \t")
	// Find the end of the number (first non-digit character).
	end := 0
	for end < len(rest) && rest[end] >= '0' && rest[end] <= '9' {
		end++
	}
	if end == 0 {
		return 0
	}
	v, err := strconv.ParseInt(rest[:end], 10, 64)
	if err != nil {
		log.Printf("Warning: failed to parse memory value %q: %v", rest[:end], err)
		return 0
	}
	return v
}

func (s *Service) getCPUUsage() float64 {
	// Simple load average / num CPU as in Java
	f, err := os.Open(s.getSystemPath("/proc/loadavg"))
	if err != nil {
		return 0
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	if scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) > 0 {
			load1, _ := strconv.ParseFloat(parts[0], 64)
			return load1 / float64(runtime.NumCPU())
		}
	}

	return 0
}

// readKernelVersion reads /proc/version once. Called from initStatic.
func (s *Service) readKernelVersion() string {
	f, err := os.Open(s.getSystemPath("/proc/version"))
	if err != nil {
		return unknownVal
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	if scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) >= 3 {
			return parts[2] // The version number
		}
	}

	return unknownVal
}

func (s *Service) getUptime() float64 {
	f, err := os.Open(s.getSystemPath("/proc/uptime"))
	if err != nil {
		return 0
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	if scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) > 0 {
			uptime, _ := strconv.ParseFloat(parts[0], 64)
			return uptime
		}
	}

	return 0
}

// readCPUModel reads /proc/cpuinfo once. Called from initStatic.
func (s *Service) readCPUModel() string {
	f, err := os.Open(s.getSystemPath("/proc/cpuinfo"))
	if err != nil {
		return unknownVal
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "model name") {
			parts := strings.Split(line, ":")
			if len(parts) > 1 {
				return strings.TrimSpace(parts[1])
			}
		}
	}
	if err := scanner.Err(); err != nil {
		log.Printf("Warning: failed to scan /proc/cpuinfo: %v", err)
	}

	return unknownVal
}

// readOSName reads /etc/os-release once. Called from initStatic.
func (s *Service) readOSName() string {
	f, err := os.Open(s.getSystemPath("/etc/os-release"))
	if err != nil {
		return "Linux"
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "PRETTY_NAME=") {
			return strings.Trim(strings.TrimPrefix(line, "PRETTY_NAME="), "\"")
		}
	}
	if err := scanner.Err(); err != nil {
		log.Printf("Warning: failed to scan /etc/os-release: %v", err)
	}

	return "Linux"
}

// getLocalIP returns the local IP, refreshing at most every localIPTTL.
// net.InterfaceAddrs() does a NetlinkRIB syscall that allocates ~5KB per call.
// Caching with a 5-minute TTL eliminates 99%+ of those allocations since
// GetSystemInfo is called every 2 seconds from runMetricsTicker.
func (s *Service) getLocalIP() string {
	c := &s.localIP
	c.mu.Lock()
	defer c.mu.Unlock()

	if time.Now().Before(c.expiresAt) {
		return c.value
	}

	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return unknownVal
	}

	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				c.value = ipnet.IP.String()
				c.expiresAt = time.Now().Add(localIPTTL)
				return c.value
			}
		}
	}

	c.value = unknownVal
	c.expiresAt = time.Now().Add(localIPTTL)
	return c.value
}

func (s *Service) getPublicIP(ctx context.Context) string {
	s.mu.RLock()
	if time.Since(s.lastPublicIPFetch) < 1*time.Hour && s.lastPublicIP != "" {
		ip := s.lastPublicIP
		s.mu.RUnlock()

		return ip
	}
	s.mu.RUnlock()

	s.publicIPFetchMu.Lock()
	defer s.publicIPFetchMu.Unlock()

	// Double-check after acquiring dedicated fetch lock
	s.mu.RLock()
	if time.Since(s.lastPublicIPFetch) < 1*time.Hour && s.lastPublicIP != "" {
		ip := s.lastPublicIP
		s.mu.RUnlock()

		return ip
	}
	s.mu.RUnlock()

	client := http.Client{Timeout: 5 * time.Second}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.ipify.org", nil)
	if err != nil {
		s.mu.RLock()
		defer s.mu.RUnlock()
		return s.lastPublicIP
	}

	resp, err := client.Do(req)
	if err != nil {
		s.mu.RLock()
		defer s.mu.RUnlock()
		return s.lastPublicIP
	}

	defer resp.Body.Close()

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		s.mu.RLock()
		defer s.mu.RUnlock()
		return s.lastPublicIP
	}

	ipStr := string(bytes)

	s.mu.Lock()
	s.lastPublicIP = ipStr
	s.lastPublicIPFetch = time.Now()
	s.mu.Unlock()

	return ipStr
}

func (s *Service) GetAppSettings(ctx context.Context) (*appsettings.AppSettings, error) {
	return s.appSettingsRepo.GetSettings(ctx)
}

func (s *Service) UpdateAppSettings(ctx context.Context, settings *appsettings.AppSettings) error {
	return s.appSettingsRepo.Save(ctx, settings)
}
