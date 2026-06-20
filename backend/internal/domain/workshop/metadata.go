package workshop

import (
	"btcservermanager/internal/domain/server"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

type MetadataFetcher struct {
	apiKey string
	client *http.Client
}

func NewMetadataFetcher(apiKey string) *MetadataFetcher {
	return &MetadataFetcher{
		apiKey: apiKey,
		client: &http.Client{Timeout: 10 * time.Second},
	}
}

type SteamAPIResponse struct {
	Response struct {
		PublishedFileDetails []map[string]any `json:"publishedfiledetails"`
		Total                int              `json:"total"`
	} `json:"response"`
}

func (f *MetadataFetcher) FetchMetadata(ctx context.Context, modID int64) (*WorkshopMod, error) {
	if modID == 0 {
		return nil, errors.New("invalid mod ID 0")
	}

	url := fmt.Sprintf("https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=%s&itemcount=1&publishedfileids[0]=%d", f.apiKey, modID)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := f.client.Do(req)
	if err != nil {
		fmt.Printf("[Metadata] HTTP error for mod %d: %v\n", modID, err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("[Metadata] Steam API returned status %d for mod %d\n", resp.StatusCode, modID)
		return nil, fmt.Errorf("steam API returned status %d", resp.StatusCode)
	}

	var apiResp SteamAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		fmt.Printf("[Metadata] JSON decode error for mod %d: %v\n", modID, err)
		return nil, err
	}

	if len(apiResp.Response.PublishedFileDetails) == 0 {
		fmt.Printf("[Metadata] No details returned by Steam for mod %d\n", modID)
		return nil, fmt.Errorf("no details found for mod %d", modID)
	}

	return f.mapToWorkshopMod(apiResp.Response.PublishedFileDetails[0]), nil
}

func (f *MetadataFetcher) SearchSteamMods(ctx context.Context, query string, appId int64, page int) ([]*WorkshopMod, int, error) {
	if id, err := strconv.ParseInt(query, 10, 64); err == nil && id > 100000 {
		mod, err := f.FetchMetadata(ctx, id)
		if err == nil {
			return []*WorkshopMod{mod}, 1, nil
		}
	}

	url := fmt.Sprintf("https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=%s&appid=%d&search_text=%s&return_metadata=1&return_short_description=1&query_type=0&page=%d&numperpage=50",
		f.apiKey, appId, query, page)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, 0, err
	}

	resp, err := f.client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()

	var apiResp SteamAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, 0, err
	}

	mods := []*WorkshopMod{}
	for _, details := range apiResp.Response.PublishedFileDetails {
		mods = append(mods, f.mapToWorkshopMod(details))
	}

	return mods, apiResp.Response.Total, nil
}

func (f *MetadataFetcher) mapToWorkshopMod(details map[string]any) *WorkshopMod {
	modID := parseSteamInt(details["publishedfileid"])

	// Try multiple possible field names for AppID (Steam API is inconsistent)
	consumerAppID := parseSteamInt(details["consumer_appid"])
	if consumerAppID == 0 {
		consumerAppID = parseSteamInt(details["consumer_app_id"])
	}
	if consumerAppID == 0 {
		consumerAppID = parseSteamInt(details["creator_appid"])
	}
	if consumerAppID == 0 {
		consumerAppID = parseSteamInt(details["creator_app_id"])
	}
	if consumerAppID == 0 {
		consumerAppID = parseSteamInt(details["appid"])
	}

	fileSize := parseSteamInt(details["file_size"])
	timeUpdated := parseSteamInt(details["time_updated"])
	title, _ := details["title"].(string)
	thumbnail, _ := details["preview_url"].(string)

	updated := time.Unix(timeUpdated, 0)
	serverType := server.Type("")

	switch consumerAppID {
	case 107410, 233780:
		serverType = server.TypeArma3
	case 221100, 223350:
		serverType = server.TypeDayZ
	case 1024020, 1042420:
		serverType = server.TypeDayZExp
	case 1874900:
		serverType = server.TypeReforger
	}

	return &WorkshopMod{
		ID:          modID,
		Name:        title,
		Thumbnail:   thumbnail,
		FileSize:    fileSize,
		LastUpdated: &updated,
		ServerType:  serverType,
	}
}

func parseSteamInt(val any) int64 {
	switch v := val.(type) {
	case float64:
		return int64(v)
	case string:
		i, err := strconv.ParseInt(v, 10, 64)
		if err != nil && v != "" {
			log.Printf("Warning: failed to parse steam int from string %q: %v", v, err)
		}
		return i
	case int64:
		return v
	case int:
		return int64(v)
	default:
		return 0
	}
}
