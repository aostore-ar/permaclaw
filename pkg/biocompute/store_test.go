package biocompute

import (
    "os"
    "path/filepath"
    "testing"
    "time"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestLocalStore(t *testing.T) {
    tmpDir := t.TempDir()
    store := NewLocalStore(tmpDir)
    spikes := []Spike{
        {ID: "1", Timestamp: 100, Channel: 1, Amplitude: 1.2},
    }
    err := store.SaveSpikes(spikes)
    require.NoError(t, err)

    loaded, err := store.LoadSpikes()
    require.NoError(t, err)
    assert.Len(t, loaded, 1)
    assert.Equal(t, "1", loaded[0].ID)

    // Ensure file created
    _, err = os.Stat(filepath.Join(tmpDir, "biocompute", "spikes.json"))
    assert.NoError(t, err)
}