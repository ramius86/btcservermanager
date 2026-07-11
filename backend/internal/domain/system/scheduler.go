package system

import (
	"btcservermanager/internal/domain/discordbot"
	"btcservermanager/internal/domain/logs"
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"fmt"
	"log"
	"time"
)

type Scheduler struct {
	serverService   *server.Service
	workshopService *workshop.Service
	systemService   *Service
	logManager      *logs.LogManager
	discordService  *discordbot.Service
	broadcaster     Broadcaster
	stopCh          chan struct{}
}

type Broadcaster interface {
	Broadcast(eventType string, payload any)
}

type SchedulerDeps struct {
	ServerService   *server.Service
	WorkshopService *workshop.Service
	SystemService   *Service
	LogManager      *logs.LogManager
}

func NewScheduler(deps SchedulerDeps) *Scheduler {
	return &Scheduler{
		serverService:   deps.ServerService,
		workshopService: deps.WorkshopService,
		systemService:   deps.SystemService,
		logManager:      deps.LogManager,
		stopCh:          make(chan struct{}),
	}
}

func (s *Scheduler) SetBroadcaster(b Broadcaster) {
	s.broadcaster = b
}

func (s *Scheduler) SetDiscordService(svc *discordbot.Service) {
	s.discordService = svc
}

func (s *Scheduler) Stop() {
	close(s.stopCh)
}

func (s *Scheduler) Start() {
	go s.runLogCleanup()
	go s.runAutoRestartCheck()
	go s.runWorkshopUpdate()
	go s.runMetricsTicker()
	go s.runSourceQueryTicker()
	go s.runDiscordReminders()
}

func (s *Scheduler) runMetricsTicker() {
	tickerSys := time.NewTicker(2 * time.Second)

	defer tickerSys.Stop()

	for {
		select {
		case <-s.stopCh:
			return
		case <-tickerSys.C:
			if s.broadcaster != nil {
				bgCtx := context.Background()
				info, err := s.systemService.GetSystemInfo(bgCtx)
				if err != nil {
					log.Printf("[Scheduler] Error getting system info: %v", err)
				} else {
					s.broadcaster.Broadcast("system_info", info)
				}
			}
		}
	}
}

func (s *Scheduler) runDiscordReminders() {
	ticker := time.NewTicker(15 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-s.stopCh:
			return
		case <-ticker.C:
			if s.discordService == nil {
				continue // bot not configured, skip silently
			}
			ctx := context.Background()
			settings, err := s.systemService.GetAppSettings(ctx)
			if err != nil || settings.DiscordReminderHours <= 0 {
				continue // disabled or error
			}
			if err := s.discordService.SendEventReminders(ctx, settings.DiscordReminderHours, settings.DiscordReminderMessage, settings.MemberRoleIDs); err != nil {
				log.Printf("[Scheduler] Discord reminder error: %v", err)
			}
		}
	}
}

func (s *Scheduler) runLogCleanup() {
	// Immediate run on start then every 24h
	s.cleanupLogs()

	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-s.stopCh:
			return
		case <-ticker.C:
			s.cleanupLogs()
		}
	}
}

func (s *Scheduler) cleanupLogs() {
	ctx := context.Background()
	settings, err := s.systemService.GetAppSettings(ctx)
	if err != nil {
		log.Printf("Failed to get app settings for log cleanup: %v", err)
		return
	}

	err = s.logManager.CleanLogs(ctx, settings.LogRetentionDays, settings.LogMaxTotalSizeMB)
	if err != nil {
		log.Printf("Error cleaning logs: %v", err)
	}
}

func (s *Scheduler) runAutoRestartCheck() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	lastRestart := make(map[int64]string)

	for {
		select {
		case <-s.stopCh:
			return
		case <-ticker.C:
			bgCtx := context.Background()
			servers, err := s.serverService.GetAllServers(bgCtx)
			if err != nil {
				continue
			}

			now := time.Now().Format("15:04")

			for _, srv := range servers {
				s.autoRestartSingleServer(bgCtx, srv, now, lastRestart)
			}
		}
	}
}

func getServerRestartConfig(srv any) (int64, bool, *string) {
	switch v := srv.(type) {
	case *server.Arma3Server:
		return v.ID, v.RestartAutomatically, v.AutomaticRestartTime
	case *server.DayZServer:
		return v.ID, v.RestartAutomatically, v.AutomaticRestartTime
	case *server.ReforgerServer:
		return v.ID, v.RestartAutomatically, v.AutomaticRestartTime
	default:
		return 0, false, nil
	}
}

func (s *Scheduler) autoRestartSingleServer(bgCtx context.Context, srv any, now string, lastRestart map[int64]string) {
	id, autoRestart, restartTime := getServerRestartConfig(srv)
	if id == 0 {
		return
	}

	shouldRestart := autoRestart && restartTime != nil && *restartTime == now && lastRestart[id] != now
	if shouldRestart {
		lastRestart[id] = now
		log.Printf("Auto-restarting server %d...", id)
		if err := s.serverService.RestartServer(bgCtx, id); err != nil {
			log.Printf("Auto-restart failed for server %d: %v", id, err)
		}
	}
}

func (s *Scheduler) runSourceQueryTicker() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-s.stopCh:
			return
		case <-ticker.C:
			s.queryGameServers()
		}
	}
}

func (s *Scheduler) queryGameServers() {
	bgCtx := context.Background()
	servers, err := s.serverService.GetAllServers(bgCtx)
	if err != nil {
		return
	}

	for _, srv := range servers {
		var id int64

		var queryPort int

		host := "127.0.0.1"

		switch v := srv.(type) {
		case *server.Arma3Server:
			id = v.ID
			queryPort = v.QueryPort
		case *server.DayZServer:
			id = v.ID
			queryPort = v.QueryPort
		case *server.ReforgerServer:
			id = v.ID
			queryPort = v.QueryPort
		}

		if queryPort == 0 {
			continue
		}

		if s.serverService.GetInstanceInfo(id) != nil {
			addr := fmt.Sprintf("%s:%d", host, queryPort)
			if qInfo, err := QueryServerInfo(addr); err == nil {
				s.serverService.UpdateQueryInfo(id, int(qInfo.Players), qInfo.Map, qInfo.Mission)
			}
		}
	}
}

func (s *Scheduler) runWorkshopUpdate() {
	// Every 6 hours
	ticker := time.NewTicker(6 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-s.stopCh:
			return
		case <-ticker.C:
			log.Println("Running workshop update cron...")

			bgCtx := context.Background()
			err := s.workshopService.UpdateAllMods(bgCtx)
			if err != nil {
				log.Printf("Failed to update workshop mods: %v", err)
			}
		}
	}
}
