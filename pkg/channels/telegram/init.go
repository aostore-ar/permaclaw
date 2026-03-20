package telegram

import (
	"github.com/aostore-ar/permaclaw/pkg/bus"
	"github.com/aostore-ar/permaclaw/pkg/channels"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("telegram", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewTelegramChannel(cfg, b)
	})
}