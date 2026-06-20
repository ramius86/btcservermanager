package workshop

import (
	"btcservermanager/internal/domain/server"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"math/rand/v2"
	"os"
	"strings"
	"sync"
	"time"
)

type Broadcaster interface {
	Broadcast(event string, data any)
}

type ScenarioService interface {
	SaveModScenarios(ctx context.Context, modID, modName string, scraped []ScrapedScenario) error
	DeleteModScenarios(ctx context.Context, modID string) error
	CleanupOrphanedScenarios(ctx context.Context, activeHexIDs []string) error
}

type ReforgerModProvider interface {
	GetAllActiveReforgerModIDs(ctx context.Context) ([]string, error)
}

type Service struct {
	repo                *Repository
	installer           *Installer
	metadata            *MetadataFetcher
	scraper             *ReforgerScraper
	scenarioService     ScenarioService
	reforgerModProvider ReforgerModProvider
	broadcaster         Broadcaster
	stopCh              chan struct{}
	postInstallQueue    chan int64
	once                sync.Once
}

type ServiceDeps struct {
	Repo                *Repository
	Installer           *Installer
	Metadata            *MetadataFetcher
	Scraper             *ReforgerScraper
	ScenarioService     ScenarioService
	ReforgerModProvider ReforgerModProvider
}

func NewService(deps ServiceDeps) *Service {
	log.Println("[WorkshopService] Initializing service...")
	s := &Service{
		repo:                deps.Repo,
		installer:           deps.Installer,
		metadata:            deps.Metadata,
		scraper:             deps.Scraper,
		scenarioService:     deps.ScenarioService,
		reforgerModProvider: deps.ReforgerModProvider,
		stopCh:              make(chan struct{}),
		postInstallQueue:    make(chan int64, 1000),
	}

	go s.postInstallWorker()

	return s
}

func (s *Service) postInstallWorker() {
	for {
		select {
		case id := <-s.postInstallQueue:
			bgCtx := context.Background()
			if err := s.finishModInstallationInternal(bgCtx, id); err != nil {
				log.Printf("[Workshop] Post-install failed for mod %d: %v", id, err)
				if s.broadcaster != nil {
					s.broadcaster.Broadcast("install_progress", map[string]any{
						"itemId":    id,
						"status":    "ERROR",
						"server_id": id,
					})
				}
			} else {
				if s.broadcaster != nil {
					s.broadcaster.Broadcast("install_progress", map[string]any{
						"itemId":    id,
						"status":    "FINISHED",
						"server_id": id,
					})
				}
			}
		case <-s.stopCh:
			return
		}
	}
}

func (s *Service) Stop() {
	s.once.Do(func() {
		close(s.stopCh)
	})
}

func (s *Service) SetBroadcaster(b Broadcaster) {
	s.broadcaster = b
}

func (s *Service) GetAllMods(ctx context.Context) ([]*WorkshopMod, error) {
	return s.repo.GetAllMods(ctx)
}

func (s *Service) HasModUpdates(ctx context.Context) (bool, error) {
	return s.repo.HasModUpdates(ctx)
}

func (s *Service) GetMod(ctx context.Context, id int64) (*WorkshopMod, error) {
	return s.repo.GetModByID(ctx, id)
}

func (s *Service) SaveMod(ctx context.Context, m *WorkshopMod) error {
	return s.repo.Save(ctx, m)
}

func (s *Service) DeleteMod(ctx context.Context, id int64) error {
	log.Printf("[Workshop] DeleteMod: entry for ID %d", id)
	mod, err := s.repo.GetModByID(ctx, id)
	if err != nil {
		handled, err := s.handleDeletedModGetError(id, err)
		if handled {
			return nil
		}
		return err
	}

	log.Printf("[Workshop] Deleting mod %d (%s)...", id, mod.Name)

	s.uninstallModFilesAndScenarios(ctx, mod)

	if err := s.repo.Delete(ctx, id); err != nil {
		log.Printf("[Workshop] Error: Failed to delete mod %d from database: %v", id, err)
		return err
	}

	log.Printf("[Workshop] Mod %d deleted successfully from database", id)

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("mod_deleted", map[string]any{"id": id})
	}

	return nil
}

func (s *Service) handleDeletedModGetError(id int64, err error) (bool, error) {
	if errors.Is(err, sql.ErrNoRows) || strings.Contains(err.Error(), "no rows in result set") {
		log.Printf("[Workshop] DeleteMod: mod %d already deleted from database, ensuring UI is synced", id)
		if s.broadcaster != nil {
			s.broadcaster.Broadcast("mod_deleted", map[string]any{"id": id})
		}
		return true, nil
	}
	log.Printf("[Workshop] DeleteMod: error getting mod %d from DB: %v", id, err)
	return false, err
}

