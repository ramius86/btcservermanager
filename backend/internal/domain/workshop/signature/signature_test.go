package signature

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"encoding/binary"
	"math/big"
	"os"
	"path/filepath"
	"testing"
)

func TestPadHashAndModExp(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		t.Fatalf("rsa.GenerateKey failed: %v", err)
	}

	testData := []byte("antigravity test data for signature verification")
	h := sha1.Sum(testData)
	pad := PadHash(h[:], 128)

	// Sign: sig = pad^d mod n
	sig := new(big.Int).Exp(pad, key.D, key.N)

	// Verify: rec = sig^e mod n
	e := big.NewInt(int64(key.PublicKey.E))
	rec := new(big.Int).Exp(sig, e, key.PublicKey.N)

	if rec.Cmp(pad) != 0 {
		t.Fatalf("RSA verification failed: recovered != expected pad")
	}
}

func TestBIPublicKeyParsing(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		t.Fatalf("rsa.GenerateKey: %v", err)
	}

	var buf bytes.Buffer
	keyName := "testkey"
	buf.WriteString(keyName)
	buf.WriteByte(0)

	length := uint32(1024)
	exponent := uint32(key.PublicKey.E)
	_ = binary.Write(&buf, binary.LittleEndian, length/8+20) // temp
	buf.Write([]byte{0x06, 0x02, 0x00, 0x00, 0x00, 0x24, 0x00, 0x00})
	buf.Write([]byte("RSA1"))
	_ = binary.Write(&buf, binary.LittleEndian, length)
	_ = binary.Write(&buf, binary.LittleEndian, exponent)

	modBytes := key.PublicKey.N.Bytes()
	if len(modBytes) < 128 {
		padded := make([]byte, 128)
		copy(padded[128-len(modBytes):], modBytes)
		modBytes = padded
	}
	buf.Write(reverseBytes(modBytes))

	parsed, err := ParseBIPublicKey(&buf)
	if err != nil {
		t.Fatalf("ParseBIPublicKey failed: %v", err)
	}

	if parsed.Name != keyName {
		t.Errorf("expected name %s, got %s", keyName, parsed.Name)
	}
	if parsed.Length != length {
		t.Errorf("expected length %d, got %d", length, parsed.Length)
	}
	if parsed.Exponent != exponent {
		t.Errorf("expected exponent %d, got %d", exponent, parsed.Exponent)
	}
	if parsed.N.Cmp(key.PublicKey.N) != 0 {
		t.Errorf("modulus mismatch")
	}
}

func TestVerifyModSignaturesOnRealMods(t *testing.T) {
	// Root of repo is 5 levels up from backend/internal/domain/workshop/signature
	repoRoot := filepath.Join("..", "..", "..", "..", "..")
	deleteDir := filepath.Join(repoRoot, "delete")
	if _, err := os.Stat(deleteDir); os.IsNotExist(err) {
		t.Skip("delete/ directory not present, skipping real mod tests")
	}

	t.Run("Better Convoy", func(t *testing.T) {
		modDir := filepath.Join(deleteDir, "@Better Convoy")
		report, err := VerifyModSignatures(modDir, "", false)
		if err != nil {
			t.Fatalf("VerifyModSignatures failed: %v", err)
		}
		if report.OverallStatus != StatusValid {
			t.Errorf("expected StatusValid, got %s (summary: %s)", report.OverallStatus, report.Summary)
		}
		if report.VerifiedPBOs != 1 || report.TotalPBOs != 1 {
			t.Errorf("expected 1/1 verified, got %d/%d", report.VerifiedPBOs, report.TotalPBOs)
		}
	})

	t.Run("Civilian Presence Extended", func(t *testing.T) {
		modDir := filepath.Join(deleteDir, "@Civilian Presence Extended")
		report, err := VerifyModSignatures(modDir, "", false)
		if err != nil {
			t.Fatalf("VerifyModSignatures failed: %v", err)
		}
		if report.OverallStatus != StatusValid {
			t.Errorf("expected StatusValid, got %s (summary: %s)", report.OverallStatus, report.Summary)
		}
		if report.VerifiedPBOs != 9 || report.TotalPBOs != 9 {
			t.Errorf("expected 9/9 verified, got %d/%d", report.VerifiedPBOs, report.TotalPBOs)
		}
	})

	t.Run("Modular Interior Office Kit with Auto-Extraction", func(t *testing.T) {
		modDir := filepath.Join(deleteDir, "@Modular Interior - Office Kit")
		modKeysDir := filepath.Join(modDir, "keys")
		_ = os.RemoveAll(modKeysDir)
		defer os.RemoveAll(modKeysDir)

		// Test without auto-extraction -> should report missing bikey
		reportNoExt, err := VerifyModSignatures(modDir, "", false)
		if err != nil {
			t.Fatalf("VerifyModSignatures failed: %v", err)
		}
		if reportNoExt.OverallStatus != StatusWarning && reportNoExt.OverallStatus != StatusNoBikey {
			t.Errorf("expected warning/no bikey, got %s", reportNoExt.OverallStatus)
		}

		// Test with auto-extraction -> extracts feuerex.bikey and detects signature mismatch on PBO
		tmpKeysDir := filepath.Join(os.TempDir(), "test_arma3_server_keys")
		defer os.RemoveAll(tmpKeysDir)

		reportExt, err := VerifyModSignatures(modDir, tmpKeysDir, true)
		if err != nil {
			t.Fatalf("VerifyModSignatures with auto-extract failed: %v", err)
		}
		if len(reportExt.KeysExtracted) == 0 {
			t.Errorf("expected at least 1 key extracted")
		}
		// The PBO has a signature mismatch (author distributed mismatched bisign)
		if reportExt.OverallStatus != StatusError {
			t.Errorf("expected StatusError for mismatched PBO, got %s", reportExt.OverallStatus)
		}
	})
}
