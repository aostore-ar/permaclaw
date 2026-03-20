package memory

import (
	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/memory/commands"
)

func NewMemoryCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "memory",
		Aliases: []string{"mem"},
		Short:   "Manage AO memory processes",
		Long: `Create, list, and recover AO memory processes that store your permanent memories.
Each memory process is a separate container for encrypted conversation history and facts.`,
		RunE: func(cmd *cobra.Command, _ []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(
		commands.NewListCommand(),
		commands.NewSpawnCommand(),
		commands.NewRecoverCommand(),
	)

	return cmd
}