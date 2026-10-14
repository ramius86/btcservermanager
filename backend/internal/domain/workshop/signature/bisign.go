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

	if length == 0 || length > 8192 || length%8 != 0 {
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
	var sig1Len uint32
	if err := binary.Read(r, binary.LittleEndian, &sig1Len); err != nil {
		return nil, fmt.Errorf("read sig1 length: %w", err)
	}
	sig1Bytes := make([]byte, sig1Len)
	if _, err := io.ReadFull(r, sig1Bytes); err != nil {
		return nil, fmt.Errorf("read sig1: %w", err)
	}
	sig1 := new(big.Int).SetBytes(reverseBytes(sig1Bytes))

	// Version
	var version uint32
	if err := binary.Read(r, binary.LittleEndian, &version); err != nil {
		return nil, fmt.Errorf("read version: %w", err)
	}
	if version != uint32(VersionV2) && version != uint32(VersionV3) {
		return nil, fmt.Errorf("unsupported BISign version: %d", version)
	}

	// Sig 2
	var sig2Len uint32
	if err := binary.Read(r, binary.LittleEndian, &sig2Len); err != nil {
		return nil, fmt.Errorf("read sig2 length: %w", err)
	}
	sig2Bytes := make([]byte, sig2Len)
	if _, err := io.ReadFull(r, sig2Bytes); err != nil {
		return nil, fmt.Errorf("read sig2: %w", err)
	}
	sig2 := new(big.Int).SetBytes(reverseBytes(sig2Bytes))

	// Sig 3
	var sig3Len uint32
	if err := binary.Read(r, binary.LittleEndian, &sig3Len); err != nil {
		return nil, fmt.Errorf("read sig3 length: %w", err)
	}
	sig3Bytes := make([]byte, sig3Len)
	if _, err := io.ReadFull(r, sig3Bytes); err != nil {
		return nil, fmt.Errorf("read sig3: %w", err)
	}
	sig3 := new(big.Int).SetBytes(reverseBytes(sig3Bytes))

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
