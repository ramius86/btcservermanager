package scenario

import (
	"time"
)

type Arma3Scenario struct {
	Name      string    `json:"name"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"createdAt"`
}

type ReforgerScenario struct {
	ID          string `json:"value"`
	Name        string `json:"name"`
	IsOfficial  bool   `json:"isOfficial"`
	ModID       string `json:"modId,omitempty"`
	ModName     string `json:"modName,omitempty"`
	GameMode    string `json:"gameMode,omitempty"`
	PlayerCount int    `json:"playerCount,omitempty"`
}
