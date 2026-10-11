package api

import (
	"btcservermanager/internal/domain/server"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParseCustomNames_NewFormat(t *testing.T) {
	inputJSON := `{
  "entries": [
    {
      "uid": "01d548ac-aece-45c6-a904-d9799ec9b6d3",
      "playerName": "=BTC= Cpl.Viper",
      "customName": "=BTC= Spc.Viper"
    },
    {
      "uid": "12a07491-c532-4f67-88ab-0462258b1136",
      "playerName": "LeLe",
      "customName": ""
    }
  ]
}`

	payload, err := parseCustomNames([]byte(inputJSON))
	require.NoError(t, err)
	require.Len(t, payload.Entries, 2)

	assert.Equal(t, "01d548ac-aece-45c6-a904-d9799ec9b6d3", payload.Entries[0].UID)
	assert.Equal(t, "=BTC= Cpl.Viper", payload.Entries[0].PlayerName)
	assert.Equal(t, "=BTC= Spc.Viper", payload.Entries[0].CustomName)

	assert.Equal(t, "12a07491-c532-4f67-88ab-0462258b1136", payload.Entries[1].UID)
	assert.Equal(t, "LeLe", payload.Entries[1].PlayerName)
	assert.Equal(t, "", payload.Entries[1].CustomName)
}

func TestParseCustomNames_EmptyAndBOM(t *testing.T) {
	// With UTF-8 BOM
	bomData := append([]byte("\xef\xbb\xbf"), []byte(`{"entries":[]}`)...)
	payload, err := parseCustomNames(bomData)
	require.NoError(t, err)
	assert.Empty(t, payload.Entries)

	// Empty string
	payload, err = parseCustomNames([]byte(""))
	require.NoError(t, err)
	assert.Empty(t, payload.Entries)

	// Empty entries list
	payload, err = parseCustomNames([]byte(`{"entries":[]}`))
	require.NoError(t, err)
	assert.Empty(t, payload.Entries)
}

func TestParseCustomNames_InvalidJSON(t *testing.T) {
	_, err := parseCustomNames([]byte("{ invalid json"))
	assert.Error(t, err)
}

func TestHTTP_GetAndSaveCustomNames_Reforger(t *testing.T) {
	handler, deps, cleanup := setupRouterForEndpointsTest(t)
	defer cleanup()

	deps.Config.ServersDirectory = t.TempDir()

	// 1. Create a Reforger Server
	var reforgerServerID int64
	{
		body := `{"type": "REFORGER", "name": "Reforger Custom Names Test", "port": 20013, "maxPlayers": 16}`
		req := httptest.NewRequest(http.MethodPost, "/api/server/", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		require.Equal(t, http.StatusOK, rr.Code)

		var res struct{ ID int64 }
		err := json.NewDecoder(rr.Body).Decode(&res)
		require.NoError(t, err)
		reforgerServerID = res.ID
	}

	customNamesURL := fmt.Sprintf("/api/server/%d/reforger/custom-names", reforgerServerID)

	// 2. GET when file doesn't exist yet -> returns {"entries": []}
	{
		req := httptest.NewRequest(http.MethodGet, customNamesURL, nil)
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		require.Equal(t, http.StatusOK, rr.Code)

		var resp CustomNamesPayload
		err := json.NewDecoder(rr.Body).Decode(&resp)
		require.NoError(t, err)
		assert.Empty(t, resp.Entries)
	}

	// 3. PUT with new entries format
	newPayload := CustomNamesPayload{
		Entries: []CustomNameEntry{
			{
				UID:        "01d548ac-aece-45c6-a904-d9799ec9b6d3",
				PlayerName: "=BTC= Cpl.Viper",
				CustomName: "=BTC= Spc.Viper",
			},
			{
				UID:        "12a07491-c532-4f67-88ab-0462258b1136",
				PlayerName: "LeLe",
				CustomName: "",
			},
		},
	}
	{
		bodyBytes, err := json.Marshal(newPayload)
		require.NoError(t, err)

		req := httptest.NewRequest(http.MethodPut, customNamesURL, bytes.NewReader(bodyBytes))
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		require.Equal(t, http.StatusOK, rr.Code)
	}

	// 4. Verify file on disk is created in profile folder with new format
	filePath := filepath.Join(deps.Paths.GetServerPath(server.TypeReforger), fmt.Sprintf("profile_%d", reforgerServerID), "profile", "BTC_custom_names", "BTC_custom_names.json")
	diskData, err := os.ReadFile(filePath)
	require.NoError(t, err)

	var diskParsed CustomNamesPayload
	err = json.Unmarshal(diskData, &diskParsed)
	require.NoError(t, err)
	require.Len(t, diskParsed.Entries, 2)
	assert.Equal(t, "01d548ac-aece-45c6-a904-d9799ec9b6d3", diskParsed.Entries[0].UID)
	assert.Equal(t, "=BTC= Cpl.Viper", diskParsed.Entries[0].PlayerName)
	assert.Equal(t, "=BTC= Spc.Viper", diskParsed.Entries[0].CustomName)
	assert.Equal(t, "12a07491-c532-4f67-88ab-0462258b1136", diskParsed.Entries[1].UID)
	assert.Equal(t, "LeLe", diskParsed.Entries[1].PlayerName)
	assert.Equal(t, "", diskParsed.Entries[1].CustomName)

	// 5. GET returns the updated entries
	{
		req := httptest.NewRequest(http.MethodGet, customNamesURL, nil)
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		require.Equal(t, http.StatusOK, rr.Code)

		var resp CustomNamesPayload
		err := json.NewDecoder(rr.Body).Decode(&resp)
		require.NoError(t, err)
		require.Len(t, resp.Entries, 2)
		assert.Equal(t, "=BTC= Spc.Viper", resp.Entries[0].CustomName)
		assert.Equal(t, "", resp.Entries[1].CustomName)
	}
}
