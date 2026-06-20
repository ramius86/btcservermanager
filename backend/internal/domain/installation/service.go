package installation

import (
	"btcservermanager/internal/domain/server"
	"btcservermanager/internal/domain/workshop"
	"context"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAllInstallations(ctx context.Context) ([]*ServerInstallation, error) {
	return s.repo.GetAllInstallations(ctx)
}

func (s *Service) GetInstallation(ctx context.Context, t server.Type) (*ServerInstallation, error) {
	return s.repo.GetInstallation(ctx, t)
}

func (s *Service) IsServerInstalled(ctx context.Context, t server.Type) bool {
	si, err := s.repo.GetInstallation(ctx, t)
	if err != nil {
		return false
	}

	return si.InstallationStatus == workshop.InstallationFinished
}

func (s *Service) SetServerBranch(ctx context.Context, t server.Type, branch Branch) error {
	si, err := s.repo.GetInstallation(ctx, t)
	if err != nil {
		return err
	}

	si.Branch = branch

	return s.repo.Save(ctx, si)
}

func (s *Service) UpdateStatus(ctx context.Context, t server.Type, status workshop.InstallationStatus) error {
	si, err := s.repo.GetInstallation(ctx, t)
	now := time.Now()

	if err != nil {
		si = &ServerInstallation{
			Type:               t,
			InstallationStatus: status,
			Branch:             BranchPublic,
			LastUpdatedAt:      &now,
		}
	} else {
		si.InstallationStatus = status
		if status == workshop.InstallationFinished {
			si.LastUpdatedAt = &now
		}
	}

	return s.repo.Save(ctx, si)
}

func (s *Service) UpdateVersion(ctx context.Context, t server.Type, version string) error {
	si, err := s.repo.GetInstallation(ctx, t)
	now := time.Now()

	if err != nil {
		si = &ServerInstallation{
			Type:               t,
			Version:            version,
			Branch:             BranchPublic,
			InstallationStatus: workshop.InstallationFinished,
			LastUpdatedAt:      &now,
		}
	} else {
		si.Version = version
		si.LastUpdatedAt = &now
	}

	return s.repo.Save(ctx, si)
}

func (s *Service) UpdateAvailableVersion(ctx context.Context, t server.Type, version string) error {
	si, err := s.repo.GetInstallation(ctx, t)
	if err != nil {
		si = &ServerInstallation{
			Type:             t,
			AvailableVersion: version,
			Branch:           BranchPublic,
		}
	} else {
		si.AvailableVersion = version
	}

	return s.repo.Save(ctx, si)
}

func (s *Service) UpdateBuildID(ctx context.Context, t server.Type, buildID string) error {
	si, err := s.repo.GetInstallation(ctx, t)
	if err != nil {
		si = &ServerInstallation{
			Type:             t,
			InstalledBuildID: buildID,
			Branch:           BranchPublic,
		}
	} else {
		si.InstalledBuildID = buildID
	}

	return s.repo.Save(ctx, si)
}

func (s *Service) UpdateInstalledBranch(ctx context.Context, t server.Type, branch Branch) error {
	si, err := s.repo.GetInstallation(ctx, t)
	if err != nil {
		si = &ServerInstallation{
			Type:            t,
			InstalledBranch: branch,
			Branch:          branch,
		}
	} else {
		si.InstalledBranch = branch
	}

	return s.repo.Save(ctx, si)
}

func (s *Service) Delete(ctx context.Context, t server.Type) error {
	return s.repo.Delete(ctx, t)
}
