package api

import (
	"btcservermanager/internal/domain/filemanager"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
)

const (
	errInvalidRequestBody    = "invalid request body"
	headerContentType        = "Content-Type"
	headerContentDisposition = "Content-Disposition"
)

func (r *Router) fileRoutes() chi.Router {
	mux := chi.NewRouter()
	mux.Get("/list", r.handleListFiles)
	mux.Get("/content", r.handleGetFileContent)
	mux.Put("/content", r.handleSaveFileContent)
	mux.Post("/create", r.handleCreateFileOrDir)
	mux.Delete("/", r.handleDeleteFileOrDir)
	mux.Post("/rename", r.handleRenameFileOrDir)
	mux.Post("/upload", r.handleUploadFiles)
	mux.Get("/download", r.handleDownloadFile)
	mux.Post("/download-zip", r.handleDownloadSelectedZip)
	mux.Post("/extract", r.handleExtractZip)
	mux.Post("/compress", r.handleCompressZip)

	return mux
}

func (r *Router) handleFileError(w http.ResponseWriter, err error) {
	if errors.Is(err, filemanager.ErrReadOnly) {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}
	if errors.Is(err, filemanager.ErrHiddenFile) {
		http.Error(w, "file not found or hidden", http.StatusNotFound)
		return
	}
	if errors.Is(err, filemanager.ErrPathTraversal) {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if errors.Is(err, filemanager.ErrFileTooLarge) {
		http.Error(w, err.Error(), http.StatusRequestEntityTooLarge)
		return
	}
	if os.IsNotExist(err) {
		http.Error(w, "file or directory not found", http.StatusNotFound)
		return
	}
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func (r *Router) handleListFiles(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")
	items, err := r.fileManagerService.List(path)
	if err != nil {
		r.handleFileError(w, err)
		return
	}

	r.json(w, map[string]any{
		"path":  path,
		"items": items,
	})
}

func (r *Router) handleGetFileContent(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "missing path parameter", http.StatusBadRequest)
		return
	}

	content, err := r.fileManagerService.ReadFile(path)
	if err != nil {
		r.handleFileError(w, err)
		return
	}

	r.json(w, map[string]any{
		"path":    path,
		"content": string(content),
	})
}

type SaveFileRequest struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

func (r *Router) handleSaveFileContent(w http.ResponseWriter, req *http.Request) {
	var body SaveFileRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, filemanager.MaxEditableFileSize+1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if body.Path == "" {
		http.Error(w, "path is required", http.StatusBadRequest)
		return
	}

	if err := r.fileManagerService.WriteFile(body.Path, []byte(body.Content)); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "file saved successfully"})
}

type CreateItemRequest struct {
	Path  string `json:"path"`
	IsDir bool   `json:"isDir"`
}

func (r *Router) handleCreateFileOrDir(w http.ResponseWriter, req *http.Request) {
	var body CreateItemRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1024*1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if body.Path == "" {
		http.Error(w, "path is required", http.StatusBadRequest)
		return
	}

	if err := r.fileManagerService.Create(body.Path, body.IsDir); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	r.json(w, map[string]string{"message": "created successfully"})
}

func (r *Router) handleDeleteFileOrDir(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "path parameter is required", http.StatusBadRequest)
		return
	}

	if err := r.fileManagerService.Delete(path); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "deleted successfully"})
}

type RenameItemRequest struct {
	OldPath string `json:"oldPath"`
	NewPath string `json:"newPath"`
}

func (r *Router) handleRenameFileOrDir(w http.ResponseWriter, req *http.Request) {
	var body RenameItemRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1024*1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if body.OldPath == "" || body.NewPath == "" {
		http.Error(w, "both oldPath and newPath are required", http.StatusBadRequest)
		return
	}

	if err := r.fileManagerService.Rename(body.OldPath, body.NewPath); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "renamed successfully"})
}

