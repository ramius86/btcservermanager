package installation

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
)

var buildIdInAcfRegex = regexp.MustCompile(`"buildid"\s+"(\d+)"`)

func ReadBuildIDFromManifest(serverPath string, appId int64) string {
	// Manifest is usually in steamapps/appmanifest_<appid>.acf
	manifestPath := filepath.Join(serverPath, "steamapps", fmt.Sprintf("appmanifest_%d.acf", appId))

	// If not there, try root (some SteamCMD configs put it there)
	if _, err := os.Stat(manifestPath); err != nil {
		manifestPath = filepath.Join(serverPath, fmt.Sprintf("appmanifest_%d.acf", appId))
	}

	// If the file doesn't exist in either place, return quietly without error logs
	if _, err := os.Stat(manifestPath); err != nil {
		return ""
	}

	log.Printf("[BuildID] checking manifest at: %s", manifestPath)

	content, err := os.ReadFile(manifestPath)
	if err != nil {
		log.Printf("[BuildID] failed to read manifest: %v", err)
		return ""
	}

	matches := buildIdInAcfRegex.FindSubmatch(content)
	if len(matches) >= 2 {
		buildID := string(matches[1])
		log.Printf("[BuildID] found buildid: %s", buildID)
		return buildID
	}

	log.Printf("[BuildID] no buildid found in manifest content")

	return ""
}
