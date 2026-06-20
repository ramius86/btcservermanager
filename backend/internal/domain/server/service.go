package server

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"sync"
)

const (
	errProcessManagerNotInit   = "process manager not initialized"
	errFailedToGenerateConfigs = "failed to generate config files: %w"
)

type ModResolver interface {
	ResolveModNames(ctx context.Context, ids []int64) ([]ModInfo, error)
}

type RepositoryInterface interface {
	GetAllServers(ctx context.Context) ([]any, error)
	GetServerByID(ctx context.Context, id int64) (any, error)
	Save(ctx context.Context, s any) (int64, error)
	UpdateSortOrders(ctx context.Context, orders map[int64]int) error
	Delete(ctx context.Context, id int64) error
	FindAllServerIdsByActiveMod(ctx context.Context, modID string) ([]int64, error)

	GetCBAPresets(ctx context.Context) ([]CBAPreset, error)
	GetCBAPresetByID(ctx context.Context, id int64) (*CBAPreset, error)
	SaveCBAPreset(ctx context.Context, p *CBAPreset) (int64, error)
	DeleteCBAPreset(ctx context.Context, id int64) error

	GetAllActiveReforgerModIDs(ctx context.Context) ([]string, error)
}

type ConfigManager interface {
	Generate(ctx context.Context, s any) error
	Delete(ctx context.Context, t Type, id int64) error
	GetConfigContents(ctx context.Context, s any) (map[string]string, error)
}

type ServerManager interface {
	GetInstanceInfo(id int64) *ServerInstanceInfo
	UpdateQueryInfo(id int64, players int, mapName, mission string)
	StartServer(ctx context.Context, srv any) error
	StopServer(ctx context.Context, id int64) error
	AddHeadlessClient(ctx context.Context, srv *Arma3Server) error
	RemoveHeadlessClient(ctx context.Context, id int64) error
	GetServerLogFile(t Type, id int64) string
}

type Service struct {
	repo            RepositoryInterface
	processManager  ServerManager
	configGenerator ConfigManager
	modResolver     ModResolver
	broadcaster     Broadcaster
	serverLocks     sync.Map
}

func (s *Service) getLock(id int64) *sync.Mutex {
	mu, _ := s.serverLocks.LoadOrStore(id, &sync.Mutex{})
	if m, ok := mu.(*sync.Mutex); ok {
		return m
	}
	panic(fmt.Sprintf("serverLocks type assertion failed for server %d", id))
}

func (s *Service) SetBroadcaster(b Broadcaster) {
	s.broadcaster = b
}

func NewService(repo RepositoryInterface, pm ServerManager, cg ConfigManager, mr ModResolver) *Service {
	return &Service{
		repo:            repo,
		processManager:  pm,
		configGenerator: cg,
		modResolver:     mr,
	}
}

func (s *Service) GetAllServers(ctx context.Context) ([]any, error) {
	return s.repo.GetAllServers(ctx)
}

func (s *Service) ReorderServers(ctx context.Context, orders map[int64]int) error {
	if err := s.repo.UpdateSortOrders(ctx, orders); err != nil {
		return err
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("server_updated", map[string]any{
			"type": "reordered",
		})
	}

	return nil
}

func (s *Service) GetServer(ctx context.Context, id int64) (any, error) {
	return s.repo.GetServerByID(ctx, id)
}

func (s *Service) GetServerConfigs(ctx context.Context, id int64) (map[string]string, error) {
	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if s.configGenerator == nil {
		return nil, errors.New("config generator not initialized")
	}

	return s.configGenerator.GetConfigContents(ctx, srv)
}

func (s *Service) CreateServer(ctx context.Context, server any) (any, error) {
	id, err := s.repo.Save(ctx, server)
	if err != nil {
		return nil, err
	}

	newServer, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Generate config files
	if s.configGenerator != nil {
		if err := s.configGenerator.Generate(ctx, newServer); err != nil {
			return nil, fmt.Errorf(errFailedToGenerateConfigs, err)
		}
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("server_updated", map[string]any{
			"id":   id,
			"type": "created",
		})
	}

	return newServer, nil
}

func (s *Service) UpdateServer(ctx context.Context, srv any) (any, error) {
	var id int64
	switch v := srv.(type) {
	case *Arma3Server:
		id = v.ID
	case *DayZServer:
		id = v.ID
	case *ReforgerServer:
		id = v.ID
	default:
		return nil, errors.New("invalid server type")
	}

	mu := s.getLock(id)
	mu.Lock()
	defer mu.Unlock()

	if s.processManager != nil {
		if s.processManager.GetInstanceInfo(id) != nil {
			return nil, errors.New("cannot modify running server")
		}
	}

	// Merge existing passwords if they are masked or empty in the update request
	if oldSrv, err := s.repo.GetServerByID(ctx, id); err == nil {
		MergeMaskedPasswords(srv, oldSrv)
	}

	updatedID, err := s.repo.Save(ctx, srv)
	if err != nil {
		return nil, err
	}

	res, err := s.repo.GetServerByID(ctx, updatedID)
	if err == nil {
		// Generate config files
		if s.configGenerator != nil {
			if err := s.configGenerator.Generate(ctx, res); err != nil {
				return nil, fmt.Errorf(errFailedToGenerateConfigs, err)
			}
		}

		if s.broadcaster != nil {
			s.broadcaster.Broadcast("server_updated", map[string]any{
				"id":   id,
				"type": "updated",
			})
		}
	}

	return res, err
}

