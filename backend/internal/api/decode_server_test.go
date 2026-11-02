package api

import (
	"btcservermanager/internal/domain/server"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDecodeServerRejectsUnknownFields(t *testing.T) {
	router := &Router{}

	// "maxPlayerss" is a typo: accepting it silently would reset maxPlayers.
	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"type":"ARMA3","name":"Test","maxPlayerss":40}`))

	if _, err := router.decodeServer(req); err == nil {
		t.Fatal("expected an unknown field to be rejected")
	}
}

func TestDecodeServerAcceptsKnownFields(t *testing.T) {
	router := &Router{}

	req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(`{"type":"ARMA3","name":"Test"}`))

	srv, err := router.decodeServer(req)
	if err != nil {
		t.Fatalf("valid payload rejected: %v", err)
	}

	a3, ok := srv.(*server.Arma3Server)
	if !ok {
		t.Fatalf("expected *server.Arma3Server, got %T", srv)
	}
	if a3.Name != "Test" {
		t.Fatalf("expected name %q, got %q", "Test", a3.Name)
	}
}
