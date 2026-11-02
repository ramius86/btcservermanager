package server

import (
	"btcservermanager/internal/atomicfile"
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"text/template"
)

const (
	tplArma3Cfg         = "ARMA3_%d.cfg"
	tplDayzCfg          = "DAYZ_%d.cfg"
	tplReforgerJson     = "REFORGER_%d.json"
	tplArma3NetCfg      = "ARMA3_%d_network.cfg"
	tplArma3ProfileName = "ARMA3_%d"
	extArma3Profile     = ".Arma3Profile"

	// cbaServerConfigCPP is the boilerplate wrapped around the CBA settings
	// preset, packaged as a tiny server-side mod.
	cbaServerConfigCPP = `class CfgPatches {
    class cba_settings_userconfig {
        author = "$STR_CBA_Author";
        name = "$STR_CBA_Settings_Component";
        url = "$STR_CBA_URL";
        units[] = {};
        weapons[] = {};
        requiredVersion = 1.0;
        requiredAddons[] = {"cba_settings"};
        version = 1.0;
        authors[] = {"commy2"};
    };
};

// Uncommenting this will make any changes to "Server" settings be lost upon game restart, applies only to dedicated servers
// cba_settings_volatile = 1;
`
)

//go:embed templates/*.tmpl
var templatesFS embed.FS

// preparedFile is one rendered file waiting to be committed.
type preparedFile struct {
	path string
	data []byte
	perm os.FileMode
}

// PreparedConfig holds fully rendered config files. Nothing touches the disk
// until Commit is called, so a caller can persist the database first (or drop
// the result entirely) without leaving half-written files behind.
type PreparedConfig struct {
	files []preparedFile
}

// Len reports how many files would be written by Commit.
func (p *PreparedConfig) Len() int {
	if p == nil {
		return 0
	}
	return len(p.files)
}

type ConfigGenerator struct {
	paths        PathProvider
	tmpls        *template.Template
	fastDLDomain string
}

func NewConfigGenerator(paths PathProvider) (*ConfigGenerator, error) {
	tmpls := template.New("").Funcs(template.FuncMap{
		"sub": func(a, b int) int { return a - b },
		"json": func(v any) string {
			b, _ := json.Marshal(v)
			return string(b)
		},
	})

	tmpls, err := tmpls.ParseFS(templatesFS, "templates/*.tmpl")
	if err != nil {
		return nil, fmt.Errorf("failed to parse templates: %w", err)
	}

	return &ConfigGenerator{
		paths: paths,
		tmpls: tmpls,
	}, nil
}

func (g *ConfigGenerator) SetFastDLDomain(domain string) {
	g.fastDLDomain = domain
}

// Prepare renders every config file for s in memory. It performs no writes, so
// a template error cannot leave a server with a truncated configuration.
func (g *ConfigGenerator) Prepare(ctx context.Context, s any) (*PreparedConfig, error) {
	select {
	case <-ctx.Done():
		return nil, ctx.Err()
	default:
	}

	base, err := g.renderBaseConfig(s)
	if err != nil {
		return nil, err
	}

	prepared := &PreparedConfig{files: base}

	if a3, ok := s.(*Arma3Server); ok {
		network, err := g.renderArma3NetworkAndCBA(a3)
		if err != nil {
			return nil, err
		}
		prepared.files = append(prepared.files, network...)

		if a3.DifficultySettings != nil {
			profile, err := g.renderArma3Profile(a3)
			if err != nil {
				return nil, err
			}
			prepared.files = append(prepared.files, profile)
		}
	}

	return prepared, nil
}

// Commit writes the prepared files, each one atomically.
func (g *ConfigGenerator) Commit(prepared *PreparedConfig) error {
	if prepared == nil {
		return nil
	}

	for _, f := range prepared.files {
		if err := os.MkdirAll(filepath.Dir(f.path), 0o755); err != nil {
			return err
		}
		if err := atomicfile.WriteFile(f.path, f.data, f.perm); err != nil {
			return err
		}
	}

	return nil
}

// Generate renders and writes the config files in one step.
func (g *ConfigGenerator) Generate(ctx context.Context, s any) error {
	prepared, err := g.Prepare(ctx, s)
	if err != nil {
		return err
	}

	return g.Commit(prepared)
}

func (g *ConfigGenerator) renderBaseConfig(s any) ([]preparedFile, error) {
	switch v := s.(type) {
	case *Arma3Server:
		// Wrap Arma3Server to include FastDLDomain for the template
		data := struct {
			*Arma3Server
			FastDLDomain string
		}{
			Arma3Server:  v,
			FastDLDomain: g.fastDLDomain,
		}
		return g.renderConfigFile("arma3_server.tmpl", fmt.Sprintf(tplArma3Cfg, v.ID), v.Type, data)
	case *DayZServer:
		return g.renderConfigFile("dayz_server.tmpl", fmt.Sprintf(tplDayzCfg, v.ID), v.Type, v)
	case *ReforgerServer:
		return g.renderConfigFile("reforger_server.tmpl", fmt.Sprintf(tplReforgerJson, v.ID), v.Type, v)
	default:
		return nil, errors.New("unsupported server type for config generation")
	}
}

func (g *ConfigGenerator) renderArma3NetworkAndCBA(a3 *Arma3Server) ([]preparedFile, error) {
	files := make([]preparedFile, 0, 2)

	if a3.CBAPresetID != nil && a3.CBAPreset != nil {
		cbaFile, err := g.renderCBAPresetMod(a3)
		if err != nil {
			// A broken CBA preset must not block the server config itself.
			log.Printf("[Warning] Failed to generate CBA preset mod: %v\n", err)
		} else {
			files = append(files, cbaFile)
		}
	}

	if a3.NetworkSettings != nil {
		netFile := fmt.Sprintf(tplArma3NetCfg, a3.ID)
		rendered, err := g.renderConfigFile("arma3_network.tmpl", netFile, TypeArma3, a3.NetworkSettings)
		if err != nil {
			return nil, err
		}
		files = append(files, rendered...)
	}

	return files, nil
}

