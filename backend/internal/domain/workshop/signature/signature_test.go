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

func TestDebugCBA(t *testing.T) {
	repoRoot := filepath.Join("..", "..", "..", "..", "..")
	cbaDir := filepath.Join(repoRoot, "@CBA_A3")
	if _, err := os.Stat(cbaDir); os.IsNotExist(err) {
		t.Skip("@CBA_A3 directory not present")
	}

	report, err := VerifyModSignatures(cbaDir, "", false)
	if err != nil {
		t.Fatalf("VerifyModSignatures failed: %v", err)
	}

	t.Logf("Report: status=%s, total=%d, verified=%d, summary=%s",
		report.OverallStatus, report.TotalPBOs, report.VerifiedPBOs, report.Summary)

	if report.OverallStatus != StatusValid {
		for _, res := range report.PboResults {
			if res.Status != StatusValid {
				t.Errorf("FAILED: %s -> %s (err: %s)", res.PboPath, res.Status, res.ErrorMessage)
			}
		}
		t.Fatalf("Expected CBA to be completely valid, got %s", report.OverallStatus)
	}

	t.Logf("ALL %d PBOs of CBA_A3 VERIFIED SUCCESSFULLY!", report.VerifiedPBOs)
}

func TestPedagneModVerify(t *testing.T) {
	repoRoot := filepath.Join("..", "..", "..", "..", "..")
	pedagneDir := filepath.Join(repoRoot, "@PedagneMod")
	if _, err := os.Stat(pedagneDir); os.IsNotExist(err) {
		t.Skip("@PedagneMod directory not present")
	}

	report, err := VerifyModSignatures(pedagneDir, "", false)
	if err != nil {
		t.Fatalf("VerifyModSignatures failed: %v", err)
	}

	t.Logf("Pedagne Report: status=%s, total=%d, verified=%d, summary=%s",
		report.OverallStatus, report.TotalPBOs, report.VerifiedPBOs, report.Summary)

	if report.OverallStatus != StatusValid {
		for _, res := range report.PboResults {
			if res.Status != StatusValid {
				t.Errorf("PBO FAILED: %s -> %s (err: %s)", res.PboPath, res.Status, res.ErrorMessage)
			}
		}
		t.Fatalf("Expected @PedagneMod to be VALID, got %s", report.OverallStatus)
	}

	if report.VerifiedPBOs != report.TotalPBOs {
		t.Fatalf("Expected all %d PBOs to be verified, got %d", report.TotalPBOs, report.VerifiedPBOs)
	}
}

func TestAutoRecoveryFailsWhenSignatureMismatched(t *testing.T) {
	repoRoot := filepath.Join("..", "..", "..", "..", "..")
	pedagneDir := filepath.Join(repoRoot, "@PedagneMod")
	if _, err := os.Stat(pedagneDir); os.IsNotExist(err) {
		t.Skip("@PedagneMod directory not present")
	}

	// Create temp mod dir with addons/ but NO keys/ dir
	tempModDir, err := os.MkdirTemp("", "test_mod_no_bikey_*")
	if err != nil {
		t.Fatalf("MkdirTemp: %v", err)
	}
	defer os.RemoveAll(tempModDir)

	tempAddonsDir := filepath.Join(tempModDir, "addons")
	_ = os.MkdirAll(tempAddonsDir, 0o755)

	// Copy ASZ_Main_A3.pbo but copy ASZ_Editorpreviews_A3 bisign (mismatched signature!)
	srcPbo := filepath.Join(pedagneDir, "addons", "ASZ_Main_A3.pbo")
	dstPbo := filepath.Join(tempAddonsDir, "mismatched.pbo")
	pboData, err := os.ReadFile(srcPbo)
	if err != nil {
		t.Fatalf("ReadFile srcPbo: %v", err)
	}
	if err := os.WriteFile(dstPbo, pboData, 0o644); err != nil {
		t.Fatalf("WriteFile dstPbo: %v", err)
	}

	srcBisign := filepath.Join(pedagneDir, "addons", "ASZ_Editorpreviews_A3.pbo.Pedagne_Mod_Team.bisign")
	dstBisign := filepath.Join(tempAddonsDir, "mismatched.pbo.Pedagne_Mod_Team.bisign")
	bisignData, err := os.ReadFile(srcBisign)
	if err != nil {
		t.Fatalf("ReadFile srcBisign: %v", err)
	}
	if err := os.WriteFile(dstBisign, bisignData, 0o644); err != nil {
		t.Fatalf("WriteFile dstBisign: %v", err)
	}

	tempServerKeysDir, err := os.MkdirTemp("", "test_server_keys_*")
	if err != nil {
		t.Fatalf("MkdirTemp server keys: %v", err)
	}
	defer os.RemoveAll(tempServerKeysDir)

	// Run with autoExtract = true
	report, err := VerifyModSignatures(tempModDir, tempServerKeysDir, true)
	if err != nil {
		t.Fatalf("VerifyModSignatures failed: %v", err)
	}

	t.Logf("Report: status=%s, summary=%s", report.OverallStatus, report.Summary)

	// 1. Must be StatusError
	if report.OverallStatus != StatusError {
		t.Errorf("expected StatusError, got %s", report.OverallStatus)
	}

	// 2. KeysExtracted must be EMPTY (no key was verified or confirmed)
	if len(report.KeysExtracted) != 0 {
		t.Errorf("expected 0 KeysExtracted, got %d (%v)", len(report.KeysExtracted), report.KeysExtracted)
	}

	// 3. KeysExtractionFailed must contain the key
	if len(report.KeysExtractionFailed) == 0 {
		t.Errorf("expected at least 1 KeysExtractionFailed, got 0")
	}

	// 4. Server keys folder must remain empty (no invalid key installed)
	serverKeyEntries, _ := os.ReadDir(tempServerKeysDir)
	if len(serverKeyEntries) != 0 {
		t.Errorf("expected 0 files in server keys folder, found %d", len(serverKeyEntries))
	}

	// 5. Mod keys folder must remain empty
	modKeyEntries, _ := os.ReadDir(filepath.Join(tempModDir, "keys"))
	if len(modKeyEntries) != 0 {
		t.Errorf("expected 0 files in mod keys folder, found %d", len(modKeyEntries))
	}
}
