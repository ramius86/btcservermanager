package steamcmd

import (
	"btcservermanager/internal/config"
	"btcservermanager/internal/domain/installation"
	"btcservermanager/internal/domain/scenario"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type steamCmdInfoResponse struct {
	Data map[string]struct {
		Depots struct {
			Branches map[string]struct {
				BuildID string `json:"buildid"`
			} `json:"branches"`
		} `json:"depots"`
	} `json:"data"`
}

type Service struct {
	executor      *Executor
	paths         *config.Paths
	installations *installation.Service
	workshop      *workshop.Service
	dryRun        *installation.DryRunService
	scenarios     *scenario.Service
	httpClient    *http.Client
	broadcaster   Broadcaster
	stopCh        chan struct{}
}

func (s *Service) SetBroadcaster(b Broadcaster) {
	s.broadcaster = b
}

type ServiceDeps struct {
	Executor      *Executor
	Paths         *config.Paths
	Installations *installation.Service
	Workshop      *workshop.Service
	DryRun        *installation.DryRunService
	Scenarios     *scenario.Service
}

func NewService(deps ServiceDeps) *Service {
	s := &Service{
		executor:      deps.Executor,
		paths:         deps.Paths,
		installations: deps.Installations,
		workshop:      deps.Workshop,
		dryRun:        deps.DryRun,
		scenarios:     deps.Scenarios,
		httpClient:    &http.Client{Timeout: 10 * time.Second},
		stopCh:        make(chan struct{}),
	}

	return s
}

func (s *Service) Stop() {
	close(s.stopCh)
}

func (s *Service) InstallOrUpdateServer(si *installation.ServerInstallation) *Job {
	bgCtx := context.Background()
	serverPath := s.paths.GetServerPath(si.Type)
	builder := NewBuilder().
		WithInstallDir(serverPath).
		WithLogin()

	branch := strings.ToLower(string(si.Branch))
	if branch == "" {
		branch = strings.ToLower(string(installation.BranchPublic))
	}

	builder.WithAppInstall(server.ServerIDs[si.Type], true, "-beta "+branch)

	job := NewJob(JobInstallServer)
	job.RelatedServer = si.Type
	job.Parameters = builder.Build()

	// Update status to in progress immediately in database and notify frontend
	if err := s.installations.UpdateStatus(bgCtx, si.Type, workshop.InstallationInProgress); err != nil {
		log.Printf("[SteamCMD] Failed to update installation status: %v", err)
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("install_progress", map[string]any{
			"itemId":    server.ServerIDs[si.Type],
			"status":    "INSTALLATION_IN_PROGRESS",
			"server_id": server.ServerIDs[si.Type],
			"gameType":  si.Type,
		})
	}

	job.OnSuccess = func() {
		s.handleInstallSuccess(bgCtx, si, serverPath)
	}
	job.OnFailure = func(err workshop.ErrorStatus) {
		if err := s.installations.UpdateStatus(bgCtx, si.Type, workshop.InstallationError); err != nil {
			log.Printf("[SteamCMD] Failed to update status to error: %v", err)
		}

		if s.broadcaster != nil {
			s.broadcaster.Broadcast("install_progress", map[string]any{
				"itemId":    server.ServerIDs[si.Type],
				"status":    "ERROR",
				"server_id": server.ServerIDs[si.Type],
				"gameType":  si.Type,
			})
		}
	}

	s.executor.Submit(job)

	return job
}

func (s *Service) handleInstallSuccess(ctx context.Context, si *installation.ServerInstallation, serverPath string) {
	if err := s.installations.UpdateStatus(ctx, si.Type, workshop.InstallationFinished); err != nil {
		log.Printf("[SteamCMD] Failed to update status to finished: %v", err)
	}

	version := s.performServerDryRun(ctx, si.Type)

	if version != "" {
		s.updateInstalledServerMetadata(ctx, si.Type, si.Branch, version, serverPath)
	}
}

func (s *Service) performServerDryRun(ctx context.Context, gameType server.Type) string {
	if s.dryRun == nil {
		return ""
	}

	if gameType == server.TypeReforger {
		res, err := s.dryRun.PerformReforgerDryRun()
		if err != nil {
			return ""
		}
		_ = s.saveReforgerScenarios(ctx, res.Version, res.Scenarios)
		return res.Version
	}

	dryVersion, err := s.dryRun.PerformDryRun(gameType)
	if err == nil {
		return dryVersion
	}
	return ""
}

func (s *Service) saveReforgerScenarios(ctx context.Context, version string, scenarios []scenario.ReforgerScenario) error {
	if s.scenarios == nil {
		return nil
	}
	err := s.scenarios.SaveVanillaScenarios(ctx, scenarios)
	if err != nil {
		log.Printf("[SteamCMD] Failed to save vanilla scenarios: %v", err)
	} else {
		fmt.Printf("[SteamCMD] Success: Extracted version %s and %d vanilla scenarios for Reforger\n", version, len(scenarios))
	}
	return err
}

func (s *Service) updateInstalledServerMetadata(ctx context.Context, gameType server.Type, branch installation.Branch, version, serverPath string) {
	if err := s.installations.UpdateVersion(ctx, gameType, version); err != nil {
		log.Printf("[SteamCMD] Failed to update version: %v", err)
	}

	// 3. Update BuildID from manifest
	buildID := installation.ReadBuildIDFromManifest(serverPath, server.ServerIDs[gameType])
	if buildID != "" {
		if err := s.installations.UpdateBuildID(ctx, gameType, buildID); err != nil {
			log.Printf("[SteamCMD] Failed to update build ID: %v", err)
		}
		// Ensure available version matches if we just updated
		if err := s.installations.UpdateAvailableVersion(ctx, gameType, buildID); err != nil {
			log.Printf("[SteamCMD] Failed to update available version: %v", err)
		}
	}
	// 4. Update InstalledBranch
	if err := s.installations.UpdateInstalledBranch(ctx, gameType, branch); err != nil {
		log.Printf("[SteamCMD] Failed to update installed branch: %v", err)
	}

	// Notify frontend
	if s.broadcaster != nil {
		s.broadcaster.Broadcast("server_updated", map[string]any{
			"type":    gameType,
			"version": version,
		})
	}
}

func (s *Service) UninstallServer(ctx context.Context, t server.Type) error {
	serverPath := s.paths.GetServerPath(t)

	// Basic safety check to prevent accidental deletion of important directories
	if serverPath == "" || serverPath == "/" || serverPath == "\\" || len(serverPath) < 3 {
		return fmt.Errorf("invalid server path: %s", serverPath)
	}

	// 1. Delete physical files
	if err := os.RemoveAll(serverPath); err != nil {
		return fmt.Errorf("failed to delete server files: %w", err)
	}

	// 2. Delete installation record from database
	if err := s.installations.Delete(ctx, t); err != nil {
		return fmt.Errorf("failed to delete installation record: %w", err)
	}

	// 3. Clean up specific game data
	if t == server.TypeReforger && s.scenarios != nil {
		if err := s.scenarios.SaveVanillaScenarios(ctx, nil); err != nil {
			log.Printf("[SteamCMD] Failed to delete Reforger vanilla scenarios: %v", err)
		}
	}

	// 4. Notify frontend
	if s.broadcaster != nil {
		s.broadcaster.Broadcast("server_updated", map[string]any{
			"type":    t,
			"version": "NOT_INSTALLED",
		})
	}

	return nil
}

func (s *Service) InstallOrUpdateWorkshopMods(mods []workshop.WorkshopMod) *Job {
	bgCtx := context.Background()
	var installDir string
	if len(mods) > 0 {
		installDir = s.paths.GetModsBaseDir()
	}

	// Use NewModBuilder to omit @ShutdownOnFailedCommand — allows SteamCMD
	// to continue downloading remaining mods when individual items fail.
	builder := NewModBuilder().
		WithInstallDir(installDir).
		WithLogin()

	modIDs := make([]int64, 0, len(mods))
	// Build a map of mod ID -> appID for use in retry parameter rebuilding
	modAppIDs := make(map[int64]int64, len(mods))

	for _, mod := range mods {
		appID := server.GameIDs[mod.ServerType]
		if appID == 0 {
			fmt.Printf("[SteamCMD] Skipping mod %d: unknown server type '%s'\n", mod.ID, mod.ServerType)
			continue
		}

		builder.WithWorkshopItemInstall(appID, mod.ID, true)
		modIDs = append(modIDs, mod.ID)
		modAppIDs[mod.ID] = appID
	}

	job := NewJob(JobInstallMods)
	job.RelatedWorkshopMods = modIDs
	job.Parameters = builder.Build()

	job.OnItemSuccess = func(itemID int64) {
		s.handleItemSuccess(bgCtx, itemID)
	}

	job.OnItemFailure = func(itemID int64) {
		s.handleItemFailure(bgCtx, itemID)
	}

	// OnRetryWithFailedItems rebuilds the SteamCMD command with only the failed mod IDs
	job.OnRetryWithFailedItems = func(failedIDs []int64) []string {
		return s.handleModsRetry(installDir, failedIDs, modAppIDs)
	}

	// Update status to in progress immediately in database and notify frontend
	for _, mod := range mods {
		s.notifyModInstallInProgress(bgCtx, mod.ID)
	}

	job.OnSuccess = func() {
		s.handleModsSuccess(bgCtx, mods, job)
	}
	job.OnFailure = func(errStatus workshop.ErrorStatus) {
		s.handleModsFailure(bgCtx, mods, job)
	}

	s.executor.Submit(job)

	return job
}

func (s *Service) handleItemSuccess(ctx context.Context, itemID int64) {
	if err := s.workshop.FinishModInstallation(ctx, itemID); err != nil {
		log.Printf("[SteamCMD] Failed to finish installation for mod %d: %v", itemID, err)
	}
}

func (s *Service) handleItemFailure(ctx context.Context, itemID int64) {
	if err := s.workshop.UpdateModStatus(ctx, itemID, workshop.InstallationError); err != nil {
		log.Printf("[SteamCMD] Failed to update error status for mod %d: %v", itemID, err)
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("install_progress", map[string]any{
			"itemId":    itemID,
			"status":    "ERROR",
			"server_id": itemID,
		})
	}
}

func (s *Service) notifyModInstallInProgress(ctx context.Context, modID int64) {
	if err := s.workshop.UpdateModStatus(ctx, modID, workshop.InstallationInProgress); err != nil {
		log.Printf("[SteamCMD] Failed to update status for mod %d: %v", modID, err)
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("install_progress", map[string]any{
			"itemId":    modID,
			"status":    "INSTALLATION_IN_PROGRESS",
			"server_id": modID,
		})
	}
}

func (s *Service) handleModsRetry(installDir string, failedIDs []int64, modAppIDs map[int64]int64) []string {
	retryBuilder := NewModBuilder().
		WithInstallDir(installDir).
		WithLogin()

	for _, modID := range failedIDs {
		appID, ok := modAppIDs[modID]
		if !ok {
			continue
		}
		retryBuilder.WithWorkshopItemInstall(appID, modID, true)

		// Reset UI status to downloading for retried mods
		if s.broadcaster != nil {
			s.broadcaster.Broadcast("install_progress", map[string]any{
				"itemId":    modID,
				"status":    "DOWNLOADING",
				"server_id": modID,
			})
		}
	}

	return retryBuilder.Build()
}

func (s *Service) handleModsSuccess(ctx context.Context, mods []workshop.WorkshopMod, job *Job) {
	// Only finish mods that weren't already handled by OnItemSuccess.
	// Build a set of already-succeeded items to avoid duplicate processing.
	succeededSet := make(map[int64]bool, len(job.SucceededItems))
	for _, id := range job.SucceededItems {
		succeededSet[id] = true
	}

	for _, mod := range mods {
		if !succeededSet[mod.ID] {
			if err := s.workshop.FinishModInstallation(ctx, mod.ID); err != nil {
				log.Printf("[SteamCMD] Failed to finish installation for mod %d: %v", mod.ID, err)
			}
		}
	}
}

func (s *Service) handleModsFailure(ctx context.Context, mods []workshop.WorkshopMod, job *Job) {
	// Only mark mods as ERROR if they weren't already confirmed as succeeded
	succeededSet := make(map[int64]bool, len(job.SucceededItems))
	for _, id := range job.SucceededItems {
		succeededSet[id] = true
	}

	for _, mod := range mods {
		if succeededSet[mod.ID] {
			continue // Already installed successfully
		}

		if err := s.workshop.UpdateModStatus(ctx, mod.ID, workshop.InstallationError); err != nil {
			log.Printf("[SteamCMD] Failed to update status for mod %d: %v", mod.ID, err)
		}

		if s.broadcaster != nil {
			s.broadcaster.Broadcast("install_progress", map[string]any{
				"itemId":    mod.ID,
				"status":    "ERROR",
				"server_id": mod.ID,
			})
		}
	}
}

func (s *Service) UpdateSteamCmd() *Job {
	builder := NewBuilder().WithLogin()

	job := NewJob(JobUpdateSteamCmd)
	job.Parameters = builder.Build()

	s.executor.Submit(job)

	return job
}

func (s *Service) TestLogin(ctx context.Context, username, password, guardToken string) error {
	return s.executor.TestLogin(ctx, username, password, guardToken)
}

func (s *Service) GetRecentLogs() string {
	return s.executor.GetRecentLogs()
}

func (s *Service) GetAllItemInfo() map[string]ItemInfo {
	return s.executor.GetAllItemInfo()
}

func (s *Service) GetItemInfo(key string) *ItemInfo {
	return s.executor.GetItemInfo(key)
}

func (s *Service) GetProgress(key string) float64 {
	return s.executor.GetProgress(key)
}

func (s *Service) StartBackgroundUpdateCheck() {
	ticker := time.NewTicker(15 * time.Minute)
	go func() {
		defer ticker.Stop()
		bgCtx := context.Background()

		// Populate installed build IDs from local manifests immediately on startup
		s.PopulateInstalledBuildIDsFromManifests(bgCtx)

		// Initial check on startup
		select {
		case <-time.After(30 * time.Second):
			s.CheckAllServersForUpdates(bgCtx)
		case <-s.stopCh:
			return
		}

		for {
			select {
			case <-ticker.C:
				s.CheckAllServersForUpdates(bgCtx)
			case <-s.stopCh:
				return
			}
		}
	}()
}

func (s *Service) PopulateInstalledBuildIDsFromManifests(ctx context.Context) {
	servers := []server.Type{server.TypeArma3, server.TypeDayZ, server.TypeDayZExp, server.TypeReforger}
	for _, t := range servers {
		if !s.installations.IsServerInstalled(ctx, t) {
			continue
		}
		appID := server.ServerIDs[t]
		if appID == 0 {
			continue
		}

		serverPath := s.paths.GetServerPath(t)
		currentID := installation.ReadBuildIDFromManifest(serverPath, appID)
		if currentID != "" {
			si, err := s.installations.GetInstallation(ctx, t)
			if err != nil || si.InstalledBuildID != currentID {
				if err := s.installations.UpdateBuildID(ctx, t, currentID); err != nil {
					log.Printf("[SteamCMD] Failed to sync build ID for %s: %v", t, err)
				}
			}
		}
	}
}

func (s *Service) CheckAllServersForUpdates(ctx context.Context) {
	servers := []server.Type{server.TypeArma3, server.TypeDayZ, server.TypeDayZExp, server.TypeReforger}

	// Run checks sequentially. SQLite serializes all writers, so parallel
	// goroutines here only produce lock contention (SQLITE_BUSY) without any
	// throughput benefit. The HTTP calls to steamcmd.net are fast enough that
	// sequential execution adds negligible latency.
	for _, t := range servers {
		if !s.installations.IsServerInstalled(ctx, t) {
			continue
		}
		s.CheckForUpdates(ctx, t)
	}
}

func (s *Service) CheckForUpdates(ctx context.Context, t server.Type) {
	appID := server.ServerIDs[t]
	if appID == 0 {
		return
	}

	// Get active branch for this installation to check the correct BuildID
	branch := "public"
	si, err := s.installations.GetInstallation(ctx, t)

	if err == nil && si.Branch != "" {
		branch = strings.ToLower(string(si.Branch))
	}

	buildID, err := s.fetchBuildIDFromAPI(ctx, appID, branch)
	if err != nil {
		fmt.Printf("[SteamCMD] Failed to check updates for %s via API: %v\n", t, err)
		return
	}

	if buildID != "" {
		if err := s.installations.UpdateAvailableVersion(ctx, t, buildID); err != nil {
			log.Printf("[SteamCMD] Failed to update available version for %s: %v", t, err)
		}

		s.selfHealBuildID(ctx, t, appID)
	} else {
		fmt.Printf("[SteamCMD] Could not find buildid for %s (branch: %s) in API response\n", t, branch)
	}
}

func (s *Service) fetchBuildIDFromAPI(ctx context.Context, appID int64, branch string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("https://api.steamcmd.net/v1/info/%d", appID), nil)
	if err != nil {
		return "", err
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Drain so the connection returns to the pool.
		_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return "", fmt.Errorf("API returned non-200 status: %d", resp.StatusCode)
	}

	var info steamCmdInfoResponse
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return "", err
	}
	// Drain any residual bytes so the decoder doesn't leave the connection un-reusable.
	_, _ = io.Copy(io.Discard, resp.Body)

	appIDStr := strconv.FormatInt(appID, 10)
	if appData, ok := info.Data[appIDStr]; ok {
		if b, ok := appData.Depots.Branches[branch]; ok {
			return b.BuildID, nil
		}
	}

	return "", nil
}

func (s *Service) selfHealBuildID(ctx context.Context, t server.Type, appID int64) {
	// Self-healing: if we don't have an installed build ID but we HAVE a version,
	// try to populate the build ID now from the manifest
	si, err := s.installations.GetInstallation(ctx, t)
	shouldSelfHeal := err == nil && si.InstalledBuildID == "" && si.Version != ""
	if shouldSelfHeal {
		serverPath := s.paths.GetServerPath(t)
		currentID := installation.ReadBuildIDFromManifest(serverPath, appID)
		if currentID != "" {
			if err := s.installations.UpdateBuildID(ctx, t, currentID); err != nil {
				log.Printf("[SteamCMD] Failed to self-heal build ID for %s: %v", t, err)
			}
		}
	}
}
