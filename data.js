window.BENCHMARK_DATA = {
  "lastUpdate": 1782070904039,
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
      }
    ]
  }
}