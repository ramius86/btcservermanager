package modpreset

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"net/url"
	"strconv"

	"golang.org/x/net/html"
)

type Importer struct {
	repo         *Repository
	workshopRepo *workshop.Repository
}

func NewImporter(repo *Repository, wr *workshop.Repository) *Importer {
	return &Importer{repo: repo, workshopRepo: wr}
}

func (i *Importer) Import(ctx context.Context, r io.Reader) (*ModPreset, error) {
	content, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	doc, err := html.Parse(bytes.NewReader(content))
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

	// 1. Extract Preset Name
	name := i.extractPresetName(doc)
	if name == "" {
		name = "Imported Preset"
	}

	// Avoid duplicate names
	baseName := name
	counter := 1

	for i.repo.ExistsByName(ctx, name) {
		name = fmt.Sprintf("%s %d", baseName, counter)
		counter++
	}

	// 2. Extract Mod IDs
	modIDs := i.extractModIDs(doc)

	mods := []workshop.WorkshopMod{}

	for _, id := range modIDs {
		// Load or create workshop mod placeholder
		mod, err := i.workshopRepo.GetModByID(ctx, id)
		if err != nil {
			// Placeholder
			mod = &workshop.WorkshopMod{
				ID:                 id,
				ServerType:         server.TypeArma3,
				InstallationStatus: workshop.InstallationNotInstalled,
			}
			_ = i.workshopRepo.Save(ctx, mod)
		}

		mods = append(mods, *mod)
	}

	if len(mods) == 0 {
		return nil, errors.New("no mods found in preset")
	}

	preset := &ModPreset{
		Name: name,
		Type: server.TypeArma3,
		Mods: mods,
	}

	if err := i.repo.Save(ctx, preset); err != nil {
		return nil, err
	}

	return preset, nil
}

func (i *Importer) extractPresetName(n *html.Node) string {
	if name := i.extractFromMeta(n); name != "" {
		return name
	}

	if name := i.extractFromH1(n); name != "" {
		return name
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if name := i.extractPresetName(c); name != "" {
			return name
		}
	}

	return ""
}

func (i *Importer) extractFromMeta(n *html.Node) string {
	if n.Type != html.ElementNode || n.Data != "meta" {
		return ""
	}
	var isPresetName bool
	var content string

	for _, attr := range n.Attr {
		if attr.Key == "name" && attr.Val == "arma:PresetName" {
			isPresetName = true
		}

		if attr.Key == "content" {
			content = attr.Val
		}
	}

	if isPresetName && content != "" {
		return content
	}
	return ""
}

func (i *Importer) extractFromH1(n *html.Node) string {
	if n.Type == html.ElementNode && n.Data == "h1" && n.FirstChild != nil {
		text := n.FirstChild.Data
		const prefix = "Arma 3 Mods - "
		if len(text) > len(prefix) && text[:len(prefix)] == prefix {
			return text[len(prefix):]
		}
	}
	return ""
}

func (i *Importer) extractModIDs(n *html.Node) []int64 {
	ids := []int64{}

	var traverse func(*html.Node)
	traverse = func(node *html.Node) {
		if id, ok := i.extractIDFromNode(node); ok {
			if !contains(ids, id) {
				ids = append(ids, id)
			}
		}

		for c := node.FirstChild; c != nil; c = c.NextSibling {
			traverse(c)
		}
	}
	traverse(n)

	return ids
}

func (i *Importer) extractIDFromNode(n *html.Node) (int64, bool) {
	if n.Type != html.ElementNode || n.Data != "a" {
		return 0, false
	}
	for _, attr := range n.Attr {
		if attr.Key == "href" {
			u, err := url.Parse(attr.Val)
			if err != nil {
				continue
			}
			idStr := u.Query().Get("id")
			if idStr == "" {
				continue
			}
			if id, err := strconv.ParseInt(idStr, 10, 64); err == nil {
				return id, true
			}
		}
	}
	return 0, false
}

func contains(list []int64, item int64) bool {
	for _, x := range list {
		if x == item {
			return true
		}
	}
	return false
}
