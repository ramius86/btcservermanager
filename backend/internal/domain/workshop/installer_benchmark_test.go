package workshop

import (
	"path/filepath"
	"strings"
	"testing"
)

func BenchmarkDirectoryToLowercase_Dry(b *testing.B) {
	// We benchmark the walking and logic part without actual filesystem mutation
	// by simulating the walk on a fake structure or just benchmarking the string parts
	paths := make([]string, 1000)
	for i := 0; i < 1000; i++ {
		paths[i] = filepath.Join("C:", "Steam", "steamapps", "workshop", "content", "107410", "123456789", "Addons", "MyModFile_WithCase.pbo")
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		for _, p := range paths {
			_ = strings.ToLower(filepath.Base(p))
			_ = filepath.Dir(p)
		}
	}
}

// Benchmark the core logic of the installer's directory walk (mocking OS calls would be complex,
// so we focus on the string processing which is the bulk of the "computation" here)
func BenchmarkPathNormalization(b *testing.B) {
	testPath := "@My_Very_Complex_Mod_Name_V1.2.3/Addons/Data_Files_01.PBO"

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_ = strings.ToLower(testPath)
		_ = filepath.Clean(testPath)
	}
}