func (s *Service) SetAutomaticRestart(ctx context.Context, id int64, enabled bool, restartTime *string) error {
	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return err
	}

	var updated any

	switch v := srv.(type) {
	case *Arma3Server:
		v.RestartAutomatically = enabled
		v.AutomaticRestartTime = restartTime
		updated = v
	case *DayZServer:
		v.RestartAutomatically = enabled
		v.AutomaticRestartTime = restartTime
		updated = v
	case *ReforgerServer:
		v.RestartAutomatically = enabled
		v.AutomaticRestartTime = restartTime
		updated = v
	}

	_, err = s.repo.Save(ctx, updated)

	return err
}

func (s *Service) GetInstanceInfo(id int64) *ServerInstanceInfo {
	if s.processManager == nil {
		return nil
	}

	return s.processManager.GetInstanceInfo(id)
}

func (s *Service) UpdateQueryInfo(id int64, players int, mapName, mission string) {
	if s.processManager != nil {
		s.processManager.UpdateQueryInfo(id, players, mapName, mission)
	}
}

func (s *Service) GetLogPath(srv any) string {
	var id int64

	var t Type

	switch v := srv.(type) {
	case *Arma3Server:
		id = v.ID
		t = v.Type
	case *DayZServer:
		id = v.ID
		t = v.Type
	case *ReforgerServer:
		id = v.ID
		t = v.Type
	}

	info := s.GetInstanceInfo(id)
	if info != nil && info.CurrentLogFile != "" {
		if s.processManager == nil {
			return ""
		}
		// Return absolute path if possible, but for simplicity we recreate it
		return s.processManager.GetServerLogFile(t, id)
	}

	return ""
}

func (s *Service) DeleteServer(ctx context.Context, id int64) error {
	mu := s.getLock(id)
	mu.Lock()
	defer mu.Unlock()

	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return err
	}

	if s.processManager != nil {
		if s.processManager.GetInstanceInfo(id) != nil {
			return errors.New("cannot delete running server")
		}
	}

	// Cleanup physical files
	if s.configGenerator != nil {
		var t Type
		switch v := srv.(type) {
		case *Arma3Server:
			t = v.Type
		case *DayZServer:
			t = v.Type
		case *ReforgerServer:
			t = v.Type
		}

		if t != "" {
			_ = s.configGenerator.Delete(ctx, t, id)
		}
	}

	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}

	if s.broadcaster != nil {
		s.broadcaster.Broadcast("server_updated", map[string]any{
			"id":   id,
			"type": "deleted",
		})
	}

	return nil
}

func mergeUniqueIDs(decIDs, hexIDs []int64) []int64 {
	idMap := make(map[int64]bool)
	allIDs := make([]int64, 0, len(decIDs)+len(hexIDs))
	for _, id := range decIDs {
		if !idMap[id] {
			idMap[id] = true
			allIDs = append(allIDs, id)
		}
	}
	for _, id := range hexIDs {
		if !idMap[id] {
			idMap[id] = true
			allIDs = append(allIDs, id)
		}
	}
	return allIDs
}

func getServerName(srv any) string {
	switch v := srv.(type) {
	case *Arma3Server:
		return v.Name
	case *DayZServer:
		return v.Name
	case *ReforgerServer:
		return v.Name
	default:
		return ""
	}
}

func (s *Service) getActiveServerNames(ctx context.Context, serverIDs []int64) []string {
	activeServerNames := make([]string, 0, len(serverIDs))
	for _, id := range serverIDs {
		if s.processManager.GetInstanceInfo(id) == nil {
			continue
		}
		srv, err := s.repo.GetServerByID(ctx, id)
		if err != nil {
			continue
		}
		name := getServerName(srv)
		if name != "" {
			activeServerNames = append(activeServerNames, name)
		} else {
			activeServerNames = append(activeServerNames, fmt.Sprintf("Server ID %d", id))
		}
	}
	return activeServerNames
}

