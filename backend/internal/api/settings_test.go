package api

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// An absent qualificationNames used to decode into an empty slice, and an empty
// slice makes CleanupOrphanedQualifications delete every member qualification.
// A partial payload must therefore be rejected instead of erasing data.
func TestUpdateAppSettingsRejectsPayloadWithoutQualificationNames(t *testing.T) {
	router := &Router{}

	req := httptest.NewRequest(http.MethodPut, "/api/settings", strings.NewReader(`{"logRetentionDays":45}`))
	rec := httptest.NewRecorder()

	router.handleUpdateAppSettings(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d (%s)", rec.Code, rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), "qualificationNames") {
		t.Fatalf("error should name the missing field, got %q", rec.Body.String())
	}
}

func TestUpdateAppSettingsRejectsInvalidJSON(t *testing.T) {
	router := &Router{}

	req := httptest.NewRequest(http.MethodPut, "/api/settings", strings.NewReader(`{"qualificationNames":`))
	rec := httptest.NewRecorder()

	router.handleUpdateAppSettings(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d (%s)", rec.Code, rec.Body.String())
	}
}

func TestUpdateAppSettingsRejectsNullBody(t *testing.T) {
	router := &Router{}

	req := httptest.NewRequest(http.MethodPut, "/api/settings", strings.NewReader("null"))
	rec := httptest.NewRecorder()

	router.handleUpdateAppSettings(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d (%s)", rec.Code, rec.Body.String())
	}
}
