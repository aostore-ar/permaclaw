#  🧬 PermaClaw – Your Immortal Personal AI Assistant that Never Forgets

**PermaClaw** is an ultra‑lightweight, self‑hostable AI assistant with **permanent, wallet‑recoverable memory**.  
It combines a minimal Go agent, a rich web UI, a decentralized app store (aoStore), and permanent storage on the AO network.

- **Never lose your memories** – all conversations, neuron spike data, and learned facts are stored in your own AO processes.
- **Recover with just your wallet** – lose your device? Point to your wallet file and everything is back.
- **Multiple processes per wallet** – create separate memory spaces for personal, work, experiments, etc.
- **Built‑in app store** – browse and install Devices (skills), DApps, and Projects directly from the AO ecosystem.
- **Multi‑channel chat** – talk via the web UI, Telegram, Discord, WhatsApp, Matrix, IRC, and more.
- **Tool‑calling & extensibility** – run shell commands, read/write files, search the web, even control CL1 neurons in real time.

---

## 💖 Support PermaClaw

If you find PermaClaw useful, consider supporting its development:

**Donations**
- **Arweave**: `6kPw1RIVqycOj40DECUMjnf1CJdEmzCekXhF_tgxcZM`  
- **Solana**: `3BhzthuuMyUnEABZC7cSMsRkNzwXVcceNiyu1g7Uw6Mg`  
- **Bitcoin**: `bc1qf48t5gcswvfmu6qsjwcrr6gwdxrpqkuu00qzyj`  
- **Ethereum**: `0x7ECce70Ea00400049447966127B8eECcD6f3612F`  

**Sponsorship**  
You can sponsor this project on GitHub! Click the **Sponsor** button at the top of the repository.

---

## ✨ Who is PermaClaw for?

### 💾 Users Seeking Permanent Memory
You want an AI that remembers *everything* you’ve told it, across devices, forever.  
With PermaClaw, your conversations are encrypted and stored on AO.  
Even if your laptop is stolen, your memories are safe – just restore with your wallet.

### 🧬 Biocomputer Engineers / Developers
You run expensive experiments on **Cortical Labs CL1** hardware.  
Every spike, every stimulation matters – losing that data is losing money.  
PermaClaw captures neuron activity and stores it **permanently** in your own AO process.  
Later, you can replay, analyse, or use the data to train faster – all from your wallet.

---

## 🏗️ Architecture

PermaClaw is built on three layers: the **user’s machine**, the **AO network**, and a **global registry process**. Data flows are designed to be efficient – the registry is queried only once at startup, and all runtime operations use a local cache.

### Component Overview
┌─────────────────────────────────────────────────────────────┐
│ User's Machine │
│ │
│ ┌─────────────┐ ┌───────────────────────────────────┐ │
│ │ Config │ │ PermaClaw Backend │ │
│ │ (wallet, │───▶│ ┌─────────────────────────────┐ │ │
│ │ main ID) │ │ │ Startup: query main proc │ │ │
│ └─────────────┘ │ │ → build local cache │ │ │
│ │ └─────────────────────────────┘ │ │
│ │ │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Runtime: use cache │ │ │
│ │ │ (no main process calls) │ │ │
│ │ └─────────────────────────────┘ │ │
│ │ │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ On spawn/delete: │ │ │
│ │ │ • update main process │ │ │
│ │ │ • refresh cache │ │ │
│ │ └─────────────────────────────┘ │ │
│ └───────────┬───────────────────────┘ │
│ │ │
│ ▼ │
│ ┌─────────────────────┐ │
│ │ Local Cache │ │
│ │ (processes.json) │ │
│ └─────────────────────┘ │
│ │ │
│ │ (direct calls to child │
│ │ processes using cached │
│ │ IDs) │
└─────────────────────────────────┼───────────────────────────┘
│
┌─────────────────────────┼─────────────────────────┐
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Memory Proc 1 │ │ Memory Proc 2 │ │ Biocompute Proc │
│ (personal) │ │ (work) │ │ (lab rig) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
▲ ▲ ▲
│ │ │
└─────────────────────────┼─────────────────────────┘
│
│ (only during startup /
│ mutation events)
▼
┌─────────────────┐
│ Main Process │
│ (global registry)│
└─────────────────┘

