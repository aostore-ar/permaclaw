package whatsapp

import (
	"github.com/aostore-ar/permaclaw/pkg/bus"
	"github.com/aostore-ar/permaclaw/pkg/channels"
	"github.com/aostore-ar/permaclaw/pkg/config"
)

func init() {
	channels.RegisterFactory("whatsapp", func(cfg *config.Config, b *bus.MessageBus) (channels.Channel, error) {
		return NewWhatsAppChannel(cfg.Channels.WhatsApp, b)
	})
}