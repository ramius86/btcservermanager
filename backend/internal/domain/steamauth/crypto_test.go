package steamauth

import (
	"os"
	"testing"
)

const testSecretKey = "test-secret-key-with-at-least-32-chars"

func TestCrypto(t *testing.T) {
	os.Setenv("SECRET_KEY", testSecretKey)
	defer os.Unsetenv("SECRET_KEY")

	original := "my-secret-password"

	encrypted, err := encrypt(original)
	if err != nil {
		t.Fatalf("encryption failed: %v", err)
	}

	if encrypted == original {
		t.Error("encrypted string is same as original")
	}

	decrypted, err := decrypt(encrypted)
	if err != nil {
		t.Fatalf("decryption failed: %v", err)
	}

	if decrypted != original {
		t.Errorf("expected %s, got %s", original, decrypted)
	}

	t.Run("Empty strings", func(t *testing.T) {
		enc, _ := encrypt("")
		if enc != "" {
			t.Error("expected empty string for empty input")
		}

		dec, _ := decrypt("")
		if dec != "" {
			t.Error("expected empty string for empty input")
		}
	})

	t.Run("Invalid decryption", func(t *testing.T) {
		_, err := decrypt("invalid-base64")
		if err == nil {
			t.Error("expected error for invalid base64")
		}
	})

	t.Run("Missing SECRET_KEY returns error", func(t *testing.T) {
		os.Unsetenv("SECRET_KEY")
		defer os.Setenv("SECRET_KEY", testSecretKey)

		_, err := encrypt("password")
		if err == nil {
			t.Error("expected error when SECRET_KEY is missing")
		}
	})

	t.Run("Short SECRET_KEY is rejected", func(t *testing.T) {
		os.Setenv("SECRET_KEY", "too-short")
		defer os.Setenv("SECRET_KEY", testSecretKey)

		_, err := encrypt("password")
		if err == nil {
			t.Error("expected error when SECRET_KEY is shorter than 32 characters")
		}
	})

	t.Run("Placeholder SECRET_KEY is rejected", func(t *testing.T) {
		os.Setenv("SECRET_KEY", "change-me-to-a-random-64-char-string-use-openssl-rand-base64-32")
		defer os.Setenv("SECRET_KEY", testSecretKey)

		if _, err := encrypt("password"); err == nil {
			t.Error("expected error when SECRET_KEY is still the .env.example placeholder")
		}
	})
}
