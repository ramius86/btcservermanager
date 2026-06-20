package steamauth

type SteamAuth struct {
	ID              int64  `json:"id"`
	Username        string `json:"username"`
	Password        string `json:"password"`
	SteamGuardToken string `json:"steamGuardToken"`
	RefreshToken    string `json:"refreshToken"`
	AccountName     string `json:"accountName"`
}
