package commands

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/memory"
	"github.com/aostore-ar/permaclaw/pkg/aomem"
)

var (
	spawnName    string
	spawnPublic  bool
	spawnToken   bool
	spawnTokenID string
	spawnAmount  float64
)

func NewSpawnCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "spawn",
		Short: "Create a new memory process",
		Example: `  permaclaw memory spawn --name personal
  permaclaw memory spawn --name work --public
  permaclaw memory spawn --name secret --public --token-gate --token-id AOS --amount 1000`,
		RunE: func(_ *cobra.Command, _ []string) error {
			if spawnName == "" {
				return fmt.Errorf("--name is required")
			}
			client, cfg, err := memory.LoadWalletAndConfig()
			if err != nil {
				return err
			}
			// Prepare token gate if requested
			var tokenGate *aomem.TokenGate
			if spawnToken {
				if spawnTokenID == "" || spawnAmount <= 0 {
					return fmt.Errorf("--token-id and --amount are required when --token-gate is set")
				}
				tokenGate = &aomem.TokenGate{
					Enabled:   true,
					TokenID:   spawnTokenID,
					MinAmount: spawnAmount,
				}
			}
			ctx := context.Background()
			procID, err := client.SpawnMemoryProcess(ctx, spawnName, spawnPublic, tokenGate)
			if err != nil {
				return fmt.Errorf("failed to spawn memory process: %w", err)
			}
			fmt.Printf("✓ Spawned memory process with ID: %s\n", procID)
			return nil
		},
	}
	cmd.Flags().StringVar(&spawnName, "name", "", "Process name (required)")
	cmd.Flags().BoolVar(&spawnPublic, "public", false, "Make the process public (visible to others)")
	cmd.Flags().BoolVar(&spawnToken, "token-gate", false, "Enable token gating")
	cmd.Flags().StringVar(&spawnTokenID, "token-id", "AOS", "Token ID for gating")
	cmd.Flags().Float64Var(&spawnAmount, "amount", 0, "Minimum token amount required")
	return cmd
}