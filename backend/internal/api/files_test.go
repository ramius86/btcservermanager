package api

import (
	"archive/zip"
	"btcservermanager/internal/domain/filemanager"
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func setupFilesTest(t *testing.T) (*Router, string) {
	t.Helper()
	tempDir := t.TempDir()

	// Create directories
	_ = os.MkdirAll(filepath.Join(tempDir, "servers", "ARMA3"), 0o755)
	_ = os.MkdirAll(filepath.Join(tempDir, "data"), 0o755)
	_ = os.MkdirAll(filepath.Join(tempDir, "mods"), 0o755)

	// Create files
	_ = os.WriteFile(filepath.Join(tempDir, "servers", "ARMA3", "server.cfg"), []byte("hostname = \"BTC\";"), 0o644)
	_ = os.WriteFile(filepath.Join(tempDir, "data", "btc.db"), []byte("sqlite data"), 0o644)
	_ = os.WriteFile(filepath.Join(tempDir, ".env"), []byte("SECRET=123"), 0o644)

	fmService := filemanager.NewService(tempDir)
	router := &Router{
		fileManagerService: fmService,
	}

	return router, tempDir
}

func TestFilesAPI_List(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	req := httptest.NewRequest(http.MethodGet, "/list?path=", nil)
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rr.Code, rr.Body.String())
	}

	var resp struct {
		Path  string                 `json:"path"`
		Items []filemanager.FileItem `json:"items"`
	}
	if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	for _, item := range resp.Items {
		if strings.HasPrefix(item.Name, ".env") {
			t.Errorf("hidden .env file leaked in list: %s", item.Name)
		}
	}
}

func TestFilesAPI_ContentReadAndSave(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	// 1. Read existing file
	req := httptest.NewRequest(http.MethodGet, "/content?path=servers/ARMA3/server.cfg", nil)
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rr.Code, rr.Body.String())
	}

	var readResp struct {
		Content string `json:"content"`
	}
	_ = json.NewDecoder(rr.Body).Decode(&readResp)
	if readResp.Content != "hostname = \"BTC\";" {
		t.Errorf("expected content match, got %s", readResp.Content)
	}

	// 2. Save modified content
	saveBody := `{"path":"servers/ARMA3/server.cfg","content":"hostname = \"Updated BTC\";"}`
	reqSave := httptest.NewRequest(http.MethodPut, "/content", strings.NewReader(saveBody))
	reqSave.Header.Set("Content-Type", "application/json")
	rrSave := httptest.NewRecorder()
	mux.ServeHTTP(rrSave, reqSave)

	if rrSave.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rrSave.Code, rrSave.Body.String())
	}

	// 3. Attempt to save inside /data -> should return 403 Forbidden
	saveDataBody := `{"path":"data/test.txt","content":"bad"}`
	reqSaveData := httptest.NewRequest(http.MethodPut, "/content", strings.NewReader(saveDataBody))
	reqSaveData.Header.Set("Content-Type", "application/json")
	rrSaveData := httptest.NewRecorder()
	mux.ServeHTTP(rrSaveData, reqSaveData)

	if rrSaveData.Code != http.StatusForbidden {
		t.Errorf("expected status 403 for saving into /data, got %d", rrSaveData.Code)
	}

	// 4. Attempt to read .env -> should return 404 Not Found
	reqEnv := httptest.NewRequest(http.MethodGet, "/content?path=.env", nil)
	rrEnv := httptest.NewRecorder()
	mux.ServeHTTP(rrEnv, reqEnv)

	if rrEnv.Code != http.StatusNotFound {
		t.Errorf("expected status 404 for reading .env, got %d", rrEnv.Code)
	}
}

