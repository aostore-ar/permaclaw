package biocompute

import (
	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/biocompute/commands"
)

func NewBiocomputeCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "biocompute",
		Aliases: []string{"bio"},
		Short:   "Manage biocompute processes",
		Long: `Create, list, and manage biocompute processes that store neuron spike data
and experimental results.`,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(
		commands.NewListCommand(),
		commands.NewSpawnCommand(),
	)

	return cmd
}