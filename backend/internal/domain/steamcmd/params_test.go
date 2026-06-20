package steamcmd

import (
	"strings"
	"testing"
)

func TestNewBuilder(t *testing.T) {
	t.Parallel()
	b := NewBuilder()
	args := b.Build()

	expected := []string{
		"+@NoPromptForPassword",
		"1",
		"+@ShutdownOnFailedCommand",
		"1",
		"+quit",
	}

	if len(args) != len(expected) {
		t.Errorf("Expected %d arguments, got %d: %v", len(expected), len(args), args)
	}

	for i, arg := range args {
		if arg != expected[i] {
			t.Errorf("Expected argument %d to be %s, got %s", i, expected[i], arg)
		}
	}
}

func TestWithLogin(t *testing.T) {
	t.Parallel()
	b := NewBuilder().WithLogin()
	args := b.Build()

	var foundLogin bool
	var foundPlaceholder bool

	for _, arg := range args {
		if arg == "+login" {
			foundLogin = true
		}

		if arg == SteamCredentialsPlaceholder {
			foundPlaceholder = true
		}
	}

	if !foundLogin || !foundPlaceholder {
		t.Errorf("Expected +login and placeholder as separate args, but not found in %v", args)
	}
}

func TestWithAnonymousLogin(t *testing.T) {
	t.Parallel()
	b := NewBuilder().WithAnonymousLogin()
	args := b.Build()

	var foundLogin bool
	var foundAnon bool

	for _, arg := range args {
		if arg == "+login" {
			foundLogin = true
		}

		if arg == "anonymous" {
			foundAnon = true
		}
	}

	if !foundLogin || !foundAnon {
		t.Errorf("Expected +login and anonymous as separate args, but not found in %v", args)
	}
}

func TestWithAppInstall(t *testing.T) {
	t.Parallel()
	b := NewBuilder().WithAppInstall(123, true, "-beta experimental")
	args := b.Build()

	expectedParts := []string{"+app_update", "123", "-beta", "experimental", "validate"}
	for _, part := range expectedParts {
		var found bool

		for _, arg := range args {
			if arg == part {
				found = true
				break
			}
		}

		if !found {
			t.Errorf("Expected part '%s' not found in %v", part, args)
		}
	}
}

func TestWithWorkshopItemInstall(t *testing.T) {
	t.Parallel()
	b := NewBuilder().WithWorkshopItemInstall(123, 456, true)
	args := b.Build()

	expectedParts := []string{"+workshop_download_item", "123", "456", "validate"}
	for _, part := range expectedParts {
		var found bool

		for _, arg := range args {
			if arg == part {
				found = true
				break
			}
		}

		if !found {
			t.Errorf("Expected part '%s' not found in %v", part, args)
		}
	}
}

func TestBuildWithAuth(t *testing.T) {
	t.Parallel()
	b := NewBuilder().WithLogin()
	args := b.BuildWithAuth("user", "pass", "token")

	var foundUser bool
	var foundPass bool
	var foundToken bool

	for _, arg := range args {
		if arg == "user" {
			foundUser = true
		}

		if arg == "pass" {
			foundPass = true
		}

		if arg == "token" {
			foundToken = true
		}
	}

	missingCredentials := !foundUser || !foundPass || !foundToken
	if missingCredentials {
		t.Errorf("Expected credentials as separate args, but not found in %v", args)
	}

	// Verify placeholder is gone
	for _, arg := range args {
		if strings.Contains(arg, SteamCredentialsPlaceholder) {
			t.Error("SteamCredentialsPlaceholder should have been replaced")
		}
	}
}
