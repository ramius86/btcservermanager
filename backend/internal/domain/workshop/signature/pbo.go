package signature

import (
	"crypto/sha1"
	"encoding/binary"
	"fmt"
	"io"
	"math/big"
	"os"
	"sort"
	"strings"
)

// PBOHeader contains metadata for a single file entry in the PBO.
type PBOHeader struct {
	Filename      string
	PackingMethod uint32
	OriginalSize  uint32
	Reserved      uint32
	Timestamp     uint32
	DataSize      uint32
	DataOffset    int64 // Byte offset in the PBO file where file data begins
}

// PBO represents an opened PBO archive.
type PBO struct {
	File             *os.File
	Headers          []PBOHeader
	HeaderExtensions map[string]string
	Checksum         [20]byte // 20-byte SHA-1 stored at EOF
	ComputedChecksum [20]byte // 20-byte SHA-1 computed over all headers and data
	Prefix           string
}

// Close closes the underlying PBO file.
func (p *PBO) Close() error {
	if p != nil && p.File != nil {
		return p.File.Close()
	}
	return nil
}

// OpenPBO opens a PBO file for inspection and hash generation.
// It verifies the whole-file checksum against the stored checksum.
func OpenPBO(path string) (*PBO, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	stat, err := f.Stat()
	if err != nil {
		_ = f.Close()
		return nil, err
	}

	if stat.Size() < 21 {
		_ = f.Close()
		return nil, fmt.Errorf("pbo file too small (%d bytes)", stat.Size())
	}

	pbo := &PBO{
		File:             f,
		HeaderExtensions: make(map[string]string),
	}

	// 1. Calculate whole-file SHA-1 checksum up to EOF - 21 bytes (before 0x00 and 20-byte checksum)
	chkHasher := sha1.New()
	contentSec := io.NewSectionReader(f, 0, stat.Size()-21)
	buf := make([]byte, 32*1024)
	if _, err := io.CopyBuffer(chkHasher, contentSec, buf); err != nil {
		_ = f.Close()
		return nil, fmt.Errorf("hash pbo contents: %w", err)
	}
	copy(pbo.ComputedChecksum[:], chkHasher.Sum(nil))

	// 2. Read headers starting from offset 0
	if _, err := f.Seek(0, io.SeekStart); err != nil {
		_ = f.Close()
		return nil, err
	}

	first := true
	for {
		fname, err := readCString(f)
		if err != nil {
			_ = f.Close()
			return nil, fmt.Errorf("read header filename: %w", err)
		}

		var pm, osz, resv, ts, dsz uint32
		if err := binary.Read(f, binary.LittleEndian, &pm); err != nil {
			_ = f.Close()
			return nil, err
		}
		if err := binary.Read(f, binary.LittleEndian, &osz); err != nil {
			_ = f.Close()
			return nil, err
		}
		if err := binary.Read(f, binary.LittleEndian, &resv); err != nil {
			_ = f.Close()
			return nil, err
		}
		if err := binary.Read(f, binary.LittleEndian, &ts); err != nil {
			_ = f.Close()
			return nil, err
		}
		if err := binary.Read(f, binary.LittleEndian, &dsz); err != nil {
			_ = f.Close()
			return nil, err
		}

		// Check for product version / extension header (0x56657273 = "Vers")
		if pm == 0x56657273 {
			for {
				k, err := readCString(f)
				if err != nil {
					_ = f.Close()
					return nil, err
				}
				if k == "" {
					break
				}
				v, err := readCString(f)
				if err != nil {
					_ = f.Close()
					return nil, err
				}
				pbo.HeaderExtensions[k] = v
			}
		} else if fname == "" && !first {
			// Terminal header
			break
		} else if fname != "" {
			pbo.Headers = append(pbo.Headers, PBOHeader{
				Filename:      fname,
				PackingMethod: pm,
				OriginalSize:  osz,
				Reserved:      resv,
				Timestamp:     ts,
				DataSize:      dsz,
			})
		}
		first = false
	}

	// 3. Mark data offsets
	dataOffset, err := f.Seek(0, io.SeekCurrent)
	if err != nil {
		_ = f.Close()
		return nil, err
	}

	for i := range pbo.Headers {
		pbo.Headers[i].DataOffset = dataOffset
		dataOffset += int64(pbo.Headers[i].DataSize)
	}

	// Read stored checksum (last 20 bytes)
	if _, err := f.Seek(stat.Size()-20, io.SeekStart); err != nil {
		_ = f.Close()
		return nil, err
	}
	if _, err := io.ReadFull(f, pbo.Checksum[:]); err != nil {
		_ = f.Close()
		return nil, err
	}

	pbo.Prefix = pbo.HeaderExtensions["prefix"]

	return pbo, nil
}

