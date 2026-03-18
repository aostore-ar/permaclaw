package store

import (
	"encoding/json"
	"net/http"
)

// Advertiser endpoints

func (h *Handler) handleAdvertiserDashboard(w http.ResponseWriter, r *http.Request) {
	// TODO: fetch advertiser dashboard data from aoStore
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"status": "advertiser dashboard placeholder",
	})
}

func (h *Handler) handleCreatePersonalAd(w http.ResponseWriter, r *http.Request) {
	// TODO: parse request, send to aoStore
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ad created"})
}

func (h *Handler) handleListPersonalAds(w http.ResponseWriter, r *http.Request) {
	// TODO: list personal ads
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"ads": []map[string]any{},
	})
}

func (h *Handler) handleUpdatePersonalAd(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: parse update, send to aoStore
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func (h *Handler) handleDeletePersonalAd(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: delete
	w.WriteHeader(http.StatusNoContent)
}

// DApp owner advertising endpoints

func (h *Handler) handleDAppOwnerAdsDashboard(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "dapp owner ads dashboard"})
}

func (h *Handler) handleCreateBusinessAd(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "business ad created"})
}

func (h *Handler) handleListBusinessAds(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"ads": []map[string]any{},
	})
}

func (h *Handler) handleUpdateBusinessAd(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func (h *Handler) handleDeleteBusinessAd(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	w.WriteHeader(http.StatusNoContent)
}

// Trader endpoints

func (h *Handler) handleTraderDashboard(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "trader dashboard"})
}

func (h *Handler) handleAdMarketplace(w http.ResponseWriter, r *http.Request) {
	// TODO: list ads available for trading
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"ads": []map[string]any{},
	})
}

func (h *Handler) handleAdMarketplaceInfo(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: get ad info
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": id, "info": "placeholder"})
}

func (h *Handler) handleEditAdForTrade(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: edit ad listing for trade
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func (h *Handler) handleDelistAd(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	w.WriteHeader(http.StatusNoContent)
}