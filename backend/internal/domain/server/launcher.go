package server

import (
	"errors"
	"fmt"
	"path/filepath"
	"strconv"
	"strings"
)

type Launcher struct {
	paths          PathProvider
	additionalMods []string
}

func NewLauncher(paths PathProvider, additionalMods []string) *Launcher {
	return &Launcher{
		paths:          paths,
		additionalMods: additionalMods,
	}
}

func (l *Launcher) GetLaunchParameters(s any) ([]string, error) {
	switch v := s.(type) {
	case *Arma3Server:
		return l.getArma3Parameters(v), nil
	case *DayZServer:
		return l.getDayZParameters(v), nil
	case *ReforgerServer:
		return l.getReforgerParameters(v), nil
	default:
		return nil, errors.New("unknown server type for launcher")
	}
}

func (l *Launcher) getArma3Parameters(s *Arma3Server) []string {
	params := []string{}
	params = append(params, "-port="+strconv.Itoa(s.Port))
	params = append(params, "-config="+l.paths.GetConfigFilePath(s.Type, fmt.Sprintf("ARMA3_%d.cfg", s.ID)))

	if s.NetworkSettings != nil {
		params = append(params, "-cfg="+l.paths.GetConfigFilePath(s.Type, fmt.Sprintf("ARMA3_%d_network.cfg", s.ID)))
	}

	params = append(params, "-profiles="+l.paths.GetProfilesDirectoryPath())
	params = append(params, "-name="+string(s.Type)+"_"+strconv.FormatInt(s.ID, 10))

	if s.ServerFilePatching {
		params = append(params, "-filePatching")
	}

	l.appendArma3PerformanceParams(&params, s)

	params = append(params, "-nosplash")
	params = append(params, "-skipIntro")
	params = append(params, "-world=empty")

	l.appendArma3ModsParams(&params, s)

	l.addCustomLaunchParameters(&params, s.CustomLaunchParameters, false)

	return params
}

func (l *Launcher) appendArma3PerformanceParams(params *[]string, s *Arma3Server) {
	if s.LimitFPS != nil {
		*params = append(*params, fmt.Sprintf("-limitFPS=%d", *s.LimitFPS))
	}
	if s.MaxMem != nil {
		*params = append(*params, fmt.Sprintf("-maxMem=%d", *s.MaxMem))
	}
	if s.CpuCount != nil {
		*params = append(*params, fmt.Sprintf("-cpuCount=%d", *s.CpuCount))
	}
	if s.ExThreads != nil {
		*params = append(*params, fmt.Sprintf("-exThreads=%d", *s.ExThreads))
	}
	if s.EnableHT {
		*params = append(*params, "-enableHT")
	}
	if s.DebugMode {
		*params = append(*params, "-debug")
	}
	if s.NetworkDiagInterval != nil {
		*params = append(*params, fmt.Sprintf("-networkDiagInterval=%d", *s.NetworkDiagInterval))
	}
	if s.LoadMissionToMemory {
		*params = append(*params, "-loadMissionToMemory")
	}
}

func (l *Launcher) appendArma3ModsParams(params *[]string, s *Arma3Server) {
	clientMods := []string{}
	serverMods := []string{}

	for _, mod := range s.ModNames {
		if mod.ServerOnly {
			serverMods = append(serverMods, mod.Name)
		} else {
			clientMods = append(clientMods, mod.Name)
		}
	}

	if s.CBAPresetID != nil {
		serverMods = append(serverMods, fmt.Sprintf("@cba_server_%d", s.ID))
	}

	clientMods = append(clientMods, s.ActiveDLCs...)
	clientMods = append(clientMods, l.additionalMods...)

	if len(clientMods) > 0 {
		*params = append(*params, "-mod="+strings.Join(clientMods, ";"))
	}

	if len(serverMods) > 0 {
		*params = append(*params, "-serverMod="+strings.Join(serverMods, ";"))
	}
}

