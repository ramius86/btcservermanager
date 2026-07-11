package appsettings

type AppSettings struct {
	ID                     int64  `json:"id"`
	LogRetentionDays       int    `json:"logRetentionDays"`
	LogMaxTotalSizeMB      int    `json:"logMaxTotalSizeMB"`
	DiscordReminderHours   int    `json:"discordReminderHours"`
	DiscordReminderMessage string `json:"discordReminderMessage"`
}
