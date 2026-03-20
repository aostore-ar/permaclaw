package aomem

import (
	"context"
	"fmt"
	"time"
)

// SpawnMemoryProcess creates a new AO memory process and registers it with the main process.
func (c *MainProcessClient) SpawnMemoryProcess(ctx context.Context, name string, public bool, tokenGate *TokenGate) (string, error) {
	// In a real implementation, you would send a transaction to spawn a new process
	// using the AO network's process creation mechanism (e.g., by sending a message to a faucet).
	// For now, we generate a dummy ID.
	procID := fmt.Sprintf("memory-%d", time.Now().UnixNano())
	if err := c.RegisterProcess(ctx, "memory", procID, name, public, tokenGate); err != nil {
		return "", err
	}
	return procID, nil
}

// SpawnBiocomputeProcess creates a new AO biocompute process and registers it.
func (c *MainProcessClient) SpawnBiocomputeProcess(ctx context.Context, name string, public bool, tokenGate *TokenGate) (string, error) {
	procID := fmt.Sprintf("biocompute-%d", time.Now().UnixNano())
	if err := c.RegisterProcess(ctx, "biocompute", procID, name, public, tokenGate); err != nil {
		return "", err
	}
	return procID, nil
}