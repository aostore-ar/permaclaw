package store

import (
	"net/http"
)

// Handler holds dependencies for store endpoints.
type Handler struct {
	configPath string
	// later: aoClient, wallet, etc.
}

// NewHandler creates a new store handler.
func NewHandler(configPath string) *Handler {
	return &Handler{
		configPath: configPath,
	}
}

// RegisterRoutes mounts all store routes on the given ServeMux.
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	// Catalog
	mux.HandleFunc("GET /api/store/products", h.handleListProducts)
	mux.HandleFunc("GET /api/store/products/{id}", h.handleGetProduct)
	mux.HandleFunc("POST /api/store/install", h.handleInstallProduct)

	// Ads
	mux.HandleFunc("GET /api/store/ads/advertiser/dashboard", h.handleAdvertiserDashboard)
	mux.HandleFunc("POST /api/store/ads/advertiser/create", h.handleCreatePersonalAd)
	mux.HandleFunc("GET /api/store/ads/advertiser/list", h.handleListPersonalAds)
	mux.HandleFunc("PUT /api/store/ads/advertiser/{id}", h.handleUpdatePersonalAd)
	mux.HandleFunc("DELETE /api/store/ads/advertiser/{id}", h.handleDeletePersonalAd)

	// ... similarly for dappOwner and trader

	// DApps
	mux.HandleFunc("GET /api/store/dapps/owner/dashboard", h.handleDAppOwnerDashboard)
	mux.HandleFunc("POST /api/store/dapps/owner/create", h.handleCreateDApp)
	mux.HandleFunc("GET /api/store/dapps/owner/{id}/analytics", h.handleDAppAnalytics)
	mux.HandleFunc("GET /api/store/dapps/owner/{id}/subscriptions", h.handleDAppSubscriptions)
	mux.HandleFunc("GET /api/store/dapps/user/list", h.handleUserDAppList)
	mux.HandleFunc("GET /api/store/dapps/user/{id}", h.handleUserDAppDetail)
	mux.HandleFunc("POST /api/store/dapps/user/{id}/subscribe", h.handleSubscribeToDApp)
	mux.HandleFunc("POST /api/store/dapps/user/{id}/review", h.handleReviewDApp)

	// Staking
	mux.HandleFunc("GET /api/store/staking/dashboard", h.handleStakingDashboard)
	mux.HandleFunc("POST /api/store/staking/stake", h.handleStake)
	mux.HandleFunc("GET /api/store/staking/history", h.handleStakeHistory)
	mux.HandleFunc("GET /api/store/staking/rewards", h.handleRewards)
}