func (s *Service) uninstallModFilesAndScenarios(ctx context.Context, mod *WorkshopMod) {
	if s.installer != nil {
		if err := s.installer.UninstallMod(mod); err != nil {
			log.Printf("[Workshop] Warning: Failed to uninstall mod files for %d: %v", mod.ID, err)
		}
	}

	if mod.ServerType == server.TypeReforger && s.scenarioService != nil {
		hexID := fmt.Sprintf("%X", mod.ID)
		if err := s.scenarioService.DeleteModScenarios(ctx, hexID); err != nil {
			log.Printf("[Workshop] Warning: Failed to delete scenarios for mod %d: %v", mod.ID, err)
		}
	}
}

func (s *Service) SyncModsWithDisk(ctx context.Context) error {
	log.Println("[Workshop] Starting synchronization with disk...")
	mods, err := s.repo.GetAllMods(ctx)
	if err != nil {
		log.Printf("[Workshop] Sync: failed to get all mods from DB: %v", err)
		return err
	}

	log.Printf("[Workshop] Sync: checking %d mods from database", len(mods))

	var removedCount int
	for _, mod := range mods {
		removed, err := s.syncSingleModWithDisk(ctx, mod)
		if err != nil {
			continue
		}
		if removed {
			removedCount++
		}
	}

	log.Printf("[Workshop] Disk synchronization complete. Removed %d orphaned entries.", removedCount)
	return nil
}

func (s *Service) syncSingleModWithDisk(ctx context.Context, mod *WorkshopMod) (bool, error) {
	if mod.ServerType == server.TypeReforger {
		return false, nil
	}

	if s.installer == nil {
		log.Printf("[Workshop] Sync: installer is nil, skipping check for mod %d", mod.ID)
		return false, nil
	}

	modDir := s.installer.paths.GetModInstallationPath(mod.ID, mod.ServerType)

	if mod.InstallationStatus != InstallationFinished && mod.InstallationStatus != InstallationError {
		return false, nil
	}

	if _, err := os.Stat(modDir); os.IsNotExist(err) {
		log.Printf("[Workshop] Sync: mod %d (%s) directory missing at %s, removing from database", mod.ID, mod.Name, modDir)

		if err := s.repo.Delete(ctx, mod.ID); err != nil {
			log.Printf("[Workshop] Sync: failed to remove missing mod %d from DB: %v", mod.ID, err)
			return false, err
		}

		if s.broadcaster != nil {
			s.broadcaster.Broadcast("mod_deleted", map[string]any{"id": mod.ID})
		}
		return true, nil
	} else if err != nil {
		log.Printf("[Workshop] Sync: error stating directory for mod %d: %v", mod.ID, err)
	}

	return false, nil
}

func (s *Service) SearchReforgerMods(ctx context.Context, query string, page int) ([]ReforgerWorkshopMod, error) {
	return s.scraper.Search(ctx, query, page)
}

func (s *Service) SearchSteamMods(ctx context.Context, query string, appId int64, page int) ([]*WorkshopMod, int, error) {
	return s.metadata.SearchSteamMods(ctx, query, appId, page)
}

func (s *Service) GetReforgerModScenarios(ctx context.Context, modIDWithSlug string) (*ScrapedModScenariosResponse, error) {
	return s.scraper.FetchScenarios(ctx, modIDWithSlug)
}

func (s *Service) GetReforgerModDetails(ctx context.Context, modIDWithSlug string) (*ReforgerModDetails, error) {
	return s.scraper.FetchDetails(ctx, modIDWithSlug)
}

func (s *Service) FetchAndSaveMetadata(ctx context.Context, modID int64, allowCreate bool) (*WorkshopMod, error) {
	mod, err := s.metadata.FetchMetadata(ctx, modID)
	if err != nil {
		return nil, err
	}

	existing, _ := s.repo.GetModByID(ctx, modID)
	if existing != nil {
		if existing.InstallationStatus == InstallationFinished &&
			existing.LastUpdated != nil && mod.LastUpdated != nil &&
			mod.LastUpdated.After(*existing.LastUpdated) {
			existing.NeedsUpdate = true
		}
		s.updateExistingModMetadata(existing, mod)
		mod = existing
	} else if !allowCreate {
		return nil, fmt.Errorf("mod %d not found in database and creation not allowed", modID)
	} else {
		now := time.Now()
		mod.InstalledAt = &now
	}

	if err := s.repo.Save(ctx, mod); err != nil {
		return nil, err
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("mod_metadata_updated", mod)
	}

	return mod, nil
}

