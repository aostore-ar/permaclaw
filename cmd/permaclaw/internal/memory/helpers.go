package memory

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal"
	"github.com/aostore-ar/permaclaw/pkg/aomem"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

// loadWalletAndConfig loads the config and returns the wallet and main process client.
func LoadWalletAndConfig() (*aomem.MainProcessClient, *config.Config, error) {
	cfg, err := internal.LoadConfig()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to load config: %w", err)
	}
	if cfg.WalletPath == "" {
		return nil, nil, fmt.Errorf("wallet_path not set in config")
	}
	if cfg.MainProcessID == "" {
		return nil, nil, fmt.Errorf("main_process_id not set in config")
	}
	wallet, err := aomem.LoadWallet(cfg.WalletPath)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to load wallet: %w", err)
	}
	client := aomem.NewMainProcessClient(cfg.MainProcessID, wallet)
	return client, cfg, nil
}

// ListMemoryProcesses prints all memory processes owned by the current wallet.
func ListMemoryProcesses(client *aomem.MainProcessClient) error {
	ctx := context.Background()
	procs, err := client.ListProcesses(ctx, "memory")
	if err != nil {
		return fmt.Errorf("failed to list memory processes: %w", err)
	}
	if len(procs) == 0 {
		fmt.Println("No memory processes found.")
		return nil
	}
	fmt.Println("\nMemory Processes:")
	for _, p := range procs {
		fmt.Printf("  %s\n", p.ID)
		fmt.Printf("    Name: %s\n", p.Name)
		fmt.Printf("    Created: %s\n", p.CreatedAt.Format("2006-01-02 15:04"))
		fmt.Printf("    Public: %v\n", p.Public)
		if p.TokenGate != nil && p.TokenGate.Enabled {
			fmt.Printf("    Token gate: %d %s\n", p.TokenGate.MinAmount, p.TokenGate.TokenID)
		}
	}
	return nil
}

// RebuildLocalCache simulates rebuilding the local cache by fetching processes from main registry.
func RebuildLocalCache(client *aomem.MainProcessClient) error {
	ctx := context.Background()
	procs, err := client.ListProcesses(ctx, "memory")
	if err != nil {
		return fmt.Errorf("failed to fetch processes from main registry: %w", err)
	}
	// In a real implementation, you'd write this list to a local cache file.
	// For now, just print count.
	fmt.Printf("Recovered %d memory processes.\n", len(procs))
	return nil
}