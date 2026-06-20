package modpreset

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
)

type ModPreset struct {
	ID           int64                  `json:"id"`
	Name         string                 `json:"name"`
	Type         server.Type            `json:"serverType"`
	Mods         []workshop.WorkshopMod `json:"mods"`
	ReforgerMods []server.ReforgerMod   `json:"reforgerMods"`
}
