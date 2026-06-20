package modpreset

import (
	"fmt"
	"strings"
	"testing"

	"golang.org/x/net/html"
)

func BenchmarkModPresetExtractor(b *testing.B) {
	// Generate a medium-sized mock Arma 3 preset HTML
	var sb strings.Builder
	sb.WriteString(`<html><head><meta name="arma:PresetName" content="Benchmark Preset" /></head><body>`)
	sb.WriteString(`<h1>Arma 3 Mods - Benchmark Preset</h1>`)
	for i := 0; i < 50; i++ {
		sb.WriteString(fmt.Sprintf(`<div><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=%d">Mod %d</a></div>`, 1000000+i, i))
	}
	sb.WriteString(`</body></html>`)
	htmlContent := sb.String()

	b.ResetTimer()
	b.ReportAllocs()

	importer := &Importer{}

	for b.Loop() {
		doc, err := html.Parse(strings.NewReader(htmlContent))
		if err != nil {
			b.Fatal(err)
		}

		_ = importer.extractPresetName(doc)
		_ = importer.extractModIDs(doc)
	}
}

func BenchmarkModPreset_ExtractOnly(b *testing.B) {
	// Pre-parse the document to benchmark ONLY the extraction logic
	var sb strings.Builder
	sb.WriteString(`<html><head><meta name="arma:PresetName" content="Benchmark Preset" /></head><body>`)
	for i := 0; i < 100; i++ {
		sb.WriteString(fmt.Sprintf(`<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=%d"></a>`, 1000000+i))
	}
	sb.WriteString(`</body></html>`)
	doc, _ := html.Parse(strings.NewReader(sb.String()))

	importer := &Importer{}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_ = importer.extractPresetName(doc)
		_ = importer.extractModIDs(doc)
	}
}