func (r *Router) handleUploadFiles(w http.ResponseWriter, req *http.Request) {
	// Parse multipart form (up to 500 MB for mod/script archives)
	maxUploadSize := int64(500 * 1024 * 1024)
	if err := req.ParseMultipartForm(maxUploadSize); err != nil {
		http.Error(w, fmt.Sprintf("failed to parse multipart form: %v", err), http.StatusBadRequest)
		return
	}

	targetDir := req.FormValue("destination")
	files := req.MultipartForm.File["files"]
	if len(files) == 0 {
		http.Error(w, "no files provided", http.StatusBadRequest)
		return
	}

	for _, fh := range files {
		cleanFilename := filepath.Base(fh.Filename)
		if cleanFilename == "" || filemanager.IsEnvName(cleanFilename) {
			continue
		}

		f, err := fh.Open()
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to open uploaded file %s: %v", fh.Filename, err), http.StatusInternalServerError)
			return
		}

		err = r.fileManagerService.UploadFile(targetDir, cleanFilename, f)
		f.Close()
		if err != nil {
			r.handleFileError(w, err)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "files uploaded successfully"})
}

func (r *Router) handleDownloadFile(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "path parameter is required", http.StatusBadRequest)
		return
	}

	absPath, cleanRel, _, err := r.fileManagerService.ResolvePath(path)
	if err != nil {
		r.handleFileError(w, err)
		return
	}

	fi, err := os.Stat(absPath)
	if err != nil {
		r.handleFileError(w, err)
		return
	}

	if fi.IsDir() {
		// Directory download: stream as a zip archive
		zipName := filepath.Base(absPath)
		if cleanRel == "" {
			zipName = "storage"
		}
		zipFilename := fmt.Sprintf("%s.zip", zipName)

		w.Header().Set(headerContentType, "application/zip")
		w.Header().Set(headerContentDisposition, fmt.Sprintf("attachment; filename=\"%s\"", url.PathEscape(zipFilename)))

		if err := r.fileManagerService.StreamZip(w, []string{cleanRel}); err != nil {
			// Headers already sent, log or write error if possible
			return
		}
		return
	}

	filename := filepath.Base(absPath)
	w.Header().Set(headerContentDisposition, fmt.Sprintf("attachment; filename=\"%s\"", url.PathEscape(filename)))
	w.Header().Set(headerContentType, "application/octet-stream")
	http.ServeFile(w, req, absPath)
}

type DownloadSelectedZipRequest struct {
	Paths    []string `json:"paths"`
	Filename string   `json:"filename"`
}

func (r *Router) handleDownloadSelectedZip(w http.ResponseWriter, req *http.Request) {
	var body DownloadSelectedZipRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1024*1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if len(body.Paths) == 0 {
		http.Error(w, "paths list cannot be empty", http.StatusBadRequest)
		return
	}

	zipName := strings.TrimSpace(body.Filename)
	if zipName == "" {
		zipName = "archive.zip"
	}
	if !strings.HasSuffix(strings.ToLower(zipName), ".zip") {
		zipName += ".zip"
	}

	w.Header().Set(headerContentType, "application/zip")
	w.Header().Set(headerContentDisposition, fmt.Sprintf("attachment; filename=\"%s\"", url.PathEscape(zipName)))

	if err := r.fileManagerService.StreamZip(w, body.Paths); err != nil {
		return
	}
}

type ExtractZipRequest struct {
	ZipPath     string `json:"zipPath"`
	Destination string `json:"destination"`
}

func (r *Router) handleExtractZip(w http.ResponseWriter, req *http.Request) {
	var body ExtractZipRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1024*1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if body.ZipPath == "" {
		http.Error(w, "zipPath is required", http.StatusBadRequest)
		return
	}

	destination := body.Destination
	if destination == "" {
		destination = filepath.ToSlash(filepath.Dir(body.ZipPath))
		if destination == "." {
			destination = ""
		}
	}

	if err := r.fileManagerService.ExtractZip(body.ZipPath, destination); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "archive extracted successfully"})
}

type CompressZipRequest struct {
	Paths          []string `json:"paths"`
	DestinationZip string   `json:"destinationZip"`
}

func (r *Router) handleCompressZip(w http.ResponseWriter, req *http.Request) {
	var body CompressZipRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1024*1024)).Decode(&body); err != nil {
		http.Error(w, errInvalidRequestBody, http.StatusBadRequest)
		return
	}

	if len(body.Paths) == 0 || body.DestinationZip == "" {
		http.Error(w, "paths and destinationZip are required", http.StatusBadRequest)
		return
	}

	destZip := body.DestinationZip
	if !strings.HasSuffix(strings.ToLower(destZip), ".zip") {
		destZip += ".zip"
	}

	if err := r.fileManagerService.CompressZip(body.Paths, destZip); err != nil {
		r.handleFileError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	r.json(w, map[string]string{"message": "archive created successfully"})
}
