package store

import (
	"encoding/json"
	"net/http"
)

// Basic product catalog (what we originally planned)

func (h *Handler) handleListProducts(w http.ResponseWriter, r *http.Request) {
	productType := r.URL.Query().Get("type")
	// TODO: query aoStore for products, filter by type if provided
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"products": []map[string]any{
			{
				"id":          "device-123",
				"name":        "Web Search Skill",
				"description": "A skill that searches the web",
				"type":        "Device",
				"version":     "1.0.0",
			},
		},
	})
}

func (h *Handler) handleGetProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: fetch product details from aoStore
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":          id,
		"name":        "Example Product",
		"description": "Detailed description of the product",
		"type":        "Device",
		"metadata":    map[string]any{},
	})
}

func (h *Handler) handleInstallProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductID string `json:"product_id"`
		Version   string `json:"version,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: download and install the skill, update workspace

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "installed",
		"path":   "/path/to/installed/skill", // placeholder
	})
}