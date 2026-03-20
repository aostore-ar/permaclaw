package matrix

import (
	"github.com/aostore-ar/permaclaw/pkg/bus"
	"github.com/aostore-ar/permaclaw/pkg/channels"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("matrix", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewMatrixChannel(cfg.Channels.Matrix, b)
	})
}