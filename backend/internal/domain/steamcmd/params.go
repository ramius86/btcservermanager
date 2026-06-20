package steamcmd

import (
	"strconv"
	"strings"
)

const SteamCredentialsPlaceholder = "<{STEAM_CREDENTIALS_PLACEHOLDER}>"

type Parameters struct {
	args []string
}

func NewBuilder() *Parameters {
	p := &Parameters{}
	p.args = append(p.args, "+@NoPromptForPassword", "1")
	p.args = append(p.args, "+@ShutdownOnFailedCommand", "1")

	return p
}

// NewModBuilder creates parameters for workshop mod downloads.
// Unlike NewBuilder, it omits @ShutdownOnFailedCommand so SteamCMD
// continues downloading remaining mods when individual items fail.
func NewModBuilder() *Parameters {
	p := &Parameters{}
	p.args = append(p.args, "+@NoPromptForPassword", "1")

	return p
}

func (p *Parameters) WithLogin() *Parameters {
	p.args = append(p.args, "+login", SteamCredentialsPlaceholder)
	return p
}

func (p *Parameters) WithAnonymousLogin() *Parameters {
	p.args = append(p.args, "+login", "anonymous")
	return p
}

func (p *Parameters) WithInstallDir(dir string) *Parameters {
	p.args = append(p.args, "+force_install_dir", dir)
	return p
}

func (p *Parameters) WithAppInstall(appID int64, validate bool, args ...string) *Parameters {
	p.args = append(p.args, "+app_update", strconv.FormatInt(appID, 10))

	for _, arg := range args {
		if arg != "" {
			// If arg contains spaces, should we split it?
			// Usually args here are like "-beta experimental", which should be split.
			parts := strings.Fields(arg)
			p.args = append(p.args, parts...)
		}
	}

	if validate {
		p.args = append(p.args, "validate")
	}

	return p
}

func (p *Parameters) WithWorkshopItemInstall(appID, itemID int64, validate bool) *Parameters {
	p.args = append(p.args, "+workshop_download_item", strconv.FormatInt(appID, 10), strconv.FormatInt(itemID, 10))
	if validate {
		p.args = append(p.args, "validate")
	}

	return p
}

func (p *Parameters) Build() []string {
	res := make([]string, len(p.args))
	copy(res, p.args)
	res = append(res, "+quit")

	return res
}

func (p *Parameters) BuildWithAuth(username, password, guardToken string) []string {
	args := p.Build()

	result := []string{}

	for _, arg := range args {
		if strings.Contains(arg, SteamCredentialsPlaceholder) {
			result = append(result, username, password)
			if guardToken != "" {
				result = append(result, guardToken)
			}
		} else {
			result = append(result, arg)
		}
	}

	return result
}
