package server

import (
	"bytes"
	"testing"
)

type benchPathProvider struct{}

func (m *benchPathProvider) GetServerPath(t Type) string                        { return "" }
func (m *benchPathProvider) GetModsPath(t Type) string                          { return "" }
func (m *benchPathProvider) GetModsBaseDir() string                             { return "" }
func (m *benchPathProvider) GetModInstallationPath(modID int64, t Type) string  { return "" }
func (m *benchPathProvider) GetModLinkPath(modName string, t Type) string       { return "" }
func (m *benchPathProvider) GetServerKeysPath(t Type) string                    { return "" }
func (m *benchPathProvider) GetServerKeyPath(keyName string, t Type) string     { return "" }
func (m *benchPathProvider) GetScenariosBasePath() string                       { return "" }
func (m *benchPathProvider) GetScenarioPath(scenarioName string) string         { return "" }
func (m *benchPathProvider) GetConfigFilePath(t Type, configName string) string { return "" }
func (m *benchPathProvider) GetProfilesDirectoryPath() string                   { return "" }
func (m *benchPathProvider) GetServerExecutable(t Type) string                  { return "" }
func (m *benchPathProvider) GetServerLogFile(t Type, id int64) string           { return "" }
func (m *benchPathProvider) GetHeadlessClientLogFile(sid int64, hid int) string { return "" }
func (m *benchPathProvider) GetSteamCmdLogFile() string                         { return "" }
func (m *benchPathProvider) GetSteamCmdExecutable() string                      { return "" }
func (m *benchPathProvider) GetSteamCmdCacheFile() string                       { return "" }

func BenchmarkConfigGenerator_Execute(b *testing.B) {
	paths := &benchPathProvider{}
	gen, err := NewConfigGenerator(paths)
	if err != nil {
		b.Fatal(err)
	}

	minB := 1000
	maxB := 10000

	server := &Arma3Server{
		Server: Server{
			ID:   1,
			Name: "Benchmark Server",
			Type: TypeArma3,
		},
		NetworkSettings: &Arma3NetworkSettings{
			MinBandwidth: &minB,
			MaxBandwidth: &maxB,
		},
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		var buf bytes.Buffer
		// Benchmark just the template execution to avoid filesystem noise
		_ = gen.tmpls.ExecuteTemplate(&buf, "arma3_server.tmpl", server)
	}
}

func BenchmarkConfigGenerator_GenerateReforger(b *testing.B) {
	paths := &benchPathProvider{}
	gen, err := NewConfigGenerator(paths)
	if err != nil {
		b.Fatal(err)
	}

	server := &ReforgerServer{
		Server: Server{
			ID:   1,
			Name: "Benchmark Reforger",
			Type: TypeReforger,
		},
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		var buf bytes.Buffer
		_ = gen.tmpls.ExecuteTemplate(&buf, "reforger_server.tmpl", server)
	}
}
