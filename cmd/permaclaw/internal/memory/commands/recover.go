package commands

import (
	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/memory"
)

func NewRecoverCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "recover",
		Short: "Recover memory processes from the main registry (rebuild local cache)",
		Example: `  permaclaw memory recover`,
		RunE: func(_ *cobra.Command, _ []string) error {
			client, _, err := memory.LoadWalletAndConfig()
			if err != nil {
				return err
			}
			return memory.RebuildLocalCache(client)
		},
	}
	return cmd
}