package server

import (
	"io"
	"testing"
)

func BenchmarkPBOWriter(b *testing.B) {
	content := []byte(`class CfgPatches {
    class cba_settings_userconfig {
        author = "Benchmark";
        version = 1.0;
    };
};`)

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		pbo := NewPBOWriter()
		pbo.Prefix = "cba_settings_userconfig"
		pbo.AddFile("config.cpp", content)
		pbo.AddFile("cba_settings.sqf", []byte("force cba_network_load = 1;"))

		_, _ = pbo.WriteTo(io.Discard)
	}
}
