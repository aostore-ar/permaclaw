package api

import (
	"encoding/json"
	"net/http"
)

// registerMemoryRoutes binds permanent memory endpoints.
func (h *Handler) registerMemoryRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/memory/store", h.handleStoreMemory)
	mux.HandleFunc("GET /api/memory/list", h.handleListMemory)
	mux.HandleFunc("GET /api/memory/{id}", h.handleGetMemory)
	mux.HandleFunc("POST /api/memory/recover", h.handleRecoverMemory)
}

// handleStoreMemory stores a new memory.
// POST /api/memory/store
// Request body: { "process_id": "...", "content": "...", "type": "...", "importance": 0.5 }
func (h *Handler) handleStoreMemory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProcessID  string  `json:"process_id"`
		Content    string  `json:"content"`
		Type       string  `json:"type"`
		Importance float64 `json:"importance"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: call aomem client to store encrypted memory

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"id": "memory-id-placeholder",
	})
}

// handleListMemory lists stored memory IDs and metadata for a given process.
// GET /api/memory/list?process={id}
func (h *Handler) handleListMemory(w http.ResponseWriter, r *http.Request) {
	processID := r.URL.Query().Get("process")
	if processID == "" {
		http.Error(w, "missing process parameter", http.StatusBadRequest)
		return
	}

	// TODO: fetch from local index or query process

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"memories": []map[string]any{},
	})
}

// handleGetMemory retrieves a specific memory.
// GET /api/memory/{id}?process={id}
func (h *Handler) handleGetMemory(w http.ResponseWriter, r *http.Request) {
	memoryID := r.PathValue("id")
	processID := r.URL.Query().Get("process")
	if processID == "" {
		http.Error(w, "missing process parameter", http.StatusBadRequest)
		return
	}

	// TODO: fetch from aomem client

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":      memoryID,
		"content": "Memory content here (decrypted)",
		"type":    "conversation",
	})
}

// handleRecoverMemory rebuilds the local index from the main process.
// POST /api/memory/recover
// Request body: { "process_id": "..." } (optional, falls back to config)
func (h *Handler) handleRecoverMemory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProcessID string `json:"process_id"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	// TODO: call aomem.Recover(req.ProcessID) using config or provided ID

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "recovered",
	})
}