package modpreset

import (
	"btcservermanager/internal/domain/server"
	"context"
	"errors"
	"io"
)

// ErrPresetNotExportable is returned when a preset cannot be rendered as an
// Arma 3 launcher preset. Reforger and DayZ presets have no launcher HTML
// equivalent, and exporting them would produce a file the launcher rejects.
var ErrPresetNotExportable = errors.New("only Arma 3 presets can be exported as launcher presets")

type Service struct {
	repo     *Repository
	importer *Importer
	exporter *Exporter
}

func NewService(repo *Repository, importer *Importer, exporter *Exporter) *Service {
	return &Service{
		repo:     repo,
		importer: importer,
		exporter: exporter,
	}
}

func (s *Service) GetAllPresets(ctx context.Context) ([]*ModPreset, error) {
	return s.repo.GetAllPresets(ctx)
}

func (s *Service) GetPreset(ctx context.Context, id int64) (*ModPreset, error) {
	return s.repo.GetPresetByID(ctx, id)
}

func (s *Service) SavePreset(ctx context.Context, p *ModPreset) error {
	return s.repo.Save(ctx, p)
}

func (s *Service) DeletePreset(ctx context.Context, id int64) error {
	return s.repo.Delete(ctx, id)
}

func (s *Service) ImportPreset(ctx context.Context, r io.Reader) (*ModPreset, error) {
	return s.importer.Import(ctx, r)
}

func (s *Service) ExportPreset(ctx context.Context, id int64) ([]byte, error) {
	p, err := s.repo.GetPresetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if p.Type != server.TypeArma3 {
		return nil, ErrPresetNotExportable
	}

	return s.exporter.Export(p)
}
