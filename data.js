window.BENCHMARK_DATA = {
  "lastUpdate": 1783772353790,
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
          "id": "e0cd11397cfe5d91ef51d32816a1b83b6efded21",
          "message": "fix(reforger): remove stats.log spam and improve historical stats performance\n\n- Removed isReforgerPreamble to prevent mod errors and initialization logs from being diverted to stats.log instead of main log.\n\n- Increased maxStats limit to 15000 in backend and frontend to support tracking up to 12-hour sessions.\n\n- Implemented smart chunk-based downsampling (minimum FPS preservation) in ReforgerStatsDashboard to render large historical datasets efficiently in Chart.js without performance degradation.\n\n- Fixed TS linter warnings in ReforgerStatsDashboard.",
          "timestamp": "2026-06-25T22:40:43+02:00",
          "tree_id": "b04e76f52c14d8494dee2b756450672815dff2d7",
          "url": "https://github.com/ramius86/btcservermanager/commit/e0cd11397cfe5d91ef51d32816a1b83b6efded21"
        },
        "date": 1782420139279,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 56308,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "21237 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 56308,
            "unit": "ns/op",
            "extra": "21237 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "21237 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21237 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 45845,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "26107 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 45845,
            "unit": "ns/op",
            "extra": "26107 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "26107 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "26107 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.67,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60020607 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.67,
            "unit": "ns/op",
            "extra": "60020607 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60020607 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60020607 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 305.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4066246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 305.7,
            "unit": "ns/op",
            "extra": "4066246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4066246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4066246 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 108948,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 108948,
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
            "value": 60285,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19916 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60285,
            "unit": "ns/op",
            "extra": "19916 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19916 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19916 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 306178,
            "unit": "ns/op\t   61296 B/op\t     718 allocs/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 306178,
            "unit": "ns/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61296,
            "unit": "B/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4949,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "242390 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4949,
            "unit": "ns/op",
            "extra": "242390 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "242390 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "242390 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33251,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35509 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33251,
            "unit": "ns/op",
            "extra": "35509 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35509 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35509 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15971,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "75288 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15971,
            "unit": "ns/op",
            "extra": "75288 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "75288 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "75288 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 74967,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16033 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 74967,
            "unit": "ns/op",
            "extra": "16033 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16033 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16033 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5301,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "220795 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5301,
            "unit": "ns/op",
            "extra": "220795 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "220795 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "220795 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21718,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55351 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21718,
            "unit": "ns/op",
            "extra": "55351 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55351 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55351 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2115,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "602251 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2115,
            "unit": "ns/op",
            "extra": "602251 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "602251 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "602251 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 610.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1967926 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 610.9,
            "unit": "ns/op",
            "extra": "1967926 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1967926 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1967926 times\n4 procs"
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
            "value": 27300,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "43699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27300,
            "unit": "ns/op",
            "extra": "43699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "43699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10004,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10004,
            "unit": "ns/op",
            "extra": "117852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2713,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "452718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2713,
            "unit": "ns/op",
            "extra": "452718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "452718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "452718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2048,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "604485 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2048,
            "unit": "ns/op",
            "extra": "604485 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "604485 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "604485 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1084,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1084,
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
            "value": 233370,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5146 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 233370,
            "unit": "ns/op",
            "extra": "5146 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5146 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5146 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 258.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4636321 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 258.4,
            "unit": "ns/op",
            "extra": "4636321 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4636321 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4636321 times\n4 procs"
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
          "id": "9354084178193870a035159ed1d6a560bcc72967",
          "message": "fix(reforger): drop cyclic telemetry wrapper spam from main log\n\nAdded isReforgerSpam to strictly match and drop 'WORLD : UpdateEntities' and 'WORLD : Frame' lines that wrap telemetry output, preventing them from flooding the main server log and WebSocket clients.",
          "timestamp": "2026-06-26T17:12:01+02:00",
          "tree_id": "80f152a95f001c55ac59806c8fec73ae0097157e",
          "url": "https://github.com/ramius86/btcservermanager/commit/9354084178193870a035159ed1d6a560bcc72967"
        },
        "date": 1782486825370,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 63508,
            "unit": "ns/op\t   15583 B/op\t     201 allocs/op",
            "extra": "21088 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 63508,
            "unit": "ns/op",
            "extra": "21088 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15583,
            "unit": "B/op",
            "extra": "21088 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21088 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46675,
            "unit": "ns/op\t    8780 B/op\t     139 allocs/op",
            "extra": "25558 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46675,
            "unit": "ns/op",
            "extra": "25558 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8780,
            "unit": "B/op",
            "extra": "25558 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25558 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.76,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60657738 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.76,
            "unit": "ns/op",
            "extra": "60657738 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60657738 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60657738 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 276.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4356771 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 276.7,
            "unit": "ns/op",
            "extra": "4356771 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4356771 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4356771 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 110332,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 110332,
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
            "value": 61200,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61200,
            "unit": "ns/op",
            "extra": "19590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19590 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 313088,
            "unit": "ns/op\t   61238 B/op\t     718 allocs/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 313088,
            "unit": "ns/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61238,
            "unit": "B/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3763 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4796,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "246897 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4796,
            "unit": "ns/op",
            "extra": "246897 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "246897 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "246897 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34803,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "35064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34803,
            "unit": "ns/op",
            "extra": "35064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "35064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16220,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73777 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16220,
            "unit": "ns/op",
            "extra": "73777 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73777 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73777 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 76212,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15813 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 76212,
            "unit": "ns/op",
            "extra": "15813 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15813 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15813 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5353,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "223272 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5353,
            "unit": "ns/op",
            "extra": "223272 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "223272 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "223272 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21787,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54999 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21787,
            "unit": "ns/op",
            "extra": "54999 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54999 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54999 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1933,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "628354 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1933,
            "unit": "ns/op",
            "extra": "628354 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "628354 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "628354 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 608.2,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1942891 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 608.2,
            "unit": "ns/op",
            "extra": "1942891 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1942891 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1942891 times\n4 procs"
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
            "value": 27064,
            "unit": "ns/op\t    1595 B/op\t      35 allocs/op",
            "extra": "43950 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27064,
            "unit": "ns/op",
            "extra": "43950 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1595,
            "unit": "B/op",
            "extra": "43950 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43950 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9998,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117901 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9998,
            "unit": "ns/op",
            "extra": "117901 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117901 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117901 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2685,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "444369 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2685,
            "unit": "ns/op",
            "extra": "444369 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "444369 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "444369 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2134,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "583272 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2134,
            "unit": "ns/op",
            "extra": "583272 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "583272 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "583272 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1093,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1093,
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
            "value": 229063,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 229063,
            "unit": "ns/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 269.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4605409 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 269.4,
            "unit": "ns/op",
            "extra": "4605409 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4605409 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4605409 times\n4 procs"
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
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ad68e1cd99acd59d498f8c95c4c883868ecd01f0",
          "message": "Merge pull request #1 from ramius86/dependabot/github_actions/actions/setup-go-6.5.0\n\nchore(deps): bump actions/setup-go from 6.4.0 to 6.5.0",
          "timestamp": "2026-06-27T15:28:23+02:00",
          "tree_id": "19bf2040609aefd84f5364c49d2dcf9dce154486",
          "url": "https://github.com/ramius86/btcservermanager/commit/ad68e1cd99acd59d498f8c95c4c883868ecd01f0"
        },
        "date": 1782566976810,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 56621,
            "unit": "ns/op\t   15584 B/op\t     201 allocs/op",
            "extra": "21152 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 56621,
            "unit": "ns/op",
            "extra": "21152 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15584,
            "unit": "B/op",
            "extra": "21152 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21152 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 48976,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25827 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 48976,
            "unit": "ns/op",
            "extra": "25827 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25827 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25827 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60178765 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.9,
            "unit": "ns/op",
            "extra": "60178765 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60178765 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60178765 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 262.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4605168 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 262.2,
            "unit": "ns/op",
            "extra": "4605168 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4605168 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4605168 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 110155,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9900 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 110155,
            "unit": "ns/op",
            "extra": "9900 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9900 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9900 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 61773,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19356 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61773,
            "unit": "ns/op",
            "extra": "19356 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19356 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19356 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308425,
            "unit": "ns/op\t   61313 B/op\t     718 allocs/op",
            "extra": "3846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308425,
            "unit": "ns/op",
            "extra": "3846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61313,
            "unit": "B/op",
            "extra": "3846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4760,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "246242 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4760,
            "unit": "ns/op",
            "extra": "246242 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "246242 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "246242 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32915,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "36246 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32915,
            "unit": "ns/op",
            "extra": "36246 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "36246 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36246 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16330,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73088 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16330,
            "unit": "ns/op",
            "extra": "73088 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73088 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73088 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 78014,
            "unit": "ns/op\t  332153 B/op\t       8 allocs/op",
            "extra": "15326 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 78014,
            "unit": "ns/op",
            "extra": "15326 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332153,
            "unit": "B/op",
            "extra": "15326 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15326 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5243,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "222573 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5243,
            "unit": "ns/op",
            "extra": "222573 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "222573 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "222573 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21703,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55074 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21703,
            "unit": "ns/op",
            "extra": "55074 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55074 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55074 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1938,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "610748 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1938,
            "unit": "ns/op",
            "extra": "610748 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "610748 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "610748 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 597.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2004854 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 597.7,
            "unit": "ns/op",
            "extra": "2004854 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2004854 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2004854 times\n4 procs"
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
            "value": 27094,
            "unit": "ns/op\t    1616 B/op\t      35 allocs/op",
            "extra": "44162 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27094,
            "unit": "ns/op",
            "extra": "44162 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1616,
            "unit": "B/op",
            "extra": "44162 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44162 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10101,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "116187 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10101,
            "unit": "ns/op",
            "extra": "116187 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "116187 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "116187 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2692,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "437402 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2692,
            "unit": "ns/op",
            "extra": "437402 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "437402 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "437402 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2075,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "574938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2075,
            "unit": "ns/op",
            "extra": "574938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "574938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "574938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1089,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1089,
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
            "value": 230015,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5035 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 230015,
            "unit": "ns/op",
            "extra": "5035 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5035 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5035 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 257.9,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4552972 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 257.9,
            "unit": "ns/op",
            "extra": "4552972 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4552972 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4552972 times\n4 procs"
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
          "id": "a532ef5cb02ed2780f8c18d7fd8b095b48bd720d",
          "message": "feat(discord): freeze RSVP buttons when event has passed\n\nThis prevents users from voting on past events and updates the message UI to remove the buttons if a late interaction occurs.",
          "timestamp": "2026-06-30T15:42:09+02:00",
          "tree_id": "fbc5d3ccdb525a4420a2f98b8750c20b866fa3cd",
          "url": "https://github.com/ramius86/btcservermanager/commit/a532ef5cb02ed2780f8c18d7fd8b095b48bd720d"
        },
        "date": 1782827056944,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 58371,
            "unit": "ns/op\t   15595 B/op\t     201 allocs/op",
            "extra": "20468 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 58371,
            "unit": "ns/op",
            "extra": "20468 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15595,
            "unit": "B/op",
            "extra": "20468 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20468 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 48962,
            "unit": "ns/op\t    8780 B/op\t     139 allocs/op",
            "extra": "24541 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 48962,
            "unit": "ns/op",
            "extra": "24541 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8780,
            "unit": "B/op",
            "extra": "24541 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "24541 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.74,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60148015 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.74,
            "unit": "ns/op",
            "extra": "60148015 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60148015 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60148015 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 298,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4082490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 298,
            "unit": "ns/op",
            "extra": "4082490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4082490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4082490 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 101581,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 101581,
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
            "value": 57733,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 57733,
            "unit": "ns/op",
            "extra": "20659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20659 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 307728,
            "unit": "ns/op\t   61344 B/op\t     718 allocs/op",
            "extra": "3810 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 307728,
            "unit": "ns/op",
            "extra": "3810 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61344,
            "unit": "B/op",
            "extra": "3810 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3810 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4805,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "248532 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4805,
            "unit": "ns/op",
            "extra": "248532 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "248532 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "248532 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 31456,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "38053 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 31456,
            "unit": "ns/op",
            "extra": "38053 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "38053 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "38053 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15031,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "79993 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15031,
            "unit": "ns/op",
            "extra": "79993 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "79993 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "79993 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 93927,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "12398 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 93927,
            "unit": "ns/op",
            "extra": "12398 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "12398 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "12398 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5194,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "226483 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5194,
            "unit": "ns/op",
            "extra": "226483 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "226483 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "226483 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21279,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "56271 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21279,
            "unit": "ns/op",
            "extra": "56271 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "56271 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "56271 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1965,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "592712 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1965,
            "unit": "ns/op",
            "extra": "592712 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "592712 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "592712 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 580.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2066138 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 580.9,
            "unit": "ns/op",
            "extra": "2066138 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2066138 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2066138 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.94,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.94,
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
            "value": 27045,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "43894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27045,
            "unit": "ns/op",
            "extra": "43894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "43894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9921,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "119398 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9921,
            "unit": "ns/op",
            "extra": "119398 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "119398 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119398 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2554,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "472256 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2554,
            "unit": "ns/op",
            "extra": "472256 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "472256 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "472256 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2035,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "571332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2035,
            "unit": "ns/op",
            "extra": "571332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "571332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "571332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 999.2,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "1202406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 999.2,
            "unit": "ns/op",
            "extra": "1202406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "1202406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1202406 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 220881,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5167 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220881,
            "unit": "ns/op",
            "extra": "5167 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5167 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5167 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 259.7,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4622966 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 259.7,
            "unit": "ns/op",
            "extra": "4622966 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4622966 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4622966 times\n4 procs"
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
          "id": "d7c1ae1f1c45e99569a912d50c6d539d3b40f84b",
          "message": "feat(discord): add player freezing/deactivation feature\n\nAllows deactivating players from stats to exclude them from 'No Response' counts while preserving historical data. Added UI management section on stats page.",
          "timestamp": "2026-06-30T16:10:40+02:00",
          "tree_id": "49d91f85eaa11217059b6537629087c846107204",
          "url": "https://github.com/ramius86/btcservermanager/commit/d7c1ae1f1c45e99569a912d50c6d539d3b40f84b"
        },
        "date": 1782828715505,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 61613,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "19298 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 61613,
            "unit": "ns/op",
            "extra": "19298 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "19298 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "19298 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 55576,
            "unit": "ns/op\t    8780 B/op\t     139 allocs/op",
            "extra": "20506 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 55576,
            "unit": "ns/op",
            "extra": "20506 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8780,
            "unit": "B/op",
            "extra": "20506 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "20506 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.75,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59677077 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.75,
            "unit": "ns/op",
            "extra": "59677077 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59677077 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59677077 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 278.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4343664 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 278.8,
            "unit": "ns/op",
            "extra": "4343664 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4343664 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4343664 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 104796,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 104796,
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
            "value": 58548,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20620 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 58548,
            "unit": "ns/op",
            "extra": "20620 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20620 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20620 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 329122,
            "unit": "ns/op\t   61290 B/op\t     718 allocs/op",
            "extra": "3727 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 329122,
            "unit": "ns/op",
            "extra": "3727 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61290,
            "unit": "B/op",
            "extra": "3727 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3727 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4786,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "238892 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4786,
            "unit": "ns/op",
            "extra": "238892 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "238892 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "238892 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32082,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "37082 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32082,
            "unit": "ns/op",
            "extra": "37082 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "37082 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "37082 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15918,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "76518 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15918,
            "unit": "ns/op",
            "extra": "76518 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "76518 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "76518 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 87832,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "13803 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 87832,
            "unit": "ns/op",
            "extra": "13803 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "13803 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "13803 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5367,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "217640 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5367,
            "unit": "ns/op",
            "extra": "217640 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "217640 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "217640 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21373,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "56227 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21373,
            "unit": "ns/op",
            "extra": "56227 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "56227 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "56227 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1945,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "587094 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1945,
            "unit": "ns/op",
            "extra": "587094 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "587094 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "587094 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 575.8,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2089576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 575.8,
            "unit": "ns/op",
            "extra": "2089576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2089576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2089576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.99,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.99,
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
            "value": 27085,
            "unit": "ns/op\t    1617 B/op\t      35 allocs/op",
            "extra": "44602 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27085,
            "unit": "ns/op",
            "extra": "44602 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1617,
            "unit": "B/op",
            "extra": "44602 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44602 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9946,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "119751 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9946,
            "unit": "ns/op",
            "extra": "119751 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "119751 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119751 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2530,
            "unit": "ns/op\t     285 B/op\t       7 allocs/op",
            "extra": "484148 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2530,
            "unit": "ns/op",
            "extra": "484148 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 285,
            "unit": "B/op",
            "extra": "484148 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "484148 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2038,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "562465 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2038,
            "unit": "ns/op",
            "extra": "562465 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "562465 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "562465 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1010,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1010,
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
            "value": 222271,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5133 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 222271,
            "unit": "ns/op",
            "extra": "5133 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5133 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5133 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 263,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4551136 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 263,
            "unit": "ns/op",
            "extra": "4551136 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4551136 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4551136 times\n4 procs"
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
          "id": "d64aa9b790305c24054b2b61413f7cf8504ee546",
          "message": "style(discord): format discord_routes.go with gofmt",
          "timestamp": "2026-06-30T17:09:39+02:00",
          "tree_id": "640be0e33ee6436c331100677ae53e7e6a46819d",
          "url": "https://github.com/ramius86/btcservermanager/commit/d64aa9b790305c24054b2b61413f7cf8504ee546"
        },
        "date": 1782832260177,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 55663,
            "unit": "ns/op\t   15595 B/op\t     201 allocs/op",
            "extra": "21523 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 55663,
            "unit": "ns/op",
            "extra": "21523 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15595,
            "unit": "B/op",
            "extra": "21523 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21523 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 45764,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "26151 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 45764,
            "unit": "ns/op",
            "extra": "26151 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "26151 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "26151 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.69,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60131510 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.69,
            "unit": "ns/op",
            "extra": "60131510 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60131510 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60131510 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 264.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4533673 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 264.7,
            "unit": "ns/op",
            "extra": "4533673 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4533673 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4533673 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 108938,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 108938,
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
            "value": 60802,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19700 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60802,
            "unit": "ns/op",
            "extra": "19700 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19700 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19700 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308544,
            "unit": "ns/op\t   61256 B/op\t     718 allocs/op",
            "extra": "3794 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308544,
            "unit": "ns/op",
            "extra": "3794 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61256,
            "unit": "B/op",
            "extra": "3794 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3794 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4739,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "244863 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4739,
            "unit": "ns/op",
            "extra": "244863 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "244863 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "244863 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32943,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36222 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32943,
            "unit": "ns/op",
            "extra": "36222 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36222 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36222 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16952,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "75921 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16952,
            "unit": "ns/op",
            "extra": "75921 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "75921 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "75921 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 80538,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15370 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 80538,
            "unit": "ns/op",
            "extra": "15370 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15370 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15370 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5591,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "212474 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5591,
            "unit": "ns/op",
            "extra": "212474 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "212474 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "212474 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21825,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21825,
            "unit": "ns/op",
            "extra": "54102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54102 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1982,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "604236 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1982,
            "unit": "ns/op",
            "extra": "604236 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "604236 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "604236 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 599.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2000864 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 599.7,
            "unit": "ns/op",
            "extra": "2000864 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2000864 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2000864 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.62,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.62,
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
            "value": 26969,
            "unit": "ns/op\t    1615 B/op\t      35 allocs/op",
            "extra": "44335 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26969,
            "unit": "ns/op",
            "extra": "44335 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1615,
            "unit": "B/op",
            "extra": "44335 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44335 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10168,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "117018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10168,
            "unit": "ns/op",
            "extra": "117018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "117018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2673,
            "unit": "ns/op\t     290 B/op\t       7 allocs/op",
            "extra": "435118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2673,
            "unit": "ns/op",
            "extra": "435118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 290,
            "unit": "B/op",
            "extra": "435118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "435118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2021,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "581587 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2021,
            "unit": "ns/op",
            "extra": "581587 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "581587 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "581587 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1079,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1079,
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
            "value": 230720,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 230720,
            "unit": "ns/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5088 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 259.8,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4513462 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 259.8,
            "unit": "ns/op",
            "extra": "4513462 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4513462 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4513462 times\n4 procs"
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
          "id": "b29b02bc7f6456704f56d420e87859af8e5cf9d6",
          "message": "feat(reforger): add custom names management UI and API for BTC_custom_names mod",
          "timestamp": "2026-07-02T18:16:25+02:00",
          "tree_id": "86ee4591ccc28694103384e5844543f441abbafb",
          "url": "https://github.com/ramius86/btcservermanager/commit/b29b02bc7f6456704f56d420e87859af8e5cf9d6"
        },
        "date": 1783009103979,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 55497,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "21350 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 55497,
            "unit": "ns/op",
            "extra": "21350 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "21350 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21350 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46313,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25800 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46313,
            "unit": "ns/op",
            "extra": "25800 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25800 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25800 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 15.87,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "70048948 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 15.87,
            "unit": "ns/op",
            "extra": "70048948 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "70048948 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "70048948 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 230.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5224094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 230.2,
            "unit": "ns/op",
            "extra": "5224094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5224094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5224094 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 102242,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 102242,
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
            "value": 60675,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19828 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60675,
            "unit": "ns/op",
            "extra": "19828 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19828 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19828 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 297608,
            "unit": "ns/op\t   61338 B/op\t     718 allocs/op",
            "extra": "3907 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 297608,
            "unit": "ns/op",
            "extra": "3907 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61338,
            "unit": "B/op",
            "extra": "3907 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3907 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4475,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "259968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4475,
            "unit": "ns/op",
            "extra": "259968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "259968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "259968 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32688,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36836 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32688,
            "unit": "ns/op",
            "extra": "36836 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36836 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36836 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15941,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74752 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15941,
            "unit": "ns/op",
            "extra": "74752 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74752 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74752 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 82953,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14673 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 82953,
            "unit": "ns/op",
            "extra": "14673 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14673 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14673 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5209,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "230899 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5209,
            "unit": "ns/op",
            "extra": "230899 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "230899 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "230899 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 20227,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "61311 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 20227,
            "unit": "ns/op",
            "extra": "61311 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "61311 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "61311 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1918,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "586304 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1918,
            "unit": "ns/op",
            "extra": "586304 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "586304 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "586304 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 608.4,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1970654 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 608.4,
            "unit": "ns/op",
            "extra": "1970654 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1970654 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1970654 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.38,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.38,
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
            "value": 25352,
            "unit": "ns/op\t    1613 B/op\t      35 allocs/op",
            "extra": "47284 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 25352,
            "unit": "ns/op",
            "extra": "47284 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1613,
            "unit": "B/op",
            "extra": "47284 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "47284 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9584,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "124280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9584,
            "unit": "ns/op",
            "extra": "124280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "124280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "124280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2511,
            "unit": "ns/op\t     285 B/op\t       7 allocs/op",
            "extra": "481192 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2511,
            "unit": "ns/op",
            "extra": "481192 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 285,
            "unit": "B/op",
            "extra": "481192 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "481192 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1951,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "572271 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1951,
            "unit": "ns/op",
            "extra": "572271 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "572271 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "572271 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1109,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1109,
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
            "value": 215321,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5325 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 215321,
            "unit": "ns/op",
            "extra": "5325 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5325 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5325 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 276.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4377022 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 276.4,
            "unit": "ns/op",
            "extra": "4377022 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4377022 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4377022 times\n4 procs"
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
          "id": "3c12ced5c7d28c9605a24c74b7fe30ebd916ec86",
          "message": "fix(discord): add AllowedMentions to event messages so role pings actually notify users",
          "timestamp": "2026-07-02T19:48:20+02:00",
          "tree_id": "85d62014828961ef579029cd316dadbabb80171c",
          "url": "https://github.com/ramius86/btcservermanager/commit/3c12ced5c7d28c9605a24c74b7fe30ebd916ec86"
        },
        "date": 1783014590003,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 59269,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20106 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 59269,
            "unit": "ns/op",
            "extra": "20106 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20106 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20106 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 50552,
            "unit": "ns/op\t    8780 B/op\t     139 allocs/op",
            "extra": "24229 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 50552,
            "unit": "ns/op",
            "extra": "24229 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8780,
            "unit": "B/op",
            "extra": "24229 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "24229 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.94,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "58927744 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.94,
            "unit": "ns/op",
            "extra": "58927744 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "58927744 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "58927744 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 289,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4179748 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 289,
            "unit": "ns/op",
            "extra": "4179748 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4179748 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4179748 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 101919,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 101919,
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
            "value": 58034,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20510 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 58034,
            "unit": "ns/op",
            "extra": "20510 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20510 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20510 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 312044,
            "unit": "ns/op\t   61257 B/op\t     718 allocs/op",
            "extra": "3753 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 312044,
            "unit": "ns/op",
            "extra": "3753 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61257,
            "unit": "B/op",
            "extra": "3753 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3753 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4803,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "241118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4803,
            "unit": "ns/op",
            "extra": "241118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "241118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "241118 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33230,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "37239 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33230,
            "unit": "ns/op",
            "extra": "37239 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "37239 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "37239 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15901,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "63375 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15901,
            "unit": "ns/op",
            "extra": "63375 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "63375 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "63375 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 84689,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "13896 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 84689,
            "unit": "ns/op",
            "extra": "13896 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "13896 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "13896 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 4967,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "236154 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 4967,
            "unit": "ns/op",
            "extra": "236154 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "236154 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "236154 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 20922,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "57108 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 20922,
            "unit": "ns/op",
            "extra": "57108 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "57108 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "57108 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1845,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "661196 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1845,
            "unit": "ns/op",
            "extra": "661196 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "661196 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "661196 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 570.4,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2099910 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 570.4,
            "unit": "ns/op",
            "extra": "2099910 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2099910 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2099910 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.93,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.93,
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
            "value": 27275,
            "unit": "ns/op\t    1617 B/op\t      35 allocs/op",
            "extra": "44354 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27275,
            "unit": "ns/op",
            "extra": "44354 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1617,
            "unit": "B/op",
            "extra": "44354 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44354 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10018,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "119427 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10018,
            "unit": "ns/op",
            "extra": "119427 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "119427 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119427 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2511,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "475479 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2511,
            "unit": "ns/op",
            "extra": "475479 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "475479 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "475479 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2039,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "559855 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2039,
            "unit": "ns/op",
            "extra": "559855 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "559855 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "559855 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1028,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1028,
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
            "value": 221399,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5293 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 221399,
            "unit": "ns/op",
            "extra": "5293 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5293 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5293 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 260.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4591844 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 260.1,
            "unit": "ns/op",
            "extra": "4591844 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4591844 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4591844 times\n4 procs"
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
          "id": "390c77c66d576ef28c364a4bc5a8a1e70dab6c63",
          "message": "fix(discord): preserve message content (mentions) when updating event embed",
          "timestamp": "2026-07-02T19:54:43+02:00",
          "tree_id": "868d4d54a2bb87abdecb1649a9fc789a77744fc6",
          "url": "https://github.com/ramius86/btcservermanager/commit/390c77c66d576ef28c364a4bc5a8a1e70dab6c63"
        },
        "date": 1783014963688,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 57812,
            "unit": "ns/op\t   15595 B/op\t     201 allocs/op",
            "extra": "20682 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 57812,
            "unit": "ns/op",
            "extra": "20682 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15595,
            "unit": "B/op",
            "extra": "20682 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20682 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46325,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25867 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46325,
            "unit": "ns/op",
            "extra": "25867 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25867 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25867 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.66,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59183883 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.66,
            "unit": "ns/op",
            "extra": "59183883 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59183883 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59183883 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 248.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4807405 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 248.9,
            "unit": "ns/op",
            "extra": "4807405 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4807405 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4807405 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112385,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112385,
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
            "value": 64918,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19146 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 64918,
            "unit": "ns/op",
            "extra": "19146 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19146 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19146 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 314745,
            "unit": "ns/op\t   61310 B/op\t     718 allocs/op",
            "extra": "3734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 314745,
            "unit": "ns/op",
            "extra": "3734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61310,
            "unit": "B/op",
            "extra": "3734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4809,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "247635 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4809,
            "unit": "ns/op",
            "extra": "247635 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "247635 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "247635 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34295,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "35002 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34295,
            "unit": "ns/op",
            "extra": "35002 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "35002 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35002 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16531,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "72631 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16531,
            "unit": "ns/op",
            "extra": "72631 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "72631 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "72631 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 78085,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15254 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 78085,
            "unit": "ns/op",
            "extra": "15254 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15254 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15254 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5362,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "216916 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5362,
            "unit": "ns/op",
            "extra": "216916 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "216916 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "216916 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21968,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54408 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21968,
            "unit": "ns/op",
            "extra": "54408 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54408 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54408 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2112,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "624079 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2112,
            "unit": "ns/op",
            "extra": "624079 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "624079 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "624079 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 601.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1992340 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 601.9,
            "unit": "ns/op",
            "extra": "1992340 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1992340 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1992340 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.62,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.62,
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
            "value": 27563,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "43276 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27563,
            "unit": "ns/op",
            "extra": "43276 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "43276 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43276 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10100,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "116748 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10100,
            "unit": "ns/op",
            "extra": "116748 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "116748 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "116748 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2746,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "394920 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2746,
            "unit": "ns/op",
            "extra": "394920 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "394920 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "394920 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2068,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "579890 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2068,
            "unit": "ns/op",
            "extra": "579890 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "579890 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "579890 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1138,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1138,
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
            "value": 240173,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5042 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 240173,
            "unit": "ns/op",
            "extra": "5042 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5042 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5042 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 261.9,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4604068 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 261.9,
            "unit": "ns/op",
            "extra": "4604068 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4604068 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4604068 times\n4 procs"
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
          "id": "e54f4ce0f3608da0bd0c5629192eadfa571fb676",
          "message": "feat(discord): add manual RSVP management from web dashboard\n\n- Implemented GET /members route to fetch server members live from Discord API\n- Implemented PUT /events/{id}/participants route to manually update RSVPs via DB\n- Added ManageRSVPModal with real-time text search and optimistic UI updates\n- Integrated ManageRSVPModal into EventsPage\n- Updated Discord bot to auto-refresh the event embed after manual RSVP changes",
          "timestamp": "2026-07-05T12:25:34+02:00",
          "tree_id": "2138fc49f78de053c093164d7864c2731337ef42",
          "url": "https://github.com/ramius86/btcservermanager/commit/e54f4ce0f3608da0bd0c5629192eadfa571fb676"
        },
        "date": 1783247230509,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 57033,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20829 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 57033,
            "unit": "ns/op",
            "extra": "20829 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20829 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20829 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46436,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25676 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46436,
            "unit": "ns/op",
            "extra": "25676 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25676 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25676 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 20.05,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59486331 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 20.05,
            "unit": "ns/op",
            "extra": "59486331 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59486331 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59486331 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 290.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4152094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 290.2,
            "unit": "ns/op",
            "extra": "4152094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4152094 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4152094 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 109316,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 109316,
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
            "value": 60934,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60934,
            "unit": "ns/op",
            "extra": "19659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19659 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19659 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 312808,
            "unit": "ns/op\t   61219 B/op\t     718 allocs/op",
            "extra": "3746 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 312808,
            "unit": "ns/op",
            "extra": "3746 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61219,
            "unit": "B/op",
            "extra": "3746 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3746 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4801,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "243711 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4801,
            "unit": "ns/op",
            "extra": "243711 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "243711 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "243711 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33190,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35490 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33190,
            "unit": "ns/op",
            "extra": "35490 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35490 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35490 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15900,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "75451 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15900,
            "unit": "ns/op",
            "extra": "75451 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "75451 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "75451 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 77059,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15703 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 77059,
            "unit": "ns/op",
            "extra": "15703 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15703 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15703 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5244,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "217759 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5244,
            "unit": "ns/op",
            "extra": "217759 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "217759 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "217759 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22761,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "52540 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22761,
            "unit": "ns/op",
            "extra": "52540 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "52540 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "52540 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2068,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "624709 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2068,
            "unit": "ns/op",
            "extra": "624709 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "624709 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "624709 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 609.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1955336 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 609.7,
            "unit": "ns/op",
            "extra": "1955336 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1955336 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1955336 times\n4 procs"
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
            "value": 27096,
            "unit": "ns/op\t    1617 B/op\t      35 allocs/op",
            "extra": "44112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27096,
            "unit": "ns/op",
            "extra": "44112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1617,
            "unit": "B/op",
            "extra": "44112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10083,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117571 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10083,
            "unit": "ns/op",
            "extra": "117571 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117571 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117571 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2685,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "443734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2685,
            "unit": "ns/op",
            "extra": "443734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "443734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "443734 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2046,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "574636 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2046,
            "unit": "ns/op",
            "extra": "574636 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "574636 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "574636 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1100,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1100,
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
            "value": 229172,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5086 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 229172,
            "unit": "ns/op",
            "extra": "5086 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5086 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5086 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 272,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4218286 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 272,
            "unit": "ns/op",
            "extra": "4218286 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4218286 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4218286 times\n4 procs"
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
          "id": "f2bac016ba815733af29f514aadd515b29e13d44",
          "message": "feat(discord): add user management to attendance stats\n\n- Added DELETE /users/{id} route to permanently delete a user and their stats history\n- Added UI in EventsStatsPage to deactivate (freeze) or completely delete users\n- Translated EventsStatsPage management UI to English\n- Fixed golangci-lint warnings on transaction rollbacks",
          "timestamp": "2026-07-05T12:41:04+02:00",
          "tree_id": "415bab243f6b279868198df37e16ede43c0e866c",
          "url": "https://github.com/ramius86/btcservermanager/commit/f2bac016ba815733af29f514aadd515b29e13d44"
        },
        "date": 1783248147697,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 56487,
            "unit": "ns/op\t   15595 B/op\t     201 allocs/op",
            "extra": "21163 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 56487,
            "unit": "ns/op",
            "extra": "21163 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15595,
            "unit": "B/op",
            "extra": "21163 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21163 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 48907,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25176 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 48907,
            "unit": "ns/op",
            "extra": "25176 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25176 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25176 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.66,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60122517 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.66,
            "unit": "ns/op",
            "extra": "60122517 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60122517 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60122517 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 290.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4152330 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 290.6,
            "unit": "ns/op",
            "extra": "4152330 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4152330 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4152330 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 110343,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 110343,
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
            "value": 61403,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19531 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61403,
            "unit": "ns/op",
            "extra": "19531 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19531 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19531 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308613,
            "unit": "ns/op\t   61308 B/op\t     718 allocs/op",
            "extra": "3760 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308613,
            "unit": "ns/op",
            "extra": "3760 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61308,
            "unit": "B/op",
            "extra": "3760 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3760 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4767,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "231409 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4767,
            "unit": "ns/op",
            "extra": "231409 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "231409 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "231409 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33878,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35298 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33878,
            "unit": "ns/op",
            "extra": "35298 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35298 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35298 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16061,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "73664 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16061,
            "unit": "ns/op",
            "extra": "73664 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "73664 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73664 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 80784,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15136 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 80784,
            "unit": "ns/op",
            "extra": "15136 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15136 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15136 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5240,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "222480 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5240,
            "unit": "ns/op",
            "extra": "222480 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "222480 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "222480 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21563,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55933 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21563,
            "unit": "ns/op",
            "extra": "55933 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55933 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55933 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1934,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "610412 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1934,
            "unit": "ns/op",
            "extra": "610412 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "610412 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "610412 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 595.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2013758 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 595.7,
            "unit": "ns/op",
            "extra": "2013758 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2013758 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2013758 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.64,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.64,
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
            "value": 27255,
            "unit": "ns/op\t    1594 B/op\t      35 allocs/op",
            "extra": "44031 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27255,
            "unit": "ns/op",
            "extra": "44031 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1594,
            "unit": "B/op",
            "extra": "44031 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44031 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10090,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117925 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10090,
            "unit": "ns/op",
            "extra": "117925 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117925 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117925 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2659,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "448327 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2659,
            "unit": "ns/op",
            "extra": "448327 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "448327 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "448327 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2030,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "556964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2030,
            "unit": "ns/op",
            "extra": "556964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "556964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "556964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1081,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1081,
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
            "value": 229494,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5126 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 229494,
            "unit": "ns/op",
            "extra": "5126 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5126 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5126 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 256.6,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4663507 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 256.6,
            "unit": "ns/op",
            "extra": "4663507 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4663507 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4663507 times\n4 procs"
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
          "id": "cac90d2b419cbec53a7e77eb9d26ec348215a18b",
          "message": "fix(discord): use GlobalName for user display name if server nickname is missing",
          "timestamp": "2026-07-06T18:47:38+02:00",
          "tree_id": "98c7e9a47156796f6988961447b8b02587bdb7d6",
          "url": "https://github.com/ramius86/btcservermanager/commit/cac90d2b419cbec53a7e77eb9d26ec348215a18b"
        },
        "date": 1783356558585,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 57588,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20974 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 57588,
            "unit": "ns/op",
            "extra": "20974 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20974 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20974 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46566,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "25372 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46566,
            "unit": "ns/op",
            "extra": "25372 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "25372 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25372 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.64,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60377124 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.64,
            "unit": "ns/op",
            "extra": "60377124 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60377124 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60377124 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 275.1,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4353212 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 275.1,
            "unit": "ns/op",
            "extra": "4353212 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4353212 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4353212 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 110569,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 110569,
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
            "value": 65963,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18891 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 65963,
            "unit": "ns/op",
            "extra": "18891 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18891 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18891 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 310686,
            "unit": "ns/op\t   61373 B/op\t     718 allocs/op",
            "extra": "3813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 310686,
            "unit": "ns/op",
            "extra": "3813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61373,
            "unit": "B/op",
            "extra": "3813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4999,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "232911 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4999,
            "unit": "ns/op",
            "extra": "232911 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "232911 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "232911 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33510,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35750 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33510,
            "unit": "ns/op",
            "extra": "35750 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35750 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35750 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15978,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "75248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15978,
            "unit": "ns/op",
            "extra": "75248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "75248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "75248 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 82234,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14584 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 82234,
            "unit": "ns/op",
            "extra": "14584 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14584 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14584 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5284,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "218244 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5284,
            "unit": "ns/op",
            "extra": "218244 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "218244 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "218244 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21734,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54990 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21734,
            "unit": "ns/op",
            "extra": "54990 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54990 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54990 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2115,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "607948 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2115,
            "unit": "ns/op",
            "extra": "607948 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "607948 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "607948 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 597.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2006066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 597.6,
            "unit": "ns/op",
            "extra": "2006066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2006066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2006066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.62,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.62,
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
            "value": 27239,
            "unit": "ns/op\t    1600 B/op\t      35 allocs/op",
            "extra": "43898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27239,
            "unit": "ns/op",
            "extra": "43898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1600,
            "unit": "B/op",
            "extra": "43898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10059,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117706 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10059,
            "unit": "ns/op",
            "extra": "117706 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117706 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117706 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2682,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "452215 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2682,
            "unit": "ns/op",
            "extra": "452215 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "452215 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "452215 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2051,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "602661 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2051,
            "unit": "ns/op",
            "extra": "602661 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "602661 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "602661 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1103,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1103,
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
            "value": 229012,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5110 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 229012,
            "unit": "ns/op",
            "extra": "5110 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5110 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5110 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 259.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4594668 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 259.1,
            "unit": "ns/op",
            "extra": "4594668 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4594668 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4594668 times\n4 procs"
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
          "id": "4f729a2e3141776598972a8586fc0f5598130e23",
          "message": "chore: update frontend and backend dependencies",
          "timestamp": "2026-07-10T22:46:01+02:00",
          "tree_id": "b9c131196e31d3b73d62dd8c5cebf18dbbf03093",
          "url": "https://github.com/ramius86/btcservermanager/commit/4f729a2e3141776598972a8586fc0f5598130e23"
        },
        "date": 1783716466910,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 56273,
            "unit": "ns/op\t   15595 B/op\t     201 allocs/op",
            "extra": "21218 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 56273,
            "unit": "ns/op",
            "extra": "21218 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15595,
            "unit": "B/op",
            "extra": "21218 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "21218 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 45911,
            "unit": "ns/op\t    8781 B/op\t     139 allocs/op",
            "extra": "26145 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 45911,
            "unit": "ns/op",
            "extra": "26145 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8781,
            "unit": "B/op",
            "extra": "26145 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "26145 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59720359 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.7,
            "unit": "ns/op",
            "extra": "59720359 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59720359 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59720359 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 277.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4341385 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 277.8,
            "unit": "ns/op",
            "extra": "4341385 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4341385 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4341385 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 109142,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 109142,
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
            "value": 60934,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19633 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60934,
            "unit": "ns/op",
            "extra": "19633 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19633 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19633 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 310658,
            "unit": "ns/op\t   61294 B/op\t     718 allocs/op",
            "extra": "3656 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 310658,
            "unit": "ns/op",
            "extra": "3656 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61294,
            "unit": "B/op",
            "extra": "3656 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3656 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4972,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "248894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4972,
            "unit": "ns/op",
            "extra": "248894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "248894 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "248894 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33391,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "36295 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33391,
            "unit": "ns/op",
            "extra": "36295 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "36295 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36295 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 17479,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74973 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 17479,
            "unit": "ns/op",
            "extra": "74973 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74973 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74973 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 76461,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15722 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 76461,
            "unit": "ns/op",
            "extra": "15722 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15722 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15722 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5184,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "225756 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5184,
            "unit": "ns/op",
            "extra": "225756 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "225756 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "225756 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21686,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55197 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21686,
            "unit": "ns/op",
            "extra": "55197 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55197 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55197 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1897,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "637984 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1897,
            "unit": "ns/op",
            "extra": "637984 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "637984 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "637984 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 596.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2007909 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 596.6,
            "unit": "ns/op",
            "extra": "2007909 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2007909 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2007909 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.62,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.62,
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
            "value": 26985,
            "unit": "ns/op\t    1616 B/op\t      35 allocs/op",
            "extra": "44415 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26985,
            "unit": "ns/op",
            "extra": "44415 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1616,
            "unit": "B/op",
            "extra": "44415 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44415 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10218,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "115291 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10218,
            "unit": "ns/op",
            "extra": "115291 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "115291 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "115291 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2682,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "468883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2682,
            "unit": "ns/op",
            "extra": "468883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "468883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "468883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2052,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "579042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2052,
            "unit": "ns/op",
            "extra": "579042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "579042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "579042 times\n4 procs"
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
            "value": 229734,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5113 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 229734,
            "unit": "ns/op",
            "extra": "5113 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5113 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5113 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 256.3,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4662118 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 256.3,
            "unit": "ns/op",
            "extra": "4662118 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4662118 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4662118 times\n4 procs"
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
          "id": "3b3cae9ee53a82410f67eed04c2e1d4a3ac88ecd",
          "message": "Merge branch 'main' of https://github.com/ramius86/btcservermanager",
          "timestamp": "2026-07-10T23:03:49+02:00",
          "tree_id": "91d641627dc397e205c96705f629d31bcdd0c01b",
          "url": "https://github.com/ramius86/btcservermanager/commit/3b3cae9ee53a82410f67eed04c2e1d4a3ac88ecd"
        },
        "date": 1783717527958,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 57953,
            "unit": "ns/op\t   15596 B/op\t     201 allocs/op",
            "extra": "20660 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 57953,
            "unit": "ns/op",
            "extra": "20660 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 15596,
            "unit": "B/op",
            "extra": "20660 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 201,
            "unit": "allocs/op",
            "extra": "20660 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 46654,
            "unit": "ns/op\t    8780 B/op\t     139 allocs/op",
            "extra": "25795 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 46654,
            "unit": "ns/op",
            "extra": "25795 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 8780,
            "unit": "B/op",
            "extra": "25795 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 139,
            "unit": "allocs/op",
            "extra": "25795 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 18.74,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "63432979 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 18.74,
            "unit": "ns/op",
            "extra": "63432979 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "63432979 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "63432979 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 249.5,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4875632 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 249.5,
            "unit": "ns/op",
            "extra": "4875632 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4875632 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4875632 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 110973,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9807 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 110973,
            "unit": "ns/op",
            "extra": "9807 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9807 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9807 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 61646,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19459 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61646,
            "unit": "ns/op",
            "extra": "19459 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19459 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19459 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316828,
            "unit": "ns/op\t   61290 B/op\t     718 allocs/op",
            "extra": "3726 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316828,
            "unit": "ns/op",
            "extra": "3726 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61290,
            "unit": "B/op",
            "extra": "3726 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3726 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4899,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "244394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4899,
            "unit": "ns/op",
            "extra": "244394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "244394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "244394 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33927,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35236 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33927,
            "unit": "ns/op",
            "extra": "35236 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35236 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35236 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16141,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16141,
            "unit": "ns/op",
            "extra": "74025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74025 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 79247,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15568 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 79247,
            "unit": "ns/op",
            "extra": "15568 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15568 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15568 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5405,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "222330 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5405,
            "unit": "ns/op",
            "extra": "222330 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "222330 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "222330 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21987,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "53126 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21987,
            "unit": "ns/op",
            "extra": "53126 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "53126 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "53126 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1983,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "611668 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1983,
            "unit": "ns/op",
            "extra": "611668 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "611668 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "611668 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 610.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1972466 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 610.7,
            "unit": "ns/op",
            "extra": "1972466 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1972466 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1972466 times\n4 procs"
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
            "value": 27114,
            "unit": "ns/op\t    1616 B/op\t      35 allocs/op",
            "extra": "44319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27114,
            "unit": "ns/op",
            "extra": "44319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1616,
            "unit": "B/op",
            "extra": "44319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10073,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "117246 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10073,
            "unit": "ns/op",
            "extra": "117246 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "117246 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117246 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2695,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "443728 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2695,
            "unit": "ns/op",
            "extra": "443728 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "443728 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "443728 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2022,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "590110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2022,
            "unit": "ns/op",
            "extra": "590110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "590110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "590110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1075,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1075,
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
            "value": 220081,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5259 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220081,
            "unit": "ns/op",
            "extra": "5259 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5259 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5259 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 289.6,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4385388 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 289.6,
            "unit": "ns/op",
            "extra": "4385388 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4385388 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4385388 times\n4 procs"
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
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d2c891e741a378cf07275cf16fcc6f043753a492",
          "message": "Merge pull request #13 from ramius86/refactor/migrate-jwt\n\nrefactor: migrate jwx to golang-jwt/jwt and keyfunc",
          "timestamp": "2026-07-10T23:38:08+02:00",
          "tree_id": "428beb14923883f87e7e72221b30b0918491b19d",
          "url": "https://github.com/ramius86/btcservermanager/commit/d2c891e741a378cf07275cf16fcc6f043753a492"
        },
        "date": 1783719575289,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40818,
            "unit": "ns/op\t    4266 B/op\t      66 allocs/op",
            "extra": "29244 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40818,
            "unit": "ns/op",
            "extra": "29244 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4266,
            "unit": "B/op",
            "extra": "29244 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29244 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38379,
            "unit": "ns/op\t    3576 B/op\t      49 allocs/op",
            "extra": "31384 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38379,
            "unit": "ns/op",
            "extra": "31384 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3576,
            "unit": "B/op",
            "extra": "31384 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31384 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 18.86,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "63160490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 18.86,
            "unit": "ns/op",
            "extra": "63160490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "63160490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "63160490 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 257.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4670058 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 257.9,
            "unit": "ns/op",
            "extra": "4670058 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4670058 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4670058 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 113812,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 113812,
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
            "value": 62593,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19166 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62593,
            "unit": "ns/op",
            "extra": "19166 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19166 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19166 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 321776,
            "unit": "ns/op\t   61266 B/op\t     718 allocs/op",
            "extra": "3607 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 321776,
            "unit": "ns/op",
            "extra": "3607 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61266,
            "unit": "B/op",
            "extra": "3607 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3607 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4918,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "241632 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4918,
            "unit": "ns/op",
            "extra": "241632 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "241632 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "241632 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34365,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "34544 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34365,
            "unit": "ns/op",
            "extra": "34544 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "34544 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34544 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 17426,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73572 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 17426,
            "unit": "ns/op",
            "extra": "73572 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73572 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73572 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 79019,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15220 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 79019,
            "unit": "ns/op",
            "extra": "15220 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15220 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15220 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5348,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "223633 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5348,
            "unit": "ns/op",
            "extra": "223633 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "223633 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "223633 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22216,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "52987 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22216,
            "unit": "ns/op",
            "extra": "52987 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "52987 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "52987 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1960,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "581229 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1960,
            "unit": "ns/op",
            "extra": "581229 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "581229 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "581229 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 599.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1998490 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 599.7,
            "unit": "ns/op",
            "extra": "1998490 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1998490 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1998490 times\n4 procs"
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
            "value": 26910,
            "unit": "ns/op\t    1619 B/op\t      35 allocs/op",
            "extra": "44672 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26910,
            "unit": "ns/op",
            "extra": "44672 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1619,
            "unit": "B/op",
            "extra": "44672 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44672 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10085,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "119389 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10085,
            "unit": "ns/op",
            "extra": "119389 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "119389 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119389 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2688,
            "unit": "ns/op\t     290 B/op\t       7 allocs/op",
            "extra": "432464 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2688,
            "unit": "ns/op",
            "extra": "432464 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 290,
            "unit": "B/op",
            "extra": "432464 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "432464 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2034,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "550818 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2034,
            "unit": "ns/op",
            "extra": "550818 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "550818 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "550818 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1085,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1085,
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
            "value": 220429,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5289 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220429,
            "unit": "ns/op",
            "extra": "5289 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5289 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5289 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 273.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4396141 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 273.4,
            "unit": "ns/op",
            "extra": "4396141 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4396141 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4396141 times\n4 procs"
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
          "id": "64f419c1ed4eb9198aa36d3dc501746a6e5bc33e",
          "message": "feat: add Discord event reminders and update dependencies",
          "timestamp": "2026-07-11T14:17:17+02:00",
          "tree_id": "23a0237e1921d959882e773f173d9066b19cdad2",
          "url": "https://github.com/ramius86/btcservermanager/commit/64f419c1ed4eb9198aa36d3dc501746a6e5bc33e"
        },
        "date": 1783772353451,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40302,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "29684 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40302,
            "unit": "ns/op",
            "extra": "29684 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "29684 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29684 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 37997,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31550 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 37997,
            "unit": "ns/op",
            "extra": "31550 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31550 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31550 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 18.97,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "63595834 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 18.97,
            "unit": "ns/op",
            "extra": "63595834 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "63595834 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "63595834 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 263.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4554854 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 263.9,
            "unit": "ns/op",
            "extra": "4554854 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4554854 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4554854 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 109118,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 109118,
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
            "value": 61103,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19717 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61103,
            "unit": "ns/op",
            "extra": "19717 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19717 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19717 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308770,
            "unit": "ns/op\t   61325 B/op\t     718 allocs/op",
            "extra": "3808 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308770,
            "unit": "ns/op",
            "extra": "3808 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61325,
            "unit": "B/op",
            "extra": "3808 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3808 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4788,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "248160 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4788,
            "unit": "ns/op",
            "extra": "248160 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "248160 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "248160 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33460,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35140 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33460,
            "unit": "ns/op",
            "extra": "35140 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35140 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35140 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15927,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "74707 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15927,
            "unit": "ns/op",
            "extra": "74707 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "74707 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74707 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 75786,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15888 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 75786,
            "unit": "ns/op",
            "extra": "15888 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15888 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15888 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5294,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "228007 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5294,
            "unit": "ns/op",
            "extra": "228007 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "228007 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "228007 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21947,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54620 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21947,
            "unit": "ns/op",
            "extra": "54620 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54620 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54620 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1982,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "610288 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1982,
            "unit": "ns/op",
            "extra": "610288 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "610288 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "610288 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 607,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1936300 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 607,
            "unit": "ns/op",
            "extra": "1936300 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1936300 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1936300 times\n4 procs"
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
            "value": 26606,
            "unit": "ns/op\t    1614 B/op\t      35 allocs/op",
            "extra": "44852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26606,
            "unit": "ns/op",
            "extra": "44852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1614,
            "unit": "B/op",
            "extra": "44852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44852 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9872,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "119581 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9872,
            "unit": "ns/op",
            "extra": "119581 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "119581 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119581 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2669,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "445432 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2669,
            "unit": "ns/op",
            "extra": "445432 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "445432 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "445432 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2015,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "604078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2015,
            "unit": "ns/op",
            "extra": "604078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "604078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "604078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1090,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1090,
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
            "value": 220107,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5269 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220107,
            "unit": "ns/op",
            "extra": "5269 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5269 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5269 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 280.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4362603 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 280.1,
            "unit": "ns/op",
            "extra": "4362603 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4362603 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4362603 times\n4 procs"
          }
        ]
      }
    ]
  }
}