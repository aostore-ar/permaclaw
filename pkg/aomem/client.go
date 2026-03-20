package aomem

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/everFinance/goar"
)

// AOClient handles communication with the AO network.
type AOClient struct {
	muURL      string          // Messenger Unit URL
	cuURL      string          // Compute Unit URL
	httpClient *http.Client
	wallet     *goar.Wallet
}

// NewAOClient creates a new AO client with the given wallet and node URLs.
func NewAOClient(wallet *goar.Wallet, muURL, cuURL string) *AOClient {
	if muURL == "" {
		muURL = "https://mu.ao-testnet.xyz"
	}
	if cuURL == "" {
		cuURL = "https://cu.ao-testnet.xyz"
	}
	return &AOClient{
		muURL:      muURL,
		cuURL:      cuURL,
		httpClient: &http.Client{Timeout: 30 * time.Second},
		wallet:     wallet,
	}
}

// Message defines the structure of an AO message.
type Message struct {
	Target string `json:"target"`
	Action string `json:"action"`
	Data   string `json:"data,omitempty"`
	// In a real implementation, other fields like tags, anchor, etc. would be added.
}

// MessageResult holds the response after processing a message.
type MessageResult struct {
	MessageID string `json:"message_id"`
	Output    string `json:"output"`
}

// SendMessage sends a signed message to an AO process and waits for the result.
// It signs the message using the wallet, posts it to the MU, then polls the CU for the result.
func (c *AOClient) SendMessage(ctx context.Context, target, action, data string) (*MessageResult, error) {
	// Build message
	msg := Message{
		Target: target,
		Action: action,
		Data:   data,
	}
	msgData, err := json.Marshal(msg)
	if err != nil {
		return nil, fmt.Errorf("marshal message: %w", err)
	}

	// Sign the message
	signedTx, err := c.wallet.SignData(msgData)
	if err != nil {
		return nil, fmt.Errorf("sign message: %w", err)
	}

	// Post to MU
	reqBody := map[string]interface{}{
		"transaction": signedTx,
		"message":     string(msgData),
	}
	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, "POST", c.muURL+"/message", strings.NewReader(string(body)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("post to MU: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("MU returned status %d: %s", resp.StatusCode, body)
	}
	var muResp struct {
		MessageID string `json:"message_id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&muResp); err != nil {
		return nil, fmt.Errorf("decode MU response: %w", err)
	}

	// Poll CU for result
	const maxAttempts = 10
	const baseDelay = 1 * time.Second
	for attempt := 0; attempt < maxAttempts; attempt++ {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}
		cuURL := fmt.Sprintf("%s/result/%s", c.cuURL, muResp.MessageID)
		req, err := http.NewRequestWithContext(ctx, "GET", cuURL, nil)
		if err != nil {
			return nil, err
		}
		resp, err := c.httpClient.Do(req)
		if err != nil {
			if attempt < maxAttempts-1 {
				time.Sleep(baseDelay * time.Duration(attempt+1))
				continue
			}
			return nil, fmt.Errorf("fetch result from CU: %w", err)
		}
		if resp.StatusCode == http.StatusOK {
			var result MessageResult
			if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
				resp.Body.Close()
				return nil, fmt.Errorf("decode CU response: %w", err)
			}
			resp.Body.Close()
			return &result, nil
		}
		resp.Body.Close()
		if resp.StatusCode == http.StatusNotFound {
			// Still processing, wait and retry
			time.Sleep(baseDelay * time.Duration(attempt+1))
			continue
		}
		// Other error, give up
		return nil, fmt.Errorf("CU returned status %d", resp.StatusCode)
	}
	return nil, fmt.Errorf("timeout waiting for result")
}