text

### Key Components

- **Main Process (Global Registry)**  
  - A well‑known AO process with a **fixed ID** (provided in the default config).  
  - Stores a mapping: `wallet_address → [ { process_id, name, type, public?, created_at }, ... ]`.  
  - Acts as the **single source of truth** for all processes owned by a wallet.  
  - Queried only at startup and when processes are created/deleted – never during normal chat or memory access.

- **Memory Processes**  
  - Each is a separate AO process holding encrypted conversation history, facts, and other long‑term data.  
  - Users can create **multiple** memory processes (e.g., “personal”, “work”, “experiments”).  
  - Data is written and read directly to these processes using the cached process ID.

- **Biocompute Processes**  
  - Similar to memory processes, but dedicated to storing CL1 neuron spike data.  
  - Each can correspond to a different physical rig or experiment.  
  - Spike ingestion endpoints forward data to the appropriate process.

- **aoStore Process**  
  - A public AO process listing DApps, Devices, and Projects.  
  - Queried to populate the Store page in the web UI.

- **Local Cache**  
  - Stored in `~/.permaclaw/processes.json`.  
  - Built at startup by querying the main process once.  
  - Used for all runtime operations – **no per‑call overhead** to the main process.  
  - Automatically updated when you spawn or delete a process.

- **Wallet**  
  - Your Arweave wallet (JSON file) is used to sign every message sent to AO.  
  - It proves ownership of processes and decrypts data client‑side.  
  - **Only the wallet path** is stored in the config; the private key never leaves your machine.

### Data Flow

1. **Startup**  
   - PermaClaw reads `config.json` and loads the wallet.  
   - Queries the main process with `List` → receives all process IDs for that wallet.  
   - Writes the list to `processes.json` and keeps it in memory.

2. **Runtime**  
   - All chat, memory storage/retrieval, and spike ingestion use the cached process IDs.  
   - **No calls to the main process** – operations go directly to the child processes.

3. **Spawning a New Process**  
   - User clicks “Spawn” in the UI (or uses CLI).  
   - Backend creates a new AO process with the appropriate Lua handler.  
   - Sends a `Register` message to the main process, passing wallet, new process ID, name, type, and public flag.  
   - Updates the local cache immediately.

4. **Deleting a Process**  
   - User deletes a process (or unregisters it).  
   - Backend sends an `Unregister` message to the main process.  
   - Removes the process from the local cache.

5. **Recovery on a New Device**  
   - Install PermaClaw, provide the same wallet and main process ID.  
   - Backend queries the main process again and rebuilds the cache.  
   - All child processes become available without ever having stored their IDs permanently.

### Why This Design?

- **No Single Point of Failure** – The main process is only used for discovery, not for data storage or retrieval.  
- **Scalable** – Users can have hundreds of processes; the main process handles only a few messages per process lifetime.  
- **Privacy** – All data in child processes is encrypted; only the wallet holder can decrypt it.  
- **Recoverable** – The wallet alone gives you access to every process you ever created.

---

## 🚀 Quick Start

