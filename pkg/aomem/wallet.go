package aomem

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/everFinance/goar"
)

// LoadWallet reads an Arweave wallet from a JWK file and returns a goar.Wallet.
func LoadWallet(path string) (*goar.Wallet, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read wallet file: %w", err)
	}
	var jwk goar.Wallet
	if err := json.Unmarshal(data, &jwk); err != nil {
		return nil, fmt.Errorf("failed to parse wallet JSON: %w", err)
	}
	return &jwk, nil
}