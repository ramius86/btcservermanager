package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequireSameSiteMutations(t *testing.T) {
	allowed := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	handler := requireSameSiteMutations(allowed)

	tests := []struct {
		name   string
		method string
		site   string
		want   int
	}{
		{"cross-site POST is rejected", http.MethodPost, "cross-site", http.StatusForbidden},
		{"cross-site PUT is rejected", http.MethodPut, "cross-site", http.StatusForbidden},
		{"cross-site PATCH is rejected", http.MethodPatch, "cross-site", http.StatusForbidden},
		{"cross-site DELETE is rejected", http.MethodDelete, "cross-site", http.StatusForbidden},
		{"same-origin POST is allowed", http.MethodPost, "same-origin", http.StatusNoContent},
		{"same-site POST is allowed", http.MethodPost, "same-site", http.StatusNoContent},
		{"user-initiated POST is allowed", http.MethodPost, "none", http.StatusNoContent},
		{"missing header is allowed", http.MethodPost, "", http.StatusNoContent},
		{"cross-site GET is allowed", http.MethodGet, "cross-site", http.StatusNoContent},
		{"cross-site preflight is allowed", http.MethodOptions, "cross-site", http.StatusNoContent},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/api/settings", nil)
			if tt.site != "" {
				req.Header.Set("Sec-Fetch-Site", tt.site)
			}
			rr := httptest.NewRecorder()

			handler.ServeHTTP(rr, req)

			if rr.Code != tt.want {
				t.Errorf("expected %d, got %d", tt.want, rr.Code)
			}
		})
	}
}
