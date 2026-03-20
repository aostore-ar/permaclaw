// PermaClaw - Ultra-lightweight personal AI agent with permanent memory
// Based on PicoClaw, extended with AO/Arweave integration.
// License: MIT
//
// Copyright (c) 2026 PermaClaw contributors

package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/agent"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/auth"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/biocompute"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/cron"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/gateway"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/memory"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/migrate"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/model"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/onboard"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/skills"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/status"
	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal/version"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func NewPermaClawCommand() *cobra.Command {
	short := fmt.Sprintf("%s permaclaw - Personal AI Assistant with Permanent Memory v%s\n\n", internal.Logo, config.GetVersion())

	cmd := &cobra.Command{
		Use:     "permaclaw",
		Short:   short,
		Example: "permaclaw version",
	}

	cmd.AddCommand(
		onboard.NewOnboardCommand(),
		agent.NewAgentCommand(),
		auth.NewAuthCommand(),
		gateway.NewGatewayCommand(),
		status.NewStatusCommand(),
		cron.NewCronCommand(),
		migrate.NewMigrateCommand(),
		skills.NewSkillsCommand(),
		model.NewModelCommand(),
		memory.NewMemoryCommand(),       // new
		biocompute.NewBiocomputeCommand(), // new
		version.NewVersionCommand(),
	)

	return cmd
}

const (
	colorBlue = "\033[1;38;2;62;93;185m"
	colorRed  = "\033[1;38;2;213;70;70m"
	banner    = "\r\n" +
		colorBlue + "██████╗ ███████╗██████╗ ███╗   ███╗ █████╗  ██████╗██╗      █████╗ ██╗    ██╗\n" +
		colorBlue + "██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔════╝██║     ██╔══██╗██║    ██║\n" +
		colorBlue + "██████╔╝█████╗  ██████╔╝██╔████╔██║███████║██║     ██║     ███████║██║ █╗ ██║\n" +
		colorRed + "██╔═══╝ ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══██║██║     ██║     ██╔══██║██║███╗██║\n" +
		colorRed + "██║     ███████╗██║  ██║██║ ╚═╝ ██║██║  ██║╚██████╗███████╗██║  ██║╚███╔███╔╝\n" +
		colorRed + "╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝\n " +
		"\033[0m\r\n"
)

func main() {
	fmt.Printf("%s", banner)
	cmd := NewPermaClawCommand()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}