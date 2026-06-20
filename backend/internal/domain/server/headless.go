package server

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type HeadlessClient struct {
	ID      int
	Server  *Arma3Server
	Paths   PathProvider
	Process *exec.Cmd
	StopCh  chan struct{}
}

func NewHeadlessClient(id int, server *Arma3Server, paths PathProvider) *HeadlessClient {
	return &HeadlessClient{
		ID:     id,
		Server: server,
		Paths:  paths,
	}
}

func (hc *HeadlessClient) Start(additionalMods []string) error {
	executable := hc.Paths.GetServerExecutable(TypeArma3)
	logFile := hc.Paths.GetHeadlessClientLogFile(hc.Server.ID, hc.ID)

	params := hc.prepareParameters(additionalMods)
	log.Printf("Starting headless client with options: %v", params)

	cmd := exec.Command(executable, params...)
	cmd.Dir = hc.Paths.GetServerPath(TypeArma3)

	f, err := os.OpenFile(logFile, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return fmt.Errorf("failed to open HC log file: %w", err)
	}

	cmd.Stdout = f
	cmd.Stderr = f

	if err := cmd.Start(); err != nil {
		f.Close()
		return fmt.Errorf("failed to start HC process: %w", err)
	}

	hc.Process = cmd
	hc.StopCh = make(chan struct{})

	go func() {
		_ = cmd.Wait()

		f.Close()
		close(hc.StopCh)
	}()

	return nil
}

func (hc *HeadlessClient) Stop() error {
	if hc.IsAlive() {
		return hc.Process.Process.Kill()
	}

	return nil
}

func (hc *HeadlessClient) IsAlive() bool {
	isStarted := hc.Process != nil && hc.Process.Process != nil
	isRunning := isStarted && hc.Process.ProcessState == nil
	return isRunning
}

func (hc *HeadlessClient) prepareParameters(additionalMods []string) []string {
	params := []string{
		"-client",
		"-connect=127.0.0.1:" + strconv.Itoa(hc.Server.Port),
	}
	if hc.Server.Password != "" {
		params = append(params, "-password="+hc.Server.Password)
	}

	mods := []string{}
	// Regular mods
	for _, mod := range hc.Server.ModNames {
		if !mod.ServerOnly {
			mods = append(mods, mod.Name)
		}
	}
	// DLCs
	mods = append(mods, hc.Server.ActiveDLCs...)
	// Additional mods from launcher
	mods = append(mods, additionalMods...)

	if len(mods) > 0 {
		params = append(params, "-mod="+strings.Join(mods, ";"))
	}

	return params
}
