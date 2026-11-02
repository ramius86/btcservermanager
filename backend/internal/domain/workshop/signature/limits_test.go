package signature

import (
	"bytes"
	"crypto/sha1"
	"encoding/binary"
	"strings"
	"testing"
)

// encodeBISign builds a syntactically valid .bisign payload. When writeSig is
// false the declared signature length is emitted without its body, which is
// exactly the shape a corrupted or truncated file has.
func encodeBISign(t *testing.T, sigLen uint32, writeSig bool) []byte {
	t.Helper()

	var buf bytes.Buffer
	buf.WriteString("TestKey\x00")

	const modulusBits uint32 = 2048

	write := func(v uint32) {
		if err := binary.Write(&buf, binary.LittleEndian, v); err != nil {
			t.Fatalf("write header: %v", err)
		}
	}

	write(modulusBits/8 + 20) // temp
	write(0)                  // u1
	write(0)                  // u2
	write(0)                  // u3
	write(modulusBits)
	write(65537)

	modulus := make([]byte, modulusBits/8)
	modulus[0] = 0x01
	buf.Write(modulus)

	write(sigLen)
	if !writeSig {
		return buf.Bytes()
	}
	buf.Write(bytes.Repeat([]byte{0x02}, int(sigLen)))

	write(uint32(VersionV3))

	write(16)
	buf.Write(bytes.Repeat([]byte{0x03}, 16))

	write(16)
	buf.Write(bytes.Repeat([]byte{0x04}, 16))

	return buf.Bytes()
}

func TestParseBISign_AcceptsWellFormedFile(t *testing.T) {
	sig, err := ParseBISign(bytes.NewReader(encodeBISign(t, 256, true)))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if sig.Name != "TestKey" {
		t.Errorf("expected Name TestKey, got %q", sig.Name)
	}
	if sig.Length != 2048 {
		t.Errorf("expected Length 2048, got %d", sig.Length)
	}
	if sig.Version != VersionV3 {
		t.Errorf("expected VersionV3, got %d", sig.Version)
	}
}

func TestParseBISign_RejectsOversizedSignatureLength(t *testing.T) {
	_, err := ParseBISign(bytes.NewReader(encodeBISign(t, 1<<30, false)))
	if err == nil {
		t.Fatal("expected an error for an oversized signature length")
	}
	if !strings.Contains(err.Error(), "invalid sig1 length") {
		t.Fatalf("expected a sig1 length error, got %v", err)
	}
}

func TestPadHash_RejectsBlockTooSmallForDigestInfo(t *testing.T) {
	digest := make([]byte, sha1.Size)

	for _, size := range []int{0, 1, 8, 20, minSHA1PKCS1Size - 1} {
		if got := PadHash(digest, size); got != nil {
			t.Errorf("size %d: expected nil, got %v", size, got)
		}
	}
}

func TestPadHash_RejectsWrongDigestLength(t *testing.T) {
	if got := PadHash([]byte{0x01}, 256); got != nil {
		t.Errorf("expected nil for a non-SHA1 digest, got %v", got)
	}
}

func TestPadHash_BuildsPaddedBlock(t *testing.T) {
	got := PadHash(make([]byte, sha1.Size), 256)
	if got == nil {
		t.Fatal("expected a padded block")
	}
	if got.BitLen() > 2048 {
		t.Errorf("block exceeds the 2048-bit key size: %d bits", got.BitLen())
	}
}

func TestGenerateHashes_RejectsKeyTooSmallForSHA1(t *testing.T) {
	pbo := &PBO{}

	_, _, _, err := GenerateHashes(pbo, VersionV3, 8)
	if err == nil {
		t.Fatal("expected an error for an 8-bit key")
	}
	if !strings.Contains(err.Error(), "too small") {
		t.Fatalf("expected a key-size error, got %v", err)
	}
}

func TestGenerateHashes_AcceptsRealisticKey(t *testing.T) {
	pbo := &PBO{}

	pad1, pad2, pad3, err := GenerateHashes(pbo, VersionV3, 2048)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pad1 == nil || pad2 == nil || pad3 == nil {
		t.Fatal("expected all three padded hashes")
	}
}
