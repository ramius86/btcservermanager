package steamauth

import (
	"btcservermanager/internal/db"
	"bytes"
	"io"
	"net/http"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// mockRoundTripper implements http.RoundTripper for testing
type mockRoundTripper struct {
	roundTripFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.roundTripFunc(req)
}

func TestQRAuthService(t *testing.T) {
	t.Setenv("SECRET_KEY", "dummy-key")

	dbPath := filepath.Join(t.TempDir(), "test.db")
	database, _ := db.Connect(dbPath)
	defer database.Close()
	_ = db.Migrate(dbPath)

	repo := NewRepository(database)

	// Create service
	service := NewQRAuthService(repo)

	ctx := t.Context()

	t.Run("BeginSession", func(t *testing.T) {
		// Mock HTTP client
		service.httpClient.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				body := `{
					"response": {
						"client_id": "123456789",
						"challenge_url": "steam://url/SteamIDLogin",
						"request_id": "req-123",
						"interval": 2.0
					}
				}`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewBufferString(body)),
				}, nil
			},
		}

		res, err := service.BeginSession(ctx)
		require.NoError(t, err)
		assert.Equal(t, uint64(123456789), res.Response.ClientID)
		assert.Equal(t, "req-123", res.Response.RequestID)
	})

	t.Run("PollStatus - Pending", func(t *testing.T) {
		service.httpClient.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				body := `{
					"response": {
						"error": "pending"
					}
				}`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewBufferString(body)),
				}, nil
			},
		}

		res, err := service.PollStatus(ctx, "123456789", "req-123")
		require.NoError(t, err)
		assert.Equal(t, "pending", res.Response.Error)
		assert.Empty(t, res.Response.RefreshToken)
	})

	t.Run("PollStatus - Success", func(t *testing.T) {
		service.httpClient.Transport = &mockRoundTripper{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				body := `{
					"response": {
						"refresh_token": "token123",
						"access_token": "acc123",
						"account_name": "qruser"
					}
				}`
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewBufferString(body)),
				}, nil
			},
		}

		res, err := service.PollStatus(ctx, "123456789", "req-123")
		require.NoError(t, err)
		assert.Equal(t, "token123", res.Response.RefreshToken)
		assert.Equal(t, "qruser", res.Response.AccountName)

		// Verify it was saved to db
		saved, err := repo.GetAuth(ctx)
		require.NoError(t, err)
		assert.Equal(t, "qruser", saved.Username)
		assert.Equal(t, "token123", saved.RefreshToken)
	})
}
