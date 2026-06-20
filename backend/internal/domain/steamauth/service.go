package steamauth

import "context"

type AuthService struct {
	repo *Repository
}

func NewAuthService(repo *Repository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) GetAuthAccount(ctx context.Context) (*SteamAuth, error) {
	return s.repo.GetAuth(ctx)
}

func (s *AuthService) SaveAuthAccount(ctx context.Context, a *SteamAuth) error {
	return s.repo.Save(ctx, a)
}

func (s *AuthService) ClearAuthAccount(ctx context.Context) error {
	return s.repo.Delete(ctx)
}

func (s *AuthService) IsAuthenticated(ctx context.Context) (bool, error) {
	auth, err := s.repo.GetAuth(ctx)
	if err != nil {
		return false, err
	}

	return auth.Username != "" && auth.Password != "", nil
}
