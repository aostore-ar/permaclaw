# 🦞 PermaClaw – Your Immortal personal AI Assistant that never Forgets

**PermaClaw** is an ultra‑lightweight, self‑hostable AI assistant with **permanent, wallet‑recoverable memory**.
It combines a minimal Go agent, a rich web UI, a decentralized app store (aoStore), and permanent storage on the AO network.

- **Never lose your memories** – all conversations, neuron spike data, and learned facts are stored in your own AO process.
- **Recover with just your wallet** – lose your device? Point to your wallet file and everything is back.
- **Built‑in app store** – browse and install Devices (skills), DApps, and Projects directly from the AO ecosystem.
- **Multi‑channel chat** – talk via the web UI, Telegram, Discord, WhatsApp, Matrix, IRC, and more.
- **Tool‑calling & extensibility** – run shell commands, read/write files, search the web, even control CL1 neurons in real time.

---

## 💖 Support PermaClaw

If you find PermaClaw useful, consider supporting its development:

**Donations**
- **Arweave**: `6kPw1RIVqycOj40DECUMjnf1CJdEmzCekXhF_tgxcZM`  
- **Solana** `3BhzthuuMyUnEABZC7cSMsRkNzwXVcceNiyu1g7Uw6Mg`  
- **Bitcoin**: `bc1qf48t5gcswvfmu6qsjwcrr6gwdxrpqkuu00qzyj`  
- **Ethereum**: `0x7ECce70Ea00400049447966127B8eECcD6f3612F`  

**Sponsorship**  
You can sponsor this project on GitHub! Click the **Sponsor** button at the top of the repository


## ✨ Who is PermaClaw for?

### 💾 Users Seeking Permanent Memory
You want an AI that remembers *everything* you’ve told it, across devices, forever.
With PermaClaw, your conversations are encrypted and stored on Arweave/AO.
Even if your laptop is stolen, your memories are safe – just restore with your wallet.

### 🧬 Biocomputer Engineers/ Developers
You run expensive experiments on **Cortical Labs CL1** hardware.
Every spike, every stimulation matters – losing that data is losing money.
PermaClaw captures neuron activity and stores it **permanently** in your AO process.
Later, you can replay, analyse, or use the data to train faster – all from your wallet.

---

## 🏗️ High‑Level Architecture
┌─────────────────────────────────────────────────────────────┐
│ PermaClaw Binary │
├─────────────┬───────────────────────────────┬───────────────┤
│ Web UI │ Go Backend │ Wallet │
│ (React) │ - Agent (picoclaw) │ (e.g. .aos.json)
│ - Chat │ - aoStore registry │ │
│ - Store │ - AO memory client │ │
│ - Memory │ - Tools & channels │ │
└─────────────┴─────────────────┬───────────────┴───────┬───────┘
│ │
▼ ▼
┌─────────────────┐ ┌─────────────────┐
│ aoStore Process│ │ User Memory Proc │
│ (public) │ │ (private) │
│ - product list │ │ - conversations │
│ - device specs │ │ - neuron spikes │
│ - ad placements│ │ - learned facts │
└─────────────────┘ └─────────────────┘

text

- **aoStore Process**: a public AO process that lists DApps, Devices, and Projects.
  PermaClaw queries it to populate the Store page.
- **User Memory Process**: a private AO process, spawned per user, that holds all their permanent data.
  The user’s wallet is used to sign every message, ensuring only they can access it.

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
First‑Run Setup (Spawning Your Memory Process)
During first run, PermaClaw will start the web UI at http://localhost:18800.
You need to provide your wallet and spawn your permanent AO process:

Open the web UI → Settings.

Enter the path to your Arweave wallet (e.g. /home/you/.aos.json).

Click Spawn Memory Process.
This sends a transaction to the AO network, creating a new process with the embedded Lua memory handlers.
The process ID is saved in your config file (~/.permaclaw/config.json).

You can also do this via the command line:

bash
permaclaw spawn-memory --wallet /path/to/wallet.json
Start chatting! Your memories are now automatically saved to your AO process.

### ⚙️ Configuration
PermaClaw reads a JSON config file from ~/.permaclaw/config.json (or set via PERMACLAW_CONFIG).
A minimal example:

json
{
  "wallet_path": "/home/user/.aos.json",
  "aostore": {
    "process_id": "aoStore-xxxxxx",
    "ao_node_url": "https://ao.arweave.net"
  },
  "aomem": {
    "process_id": ""   // filled after spawning
  },
  // All picoclaw options also work here (agents, channels, providers, tools...)
}
Environment variables override the config file:

PERMACLAW_WALLET_PATH

PERMACLAW_AOSTORE_PROCESS_ID

PERMACLAW_AOMEM_PROCESS_ID

### 🛍️ Using the aoStore
The Store tab in the web UI displays products from the aoStore process.

Devices are installable skills. Click Install – the skill package is downloaded from Arweave and placed in your workspace under skills/. The agent can then use it immediately.

DApps can be launched in an embedded iframe or external browser.

Projects show token and protocol information.

Advertisers: You can create campaigns and monitor performance via the UI. Ads appear inside participating products (just buy & monitor).

🧬 Biocomputing Integration (CL1)
PermaClaw includes a built‑in client for streaming CL1 neuron activity to your memory process.

Example Python script that sends spike data to PermaClaw’s API:

python
import requests
import time

# Assuming PermaClaw is running on localhost:18800
while True:
    spike = {
        "timestamp": time.time_ns(),
        "channel": 42,
        "amplitude": 1.2
    }
    requests.post("http://localhost:18800/api/memory/spike", json=spike)
    time.sleep(0.1)
The spike is automatically forwarded to your AO process and becomes part of your permanent memory.
Later, you can query the memory process via the UI or API to retrieve all recorded spikes for analysis.

### 🛠️ Development
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


### Contributing
We welcome contributions! Please read CONTRIBUTING.md and our Code of Conduct.
Areas to contribute:

New tools and skills

Additional channel adapters

Improvements to the AO memory client

Documentation and examples

### 📄 License
PermaClaw is licensed under the MIT License. See LICENSE for details.

### 🙏 Acknowledgements
picoclaw – the ultra‑lightweight Go agent

piclaw – the beautiful web‑first orchestrator

aoStore – the AO app store (add link when available)

Cortical Labs – CL1 neural interface inspiration
# PermaClaw
# permaclaw
