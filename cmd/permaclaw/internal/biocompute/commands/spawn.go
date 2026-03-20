package commands

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/biocompute"
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
		Short: "Create a new biocompute process",
		Example: `  permaclaw biocompute spawn --name "Neuron Culture 42"
  permaclaw biocompute spawn --name "Experiment" --public
  permaclaw biocompute spawn --name "Private Data" --public --token-gate --token-id AOS --amount 500`,
		RunE: func(_ *cobra.Command, _ []string) error {
			if spawnName == "" {
				return fmt.Errorf("--name is required")
			}
			client, cfg, err := biocompute.LoadWalletAndConfig()
			if err != nil {
				return err
			}
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
			procID, err := client.SpawnBiocomputeProcess(ctx, spawnName, spawnPublic, tokenGate)
			if err != nil {
				return fmt.Errorf("failed to spawn biocompute process: %w", err)
			}
			fmt.Printf("✓ Spawned biocompute process with ID: %s\n", procID)
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