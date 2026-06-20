package scenario

import (
	"btcservermanager/internal/config"
	"bytes"
	"io"
	"net/http"
	"testing"
	"time"
)

type mockRoundTripper func(req *http.Request) (*http.Response, error)

func (m mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m(req)
}

func TestPurgeCloudflareCache_NotConfigured(t *testing.T) {
	cfg := &config.Config{}
	svc := NewService(nil, nil, cfg)

	err := svc.PurgeCloudflareCache("test.pbo")
	if err != nil {
		t.Errorf("expected no error when not configured, got %v", err)
	}
}

func TestPurgeCloudflareCache_Success(t *testing.T) {
	cfg := &config.Config{
		CFZoneID:     "test-zone-id",
		CFAPIToken:   "test-token",
		FastDLDomain: "fastdl.example.com",
	}
	svc := NewService(nil, nil, cfg)

	svc.httpClient = &http.Client{
		Transport: mockRoundTripper(func(req *http.Request) (*http.Response, error) {
			if req.URL.String() != "https://api.cloudflare.com/client/v4/zones/test-zone-id/purge_cache" {
				t.Errorf("unexpected URL: %s", req.URL.String())
			}
			if req.Header.Get("Authorization") != "Bearer test-token" {
				t.Errorf("unexpected authorization header: %s", req.Header.Get("Authorization"))
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Body:       io.NopCloser(bytes.NewBufferString(`{"success":true}`)),
			}, nil
		}),
	}

	err := svc.PurgeCloudflareCache("test.pbo")
	if err != nil {
		t.Errorf("expected success, got error: %v", err)
	}
}

func TestPurgeCloudflareCache_Failure(t *testing.T) {
	cfg := &config.Config{
		CFZoneID:     "test-zone-id",
		CFAPIToken:   "test-token",
		FastDLDomain: "fastdl.example.com",
	}
	svc := NewService(nil, nil, cfg)

	svc.httpClient = &http.Client{
		Transport: mockRoundTripper(func(req *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusInternalServerError,
				Body:       io.NopCloser(bytes.NewBufferString(`{"error":"bad request"}`)),
			}, nil
		}),
	}

	err := svc.PurgeCloudflareCache("test.pbo")
	if err == nil {
		t.Error("expected error, got nil")
	}
}

func TestPreCacheScenario_NotConfigured(t *testing.T) {
	cfg := &config.Config{}
	svc := NewService(nil, nil, cfg)

	// Should return immediately without panic/error
	svc.PreCacheScenario("test.pbo")
}

func TestPreCacheScenario_Success(t *testing.T) {
	cfg := &config.Config{
		FastDLDomain: "fastdl.example.com",
	}
	svc := NewService(nil, nil, cfg)

	called := make(chan struct{})

	svc.httpClient = &http.Client{
		Transport: mockRoundTripper(func(req *http.Request) (*http.Response, error) {
			if req.URL.String() != "https://fastdl.example.com/test.pbo" {
				t.Errorf("unexpected URL: %s", req.URL.String())
			}
			close(called)
			return &http.Response{
				StatusCode: http.StatusOK,
				Body:       io.NopCloser(bytes.NewBufferString(`file data`)),
			}, nil
		}),
	}

	svc.PreCacheScenario("test.pbo")

	select {
	case <-called:
		// Success!
	case <-time.After(2 * time.Second):
		t.Fatal("timed out waiting for pre-cache request")
	}
}
