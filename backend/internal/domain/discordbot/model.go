package discordbot

type Channel struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Event struct {
	ID           int64  `json:"id"`
	ChannelID    string `json:"channelId"`
	MessageID    string `json:"messageId"`
	Title        string `json:"title"`
	DateTime     string `json:"dateTime"`
	GameType     string `json:"gameType"` // "arma3" | "reforger"
	CreatedAt    string `json:"createdAt"`
	ReminderSent bool   `json:"reminderSent"`
}

type DiscordEventDetail struct {
	Event
	Going      []string `json:"going"`
	NotGoing   []string `json:"notGoing"`
	Maybe      []string `json:"maybe"`
	NoResponse []string `json:"noResponse"`
}

type CreateEventRequest struct {
	Title       string `json:"title"`
	DateTime    string `json:"dateTime"`
	GameType    string `json:"gameType"`
	ChannelID   string `json:"channelId"`
	ImageBase64 string `json:"imageBase64"`
	Mentions    string `json:"mentions"`
}

type UpdateEventRequest struct {
	Title    string `json:"title"`
	DateTime string `json:"dateTime"`
	GameType string `json:"gameType"`
}

type DiscordUser struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	IsActive  bool   `json:"isActive"`
	UpdatedAt string `json:"updatedAt"`
}

type Participation struct {
	EventID   int64  `json:"eventId"`
	UserID    string `json:"userId"`
	Username  string `json:"username"`
	Status    string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}

type RawAttendance struct {
	UserID   string `json:"userId"`
	Username string `json:"username"`
	Status   string `json:"status"`
	DateTime string `json:"dateTime"`
	GameType string `json:"gameType"`
}

type DiscordRole struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GuildMember struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
}

type ManualParticipationRequest struct {
	UserID   string `json:"userId"`
	Username string `json:"username"`
	Status   string `json:"status"` // "going" | "not_going" | "maybe" | "none"
}
