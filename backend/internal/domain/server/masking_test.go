package server_test

import (
	"btcservermanager/internal/domain/server"
	"testing"
)

func TestMaskSensitive(t *testing.T) {
	s := &server.Arma3Server{
		Server: server.Server{
			Password:      "secret",
			AdminPassword: "admin",
		},
		ServerCommandPassword: "cmd",
	}

	server.MaskSensitive(s)

	if s.Password != "***" {
		t.Errorf("expected password to be masked, got %s", s.Password)
	}
	if s.AdminPassword != "***" {
		t.Errorf("expected adminPassword to be masked, got %s", s.AdminPassword)
	}
	if s.ServerCommandPassword != "***" {
		t.Errorf("expected serverCommandPassword to be masked, got %s", s.ServerCommandPassword)
	}
}

func TestMergeMaskedPasswords(t *testing.T) {
	oldSrv := &server.Arma3Server{
		Server: server.Server{
			Password:      "old_pass",
			AdminPassword: "old_admin",
		},
		ServerCommandPassword: "old_cmd",
	}

	t.Run("Incoming has masks", func(t *testing.T) {
		newSrv1 := &server.Arma3Server{
			Server: server.Server{
				Password:      "***",
				AdminPassword: "***",
			},
			ServerCommandPassword: "***",
		}

		server.MergeMaskedPasswords(newSrv1, oldSrv)

		if newSrv1.Password != "old_pass" {
			t.Errorf("expected old password to be retained, got %s", newSrv1.Password)
		}
		if newSrv1.AdminPassword != "old_admin" {
			t.Errorf("expected old admin password to be retained, got %s", newSrv1.AdminPassword)
		}
		if newSrv1.ServerCommandPassword != "old_cmd" {
			t.Errorf("expected old command password to be retained, got %s", newSrv1.ServerCommandPassword)
		}
	})

	t.Run("Incoming has empty strings", func(t *testing.T) {
		newSrv2 := &server.Arma3Server{
			Server: server.Server{
				Password:      "",
				AdminPassword: "",
			},
			ServerCommandPassword: "",
		}

		server.MergeMaskedPasswords(newSrv2, oldSrv)

		if newSrv2.Password != "old_pass" {
			t.Errorf("expected old password to be retained on empty string, got %s", newSrv2.Password)
		}
	})

	t.Run("Incoming has new values", func(t *testing.T) {
		newSrv3 := &server.Arma3Server{
			Server: server.Server{
				Password:      "new_pass",
				AdminPassword: "new_admin",
			},
			ServerCommandPassword: "new_cmd",
		}

		server.MergeMaskedPasswords(newSrv3, oldSrv)

		if newSrv3.Password != "new_pass" {
			t.Errorf("expected new password to be used, got %s", newSrv3.Password)
		}
	})
}
