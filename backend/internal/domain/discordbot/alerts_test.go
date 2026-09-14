package discordbot

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAlerts_NotConfigured(t *testing.T) {
	svc := &Service{} // session is nil

	t.Run("SendServerOfflineAlert returns error when bot not configured", func(t *testing.T) {
		err := svc.SendServerOfflineAlert("12345", "Test Server", "ARMA3", true, errors.New("exit status 1"))
		assert.EqualError(t, err, errBotNotConfigured)
	})

	t.Run("SendModUpdateAlert returns error when bot not configured", func(t *testing.T) {
		err := svc.SendModUpdateAlert("12345", "CBA_A3", 450814997, "ARMA3", "")
		assert.EqualError(t, err, errBotNotConfigured)
	})

	t.Run("SendGameUpdateAlert returns error when bot not configured", func(t *testing.T) {
		err := svc.SendGameUpdateAlert("12345", "ARMA3", "1000", "2000")
		assert.EqualError(t, err, errBotNotConfigured)
	})

	t.Run("SendTestAlert returns error when bot not configured", func(t *testing.T) {
		err := svc.SendTestAlert(context.Background(), "12345")
		assert.EqualError(t, err, errBotNotConfigured)
	})
}
