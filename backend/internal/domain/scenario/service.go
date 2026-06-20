package scenario

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"bufio"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

type Broadcaster interface {
	Broadcast(event string, data any)
}

type Service struct {
	repo        *Repository
	paths       *config.Paths
	config      *config.Config
	broadcaster Broadcaster
	httpClient  *http.Client
}

func NewService(repo *Repository, paths *config.Paths, cfg *config.Config) *Service {
	return &Service{
		repo:       repo,
		paths:      paths,
		config:     cfg,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

func (s *Service) SetBroadcaster(b Broadcaster) {
	s.broadcaster = b
}

func (s *Service) GetArma3Scenarios(ctx context.Context) ([]Arma3Scenario, error) {
	missionsDir := s.paths.GetScenariosBasePath()

	files, err := os.ReadDir(missionsDir)
	if err != nil {
		if os.IsNotExist(err) {
			return []Arma3Scenario{}, nil
		}

		return nil, err
	}

	scenarios := []Arma3Scenario{}

	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(strings.ToLower(f.Name()), ".pbo") {
			info, _ := f.Info()
			scenarios = append(scenarios, Arma3Scenario{
				Name:      f.Name(),
				Size:      info.Size(),
				CreatedAt: info.ModTime(),
			})
		}
	}

	return scenarios, nil
}

func (s *Service) RefreshReforgerVanillaScenarios(ctx context.Context) error {
	scenarios, err := s.getReforgerScenariosFromExecutable(ctx)
	if err != nil {
		return err
	}

	return s.SaveVanillaScenarios(ctx, scenarios)
}

func (s *Service) SaveVanillaScenarios(ctx context.Context, scenarios []ReforgerScenario) error {
	return s.repo.SaveVanillaScenarios(ctx, scenarios)
}

func (s *Service) RefreshReforgerVanillaScenariosIfEmpty(ctx context.Context) error {
	fmt.Printf("[Scenario] Startup check: checking for vanilla scenarios...\n")
	vanilla, err := s.repo.GetVanillaReforgerScenarios(ctx)
	if err != nil {
		return err
	}

	if len(vanilla) > 0 {
		fmt.Printf("[Scenario] Startup check: %d vanilla scenarios already in database.\n", len(vanilla))
		return nil
	}

	// Check if executable exists before trying
	executable := s.paths.GetServerExecutable(server.TypeReforger)
	if _, statErr := os.Stat(executable); statErr != nil {
		fmt.Printf("[Scenario] Startup check: Reforger executable not found at %s. Skipping auto-discovery.\n", executable)
		return nil //nolint:nilerr // Executable not found is a safe fallback, not an error
	}

	fmt.Printf("[Scenario] Startup check: No scenarios in DB but executable found. Refreshing...\n")
	return s.RefreshReforgerVanillaScenarios(ctx)
}

func (s *Service) getReforgerScenariosFromExecutable(ctx context.Context) ([]ReforgerScenario, error) {
	executable := s.paths.GetServerExecutable(server.TypeReforger)

	execCtx, cancel := context.WithTimeout(ctx, 60*time.Second)
	defer cancel()

	fmt.Printf("[Scenario] Executing: %s -listScenarios -logStats 1 -profile <temp>\n", executable)
	// Create a temporary profile for extraction to avoid conflicts
	profileDir, err := os.MkdirTemp("", "reforger_scenario_extraction_*")
	if err != nil {
		fmt.Printf("[Scenario] Failed to create temporary profile dir: %v\n", err)
	}
	defer os.RemoveAll(profileDir)

	cmd := exec.CommandContext(execCtx, executable, "-listScenarios", "-logStats", "1", "-profile", profileDir, "-nothrow")
	cmd.Dir = s.paths.GetServerPath(server.TypeReforger)
	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		fmt.Printf("[Scenario] Failed to start command: %v\n", err)
		return nil, err
	}

	// Use the robust combined parser
	// We wrap the pipes in a MultiReader to scan both stdout and stderr
	version, scenarios := ParseReforgerOutput(io.MultiReader(stdout, stderr))
	if version != "" {
		fmt.Printf("[Scenario] Detected version during scenario extraction: %s\n", version)
	}

	if err := cmd.Wait(); err != nil {
		fmt.Printf("[Scenario] Command finished with error: %v\n", err)
	}

	fmt.Printf("[Scenario] Finished extraction. Total found: %d\n", len(scenarios))
	return scenarios, nil
}

func (s *Service) parseReforgerLine(line string, official bool) ReforgerScenario {
	return parseReforgerLine(line, official)
}

var (
	reforgerVersionRegex    = regexp.MustCompile(`Arma Reforger Server (\d+\.\d+\.\d+\.\d+)`)
	reforgerBracketRegex    = regexp.MustCompile(`.*\{`)
	reforgerWhitespaceRegex = regexp.MustCompile(`\s+`)
)

