package internal

import (
	"os"
	"path/filepath"

	"github.com/aostore-ar/permaclaw/pkg/config"
)

const Logo = "🦞"

// GetPermaClawHome returns the permaclaw home directory.
// Priority: $PERMACLAW_HOME > ~/.permaclaw
func GetPermaClawHome() string {
	if home := os.Getenv("PERMACLAW_HOME"); home != "" {
		return home
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".permaclaw")
}

func GetConfigPath() string {
	if configPath := os.Getenv("PERMACLAW_CONFIG"); configPath != "" {
		return configPath
	}
	return filepath.Join(GetPermaClawHome(), "config.json")
}

func LoadConfig() (*config.Config, error) {
	return config.LoadConfig(GetConfigPath())
}

// FormatVersion returns the version string with optional git commit
// Deprecated: Use pkg/config.FormatVersion instead
func FormatVersion() string {
	return config.FormatVersion()
}

// FormatBuildInfo returns build time and go version info
// Deprecated: Use pkg/config.FormatBuildInfo instead
func FormatBuildInfo() (string, string) {
	return config.FormatBuildInfo()
}

// GetVersion returns the version string
// Deprecated: Use pkg/config.GetVersion instead
func GetVersion() string {
	return config.GetVersion()
}