package ws

type EventType string

const (
	EvtServerStatus             EventType = "server_status"
	EvtInstallProgress          EventType = "install_progress"
	EvtSystemInfo               EventType = "system_info"
	EvtSteamCmdLog              EventType = "steamcmd_log"
	EvtReforgerStats            EventType = "reforger_stats"
	EvtServerLog                EventType = "server_log"
	EvtServerUpdated            EventType = "server_updated"
	EvtReforgerScenariosUpdated EventType = "reforger_scenarios_updated"
	EvtModMetadataUpdated       EventType = "mod_metadata_updated"
)

type Event struct {
	Type    EventType `json:"type"`
	Payload any       `json:"payload"`
}

type Subscription struct {
	Domain   string `json:"domain"`
	ServerID int64  `json:"server_id,omitempty"`
}

type clientSub struct {
	client *Client
	sub    Subscription
}

type clientUnsub struct {
	client   *Client
	domain   string
	serverID int64
}