func (s *Service) GetActiveServersForMod(ctx context.Context, modID int64) ([]string, error) {
	// Query using decimal string representation (Arma 3 & DayZ)
	serverIDsDec, err := s.repo.FindAllServerIdsByActiveMod(ctx, strconv.FormatInt(modID, 10))
	if err != nil {
		return nil, fmt.Errorf("failed to query active servers: %w", err)
	}

	// Query using hex string representation (Reforger)
	serverIDsHex, err := s.repo.FindAllServerIdsByActiveMod(ctx, fmt.Sprintf("%X", modID))
	if err != nil {
		return nil, fmt.Errorf("failed to query active reforger servers: %w", err)
	}

	allServerIDs := mergeUniqueIDs(serverIDsDec, serverIDsHex)
	return s.getActiveServerNames(ctx, allServerIDs), nil
}

func (s *Service) StartServer(ctx context.Context, id int64) error {
	mu := s.getLock(id)
	mu.Lock()
	defer mu.Unlock()

	return s.startServerLocked(ctx, id)
}

func (s *Service) startServerLocked(ctx context.Context, id int64) error {
	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return err
	}

	// Resolve mod names before starting
	if err := s.resolveAndAttachModNames(ctx, srv); err != nil {
		fmt.Printf("[Warning] Failed to resolve mod names for server %d: %v\n", id, err)
		// We continue even if resolution fails, but mods won't be loaded
	}

	// Generate config files to ensure they are up to date
	if s.configGenerator != nil {
		if err := s.configGenerator.Generate(ctx, srv); err != nil {
			return fmt.Errorf(errFailedToGenerateConfigs, err)
		}
	}

	if s.processManager == nil {
		return errors.New(errProcessManagerNotInit)
	}

	return s.processManager.StartServer(ctx, srv)
}

func (s *Service) resolveAndAttachModNames(ctx context.Context, srv any) error {
	if s.modResolver == nil {
		return nil
	}

	switch v := srv.(type) {
	case *Arma3Server:
		if len(v.ActiveMods) > 0 {
			infos, err := s.modResolver.ResolveModNames(ctx, v.ActiveMods)
			if err != nil {
				return err
			}

			v.ModNames = infos
		}
	case *DayZServer:
		if len(v.ActiveMods) > 0 {
			infos, err := s.modResolver.ResolveModNames(ctx, v.ActiveMods)
			if err != nil {
				return err
			}

			v.ModNames = infos
		}
	}

	return nil
}

func (s *Service) StopServer(ctx context.Context, id int64) error {
	mu := s.getLock(id)
	mu.Lock()
	defer mu.Unlock()

	return s.stopServerLocked(ctx, id)
}

func (s *Service) stopServerLocked(ctx context.Context, id int64) error {
	if s.processManager == nil {
		return errors.New(errProcessManagerNotInit)
	}

	return s.processManager.StopServer(ctx, id)
}

func (s *Service) RestartServer(ctx context.Context, id int64) error {
	mu := s.getLock(id)
	mu.Lock()
	defer mu.Unlock()

	if err := s.stopServerLocked(ctx, id); err != nil {
		return err
	}

	return s.startServerLocked(ctx, id)
}

func (s *Service) AddHeadlessClient(ctx context.Context, id int64) error {
	srv, err := s.repo.GetServerByID(ctx, id)
	if err != nil {
		return err
	}

	a3, ok := srv.(*Arma3Server)
	if !ok {
		return errors.New("server is not an Arma 3 server")
	}

	if s.processManager == nil {
		return errors.New(errProcessManagerNotInit)
	}

	// Resolve mod names before passing it to PM
	if err := s.resolveAndAttachModNames(ctx, a3); err != nil {
		fmt.Printf("[Warning] Failed to resolve mod names for HC on server %d: %v\n", id, err)
	}

	return s.processManager.AddHeadlessClient(ctx, a3)
}

func (s *Service) RemoveHeadlessClient(ctx context.Context, id int64) error {
	if s.processManager == nil {
		return errors.New(errProcessManagerNotInit)
	}

	return s.processManager.RemoveHeadlessClient(ctx, id)
}

func (s *Service) GetCBAPresets(ctx context.Context) ([]CBAPreset, error) {
	return s.repo.GetCBAPresets(ctx)
}

func (s *Service) GetCBAPreset(ctx context.Context, id int64) (*CBAPreset, error) {
	return s.repo.GetCBAPresetByID(ctx, id)
}

func (s *Service) SaveCBAPreset(ctx context.Context, p *CBAPreset) (*CBAPreset, error) {
	id, err := s.repo.SaveCBAPreset(ctx, p)
	if err != nil {
		return nil, err
	}
	return s.repo.GetCBAPresetByID(ctx, id)
}

func (s *Service) DeleteCBAPreset(ctx context.Context, id int64) error {
	return s.repo.DeleteCBAPreset(ctx, id)
}

func (s *Service) GetAllActiveReforgerModIDs(ctx context.Context) ([]string, error) {
	return s.repo.GetAllActiveReforgerModIDs(ctx)
}
