package modpreset

import (
	"context"
	"io"
)

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

	return s.exporter.Export(p)
}
