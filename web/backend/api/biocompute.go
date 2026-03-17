package api

import (
	"encoding/json"
	"net/http"
)

// registerBiocomputeRoutes binds biocomputing endpoints.
func (h *Handler) registerBiocomputeRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/biocompute/spike", h.handleSpike)
	mux.HandleFunc("GET /api/biocompute/spikes", h.handleListSpikes)
}

// handleSpike ingests a CL1 spike event.
// POST /api/biocompute/spike
// Request body: { "process_id": "...", "timestamp": 123456789, "channel": 42, "amplitude": 1.2 }
func (h *Handler) handleSpike(w http.ResponseWriter, r *http.Request) {
	var spike struct {
		ProcessID string  `json:"process_id"`
		Timestamp int64   `json:"timestamp"`
		Channel   int     `json:"channel"`
		Amplitude float64 `json:"amplitude"`
	}
	if err := json.NewDecoder(r.Body).Decode(&spike); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: forward spike to the appropriate biocompute process

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "stored",
	})
}

// handleListSpikes returns spikes within a time range.
// GET /api/biocompute/spikes?process={id}&from=...&to=...
func (h *Handler) handleListSpikes(w http.ResponseWriter, r *http.Request) {
	processID := r.URL.Query().Get("process")
	if processID == "" {
		http.Error(w, "missing process parameter", http.StatusBadRequest)
		return
	}
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")

	// TODO: query spikes from memory process

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"spikes": []map[string]any{},
	})
}