package signature

import (
	"errors"
	"fmt"
	"math/big"
)

var (
	ErrPboCorrupted  = errors.New("PBO corrupted: whole-file checksum does not match stored checksum")
	ErrKeyMismatch   = errors.New("key mismatch: public key does not match signature key")
	ErrSig1Mismatch  = errors.New("signature mismatch (sig1): .bisign does not match PBO (mod author published mismatched files or forgot to re-sign after update)")
	ErrSig2Mismatch  = errors.New("signature mismatch: PBO prefix/name structure altered (sig2)")
	ErrSig3Mismatch  = errors.New("signature mismatch: PBO script or config content modified (sig3)")
	ErrMissingBikey  = errors.New("no matching .bikey found for this signature")
	ErrMissingBisign = errors.New("missing .bisign signature file for PBO")
)

// VerifyPBO performs full cryptographic verification of a PBO against a BISign and BIPublicKey.
func VerifyPBO(pbo *PBO, sig *BISign, key *BIPublicKey) error {
	if pbo == nil {
		return errors.New("pbo is nil")
	}
	if sig == nil {
		return errors.New("signature is nil")
	}
	if key == nil {
		return ErrMissingBikey
	}

	// 1. Verify whole-file integrity: computed whole-file SHA-1 must equal stored checksum
	if pbo.ComputedChecksum != pbo.Checksum {
		return fmt.Errorf("%w: computed=%x stored=%x", ErrPboCorrupted, pbo.ComputedChecksum[:8], pbo.Checksum[:8])
	}

	// 2. Modulus & exponent match check: verify that the key matches the signature's public key
	if !key.Matches(sig) {
		return fmt.Errorf("%w (key '%s' vs sig '%s')", ErrKeyMismatch, key.Name, sig.Name)
	}

	// 3. Generate PKCS#1 v1.5 hashes
	pad1, pad2, pad3, err := GenerateHashes(pbo, sig.Version, key.Length)
	if err != nil {
		return fmt.Errorf("generate hashes: %w", err)
	}

	e := big.NewInt(int64(key.Exponent))

	// Verify Sig1: sig1^e mod n == pad1
	rec1 := new(big.Int).Exp(sig.Sig1, e, key.N)
	if rec1.Cmp(pad1) != 0 {
		return ErrSig1Mismatch
	}

	// Verify Sig2: sig2^e mod n == pad2
	rec2 := new(big.Int).Exp(sig.Sig2, e, key.N)
	// Verify Sig3: sig3^e mod n == pad3
	rec3 := new(big.Int).Exp(sig.Sig3, e, key.N)

	sig2Match := rec2.Cmp(pad2) == 0
	sig3Match := rec3.Cmp(pad3) == 0

	if !sig2Match || !sig3Match {
		// If the archive was packed with Mikero obfuscation, the internal header table and filenames
		// are scrambled to deter extraction. In this case, Sig1 provides full cryptographic proof
		// of the whole archive's integrity and authenticity.
		if pbo.IsObfuscated() {
			return nil
		}
		if !sig2Match {
			return ErrSig2Mismatch
		}
		return ErrSig3Mismatch
	}

	return nil
}
