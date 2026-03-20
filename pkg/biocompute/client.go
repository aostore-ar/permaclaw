package biocompute

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/aostore-ar/permaclaw/pkg/aomem"
	"github.com/everFinance/goar"
)

// Client provides operations for biocompute data.
type Client struct {
	memClient *aomem.MemoryClient // uses an underlying memory process
}

// NewClient creates a biocompute client that stores data in the given AO memory process.
func NewClient(processID string, wallet *goar.Wallet, muURL, cuURL string) *Client {
	return &Client{
		memClient: aomem.NewMemoryClient(processID, wallet, muURL, cuURL),
	}
}

// RecordSpike stores a spike event in the process.
func (c *Client) RecordSpike(ctx context.Context, spike Spike) error {
	data, err := json.Marshal(spike)
	if err != nil {
		return err
	}
	_, err = c.memClient.StoreMemory(ctx, string(data), "spike", 0.5)
	return err
}

// QuerySpikes retrieves spikes from the process, optionally filtered by experiment and time range.
// Since we store spikes as memories, we need to fetch all and filter client‑side for now.
// In a real implementation, the AO process could have more sophisticated querying.
func (c *Client) QuerySpikes(ctx context.Context, experiment string, from, to time.Time) ([]Spike, error) {
	ids, err := c.memClient.ListMemories(ctx)
	if err != nil {
		return nil, err
	}
	var spikes []Spike
	for _, id := range ids {
		mem, err := c.memClient.GetMemory(ctx, id)
		if err != nil {
			continue // skip errors
		}
		if mem.Type != "spike" {
			continue
		}
		var spike Spike
		if err := json.Unmarshal([]byte(mem.Content), &spike); err != nil {
			continue
		}
		if experiment != "" && spike.Experiment != experiment {
			continue
		}
		if !from.IsZero() && spike.Timestamp < from.UnixMilli() {
			continue
		}
		if !to.IsZero() && spike.Timestamp > to.UnixMilli() {
			continue
		}
		spikes = append(spikes, spike)
	}
	return spikes, nil
}