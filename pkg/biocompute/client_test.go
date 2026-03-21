package biocompute

import (
    "context"
    "testing"
    "time"

    "github.com/aostore-ar/permaclaw/pkg/aomem"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

type mockMemoryClient struct {
    storeFunc func(ctx context.Context, content, typ string, importance float64) (string, error)
    listFunc  func(ctx context.Context) ([]string, error)
    getFunc   func(ctx context.Context, id string) (*aomem.MemoryData, error)
}

func (m *mockMemoryClient) StoreMemory(ctx context.Context, content, typ string, importance float64) (string, error) {
    if m.storeFunc != nil {
        return m.storeFunc(ctx, content, typ, importance)
    }
    return "", nil
}
func (m *mockMemoryClient) ListMemories(ctx context.Context) ([]string, error) {
    if m.listFunc != nil {
        return m.listFunc(ctx)
    }
    return nil, nil
}
func (m *mockMemoryClient) GetMemory(ctx context.Context, id string) (*aomem.MemoryData, error) {
    if m.getFunc != nil {
        return m.getFunc(ctx, id)
    }
    return nil, nil
}

func TestClient_RecordSpike(t *testing.T) {
    var stored string
    mock := &mockMemoryClient{
        storeFunc: func(ctx context.Context, content, typ string, importance float64) (string, error) {
            stored = content
            return "spike-id", nil
        },
    }
    c := &Client{memClient: mock}
    spike := Spike{
        ID:        "s1",
        Timestamp: time.Now().UnixMilli(),
        Channel:   1,
        Amplitude: 1.2,
    }
    err := c.RecordSpike(context.Background(), spike)
    require.NoError(t, err)
    assert.Contains(t, stored, "channel")
}