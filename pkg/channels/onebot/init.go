package onebot

import (
	"github.com/aostore-ar/permaclaw/pkg/bus"
	"github.com/aostore-ar/permaclaw/pkg/channels"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("onebot", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewOneBotChannel(cfg.Channels.OneBot, b)
	})
}