func ParseReforgerOutput(reader io.Reader) (string, []ReforgerScenario) {
	var version string
	scenarios := []ReforgerScenario{}

	scanner := bufio.NewScanner(reader)
	var delimitersFound int

	for scanner.Scan() {
		line := scanner.Text()

		// 1. Version extraction
		if version == "" {
			if matches := reforgerVersionRegex.FindStringSubmatch(line); len(matches) > 1 {
				version = matches[1]
			}
		}

		// 2. Scenario extraction
		// Robust delimiter check: must contain at least 50 dashes as in the old manager
		if strings.Contains(line, "--------------------------------------------------") {
			delimitersFound++
			continue
		}

		if !processReforgerLine(line, delimitersFound, &scenarios) {
			break
		}
	}

	if err := scanner.Err(); err != nil {
		fmt.Printf("[Scenario] Error reading Reforger output: %v\n", err)
	}

	return version, scenarios
}

func processReforgerLine(line string, delimitersFound int, scenarios *[]ReforgerScenario) bool {
	switch delimitersFound {
	case 2, 4:
		isOfficial := delimitersFound == 2
		sc := parseReforgerLine(line, isOfficial)
		if sc.ID != "" {
			*scenarios = append(*scenarios, sc)
		}
	case 5:
		return false // Stop processing
	}
	return true // Continue processing
}

func parseReforgerLine(line string, official bool) ReforgerScenario {
	// Logic from parseLineToScenarioDto in Java
	line = reforgerBracketRegex.ReplaceAllString(line, "{")
	if !strings.HasPrefix(line, "{") {
		return ReforgerScenario{}
	}

	// Split by whitespace as in Java line.split("\\s", 2)
	fields := strings.Fields(strings.TrimSpace(line))
	if len(fields) == 0 {
		return ReforgerScenario{}
	}
	id := fields[0]

	var name string
	if len(fields) > 1 {
		// Reconstruct the rest of the line as name, and trim parentheses
		// Note: fields[1:] might contain multiple words if name has spaces
		// The old manager split by whitespace limit 2, so index 1 was "Path (Name)"
		// Actually, Reforger IDs often contain the path: {GUID}Missions/Name.conf
		// So we want everything after the first whitespace as the "Path and Name"

		// Let's use SplitN with any whitespace instead of Fields to match "split("\\s", 2)"
		parts := reforgerWhitespaceRegex.Split(strings.TrimSpace(line), 2)
		if len(parts) > 1 {
			id = parts[0]
			name = strings.Trim(parts[1], "()")
		}
	}

	return ReforgerScenario{
		ID:         id,
		Name:       name,
		IsOfficial: official,
	}
}

func (s *Service) GetReforgerScenarios(ctx context.Context, modIDs []string) ([]ReforgerScenario, error) {
	vanilla, err := s.repo.GetVanillaReforgerScenarios(ctx)
	if err != nil {
		return nil, err
	}

	// For Reforger, we want to show ALL modded scenarios we have in the database
	// to allow users to select them as soon as a mod is added/scraped.
	// We still accept modIDs for future filtering needs, but for now, discovery is better.
	mods, err := s.repo.GetAllModReforgerScenarios(ctx)
	if err != nil {
		return vanilla, err
	}

	return append(vanilla, mods...), nil
}

func (s *Service) DeleteScenario(ctx context.Context, name string) error {
	path := s.paths.GetScenarioPath(name)
	return os.Remove(path)
}

func (s *Service) SaveModScenarios(ctx context.Context, modID, modName string, scraped []workshop.ScrapedScenario) error {
	hexID := s.ExtractHexID(modID)
	scenarios := []ReforgerScenario{}
	for _, sc := range scraped {
		scenarios = append(scenarios, ReforgerScenario{
			ID:          sc.ID,
			Name:        sc.Name,
			GameMode:    sc.GameMode,
			PlayerCount: sc.MaxPlayers,
			ModID:       hexID,
			ModName:     modName,
			IsOfficial:  false,
		})
	}

	err := s.repo.SaveModScenarios(ctx, hexID, scenarios)
	if err == nil && s.broadcaster != nil {
		s.broadcaster.Broadcast("reforger_scenarios_updated", nil)
	}
	return err
}

func (s *Service) DeleteModScenarios(ctx context.Context, modID string) error {
	hexID := s.ExtractHexID(modID)
	err := s.repo.DeleteModScenarios(ctx, hexID)
	if err == nil && s.broadcaster != nil {
		s.broadcaster.Broadcast("reforger_scenarios_updated", nil)
	}
	return err
}

func (s *Service) CleanupOrphanedScenarios(ctx context.Context, activeHexIDs []string) error {
	err := s.repo.DeleteExceptMods(ctx, activeHexIDs)
	if err == nil && s.broadcaster != nil {
		s.broadcaster.Broadcast("reforger_scenarios_updated", nil)
	}
	return err
}

func (s *Service) ExtractHexID(id string) string {
	if strings.Contains(id, "-") {
		id = strings.Split(id, "-")[0]
	}
	return strings.ToUpper(id)
}
