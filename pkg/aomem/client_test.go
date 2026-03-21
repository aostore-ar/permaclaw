package aomem

import (
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "github.com/everFinance/goar"
)

type mockTransport struct {
    handler func(req *http.Request) (*http.Response, error)
}

func (m *mockTransport) RoundTrip(req *http.Request) (*http.Response, error) {
    return m.handler(req)
}

func TestSendMessage(t *testing.T) {
    // Mock MU and CU servers
    mu := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/message" {
            w.WriteHeader(404)
            return
        }
        var req map[string]interface{}
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            w.WriteHeader(400)
            return
        }
        // Return a fake message ID
        resp := map[string]string{"message_id": "mock-id"}
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(resp)
    }))
    defer mu.Close()

    cu := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/result/mock-id" {
            w.WriteHeader(404)
            return
        }
        // Return a fake result
        result := MessageResult{MessageID: "mock-id", Output: `{"result": "ok"}`}
        json.NewEncoder(w).Encode(result)
    }))
    defer cu.Close()

    // Create a dummy wallet (using a fake one for testing)
    // The goar.Wallet requires a private key; we can create a minimal one.
    // For testing, we can use a stub that doesn't actually sign.
    // But since we're not verifying signatures in these tests, we can create a minimal wallet.
    // However, goar.Wallet expects a valid JWK. For testing, we can create a dummy using a known private key.
    // We'll create a wallet with a test JWK (the one from goar examples).
    testJWK := `{
        "kty": "RSA",
        "n": "...",
        "e": "...",
        "d": "...",
        "p": "...",
        "q": "...",
        "dp": "...",
        "dq": "...",
        "qi": "..."
    }` // This is just a placeholder – we need a real test JWK. We'll skip actual signing by using a mock AOClient that overrides the HTTP client.
    // Actually, we can create a wallet with a dummy key for testing.
    // For simplicity, we'll create a wallet with a known test private key (e.g., from goar's tests).
    // But to avoid complexity, we can use a mock AOClient that doesn't rely on real signing.
    // Let's create a test wallet with a dummy private key (not actually used for signing because we mock HTTP).
    // We'll just pass nil wallet and rely on the fact that our mock transport doesn't check signatures.
    // However, AOClient requires a wallet. We can create a wallet with a dummy JWK and use a mock transport that intercepts the request.
    // We'll replace the httpClient with a client that uses our mock transport.

    wallet := &goar.Wallet{} // minimal; we don't need real signing for these tests.

    // Create AOClient with our mock servers
    client := &AOClient{
        muURL:      mu.URL,
        cuURL:      cu.URL,
        httpClient: &http.Client{Timeout: 5 * time.Second},
        wallet:     wallet,
    }

    // Override the HTTP transport to capture the request (we already have the servers)
    // But we need to ensure the client uses the right transport.
    // The default client will use the system transport; we can just use the servers as is.
    // The client uses the httpClient which will use the default transport; the servers are started and will handle requests.

    ctx := context.Background()
    result, err := client.SendMessage(ctx, "target-process", "TestAction", "test data")
    if err != nil {
        t.Fatalf("SendMessage failed: %v", err)
    }
    if result.MessageID != "mock-id" {
        t.Errorf("expected message ID mock-id, got %s", result.MessageID)
    }
    if result.Output != `{"result": "ok"}` {
        t.Errorf("expected output '{\"result\": \"ok\"}', got %q", result.Output)
    }
}