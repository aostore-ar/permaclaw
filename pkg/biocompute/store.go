package biocompute

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

// LocalStore provides a local cache for spikes (optional).
type LocalStore struct {
	path string
	mu   sync.RWMutex
}

// NewLocalStore creates a local store at the given directory.
func NewLocalStore(workspace string) *LocalStore {
	return &LocalStore{
		path: filepath.Join(workspace, "biocompute", "spikes.json"),
	}
}

// SaveSpikes writes spikes to disk.
func (s *LocalStore) SaveSpikes(spikes []Spike) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}
	data, err := json.MarshalIndent(spikes, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.path, data, 0o644)
}

// LoadSpikes reads spikes from disk.
func (s *LocalStore) LoadSpikes() ([]Spike, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	data, err := os.ReadFile(s.path)
	if err != nil {
		if os.IsNotExist(err) {
			return []Spike{}, nil
		}
		return nil, err
	}
	var spikes []Spike
	if err := json.Unmarshal(data, &spikes); err != nil {
		return nil, err
	}
	return spikes, nil
}