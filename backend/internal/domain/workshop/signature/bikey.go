package signature

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"math/big"
	"os"
	"path/filepath"
	"strings"
)

// BIPublicKey represents a Bohemia Interactive public key (.bikey).
type BIPublicKey struct {
	Name     string
	Length   uint32 // Bit length, typically 1024
	Exponent uint32 // Public exponent, typically 65537
	N        *big.Int
}

// Matches checks whether this public key has the exact same modulus and exponent as the signature.
func (k *BIPublicKey) Matches(sig *BISign) bool {
	if k == nil || sig == nil || k.N == nil || sig.N == nil {
		return false
	}
	return k.Exponent == sig.Exponent && k.N.Cmp(sig.N) == 0
}

// ParseBIPublicKey reads and parses a BI public key from an io.Reader.
func ParseBIPublicKey(r io.Reader) (*BIPublicKey, error) {
	name, err := readCString(r)
	if err != nil {
		return nil, fmt.Errorf("read key authority name: %w", err)
	}

	var temp, u1, u2, u3, length, exponent uint32
	if err := binary.Read(r, binary.LittleEndian, &temp); err != nil {
		return nil, fmt.Errorf("read temp header: %w", err)
	}
	if err := binary.Read(r, binary.LittleEndian, &u1); err != nil {
		return nil, fmt.Errorf("read crypto header: %w", err)
	}
	if err := binary.Read(r, binary.LittleEndian, &u2); err != nil {
		return nil, fmt.Errorf("read crypto header: %w", err)
	}
	if err := binary.Read(r, binary.LittleEndian, &u3); err != nil {
		return nil, fmt.Errorf("read crypto header: %w", err)
	}
	if err := binary.Read(r, binary.LittleEndian, &length); err != nil {
		return nil, fmt.Errorf("read length: %w", err)
	}
	if err := binary.Read(r, binary.LittleEndian, &exponent); err != nil {
		return nil, fmt.Errorf("read exponent: %w", err)
	}

	if length == 0 || length > 8192 || length%8 != 0 {
		return nil, fmt.Errorf("invalid RSA key bit length: %d", length)
	}

	expectedTemp := length/8 + 20
	if temp != expectedTemp {
		return nil, fmt.Errorf("invalid header temp=%d, expected=%d", temp, expectedTemp)
	}

	nBytes := make([]byte, length/8)
	if _, err := io.ReadFull(r, nBytes); err != nil {
		return nil, fmt.Errorf("read modulus bytes: %w", err)
	}

	n := new(big.Int).SetBytes(reverseBytes(nBytes))

	return &BIPublicKey{
		Name:     name,
		Length:   length,
		Exponent: exponent,
		N:        n,
	}, nil
}

// ParseBIPublicKeyFile opens and parses a BI public key file (.bikey).
func ParseBIPublicKeyFile(path string) (*BIPublicKey, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	key, err := ParseBIPublicKey(f)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", filepath.Base(path), err)
	}
	return key, nil
}

// ExtractBiKeyFromBiSign extracts the raw .bikey file content directly from a .bisign file.
// A .bisign file begins with the full Microsoft CryptoAPI public key structure.
func ExtractBiKeyFromBiSign(bisignPath string) (string, []byte, error) {
	data, err := os.ReadFile(bisignPath)
	if err != nil {
		return "", nil, err
	}

	r := bytes.NewReader(data)
	name, err := readCString(r)
	if err != nil {
		return "", nil, fmt.Errorf("read signature name: %w", err)
	}

	var temp, u1, u2, u3, length, exponent uint32
	if err := binary.Read(r, binary.LittleEndian, &temp); err != nil {
		return "", nil, err
	}
	if err := binary.Read(r, binary.LittleEndian, &u1); err != nil {
		return "", nil, err
	}
	if err := binary.Read(r, binary.LittleEndian, &u2); err != nil {
		return "", nil, err
	}
	if err := binary.Read(r, binary.LittleEndian, &u3); err != nil {
		return "", nil, err
	}
	if err := binary.Read(r, binary.LittleEndian, &length); err != nil {
		return "", nil, err
	}
	if err := binary.Read(r, binary.LittleEndian, &exponent); err != nil {
		return "", nil, err
	}

	if length == 0 || length > 8192 || length%8 != 0 {
		return "", nil, fmt.Errorf("invalid RSA bitlength: %d", length)
	}

	expectedTemp := length/8 + 20
	if temp != expectedTemp {
		return "", nil, fmt.Errorf("invalid bisign header temp=%d, expected=%d", temp, expectedTemp)
	}

	// The public key occupies:
	// - name string + null terminator (len(name) + 1)
	// - temp (4 bytes)
	// - 3 dummy u32 / CryptoAPI RSA1 header (12 bytes)
	// - length (4 bytes)
	// - exponent (4 bytes)
	// - modulus (length / 8 bytes)
	// Total prefix length = len(name) + 1 + 24 + (length / 8)
	keySize := int(length / 8)
	totalBikeyLen := len(name) + 1 + 24 + keySize
	if len(data) < totalBikeyLen {
		return "", nil, errors.New("bisign file truncated")
	}

	bikeyBytes := make([]byte, totalBikeyLen)
	copy(bikeyBytes, data[:totalBikeyLen])

	return name, bikeyBytes, nil
}

// SaveExtractedBiKey extracts the .bikey from a .bisign and saves it into destDir as <name>.bikey.
func SaveExtractedBiKey(bisignPath, destDir string) (string, error) {
	name, bikeyBytes, err := ExtractBiKeyFromBiSign(bisignPath)
	if err != nil {
		return "", err
	}

	cleanName := strings.TrimSpace(name)
	if cleanName == "" {
		cleanName = "extracted"
	}

	destPath := filepath.Join(destDir, cleanName+".bikey")
	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return "", err
	}

	if err := os.WriteFile(destPath, bikeyBytes, 0o644); err != nil {
		return "", err
	}

	return destPath, nil
}

func readCString(r io.Reader) (string, error) {
	var b []byte
	buf := make([]byte, 1)
	for {
		if _, err := r.Read(buf); err != nil {
			return "", err
		}
		if buf[0] == 0 {
			break
		}
		b = append(b, buf[0])
	}
	return string(b), nil
}

func reverseBytes(b []byte) []byte {
	out := make([]byte, len(b))
	for i := range b {
		out[i] = b[len(b)-1-i]
	}
	return out
}