// NameHash generates the SHA-1 digest of sorted lowercase non-empty filenames.
func NameHash(pbo *PBO) [20]byte {
	var names []string
	for _, h := range pbo.Headers {
		if h.DataSize > 0 {
			names = append(names, strings.ToLower(h.Filename))
		}
	}
	sort.Strings(names)

	hasher := sha1.New()
	for _, n := range names {
		hasher.Write([]byte(n))
	}
	var res [20]byte
	copy(res[:], hasher.Sum(nil))
	return res
}

func shouldIncludeInFileHash(ext string, version BISignVersion) bool {
	if version == VersionV2 {
		switch ext {
		case "paa", "jpg", "p3d", "tga", "rvmat", "lip", "ogg", "wss", "png", "rtm", "pac", "fxy", "wrp":
			return false
		default:
			return true
		}
	}
	if version == VersionV3 {
		switch ext {
		case "sqf", "inc", "bikb", "ext", "fsm", "sqm", "hpp", "cfg", "sqs", "h":
			return true
		default:
			return false
		}
	}
	return true
}

// FileHash generates the SHA-1 digest over the content of relevant files according to signature version.
func FileHash(pbo *PBO, version BISignVersion) ([20]byte, error) {
	hasher := sha1.New()
	nothing := true
	buf := make([]byte, 32*1024)

	for _, h := range pbo.Headers {
		parts := strings.Split(h.Filename, ".")
		ext := strings.ToLower(parts[len(parts)-1])

		if !shouldIncludeInFileHash(ext, version) {
			continue
		}

		sec := io.NewSectionReader(pbo.File, h.DataOffset, int64(h.DataSize))
		if _, err := io.CopyBuffer(hasher, sec, buf); err != nil {
			return [20]byte{}, fmt.Errorf("read section for %s: %w", h.Filename, err)
		}
		nothing = false
	}

	if nothing {
		if version == VersionV2 {
			hasher.Write([]byte("nothing"))
		} else {
			hasher.Write([]byte("gnihton"))
		}
	}

	var res [20]byte
	copy(res[:], hasher.Sum(nil))
	return res, nil
}

// GenerateHashes computes the padded PKCS#1 v1.5 hashes (pad1, pad2, pad3) for RSA signature verification.
func GenerateHashes(pbo *PBO, version BISignVersion, keyLength uint32) (*big.Int, *big.Int, *big.Int, error) {
	hash1 := pbo.Checksum[:]

	nh := NameHash(pbo)

	// Hash 2: SHA1(hash1 + nh + prefix\)
	h2 := sha1.New()
	h2.Write(hash1)
	h2.Write(nh[:])
	if pbo.Prefix != "" {
		h2.Write([]byte(pbo.Prefix))
		if !strings.HasSuffix(pbo.Prefix, "\\") {
			h2.Write([]byte("\\"))
		}
	}
	hash2 := h2.Sum(nil)

	// Hash 3: SHA1(fh + nh + prefix\)
	fh, err := FileHash(pbo, version)
	if err != nil {
		return nil, nil, nil, err
	}

	h3 := sha1.New()
	h3.Write(fh[:])
	h3.Write(nh[:])
	if pbo.Prefix != "" {
		h3.Write([]byte(pbo.Prefix))
		if !strings.HasSuffix(pbo.Prefix, "\\") {
			h3.Write([]byte("\\"))
		}
	}
	hash3 := h3.Sum(nil)

	size := int(keyLength / 8)
	return PadHash(hash1, size), PadHash(hash2, size), PadHash(hash3, size), nil
}

// PadHash formats a 20-byte SHA-1 digest into standard PKCS#1 v1.5 RSA signature padding.
func PadHash(hash []byte, size int) *big.Int {
	buf := make([]byte, size)
	buf[0] = 0x00
	buf[1] = 0x01
	for i := 2; i < size-36; i++ {
		buf[i] = 0xFF
	}
	buf[size-36] = 0x00
	// ASN.1 DigestInfo prefix for SHA-1
	asn1Header := []byte{0x30, 0x21, 0x30, 0x09, 0x06, 0x05, 0x2b, 0x0e, 0x03, 0x02, 0x1a, 0x05, 0x00, 0x04, 0x14}
	copy(buf[size-35:], asn1Header)
	copy(buf[size-20:], hash)

	return new(big.Int).SetBytes(buf)
}
