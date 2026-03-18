package store

import (
	"encoding/json"
	"net/http"
)

// DApp owner endpoints

func (h *Handler) handleDAppOwnerDashboard(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "dapp owner dashboard"})
}

func (h *Handler) handleCreateDApp(w http.ResponseWriter, r *http.Request) {
	// TODO: parse request, send to aoStore
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "dapp created"})
}

func (h *Handler) handleCreateSubOwner(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "subowner created"})
}

func (h *Handler) handleSendMessageToSubscribers(w http.ResponseWriter, r *http.Request) {
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "message sent"})
}

func (h *Handler) handleDAppAnalytics(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":        id,
		"analytics": map[string]any{},
	})
}

func (h *Handler) handleDAppReviews(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":      id,
		"reviews": []map[string]any{},
	})
}

func (h *Handler) handleDAppSubscriptions(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":            id,
		"subscriptions": []map[string]any{},
	})
}

func (h *Handler) handleEditDApp(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated", "id": id})
}

func (h *Handler) handleEditSubscriptionPlan(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "subscription plan updated", "id": id})
}

// User (normal) endpoints for DApps

func (h *Handler) handleUserDAppList(w http.ResponseWriter, r *http.Request) {
	// TODO: list all DApps for users
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"dapps": []map[string]any{},
	})
}

func (h *Handler) handleUserDAppDetail(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: get DApp details
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":          id,
		"name":        "Example DApp",
		"description": "Placeholder",
	})
}

func (h *Handler) handleSubscribeToDApp(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: handle subscription
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "subscribed", "dapp_id": id})
}

func (h *Handler) handleReviewDApp(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: submit review
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "review submitted", "dapp_id": id})
}

func (h *Handler) handleUserDAppAnalytics(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: user-specific analytics for a DApp they are subscribed to
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":        id,
		"analytics": map[string]any{},
	})
}

func (h *Handler) handleUserMessages(w http.ResponseWriter, r *http.Request) {
	// TODO: list messages from DApp owners
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"messages": []map[string]any{},
	})
}

func (h *Handler) handleUserMessageInfo(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: get specific message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"id":      id,
		"message": "placeholder",
	})
}