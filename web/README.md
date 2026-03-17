# PermaClaw Web

This directory contains the standalone web service for **PermaClaw** – the immortal, self‑hostable AI assistant with permanent wallet‑recoverable memory.

It provides a complete unified web interface, acting as a dashboard, configuration center, and interactive console (channel client) for the core `permaclaw` engine. The web UI lets you chat, browse the aoStore, manage your permanent memory, and configure all aspects of the system.

## Architecture

The service is structured as a monorepo containing both the backend and frontend code to ensure high cohesion and simplify deployment.

*   **`backend/`**: The Go‑based web server. It provides RESTful APIs, manages WebSocket connections for chat, and handles the lifecycle of the `permaclaw` process (including spawning memory processes and interacting with AO). It eventually embeds the compiled frontend assets into a single executable.
    *   New API endpoints: `/api/store` (aoStore product listing & installation), `/api/memory` (permanent memory operations), `/api/biocompute` (CL1 spike streaming).
*   **`frontend/`**: The Vite + React + TanStack Router single‑page application (SPA). It provides the interactive user interface, including:
    *   Chat with real‑time streaming.
    *   **Store** – browse and install skills (Devices) from aoStore.
    *   **Memory** – view, search, and manage your permanent memories.
    *   **Biocomputing** – live spike visualization and analysis (if CL1 connected).
    *   Configuration panels for models, channels, tools, and wallet.

## Getting Started

### Prerequisites

*   Go 1.25+
*   Node.js 20+ with pnpm (only needed for development)
*   Docker (optional, for running test services like IRC)

### Development

Run both the frontend dev server and the Go backend simultaneously:

```bash
make dev

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


##API Overview (partial)
Endpoint	Description
GET /api/store/products	List products from aoStore (filter by type)
POST /api/store/install	Download and install a Device (skill)
POST /api/memory/store	Store a new memory (encrypted, sent to AO)
GET /api/memory/list	List memory IDs and metadata
GET /api/memory/{id}	Retrieve a specific memory
POST /api/memory/recover	Rebuild local index from AO process
POST /api/biocompute/spike	Ingest a CL1 spike event (authenticated via wallet)
GET /api/config	Get current configuration
PUT /api/config	Update configuration
All endpoints are documented in the code and can be explored via the web UI’s developer tools.

## Environment Variables
PERMACLAW_CONFIG – path to the config file (default ~/.permaclaw/config.json)

PERMACLAW_HOME – override the home directory (default ~/.permaclaw)

PERMACLAW_WALLET_PATH – path to the Arweave wallet JSON file

Integration with the Core
The web service communicates with the core PermaClaw agent via:

The message bus (for chat interactions) – when both are running in the same process.

Direct function calls – when embedded in the same binary.

HTTP APIs – when running as a separate gateway (the default).

For permanent memory, it uses the pkg/aomem client to send encrypted messages to the user’s private AO process.

## Contributing
We welcome contributions! Please see the main Contributing Guide and join our Discord.