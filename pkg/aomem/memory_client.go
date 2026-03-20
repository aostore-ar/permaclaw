package aomem

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

// MemoryClient provides operations for a single memory process.
type MemoryClient struct {
	processID string
	client    *AOClient
}

// NewMemoryClient creates a client for a specific memory process.
func NewMemoryClient(processID string, wallet *goar.Wallet, muURL, cuURL string) *MemoryClient {
	return &MemoryClient{
		processID: processID,
		client:    NewAOClient(wallet, muURL, cuURL),
	}
}

// MemoryData represents a stored memory unit.
type MemoryData struct {
	ID         string  `json:"id"`
	Content    string  `json:"content"`
	Type       string  `json:"type"`
	Importance float64 `json:"importance"`
	Timestamp  int64   `json:"timestamp"`
}

// StoreMemory encrypts and stores a memory in the process.
func (c *MemoryClient) StoreMemory(ctx context.Context, content, memType string, importance float64) (string, error) {
	memID := generateID()
	memory := MemoryData{
		ID:         memID,
		Content:    content,
		Type:       memType,
		Importance: importance,
		Timestamp:  time.Now().UnixMilli(),
	}
	plain, err := json.Marshal(memory)
	if err != nil {
		return "", err
	}
	// Derive encryption key from process ID + memory ID (no master secret needed because wallet is already used to sign messages)
	// In a real implementation, you might want to use a wallet-derived key. For now, we use a simple key derivation from a fixed secret.
	// For production, use a proper key derived from the wallet's private key.
	salt := []byte(c.processID + memID)
	// We need a master secret. The wallet's private key is not directly exposed; we could use a hash of it.
	// For simplicity, we derive a key using HKDF with a constant secret (the wallet's public address).
	// In real code, you'd call a method like wallet.GetSigner().GetPrivateKey() – but goar doesn't expose that.
	// We'll assume the wallet provides a method to get the private key bytes; otherwise, we fallback to a less secure method.
	// This is a placeholder; adjust according to actual goar API.
	// For now, we'll use the wallet's public address as the master secret (not secure for real encryption).
	// Replace with actual private key extraction if possible.
	masterSecret := []byte(c.client.wallet.Address) // NOT SECURE – DEMO ONLY
	key, err := DeriveKey(masterSecret, salt)
	if err != nil {
		return "", err
	}
	ciphertext, err := Encrypt(plain, key)
	if err != nil {
		return "", err
	}
	_, err = c.client.SendMessage(ctx, c.processID, "Store", string(ciphertext))
	if err != nil {
		return "", err
	}
	return memID, nil
}

// ListMemories returns all memory IDs stored in the process.
func (c *MemoryClient) ListMemories(ctx context.Context) ([]string, error) {
	resp, err := c.client.SendMessage(ctx, c.processID, "List", "")
	if err != nil {
		return nil, err
	}
	var ids []string
	if err := json.Unmarshal([]byte(resp.Output), &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// GetMemory retrieves and decrypts a memory by its ID.
func (c *MemoryClient) GetMemory(ctx context.Context, memID string) (*MemoryData, error) {
	resp, err := c.client.SendMessage(ctx, c.processID, "Get", memID)
	if err != nil {
		return nil, err
	}
	salt := []byte(c.processID + memID)
	masterSecret := []byte(c.client.wallet.Address) // DEMO ONLY
	key, err := DeriveKey(masterSecret, salt)
	if err != nil {
		return nil, err
	}
	plain, err := Decrypt([]byte(resp.Output), key)
	if err != nil {
		return nil, err
	}
	var mem MemoryData
	if err := json.Unmarshal(plain, &mem); err != nil {
		return nil, err
	}
	return &mem, nil
}

func generateID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}