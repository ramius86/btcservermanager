package workshop

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"
)

type mockRoundTripper struct {
	roundTripFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.roundTripFunc(req)
}

func TestMetadataFetcher_FetchMetadata(t *testing.T) {
	t.Run("Success", func(t *testing.T) {
		fetcher := NewMetadataFetcher("dummy-key")
		fetcher.client.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				resp := &http.Response{
					StatusCode: http.StatusOK,
					Body: io.NopCloser(strings.NewReader(`{
						"response": {
							"publishedfiledetails": [
								{
									"publishedfileid": 12345,
									"consumer_appid": 107410,
									"file_size": 987654,
									"time_updated": 1609459200,
									"title": "Mock Steam Mod",
									"preview_url": "http://example.com/thumbnail.png"
								}
							],
							"total": 1
						}
					}`)),
					Header: make(http.Header),
				}
				resp.Header.Set("Content-Type", "application/json")
				return resp, nil
			},
		}

		mod, err := fetcher.FetchMetadata(context.Background(), 12345)
		if err != nil {
			t.Fatalf("FetchMetadata failed: %v", err)
		}

		if mod.ID != 12345 {
			t.Errorf("expected mod ID 12345, got %d", mod.ID)
		}
		if mod.Name != "Mock Steam Mod" {
			t.Errorf("expected name 'Mock Steam Mod', got %q", mod.Name)
		}
		if mod.FileSize != 987654 {
			t.Errorf("expected FileSize 987654, got %d", mod.FileSize)
		}
	})

	t.Run("Invalid ID", func(t *testing.T) {
		fetcher := NewMetadataFetcher("dummy-key")
		_, err := fetcher.FetchMetadata(context.Background(), 0)
		if err == nil {
			t.Error("expected error for mod ID 0")
		}
	})

	t.Run("HTTP Error", func(t *testing.T) {
		fetcher := NewMetadataFetcher("dummy-key")
		fetcher.client.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				resp := &http.Response{
					StatusCode: http.StatusInternalServerError,
					Body:       io.NopCloser(strings.NewReader("Internal Server Error")),
					Header:     make(http.Header),
				}
				return resp, nil
			},
		}

		_, err := fetcher.FetchMetadata(context.Background(), 12345)
		if err == nil {
			t.Error("expected error for 500 status code")
		}
	})
}

func TestMetadataFetcher_SearchSteamMods(t *testing.T) {
	t.Run("Success", func(t *testing.T) {
		fetcher := NewMetadataFetcher("dummy-key")
		fetcher.client.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				resp := &http.Response{
					StatusCode: http.StatusOK,
					Body: io.NopCloser(strings.NewReader(`{
						"response": {
							"publishedfiledetails": [
								{
									"publishedfileid": "54321",
									"consumer_appid": "221100",
									"file_size": "111",
									"time_updated": "1609459200",
									"title": "Search Result Mod"
								}
							],
							"total": 123
						}
					}`)),
					Header: make(http.Header),
				}
				resp.Header.Set("Content-Type", "application/json")
				return resp, nil
			},
		}

		mods, total, err := fetcher.SearchSteamMods(context.Background(), "search-query", 221100, 1)
		if err != nil {
			t.Fatalf("SearchSteamMods failed: %v", err)
		}

		if total != 123 {
			t.Errorf("expected total 123, got %d", total)
		}
		if len(mods) != 1 {
			t.Fatalf("expected 1 mod, got %d", len(mods))
		}
		if mods[0].ID != 54321 {
			t.Errorf("expected mod ID 54321, got %d", mods[0].ID)
		}
	})

	t.Run("By numeric ID", func(t *testing.T) {
		fetcher := NewMetadataFetcher("dummy-key")
		fetcher.client.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				resp := &http.Response{
					StatusCode: http.StatusOK,
					Body: io.NopCloser(strings.NewReader(`{
						"response": {
							"publishedfiledetails": [
								{
									"publishedfileid": 123456,
									"consumer_appid": 107410,
									"title": "Numeric Search ID Mod"
								}
							],
							"total": 1
						}
					}`)),
					Header: make(http.Header),
				}
				resp.Header.Set("Content-Type", "application/json")
				return resp, nil
			},
		}

		mods, total, err := fetcher.SearchSteamMods(context.Background(), "123456", 107410, 1)
		if err != nil {
			t.Fatalf("SearchSteamMods by numeric ID failed: %v", err)
		}
		if total != 1 {
			t.Errorf("expected total 1, got %d", total)
		}
		if len(mods) != 1 || mods[0].Name != "Numeric Search ID Mod" {
			t.Errorf("expected mod 'Numeric Search ID Mod', got %+v", mods)
		}
	})
}

func TestMetadataFetcher_ParseSteamInt(t *testing.T) {
	if parseSteamInt(float64(12.3)) != 12 {
		t.Errorf("failed parsing float64")
	}
	if parseSteamInt("123") != 123 {
		t.Errorf("failed parsing string")
	}
	if parseSteamInt(int64(456)) != 456 {
		t.Errorf("failed parsing int64")
	}
	if parseSteamInt(int(789)) != 789 {
		t.Errorf("failed parsing int")
	}
	if parseSteamInt(nil) != 0 {
		t.Errorf("failed parsing nil")
	}
}
