package api

import (
	"encoding/json"
	"net/http"
)

// registerStoreRoutes binds aoStore endpoints to the ServeMux.
func (h *Handler) registerStoreRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/store/products", h.handleListProducts)
	mux.HandleFunc("GET /api/store/products/{id}", h.handleGetProduct)
	mux.HandleFunc("POST /api/store/install", h.handleInstallProduct)
}

// handleListProducts returns products from aoStore, optionally filtered by type.
// GET /api/store/products?type=Device
func (h *Handler) handleListProducts(w http.ResponseWriter, r *http.Request) {
	// TODO: implement actual aoStore query
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"products": []map[string]any{},
	})
}

// handleGetProduct returns details of a specific product.
// GET /api/store/products/{id}
func (h *Handler) handleGetProduct(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: fetch product details
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":          id,
		"name":        "Example Product",
		"description": "Detailed description of the product",
		"type":        "Device",
	})
}

// handleInstallProduct installs a Device (skill) from aoStore.
// POST /api/store/install
// Request body: { "product_id": "...", "version": "..." }
func (h *Handler) handleInstallProduct(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductID string `json:"product_id"`
		Version   string `json:"version,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: call aoStore registry to download and install the skill

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "installed",
		"path":   "/path/to/installed/skill", // placeholder
	})
}