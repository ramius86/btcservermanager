package api

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestStatsLogPathFor(t *testing.T) {
	assert.Equal(t,
		"/app/storage/logs/ARMA3_1_20260101_120000.stats.log",
		statsLogPathFor("/app/storage/logs/ARMA3_1_20260101_120000.log"))

	// The logs directory itself contains ".log": replacing the first occurrence
	// in the whole path used to rewrite the directory and lose the file
	// ("/mnt.stats.logs.archive/..."), so the stats file was never found.
	assert.Equal(t,
		"/mnt/logs.archive/ARMA3_1_20260101_120000.stats.log",
		statsLogPathFor("/mnt/logs.archive/ARMA3_1_20260101_120000.log"))

	// A path without an extension still yields a .stats file next to the log.
	assert.Equal(t, "/app/storage/logs/weird.stats", statsLogPathFor("/app/storage/logs/weird"))
}
