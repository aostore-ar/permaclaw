package store

// Product represents an item in the aoStore catalog.
type Product struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Type        string                 `json:"type"` // "Device", "DApp", "Project"
	Version     string                 `json:"version,omitempty"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// Ad represents an advertising campaign.
type Ad struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Owner       string `json:"owner"` // wallet address
	Budget      int64  `json:"budget"`
	Impressions int64  `json:"impressions"`
	Clicks      int64  `json:"clicks"`
	// etc.
}

// DApp represents a DApp or Project.
type DApp struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Owner       string `json:"owner"`
	TokenID     string `json:"token_id,omitempty"` // for Projects
	// etc.
}

// Stake represents a staking entry.
type Stake struct {
	ID        string `json:"id"`
	Amount    int64  `json:"amount"`
	Token     string `json:"token"`
	StartTime int64  `json:"start_time"`
	EndTime   int64  `json:"end_time,omitempty"`
	Rewards   int64  `json:"rewards,omitempty"`
}