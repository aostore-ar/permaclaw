package main

import (
	"fmt"
	"slices"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/aostore-ar/permaclaw/cmd/permaclaw/internal"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func TestNewPermaClawCommand(t *testing.T) {
	cmd := NewPermaClawCommand()

	require.NotNil(t, cmd)

	short := fmt.Sprintf("%s permaclaw - Personal AI Assistant with Permanent Memory v%s\n\n", internal.Logo, config.GetVersion())

	assert.Equal(t, "permaclaw", cmd.Use)
	assert.Equal(t, short, cmd.Short)

	assert.True(t, cmd.HasSubCommands())
	assert.True(t, cmd.HasAvailableSubCommands())

	assert.False(t, cmd.HasFlags())

	assert.Nil(t, cmd.Run)
	assert.Nil(t, cmd.RunE)

	assert.Nil(t, cmd.PersistentPreRun)
	assert.Nil(t, cmd.PersistentPostRun)

	allowedCommands := []string{
		"agent",
		"auth",
		"biocompute",
		"cron",
		"gateway",
		"memory",
		"migrate",
		"model",
		"onboard",
		"skills",
		"status",
		"version",
	}

	subcommands := cmd.Commands()
	assert.Len(t, subcommands, len(allowedCommands))

	for _, subcmd := range subcommands {
		found := slices.Contains(allowedCommands, subcmd.Name())
		assert.True(t, found, "unexpected subcommand %q", subcmd.Name())

		assert.False(t, subcmd.Hidden)
	}
}