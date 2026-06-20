package steamauth

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type QRAuthService struct {
	repo       *Repository
	httpClient *http.Client
}

func NewQRAuthService(repo *Repository) *QRAuthService {
	return &QRAuthService{
		repo:       repo,
		httpClient: &http.Client{Timeout: 15 * time.Second},
	}
}

type BeginQRResponse struct {
	Response struct {
		ClientID     uint64  `json:"client_id,string"`
		ChallengeURL string  `json:"challenge_url"`
		RequestID    string  `json:"request_id"`
		Interval     float64 `json:"interval"`
	} `json:"response"`
}

type PollQRResponse struct {
	Response struct {
		RefreshToken string `json:"refresh_token"`
		AccessToken  string `json:"access_token"`
		AccountName  string `json:"account_name"`
		Error        string `json:"error"`
	} `json:"response"`
}

func (s *QRAuthService) BeginSession(ctx context.Context) (*BeginQRResponse, error) {
	// EAuthTokenPlatformType: 2 (WebBrowser) or 1 (SteamClient)
	// We use 2 as it's common for web-based auth
	input := map[string]any{
		"device_friendly_name": "BTC Server Manager",
		"platform_type":        2,
		"device_details": map[string]any{
			"device_platform": 2,
		},
	}

	inputJSON, _ := json.Marshal(input)

	formData := url.Values{}
	formData.Set("input_json", string(inputJSON))

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaQR/v1/", strings.NewReader(formData.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result BeginQRResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (s *QRAuthService) PollStatus(ctx context.Context, clientID, requestID string) (*PollQRResponse, error) {
	input := map[string]any{
		"client_id":  clientID,
		"request_id": requestID,
	}

	inputJSON, _ := json.Marshal(input)

	formData := url.Values{}
	formData.Set("input_json", string(inputJSON))

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/", strings.NewReader(formData.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result PollQRResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if result.Response.RefreshToken != "" {
		log.Printf("Steam QR Login SUCCESS for account: %s", result.Response.AccountName)
		// Finalize login by saving to repo
		auth := &SteamAuth{
			RefreshToken: result.Response.RefreshToken,
			AccountName:  result.Response.AccountName,
			Username:     result.Response.AccountName,
		}
		if err := s.repo.Save(ctx, auth); err != nil {
			log.Printf("Failed to save QR auth to repo: %v", err)
			return nil, err
		}
	} else if result.Response.Error != "" && result.Response.Error != "pending" {
		log.Printf("Steam QR Login POLL ERROR: %s", result.Response.Error)
	}

	return &result, nil
}
