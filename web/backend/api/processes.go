package api

import (
	"encoding/json"
	"net/http"
)

// registerProcessesRoutes binds process management endpoints.
func (h *Handler) registerProcessesRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/processes", h.handleListProcesses)
	mux.HandleFunc("POST /api/processes/spawn", h.handleSpawnProcess)
	mux.HandleFunc("DELETE /api/processes/{type}/{id}", h.handleDeleteProcess)
	mux.HandleFunc("POST /api/processes/refresh", h.handleRefreshProcessCache)
}

// handleListProcesses returns all processes for the current wallet (from cache).
// GET /api/processes
func (h *Handler) handleListProcesses(w http.ResponseWriter, r *http.Request) {
	// TODO: load wallet from config, then return cached process list

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"memory":     []map[string]any{},
		"biocompute": []map[string]any{},
	})
}

// handleSpawnProcess creates a new process and registers it with the main process.
// POST /api/processes/spawn
// Request: { "type": "memory", "name": "work", "public": false }
func (h *Handler) handleSpawnProcess(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Type   string `json:"type"` // "memory" or "biocompute"
		Name   string `json:"name"`
		Public bool   `json:"public"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	// TODO: spawn new AO process and register with main process

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"id": "new-process-id-placeholder",
	})
}

// handleDeleteProcess unregisters a process from the main process.
// DELETE /api/processes/{type}/{id}
func (h *Handler) handleDeleteProcess(w http.ResponseWriter, r *http.Request) {
	procType := r.PathValue("type")
	procID := r.PathValue("id")

	// TODO: unregister from main process

	w.WriteHeader(http.StatusNoContent)
}

// handleRefreshProcessCache manually refreshes the local process cache from the main process.
// POST /api/processes/refresh
func (h *Handler) handleRefreshProcessCache(w http.ResponseWriter, r *http.Request) {
	// TODO: query main process and update cache

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "refreshed",
	})
}