package configstore

import (
	"errors"
	"os"
	"path/filepath"

	permaclawconfig "github.com/aostore-ar/permaclaw/pkg/config"
)

const (
	configDirName  = ".permaclaw"
	configFileName = "config.json"
)

func ConfigPath() (string, error) {
	dir, err := ConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, configFileName), nil
}

func ConfigDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, configDirName), nil
}

func Load() (*permaclawconfig.Config, error) {
	path, err := ConfigPath()
	if err != nil {
		return nil, err
	}
	return permaclawconfig.LoadConfig(path)
}

func Save(cfg *permaclawconfig.Config) error {
	if cfg == nil {
		return errors.New("config is nil")
	}
	path, err := ConfigPath()
	if err != nil {
		return err
	}
	return permaclawconfig.SaveConfig(path, cfg)
}