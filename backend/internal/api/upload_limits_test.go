package api

import (
	"bytes"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestIsBodyTooLarge(t *testing.T) {
	if isBodyTooLarge(nil) {
		t.Error("nil must not be reported as too large")
	}
	if isBodyTooLarge(errors.New("boom")) {
		t.Error("unrelated errors must not be reported as too large")
	}
	if !isBodyTooLarge(&http.MaxBytesError{Limit: 10}) {
		t.Error("MaxBytesError must be detected")
	}
	if !isBodyTooLarge(fmt.Errorf("parse multipart: %w", &http.MaxBytesError{Limit: 10})) {
		t.Error("wrapped MaxBytesError must be detected")
	}
}

// TestUploadLimit_RejectsOversizedMultipartBody exercises the same sequence the
// upload handlers use: MaxBytesReader plus ParseMultipartForm, mapped to 413.
func TestUploadLimit_RejectsOversizedMultipartBody(t *testing.T) {
	const limit = 512

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, limit)

		if err := r.ParseMultipartForm(multipartMemoryLimit); err != nil {
			if isBodyTooLarge(err) {
				w.WriteHeader(http.StatusRequestEntityTooLarge)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusOK)
	})

	tests := []struct {
		name     string
		payload  int
		wantCode int
	}{
		{name: "under limit", payload: 64, wantCode: http.StatusOK},
		{name: "over limit", payload: 4096, wantCode: http.StatusRequestEntityTooLarge},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body bytes.Buffer

			mw := multipart.NewWriter(&body)
			part, err := mw.CreateFormFile("file", "scenario.pbo")
			if err != nil {
				t.Fatalf("create form file: %v", err)
			}
			if _, err := part.Write(bytes.Repeat([]byte("A"), tt.payload)); err != nil {
				t.Fatalf("write payload: %v", err)
			}
			if err := mw.Close(); err != nil {
				t.Fatalf("close writer: %v", err)
			}

			req := httptest.NewRequest(http.MethodPost, "/upload", &body)
			req.Header.Set("Content-Type", mw.FormDataContentType())

			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)

			if rec.Code != tt.wantCode {
				t.Fatalf("expected %d, got %d (%s)", tt.wantCode, rec.Code, rec.Body.String())
			}
		})
	}
}
