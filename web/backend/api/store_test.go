package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func TestStoreRoutes_Registration(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	tests := []struct {
		method string
		path   string
		code   int
	}{
		{"GET", "/api/store/products", http.StatusOK},
		{"GET", "/api/store/products/123", http.StatusOK},
		{"POST", "/api/store/install", http.StatusOK},
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

func TestHandleListProducts_ReturnsJSON(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	req := httptest.NewRequest("GET", "/api/store/products?type=Device", nil)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var resp map[string]any
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if _, ok := resp["products"]; !ok {
		t.Error("response missing 'products' field")
	}
}

func TestHandleGetProduct_ReturnsProduct(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	req := httptest.NewRequest("GET", "/api/store/products/test-id", nil)
	rec := httptest.NewRecorder()
	mux.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	var resp map[string]any
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if id, ok := resp["id"]; !ok || id != "test-id" {
		t.Errorf("response id = %v, want 'test-id'", id)
	}
}

func TestHandleInstallProduct_AcceptsValidRequest(t *testing.T) {
	configPath := filepath.Join(t.TempDir(), "config.json")
	h := NewHandler(configPath)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	body := `{"product_id": "device-123", "version": "1.0.0"}`
	req := httptest.NewRequest("POST", "/api/store/install", bytes.NewBufferString(body))
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
	if resp["status"] != "installed" {
		t.Errorf("status = %q, want 'installed'", resp["status"])
	}
}