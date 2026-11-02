package server_test

import (
	"btcservermanager/internal/domain/server"
	"context"
	"errors"
	"testing"
)

type fakeServerRepo struct {
	servers   map[int64]any
	nextID    int64
	saveCalls int
	deletes   []int64
	saveErr   error
}

func newFakeServerRepo() *fakeServerRepo {
	return &fakeServerRepo{servers: make(map[int64]any), nextID: 1}
}

func (f *fakeServerRepo) GetAllServers(context.Context) ([]any, error) {
	out := make([]any, 0, len(f.servers))
	for _, srv := range f.servers {
		out = append(out, srv)
	}
	return out, nil
}

func (f *fakeServerRepo) GetServerByID(_ context.Context, id int64) (any, error) {
	srv, ok := f.servers[id]
	if !ok {
		return nil, errors.New("server not found")
	}
	return srv, nil
}

func (f *fakeServerRepo) Save(_ context.Context, srv any) (int64, error) {
	f.saveCalls++
	if f.saveErr != nil {
		return 0, f.saveErr
	}

	a3, ok := srv.(*server.Arma3Server)
	if !ok {
		return 0, errors.New("fake repo only stores Arma 3 servers")
	}

	stored := *a3
	if stored.ID == 0 {
		stored.ID = f.nextID
		f.nextID++
	}
	f.servers[stored.ID] = &stored

	return stored.ID, nil
}

func (f *fakeServerRepo) UpdateSortOrders(context.Context, map[int64]int) error { return nil }

func (f *fakeServerRepo) Delete(_ context.Context, id int64) error {
	f.deletes = append(f.deletes, id)
	delete(f.servers, id)
	return nil
}

func (f *fakeServerRepo) FindAllServerIdsByActiveMod(context.Context, string) ([]int64, error) {
	return nil, nil
}

func (f *fakeServerRepo) GetCBAPresets(context.Context) ([]server.CBAPreset, error) { return nil, nil }

func (f *fakeServerRepo) GetCBAPresetByID(context.Context, int64) (*server.CBAPreset, error) {
	return nil, nil
}

func (f *fakeServerRepo) SaveCBAPreset(context.Context, *server.CBAPreset) (int64, error) {
	return 0, nil
}

func (f *fakeServerRepo) DeleteCBAPreset(context.Context, int64) error { return nil }

func (f *fakeServerRepo) GetAllActiveReforgerModIDs(context.Context) ([]string, error) {
	return nil, nil
}

type fakeConfigManager struct {
	prepareErr error
	commitErr  error
	prepares   int
	commits    int
}

func (f *fakeConfigManager) Generate(context.Context, any) error { return nil }

func (f *fakeConfigManager) Prepare(context.Context, any) (*server.PreparedConfig, error) {
	f.prepares++
	if f.prepareErr != nil {
		return nil, f.prepareErr
	}
	return &server.PreparedConfig{}, nil
}

func (f *fakeConfigManager) Commit(*server.PreparedConfig) error {
	f.commits++
	return f.commitErr
}

func (f *fakeConfigManager) Delete(context.Context, server.Type, int64) error { return nil }

func (f *fakeConfigManager) GetConfigContents(context.Context, any) (map[string]string, error) {
	return nil, nil
}

func newTestArma3Server(name string) *server.Arma3Server {
	return &server.Arma3Server{Server: server.Server{Type: server.TypeArma3, Name: name}}
}

func TestCreateServerRollsBackWhenConfigCannotBePrepared(t *testing.T) {
	repo := newFakeServerRepo()
	cfg := &fakeConfigManager{prepareErr: errors.New("template broken")}
	svc := server.NewService(repo, nil, cfg, nil)

	if _, err := svc.CreateServer(context.Background(), newTestArma3Server("Test")); err == nil {
		t.Fatal("expected an error when the config cannot be rendered")
	}

	if len(repo.deletes) != 1 {
		t.Fatalf("expected the new row to be rolled back, deletes=%v", repo.deletes)
	}
	if len(repo.servers) != 0 {
		t.Fatalf("expected no server left behind, got %d", len(repo.servers))
	}
	if cfg.commits != 0 {
		t.Fatalf("commit must not run after a failed prepare, got %d calls", cfg.commits)
	}
}

