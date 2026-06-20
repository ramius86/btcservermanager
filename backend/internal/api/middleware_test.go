package api

import (
	"btcservermanager/internal/config"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/lestrrat-go/jwx/v2/jwk"
)

func TestSecurityHeaders(t *testing.T) {
	t.Parallel()
	cfg := &config.Config{
		CSPEnabled:    true,
		CSPMode:       "block",
		AllowedOrigin: "https://manager.blacktemplars.it\r", // Test with hidden carriage return
	}

	router := &Router{config: cfg}

	handler := router.securityHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	csp := w.Header().Get("Content-Security-Policy")

	// Verify domain was trimmed
	if strings.Contains(csp, "\r") {
		t.Errorf("CSP header contains untrimmed carriage return: %q", csp)
	}

	// Verify explicit domain presence in connect-src
	expected := "connect-src 'self' https://manager.blacktemplars.it wss://manager.blacktemplars.it"
	if !strings.Contains(csp, expected) {
		t.Errorf("CSP missing expected connect-src directive. Got: %q", csp)
	}

	// Test Report-Only mode: securityHeaders() pre-computes the CSP at
	// registration time, so a new handler must be created with the new config.
	cfgRO := &config.Config{
		CSPEnabled:    true,
		CSPMode:       "report-only",
		AllowedOrigin: "https://manager.blacktemplars.it",
	}
	routerRO := &Router{config: cfgRO}
	handlerRO := routerRO.securityHeaders(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	wRO := httptest.NewRecorder()
	handlerRO.ServeHTTP(wRO, req)

	if wRO.Header().Get("Content-Security-Policy-Report-Only") == "" {
		t.Error("Expected Content-Security-Policy-Report-Only header, got none")
	}
}

func TestCorsHandler_Sanitization(t *testing.T) {
	t.Parallel()
	origin := "https://manager.blacktemplars.it\n"
	middleware := CorsHandler(origin)

	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler := middleware(dummyHandler)

	req := httptest.NewRequest("OPTIONS", "/api/server", nil)
	req.Header.Set("Origin", "https://manager.blacktemplars.it")
	req.Header.Set("Access-Control-Request-Method", "GET")

	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	allowedOrigin := w.Header().Get("Access-Control-Allow-Origin")
	if allowedOrigin != "https://manager.blacktemplars.it" {
		t.Errorf("Expected sanitized origin 'https://manager.blacktemplars.it', got %q", allowedOrigin)
	}
}

func TestCFAccessValidatorCookieFallback(t *testing.T) {
	v := &cfAccessValidator{
		teamDomain: "https://my-team.cloudflareaccess.com",
		debugMode:  false,
		keySet:     jwk.NewSet(), // Empty keyset so validation will fail with 403 Forbidden instead of 401 Unauthorized
	}

	handler := v.middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	// Case 1: No header, no cookie -> Should return 401 Unauthorized
	req1 := httptest.NewRequest("GET", "/api/settings", nil)
	w1 := httptest.NewRecorder()
	handler.ServeHTTP(w1, req1)
	if w1.Code != http.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized, got %d", w1.Code)
	}

	// Case 2: No header, but token in cookie -> Should bypass 401 and fail validation (403 Forbidden)
	req2 := httptest.NewRequest("GET", "/api/settings", nil)
	req2.AddCookie(&http.Cookie{
		Name:  "CF_Authorization",
		Value: "some-dummy-token",
	})
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req2)
	if w2.Code != http.StatusForbidden {
		t.Errorf("Expected 403 Forbidden (since token was extracted from cookie but invalid), got %d", w2.Code)
	}
}
