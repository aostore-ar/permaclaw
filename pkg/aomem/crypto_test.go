package aomem

import (
    "bytes"
    "testing"
)

func TestEncryptDecrypt(t *testing.T) {
    key := []byte("01234567890123456789012345678901") // 32 bytes
    plain := []byte("secret message")
    cipher, err := Encrypt(plain, key)
    if err != nil {
        t.Fatalf("Encrypt failed: %v", err)
    }
    decrypted, err := Decrypt(cipher, key)
    if err != nil {
        t.Fatalf("Decrypt failed: %v", err)
    }
    if !bytes.Equal(decrypted, plain) {
        t.Errorf("got %q, want %q", decrypted, plain)
    }
}

func TestDeriveKey(t *testing.T) {
    secret := []byte("master secret")
    salt := []byte("unique salt")
    key1, err := DeriveKey(secret, salt)
    if err != nil {
        t.Fatal(err)
    }
    key2, err := DeriveKey(secret, salt)
    if err != nil {
        t.Fatal(err)
    }
    if !bytes.Equal(key1, key2) {
        t.Error("key derivation not deterministic")
    }
    // Different salt should give different key
    key3, _ := DeriveKey(secret, []byte("different"))
    if bytes.Equal(key1, key3) {
        t.Error("keys with different salt should differ")
    }
}