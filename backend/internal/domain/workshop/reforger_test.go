package workshop

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestReforgerScraper_Search(t *testing.T) {
	t.Parallel()

	handler := func(w http.ResponseWriter, r *http.Request) {
		var nextData string
		if strings.Contains(r.URL.Path, "mod1-slug") {
			nextData = `{"props": {"pageProps": {"scenarios": [{"id": "s1", "name": "S1", "gameMode": "COOP"}]}}}`
		} else {
			nextData = `{"props": {"pageProps": {"assets": {"rows": [{"id": "mod1", "name": "Test Mod 1"}]}}}}`
		}
		fmt.Fprintf(w, "<html><body><script id=\"__NEXT_DATA__\" type=\"application/json\">%s</script></body></html>", nextData)
	}
	server := httptest.NewServer(http.HandlerFunc(handler))
	defer server.Close()

	scraper := NewReforgerScraper()
	scraper.baseURL = server.URL
	scraper.client = server.Client()

	ctx := t.Context()

	t.Run("Search Success", func(t *testing.T) {
		testSearchSuccess(t, scraper, ctx)
	})

	t.Run("Search Fallback", func(t *testing.T) {
		testSearchFallback(t, scraper, ctx)
	})

	t.Run("FetchScenarios Success", func(t *testing.T) {
		testFetchScenariosSuccess(t, scraper, ctx)
	})
}

func testSearchSuccess(t *testing.T, scraper *ReforgerScraper, ctx context.Context) {
	results, err := scraper.Search(ctx, "test", 1)
	if err != nil {
		t.Fatalf("failed to search: %v", err)
	}

	if len(results) != 1 {
		t.Errorf("expected 1 result, got %d", len(results))
	}

	if results[0].Name != "Test Mod 1" {
		t.Errorf("expected Test Mod 1, got %s", results[0].Name)
	}
}

func testSearchFallback(t *testing.T, scraper *ReforgerScraper, ctx context.Context) {
	results, err := scraper.Search(ctx, "test mod", 1)
	if err != nil {
		t.Fatalf("failed to search: %v", err)
	}

	if len(results) == 0 {
		t.Error("expected results from fallback")
	}
}

func testFetchScenariosSuccess(t *testing.T, scraper *ReforgerScraper, ctx context.Context) {
	res, err := scraper.FetchScenarios(ctx, "mod1-slug")
	if err != nil {
		t.Fatalf("failed to fetch scenarios: %v", err)
	}

	if len(res.Scenarios) != 1 {
		t.Errorf("expected 1 scenario, got %d", len(res.Scenarios))
	}
}

func TestReforgerScraper_Parsing(t *testing.T) {
	t.Parallel()
	scraper := NewReforgerScraper()

	t.Run("findRows", func(t *testing.T) {
		data := map[string]any{
			"props": map[string]any{
				"pageProps": map[string]any{
					"assets": map[string]any{
						"rows": []any{
							map[string]any{"id": "1", "name": "Mod 1"},
						},
					},
				},
			},
		}

		rows := scraper.findRows(data)
		if len(rows) != 1 {
			t.Errorf("expected 1 row, got %d", len(rows))
		}
	})

	t.Run("findScenarios", func(t *testing.T) {
		data := map[string]any{
			"props": map[string]any{
				"pageProps": map[string]any{
					"scenarios": []any{
						map[string]any{"id": "s1", "name": "Scenario 1", "gameMode": "COOP"},
					},
				},
			},
		}

		scenarios := scraper.findScenarios(data)
		if len(scenarios) != 1 {
			t.Errorf("expected 1 scenario, got %d", len(scenarios))
		}
	})
}