func (l *Launcher) getDayZParameters(s *DayZServer) []string {
	params := []string{}
	params = append(params, "-port="+strconv.Itoa(s.Port))
	params = append(params, "-config="+l.paths.GetConfigFilePath(s.Type, fmt.Sprintf("DAYZ_%d.cfg", s.ID)))

	profiles := s.ProfilesPath
	if profiles == "" {
		profiles = "profiles"
	}
	params = append(params, "-profiles="+profiles)

	bePath := s.BattlEyePath
	if bePath == "" {
		bePath = "battleye"
	}
	params = append(params, "-BEpath="+bePath)

	limitFPS := s.LimitFPS
	if limitFPS <= 0 {
		limitFPS = 60
	}
	params = append(params, "-limitFPS="+strconv.Itoa(limitFPS))

	if s.EnableDoLogs {
		params = append(params, "-dologs")
	}
	if s.EnableAdminLog {
		params = append(params, "-adminlog")
	}
	if s.EnableNetLog {
		params = append(params, "-netlog")
	}
	if s.EnableFreezeCheck {
		params = append(params, "-freezeCheck")
	}

	// Mods
	clientMods := []string{}
	serverMods := []string{}

	for _, mod := range s.ModNames {
		if mod.ServerOnly {
			serverMods = append(serverMods, mod.Name)
		} else {
			clientMods = append(clientMods, mod.Name)
		}
	}

	if len(clientMods) > 0 {
		params = append(params, "-mod="+strings.Join(clientMods, ";")+";")
	}

	if len(serverMods) > 0 {
		params = append(params, "-serverMod="+strings.Join(serverMods, ";")+";")
	}

	l.addCustomLaunchParameters(&params, s.CustomLaunchParameters, false)

	return params
}

func (l *Launcher) getReforgerParameters(s *ReforgerServer) []string {
	params := []string{}
	params = append(params, "-config")
	params = append(params, l.paths.GetConfigFilePath(s.Type, fmt.Sprintf("REFORGER_%d.json", s.ID)))
	params = append(params, "-profile")
	params = append(params, filepath.Join(l.paths.GetServerPath(s.Type), fmt.Sprintf("profile_%d", s.ID)))
	params = append(params, "-addonDownloadDir", filepath.Join(l.paths.GetModsBaseDir(), "reforger"))
	params = append(params, "-maxFPS")
	params = append(params, strconv.Itoa(s.MaxFPS))
	params = append(params, "-backendlog")
	params = append(params, "-logAppend")

	l.appendReforgerNetworkParams(&params, s)
	l.appendReforgerMiscParams(&params, s)

	l.addCustomLaunchParameters(&params, s.CustomLaunchParameters, true) // Reforger uses -name val instead of -name=val

	return params
}

func (l *Launcher) appendReforgerNetworkParams(params *[]string, s *ReforgerServer) {
	if s.NetworkDynamicSimulation != nil {
		*params = append(*params, "-nds", strconv.Itoa(*s.NetworkDynamicSimulation))
	}

	if s.ReplicationTimeoutMs != nil {
		*params = append(*params, "-rpl-timeout-ms", strconv.Itoa(*s.ReplicationTimeoutMs))
	}

	if s.StreamsDelta != nil {
		*params = append(*params, "-streamsDelta", strconv.Itoa(*s.StreamsDelta))
	}

	if s.StreamingBudget != nil {
		*params = append(*params, "-streamingBudget", strconv.Itoa(*s.StreamingBudget))
	}

	if s.NwkResolution != nil {
		*params = append(*params, "-nwkResolution", strconv.Itoa(*s.NwkResolution))
	}
}

func (l *Launcher) appendReforgerMiscParams(params *[]string, s *ReforgerServer) {
	if s.LogStats {
		if s.LogStatsIntervalMs != nil && *s.LogStatsIntervalMs > 0 {
			// Reforger supports -logStats <ms> for interval
			*params = append(*params, "-logStats", strconv.Itoa(*s.LogStatsIntervalMs))
		} else {
			*params = append(*params, "-logStats")
		}
	}

	if s.DisableAI {
		*params = append(*params, "-disableAI")
	}

	if s.AILimit > 0 || s.AILimit == -1 {
		*params = append(*params, "-aiLimit", strconv.Itoa(s.AILimit))
	}

	if s.AddonsVerify {
		*params = append(*params, "-addonsVerify")
	}

	if s.AddonsRepair {
		*params = append(*params, "-addonsRepair")
	}

	if s.NoThrow {
		*params = append(*params, "-nothrow")
	}
}

func (l *Launcher) addCustomLaunchParameters(params *[]string, custom []LaunchParameter, spaceSeparated bool) {
	for _, p := range custom {
		name := "-" + p.Name
		if spaceSeparated {
			*params = append(*params, name)
			if p.Value != nil {
				*params = append(*params, *p.Value)
			}
		} else {
			s := name
			if p.Value != nil {
				s += "=" + *p.Value
			}

			*params = append(*params, s)
		}
	}
}
