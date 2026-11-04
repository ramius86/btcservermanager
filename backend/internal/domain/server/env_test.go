package server

import (
	"strings"
	"testing"
)

func containsEnv(env []string, want string) bool {
	for _, kv := range env {
		if kv == want {
			return true
		}
	}
	return false
}

func TestChildEnvExcludesManagerSecrets(t *testing.T) {
	secrets := map[string]string{
		"SECRET_KEY":        "super-secret",
		"STEAM_API_KEY":     "steam-key",
		"DISCORD_BOT_TOKEN": "discord-token",
		"CF_API_TOKEN":      "cf-token",
		"CF_ZONE_ID":        "cf-zone",
		"CF_ACCESS_AUD":     "cf-aud",
		"DATABASE_URL":      "postgres://user:pass@db/app",
		"ALLOWED_ORIGIN":    "https://example.com",
		"FASTDL_DOMAIN":     "dl.example.com",
		"TUNNEL_TOKEN":      "tunnel-token",
	}
	for key, value := range secrets {
		t.Setenv(key, value)
	}

	env := ChildEnv()

	for key := range secrets {
		for _, kv := range env {
			if strings.HasPrefix(kv, key+"=") {
				t.Fatalf("ChildEnv ha esposto il segreto %s", key)
			}
		}
	}
}

func TestChildEnvKeepsRuntimeVariables(t *testing.T) {
	t.Setenv("HOME", "/home/steam")
	t.Setenv("TZ", "Europe/Rome")
	t.Setenv("TMPDIR", "/tmp")
	t.Setenv("LD_LIBRARY_PATH", "/home/steam/Steam/linux64")
	t.Setenv("SteamAppId", "107410")

	env := ChildEnv()

	want := []string{
		"HOME=/home/steam",
		"TZ=Europe/Rome",
		"TMPDIR=/tmp",
		"LD_LIBRARY_PATH=/home/steam/Steam/linux64",
		"SteamAppId=107410",
	}
	for _, kv := range want {
		if !containsEnv(env, kv) {
			t.Fatalf("ChildEnv non contiene %q", kv)
		}
	}
}

func TestChildEnvPassthrough(t *testing.T) {
	t.Setenv("CUSTOM_GAME_VAR", "custom")
	t.Setenv("SECRET_KEY", "super-secret")
	t.Setenv("GAME_ENV_PASSTHROUGH", " CUSTOM_GAME_VAR , ")

	env := ChildEnv()

	if !containsEnv(env, "CUSTOM_GAME_VAR=custom") {
		t.Fatalf("GAME_ENV_PASSTHROUGH non ha aggiunto CUSTOM_GAME_VAR")
	}
	for _, kv := range env {
		if strings.HasPrefix(kv, "SECRET_KEY=") {
			t.Fatalf("GAME_ENV_PASSTHROUGH ha esposto SECRET_KEY")
		}
	}
}