func TestFilesAPI_CreateRenameDelete(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	// 1. Create file
	createBody := `{"path":"servers/ARMA3/test.txt","isDir":false}`
	reqCreate := httptest.NewRequest(http.MethodPost, "/create", strings.NewReader(createBody))
	rrCreate := httptest.NewRecorder()
	mux.ServeHTTP(rrCreate, reqCreate)
	if rrCreate.Code != http.StatusCreated {
		t.Fatalf("expected status 201, got %d: %s", rrCreate.Code, rrCreate.Body.String())
	}

	// 2. Rename file
	renameBody := `{"oldPath":"servers/ARMA3/test.txt","newPath":"servers/ARMA3/renamed.txt"}`
	reqRename := httptest.NewRequest(http.MethodPost, "/rename", strings.NewReader(renameBody))
	rrRename := httptest.NewRecorder()
	mux.ServeHTTP(rrRename, reqRename)
	if rrRename.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rrRename.Code, rrRename.Body.String())
	}

	// 3. Delete file
	reqDelete := httptest.NewRequest(http.MethodDelete, "/?path=servers/ARMA3/renamed.txt", nil)
	rrDelete := httptest.NewRecorder()
	mux.ServeHTTP(rrDelete, reqDelete)
	if rrDelete.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rrDelete.Code, rrDelete.Body.String())
	}

	// 4. Delete in /data -> 403 Forbidden
	reqDeleteData := httptest.NewRequest(http.MethodDelete, "/?path=data/btc.db", nil)
	rrDeleteData := httptest.NewRecorder()
	mux.ServeHTTP(rrDeleteData, reqDeleteData)
	if rrDeleteData.Code != http.StatusForbidden {
		t.Errorf("expected status 403 for deleting in /data, got %d", rrDeleteData.Code)
	}
}

func TestFilesAPI_Upload(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	_ = w.WriteField("destination", "servers/ARMA3")

	fw, err := w.CreateFormFile("files", "script.sqf")
	if err != nil {
		t.Fatalf("failed to create form file: %v", err)
	}
	_, _ = fw.Write([]byte("hint 'uploaded';"))
	w.Close()

	req := httptest.NewRequest(http.MethodPost, "/upload", &b)
	req.Header.Set("Content-Type", w.FormDataContentType())
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", rr.Code, rr.Body.String())
	}

	// Verify file content via GET
	reqGet := httptest.NewRequest(http.MethodGet, "/content?path=servers/ARMA3/script.sqf", nil)
	rrGet := httptest.NewRecorder()
	mux.ServeHTTP(rrGet, reqGet)
	if rrGet.Code != http.StatusOK {
		t.Fatalf("expected uploaded file to be readable, got %d", rrGet.Code)
	}
}

func TestFilesAPI_CompressAndExtract(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	// 1. Compress servers/ARMA3 to servers/backup.zip
	compressBody := `{"paths":["servers/ARMA3"],"destinationZip":"servers/backup.zip"}`
	reqCompress := httptest.NewRequest(http.MethodPost, "/compress", strings.NewReader(compressBody))
	rrCompress := httptest.NewRecorder()
	mux.ServeHTTP(rrCompress, reqCompress)
	if rrCompress.Code != http.StatusOK {
		t.Fatalf("expected status 200 on compress, got %d: %s", rrCompress.Code, rrCompress.Body.String())
	}

	// 2. Extract servers/backup.zip into unzipped/
	extractBody := `{"zipPath":"servers/backup.zip","destination":"unzipped"}`
	reqExtract := httptest.NewRequest(http.MethodPost, "/extract", strings.NewReader(extractBody))
	rrExtract := httptest.NewRecorder()
	mux.ServeHTTP(rrExtract, reqExtract)
	if rrExtract.Code != http.StatusOK {
		t.Fatalf("expected status 200 on extract, got %d: %s", rrExtract.Code, rrExtract.Body.String())
	}

	// 3. Verify extracted content
	reqGet := httptest.NewRequest(http.MethodGet, "/content?path=unzipped/ARMA3/server.cfg", nil)
	rrGet := httptest.NewRecorder()
	mux.ServeHTTP(rrGet, reqGet)
	if rrGet.Code != http.StatusOK {
		t.Fatalf("expected extracted file to exist, got %d", rrGet.Code)
	}
}

func TestFilesAPI_DownloadZip(t *testing.T) {
	router, _ := setupFilesTest(t)
	mux := router.fileRoutes()

	// Download selected zip
	dlBody := `{"paths":["servers/ARMA3"],"filename":"custom_download.zip"}`
	reqDl := httptest.NewRequest(http.MethodPost, "/download-zip", strings.NewReader(dlBody))
	rrDl := httptest.NewRecorder()
	mux.ServeHTTP(rrDl, reqDl)

	if rrDl.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rrDl.Code)
	}

	if rrDl.Header().Get("Content-Type") != "application/zip" {
		t.Errorf("expected application/zip content type, got %s", rrDl.Header().Get("Content-Type"))
	}

	zipBytes := rrDl.Body.Bytes()
	r, err := zip.NewReader(bytes.NewReader(zipBytes), int64(len(zipBytes)))
	if err != nil {
		t.Fatalf("failed to parse downloaded zip: %v", err)
	}
	if len(r.File) == 0 {
		t.Errorf("expected zip to contain files")
	}
}
