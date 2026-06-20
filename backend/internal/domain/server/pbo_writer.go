package server

import (
	"bytes"
	"crypto/sha1"
	"encoding/binary"
	"io"
	"time"
)

// HeaderEntry is a simple ArmA 3 header entry
type HeaderEntry struct {
	FileName                                                   string
	PackingMethod, OriginalSize, Reserved, TimeStamp, DataSize uint32
}

// PBOWriter is a struct for creating a .pbo-file easily in memory
type PBOWriter struct {
	Buffer *bytes.Buffer
	files  map[string][]byte
	Prefix string
}

func NewPBOWriter() *PBOWriter {
	return &PBOWriter{
		Buffer: &bytes.Buffer{},
		files:  make(map[string][]byte),
	}
}

// AddFile adds a file with its content to the PBO
func (pbo *PBOWriter) AddFile(name string, content []byte) {
	pbo.files[name] = content
}

// WriteHeader writes a normal file header to the buffer
func (pbo *PBOWriter) WriteHeader(header HeaderEntry) error {
	tmpV := []byte(header.FileName)
	err := binary.Write(pbo.Buffer, binary.BigEndian, tmpV)
	if err != nil {
		return err
	}
	pbo.Buffer.WriteByte(0x00)

	if err = binary.Write(pbo.Buffer, binary.LittleEndian, header.PackingMethod); err != nil {
		return err
	}
	if err = binary.Write(pbo.Buffer, binary.LittleEndian, header.OriginalSize); err != nil {
		return err
	}
	if err = binary.Write(pbo.Buffer, binary.LittleEndian, header.Reserved); err != nil {
		return err
	}
	if err = binary.Write(pbo.Buffer, binary.LittleEndian, header.TimeStamp); err != nil {
		return err
	}
	if err = binary.Write(pbo.Buffer, binary.LittleEndian, header.DataSize); err != nil {
		return err
	}

	return nil
}

// WriteProperty writes a key-value property for the sreV header
func (pbo *PBOWriter) WriteProperty(key, value string) error {
	if err := binary.Write(pbo.Buffer, binary.BigEndian, []byte(key)); err != nil {
		return err
	}
	if err := pbo.Buffer.WriteByte(0x00); err != nil {
		return err
	}
	if err := binary.Write(pbo.Buffer, binary.BigEndian, []byte(value)); err != nil {
		return err
	}
	if err := pbo.Buffer.WriteByte(0x00); err != nil {
		return err
	}
	return nil
}

// WriteTo generates the PBO format and writes it to the provided io.Writer
func (pbo *PBOWriter) WriteTo(w io.Writer) (int64, error) {
	pbo.Buffer.Reset()

	// Write prefix header extension if a Prefix is set
	if pbo.Prefix != "" {
		err := pbo.WriteHeader(HeaderEntry{
			FileName:      "",
			PackingMethod: 0x56657273, // "sreV"
			OriginalSize:  0,
			Reserved:      0,
			TimeStamp:     0,
			DataSize:      0,
		})
		if err != nil {
			return 0, err
		}

		if err := pbo.WriteProperty("prefix", pbo.Prefix); err != nil {
			return 0, err
		}

		// Empty string to terminate properties list
		if err := pbo.Buffer.WriteByte(0x00); err != nil {
			return 0, err
		}
	}

	// Write file headers
	for name, content := range pbo.files {
		size := uint32(len(content))
		timestamp := uint32(time.Now().Unix())

		err := pbo.WriteHeader(HeaderEntry{
			FileName:      name,
			PackingMethod: 0x0,
			OriginalSize:  size,
			Reserved:      0,
			TimeStamp:     timestamp,
			DataSize:      size,
		})
		if err != nil {
			return 0, err
		}
	}

	// Write empty terminator header
	if err := pbo.WriteHeader(HeaderEntry{}); err != nil {
		return 0, err
	}

	// Write file data
	for _, content := range pbo.files {
		if _, err := pbo.Buffer.Write(content); err != nil {
			return 0, err
		}
	}

	// Calculate and write checksum
	hash := sha1.New()
	hash.Write(pbo.Buffer.Bytes())
	checksum := hash.Sum(nil)

	pbo.Buffer.WriteByte(0x00)
	pbo.Buffer.Write(checksum)

	// Write buffer to io.Writer
	n, err := pbo.Buffer.WriteTo(w)
	return n, err
}
