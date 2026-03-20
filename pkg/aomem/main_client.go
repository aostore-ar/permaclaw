package aomem

import (
	"context"
	"encoding/json"
	"fmt"
)

// MainProcessClient communicates with the global main process registry.
type MainProcessClient struct {
	processID string
	client    *AOClient
}

// NewMainProcessClient creates a client for the main registry process.
func NewMainProcessClient(processID string, wallet *goar.Wallet, muURL, cuURL string) *MainProcessClient {
	return &MainProcessClient{
		processID: processID,
		client:    NewAOClient(wallet, muURL, cuURL),
	}
}

// ListProcesses retrieves all processes of a given type owned by the wallet.
func (c *MainProcessClient) ListProcesses(ctx context.Context, procType string) ([]ProcessMeta, error) {
	resp, err := c.client.SendMessage(ctx, c.processID, "List", procType)
	if err != nil {
		return nil, fmt.Errorf("list processes: %w", err)
	}
	var procs []ProcessMeta
	if err := json.Unmarshal([]byte(resp.Output), &procs); err != nil {
		return nil, fmt.Errorf("parse response: %w", err)
	}
	return procs, nil
}

// RegisterProcess tells the main process about a newly created child process.
func (c *MainProcessClient) RegisterProcess(ctx context.Context, procType, procID, name string, public bool, tokenGate *TokenGate) error {
	req := struct {
		Type      string     `json:"type"`
		ProcessID string     `json:"process_id"`
		Name      string     `json:"name"`
		Public    bool       `json:"public"`
		TokenGate *TokenGate `json:"token_gate,omitempty"`
	}{
		Type:      procType,
		ProcessID: procID,
		Name:      name,
		Public:    public,
		TokenGate: tokenGate,
	}
	data, err := json.Marshal(req)
	if err != nil {
		return err
	}
	_, err = c.client.SendMessage(ctx, c.processID, "Register", string(data))
	return err
}

// UnregisterProcess removes a process from the main registry.
func (c *MainProcessClient) UnregisterProcess(ctx context.Context, procType, procID string) error {
	req := struct {
		Type      string `json:"type"`
		ProcessID string `json:"process_id"`
	}{
		Type:      procType,
		ProcessID: procID,
	}
	data, err := json.Marshal(req)
	if err != nil {
		return err
	}
	_, err = c.client.SendMessage(ctx, c.processID, "Unregister", string(data))
	return err
}