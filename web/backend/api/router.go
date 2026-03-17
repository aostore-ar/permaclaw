package api

import (
	"net/http"
	"sync"

	"github.com/aostore-ar/permaclaw/web/backend/launcherconfig"
)

// Handler serves HTTP API requests.
type Handler struct {
	configPath           string
	serverPort           int
	serverPublic         bool
	serverPublicExplicit bool
	serverCIDRs          []string
	oauthMu              sync.Mutex
	oauthFlows           map[string]*oauthFlow
	oauthState           map[string]string
}

// NewHandler creates an instance of the API handler.
func NewHandler(configPath string) *Handler {
	return &Handler{
		configPath: configPath,
		serverPort: launcherconfig.DefaultPort,
		oauthFlows: make(map[string]*oauthFlow),
		oauthState: make(map[string]string),
	}
}

// SetServerOptions stores current backend listen options for fallback behavior.
func (h *Handler) SetServerOptions(port int, public bool, publicExplicit bool, allowedCIDRs []string) {
	h.serverPort = port
	h.serverPublic = public
	h.serverPublicExplicit = publicExplicit
	h.serverCIDRs = append([]string(nil), allowedCIDRs...)
}

// RegisterRoutes binds all API endpoint handlers to the ServeMux.
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	// Config CRUD
	h.registerConfigRoutes(mux)

	// Pico Channel (WebSocket chat)
	h.registerPicoRoutes(mux)

	// Gateway process lifecycle
	h.registerGatewayRoutes(mux)

	// Session history
	h.registerSessionRoutes(mux)

	// OAuth login and credential management
	h.registerOAuthRoutes(mux)

	// Model list management
	h.registerModelRoutes(mux)

	// Channel catalog (for frontend navigation/config pages)
	h.registerChannelRoutes(mux)

	// Skills and tools support/actions
	h.registerSkillRoutes(mux)
	h.registerToolRoutes(mux)

	// OS startup / launch-at-login
	h.registerStartupRoutes(mux)

	// Launcher service parameters (port/public)
	h.registerLauncherConfigRoutes(mux)

	// === PermaClaw‑specific routes ===
	// aoStore product listing and installation
	h.registerStoreRoutes(mux)

	// Permanent memory operations (store, retrieve, list, recover)
	h.registerMemoryRoutes(mux)

	// Biocomputing endpoints (CL1 spike ingestion)
	h.registerBiocomputeRoutes(mux)

	// Process management (list, spawn, delete processes)
	h.registerProcessesRoutes(mux)
}

// registerStoreRoutes binds aoStore endpoints to the ServeMux.
func (h *Handler) registerStoreRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/store/products", h.handleListProducts)
	mux.HandleFunc("GET /api/store/products/{id}", h.handleGetProduct)
	mux.HandleFunc("POST /api/store/install", h.handleInstallProduct)
}

// registerMemoryRoutes binds permanent memory endpoints.
func (h *Handler) registerMemoryRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/memory/store", h.handleStoreMemory)
	mux.HandleFunc("GET /api/memory/list", h.handleListMemory)
	mux.HandleFunc("GET /api/memory/{id}", h.handleGetMemory)
	mux.HandleFunc("POST /api/memory/recover", h.handleRecoverMemory)
}

// registerBiocomputeRoutes binds biocomputing endpoints.
func (h *Handler) registerBiocomputeRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/biocompute/spike", h.handleSpike)
	mux.HandleFunc("GET /api/biocompute/spikes", h.handleListSpikes)
}

// registerProcessesRoutes binds process management endpoints.
func (h *Handler) registerProcessesRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/processes", h.handleListProcesses)
	mux.HandleFunc("POST /api/processes/spawn", h.handleSpawnProcess)
	mux.HandleFunc("DELETE /api/processes/{type}/{id}", h.handleDeleteProcess)
	mux.HandleFunc("POST /api/processes/refresh", h.handleRefreshProcessCache)
}