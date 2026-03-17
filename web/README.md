# PermaClaw Web
This directory contains the standalone web service for **PermaClaw** – the immortal, self‑hostable AI assistant with permanent wallet‑recoverable memory.

It provides a complete unified web interface, acting as a dashboard, configuration center, and interactive console for the core `permaclaw` engine. The web UI lets you chat, browse the aoStore, manage your permanent memories and biocompute processes, and configure all aspects of the system.

## Architecture

The service is structured as a monorepo containing both the backend and frontend code to ensure high cohesion and simplify deployment.

* **`backend/`**: The Go‑based web server. It provides RESTful APIs, manages WebSocket connections for chat, and handles the lifecycle of `permaclaw` processes (spawning, registering, and communicating with AO processes). It embeds the compiled frontend assets into a single executable.
    - **API groups**:
        - `/api/processes` – list, spawn, delete memory & biocompute processes (using the global main process as registry)
        - `/api/store` – aoStore product listing & installation
        - `/api/memory` – store/retrieve memories from a specific memory process
        - `/api/biocompute` – ingest CL1 spike events
        - `/api/config` – configuration management
        - `/api/gateway` – control the gateway process (start/stop)
        - `/api/channels` – channel catalog for frontend navigation
        - `/api/models`, `/api/skills`, `/api/tools` – model and tool management
        - `/api/oauth` – OAuth flows for LLM providers
        - `/api/system` – auto‑start and launcher settings
* **`frontend/`**: The Vite + React + TanStack Router single‑page application (SPA). It provides the interactive user interface, including:
    - Chat with real‑time streaming (WebSocket)
    - **Processes** – view, create, and delete memory/biocompute processes
    - **Store** – browse and install skills from aoStore
    - **Memory** – view, search, and manage memories for a selected process
    - **Biocomputing** – live spike visualization and analysis (if CL1 connected)
    - **Settings** – configure wallet, main process ID, models, channels, tools

### Local Cache

All processes owned by your wallet are fetched from the global main process **once at startup** and stored in a local cache (`~/.permaclaw/processes.json`). Runtime operations (chat, memory access, spike ingestion) use this cache – **no per‑call overhead** to the main process. The cache is automatically updated when you spawn or delete a process.

---

## Getting Started

### Prerequisites

- Go 1.25+
- Node.js 20+ with pnpm (only needed for development)
- Docker (optional, for running test services like IRC)

### Development

Run both the frontend dev server and the Go backend simultaneously:

```bash
make dev
Or run them separately:

bash
make dev-frontend   # Vite dev server (port 5173)
make dev-backend    # Go backend (port 18800)
Build
Build the frontend and embed it into a single Go binary:

bash
make build
The output binary is backend/permaclaw-web. You can run it directly:

bash
./backend/permaclaw-web
The web UI will be available at http://localhost:18800.

Other Commands
bash
make test    # Run backend tests and frontend lint
make lint    # Run go vet and prettier/eslint
make clean   # Remove all build artifacts
API Overview (partial)


## Endpoint	Description
GET /api/processes	List all processes owned by the wallet (from cache)
POST /api/processes/spawn	Create a new memory or biocompute process
DELETE /api/processes/{type}/{id}	Unregister a process
POST /api/processes/refresh	Force a refresh of the local cache from the main process
GET /api/store/products	List products from aoStore (filter by type)
POST /api/store/install	Download and install a Device (skill)
POST /api/memory/store	Store a new memory in a specified process
GET /api/memory/list?process={id}	List memory IDs for a process
GET /api/memory/{id}?process={id}	Retrieve a specific memory
POST /api/biocompute/spike	Ingest a CL1 spike event (authenticated via wallet)
GET /api/biocompute/spikes?process={id}&from=...&to=...	Query spikes from a biocompute process
GET /api/config	Get current configuration
PUT /api/config	Update configuration
GET /api/gateway/status	Get gateway process status
All endpoints are documented in the code and can be explored via the web UI’s developer tools.

##Environment Variables
PERMACLAW_CONFIG – path to the config file (default ~/.permaclaw/config.json)

PERMACLAW_HOME – override the home directory (default ~/.permaclaw)

PERMACLAW_WALLET_PATH – path to the Arweave wallet JSON file

PERMACLAW_MAIN_PROCESS_ID – override the global main process ID

Integration with the Core
The web service communicates with the core PermaClaw agent via:

The message bus – for chat interactions when both are running in the same process.

Direct function calls – when embedded in the same binary.

HTTP APIs – when running as a separate gateway (the default).

For permanent memory, it uses the pkg/aomem client to send encrypted messages to the user’s private AO processes (using cached process IDs).

##Contributing
We welcome contributions! Please see the main Contributing Guide and join our Discord.

