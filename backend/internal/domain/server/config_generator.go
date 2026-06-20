package server

import (
	"bytes"
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
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
)

//go:embed templates/*.tmpl
var templatesFS embed.FS

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

func (g *ConfigGenerator) Generate(ctx context.Context, s any) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
	}

	if err := g.generateBaseConfig(s); err != nil {
		return err
	}

	if a3, ok := s.(*Arma3Server); ok {
		if err := g.generateArma3NetworkAndCBA(a3); err != nil {
			return err
		}
		if a3.DifficultySettings != nil {
			if err := g.generateArma3Profile(a3); err != nil {
				return err
			}
		}
	}

	return nil
}

func (g *ConfigGenerator) generateBaseConfig(s any) error {
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
		return g.executeTemplate("arma3_server.tmpl", fmt.Sprintf(tplArma3Cfg, v.ID), v.Type, data)
	case *DayZServer:
		return g.executeTemplate("dayz_server.tmpl", fmt.Sprintf(tplDayzCfg, v.ID), v.Type, v)
	case *ReforgerServer:
		return g.executeTemplate("reforger_server.tmpl", fmt.Sprintf(tplReforgerJson, v.ID), v.Type, v)
	default:
		return errors.New("unsupported server type for config generation")
	}
}

func (g *ConfigGenerator) generateArma3NetworkAndCBA(a3 *Arma3Server) error {
	if a3.CBAPresetID != nil && a3.CBAPreset != nil {
		if err := g.generateCBAPresetMod(a3); err != nil {
			fmt.Printf("[Warning] Failed to generate CBA preset mod: %v\n", err)
		}
	}

	if a3.NetworkSettings != nil {
		netFile := fmt.Sprintf(tplArma3NetCfg, a3.ID)
		if err := g.executeTemplate("arma3_network.tmpl", netFile, TypeArma3, a3.NetworkSettings); err != nil {
			return err
		}
	}
	return nil
}

func (g *ConfigGenerator) generateArma3Profile(a3 *Arma3Server) error {
	profileName := fmt.Sprintf(tplArma3ProfileName, a3.ID)
	// Path: custom_profiles/Users/<name>/<name>.Arma3Profile
	profilePath := filepath.Join("Users", profileName, profileName+extArma3Profile)

	var buf bytes.Buffer
	if err := g.tmpls.ExecuteTemplate(&buf, "arma3_profile.tmpl", a3.DifficultySettings); err != nil {
		return fmt.Errorf("failed to execute arma3_profile template: %w", err)
	}

	destPath := filepath.Join(g.paths.GetProfilesDirectoryPath(), profilePath)
	if err := os.MkdirAll(filepath.Dir(destPath), 0o755); err != nil {
		return err
	}

	return os.WriteFile(destPath, buf.Bytes(), 0o644)
}

func (g *ConfigGenerator) executeTemplate(tplName, fileName string, t Type, data any) error {
	var buf bytes.Buffer

	if err := g.tmpls.ExecuteTemplate(&buf, tplName, data); err != nil {
		return fmt.Errorf("failed to execute template %s: %w", tplName, err)
	}

	destPath := g.paths.GetConfigFilePath(t, fileName)
	if err := os.MkdirAll(filepath.Dir(destPath), 0o755); err != nil {
		return err
	}

	return os.WriteFile(destPath, buf.Bytes(), 0o644)
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
			fmt.Printf("[ConfigGenerator] Deleting orphaned config file: %s\n", path)
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

func (g *ConfigGenerator) generateCBAPresetMod(s *Arma3Server) error {
	modDir := filepath.Join(g.paths.GetServerPath(s.Type), fmt.Sprintf("@cba_server_%d", s.ID))
	addonDir := filepath.Join(modDir, "addons")

	if err := os.MkdirAll(addonDir, 0o755); err != nil {
		return err
	}

	// 2. config.cpp
	configCPP := `class CfgPatches {
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

	pbo := NewPBOWriter()
	pbo.Prefix = "cba_settings_userconfig"
	pbo.AddFile("config.cpp", []byte(configCPP))
	pbo.AddFile("cba_settings.sqf", []byte(s.CBAPreset.Content))

	pboPath := filepath.Join(addonDir, "cba_settings.pbo")
	f, err := os.Create(pboPath)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := pbo.WriteTo(f); err != nil {
		return err
	}

	// Clean up legacy unpacked files if they exist
	_ = os.Remove(filepath.Join(addonDir, "config.cpp"))
	_ = os.Remove(filepath.Join(addonDir, "cba_settings.sqf"))

	return nil
}
