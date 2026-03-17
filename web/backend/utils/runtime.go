// web/backend/utils/runtime.go
package utils

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

// GetDefaultConfigPath returns the default path to the permaclaw config file.
func GetDefaultConfigPath() string {
	if configPath := os.Getenv("PERMACLAW_CONFIG"); configPath != "" {
		return configPath
	}
	if permaclawHome := os.Getenv("PERMACLAW_HOME"); permaclawHome != "" {
		return filepath.Join(permaclawHome, "config.json")
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "config.json"
	}
	return filepath.Join(home, ".permaclaw", "config.json")
}

// FindPermaclawBinary locates the permaclaw executable.
// Search order:
//  1. PERMACLAW_BINARY environment variable (explicit override)
//  2. Same directory as the current executable
//  3. Falls back to "permaclaw" and relies on $PATH
func FindPermaclawBinary() string {
	binaryName := "permaclaw"
	if runtime.GOOS == "windows" {
		binaryName = "permaclaw.exe"
	}

	if p := os.Getenv("PERMACLAW_BINARY"); p != "" {
		if info, _ := os.Stat(p); info != nil && !info.IsDir() {
			return p
		}
	}

	if exe, err := os.Executable(); err == nil {
		candidate := filepath.Join(filepath.Dir(exe), binaryName)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate
		}
	}

	return "permaclaw"
}

// GetLocalIP returns the local IP address of the machine.
func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil {
			return ipnet.IP.String()
		}
	}
	return ""
}

// OpenBrowser automatically opens the given URL in the default browser.
func OpenBrowser(url string) error {
	switch runtime.GOOS {
	case "linux":
		return exec.Command("xdg-open", url).Start()
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		return exec.Command("open", url).Start()
	default:
		return fmt.Errorf("unsupported platform")
	}
}