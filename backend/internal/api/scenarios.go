package api

import (
	"btcservermanager/internal/atomicfile"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
)

func (r *Router) handleGetArma3Scenarios(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	scenarios, err := r.scenarioService.GetArma3Scenarios(ctx)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	r.json(w, map[string]any{"scenarios": scenarios})
}

func (r *Router) handleGetReforgerScenarios(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	// The service now returns all available scenarios (vanilla + all modded in DB)
	// to ensure discovery works even for unsaved mods.
	scenarios, err := r.scenarioService.GetReforgerScenarios(ctx, nil)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	r.json(w, map[string]any{"scenarios": scenarios})
}

func (r *Router) handleUploadArma3Scenario(w http.ResponseWriter, req *http.Request) {
	// MAX_SCENARIO_SIZE limits the scenario file itself; the envelope allowance
	// keeps a file of exactly that size acceptable. MaxBytesReader is what
	// actually enforces the limit, since ParseMultipartForm only sizes the
	// in-memory buffer.
	req.Body = http.MaxBytesReader(w, req.Body, r.config.MaxScenarioSize+multipartEnvelopeAllowance)

	if err := req.ParseMultipartForm(multipartMemoryLimit); err != nil {
		if isBodyTooLarge(err) {
			http.Error(w, "Uploaded scenario exceeds MAX_SCENARIO_SIZE", http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer func() {
		if req.MultipartForm != nil {
			_ = req.MultipartForm.RemoveAll()
		}
	}()

	files := req.MultipartForm.File["file"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	for _, fileHeader := range files {
		if err := r.saveArma3ScenarioFile(fileHeader); err != nil {
			if errors.Is(err, errUnsupportedScenarioFile) {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			r.respondInternalError(w, err)
			return
		}

		filename := filepath.Base(fileHeader.Filename)
		if strings.HasSuffix(strings.ToLower(filename), ".pbo") {
			go func(name string) {
				if err := r.scenarioService.PurgeCloudflareCache(name); err != nil {
					log.Printf("[Cloudflare] Error purging cache for uploaded scenario %s: %v", name, err)
				}
				r.scenarioService.PreCacheScenario(name)
			}(filename)
		}
	}

	w.WriteHeader(http.StatusOK)
}

var errUnsupportedScenarioFile = errors.New("only .pbo scenario files are supported")

func (r *Router) saveArma3ScenarioFile(fileHeader *multipart.FileHeader) error {
	filename := filepath.Base(fileHeader.Filename)
	if !strings.HasSuffix(strings.ToLower(filename), ".pbo") {
		return fmt.Errorf("%w: %s", errUnsupportedScenarioFile, filename)
	}

	file, err := fileHeader.Open()
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	destPath := r.paths.GetScenarioPath(filename)
	if err := os.MkdirAll(filepath.Dir(destPath), 0o755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	return atomicfile.WriteFileFunc(destPath, 0o644, func(out *os.File) error {
		if _, err := io.Copy(out, file); err != nil {
			return fmt.Errorf("failed to save file: %w", err)
		}
		return nil
	})
}

func (r *Router) handleDeleteArma3Scenario(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	name := chi.URLParam(req, "name")
	if unescaped, err := url.PathUnescape(name); err == nil {
		name = unescaped
	}
	isPathTraversal := strings.Contains(name, "..") || strings.Contains(name, "/") || strings.Contains(name, "\\")
	if isPathTraversal {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}
	cleanName := filepath.Clean(name)
	if cleanName == "." || cleanName == "" || !strings.HasSuffix(strings.ToLower(cleanName), ".pbo") {
		http.Error(w, "Invalid filename extension", http.StatusBadRequest)
		return
	}
	if err := r.scenarioService.DeleteScenario(ctx, name); err != nil {
		r.respondInternalError(w, err)
		return
	}

	// Purge Cloudflare cache in background
	go func() {
		if err := r.scenarioService.PurgeCloudflareCache(name); err != nil {
			log.Printf("[Cloudflare] Error purging cache for deleted scenario %s: %v", name, err)
		}
	}()

	w.WriteHeader(http.StatusNoContent)
}

func (r *Router) handleDownloadArma3Scenario(w http.ResponseWriter, req *http.Request) {
	name := chi.URLParam(req, "name")
	if unescaped, err := url.PathUnescape(name); err == nil {
		name = unescaped
	}
	isPathTraversal := strings.Contains(name, "..") || strings.Contains(name, "/") || strings.Contains(name, "\\")
	if isPathTraversal {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	path := r.paths.GetScenarioPath(name)
	if _, err := os.Stat(path); err != nil {
		http.Error(w, "Scenario not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename="+name)
	w.Header().Set("Content-Type", "application/octet-stream")
	http.ServeFile(w, req, path)
}

func (r *Router) handleFetchReforgerScenarios(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	id := chi.URLParam(req, "id")

	response, err := r.workshopService.GetReforgerModScenarios(ctx, id)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	// Save to DB synchronously to avoid race conditions with frontend reloading
	err = r.scenarioService.SaveModScenarios(ctx, id, response.ModName, response.Scenarios)
	if err != nil {
		log.Printf("Failed to save mod scenarios for mod %s: %v", id, err)
	}

	dtos := make([]map[string]any, 0, len(response.Scenarios))
	for _, s := range response.Scenarios {
		dtos = append(dtos, map[string]any{
			"value":      s.ID,
			"name":       s.Name,
			"isOfficial": false,
			"modName":    response.ModName,
		})
	}

	r.json(w, dtos)
}

func (r *Router) handleSyncReforgerScenarios(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	err := r.workshopService.SyncReforgerScenarios(ctx)
	if err != nil {
		r.respondInternalError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
