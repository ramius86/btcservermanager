package appsettings

type AppSettings struct {
	ID                             int64    `json:"id"`
	LogRetentionDays               int      `json:"logRetentionDays"`
	LogMaxTotalSizeMB              int      `json:"logMaxTotalSizeMB"`
	DiscordReminderHours           int      `json:"discordReminderHours"`
	DiscordReminderMessage         string   `json:"discordReminderMessage"`
	MemberRoleIDs                  []string `json:"memberRoleIds"`
	QualificationNames             []string `json:"qualificationNames"`
	DiscordAlertChannelID          string   `json:"discordAlertChannelId"`
	DiscordAlertServerOffline      bool     `json:"discordAlertServerOffline"`
	DiscordAlertModUpdates         bool     `json:"discordAlertModUpdates"`
	DiscordAlertGameUpdates        bool     `json:"discordAlertGameUpdates"`
	ModUpdateCheckIntervalMinutes  int      `json:"modUpdateCheckIntervalMinutes"`
	GameUpdateCheckIntervalMinutes int      `json:"gameUpdateCheckIntervalMinutes"`
	EventRosterEnabled             bool     `json:"eventRosterEnabled"`
}
