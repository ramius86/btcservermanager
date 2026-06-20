package installation

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"time"
)

type Branch string

const (
	BranchPublic     Branch = "PUBLIC"
	BranchProfiling  Branch = "PROFILING"
	BranchContact    Branch = "CONTACT"
	BranchCreatorDLC Branch = "CREATORDLC"
)

type ServerInstallation struct {
	Type               server.Type                 `json:"type"`
	Version            string                      `json:"version"`
	LastUpdatedAt      *time.Time                  `json:"lastUpdatedAt"`
	InstallationStatus workshop.InstallationStatus `json:"installationStatus"`
	ErrorStatus        *workshop.ErrorStatus       `json:"errorStatus"`
	Branch             Branch                      `json:"branch"`
	InstalledBranch    Branch                      `json:"installedBranch"`
	AvailableBranches  []Branch                    `json:"availableBranches"`
	AvailableVersion   string                      `json:"availableVersion"`
	InstalledBuildID   string                      `json:"installedBuildId"`
	Progress           float64                     `json:"progress"`
}
