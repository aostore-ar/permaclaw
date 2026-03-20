package commands

import (
	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/memory"
)

func NewListCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "list",
		Short:   "List all memory processes owned by the current wallet",
		Example: `  permaclaw memory list`,
		RunE: func(_ *cobra.Command, _ []string) error {
			client, _, err := memory.LoadWalletAndConfig()
			if err != nil {
				return err
			}
			return memory.ListMemoryProcesses(client)
		},
	}
	return cmd
}