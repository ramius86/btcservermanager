package steamauth

import (
	"os"
	"testing"
)

func TestCrypto(t *testing.T) {
	os.Setenv("SECRET_KEY", "test-secret")
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
}