func (g *ConfigGenerator) renderArma3Profile(a3 *Arma3Server) (preparedFile, error) {
	profileName := fmt.Sprintf(tplArma3ProfileName, a3.ID)
	// Path: custom_profiles/Users/<name>/<name>.Arma3Profile
	profilePath := filepath.Join("Users", profileName, profileName+extArma3Profile)

	var buf bytes.Buffer
	if err := g.tmpls.ExecuteTemplate(&buf, "arma3_profile.tmpl", a3.DifficultySettings); err != nil {
		return preparedFile{}, fmt.Errorf("failed to execute arma3_profile template: %w", err)
	}

	return preparedFile{
		path: filepath.Join(g.paths.GetProfilesDirectoryPath(), profilePath),
		data: buf.Bytes(),
		perm: 0o644,
	}, nil
}

func (g *ConfigGenerator) renderConfigFile(tplName, fileName string, t Type, data any) ([]preparedFile, error) {
	var buf bytes.Buffer

	if err := g.tmpls.ExecuteTemplate(&buf, tplName, data); err != nil {
		return nil, fmt.Errorf("failed to execute template %s: %w", tplName, err)
	}

	return []preparedFile{{
		path: g.paths.GetConfigFilePath(t, fileName),
		data: buf.Bytes(),
		perm: 0o644,
	}}, nil
}

func (g *ConfigGenerator) Delete(ctx context.Context, t Type, id int64) error {
	files := []string{}

	switch t {
	case TypeArma3:
		files = append(files, fmt.Sprintf(tplArma3Cfg, id))
		files = append(files, fmt.Sprintf(tplArma3NetCfg, id))
		// Also clean up profile directory
		profileDir := filepath.Join(g.paths.GetProfilesDirectoryPath(), "Users", fmt.Sprintf(tplArma3ProfileName, id))
		_ = os.RemoveAll(profileDir)
		// Clean up CBA server mod directory
		cbaModDir := filepath.Join(g.paths.GetServerPath(TypeArma3), fmt.Sprintf("@cba_server_%d", id))
		_ = os.RemoveAll(cbaModDir)
	case TypeDayZ, TypeDayZExp:
		files = append(files, fmt.Sprintf(tplDayzCfg, id))
	case TypeReforger:
		files = append(files, fmt.Sprintf(tplReforgerJson, id))
	}

	for _, f := range files {
		path := g.paths.GetConfigFilePath(t, f)
		if _, err := os.Stat(path); err == nil {
			log.Printf("[ConfigGenerator] Deleting orphaned config file: %s\n", path)
			_ = os.Remove(path)
		}
	}

	return nil
}

func (g *ConfigGenerator) GetConfigContents(ctx context.Context, s any) (map[string]string, error) {
	configs := make(map[string]string)

	switch v := s.(type) {
	case *Arma3Server:
		mainFile := fmt.Sprintf(tplArma3Cfg, v.ID)
		configs[mainFile] = g.readFileIfExists(v.Type, mainFile)

		netFile := fmt.Sprintf(tplArma3NetCfg, v.ID)
		configs[netFile] = g.readFileIfExists(v.Type, netFile)

		profileName := fmt.Sprintf(tplArma3ProfileName, v.ID)
		profilePath := filepath.Join("Users", profileName, profileName+extArma3Profile)
		fullProfilePath := filepath.Join(g.paths.GetProfilesDirectoryPath(), profilePath)
		configs[profileName+extArma3Profile] = g.readFileContent(fullProfilePath)

	case *DayZServer:
		fileName := fmt.Sprintf(tplDayzCfg, v.ID)
		configs[fileName] = g.readFileIfExists(v.Type, fileName)

	case *ReforgerServer:
		fileName := fmt.Sprintf(tplReforgerJson, v.ID)
		configs[fileName] = g.readFileIfExists(v.Type, fileName)

	default:
		return nil, errors.New("unsupported server type for config preview")
	}

	return configs, nil
}

func (g *ConfigGenerator) readFileIfExists(t Type, fileName string) string {
	path := g.paths.GetConfigFilePath(t, fileName)
	return g.readFileContent(path)
}

func (g *ConfigGenerator) readFileContent(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Sprintf("Error reading file: %v\n(File might not exist yet. Try saving and starting the server first.)", err)
	}

	return string(data)
}

func (g *ConfigGenerator) renderCBAPresetMod(s *Arma3Server) (preparedFile, error) {
	modDir := filepath.Join(g.paths.GetServerPath(s.Type), fmt.Sprintf("@cba_server_%d", s.ID))
	addonDir := filepath.Join(modDir, "addons")

	pbo := NewPBOWriter()
	pbo.Prefix = "cba_settings_userconfig"
	pbo.AddFile("config.cpp", []byte(cbaServerConfigCPP))
	pbo.AddFile("cba_settings.sqf", []byte(s.CBAPreset.Content))

	var buf bytes.Buffer
	if _, err := pbo.WriteTo(&buf); err != nil {
		return preparedFile{}, fmt.Errorf("failed to build CBA preset PBO: %w", err)
	}

	// Clean up legacy unpacked files if they exist; the PBO is authoritative.
	_ = os.Remove(filepath.Join(addonDir, "config.cpp"))
	_ = os.Remove(filepath.Join(addonDir, "cba_settings.sqf"))

	return preparedFile{
		path: filepath.Join(addonDir, "cba_settings.pbo"),
		data: buf.Bytes(),
		perm: 0o644,
	}, nil
}
