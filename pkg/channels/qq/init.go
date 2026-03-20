package qq

import (
	"github.com/aostore-ar/permaclaw/pkg/bus"
	"github.com/aostore-ar/permaclaw/pkg/channels"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("qq", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewQQChannel(cfg.Channels.QQ, b)
	})
}