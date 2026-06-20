package workshop

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var (
	nextDataRegex = regexp.MustCompile(`(?s)<script id="__NEXT_DATA__"[^>]*>(.*?)</script>`)
	titleRegex    = regexp.MustCompile(`(?i)<h1[^>]*>(.*?)</h1>`)
)

const (
	userAgentHeader = "User-Agent"
	userAgentValue  = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	errCreateReq    = "failed to create request: %w"
	errReadRespBody = "failed to read response body: %w"
)

type ReforgerWorkshopMod struct {
	ID        string `json:"id"`
	Slug      string `json:"slug"`
	Name      string `json:"name"`
	Author    string `json:"author"`
	Thumbnail string `json:"thumbnail"`
}

type ReforgerModDetails struct {
	ReforgerWorkshopMod
	Description string `json:"description"`
	Summary     string `json:"summary"`
	Version     string `json:"version"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

type ReforgerScraper struct {
	client  *http.Client
	baseURL string
}

func NewReforgerScraper() *ReforgerScraper {
	return &ReforgerScraper{
		client:  &http.Client{Timeout: 15 * time.Second},
		baseURL: "https://reforger.armaplatform.com",
	}
}

func (s *ReforgerScraper) Search(ctx context.Context, query string, page int) ([]ReforgerWorkshopMod, error) {
	// 1. Initial attempt with full query
	results, err := s.doSearch(ctx, query, page)

	// 2. Fallback strategy for multi-word queries (e.g., "dev RHS" or "RHS dev")
	// If initial search yields few/no results and it's a multi-word query,
	// search for the most specific word (longest) and filter locally.
	words := strings.Fields(query)
	shouldUseFallback := (err != nil || len(results) < 5) && len(words) > 1
	if shouldUseFallback {
		longestWord := findLongestWord(words)

		if len(longestWord) >= 3 {
			fallbackResults, fbErr := s.doSearch(ctx, longestWord, 1)
			if fbErr == nil && len(fallbackResults) > 0 {
				filtered := filterFallbackResults(fallbackResults, words)
				results = mergeResults(results, filtered)
			}
		}
	}

	return results, err
}

func findLongestWord(words []string) string {
	var longestWord string
	for _, w := range words {
		if len(w) > len(longestWord) {
			longestWord = w
		}
	}
	return longestWord
}

func filterFallbackResults(fallbackResults []ReforgerWorkshopMod, words []string) []ReforgerWorkshopMod {
	filtered := []ReforgerWorkshopMod{}
	for _, res := range fallbackResults {
		nameLower := strings.ToLower(res.Name)
		allMatch := true

		for _, w := range words {
			if !strings.Contains(nameLower, strings.ToLower(w)) {
				allMatch = false
				break
			}
		}

		if allMatch {
			filtered = append(filtered, res)
		}
	}
	return filtered
}

func mergeResults(results, filtered []ReforgerWorkshopMod) []ReforgerWorkshopMod {
	seen := make(map[string]bool)
	for _, r := range results {
		seen[r.ID] = true
	}

	for _, r := range filtered {
		if !seen[r.ID] {
			results = append(results, r)
			seen[r.ID] = true
		}
	}
	return results
}

func (s *ReforgerScraper) doSearch(ctx context.Context, query string, page int) ([]ReforgerWorkshopMod, error) {
	searchUrl := fmt.Sprintf("%s/workshop?search=%s&page=%d", s.baseURL, url.QueryEscape(query), page)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, searchUrl, nil)
	if err != nil {
		return nil, fmt.Errorf(errCreateReq, err)
	}
	req.Header.Set(userAgentHeader, userAgentValue)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf(errReadRespBody, err)
	}

	matches := nextDataRegex.FindSubmatch(body)

	if len(matches) < 2 {
		return nil, errors.New("could not find next_data script tag")
	}

	data := map[string]any{}
	if err := json.Unmarshal(matches[1], &data); err != nil {
		return nil, fmt.Errorf("failed to parse next_data JSON: %w", err)
	}

	rows := s.findRows(data)
	if rows == nil {
		return nil, nil // No results is not an error
	}

	results := []ReforgerWorkshopMod{}

	for _, row := range rows {
		if mod, ok := s.parseSearchResultRow(row); ok {
			results = append(results, mod)
		}
	}

	return results, nil
}

func (s *ReforgerScraper) parseSearchResultRow(row any) (ReforgerWorkshopMod, bool) {
	mod, ok := row.(map[string]any)
	if !ok {
		return ReforgerWorkshopMod{}, false
	}

	id, _ := mod["id"].(string)
	slug, _ := mod["slug"].(string)
	name, _ := mod["name"].(string)

	if id == "" || name == "" {
		return ReforgerWorkshopMod{}, false
	}

	var author string
	if a, ok := mod["author"].(map[string]any); ok {
		author, _ = a["username"].(string)
	}

	thumbnail := s.extractThumbnail(mod)

	return ReforgerWorkshopMod{
		ID:        id,
		Slug:      slug,
		Name:      name,
		Author:    author,
		Thumbnail: thumbnail,
	}, true
}

func (s *ReforgerScraper) extractThumbnail(mod map[string]any) string {
	var thumbnail string

	previews, ok := mod["previews"].([]any)
	if !ok || len(previews) == 0 {
		return ""
	}

	p, ok := previews[0].(map[string]any)
	if !ok {
		return ""
	}

	if thumbNodes, ok := p["thumbnails"].(map[string]any); ok {
		if jpegs, ok := thumbNodes["image/jpeg"].([]any); ok && len(jpegs) > 0 {
			last, ok := jpegs[len(jpegs)-1].(map[string]any)
			if ok {
				thumbnail, _ = last["url"].(string)
			}
		}
	}

	if thumbnail == "" {
		thumbnail, _ = p["url"].(string)
	}

	if thumbnail != "" && !strings.HasPrefix(thumbnail, "http") {
		if !strings.HasPrefix(thumbnail, "/") {
			thumbnail = "/" + thumbnail
		}

		thumbnail = s.baseURL + thumbnail
	}

	return thumbnail
}

func (s *ReforgerScraper) FetchDetails(ctx context.Context, modIDWithSlug string) (*ReforgerModDetails, error) {
	url := s.baseURL + "/workshop/" + modIDWithSlug

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf(errCreateReq, err)
	}
	req.Header.Set(userAgentHeader, userAgentValue)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// If we get a 404 and it looks like a hex ID without a slug, try to resolve it via search
	isNotFoundHexID := resp.StatusCode == http.StatusNotFound && len(modIDWithSlug) == 16 && !strings.Contains(modIDWithSlug, "-")
	if isNotFoundHexID {
		resolvedID, err := s.resolveHexID(ctx, modIDWithSlug)
		if err == nil && resolvedID != modIDWithSlug {
			return s.FetchDetails(ctx, resolvedID)
		}
	}

	if resp.StatusCode != http.StatusOK {
		// Drain body so the underlying TCP connection can be reused by the pool.
		_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("reforger workshop returned status: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf(errReadRespBody, err)
	}

	matches := nextDataRegex.FindSubmatch(body)

	if len(matches) < 2 {
		return nil, errors.New("could not find next_data script tag")
	}

	data := map[string]any{}
	if err := json.Unmarshal(matches[1], &data); err != nil {
		return nil, fmt.Errorf("failed to parse next_data JSON: %w", err)
	}

	asset := s.findAsset(data)
	if asset == nil {
		return nil, errors.New("could not find asset details in next_data")
	}

	return s.parseAssetDetails(asset), nil
}

func (s *ReforgerScraper) resolveHexID(ctx context.Context, hexID string) (string, error) {
	results, err := s.doSearch(ctx, hexID, 1)
	if err != nil || len(results) == 0 {
		return hexID, err
	}
	resolvedID := results[0].ID
	if results[0].Slug != "" {
		resolvedID = fmt.Sprintf("%s-%s", results[0].ID, results[0].Slug)
	}
	return resolvedID, nil
}

func (s *ReforgerScraper) parseAssetDetails(asset map[string]any) *ReforgerModDetails {
	id, _ := asset["id"].(string)
	name, _ := asset["name"].(string)
	description, _ := asset["description"].(string)
	summary, _ := asset["summary"].(string)
	version, _ := asset["currentVersionNumber"].(string)
	createdAt, _ := asset["createdAt"].(string)
	updatedAt, _ := asset["updatedAt"].(string)

	var author string
	if a, ok := asset["author"].(map[string]any); ok {
		author, _ = a["username"].(string)
	}

	thumbnail := s.extractThumbnail(asset)

	return &ReforgerModDetails{
		ReforgerWorkshopMod: ReforgerWorkshopMod{
			ID:        id,
			Name:      name,
			Author:    author,
			Thumbnail: thumbnail,
		},
		Description: description,
		Summary:     summary,
		Version:     version,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}
}

func (s *ReforgerScraper) findAsset(data any) map[string]any {
	m, ok := data.(map[string]any)
	if !ok {
		return nil
	}

	if asset, ok := getNestedAsset(m); ok {
		return asset
	}

	// Fallback to recursive search
	for _, v := range m {
		if res := s.findAsset(v); res != nil {
			return res
		}
	}

	if arr, ok := data.([]any); ok {
		for _, v := range arr {
			if res := s.findAsset(v); res != nil {
				return res
			}
		}
	}

	return nil
}

func getNestedAsset(m map[string]any) (map[string]any, bool) {
	props, ok := m["props"].(map[string]any)
	if !ok {
		return nil, false
	}
	pageProps, ok := props["pageProps"].(map[string]any)
	if !ok {
		return nil, false
	}
	asset, ok := pageProps["asset"].(map[string]any)
	return asset, ok
}

func (s *ReforgerScraper) findRows(data any) []any {
	m, ok := data.(map[string]any)
	if !ok {
		return nil
	}

	if rows, ok := getNestedRows(m); ok {
		return rows
	}

	if rows, ok := checkRowsFallback(m); ok {
		return rows
	}

	for _, v := range m {
		if res := s.findRows(v); res != nil {
			return res
		}
	}

	if arr, ok := data.([]any); ok {
		for _, v := range arr {
			if res := s.findRows(v); res != nil {
				return res
			}
		}
	}

	return nil
}

func getNestedRows(m map[string]any) ([]any, bool) {
	props, ok := m["props"].(map[string]any)
	if !ok {
		return nil, false
	}
	pageProps, ok := props["pageProps"].(map[string]any)
	if !ok {
		return nil, false
	}
	if assets, ok := pageProps["assets"].(map[string]any); ok {
		if rows, ok := assets["rows"].([]any); ok {
			return rows, true
		}
	}
	if assets, ok := pageProps["initialAssets"].(map[string]any); ok {
		if rows, ok := assets["rows"].([]any); ok {
			return rows, true
		}
	}
	return nil, false
}

func checkRowsFallback(m map[string]any) ([]any, bool) {
	rows, ok := m["rows"].([]any)
	if !ok || len(rows) == 0 {
		return nil, false
	}
	first, ok := rows[0].(map[string]any)
	if ok && first["id"] != nil && first["name"] != nil {
		return rows, true
	}
	return nil, false
}

type ScrapedScenario struct {
	ID         string `json:"scenarioId"`
	Name       string `json:"name"`
	GameMode   string `json:"gameMode"`
	MaxPlayers int    `json:"maxPlayers"`
}

type ScrapedModScenariosResponse struct {
	ModName   string            `json:"modName"`
	Scenarios []ScrapedScenario `json:"scenarios"`
}

func (s *ReforgerScraper) FetchScenarios(ctx context.Context, modIDWithSlug string) (*ScrapedModScenariosResponse, error) {
	url := s.baseURL + "/workshop/" + modIDWithSlug

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf(errCreateReq, err)
	}
	req.Header.Set(userAgentHeader, userAgentValue)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf(errReadRespBody, err)
	}
	bodyStr := string(body)

	var modName string

	titleMatches := titleRegex.FindStringSubmatch(bodyStr)
	if len(titleMatches) > 1 {
		modName = strings.TrimSpace(titleMatches[1])
	}

	// If we get a 404 and it looks like a hex ID without a slug, try to resolve it via search
	isNotFoundHexID := resp.StatusCode == http.StatusNotFound && len(modIDWithSlug) == 16 && !strings.Contains(modIDWithSlug, "-")
	if isNotFoundHexID {
		resolvedID, err := s.resolveHexID(ctx, modIDWithSlug)
		if err == nil && resolvedID != modIDWithSlug {
			return s.FetchScenarios(ctx, resolvedID)
		}
	}

	if resp.StatusCode != http.StatusOK {
		// Drain body so the underlying TCP connection can be reused by the pool.
		_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return &ScrapedModScenariosResponse{ModName: modName, Scenarios: []ScrapedScenario{}}, fmt.Errorf("reforger workshop returned status: %d", resp.StatusCode)
	}

	matches := nextDataRegex.FindSubmatch(body)
	if len(matches) < 2 {
		return &ScrapedModScenariosResponse{ModName: modName, Scenarios: []ScrapedScenario{}}, errors.New("could not find next_data")
	}

	data := map[string]any{}
	if err := json.Unmarshal(matches[1], &data); err != nil {
		return &ScrapedModScenariosResponse{ModName: modName, Scenarios: []ScrapedScenario{}}, err
	}

	scenariosNode := s.findScenarios(data)

	results := []ScrapedScenario{}

	for _, node := range scenariosNode {
		if scen, ok := parseScrapedScenario(node); ok {
			results = append(results, scen)
		}
	}

	return &ScrapedModScenariosResponse{
		ModName:   modName,
		Scenarios: results,
	}, nil
}

func parseScrapedScenario(node any) (ScrapedScenario, bool) {
	n, ok := node.(map[string]any)
	if !ok {
		return ScrapedScenario{}, false
	}

	var id string
	if val, ok := n["gameId"].(string); ok {
		id = val
	} else if val, ok := n["scenarioId"].(string); ok {
		id = val
	}

	var players int
	if val, ok := n["playerCount"]; ok {
		switch v := val.(type) {
		case float64:
			players = int(v)
		case string:
			if p, err := strconv.Atoi(v); err == nil {
				players = p
			}
		}
	}

	name, _ := n["name"].(string)
	gameMode, _ := n["gameMode"].(string)

	return ScrapedScenario{
		ID:         id,
		Name:       name,
		GameMode:   gameMode,
		MaxPlayers: players,
	}, true
}

func (s *ReforgerScraper) findScenarios(data any) []any {
	m, ok := data.(map[string]any)
	if !ok {
		return nil
	}

	if scenarios, ok := getNestedScenarios(m); ok {
		return scenarios
	}

	for _, v := range m {
		if arr, ok := v.([]any); ok {
			if checkScenarioNodeFallback(arr) {
				return arr
			}
		}

		if res := s.findScenarios(v); res != nil {
			return res
		}
	}

	return nil
}

func getNestedScenarios(m map[string]any) ([]any, bool) {
	props, ok := m["props"].(map[string]any)
	if !ok {
		return nil, false
	}
	pageProps, ok := props["pageProps"].(map[string]any)
	if !ok {
		return nil, false
	}
	if asset, ok := pageProps["asset"].(map[string]any); ok {
		if scenarios, ok := asset["scenarios"].([]any); ok {
			return scenarios, true
		}
	}
	if scenarios, ok := pageProps["scenarios"].([]any); ok {
		return scenarios, true
	}
	return nil, false
}

func checkScenarioNodeFallback(arr []any) bool {
	if len(arr) == 0 {
		return false
	}
	first, ok := arr[0].(map[string]any)
	return ok && (first["gameId"] != nil || first["scenarioId"] != nil)
}
