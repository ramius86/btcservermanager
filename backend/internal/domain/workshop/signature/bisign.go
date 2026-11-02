package signature

import (
	"encoding/binary"
	"fmt"
	"io"
	"math/big"
	"os"
	"path/filepath"
)

// BISignVersion represents the version of a Bohemia Interactive signature (V2 or V3).
type BISignVersion uint32

const (
	VersionV2 BISignVersion = 2
	VersionV3 BISignVersion = 3
)

// BISign represents a parsed BI signature file (.bisign).
type BISign struct {
	Version  BISignVersion
	Name     string
	Length   uint32
	Exponent uint32
	N        *big.Int
	Sig1     *big.Int
	Sig2     *big.Int
	Sig3     *big.Int
}

// ParseBISign reads and parses a BI signature from an io.Reader.
func ParseBISign(r io.Reader) (*BISign, error) {
	name, err := readCString(r)
	if err != nil {
		return nil, fmt.Errorf("read signature authority name: %w", err)
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

	if length == 0 || length > maxRSAModulusBits || length%8 != 0 {
		return nil, fmt.Errorf("invalid RSA bitlength: %d", length)
	}

	expectedTemp := length/8 + 20
	if temp != expectedTemp {
		return nil, fmt.Errorf("invalid header temp=%d, expected=%d", temp, expectedTemp)
	}

	nBytes := make([]byte, length/8)
	if _, err := io.ReadFull(r, nBytes); err != nil {
		return nil, fmt.Errorf("read modulus: %w", err)
	}
	n := new(big.Int).SetBytes(reverseBytes(nBytes))

	// Sig 1
	sig1, err := readSignature(r, "sig1")
	if err != nil {
		return nil, err
	}

	// Version
	var version uint32
	if err := binary.Read(r, binary.LittleEndian, &version); err != nil {
		return nil, fmt.Errorf("read version: %w", err)
	}
	if version != uint32(VersionV2) && version != uint32(VersionV3) {
		return nil, fmt.Errorf("unsupported BISign version: %d", version)
	}

	// Sig 2
	sig2, err := readSignature(r, "sig2")
	if err != nil {
		return nil, err
	}

	// Sig 3
	sig3, err := readSignature(r, "sig3")
	if err != nil {
		return nil, err
	}

	return &BISign{
		Version:  BISignVersion(version),
		Name:     name,
		Length:   length,
		Exponent: exponent,
		N:        n,
		Sig1:     sig1,
		Sig2:     sig2,
		Sig3:     sig3,
	}, nil
}

// maxRSAModulusBits caps the modulus declared by a .bisign. 8192 bits is well
// above the 2048/4096-bit keys Bohemia tooling emits, and keeps a corrupt file
// from requesting a multi-gigabyte allocation.
const maxRSAModulusBits uint32 = 8192

// maxSignatureBytes bounds a single length-prefixed signature component.
const maxSignatureBytes = maxRSAModulusBits / 8

// readSignature reads a length-prefixed RSA component with a hard size cap.
func readSignature(r io.Reader, name string) (*big.Int, error) {
	var n uint32
	if err := binary.Read(r, binary.LittleEndian, &n); err != nil {
		return nil, fmt.Errorf("read %s length: %w", name, err)
	}
	if n == 0 || n > maxSignatureBytes {
		return nil, fmt.Errorf("invalid %s length: %d", name, n)
	}

	buf := make([]byte, n)
	if _, err := io.ReadFull(r, buf); err != nil {
		return nil, fmt.Errorf("read %s: %w", name, err)
	}

	return new(big.Int).SetBytes(reverseBytes(buf)), nil
}

// ParseBISignFile opens and parses a BI signature file (.bisign).
func ParseBISignFile(path string) (*BISign, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	sig, err := ParseBISign(f)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", filepath.Base(path), err)
	}
	return sig, nil
}
