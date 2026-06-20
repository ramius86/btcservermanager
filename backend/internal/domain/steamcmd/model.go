package steamcmd

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"time"
)

type Status string

const (
	StatusInQueue       Status = "IN_QUEUE"
	StatusDownloading   Status = "DOWNLOADING"
	StatusPreallocating Status = "PREALLOCATING"
	StatusCommitting    Status = "COMMITTING"
	StatusVerifying     Status = "VERIFYING"
	StatusFinished      Status = "FINISHED"
	StatusSuccess       Status = "SUCCESS"
	StatusError         Status = "ERROR"
)

type ItemInfo struct {
	ItemID   int64   `json:"itemId"`
	Status   Status  `json:"status"`
	Progress float64 `json:"progress"` // 0.0 to 100.0
	Current  int64   `json:"current"`  // bytes
	Total    int64   `json:"total"`    // bytes
	Version  string  `json:"version,omitempty"`
}

type JobType string

const (
	JobInstallServer  JobType = "INSTALL_SERVER"
	JobUpdateServer   JobType = "UPDATE_SERVER"
	JobInstallMods    JobType = "INSTALL_MODS"
	JobUpdateMods     JobType = "UPDATE_MODS"
	JobUpdateSteamCmd JobType = "UPDATE_STEAMCMD"
	JobCheckUpdates   JobType = "CHECK_UPDATES"
)

type Job struct {
	ID                  string                     `json:"id"`
	Type                JobType                    `json:"type"`
	RelatedServer       server.Type                `json:"relatedServer,omitempty"`
	RelatedWorkshopMods []int64                    `json:"relatedWorkshopMods,omitempty"`
	Parameters          []string                   `json:"-"`
	ErrorStatus         *workshop.ErrorStatus      `json:"errorStatus"`
	CreatedAt           time.Time                  `json:"createdAt"`
	FinishedAt          *time.Time                 `json:"finishedAt"`
	ResultVersion       string                     `json:"resultVersion,omitempty"`
	Done                chan struct{}              `json:"-"`
	OnSuccess           func()                     `json:"-"`
	OnItemSuccess       func(itemID int64)         `json:"-"`
	OnItemFailure       func(itemID int64)         `json:"-"`
	OnFailure           func(workshop.ErrorStatus) `json:"-"`
	// OnRetryWithFailedItems is called before each retry to rebuild parameters
	// for only the failed items. Returns updated parameters.
	OnRetryWithFailedItems func(failedIDs []int64) []string `json:"-"`
	// SucceededItems tracks mod IDs that received explicit success confirmation
	SucceededItems []int64 `json:"-"`
	// FailedItems tracks mod IDs that received explicit error/timeout
	FailedItems []int64 `json:"-"`
}

func NewJob(t JobType) *Job {
	return &Job{
		Type:      t,
		CreatedAt: time.Now(),
		Done:      make(chan struct{}),
	}
}
