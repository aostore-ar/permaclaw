package commands

import (
	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/biocompute"
)

func NewListCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "list",
		Short:   "List all biocompute processes owned by the current wallet",
		Example: `  permaclaw biocompute list`,
		RunE: func(_ *cobra.Command, _ []string) error {
			client, _, err := biocompute.LoadWalletAndConfig()
			if err != nil {
				return err
			}
			return biocompute.ListBiocomputeProcesses(client)
		},
	}
	return cmd
}