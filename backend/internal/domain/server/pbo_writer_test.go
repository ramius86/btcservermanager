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

func TestPBOWriter_DeterministicOrder(t *testing.T) {
	t.Parallel()

	files := map[string][]byte{
		"z_script.sqf":      []byte("hint 'z';"),
		"config.cpp":        []byte("class CfgPatches {};"),
		"cba_settings.sqf":  []byte("force cba_network_load = 1;"),
		"a_init.sqf":        []byte("diag_log 'init';"),
		"m_description.ext": []byte("author = 'BTC';"),
	}

	expectedOrder := []string{
		"a_init.sqf",
		"cba_settings.sqf",
		"config.cpp",
		"m_description.ext",
		"z_script.sqf",
	}

	for i := 0; i < 20; i++ {
		writer := NewPBOWriter()
		writer.Prefix = "btc_test_prefix"
		for name, content := range files {
			writer.AddFile(name, content)
		}

		var buf bytes.Buffer
		if _, err := writer.WriteTo(&buf); err != nil {
			t.Fatalf("iteration %d: WriteTo failed: %v", i, err)
		}

		raw := buf.Bytes()

		// Verify header order: each file name should appear before the next in the header section
		lastIndex := 0
		for _, name := range expectedOrder {
			idx := bytes.Index(raw[lastIndex:], []byte(name+"\x00"))
			if idx == -1 {
				t.Fatalf("iteration %d: header %q not found in order after offset %d", i, name, lastIndex)
			}
			lastIndex += idx + len(name) + 1
		}

		// Verify data order: concatenated file data must appear in exact expected order
		var expectedData bytes.Buffer
		for _, name := range expectedOrder {
			expectedData.Write(files[name])
		}

		if !bytes.Contains(raw, expectedData.Bytes()) {
			t.Fatalf("iteration %d: file data is not contiguous in the expected sorted order", i)
		}
	}
}