func (s *Service) updateExistingModMetadata(existing, fetched *WorkshopMod) {
	existing.Name = fetched.Name
	existing.Thumbnail = fetched.Thumbnail

	// If the mod is fully installed, calculate the physical size on disk as the source of truth.
	// Otherwise, use the fetched size from Steam API if it is valid (> 0).
	if existing.InstallationStatus == InstallationFinished && s.installer != nil {
		modDir := s.installer.paths.GetModInstallationPath(existing.ID, existing.ServerType)
		diskSize := getDirSize(modDir)
		if diskSize > 0 {
			existing.FileSize = diskSize
		} else if fetched.FileSize > 0 {
			existing.FileSize = fetched.FileSize
		}
	} else {
		if fetched.FileSize > 0 {
			existing.FileSize = fetched.FileSize
		}
	}

	existing.LastUpdated = fetched.LastUpdated

	if fetched.ServerType != "" {
		existing.ServerType = fetched.ServerType
	}
}

func (s *Service) UpdateAllMods(ctx context.Context) error {
	mods, err := s.repo.GetAllMods(ctx)
	if err != nil {
		return err
	}

	for _, mod := range mods {
		_, err := s.FetchAndSaveMetadata(ctx, mod.ID, false)
		if err != nil {
			// Log error but continue with other mods
			continue
		}
	}

	return nil
}

func (s *Service) UpdateModStatus(ctx context.Context, id int64, status InstallationStatus) error {
	mod, err := s.repo.GetModByID(ctx, id)
	if err != nil {
		return err
	}

	mod.InstallationStatus = status

	return s.repo.Save(ctx, mod)
}

func (s *Service) SyncAllBiKeys(ctx context.Context) error {
	mods, err := s.repo.GetAllMods(ctx)
	if err != nil {
		return err
	}

	var count int
	for _, mod := range mods {
		if mod.ServerType == server.TypeArma3 && mod.InstallationStatus == InstallationFinished {
			select {
			case s.postInstallQueue <- mod.ID:
				count++
			default:
				log.Printf("[Workshop] Warning: queue full while syncing BiKeys for mod %d", mod.ID)
			}
		}
	}

	log.Printf("[Workshop] Queued %d mods for BiKey re-sync", count)
	return nil
}

func (s *Service) FinishModInstallation(ctx context.Context, id int64) error {
	// Push to queue for sequential, non-blocking background processing
	select {
	case s.postInstallQueue <- id:
		return nil
	default:
		return errors.New("post-install queue is full")
	}
}

func (s *Service) finishModInstallationInternal(ctx context.Context, id int64) error {
	mod, err := s.repo.GetModByID(ctx, id)
	if err != nil {
		return err
	}

	if s.installer != nil {
		return s.installer.InstallMod(ctx, mod)
	}

	mod.InstallationStatus = InstallationFinished
	return s.repo.Save(ctx, mod)
}

func (s *Service) SyncReforgerScenarios(ctx context.Context) error {
	if s.reforgerModProvider == nil {
		return errors.New("reforger mod provider not initialized")
	}

	activeHexIDs, err := s.reforgerModProvider.GetAllActiveReforgerModIDs(ctx)
	if err != nil {
		return err
	}

	for _, hexID := range activeHexIDs {
		// Re-fetch scenarios to handle updates
		resp, err := s.GetReforgerModScenarios(ctx, hexID)
		if err == nil && resp != nil {
			if err := s.scenarioService.SaveModScenarios(ctx, hexID, resp.ModName, resp.Scenarios); err != nil {
				log.Printf("[Workshop] Failed to sync scenarios for mod %s: %v", hexID, err)
			}
		} else if err != nil {
			log.Printf("[Workshop] Failed to fetch scenarios for mod %s: %v", hexID, err)
		}
	}

	if s.scenarioService != nil {
		return s.scenarioService.CleanupOrphanedScenarios(ctx, activeHexIDs)
	}
	return nil
}

func (s *Service) StartReforgerScenariosSyncWorker() {
	// Initial sync on startup
	go func() {
		bgCtx := context.Background()
		fmt.Println("[ScenarioSync] Running initial Reforger scenarios sync...")
		if err := s.SyncReforgerScenarios(bgCtx); err != nil {
			fmt.Printf("[ScenarioSync] Initial sync failed: %v\n", err)
		}
	}()

	// Periodic sync
	go func() {
		for {
			// Run every 60-120 minutes with jitter
			minutes := 60 + rand.IntN(61)
			timer := time.NewTimer(time.Duration(minutes) * time.Minute)

			select {
			case <-timer.C:
				bgCtx := context.Background()
				fmt.Println("[ScenarioSync] Running periodic Reforger scenarios sync...")
				if err := s.SyncReforgerScenarios(bgCtx); err != nil {
					fmt.Printf("[ScenarioSync] Periodic sync failed: %v\n", err)
				}
			case <-s.stopCh:
				timer.Stop()
				return
			}
		}
	}()
}
