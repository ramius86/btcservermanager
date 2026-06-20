package server

import (
	"bytes"
	"testing"
)

func TestPBOWriter(t *testing.T) {
	t.Parallel()
	writer := NewPBOWriter()
	writer.AddFile("config.cpp", []byte("test config"))
	writer.AddFile("cba_settings.sqf", []byte("test settings"))

	var buf bytes.Buffer
	_, err := writer.WriteTo(&buf)
	if err != nil {
		t.Fatalf("Failed to write PBO: %v", err)
	}

	if buf.Len() == 0 {
		t.Errorf("Expected non-empty buffer")
	}

	content := buf.Bytes()
	if !bytes.Contains(content, []byte("config.cpp")) {
		t.Errorf("Expected config.cpp in PBO")
	}
	if !bytes.Contains(content, []byte("cba_settings.sqf")) {
		t.Errorf("Expected cba_settings.sqf in PBO")
	}
	if !bytes.Contains(content, []byte("test config")) {
		t.Errorf("Expected test config in PBO")
	}
}
