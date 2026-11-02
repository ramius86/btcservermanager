package api

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestUpdateReforgerCustomNamesRejectsOversizedBody(t *testing.T) {
	// The router has no services on purpose: the body limit has to be enforced
	// before the server lookup, so an oversized payload is rejected even when
	// the ID is wrong or the service is unavailable.
	router := &Router{}

	body := strings.NewReader(strings.Repeat("a", maxCustomNamesPayloadSize+1024))
	req := httptest.NewRequest(http.MethodPut, "/api/server/1/custom-names", body)

	routeCtx := chi.NewRouteContext()
	routeCtx.URLParams.Add("id", "1")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, routeCtx))

	rec := httptest.NewRecorder()
	router.handleUpdateReforgerCustomNames(rec, req)

	if rec.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("expected 413, got %d (%s)", rec.Code, rec.Body.String())
	}
}
