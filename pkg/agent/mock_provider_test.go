// PermaClaw - Ultra-lightweight personal AI agent with permanent memory
// Based on and inspired by PicoClaw: https://github.com/sipeed/picoclaw
// License: MIT
//
// Copyright (c) 2026 PermaClaw contributors

package agent

import (
	"context"

	"github.com/aostore-ar/permaclaw/pkg/providers"
)

type mockProvider struct{}

func (m *mockProvider) Chat(
	ctx context.Context,
	messages []providers.Message,
	tools []providers.ToolDefinition,
	model string,
	opts map[string]any,
) (*providers.LLMResponse, error) {
	return &providers.LLMResponse{
		Content:   "Mock response",
		ToolCalls: []providers.ToolCall{},
	}, nil
}

func (m *mockProvider) GetDefaultModel() string {
	return "mock-model"
}