### Prerequisites
- Linux, macOS, or Windows (with WSL)
- [Go 1.22+](https://golang.org/dl/) (only needed if building from source)
- An Arweave wallet (e.g. `aos.json` – see [arweave.org](https://arweave.org))

### Download the Pre‑built Binary
```bash
# Linux (amd64)
curl -L https://github.com/yourname/permaclaw/releases/latest/download/permaclaw-linux-amd64 -o permaclaw
chmod +x permaclaw
./permaclaw
Build from Source
bash
git clone https://github.com/yourname/permaclaw.git
cd permaclaw
make build
./bin/permaclaw
First‑Run Setup
During first run, PermaClaw will start the web UI at http://localhost:18800.
You need to provide your wallet and the main process ID (a well‑known registry process). The default main process ID is included in the config template; you can use it unless you want to run your own registry.

Open the web UI → Settings.

Enter the path to your Arweave wallet (e.g. /home/you/.aos.json).

(Optional) Change the main process ID if you have a custom registry.

Click Fetch Processes – this queries the main process and builds your local cache.

If you have no processes yet, click Spawn Memory Process to create your first memory process (give it a name like “personal”).

You can also do this via the command line:

bash
permaclaw process list --wallet /path/to/wallet.json
permaclaw process spawn --type memory --name personal --wallet /path/to/wallet.json
Start chatting! Your memories are now automatically saved to your chosen memory process.

⚙️ Configuration
PermaClaw reads a JSON config file from ~/.permaclaw/config.json (or set via PERMACLAW_CONFIG).
A minimal example:

json
{
  "wallet_path": "/home/user/.aos.json",
  "main_process_id": "Q0K7nJX8y9p2LmN4rT5vB6cX7zA8sD9fG0hJ1kL2",
  "aostore": {
    "enabled": true,
    "process_id": "aoStore-xxxxxx",
    "ao_node_url": "https://ao.arweave.net"
  },
  // All picoclaw options also work here (agents, channels, providers, tools...)
}
Environment variables override the config file:

PERMACLAW_WALLET_PATH

PERMACLAW_MAIN_PROCESS_ID

PERMACLAW_AOSTORE_PROCESS_ID

etc.

The local cache of your processes is stored separately in ~/.permaclaw/processes.json – you never need to edit it manually.

🛍️ Using the aoStore
The Store tab in the web UI displays products from the aoStore process.

Devices are installable skills. Click Install – the skill package is downloaded from Arweave and placed in your workspace under skills/. The agent can then use it immediately.

DApps can be launched in an embedded iframe or external browser.

Projects show token and protocol information.

Advertisers can create campaigns and monitor performance via the UI.

🧬 Biocomputing Integration (CL1)
PermaClaw includes a built‑in client for streaming CL1 neuron activity to your biocompute process(es).

Example Python script that sends spike data to PermaClaw’s API:

python
import requests
import time

while True:
    spike = {
        "timestamp": time.time_ns(),
        "channel": 42,
        "amplitude": 1.2
    }
    requests.post("http://localhost:18800/api/biocompute/spike", json=spike)
    time.sleep(0.1)
The spike is automatically forwarded to the appropriate biocompute process (selected by process ID in the request) and becomes part of your permanent memory. Later, you can query the process via the UI or API to retrieve all recorded spikes for analysis.

🛠️ Development
Repository Structure
text
cmd/permaclaw/          → main entry point
pkg/                    → Go packages
  ├── agent/             → core agent (from picoclaw)
  ├── aomem/             → AO memory client & Lua handlers
  ├── skills/registries/aostore → aoStore registry
  └── ... (other picoclaw packages)
web/
  ├── backend/           → HTTP API for frontend
  └── frontend/          → React UI (from piclaw)
scripts/                 → deployment helpers (spawn memory, etc.)
Building
bash
make build        # builds Go binary and embeds frontend
make run          # builds and runs locally
make test         # runs all tests
🤝 Contributing
We welcome contributions! Please read CONTRIBUTING.md and our Code of Conduct.
Areas to contribute:

New tools and skills

Additional channel adapters

Improvements to the AO memory client

Documentation and examples

📄 License
PermaClaw is licensed under the MIT License. See LICENSE for details.

🙏 Acknowledgements
picoclaw – the ultra‑lightweight Go agent

piclaw – the beautiful web‑first orchestrator

aoStore – the AO app store (link when available)

Cortical Labs – CL1 neural interface inspiration