func TestCreateServerRollsBackWhenConfigCommitFails(t *testing.T) {
	repo := newFakeServerRepo()
	cfg := &fakeConfigManager{commitErr: errors.New("disk full")}
	svc := server.NewService(repo, nil, cfg, nil)

	if _, err := svc.CreateServer(context.Background(), newTestArma3Server("Test")); err == nil {
		t.Fatal("expected an error when the config cannot be written")
	}

	if len(repo.deletes) != 1 {
		t.Fatalf("expected the new row to be rolled back, deletes=%v", repo.deletes)
	}
	if len(repo.servers) != 0 {
		t.Fatalf("a server without a config file must not survive, got %d", len(repo.servers))
	}
}

func TestCreateServerCommitsConfigAfterSaving(t *testing.T) {
	repo := newFakeServerRepo()
	cfg := &fakeConfigManager{}
	svc := server.NewService(repo, nil, cfg, nil)

	created, err := svc.CreateServer(context.Background(), newTestArma3Server("Test"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if repo.saveCalls != 1 {
		t.Fatalf("expected one save, got %d", repo.saveCalls)
	}
	if cfg.commits != 1 {
		t.Fatalf("expected one commit, got %d", cfg.commits)
	}
	if len(repo.deletes) != 0 {
		t.Fatalf("happy path must not roll back, deletes=%v", repo.deletes)
	}

	a3, ok := created.(*server.Arma3Server)
	if !ok {
		t.Fatalf("expected *server.Arma3Server, got %T", created)
	}
	if a3.ID == 0 {
		t.Fatal("expected a non-zero ID")
	}
}

func TestUpdateServerLeavesDatabaseUntouchedWhenRenderFails(t *testing.T) {
	repo := newFakeServerRepo()
	cfg := &fakeConfigManager{}
	svc := server.NewService(repo, nil, cfg, nil)

	created, err := svc.CreateServer(context.Background(), newTestArma3Server("Before"))
	if err != nil {
		t.Fatalf("seed server: %v", err)
	}
	a3 := created.(*server.Arma3Server)

	savesBefore := repo.saveCalls
	cfg.prepareErr = errors.New("template broken")

	// Copy before mutating: the fake repository hands back its own pointer, so
	// editing it directly would change the "stored" row without a save.
	after := *a3
	after.Name = "After"
	if _, err := svc.UpdateServer(context.Background(), &after); err == nil {
		t.Fatal("expected an error when the config cannot be rendered")
	}

	if repo.saveCalls != savesBefore {
		t.Fatalf("database was written after a failed render (saves %d -> %d)", savesBefore, repo.saveCalls)
	}

	stored, err := repo.GetServerByID(context.Background(), after.ID)
	if err != nil {
		t.Fatalf("read back: %v", err)
	}
	if got := stored.(*server.Arma3Server).Name; got != "Before" {
		t.Fatalf("stored name changed to %q", got)
	}
}

func TestUpdateServerRestoresPreviousConfigWhenCommitFails(t *testing.T) {
	repo := newFakeServerRepo()
	cfg := &fakeConfigManager{}
	svc := server.NewService(repo, nil, cfg, nil)

	created, err := svc.CreateServer(context.Background(), newTestArma3Server("Before"))
	if err != nil {
		t.Fatalf("seed server: %v", err)
	}
	a3 := created.(*server.Arma3Server)

	cfg.commitErr = errors.New("disk full")
	after := *a3
	after.Name = "After"

	if _, err := svc.UpdateServer(context.Background(), &after); err == nil {
		t.Fatal("expected an error when the config cannot be written")
	}

	// create prepare + update prepare + restore prepare
	if cfg.prepares != 3 {
		t.Fatalf("expected the previous config to be re-rendered, prepares=%d", cfg.prepares)
	}
	// create commit + failed update commit + restore commit
	if cfg.commits != 3 {
		t.Fatalf("expected a restore attempt, commits=%d", cfg.commits)
	}
}
