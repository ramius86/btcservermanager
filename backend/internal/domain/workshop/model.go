package workshop

import (
	"btcservermanager/internal/domain/server"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type InstallationStatus string

const (
	InstallationInProgress   InstallationStatus = "INSTALLATION_IN_PROGRESS"
	InstallationError        InstallationStatus = "ERROR"
	InstallationFinished     InstallationStatus = "FINISHED"
	InstallationNotInstalled InstallationStatus = "NOT_INSTALLED"
)

type ErrorStatus string

const (
	ErrorWrongAuth      ErrorStatus = "WRONG_AUTH"
	ErrorIO             ErrorStatus = "IO"
	ErrorTimeout        ErrorStatus = "TIMEOUT"
	ErrorNoMatch        ErrorStatus = "NO_MATCH"
	ErrorNoSubscription ErrorStatus = "NO_SUBSCRIPTION"
	ErrorRateLimit      ErrorStatus = "RATE_LIMIT"
	ErrorGeneric        ErrorStatus = "GENERIC"
	ErrorPartialFailure ErrorStatus = "PARTIAL_FAILURE"
	ErrorInterrupted    ErrorStatus = "INTERRUPTED"
)

type WorkshopMod struct {
	ID                 int64              `json:"id"`
	Name               string             `json:"name"`
	Thumbnail          string             `json:"thumbnail"`
	LastUpdated        *time.Time         `json:"lastUpdated"`
	InstalledAt        *time.Time         `json:"installedAt"`
	FileSize           int64              `json:"fileSize"`
	ServerOnly         bool               `json:"serverOnly"`
	InstallationStatus InstallationStatus `json:"installationStatus"`
	ErrorStatus        *ErrorStatus       `json:"errorStatus"`
	ServerType         server.Type        `json:"serverType"`
	BiKeys             []string           `json:"biKeys"`
	NeedsUpdate        bool               `json:"needsUpdate"`
}

var (
	nonAlphanumericRegex = regexp.MustCompile(`[^A-Za-z0-9_]`)
	whitespaceRegex      = regexp.MustCompile(`\s`)
)

func (m *WorkshopMod) GetNormalizedName() string {
	name := m.Name
	if name == "" {
		name = strconv.FormatInt(m.ID, 10)
	}

	retVal := strings.TrimSpace(name)
	retVal = whitespaceRegex.ReplaceAllString(retVal, "_")
	retVal = nonAlphanumericRegex.ReplaceAllString(retVal, "")

	return "@" + retVal
}

type Arma3CDLC string

const (
	CDLCCSLAIronCurtain     Arma3CDLC = "csla"
	CDLCExpeditionaryForces Arma3CDLC = "ef"
	CDLCGlobalMobilization  Arma3CDLC = "gm"
	CDLCReactionForces      Arma3CDLC = "rf"
	CDLCSOGPrairieFire      Arma3CDLC = "vn"
	CDLCSpearhead1944       Arma3CDLC = "spe"
	CDLCWesternSahara       Arma3CDLC = "ws"
)

func (c Arma3CDLC) GetID() string {
	return string(c)
}

func (c Arma3CDLC) GetName() string {
	switch c {
	case CDLCCSLAIronCurtain:
		return "CSLA Iron Curtain"
	case CDLCExpeditionaryForces:
		return "Expeditionary Forces"
	case CDLCGlobalMobilization:
		return "Global Mobilization"
	case CDLCReactionForces:
		return "Reaction Forces"
	case CDLCSOGPrairieFire:
		return "S.O.G. Prairie Fire"
	case CDLCSpearhead1944:
		return "Spearhead 1944"
	case CDLCWesternSahara:
		return "Western Sahara"
	}

	return string(c)
}

func GetAllCDLCs() []Arma3CDLC {
	return []Arma3CDLC{
		CDLCCSLAIronCurtain,
		CDLCExpeditionaryForces,
		CDLCGlobalMobilization,
		CDLCReactionForces,
		CDLCSOGPrairieFire,
		CDLCSpearhead1944,
		CDLCWesternSahara,
	}
}
