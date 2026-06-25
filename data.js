window.BENCHMARK_DATA = {
  "lastUpdate": 1782410049445,
  "repoUrl": "https://github.com/ramius86/btcservermanager",
  "entries": {
    "BTC Server Manager Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "committer": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "distinct": true,
          "id": "994a0ba8403994dfb84522d3c315d8b4143eaf21",
          "message": "feat: add 'No Response' tracking for Discord events and update dependencies",
          "timestamp": "2026-06-21T21:08:50+02:00",
          "tree_id": "396dc24607ff7d369096d3a739c429f3cb168a0c",
          "url": "https://github.com/ramius86/btcservermanager/commit/994a0ba8403994dfb84522d3c315d8b4143eaf21"
        },
        "date": 1782070903206,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 58094,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20283 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 58094,
            "unit": "ns/op",
            "extra": "20283 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20283 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20283 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46250,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25833 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46250,
            "unit": "ns/op",
            "extra": "25833 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25833 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25833 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.93,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60184730 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.93,
            "unit": "ns/op",
            "extra": "60184730 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60184730 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60184730 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 277.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4277853 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 277.9,
            "unit": "ns/op",
            "extra": "4277853 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4277853 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4277853 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111420,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111420,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 61554,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19364 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61554,
            "unit": "ns/op",
            "extra": "19364 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19364 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19364 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 317183,
            "unit": "ns/op\t   61243 B/op\t     718 allocs/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 317183,
            "unit": "ns/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61243,
            "unit": "B/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 5196,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "226196 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 5196,
            "unit": "ns/op",
            "extra": "226196 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "226196 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "226196 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33614,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35826 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33614,
            "unit": "ns/op",
            "extra": "35826 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35826 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35826 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16156,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74776 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16156,
            "unit": "ns/op",
            "extra": "74776 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74776 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74776 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 77199,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15550 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 77199,
            "unit": "ns/op",
            "extra": "15550 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15550 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15550 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5241,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "224166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5241,
            "unit": "ns/op",
            "extra": "224166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "224166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "224166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21889,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55242 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21889,
            "unit": "ns/op",
            "extra": "55242 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55242 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55242 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2136,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "607015 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2136,
            "unit": "ns/op",
            "extra": "607015 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "607015 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "607015 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 600.4,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1999976 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 600.4,
            "unit": "ns/op",
            "extra": "1999976 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1999976 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1999976 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.61,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.61,
            "unit": "ns/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 27205,
            "unit": "ns/op\t    1598 B/op\t      35 allocs/op",
            "extra": "43722 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27205,
            "unit": "ns/op",
            "extra": "43722 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1598,
            "unit": "B/op",
            "extra": "43722 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43722 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10048,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117386 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10048,
            "unit": "ns/op",
            "extra": "117386 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117386 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117386 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2699,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "441906 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2699,
            "unit": "ns/op",
            "extra": "441906 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "441906 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "441906 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2058,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "567326 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2058,
            "unit": "ns/op",
            "extra": "567326 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "567326 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "567326 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1097,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1097,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 231342,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5052 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 231342,
            "unit": "ns/op",
            "extra": "5052 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5052 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5052 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 258.3,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4654026 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 258.3,
            "unit": "ns/op",
            "extra": "4654026 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4654026 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4654026 times\n4 procs"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "committer": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "distinct": true,
          "id": "5f97c590ae2ed7d6f749574963f7aee823e44de1",
          "message": "fix: resolve server start cancellation & negative uptime, update deps\n\n- Updated frontend and backend dependencies\n\n- Decoupled handleStartServer and handleRestartServer from HTTP request context to prevent cancellation on page navigation\n\n- Clamped negative uptime values in formatUptime",
          "timestamp": "2026-06-23T18:11:18+02:00",
          "tree_id": "044553550dd8f3f08a3e9a67714ae4819ad32b5c",
          "url": "https://github.com/ramius86/btcservermanager/commit/5f97c590ae2ed7d6f749574963f7aee823e44de1"
        },
        "date": 1782231181325,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 59987,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "19401 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 59987,
            "unit": "ns/op",
            "extra": "19401 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "19401 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "19401 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46231,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25948 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46231,
            "unit": "ns/op",
            "extra": "25948 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25948 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25948 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.66,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60187562 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.66,
            "unit": "ns/op",
            "extra": "60187562 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60187562 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60187562 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 290.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4126033 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 290.4,
            "unit": "ns/op",
            "extra": "4126033 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4126033 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4126033 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 125135,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9592 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 125135,
            "unit": "ns/op",
            "extra": "9592 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9592 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9592 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 60977,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19713 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60977,
            "unit": "ns/op",
            "extra": "19713 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19713 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19713 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 310941,
            "unit": "ns/op\t   61323 B/op\t     718 allocs/op",
            "extra": "3819 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 310941,
            "unit": "ns/op",
            "extra": "3819 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61323,
            "unit": "B/op",
            "extra": "3819 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3819 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4772,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "245770 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4772,
            "unit": "ns/op",
            "extra": "245770 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "245770 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "245770 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33552,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "34942 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33552,
            "unit": "ns/op",
            "extra": "34942 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "34942 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34942 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16164,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74565 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16164,
            "unit": "ns/op",
            "extra": "74565 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74565 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74565 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 77891,
            "unit": "ns/op\t  332153 B/op\t       8 allocs/op",
            "extra": "15588 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 77891,
            "unit": "ns/op",
            "extra": "15588 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332153,
            "unit": "B/op",
            "extra": "15588 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15588 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5232,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "224164 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5232,
            "unit": "ns/op",
            "extra": "224164 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "224164 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "224164 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22375,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54734 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22375,
            "unit": "ns/op",
            "extra": "54734 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54734 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54734 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1946,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "622884 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1946,
            "unit": "ns/op",
            "extra": "622884 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "622884 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "622884 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 595.1,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2013033 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 595.1,
            "unit": "ns/op",
            "extra": "2013033 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2013033 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2013033 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.72,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.72,
            "unit": "ns/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 27265,
            "unit": "ns/op\t    1595 B/op\t      35 allocs/op",
            "extra": "43930 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27265,
            "unit": "ns/op",
            "extra": "43930 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1595,
            "unit": "B/op",
            "extra": "43930 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43930 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10065,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "116508 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10065,
            "unit": "ns/op",
            "extra": "116508 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "116508 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "116508 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2701,
            "unit": "ns/op\t     287 B/op\t       7 allocs/op",
            "extra": "460164 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2701,
            "unit": "ns/op",
            "extra": "460164 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 287,
            "unit": "B/op",
            "extra": "460164 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "460164 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2038,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "587480 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2038,
            "unit": "ns/op",
            "extra": "587480 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "587480 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "587480 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1124,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1124,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 230832,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5174 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 230832,
            "unit": "ns/op",
            "extra": "5174 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5174 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5174 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 259.2,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4636856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 259.2,
            "unit": "ns/op",
            "extra": "4636856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4636856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4636856 times\n4 procs"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "committer": {
            "email": "ramius86@users.noreply.github.com",
            "name": "Marco",
            "username": "ramius86"
          },
          "distinct": true,
          "id": "908ba7160fd767d4986ad3af748e921eb8b3dbd0",
          "message": "fix(api): allow fetching historical Reforger stats by fixing log resolution",
          "timestamp": "2026-06-25T19:52:07+02:00",
          "tree_id": "e8d2ecf934fe4cde09afddb69eea2b810d11b9fb",
          "url": "https://github.com/ramius86/btcservermanager/commit/908ba7160fd767d4986ad3af748e921eb8b3dbd0"
        },
        "date": 1782410049046,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 57794,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20679 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 57794,
            "unit": "ns/op",
            "extra": "20679 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20679 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20679 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 47342,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25200 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 47342,
            "unit": "ns/op",
            "extra": "25200 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25200 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25200 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.69,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "58636836 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.69,
            "unit": "ns/op",
            "extra": "58636836 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "58636836 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "58636836 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 277.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4332207 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 277.2,
            "unit": "ns/op",
            "extra": "4332207 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4332207 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4332207 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111868,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9859 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111868,
            "unit": "ns/op",
            "extra": "9859 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9859 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9859 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 62509,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19179 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62509,
            "unit": "ns/op",
            "extra": "19179 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19179 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316502,
            "unit": "ns/op\t   61317 B/op\t     718 allocs/op",
            "extra": "3768 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316502,
            "unit": "ns/op",
            "extra": "3768 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61317,
            "unit": "B/op",
            "extra": "3768 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3768 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4786,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "244720 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4786,
            "unit": "ns/op",
            "extra": "244720 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "244720 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "244720 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34304,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35115 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34304,
            "unit": "ns/op",
            "extra": "35115 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35115 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35115 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16285,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "70653 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16285,
            "unit": "ns/op",
            "extra": "70653 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "70653 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "70653 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 76197,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15752 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 76197,
            "unit": "ns/op",
            "extra": "15752 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15752 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15752 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5443,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "219051 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5443,
            "unit": "ns/op",
            "extra": "219051 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "219051 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "219051 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22023,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "53320 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22023,
            "unit": "ns/op",
            "extra": "53320 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "53320 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "53320 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2144,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "601162 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2144,
            "unit": "ns/op",
            "extra": "601162 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "601162 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "601162 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 600.4,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1994016 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 600.4,
            "unit": "ns/op",
            "extra": "1994016 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1994016 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1994016 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.63,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.63,
            "unit": "ns/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 27325,
            "unit": "ns/op\t    1615 B/op\t      35 allocs/op",
            "extra": "44274 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27325,
            "unit": "ns/op",
            "extra": "44274 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1615,
            "unit": "B/op",
            "extra": "44274 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44274 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9918,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9918,
            "unit": "ns/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2715,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "436969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2715,
            "unit": "ns/op",
            "extra": "436969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "436969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "436969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2044,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "582769 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2044,
            "unit": "ns/op",
            "extra": "582769 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "582769 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "582769 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1083,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1083,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 230999,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5065 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 230999,
            "unit": "ns/op",
            "extra": "5065 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5065 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5065 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 265.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4278548 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 265.1,
            "unit": "ns/op",
            "extra": "4278548 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4278548 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4278548 times\n4 procs"
          }
        ]
      }
    ]
  }
}