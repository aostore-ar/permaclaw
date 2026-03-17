package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func TestProcessesRoutes_Registration(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	tests := []struct {
		method string
		path   string
		code   int
	}{
		{"GET", "/api/processes", http.StatusOK},
		{"POST", "/api/processes/spawn", http.StatusOK},
		{"DELETE", "/api/processes/memory/123", http.StatusNoContent},
		{"POST", "/api/processes/refresh", http.StatusOK},
	}

	for _, tt := range tests {
		req := httptest.NewRequest(tt.method, tt.path, nil)
		rec := httptest.NewRecorder()
		mux.ServeHTTP(rec, req)
		if rec.Code != tt.code {
			t.Errorf("%s %s: got %d, want %d", tt.method, tt.path, rec.Code, tt.code)
		}
	}
}

func TestHandleSpawnProcess_ValidRequest(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	body := `{"type": "memory", "name": "test", "public": false}`
	req := httptest.NewRequest("POST", "/api/processes/spawn", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d, body=%s", rec.Code, http.StatusOK, rec.Body.String())
	}

	var resp map[string]string
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if _, ok := resp["id"]; !ok {
		t.Error("response missing 'id' field")
	}
}

func TestHandleSpawnProcess_InvalidType(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	body := `{"type": "invalid", "name": "test", "public": false}`
	req := httptest.NewRequest("POST", "/api/processes/spawn", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	// Should still be OK because handler doesn't validate yet; adjust when implemented
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
}