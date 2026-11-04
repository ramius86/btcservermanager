package server

import (
	"os"
	"strings"
)

// gameEnvAllowlist elenca le variabili che un processo di gioco può ereditare.
// Tutto ciò che non è qui (segreti del manager: SECRET_KEY, CF_API_TOKEN,
// CF_ZONE_ID, CF_ACCESS_AUD, STEAM_API_KEY, DISCORD_BOT_TOKEN, DATABASE_URL...)
// resta confinato al processo manager e non entra nell'ambiente del server,
// quindi non finisce nei crash dump che Arma allega e invia a Bohemia
// Interactive.
var gameEnvAllowlist = map[string]bool{
	"HOME":            true,
	"PATH":            true,
	"USER":            true,
	"LOGNAME":         true,
	"LANG":            true,
	"LC_ALL":          true,
	"TZ":              true,
	"TERM":            true,
	"TMPDIR":          true,
	"LD_LIBRARY_PATH": true,
}

// gameEnvPrefixAllowlist copre le variabili innocue impostate dal runtime Steam
// (SteamAppId, SteamAppUser, ...).
var gameEnvPrefixAllowlist = []string{"Steam"}

// ChildEnv restituisce l'ambiente da passare ai processi figli che eseguono il
// binario di gioco. Senza questo, exec.Cmd eredita l'intero ambiente del
// manager (comportamento di Go quando cmd.Env è nil).
//
// GAME_ENV_PASSTHROUGH (lista separata da virgole) è una valvola di sicurezza
// per aggiungere variabili senza ricompilare, nel caso un server non parta più.
func ChildEnv() []string {
	env := make([]string, 0, 24)

	for _, kv := range os.Environ() {
		key, _, ok := strings.Cut(kv, "=")
		if !ok {
			continue
		}

		if gameEnvAllowlist[key] {
			env = append(env, kv)
			continue
		}

		for _, prefix := range gameEnvPrefixAllowlist {
			if strings.HasPrefix(key, prefix) {
				env = append(env, kv)
				break
			}
		}
	}

	for _, name := range strings.Split(os.Getenv("GAME_ENV_PASSTHROUGH"), ",") {
		name = strings.TrimSpace(name)
		if name == "" {
			continue
		}
		if value, ok := os.LookupEnv(name); ok {
			env = append(env, name+"="+value)
		}
	}

	return env
}
