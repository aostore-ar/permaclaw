package biocompute

import "time"

// Spike represents a single neuron spike event.
type Spike struct {
	ID        string    `json:"id"`
	Timestamp int64     `json:"timestamp"`
	Channel   int       `json:"channel"`
	Amplitude float64   `json:"amplitude"`
	Experiment string   `json:"experiment,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// Experiment represents a biocompute experiment.
type Experiment struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	ProcessID   string    `json:"process_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}