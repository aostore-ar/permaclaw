package internal

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// ExpandHome replaces a leading "~" with the user's home directory.
func ExpandHome(path string) string {
	if path == "" || path[0] != '~' {
		return path
	}
	home, _ := os.UserHomeDir()
	if len(path) > 1 && path[1] == '/' {
		return home + path[1:]
	}
	return home
}

// ResolveWorkspace returns the workspace path for a given permaclaw home.
func ResolveWorkspace(home string) string {
	return filepath.Join(home, "workspace")
}

// RelPath returns the relative path from base to target, or the base name of target on error.
func RelPath(target, base string) string {
	rel, err := filepath.Rel(base, target)
	if err != nil {
		return filepath.Base(target)
	}
	return rel
}

// ResolveTargetHome returns the target home directory for migration.
// If override is non-empty, it is returned directly. Otherwise, it returns
// ~/.permaclaw after expanding the tilde.
func ResolveTargetHome(override string) (string, error) {
	if override != "" {
		return ExpandHome(override), nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("cannot determine home directory: %w", err)
	}
	return filepath.Join(home, ".permaclaw"), nil
}

// CopyFile copies a file from src to dst, preserving permissions.
func CopyFile(src, dst string) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	info, err := srcFile.Stat()
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return err
	}
	dstFile, err := os.OpenFile(dst, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, info.Mode())
	if err != nil {
		return err
	}
	defer dstFile.Close()

	if _, err := io.Copy(dstFile, srcFile); err != nil {
		return err
	}
	return nil
}

// ActionType enumerates the possible actions in a migration plan.
type ActionType string

const (
	ActionCopy   ActionType = "copy"
	ActionSkip   ActionType = "skip"
	ActionBackup ActionType = "backup"
)

// Action describes a single migration step.
type Action struct {
	Type        ActionType
	Source      string
	Target      string
	Description string
}

// PlanWorkspaceMigration creates a plan to migrate files/directories from src to dst.
// files is a list of relative file paths to copy.
// dirs is a list of relative directory paths to copy recursively.
// force controls whether existing files are overwritten (true) or backed up (false).
func PlanWorkspaceMigration(srcWorkspace, dstWorkspace string, files, dirs []string, force bool) ([]Action, error) {
	var actions []Action

	// Process individual files
	for _, f := range files {
		src := filepath.Join(srcWorkspace, f)
		dst := filepath.Join(dstWorkspace, f)

		info, err := os.Stat(src)
		if err != nil {
			if os.IsNotExist(err) {
				actions = append(actions, Action{
					Type:        ActionSkip,
					Description: fmt.Sprintf("source file not found: %s", src),
				})
				continue
			}
			return nil, fmt.Errorf("stat source file %s: %w", src, err)
		}
		if info.IsDir() {
			return nil, fmt.Errorf("expected file, got directory: %s", src)
		}

		if _, err := os.Stat(dst); err == nil && !force {
			actions = append(actions, Action{
				Type:        ActionBackup,
				Source:      src,
				Target:      dst,
				Description: fmt.Sprintf("file exists, will be backed up: %s", dst),
			})
		} else {
			actions = append(actions, Action{
				Type:        ActionCopy,
				Source:      src,
				Target:      dst,
				Description: fmt.Sprintf("copy %s to %s", src, dst),
			})
		}
	}

	// Process directories recursively
	for _, d := range dirs {
		srcDir := filepath.Join(srcWorkspace, d)
		dstDir := filepath.Join(dstWorkspace, d)

		info, err := os.Stat(srcDir)
		if err != nil {
			if os.IsNotExist(err) {
				actions = append(actions, Action{
					Type:        ActionSkip,
					Description: fmt.Sprintf("source directory not found: %s", srcDir),
				})
				continue
			}
			return nil, fmt.Errorf("stat source directory %s: %w", srcDir, err)
		}
		if !info.IsDir() {
			return nil, fmt.Errorf("expected directory, got file: %s", srcDir)
		}

		// Walk the source directory
		err = filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			rel, err := filepath.Rel(srcWorkspace, path)
			if err != nil {
				return err
			}
			destPath := filepath.Join(dstWorkspace, rel)

			if info.IsDir() {
				return nil // directories will be created when copying files
			}

			if _, err := os.Stat(destPath); err == nil && !force {
				actions = append(actions, Action{
					Type:        ActionBackup,
					Source:      path,
					Target:      destPath,
					Description: fmt.Sprintf("file exists, will be backed up: %s", destPath),
				})
			} else {
				actions = append(actions, Action{
					Type:        ActionCopy,
					Source:      path,
					Target:      destPath,
					Description: fmt.Sprintf("copy %s to %s", path, destPath),
				})
			}
			return nil
		})
		if err != nil && !errors.Is(err, filepath.SkipDir) {
			return nil, fmt.Errorf("walk directory %s: %w", srcDir, err)
		}
	}

	return actions, nil
}