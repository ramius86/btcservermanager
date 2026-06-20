package scenario

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

type cloudflarePurgeRequest struct {
	Files []string `json:"files"`
}

func (s *Service) PurgeCloudflareCache(filename string) error {
	if s.config.CFZoneID == "" || s.config.CFAPIToken == "" || s.config.FastDLDomain == "" {
		return nil // Not configured, silently skip
	}

	urlToPurge := fmt.Sprintf("https://%s/%s", s.config.FastDLDomain, filename)

	reqBody := cloudflarePurgeRequest{
		Files: []string{urlToPurge},
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal cloudflare purge request: %w", err)
	}

	apiURL := fmt.Sprintf("https://api.cloudflare.com/client/v4/zones/%s/purge_cache", s.config.CFZoneID)

	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, apiURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("failed to create cloudflare purge request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.config.CFAPIToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("cloudflare API request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("cloudflare API returned non-200 status: %d, body: %s", resp.StatusCode, string(body))
	}

	// Drain success body so the connection returns to the pool.
	_, _ = io.Copy(io.Discard, resp.Body)

	log.Printf("[Cloudflare] Successfully purged cache for %s", urlToPurge)
	return nil
}

func (s *Service) PreCacheScenario(filename string) {
	if s.config.FastDLDomain == "" {
		return // Not configured
	}

	urlToPreCache := fmt.Sprintf("https://%s/%s", s.config.FastDLDomain, filename)

	// Run in background to avoid blocking
	go func(targetURL string) {
		log.Printf("[Cloudflare] Starting pre-cache for %s", targetURL)

		// Give it a small delay just in case the file system hasn't flushed or the tunnel needs a moment
		time.Sleep(1 * time.Second)

		// Use a background context: the request context is already done by the time this goroutine runs.
		req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, targetURL, nil)
		if err != nil {
			log.Printf("[Cloudflare] Failed to create pre-cache request: %v", err)
			return
		}

		resp, err := s.httpClient.Do(req)
		if err != nil {
			log.Printf("[Cloudflare] Pre-cache request failed: %v", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			// Read the entire body and discard it to ensure the file is pulled through Cloudflare CDN
			_, err := io.Copy(io.Discard, resp.Body)
			if err != nil {
				log.Printf("[Cloudflare] Pre-cache interrupted while reading: %v", err)
			} else {
				log.Printf("[Cloudflare] Pre-cache completed successfully for %s", targetURL)
			}
		} else {
			// Drain on non-200 too so the connection returns to the pool.
			_, _ = io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
			log.Printf("[Cloudflare] Pre-cache received non-200 status: %d", resp.StatusCode)
		}
	}(urlToPreCache)
}
