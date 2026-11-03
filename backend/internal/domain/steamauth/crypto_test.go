package steamauth

import "testing"

const testSecretKey = "test-secret-key-with-at-least-32-chars"

// otherSecretKey stands in for a different key (or a stale environment value):
// it must never open ciphertext produced with testSecretKey.
const otherSecretKey = "other-secret-key-with-at-least-32-chars"

func TestCrypto(t *testing.T) {
	original := "my-secret-password"

	encrypted, err := encrypt(testSecretKey, original)
	if err != nil {
		t.Fatalf("encryption failed: %v", err)
	}

	if encrypted == original {
		t.Error("encrypted string is same as original")
	}

	decrypted, err := decrypt(testSecretKey, encrypted)
	if err != nil {
		t.Fatalf("decryption failed: %v", err)
	}

	if decrypted != original {
		t.Errorf("expected %s, got %s", original, decrypted)
	}

	t.Run("Empty strings", func(t *testing.T) {
		enc, _ := encrypt(testSecretKey, "")
		if enc != "" {
			t.Error("expected empty string for empty input")
		}

		dec, _ := decrypt(testSecretKey, "")
		if dec != "" {
			t.Error("expected empty string for empty input")
		}
	})

	t.Run("Invalid decryption", func(t *testing.T) {
		_, err := decrypt(testSecretKey, "invalid-base64")
		if err == nil {
			t.Error("expected error for invalid base64")
		}
	})

	t.Run("Missing secret returns error", func(t *testing.T) {
		if _, err := encrypt("", "password"); err == nil {
			t.Error("expected error when the secret is missing")
		}
	})

	t.Run("Short secret is rejected", func(t *testing.T) {
		if _, err := encrypt("too-short", "password"); err == nil {
			t.Error("expected error when the secret is shorter than 32 characters")
		}
	})

	t.Run("Placeholder secret is rejected", func(t *testing.T) {
		placeholder := "change-me-to-a-random-64-char-string-use-openssl-rand-base64-32"
		if _, err := encrypt(placeholder, "password"); err == nil {
			t.Error("expected error when the secret is still the .env.example placeholder")
		}
	})

	// The key is the argument, not the process environment. With a different
	// SECRET_KEY exported, ciphertext sealed with testSecretKey must still open
	// with testSecretKey and must not open with the environment value.
	t.Run("Key argument wins over the environment", func(t *testing.T) {
		t.Setenv("SECRET_KEY", otherSecretKey)

		enc, err := encrypt(testSecretKey, "password")
		if err != nil {
			t.Fatalf("encryption failed: %v", err)
		}

		got, err := decrypt(testSecretKey, enc)
		if err != nil {
			t.Fatalf("ciphertext did not open with the key it was sealed with: %v", err)
		}
		if got != "password" {
			t.Errorf("expected password, got %s", got)
		}

		if _, err := decrypt(otherSecretKey, enc); err == nil {
			t.Error("ciphertext opened with the environment key instead of the supplied one")
		}
	})

	// The config value is not trimmed while deriveKey is, so a trailing space
	// used to make the two readers disagree on the same SECRET_KEY.
	t.Run("Surrounding whitespace is ignored", func(t *testing.T) {
		enc, err := encrypt("  "+testSecretKey+"\n", "password")
		if err != nil {
			t.Fatalf("encryption failed: %v", err)
		}

		if _, err := decrypt(testSecretKey, enc); err != nil {
			t.Errorf("key with surrounding whitespace produced a different key: %v", err)
		}
	})
}
