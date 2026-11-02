window.BENCHMARK_DATA = {
  "lastUpdate": 1793649154805,
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
          "id": "dfce2d564c5da2acd38ff6b0367b18ab3ee8e5a2",
          "message": "feat(server): include game type in process exit and stop logs",
          "timestamp": "2026-09-17T18:07:18+02:00",
          "tree_id": "bc2544278ebf297d41b0576a31379bee39671b00",
          "url": "https://github.com/ramius86/btcservermanager/commit/dfce2d564c5da2acd38ff6b0367b18ab3ee8e5a2"
        },
        "date": 1789661357508,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 34619,
            "unit": "ns/op\t    4281 B/op\t      66 allocs/op",
            "extra": "34382 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 34619,
            "unit": "ns/op",
            "extra": "34382 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4281,
            "unit": "B/op",
            "extra": "34382 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "34382 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 32509,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "36783 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 32509,
            "unit": "ns/op",
            "extra": "36783 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "36783 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "36783 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 13.95,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "84991752 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 13.95,
            "unit": "ns/op",
            "extra": "84991752 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "84991752 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "84991752 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 214.3,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5623052 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 214.3,
            "unit": "ns/op",
            "extra": "5623052 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5623052 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5623052 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 81939,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "14587 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 81939,
            "unit": "ns/op",
            "extra": "14587 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "14587 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "14587 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 48119,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "26773 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 48119,
            "unit": "ns/op",
            "extra": "26773 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "26773 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "26773 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 244895,
            "unit": "ns/op\t   61295 B/op\t     718 allocs/op",
            "extra": "4899 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 244895,
            "unit": "ns/op",
            "extra": "4899 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61295,
            "unit": "B/op",
            "extra": "4899 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "4899 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 3765,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "313057 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 3765,
            "unit": "ns/op",
            "extra": "313057 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "313057 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "313057 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 24759,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "48349 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 24759,
            "unit": "ns/op",
            "extra": "48349 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "48349 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "48349 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 11809,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "102692 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 11809,
            "unit": "ns/op",
            "extra": "102692 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "102692 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "102692 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 63230,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "18970 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 63230,
            "unit": "ns/op",
            "extra": "18970 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "18970 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "18970 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3744,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "309829 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3744,
            "unit": "ns/op",
            "extra": "309829 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "309829 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "309829 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 15511,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "78646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 15511,
            "unit": "ns/op",
            "extra": "78646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "78646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "78646 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1491,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "709328 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1491,
            "unit": "ns/op",
            "extra": "709328 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "709328 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "709328 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 444.1,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2688874 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 444.1,
            "unit": "ns/op",
            "extra": "2688874 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2688874 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2688874 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 8.468,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "141725244 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 8.468,
            "unit": "ns/op",
            "extra": "141725244 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "141725244 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "141725244 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 21270,
            "unit": "ns/op\t    1613 B/op\t      35 allocs/op",
            "extra": "56523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 21270,
            "unit": "ns/op",
            "extra": "56523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1613,
            "unit": "B/op",
            "extra": "56523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "56523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 7835,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "150898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 7835,
            "unit": "ns/op",
            "extra": "150898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "150898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "150898 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2008,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "619297 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2008,
            "unit": "ns/op",
            "extra": "619297 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "619297 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "619297 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1601,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "764978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1601,
            "unit": "ns/op",
            "extra": "764978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "764978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "764978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 825.7,
            "unit": "ns/op\t     285 B/op\t       7 allocs/op",
            "extra": "1460179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 825.7,
            "unit": "ns/op",
            "extra": "1460179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 285,
            "unit": "B/op",
            "extra": "1460179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1460179 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 176627,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 176627,
            "unit": "ns/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 208.2,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "5770914 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 208.2,
            "unit": "ns/op",
            "extra": "5770914 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "5770914 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "5770914 times\n4 procs"
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
          "id": "9c6b90044e159d59f04e2c44814db1924782c389",
          "message": "Merge pull request #54 from ramius86/feature/event-roster\n\nfeat(roster): add interactive event roster",
          "timestamp": "2026-09-18T17:51:40+02:00",
          "tree_id": "128115e9541f1896580f6db15c8bf2fa480acd88",
          "url": "https://github.com/ramius86/btcservermanager/commit/9c6b90044e159d59f04e2c44814db1924782c389"
        },
        "date": 1789746772304,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41307,
            "unit": "ns/op\t    4286 B/op\t      66 allocs/op",
            "extra": "28723 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41307,
            "unit": "ns/op",
            "extra": "28723 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4286,
            "unit": "B/op",
            "extra": "28723 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28723 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38271,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31348 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38271,
            "unit": "ns/op",
            "extra": "31348 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31348 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31348 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.38,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61310130 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.38,
            "unit": "ns/op",
            "extra": "61310130 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61310130 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61310130 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 259.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4645460 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 259.6,
            "unit": "ns/op",
            "extra": "4645460 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4645460 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4645460 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111466,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9738 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111466,
            "unit": "ns/op",
            "extra": "9738 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9738 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9738 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 63166,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19038 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 63166,
            "unit": "ns/op",
            "extra": "19038 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19038 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19038 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 313163,
            "unit": "ns/op\t   61228 B/op\t     718 allocs/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 313163,
            "unit": "ns/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61228,
            "unit": "B/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4828,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "242792 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4828,
            "unit": "ns/op",
            "extra": "242792 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "242792 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "242792 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33925,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36138 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33925,
            "unit": "ns/op",
            "extra": "36138 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36138 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36138 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 17213,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "68322 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 17213,
            "unit": "ns/op",
            "extra": "68322 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "68322 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "68322 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 78176,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15320 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 78176,
            "unit": "ns/op",
            "extra": "15320 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15320 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15320 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5192,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "226904 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5192,
            "unit": "ns/op",
            "extra": "226904 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "226904 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "226904 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21827,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55105 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21827,
            "unit": "ns/op",
            "extra": "55105 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55105 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55105 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1925,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "612268 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1925,
            "unit": "ns/op",
            "extra": "612268 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "612268 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "612268 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 623.5,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1922179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 623.5,
            "unit": "ns/op",
            "extra": "1922179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1922179 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1922179 times\n4 procs"
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
            "value": 27336,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "43844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27336,
            "unit": "ns/op",
            "extra": "43844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "43844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10137,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "118086 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10137,
            "unit": "ns/op",
            "extra": "118086 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "118086 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "118086 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2771,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "441434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2771,
            "unit": "ns/op",
            "extra": "441434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "441434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "441434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2081,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "565474 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2081,
            "unit": "ns/op",
            "extra": "565474 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "565474 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "565474 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1112,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1112,
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
            "value": 220658,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5223 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220658,
            "unit": "ns/op",
            "extra": "5223 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5223 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5223 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 274.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4354472 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 274.1,
            "unit": "ns/op",
            "extra": "4354472 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4354472 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4354472 times\n4 procs"
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
          "id": "9c6b90044e159d59f04e2c44814db1924782c389",
          "message": "Merge pull request #54 from ramius86/feature/event-roster\n\nfeat(roster): add interactive event roster",
          "timestamp": "2026-09-18T17:51:40+02:00",
          "tree_id": "128115e9541f1896580f6db15c8bf2fa480acd88",
          "url": "https://github.com/ramius86/btcservermanager/commit/9c6b90044e159d59f04e2c44814db1924782c389"
        },
        "date": 1789761390786,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40639,
            "unit": "ns/op\t    4286 B/op\t      66 allocs/op",
            "extra": "29413 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40639,
            "unit": "ns/op",
            "extra": "29413 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4286,
            "unit": "B/op",
            "extra": "29413 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29413 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 40806,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30160 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 40806,
            "unit": "ns/op",
            "extra": "30160 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30160 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30160 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.33,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60689164 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.33,
            "unit": "ns/op",
            "extra": "60689164 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60689164 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60689164 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 299.3,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "3995053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 299.3,
            "unit": "ns/op",
            "extra": "3995053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "3995053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "3995053 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112533,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9412 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112533,
            "unit": "ns/op",
            "extra": "9412 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9412 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9412 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 64494,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18535 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 64494,
            "unit": "ns/op",
            "extra": "18535 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18535 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18535 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 309495,
            "unit": "ns/op\t   61278 B/op\t     718 allocs/op",
            "extra": "3742 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 309495,
            "unit": "ns/op",
            "extra": "3742 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61278,
            "unit": "B/op",
            "extra": "3742 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3742 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4793,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "249332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4793,
            "unit": "ns/op",
            "extra": "249332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "249332 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "249332 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33631,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35120 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33631,
            "unit": "ns/op",
            "extra": "35120 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35120 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35120 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16371,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73362 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16371,
            "unit": "ns/op",
            "extra": "73362 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73362 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73362 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 79303,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15352 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 79303,
            "unit": "ns/op",
            "extra": "15352 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15352 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15352 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5235,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "227240 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5235,
            "unit": "ns/op",
            "extra": "227240 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "227240 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "227240 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21406,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55518 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21406,
            "unit": "ns/op",
            "extra": "55518 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55518 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55518 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1942,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "632584 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1942,
            "unit": "ns/op",
            "extra": "632584 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "632584 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "632584 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 621.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1923210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 621.6,
            "unit": "ns/op",
            "extra": "1923210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1923210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1923210 times\n4 procs"
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
            "value": 27497,
            "unit": "ns/op\t    1600 B/op\t      35 allocs/op",
            "extra": "43034 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27497,
            "unit": "ns/op",
            "extra": "43034 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1600,
            "unit": "B/op",
            "extra": "43034 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43034 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10115,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "116968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10115,
            "unit": "ns/op",
            "extra": "116968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "116968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "116968 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2743,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "439908 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2743,
            "unit": "ns/op",
            "extra": "439908 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "439908 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "439908 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2116,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "568280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2116,
            "unit": "ns/op",
            "extra": "568280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "568280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "568280 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1120,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "964945 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1120,
            "unit": "ns/op",
            "extra": "964945 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "964945 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "964945 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 219956,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5290 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 219956,
            "unit": "ns/op",
            "extra": "5290 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5290 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5290 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 274,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4372536 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 274,
            "unit": "ns/op",
            "extra": "4372536 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4372536 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4372536 times\n4 procs"
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
          "id": "9c6b90044e159d59f04e2c44814db1924782c389",
          "message": "Merge pull request #54 from ramius86/feature/event-roster\n\nfeat(roster): add interactive event roster",
          "timestamp": "2026-09-18T17:51:40+02:00",
          "tree_id": "128115e9541f1896580f6db15c8bf2fa480acd88",
          "url": "https://github.com/ramius86/btcservermanager/commit/9c6b90044e159d59f04e2c44814db1924782c389"
        },
        "date": 1789761567869,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41017,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "29107 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41017,
            "unit": "ns/op",
            "extra": "29107 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "29107 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29107 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38579,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31154 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38579,
            "unit": "ns/op",
            "extra": "31154 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31154 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31154 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.87,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60210444 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.87,
            "unit": "ns/op",
            "extra": "60210444 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60210444 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60210444 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 323.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "3678421 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 323.4,
            "unit": "ns/op",
            "extra": "3678421 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "3678421 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "3678421 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 113039,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 113039,
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
            "value": 68129,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18925 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 68129,
            "unit": "ns/op",
            "extra": "18925 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18925 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18925 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316232,
            "unit": "ns/op\t   61270 B/op\t     718 allocs/op",
            "extra": "3718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316232,
            "unit": "ns/op",
            "extra": "3718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61270,
            "unit": "B/op",
            "extra": "3718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4852,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "239158 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4852,
            "unit": "ns/op",
            "extra": "239158 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "239158 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "239158 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33967,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33967,
            "unit": "ns/op",
            "extra": "35025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35025 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16580,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "70935 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16580,
            "unit": "ns/op",
            "extra": "70935 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "70935 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "70935 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 80999,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14814 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 80999,
            "unit": "ns/op",
            "extra": "14814 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14814 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14814 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5281,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "220572 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5281,
            "unit": "ns/op",
            "extra": "220572 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "220572 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "220572 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21655,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55417 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21655,
            "unit": "ns/op",
            "extra": "55417 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55417 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55417 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2131,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "594228 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2131,
            "unit": "ns/op",
            "extra": "594228 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "594228 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "594228 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 622.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1925696 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 622.7,
            "unit": "ns/op",
            "extra": "1925696 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1925696 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1925696 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.66,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.66,
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
            "value": 27448,
            "unit": "ns/op\t    1597 B/op\t      35 allocs/op",
            "extra": "43964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27448,
            "unit": "ns/op",
            "extra": "43964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1597,
            "unit": "B/op",
            "extra": "43964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43964 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10132,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117152 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10132,
            "unit": "ns/op",
            "extra": "117152 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117152 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117152 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2747,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "440406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2747,
            "unit": "ns/op",
            "extra": "440406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "440406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "440406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2107,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "551658 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2107,
            "unit": "ns/op",
            "extra": "551658 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "551658 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "551658 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1112,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1112,
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
            "value": 222772,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5271 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 222772,
            "unit": "ns/op",
            "extra": "5271 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5271 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5271 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 277.8,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4321737 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 277.8,
            "unit": "ns/op",
            "extra": "4321737 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4321737 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4321737 times\n4 procs"
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
          "id": "9c6b90044e159d59f04e2c44814db1924782c389",
          "message": "Merge pull request #54 from ramius86/feature/event-roster\n\nfeat(roster): add interactive event roster",
          "timestamp": "2026-09-18T17:51:40+02:00",
          "tree_id": "128115e9541f1896580f6db15c8bf2fa480acd88",
          "url": "https://github.com/ramius86/btcservermanager/commit/9c6b90044e159d59f04e2c44814db1924782c389"
        },
        "date": 1789762019549,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41700,
            "unit": "ns/op\t    4285 B/op\t      66 allocs/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41700,
            "unit": "ns/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4285,
            "unit": "B/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 39407,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30871 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 39407,
            "unit": "ns/op",
            "extra": "30871 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30871 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30871 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.37,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59684788 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.37,
            "unit": "ns/op",
            "extra": "59684788 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59684788 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59684788 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 263.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4501938 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 263.9,
            "unit": "ns/op",
            "extra": "4501938 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4501938 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4501938 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 115180,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9307 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 115180,
            "unit": "ns/op",
            "extra": "9307 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9307 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9307 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 70372,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "16408 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 70372,
            "unit": "ns/op",
            "extra": "16408 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "16408 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "16408 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316343,
            "unit": "ns/op\t   61302 B/op\t     718 allocs/op",
            "extra": "3507 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316343,
            "unit": "ns/op",
            "extra": "3507 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61302,
            "unit": "B/op",
            "extra": "3507 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3507 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4851,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "238786 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4851,
            "unit": "ns/op",
            "extra": "238786 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "238786 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "238786 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34043,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35190 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34043,
            "unit": "ns/op",
            "extra": "35190 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35190 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35190 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16727,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "71760 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16727,
            "unit": "ns/op",
            "extra": "71760 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "71760 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "71760 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 79044,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 79044,
            "unit": "ns/op",
            "extra": "15142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15142 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5380,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "222315 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5380,
            "unit": "ns/op",
            "extra": "222315 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "222315 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "222315 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22295,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54822 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22295,
            "unit": "ns/op",
            "extra": "54822 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54822 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54822 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2053,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "493902 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2053,
            "unit": "ns/op",
            "extra": "493902 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "493902 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "493902 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 622.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1921959 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 622.9,
            "unit": "ns/op",
            "extra": "1921959 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1921959 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1921959 times\n4 procs"
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
            "value": 27399,
            "unit": "ns/op\t    1594 B/op\t      35 allocs/op",
            "extra": "43647 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27399,
            "unit": "ns/op",
            "extra": "43647 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1594,
            "unit": "B/op",
            "extra": "43647 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43647 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10026,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117298 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10026,
            "unit": "ns/op",
            "extra": "117298 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117298 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117298 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2724,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "443118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2724,
            "unit": "ns/op",
            "extra": "443118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "443118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "443118 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2098,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "589039 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2098,
            "unit": "ns/op",
            "extra": "589039 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "589039 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "589039 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1121,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1121,
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
            "value": 223298,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5209 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 223298,
            "unit": "ns/op",
            "extra": "5209 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5209 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5209 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 278.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4281735 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 278.1,
            "unit": "ns/op",
            "extra": "4281735 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4281735 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4281735 times\n4 procs"
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
          "id": "3dbd8fb9146d3771b5bf64d4f38ecbcf3e90aad5",
          "message": "chore(deps): update github actions, frontend, and backend dependencies",
          "timestamp": "2026-09-19T18:38:10+02:00",
          "tree_id": "7577ad50593b7caad0610acddd8b5aaff729ca36",
          "url": "https://github.com/ramius86/btcservermanager/commit/3dbd8fb9146d3771b5bf64d4f38ecbcf3e90aad5"
        },
        "date": 1789836094903,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 42346,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 42346,
            "unit": "ns/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28500 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 39759,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "29041 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 39759,
            "unit": "ns/op",
            "extra": "29041 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "29041 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "29041 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.35,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61243268 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.35,
            "unit": "ns/op",
            "extra": "61243268 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61243268 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61243268 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 270.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4441070 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 270.7,
            "unit": "ns/op",
            "extra": "4441070 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4441070 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4441070 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112410,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112410,
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
            "value": 62846,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19044 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62846,
            "unit": "ns/op",
            "extra": "19044 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19044 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19044 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316383,
            "unit": "ns/op\t   61257 B/op\t     718 allocs/op",
            "extra": "3795 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316383,
            "unit": "ns/op",
            "extra": "3795 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61257,
            "unit": "B/op",
            "extra": "3795 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3795 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4978,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "240865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4978,
            "unit": "ns/op",
            "extra": "240865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "240865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "240865 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34700,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "33933 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34700,
            "unit": "ns/op",
            "extra": "33933 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "33933 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "33933 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16937,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "69366 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16937,
            "unit": "ns/op",
            "extra": "69366 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "69366 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "69366 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 89689,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "13432 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 89689,
            "unit": "ns/op",
            "extra": "13432 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "13432 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "13432 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5541,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "215401 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5541,
            "unit": "ns/op",
            "extra": "215401 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "215401 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "215401 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21888,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "51723 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21888,
            "unit": "ns/op",
            "extra": "51723 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "51723 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "51723 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2050,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "570918 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2050,
            "unit": "ns/op",
            "extra": "570918 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "570918 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "570918 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 628.8,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1909666 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 628.8,
            "unit": "ns/op",
            "extra": "1909666 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1909666 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1909666 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.67,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.67,
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
            "value": 27902,
            "unit": "ns/op\t    1601 B/op\t      35 allocs/op",
            "extra": "42524 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27902,
            "unit": "ns/op",
            "extra": "42524 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1601,
            "unit": "B/op",
            "extra": "42524 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "42524 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10298,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "115536 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10298,
            "unit": "ns/op",
            "extra": "115536 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "115536 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "115536 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2789,
            "unit": "ns/op\t     290 B/op\t       7 allocs/op",
            "extra": "432355 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2789,
            "unit": "ns/op",
            "extra": "432355 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 290,
            "unit": "B/op",
            "extra": "432355 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "432355 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2189,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "542331 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2189,
            "unit": "ns/op",
            "extra": "542331 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "542331 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "542331 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1156,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "958204 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1156,
            "unit": "ns/op",
            "extra": "958204 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "958204 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "958204 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 221686,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5248 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 221686,
            "unit": "ns/op",
            "extra": "5248 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5248 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5248 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 277.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4327750 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 277.4,
            "unit": "ns/op",
            "extra": "4327750 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4327750 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4327750 times\n4 procs"
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
          "id": "ece3a83ed6b1d2ead02624db387a112b12ec996e",
          "message": "fix(ci): use commit SHA for github-action-benchmark v1.22.2",
          "timestamp": "2026-09-19T18:44:49+02:00",
          "tree_id": "b65c342185c1b2b427a1118e8e18fa1cee61cd0d",
          "url": "https://github.com/ramius86/btcservermanager/commit/ece3a83ed6b1d2ead02624db387a112b12ec996e"
        },
        "date": 1789836397347,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41015,
            "unit": "ns/op\t    4285 B/op\t      66 allocs/op",
            "extra": "29155 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41015,
            "unit": "ns/op",
            "extra": "29155 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4285,
            "unit": "B/op",
            "extra": "29155 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29155 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38337,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31273 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38337,
            "unit": "ns/op",
            "extra": "31273 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31273 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31273 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.39,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61168042 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.39,
            "unit": "ns/op",
            "extra": "61168042 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61168042 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61168042 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 275,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4362060 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 275,
            "unit": "ns/op",
            "extra": "4362060 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4362060 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4362060 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111745,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111745,
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
            "value": 67217,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19195 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 67217,
            "unit": "ns/op",
            "extra": "19195 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19195 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19195 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 311308,
            "unit": "ns/op\t   61279 B/op\t     718 allocs/op",
            "extra": "3736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 311308,
            "unit": "ns/op",
            "extra": "3736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61279,
            "unit": "B/op",
            "extra": "3736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4818,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "247446 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4818,
            "unit": "ns/op",
            "extra": "247446 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "247446 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "247446 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33865,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "34868 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33865,
            "unit": "ns/op",
            "extra": "34868 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "34868 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34868 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16586,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "71791 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16586,
            "unit": "ns/op",
            "extra": "71791 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "71791 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "71791 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 84379,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14404 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 84379,
            "unit": "ns/op",
            "extra": "14404 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14404 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14404 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5315,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "207739 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5315,
            "unit": "ns/op",
            "extra": "207739 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "207739 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "207739 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21563,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21563,
            "unit": "ns/op",
            "extra": "54646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54646 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54646 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2156,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "620848 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2156,
            "unit": "ns/op",
            "extra": "620848 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "620848 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "620848 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 621.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1927411 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 621.7,
            "unit": "ns/op",
            "extra": "1927411 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1927411 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1927411 times\n4 procs"
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
            "value": 27266,
            "unit": "ns/op\t    1595 B/op\t      35 allocs/op",
            "extra": "43848 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27266,
            "unit": "ns/op",
            "extra": "43848 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1595,
            "unit": "B/op",
            "extra": "43848 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43848 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10103,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117166 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10103,
            "unit": "ns/op",
            "extra": "117166 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117166 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117166 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2717,
            "unit": "ns/op\t     290 B/op\t       7 allocs/op",
            "extra": "433556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2717,
            "unit": "ns/op",
            "extra": "433556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 290,
            "unit": "B/op",
            "extra": "433556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "433556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2084,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "552394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2084,
            "unit": "ns/op",
            "extra": "552394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "552394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "552394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1130,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1130,
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
            "value": 219968,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5235 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 219968,
            "unit": "ns/op",
            "extra": "5235 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5235 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5235 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 273.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4411920 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 273.4,
            "unit": "ns/op",
            "extra": "4411920 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4411920 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4411920 times\n4 procs"
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
          "id": "28c200bba8656e24872d6f3801ebade572ba7e77",
          "message": "feat(roster): support announcement channels and add searchable channel filter in publish modal",
          "timestamp": "2026-09-22T15:59:48+02:00",
          "tree_id": "a3d3c56af7bbf0f88eb7776f55b0e0d76bf04d2a",
          "url": "https://github.com/ramius86/btcservermanager/commit/28c200bba8656e24872d6f3801ebade572ba7e77"
        },
        "date": 1790085755247,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41328,
            "unit": "ns/op\t    4286 B/op\t      66 allocs/op",
            "extra": "28677 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41328,
            "unit": "ns/op",
            "extra": "28677 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4286,
            "unit": "B/op",
            "extra": "28677 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28677 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38524,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31142 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38524,
            "unit": "ns/op",
            "extra": "31142 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31142 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31142 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.35,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61025253 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.35,
            "unit": "ns/op",
            "extra": "61025253 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61025253 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61025253 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 285.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4204885 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 285.4,
            "unit": "ns/op",
            "extra": "4204885 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4204885 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4204885 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112851,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112851,
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
            "value": 63592,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18774 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 63592,
            "unit": "ns/op",
            "extra": "18774 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18774 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18774 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 319962,
            "unit": "ns/op\t   61296 B/op\t     718 allocs/op",
            "extra": "3616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 319962,
            "unit": "ns/op",
            "extra": "3616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61296,
            "unit": "B/op",
            "extra": "3616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4922,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "237217 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4922,
            "unit": "ns/op",
            "extra": "237217 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "237217 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "237217 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34024,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "34716 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34024,
            "unit": "ns/op",
            "extra": "34716 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "34716 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34716 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16803,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "72380 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16803,
            "unit": "ns/op",
            "extra": "72380 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "72380 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "72380 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 95631,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "12355 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 95631,
            "unit": "ns/op",
            "extra": "12355 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "12355 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "12355 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5408,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "214747 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5408,
            "unit": "ns/op",
            "extra": "214747 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "214747 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "214747 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21497,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55292 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21497,
            "unit": "ns/op",
            "extra": "55292 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55292 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55292 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2015,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "566150 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2015,
            "unit": "ns/op",
            "extra": "566150 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "566150 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "566150 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 627,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1907566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 627,
            "unit": "ns/op",
            "extra": "1907566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1907566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1907566 times\n4 procs"
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
            "value": 27344,
            "unit": "ns/op\t    1597 B/op\t      35 allocs/op",
            "extra": "44011 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27344,
            "unit": "ns/op",
            "extra": "44011 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1597,
            "unit": "B/op",
            "extra": "44011 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44011 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10055,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117036 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10055,
            "unit": "ns/op",
            "extra": "117036 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117036 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117036 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2825,
            "unit": "ns/op\t     280 B/op\t       7 allocs/op",
            "extra": "427430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2825,
            "unit": "ns/op",
            "extra": "427430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 280,
            "unit": "B/op",
            "extra": "427430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "427430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2102,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "568126 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2102,
            "unit": "ns/op",
            "extra": "568126 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "568126 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "568126 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1134,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1134,
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
            "value": 221622,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5266 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 221622,
            "unit": "ns/op",
            "extra": "5266 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5266 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5266 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 276.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4350909 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 276.4,
            "unit": "ns/op",
            "extra": "4350909 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4350909 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4350909 times\n4 procs"
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
          "id": "76d76a135177e05f45d53ce7babb5f603db81f66",
          "message": "feat(roster): discord live roster preview with real-time in-place editing",
          "timestamp": "2026-09-22T16:39:34+02:00",
          "tree_id": "e15ba84f61a8b3cd7f5685135f4f49f42f2b0e23",
          "url": "https://github.com/ramius86/btcservermanager/commit/76d76a135177e05f45d53ce7babb5f603db81f66"
        },
        "date": 1790088143131,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 27222,
            "unit": "ns/op\t    4281 B/op\t      66 allocs/op",
            "extra": "43432 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 27222,
            "unit": "ns/op",
            "extra": "43432 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4281,
            "unit": "B/op",
            "extra": "43432 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "43432 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 25785,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "46688 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 25785,
            "unit": "ns/op",
            "extra": "46688 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "46688 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "46688 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 12.02,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "83867252 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 12.02,
            "unit": "ns/op",
            "extra": "83867252 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "83867252 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "83867252 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 178.5,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "6868964 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 178.5,
            "unit": "ns/op",
            "extra": "6868964 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "6868964 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "6868964 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 78474,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "14930 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 78474,
            "unit": "ns/op",
            "extra": "14930 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "14930 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "14930 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 43499,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "27571 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 43499,
            "unit": "ns/op",
            "extra": "27571 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "27571 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "27571 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 199092,
            "unit": "ns/op\t   61386 B/op\t     718 allocs/op",
            "extra": "5144 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 199092,
            "unit": "ns/op",
            "extra": "5144 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61386,
            "unit": "B/op",
            "extra": "5144 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "5144 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 2965,
            "unit": "ns/op\t     506 B/op\t       9 allocs/op",
            "extra": "395426 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 2965,
            "unit": "ns/op",
            "extra": "395426 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 506,
            "unit": "B/op",
            "extra": "395426 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "395426 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 22300,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "53248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 22300,
            "unit": "ns/op",
            "extra": "53248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "53248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "53248 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 10676,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "101233 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 10676,
            "unit": "ns/op",
            "extra": "101233 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "101233 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "101233 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 68647,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "18147 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 68647,
            "unit": "ns/op",
            "extra": "18147 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "18147 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "18147 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3441,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "305563 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3441,
            "unit": "ns/op",
            "extra": "305563 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "305563 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "305563 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 13983,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "85672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 13983,
            "unit": "ns/op",
            "extra": "85672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "85672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "85672 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1359,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "893871 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1359,
            "unit": "ns/op",
            "extra": "893871 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "893871 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "893871 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 426.5,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2809098 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 426.5,
            "unit": "ns/op",
            "extra": "2809098 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2809098 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2809098 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 7.216,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "166298996 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 7.216,
            "unit": "ns/op",
            "extra": "166298996 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "166298996 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "166298996 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 17654,
            "unit": "ns/op\t    1603 B/op\t      35 allocs/op",
            "extra": "67870 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 17654,
            "unit": "ns/op",
            "extra": "67870 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1603,
            "unit": "B/op",
            "extra": "67870 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "67870 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 6676,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "177688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 6676,
            "unit": "ns/op",
            "extra": "177688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "177688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "177688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 1743,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "702085 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1743,
            "unit": "ns/op",
            "extra": "702085 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "702085 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "702085 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1319,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "842408 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1319,
            "unit": "ns/op",
            "extra": "842408 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "842408 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "842408 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 707,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "1714584 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 707,
            "unit": "ns/op",
            "extra": "1714584 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "1714584 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1714584 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 160410,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "7094 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 160410,
            "unit": "ns/op",
            "extra": "7094 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "7094 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "7094 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 218.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "5028703 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 218.4,
            "unit": "ns/op",
            "extra": "5028703 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "5028703 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "5028703 times\n4 procs"
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
          "id": "ee756e13bf986e35ebee89889e123ac0ee3ebd55",
          "message": "fix(discordbot): sync member nicknames in real time and clean rosterUtils warnings",
          "timestamp": "2026-09-24T12:52:00+02:00",
          "tree_id": "4b9aa2d308b9e01d0e84f604b52cb002acd96a4a",
          "url": "https://github.com/ramius86/btcservermanager/commit/ee756e13bf986e35ebee89889e123ac0ee3ebd55"
        },
        "date": 1790255750756,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41438,
            "unit": "ns/op\t    4285 B/op\t      66 allocs/op",
            "extra": "28908 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41438,
            "unit": "ns/op",
            "extra": "28908 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4285,
            "unit": "B/op",
            "extra": "28908 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28908 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38873,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30570 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38873,
            "unit": "ns/op",
            "extra": "30570 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30570 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30570 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.78,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60200294 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.78,
            "unit": "ns/op",
            "extra": "60200294 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60200294 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60200294 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 280.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4293501 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 280.2,
            "unit": "ns/op",
            "extra": "4293501 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4293501 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4293501 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 113557,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 113557,
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
            "value": 63227,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18943 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 63227,
            "unit": "ns/op",
            "extra": "18943 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18943 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18943 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 317510,
            "unit": "ns/op\t   61326 B/op\t     718 allocs/op",
            "extra": "3626 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 317510,
            "unit": "ns/op",
            "extra": "3626 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61326,
            "unit": "B/op",
            "extra": "3626 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3626 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4838,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "241812 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4838,
            "unit": "ns/op",
            "extra": "241812 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "241812 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "241812 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33950,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35022 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33950,
            "unit": "ns/op",
            "extra": "35022 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35022 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35022 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16839,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "69853 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16839,
            "unit": "ns/op",
            "extra": "69853 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "69853 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "69853 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 90420,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14196 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 90420,
            "unit": "ns/op",
            "extra": "14196 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14196 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14196 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5884,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "176602 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5884,
            "unit": "ns/op",
            "extra": "176602 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "176602 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "176602 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21711,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54864 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21711,
            "unit": "ns/op",
            "extra": "54864 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54864 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54864 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2025,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "585978 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2025,
            "unit": "ns/op",
            "extra": "585978 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "585978 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "585978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 674.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1824590 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 674.7,
            "unit": "ns/op",
            "extra": "1824590 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1824590 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1824590 times\n4 procs"
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
            "value": 27616,
            "unit": "ns/op\t    1601 B/op\t      35 allocs/op",
            "extra": "42103 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27616,
            "unit": "ns/op",
            "extra": "42103 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1601,
            "unit": "B/op",
            "extra": "42103 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "42103 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10146,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117606 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10146,
            "unit": "ns/op",
            "extra": "117606 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117606 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117606 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2720,
            "unit": "ns/op\t     280 B/op\t       7 allocs/op",
            "extra": "430615 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2720,
            "unit": "ns/op",
            "extra": "430615 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 280,
            "unit": "B/op",
            "extra": "430615 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "430615 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2169,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "592813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2169,
            "unit": "ns/op",
            "extra": "592813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "592813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "592813 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1128,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1128,
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
            "value": 221775,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5191 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 221775,
            "unit": "ns/op",
            "extra": "5191 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5191 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5191 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 274.6,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4383766 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 274.6,
            "unit": "ns/op",
            "extra": "4383766 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4383766 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4383766 times\n4 procs"
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
          "id": "ee756e13bf986e35ebee89889e123ac0ee3ebd55",
          "message": "fix(discordbot): sync member nicknames in real time and clean rosterUtils warnings",
          "timestamp": "2026-09-24T12:52:00+02:00",
          "tree_id": "4b9aa2d308b9e01d0e84f604b52cb002acd96a4a",
          "url": "https://github.com/ramius86/btcservermanager/commit/ee756e13bf986e35ebee89889e123ac0ee3ebd55"
        },
        "date": 1790256155611,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41834,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "29048 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41834,
            "unit": "ns/op",
            "extra": "29048 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "29048 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29048 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38551,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30924 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38551,
            "unit": "ns/op",
            "extra": "30924 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30924 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30924 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.54,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61248810 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.54,
            "unit": "ns/op",
            "extra": "61248810 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61248810 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61248810 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 274.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4381408 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 274.2,
            "unit": "ns/op",
            "extra": "4381408 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4381408 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4381408 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111960,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "9574 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111960,
            "unit": "ns/op",
            "extra": "9574 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "9574 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9574 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 62882,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19184 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62882,
            "unit": "ns/op",
            "extra": "19184 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19184 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19184 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 312404,
            "unit": "ns/op\t   61266 B/op\t     718 allocs/op",
            "extra": "3820 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 312404,
            "unit": "ns/op",
            "extra": "3820 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61266,
            "unit": "B/op",
            "extra": "3820 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3820 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4791,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "242956 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4791,
            "unit": "ns/op",
            "extra": "242956 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "242956 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "242956 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33911,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35272 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33911,
            "unit": "ns/op",
            "extra": "35272 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35272 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35272 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16861,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "67311 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16861,
            "unit": "ns/op",
            "extra": "67311 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "67311 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "67311 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 79692,
            "unit": "ns/op\t  332153 B/op\t       8 allocs/op",
            "extra": "15056 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 79692,
            "unit": "ns/op",
            "extra": "15056 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332153,
            "unit": "B/op",
            "extra": "15056 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15056 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5614,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "225031 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5614,
            "unit": "ns/op",
            "extra": "225031 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "225031 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "225031 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21681,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55143 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21681,
            "unit": "ns/op",
            "extra": "55143 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55143 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55143 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1979,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "570654 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1979,
            "unit": "ns/op",
            "extra": "570654 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "570654 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "570654 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 624.2,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1916659 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 624.2,
            "unit": "ns/op",
            "extra": "1916659 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1916659 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1916659 times\n4 procs"
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
            "value": 27365,
            "unit": "ns/op\t    1595 B/op\t      35 allocs/op",
            "extra": "43846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27365,
            "unit": "ns/op",
            "extra": "43846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1595,
            "unit": "B/op",
            "extra": "43846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43846 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10099,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117384 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10099,
            "unit": "ns/op",
            "extra": "117384 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117384 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117384 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2726,
            "unit": "ns/op\t     290 B/op\t       7 allocs/op",
            "extra": "433076 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2726,
            "unit": "ns/op",
            "extra": "433076 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 290,
            "unit": "B/op",
            "extra": "433076 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "433076 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2083,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "549030 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2083,
            "unit": "ns/op",
            "extra": "549030 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "549030 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "549030 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1149,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1149,
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
            "value": 220921,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5276 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220921,
            "unit": "ns/op",
            "extra": "5276 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5276 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5276 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 275.3,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4376197 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 275.3,
            "unit": "ns/op",
            "extra": "4376197 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4376197 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4376197 times\n4 procs"
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
          "id": "3acbd4db903df3d402763ac124e6b658e4767dde",
          "message": "ci(benchmark): skip unit tests with -run='^$' and calibrate alert threshold to 200%",
          "timestamp": "2026-09-24T15:31:46+02:00",
          "tree_id": "bc98a630d2c3cbee248f9e9355475c4f803b5fbc",
          "url": "https://github.com/ramius86/btcservermanager/commit/3acbd4db903df3d402763ac124e6b658e4767dde"
        },
        "date": 1790256830568,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40811,
            "unit": "ns/op\t    4280 B/op\t      66 allocs/op",
            "extra": "29553 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40811,
            "unit": "ns/op",
            "extra": "29553 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4280,
            "unit": "B/op",
            "extra": "29553 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29553 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38506,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30856 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38506,
            "unit": "ns/op",
            "extra": "30856 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30856 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30856 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.45,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60152929 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.45,
            "unit": "ns/op",
            "extra": "60152929 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60152929 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60152929 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 262.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4607536 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 262.6,
            "unit": "ns/op",
            "extra": "4607536 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4607536 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4607536 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112040,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112040,
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
            "value": 62599,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19070 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62599,
            "unit": "ns/op",
            "extra": "19070 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19070 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19070 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 311097,
            "unit": "ns/op\t   61255 B/op\t     718 allocs/op",
            "extra": "3799 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 311097,
            "unit": "ns/op",
            "extra": "3799 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61255,
            "unit": "B/op",
            "extra": "3799 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3799 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4875,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "245566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4875,
            "unit": "ns/op",
            "extra": "245566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "245566 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "245566 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33867,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35409 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33867,
            "unit": "ns/op",
            "extra": "35409 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35409 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35409 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16790,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "71569 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16790,
            "unit": "ns/op",
            "extra": "71569 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "71569 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "71569 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 75751,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15994 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 75751,
            "unit": "ns/op",
            "extra": "15994 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15994 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15994 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5184,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "226500 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5184,
            "unit": "ns/op",
            "extra": "226500 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "226500 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "226500 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21485,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "56024 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21485,
            "unit": "ns/op",
            "extra": "56024 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "56024 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "56024 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1973,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "604242 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1973,
            "unit": "ns/op",
            "extra": "604242 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "604242 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "604242 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 623.3,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1923938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 623.3,
            "unit": "ns/op",
            "extra": "1923938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1923938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1923938 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.71,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.71,
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
            "value": 27310,
            "unit": "ns/op\t    1593 B/op\t      35 allocs/op",
            "extra": "43652 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27310,
            "unit": "ns/op",
            "extra": "43652 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1593,
            "unit": "B/op",
            "extra": "43652 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43652 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10127,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117424 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10127,
            "unit": "ns/op",
            "extra": "117424 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117424 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117424 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2719,
            "unit": "ns/op\t     287 B/op\t       7 allocs/op",
            "extra": "453716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2719,
            "unit": "ns/op",
            "extra": "453716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 287,
            "unit": "B/op",
            "extra": "453716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "453716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2082,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "581296 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2082,
            "unit": "ns/op",
            "extra": "581296 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "581296 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "581296 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1112,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1112,
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
            "value": 223161,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5138 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 223161,
            "unit": "ns/op",
            "extra": "5138 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5138 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5138 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 277,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4307932 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 277,
            "unit": "ns/op",
            "extra": "4307932 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4307932 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4307932 times\n4 procs"
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
          "id": "ee756e13bf986e35ebee89889e123ac0ee3ebd55",
          "message": "fix(discordbot): sync member nicknames in real time and clean rosterUtils warnings",
          "timestamp": "2026-09-24T12:52:00+02:00",
          "tree_id": "4b9aa2d308b9e01d0e84f604b52cb002acd96a4a",
          "url": "https://github.com/ramius86/btcservermanager/commit/ee756e13bf986e35ebee89889e123ac0ee3ebd55"
        },
        "date": 1790258656233,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41562,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "28848 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41562,
            "unit": "ns/op",
            "extra": "28848 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "28848 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28848 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38809,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30914 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38809,
            "unit": "ns/op",
            "extra": "30914 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30914 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30914 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.34,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60219415 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.34,
            "unit": "ns/op",
            "extra": "60219415 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60219415 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60219415 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 275.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4320806 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 275.2,
            "unit": "ns/op",
            "extra": "4320806 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4320806 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4320806 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 113595,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "9862 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 113595,
            "unit": "ns/op",
            "extra": "9862 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "9862 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9862 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 64537,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 64537,
            "unit": "ns/op",
            "extra": "18590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18590 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18590 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 332682,
            "unit": "ns/op\t   61247 B/op\t     718 allocs/op",
            "extra": "3558 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 332682,
            "unit": "ns/op",
            "extra": "3558 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61247,
            "unit": "B/op",
            "extra": "3558 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3558 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4890,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "243014 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4890,
            "unit": "ns/op",
            "extra": "243014 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "243014 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "243014 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 35804,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "34778 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 35804,
            "unit": "ns/op",
            "extra": "34778 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "34778 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34778 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 17383,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "60801 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 17383,
            "unit": "ns/op",
            "extra": "60801 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "60801 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "60801 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 83869,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14349 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 83869,
            "unit": "ns/op",
            "extra": "14349 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14349 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14349 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5457,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "217808 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5457,
            "unit": "ns/op",
            "extra": "217808 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "217808 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "217808 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21834,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55597 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21834,
            "unit": "ns/op",
            "extra": "55597 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55597 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55597 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2069,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "569883 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2069,
            "unit": "ns/op",
            "extra": "569883 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "569883 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "569883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 624.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1913523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 624.7,
            "unit": "ns/op",
            "extra": "1913523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1913523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1913523 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.65,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.65,
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
            "value": 27954,
            "unit": "ns/op\t    1597 B/op\t      35 allocs/op",
            "extra": "42604 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27954,
            "unit": "ns/op",
            "extra": "42604 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1597,
            "unit": "B/op",
            "extra": "42604 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "42604 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10613,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "113716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10613,
            "unit": "ns/op",
            "extra": "113716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "113716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "113716 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2772,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "444026 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2772,
            "unit": "ns/op",
            "extra": "444026 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "444026 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "444026 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2192,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "551865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2192,
            "unit": "ns/op",
            "extra": "551865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "551865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "551865 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1143,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1143,
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
            "value": 221792,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5126 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 221792,
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
            "value": 277,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4335961 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 277,
            "unit": "ns/op",
            "extra": "4335961 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4335961 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4335961 times\n4 procs"
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
          "id": "9c6b90044e159d59f04e2c44814db1924782c389",
          "message": "Merge pull request #54 from ramius86/feature/event-roster\n\nfeat(roster): add interactive event roster",
          "timestamp": "2026-09-18T17:51:40+02:00",
          "tree_id": "128115e9541f1896580f6db15c8bf2fa480acd88",
          "url": "https://github.com/ramius86/btcservermanager/commit/9c6b90044e159d59f04e2c44814db1924782c389"
        },
        "date": 1790259252272,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41569,
            "unit": "ns/op\t    4282 B/op\t      66 allocs/op",
            "extra": "29508 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41569,
            "unit": "ns/op",
            "extra": "29508 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4282,
            "unit": "B/op",
            "extra": "29508 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29508 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38531,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "30583 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38531,
            "unit": "ns/op",
            "extra": "30583 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "30583 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "30583 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.42,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59520889 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.42,
            "unit": "ns/op",
            "extra": "59520889 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59520889 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59520889 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 267.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4476128 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 267.9,
            "unit": "ns/op",
            "extra": "4476128 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4476128 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4476128 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111289,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111289,
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
            "value": 62384,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19251 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62384,
            "unit": "ns/op",
            "extra": "19251 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19251 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19251 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 310012,
            "unit": "ns/op\t   61236 B/op\t     718 allocs/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 310012,
            "unit": "ns/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61236,
            "unit": "B/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4802,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "244718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4802,
            "unit": "ns/op",
            "extra": "244718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "244718 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "244718 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33282,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "36039 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33282,
            "unit": "ns/op",
            "extra": "36039 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "36039 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36039 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 17403,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "70604 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 17403,
            "unit": "ns/op",
            "extra": "70604 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "70604 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "70604 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 78336,
            "unit": "ns/op\t  332153 B/op\t       8 allocs/op",
            "extra": "15302 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 78336,
            "unit": "ns/op",
            "extra": "15302 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332153,
            "unit": "B/op",
            "extra": "15302 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15302 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5175,
            "unit": "ns/op\t    3073 B/op\t       1 allocs/op",
            "extra": "224102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5175,
            "unit": "ns/op",
            "extra": "224102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3073,
            "unit": "B/op",
            "extra": "224102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "224102 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21394,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "56004 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21394,
            "unit": "ns/op",
            "extra": "56004 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "56004 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "56004 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1935,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "602690 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1935,
            "unit": "ns/op",
            "extra": "602690 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "602690 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "602690 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 620.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1931744 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 620.6,
            "unit": "ns/op",
            "extra": "1931744 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1931744 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1931744 times\n4 procs"
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
            "value": 27286,
            "unit": "ns/op\t    1593 B/op\t      35 allocs/op",
            "extra": "43963 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27286,
            "unit": "ns/op",
            "extra": "43963 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1593,
            "unit": "B/op",
            "extra": "43963 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43963 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10114,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10114,
            "unit": "ns/op",
            "extra": "117406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117406 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2691,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "449565 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2691,
            "unit": "ns/op",
            "extra": "449565 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "449565 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "449565 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2075,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "595572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2075,
            "unit": "ns/op",
            "extra": "595572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "595572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "595572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1124,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "998743 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1124,
            "unit": "ns/op",
            "extra": "998743 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "998743 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "998743 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 220231,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5367 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220231,
            "unit": "ns/op",
            "extra": "5367 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5367 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5367 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 274.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4335103 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 274.4,
            "unit": "ns/op",
            "extra": "4335103 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4335103 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4335103 times\n4 procs"
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
          "id": "5ce4db65aa7be39b0d321d5cf96cf52b1f1c2f25",
          "message": "feat(discordbot): add account merge feature for duplicate Discord IDs",
          "timestamp": "2026-09-30T14:42:02+02:00",
          "tree_id": "0501b049d58326c3548e30a3656603afcbea1415",
          "url": "https://github.com/ramius86/btcservermanager/commit/5ce4db65aa7be39b0d321d5cf96cf52b1f1c2f25"
        },
        "date": 1790772398957,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 39868,
            "unit": "ns/op\t    4280 B/op\t      66 allocs/op",
            "extra": "30069 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 39868,
            "unit": "ns/op",
            "extra": "30069 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4280,
            "unit": "B/op",
            "extra": "30069 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "30069 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 37774,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31767 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 37774,
            "unit": "ns/op",
            "extra": "31767 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31767 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31767 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.35,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60202813 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.35,
            "unit": "ns/op",
            "extra": "60202813 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60202813 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60202813 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 277,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4331266 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 277,
            "unit": "ns/op",
            "extra": "4331266 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4331266 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4331266 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 108956,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 108956,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
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
            "value": 65664,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19047 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 65664,
            "unit": "ns/op",
            "extra": "19047 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19047 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19047 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308898,
            "unit": "ns/op\t   61256 B/op\t     718 allocs/op",
            "extra": "3787 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308898,
            "unit": "ns/op",
            "extra": "3787 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61256,
            "unit": "B/op",
            "extra": "3787 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3787 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4709,
            "unit": "ns/op\t     506 B/op\t       9 allocs/op",
            "extra": "248430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4709,
            "unit": "ns/op",
            "extra": "248430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 506,
            "unit": "B/op",
            "extra": "248430 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "248430 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32800,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36609 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32800,
            "unit": "ns/op",
            "extra": "36609 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36609 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36609 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16280,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "73880 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16280,
            "unit": "ns/op",
            "extra": "73880 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "73880 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73880 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 73222,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16501 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 73222,
            "unit": "ns/op",
            "extra": "16501 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16501 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16501 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5073,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "232705 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5073,
            "unit": "ns/op",
            "extra": "232705 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "232705 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "232705 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21626,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55873 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21626,
            "unit": "ns/op",
            "extra": "55873 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55873 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55873 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1951,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "594026 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1951,
            "unit": "ns/op",
            "extra": "594026 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "594026 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "594026 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 623.1,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1935420 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 623.1,
            "unit": "ns/op",
            "extra": "1935420 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1935420 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1935420 times\n4 procs"
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
            "value": 28613,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "41986 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 28613,
            "unit": "ns/op",
            "extra": "41986 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "41986 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "41986 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10755,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "109394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10755,
            "unit": "ns/op",
            "extra": "109394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "109394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "109394 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2655,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "463093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2655,
            "unit": "ns/op",
            "extra": "463093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "463093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "463093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2063,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "569397 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2063,
            "unit": "ns/op",
            "extra": "569397 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "569397 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "569397 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1062,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1062,
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
            "value": 220617,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5145 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 220617,
            "unit": "ns/op",
            "extra": "5145 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5145 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5145 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 245.8,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4846963 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 245.8,
            "unit": "ns/op",
            "extra": "4846963 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4846963 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4846963 times\n4 procs"
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
          "id": "5497e46c193e1b9d1a8570e3be0d2182162b6c8c",
          "message": "feat(roster): add multi-part mission support and side-by-side discord embed",
          "timestamp": "2026-09-30T15:16:18+02:00",
          "tree_id": "5c01f6b0031544778af39a1237ebc324b4a3b304",
          "url": "https://github.com/ramius86/btcservermanager/commit/5497e46c193e1b9d1a8570e3be0d2182162b6c8c"
        },
        "date": 1790774315298,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 27673,
            "unit": "ns/op\t    4280 B/op\t      66 allocs/op",
            "extra": "39436 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 27673,
            "unit": "ns/op",
            "extra": "39436 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4280,
            "unit": "B/op",
            "extra": "39436 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "39436 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 26003,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "47130 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 26003,
            "unit": "ns/op",
            "extra": "47130 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "47130 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "47130 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 12.12,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "95076216 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 12.12,
            "unit": "ns/op",
            "extra": "95076216 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "95076216 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "95076216 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 168.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7096972 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 168.4,
            "unit": "ns/op",
            "extra": "7096972 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7096972 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7096972 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 76372,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "15439 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 76372,
            "unit": "ns/op",
            "extra": "15439 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "15439 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "15439 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 43959,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "27156 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 43959,
            "unit": "ns/op",
            "extra": "27156 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "27156 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "27156 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 191664,
            "unit": "ns/op\t   61315 B/op\t     718 allocs/op",
            "extra": "6105 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 191664,
            "unit": "ns/op",
            "extra": "6105 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61315,
            "unit": "B/op",
            "extra": "6105 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "6105 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 2981,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "409616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 2981,
            "unit": "ns/op",
            "extra": "409616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "409616 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "409616 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 24041,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "49285 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 24041,
            "unit": "ns/op",
            "extra": "49285 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "49285 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "49285 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 10171,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "120081 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 10171,
            "unit": "ns/op",
            "extra": "120081 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "120081 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "120081 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 62855,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "19119 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 62855,
            "unit": "ns/op",
            "extra": "19119 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "19119 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "19119 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3350,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "329630 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3350,
            "unit": "ns/op",
            "extra": "329630 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "329630 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "329630 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 13695,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "87019 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 13695,
            "unit": "ns/op",
            "extra": "87019 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "87019 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "87019 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1332,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "898864 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1332,
            "unit": "ns/op",
            "extra": "898864 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "898864 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "898864 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 430.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2785254 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 430.9,
            "unit": "ns/op",
            "extra": "2785254 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2785254 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2785254 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 7.404,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "159203352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 7.404,
            "unit": "ns/op",
            "extra": "159203352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "159203352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "159203352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 17274,
            "unit": "ns/op\t    1620 B/op\t      35 allocs/op",
            "extra": "69896 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 17274,
            "unit": "ns/op",
            "extra": "69896 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1620,
            "unit": "B/op",
            "extra": "69896 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "69896 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 6542,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "182239 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 6542,
            "unit": "ns/op",
            "extra": "182239 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "182239 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "182239 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 1667,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "697124 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1667,
            "unit": "ns/op",
            "extra": "697124 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "697124 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "697124 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1278,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "928512 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1278,
            "unit": "ns/op",
            "extra": "928512 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "928512 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "928512 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 719.9,
            "unit": "ns/op\t     281 B/op\t       7 allocs/op",
            "extra": "1616151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 719.9,
            "unit": "ns/op",
            "extra": "1616151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 281,
            "unit": "B/op",
            "extra": "1616151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1616151 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 167466,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "7549 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 167466,
            "unit": "ns/op",
            "extra": "7549 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "7549 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "7549 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 213.5,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "5517693 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 213.5,
            "unit": "ns/op",
            "extra": "5517693 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "5517693 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "5517693 times\n4 procs"
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
          "id": "e34fa6b92b75f65e4aacee989687e2ba344a84f9",
          "message": "fix(mods): handle in-progress states correctly and improve update tracking UX",
          "timestamp": "2026-10-01T09:50:38+02:00",
          "tree_id": "5b18e0516b1212d007d7637814f26b53092fcc19",
          "url": "https://github.com/ramius86/btcservermanager/commit/e34fa6b92b75f65e4aacee989687e2ba344a84f9"
        },
        "date": 1790841416621,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 39898,
            "unit": "ns/op\t    4280 B/op\t      66 allocs/op",
            "extra": "30060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 39898,
            "unit": "ns/op",
            "extra": "30060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4280,
            "unit": "B/op",
            "extra": "30060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "30060 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 37632,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31807 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 37632,
            "unit": "ns/op",
            "extra": "31807 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31807 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31807 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.77,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59956785 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.77,
            "unit": "ns/op",
            "extra": "59956785 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59956785 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59956785 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 275.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4344703 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 275.4,
            "unit": "ns/op",
            "extra": "4344703 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4344703 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4344703 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 108019,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 108019,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
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
            "value": 62352,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19140 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 62352,
            "unit": "ns/op",
            "extra": "19140 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19140 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19140 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 308725,
            "unit": "ns/op\t   61244 B/op\t     718 allocs/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 308725,
            "unit": "ns/op",
            "extra": "3850 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61244,
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
            "value": 4826,
            "unit": "ns/op\t     506 B/op\t       9 allocs/op",
            "extra": "247678 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4826,
            "unit": "ns/op",
            "extra": "247678 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 506,
            "unit": "B/op",
            "extra": "247678 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "247678 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 32871,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36528 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 32871,
            "unit": "ns/op",
            "extra": "36528 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36528 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36528 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16237,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73161 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16237,
            "unit": "ns/op",
            "extra": "73161 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73161 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73161 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 73732,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16359 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 73732,
            "unit": "ns/op",
            "extra": "16359 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16359 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16359 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5095,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "232848 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5095,
            "unit": "ns/op",
            "extra": "232848 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "232848 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "232848 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21507,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54385 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21507,
            "unit": "ns/op",
            "extra": "54385 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54385 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54385 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1934,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "620744 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1934,
            "unit": "ns/op",
            "extra": "620744 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "620744 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "620744 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 691.5,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1734319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 691.5,
            "unit": "ns/op",
            "extra": "1734319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1734319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1734319 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.69,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.69,
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
            "value": 28868,
            "unit": "ns/op\t    1598 B/op\t      35 allocs/op",
            "extra": "40621 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 28868,
            "unit": "ns/op",
            "extra": "40621 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1598,
            "unit": "B/op",
            "extra": "40621 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "40621 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10992,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "108741 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10992,
            "unit": "ns/op",
            "extra": "108741 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "108741 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "108741 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2648,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "449689 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2648,
            "unit": "ns/op",
            "extra": "449689 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "449689 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "449689 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2076,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "573739 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2076,
            "unit": "ns/op",
            "extra": "573739 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "573739 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "573739 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1069,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1069,
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
            "value": 217668,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5504 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 217668,
            "unit": "ns/op",
            "extra": "5504 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5504 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5504 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 247,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4873856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 247,
            "unit": "ns/op",
            "extra": "4873856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4873856 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4873856 times\n4 procs"
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
          "id": "497a5b06a1c3782fdf7c17f1a3dc66af6af9cb85",
          "message": "Merge pull request #65 from ramius86/1.1.0\n\n1.1.0",
          "timestamp": "2026-10-11T21:57:02+02:00",
          "tree_id": "3ad4cfdc260ebd85c19994d302ce8f55f211832a",
          "url": "https://github.com/ramius86/btcservermanager/commit/497a5b06a1c3782fdf7c17f1a3dc66af6af9cb85"
        },
        "date": 1791748700726,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 34158,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "35082 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 34158,
            "unit": "ns/op",
            "extra": "35082 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "35082 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "35082 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 32310,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "37101 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 32310,
            "unit": "ns/op",
            "extra": "37101 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "37101 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "37101 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 14.77,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "77337805 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 14.77,
            "unit": "ns/op",
            "extra": "77337805 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "77337805 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "77337805 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 226.4,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5422150 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 226.4,
            "unit": "ns/op",
            "extra": "5422150 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5422150 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5422150 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 81747,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "14497 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 81747,
            "unit": "ns/op",
            "extra": "14497 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "14497 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "14497 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 44628,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "26751 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 44628,
            "unit": "ns/op",
            "extra": "26751 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "26751 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "26751 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 240019,
            "unit": "ns/op\t   61236 B/op\t     718 allocs/op",
            "extra": "4844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 240019,
            "unit": "ns/op",
            "extra": "4844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61236,
            "unit": "B/op",
            "extra": "4844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "4844 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 3732,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "319714 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 3732,
            "unit": "ns/op",
            "extra": "319714 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "319714 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "319714 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 24289,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "49393 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 24289,
            "unit": "ns/op",
            "extra": "49393 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "49393 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "49393 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 12019,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "100508 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 12019,
            "unit": "ns/op",
            "extra": "100508 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "100508 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "100508 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 58491,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "20142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 58491,
            "unit": "ns/op",
            "extra": "20142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "20142 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "20142 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3713,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "313000 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3713,
            "unit": "ns/op",
            "extra": "313000 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "313000 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "313000 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 15967,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "73166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 15967,
            "unit": "ns/op",
            "extra": "73166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "73166 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "73166 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1456,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "858901 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1456,
            "unit": "ns/op",
            "extra": "858901 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "858901 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "858901 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 444.8,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2706817 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 444.8,
            "unit": "ns/op",
            "extra": "2706817 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2706817 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2706817 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 8.503,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "140995634 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 8.503,
            "unit": "ns/op",
            "extra": "140995634 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "140995634 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "140995634 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 20099,
            "unit": "ns/op\t    1612 B/op\t      35 allocs/op",
            "extra": "59110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 20099,
            "unit": "ns/op",
            "extra": "59110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1612,
            "unit": "B/op",
            "extra": "59110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "59110 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 7452,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "159588 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 7452,
            "unit": "ns/op",
            "extra": "159588 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "159588 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "159588 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 1882,
            "unit": "ns/op\t     283 B/op\t       7 allocs/op",
            "extra": "617563 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1882,
            "unit": "ns/op",
            "extra": "617563 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 283,
            "unit": "B/op",
            "extra": "617563 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "617563 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1583,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "767059 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1583,
            "unit": "ns/op",
            "extra": "767059 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "767059 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "767059 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 799.9,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "1499078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 799.9,
            "unit": "ns/op",
            "extra": "1499078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "1499078 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1499078 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 166390,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "7210 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 166390,
            "unit": "ns/op",
            "extra": "7210 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "7210 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "7210 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 190.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "6322569 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 190.4,
            "unit": "ns/op",
            "extra": "6322569 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "6322569 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "6322569 times\n4 procs"
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
          "id": "217066fbdaac58b086805d63b122677cc8e7ec79",
          "message": "feat(workshop): implement Arma 3 cryptographic signature verification and bikey auto-recovery\n\n- Add native Go parser and verifier for .bikey keys, .bisign signatures (v2/v3), and streaming .pbo integrity with RSA math\n- Support auto-extracting missing .bikey files directly from .bisign public key headers when installing or verifying mods\n- Add database migration 040 to track mod signature verification status and summary\n- Integrate signature verification and auto-recovery into mod installation flow\n- Expose verification endpoints in API and broadcast real-time status updates over WebSocket\n- Add UI badges on mod cards and interactive Arma 3 Signature Verification dialog in Settings",
          "timestamp": "2026-10-14T21:01:33+02:00",
          "tree_id": "6c7a7f5ebe44c552463be0fd61d1b750aed22fd2",
          "url": "https://github.com/ramius86/btcservermanager/commit/217066fbdaac58b086805d63b122677cc8e7ec79"
        },
        "date": 1792004628196,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40707,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "29467 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40707,
            "unit": "ns/op",
            "extra": "29467 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "29467 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29467 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38052,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31352 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38052,
            "unit": "ns/op",
            "extra": "31352 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31352 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31352 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 20.01,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "58446272 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 20.01,
            "unit": "ns/op",
            "extra": "58446272 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "58446272 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "58446272 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 278.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4244857 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 278.9,
            "unit": "ns/op",
            "extra": "4244857 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4244857 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4244857 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112452,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112452,
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
            "value": 60693,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19791 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60693,
            "unit": "ns/op",
            "extra": "19791 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19791 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19791 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 316641,
            "unit": "ns/op\t   61178 B/op\t     718 allocs/op",
            "extra": "3806 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 316641,
            "unit": "ns/op",
            "extra": "3806 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61178,
            "unit": "B/op",
            "extra": "3806 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3806 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4722,
            "unit": "ns/op\t     506 B/op\t       9 allocs/op",
            "extra": "245704 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4722,
            "unit": "ns/op",
            "extra": "245704 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 506,
            "unit": "B/op",
            "extra": "245704 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "245704 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34216,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "33748 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34216,
            "unit": "ns/op",
            "extra": "33748 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "33748 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "33748 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16544,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "69367 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16544,
            "unit": "ns/op",
            "extra": "69367 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "69367 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "69367 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 73837,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16368 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 73837,
            "unit": "ns/op",
            "extra": "16368 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16368 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16368 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5223,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "227683 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5223,
            "unit": "ns/op",
            "extra": "227683 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "227683 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "227683 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22233,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54072 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22233,
            "unit": "ns/op",
            "extra": "54072 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54072 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54072 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2014,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "589572 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2014,
            "unit": "ns/op",
            "extra": "589572 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "589572 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "589572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 600.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1998048 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 600.6,
            "unit": "ns/op",
            "extra": "1998048 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1998048 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1998048 times\n4 procs"
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
            "value": 27232,
            "unit": "ns/op\t    1611 B/op\t      35 allocs/op",
            "extra": "45151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27232,
            "unit": "ns/op",
            "extra": "45151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1611,
            "unit": "B/op",
            "extra": "45151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "45151 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10141,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "119389 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10141,
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
            "value": 2663,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "463020 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2663,
            "unit": "ns/op",
            "extra": "463020 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "463020 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "463020 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2088,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "586816 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2088,
            "unit": "ns/op",
            "extra": "586816 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "586816 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "586816 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1116,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1116,
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
            "value": 223271,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5146 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 223271,
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
            "value": 250.6,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4807782 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 250.6,
            "unit": "ns/op",
            "extra": "4807782 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4807782 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4807782 times\n4 procs"
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
          "id": "609303fe911f8ad045ee886514d3852d121fd58e",
          "message": "fix(workshop): support sqfc in v3 signatures, add live verification progress, and fix null safety\n\n- Include .sqfc compiled SQF bytecode in BISign V3 filehash whitelist (resolves false signature mismatches on CBA and modern mods)\n- Stream real-time mod verification progress over WebSocket to eliminate UI freeze\n- Add live progress bar with percentage and current mod indicator in SignatureVerificationDialog\n- Fix null safety crash when PBOs have empty or null bisignFiles\n- Increase PBO reader streaming buffer to 256KB for faster hashing of large archives",
          "timestamp": "2026-10-15T20:29:21+02:00",
          "tree_id": "ed8009d3755835bcfdbb4c1fa2c3b56962c1dd2c",
          "url": "https://github.com/ramius86/btcservermanager/commit/609303fe911f8ad045ee886514d3852d121fd58e"
        },
        "date": 1792089135649,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 26338,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "45060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 26338,
            "unit": "ns/op",
            "extra": "45060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "45060 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "45060 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 24729,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "48909 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 24729,
            "unit": "ns/op",
            "extra": "48909 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "48909 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "48909 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 10.92,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 10.92,
            "unit": "ns/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 154.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7760628 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 154.6,
            "unit": "ns/op",
            "extra": "7760628 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7760628 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7760628 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 60140,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "20137 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60140,
            "unit": "ns/op",
            "extra": "20137 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "20137 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "20137 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 32394,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "36736 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 32394,
            "unit": "ns/op",
            "extra": "36736 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "36736 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "36736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 171336,
            "unit": "ns/op\t   61267 B/op\t     718 allocs/op",
            "extra": "6669 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 171336,
            "unit": "ns/op",
            "extra": "6669 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61267,
            "unit": "B/op",
            "extra": "6669 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "6669 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 2687,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "468591 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 2687,
            "unit": "ns/op",
            "extra": "468591 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "468591 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "468591 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 18823,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "63064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 18823,
            "unit": "ns/op",
            "extra": "63064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "63064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "63064 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 9022,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "132073 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 9022,
            "unit": "ns/op",
            "extra": "132073 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "132073 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "132073 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 44053,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "28534 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 44053,
            "unit": "ns/op",
            "extra": "28534 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "28534 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "28534 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 2807,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "447387 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 2807,
            "unit": "ns/op",
            "extra": "447387 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "447387 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "447387 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 13100,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "86656 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 13100,
            "unit": "ns/op",
            "extra": "86656 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "86656 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "86656 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1177,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1177,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 352.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "3391549 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 352.6,
            "unit": "ns/op",
            "extra": "3391549 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "3391549 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "3391549 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 6.148,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "195636352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 6.148,
            "unit": "ns/op",
            "extra": "195636352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "195636352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "195636352 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 14813,
            "unit": "ns/op\t    1603 B/op\t      35 allocs/op",
            "extra": "80842 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 14813,
            "unit": "ns/op",
            "extra": "80842 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1603,
            "unit": "B/op",
            "extra": "80842 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "80842 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 5388,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "218544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 5388,
            "unit": "ns/op",
            "extra": "218544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "218544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "218544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 1410,
            "unit": "ns/op\t     287 B/op\t       7 allocs/op",
            "extra": "900182 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1410,
            "unit": "ns/op",
            "extra": "900182 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 287,
            "unit": "B/op",
            "extra": "900182 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "900182 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1094,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1094,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 567.2,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "2077699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 567.2,
            "unit": "ns/op",
            "extra": "2077699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "2077699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "2077699 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 102972,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 102972,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 128.9,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "8987064 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 128.9,
            "unit": "ns/op",
            "extra": "8987064 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "8987064 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "8987064 times\n4 procs"
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
          "id": "c145ebcde5be23a18c5ee6b87b87e2b88e2f4748",
          "message": "fix(workshop): cache signature reports, avoid auto-run on dialog open, and support obfuscated PBOs\n\n- Load existing/cached verification reports on dialog open instead of auto-triggering full verification\n- Add GET /api/mod/signatures endpoint backed by in-memory report cache and DB metadata\n- Add explicit 'Re-verify All' / 'Run Verification' button for user-triggered execution\n- Support Mikero-obfuscated PBOs (e.g. PedagneMod) where whole-archive Sig1 matches but internal header tables are scrambled\n- Implement candidate key staging in auto-recovery: unverified keys are never saved to serverKeysDir or mod.BiKeys when signature verification fails (e.g. Modular Interior)\n- Add distinct UI badges and detailed error reporting when key extraction is attempted but fails due to mismatched author files",
          "timestamp": "2026-10-15T21:05:49+02:00",
          "tree_id": "306fb9eedea79091e51951e22ca7e958a94b3404",
          "url": "https://github.com/ramius86/btcservermanager/commit/c145ebcde5be23a18c5ee6b87b87e2b88e2f4748"
        },
        "date": 1792091367664,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 42148,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "27616 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 42148,
            "unit": "ns/op",
            "extra": "27616 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "27616 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "27616 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 39435,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "28713 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 39435,
            "unit": "ns/op",
            "extra": "28713 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "28713 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "28713 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.07,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "61709246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.07,
            "unit": "ns/op",
            "extra": "61709246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "61709246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "61709246 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 231.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5179081 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 231.6,
            "unit": "ns/op",
            "extra": "5179081 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5179081 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5179081 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 111844,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 111844,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
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
            "value": 60169,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19972 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60169,
            "unit": "ns/op",
            "extra": "19972 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19972 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19972 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 315603,
            "unit": "ns/op\t   61241 B/op\t     718 allocs/op",
            "extra": "3699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 315603,
            "unit": "ns/op",
            "extra": "3699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61241,
            "unit": "B/op",
            "extra": "3699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3699 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4715,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "239708 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4715,
            "unit": "ns/op",
            "extra": "239708 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "239708 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "239708 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33068,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "36134 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33068,
            "unit": "ns/op",
            "extra": "36134 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "36134 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "36134 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16595,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "74559 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16595,
            "unit": "ns/op",
            "extra": "74559 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "74559 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "74559 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 83466,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14240 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 83466,
            "unit": "ns/op",
            "extra": "14240 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14240 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14240 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5500,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "212926 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5500,
            "unit": "ns/op",
            "extra": "212926 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "212926 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "212926 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22358,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "53794 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22358,
            "unit": "ns/op",
            "extra": "53794 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "53794 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "53794 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2067,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "563476 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2067,
            "unit": "ns/op",
            "extra": "563476 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "563476 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "563476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 603.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1985320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 603.6,
            "unit": "ns/op",
            "extra": "1985320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1985320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1985320 times\n4 procs"
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
            "value": 27352,
            "unit": "ns/op\t    1612 B/op\t      35 allocs/op",
            "extra": "44149 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27352,
            "unit": "ns/op",
            "extra": "44149 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1612,
            "unit": "B/op",
            "extra": "44149 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "44149 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10067,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "117684 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10067,
            "unit": "ns/op",
            "extra": "117684 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "117684 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117684 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2841,
            "unit": "ns/op\t     280 B/op\t       7 allocs/op",
            "extra": "420948 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2841,
            "unit": "ns/op",
            "extra": "420948 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 280,
            "unit": "B/op",
            "extra": "420948 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "420948 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2075,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "558638 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2075,
            "unit": "ns/op",
            "extra": "558638 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "558638 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "558638 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1186,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1186,
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
            "value": 214979,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5541 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 214979,
            "unit": "ns/op",
            "extra": "5541 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5541 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5541 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 251,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4840314 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 251,
            "unit": "ns/op",
            "extra": "4840314 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4840314 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4840314 times\n4 procs"
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
          "id": "976285192d80309aab7466f3e1ca8bbd4f31b490",
          "message": "fix(workshop): persist signature reports to disk cache and preserve state across restarts",
          "timestamp": "2026-10-15T21:29:45+02:00",
          "tree_id": "4128611fac8f6d51bdcaacb5f098fec59be2ec93",
          "url": "https://github.com/ramius86/btcservermanager/commit/976285192d80309aab7466f3e1ca8bbd4f31b490"
        },
        "date": 1792092704607,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 44087,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "27190 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 44087,
            "unit": "ns/op",
            "extra": "27190 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "27190 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "27190 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 41619,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "28743 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 41619,
            "unit": "ns/op",
            "extra": "28743 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "28743 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "28743 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 18.7,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "63714541 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 18.7,
            "unit": "ns/op",
            "extra": "63714541 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "63714541 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "63714541 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 267.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4513053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 267.9,
            "unit": "ns/op",
            "extra": "4513053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4513053 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4513053 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 107336,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 107336,
            "unit": "ns/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
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
            "value": 57376,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20863 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 57376,
            "unit": "ns/op",
            "extra": "20863 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20863 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20863 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 304774,
            "unit": "ns/op\t   61275 B/op\t     718 allocs/op",
            "extra": "3828 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 304774,
            "unit": "ns/op",
            "extra": "3828 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61275,
            "unit": "B/op",
            "extra": "3828 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3828 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4697,
            "unit": "ns/op\t     504 B/op\t       9 allocs/op",
            "extra": "245431 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4697,
            "unit": "ns/op",
            "extra": "245431 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 504,
            "unit": "B/op",
            "extra": "245431 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "245431 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 31416,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "37875 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 31416,
            "unit": "ns/op",
            "extra": "37875 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "37875 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "37875 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15411,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "77972 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15411,
            "unit": "ns/op",
            "extra": "77972 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "77972 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "77972 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 74671,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16106 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 74671,
            "unit": "ns/op",
            "extra": "16106 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16106 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16106 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 4748,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "245185 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 4748,
            "unit": "ns/op",
            "extra": "245185 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "245185 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "245185 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 20627,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "57525 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 20627,
            "unit": "ns/op",
            "extra": "57525 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "57525 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "57525 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1861,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "628819 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1861,
            "unit": "ns/op",
            "extra": "628819 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "628819 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "628819 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 582.8,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2049388 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 582.8,
            "unit": "ns/op",
            "extra": "2049388 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2049388 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2049388 times\n4 procs"
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
            "value": 25636,
            "unit": "ns/op\t    1609 B/op\t      35 allocs/op",
            "extra": "46927 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 25636,
            "unit": "ns/op",
            "extra": "46927 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1609,
            "unit": "B/op",
            "extra": "46927 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "46927 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9681,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "122780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9681,
            "unit": "ns/op",
            "extra": "122780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "122780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "122780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2427,
            "unit": "ns/op\t     285 B/op\t       7 allocs/op",
            "extra": "471688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2427,
            "unit": "ns/op",
            "extra": "471688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 285,
            "unit": "B/op",
            "extra": "471688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "471688 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2075,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "551619 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2075,
            "unit": "ns/op",
            "extra": "551619 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "551619 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "551619 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1076,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1076,
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
            "value": 218654,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5497 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 218654,
            "unit": "ns/op",
            "extra": "5497 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5497 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5497 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 248.1,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4865690 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 248.1,
            "unit": "ns/op",
            "extra": "4865690 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4865690 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4865690 times\n4 procs"
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
          "id": "00b4cbd754832c60b02fdd503ac6869ef827a651",
          "message": "fix: harden uploads, executor queueing and signature parsing, bump Go to 1.26.10\n\nEnforce a request body limit on scenario, preset and file-manager uploads:\nhttp.MaxBytesReader now rejects oversized bodies with 413 instead of relying on\nmultipart memory caps, which could buffer arbitrary payloads in RAM.\n\nMake steamcmd Executor.Submit non-blocking. A full queue or a stopped executor\nnow fails the job and closes Done, so a caller can no longer wait forever on a\nsubmission that was never accepted.\n\nReject undersized keys in PadHash and GenerateHashes and cap .bisign signature\nreads at 1 KiB per key, so a malformed signature file cannot drive unbounded\nreads or panic the verifier.\n\nResolve the real DayZ executable in dry-run (exe, then exe_x64) and fail\nexplicitly instead of assuming a file name; run the child Wait in a goroutine\nwith kill and drain in defer so crash detection cannot hang.\n\nAcquire the Reforger scenario sync semaphore inside the goroutine, so a PUT is\nno longer held past the server write timeout, and make the installations GET\nread-only: respond first, then persist in the background with a 5 s timeout and\na single server fetch instead of one query per installation.\n\nAlign the mod metadata WebSocket event with EvtModMetadataUpdated, add migration\n041 for the foreign keys that had no index, and fix the Reforger security tab so\nthe switches drive battlEye and visible rather than disableAI and fastValidation.\n\nRaise the Go toolchain to 1.26.10 to clear GO-2026-6809 (crypto/x509) and\nrefresh backend and frontend dependencies, so govulncheck passes again in\npre-commit and CI. The hook now runs the local TypeScript compiler through node\ninstead of the nvm4w npx shim, and .gitattributes keeps it at LF.\n\nAdd tests for upload limits, queue saturation, signature parsing limits and\nexecutable resolution.",
          "timestamp": "2026-11-02T17:39:47+01:00",
          "tree_id": "1cb3c8beaa7f76e171f58006b0f40bcfe3954e5d",
          "url": "https://github.com/ramius86/btcservermanager/commit/00b4cbd754832c60b02fdd503ac6869ef827a651"
        },
        "date": 1793637691274,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 41521,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "28266 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 41521,
            "unit": "ns/op",
            "extra": "28266 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "28266 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28266 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 38676,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31168 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 38676,
            "unit": "ns/op",
            "extra": "31168 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31168 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31168 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "58814092 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.2,
            "unit": "ns/op",
            "extra": "58814092 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "58814092 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "58814092 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 244.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4894204 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 244.9,
            "unit": "ns/op",
            "extra": "4894204 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4894204 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4894204 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 115970,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10310 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 115970,
            "unit": "ns/op",
            "extra": "10310 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "10310 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "10310 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 63397,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "18838 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 63397,
            "unit": "ns/op",
            "extra": "18838 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "18838 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "18838 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 317033,
            "unit": "ns/op\t   61361 B/op\t     718 allocs/op",
            "extra": "3572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 317033,
            "unit": "ns/op",
            "extra": "3572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61361,
            "unit": "B/op",
            "extra": "3572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3572 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4899,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "230605 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4899,
            "unit": "ns/op",
            "extra": "230605 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "230605 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "230605 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 34427,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "34542 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 34427,
            "unit": "ns/op",
            "extra": "34542 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "34542 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "34542 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16707,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "72054 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16707,
            "unit": "ns/op",
            "extra": "72054 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "72054 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "72054 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 75740,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15778 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 75740,
            "unit": "ns/op",
            "extra": "15778 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15778 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15778 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5412,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "213718 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5412,
            "unit": "ns/op",
            "extra": "213718 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "213718 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "213718 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22849,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "52083 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22849,
            "unit": "ns/op",
            "extra": "52083 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "52083 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "52083 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 2004,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "597529 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 2004,
            "unit": "ns/op",
            "extra": "597529 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "597529 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "597529 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 601.6,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1992934 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 601.6,
            "unit": "ns/op",
            "extra": "1992934 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1992934 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1992934 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.65,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.65,
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
            "value": 27859,
            "unit": "ns/op\t    1594 B/op\t      35 allocs/op",
            "extra": "43969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27859,
            "unit": "ns/op",
            "extra": "43969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1594,
            "unit": "B/op",
            "extra": "43969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43969 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10004,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10004,
            "unit": "ns/op",
            "extra": "117476 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
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
            "value": 2769,
            "unit": "ns/op\t     288 B/op\t       7 allocs/op",
            "extra": "445922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2769,
            "unit": "ns/op",
            "extra": "445922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 288,
            "unit": "B/op",
            "extra": "445922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "445922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2144,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "581556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2144,
            "unit": "ns/op",
            "extra": "581556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "581556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "581556 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1185,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "952359 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1185,
            "unit": "ns/op",
            "extra": "952359 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "952359 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "952359 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 218580,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5002 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 218580,
            "unit": "ns/op",
            "extra": "5002 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5002 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5002 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 248.2,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4729442 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 248.2,
            "unit": "ns/op",
            "extra": "4729442 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4729442 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4729442 times\n4 procs"
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
          "id": "4de1acc036903edd5bab57441447ff1d67540a99",
          "message": "Merge pull request #92 from ramius86/dependabot/docker/backend/golang-1.27.3-alpine\n\nchore(deps): bump golang from 1.26.10-alpine to 1.27.3-alpine in /backend",
          "timestamp": "2026-11-02T17:48:50+01:00",
          "tree_id": "8dcc2d0ceb227c7b66ba83fb9723e2aecd49da81",
          "url": "https://github.com/ramius86/btcservermanager/commit/4de1acc036903edd5bab57441447ff1d67540a99"
        },
        "date": 1793638200508,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 27488,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "44168 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 27488,
            "unit": "ns/op",
            "extra": "44168 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "44168 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "44168 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 26075,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "46640 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 26075,
            "unit": "ns/op",
            "extra": "46640 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "46640 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "46640 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 11.3,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 11.3,
            "unit": "ns/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 160,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7226433 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 160,
            "unit": "ns/op",
            "extra": "7226433 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7226433 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7226433 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 60332,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "19818 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 60332,
            "unit": "ns/op",
            "extra": "19818 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "19818 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "19818 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 35223,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "35746 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 35223,
            "unit": "ns/op",
            "extra": "35746 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "35746 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "35746 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 174139,
            "unit": "ns/op\t   61292 B/op\t     718 allocs/op",
            "extra": "6434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 174139,
            "unit": "ns/op",
            "extra": "6434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61292,
            "unit": "B/op",
            "extra": "6434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "6434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 2623,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "435576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 2623,
            "unit": "ns/op",
            "extra": "435576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "435576 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "435576 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 18777,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "62323 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 18777,
            "unit": "ns/op",
            "extra": "62323 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "62323 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "62323 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 9080,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "132908 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 9080,
            "unit": "ns/op",
            "extra": "132908 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "132908 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "132908 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 42354,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "28198 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 42354,
            "unit": "ns/op",
            "extra": "28198 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "28198 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "28198 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 2774,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "428929 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 2774,
            "unit": "ns/op",
            "extra": "428929 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "428929 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "428929 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 12947,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "92018 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 12947,
            "unit": "ns/op",
            "extra": "92018 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "92018 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "92018 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1190,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1190,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 334.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "3557830 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 334.9,
            "unit": "ns/op",
            "extra": "3557830 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "3557830 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "3557830 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 6.021,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "200753473 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 6.021,
            "unit": "ns/op",
            "extra": "200753473 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "200753473 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "200753473 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 15797,
            "unit": "ns/op\t    1610 B/op\t      35 allocs/op",
            "extra": "78736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 15797,
            "unit": "ns/op",
            "extra": "78736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1610,
            "unit": "B/op",
            "extra": "78736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "78736 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 5631,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "206922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 5631,
            "unit": "ns/op",
            "extra": "206922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "206922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "206922 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 1512,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "801392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1512,
            "unit": "ns/op",
            "extra": "801392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "801392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "801392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1153,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1153,
            "unit": "ns/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 615,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1949391 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 615,
            "unit": "ns/op",
            "extra": "1949391 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "1949391 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1949391 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 105569,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "9727 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 105569,
            "unit": "ns/op",
            "extra": "9727 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "9727 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "9727 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 131.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "8797992 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 131.4,
            "unit": "ns/op",
            "extra": "8797992 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "8797992 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "8797992 times\n4 procs"
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
          "id": "da208a186a940231cdea7c1d5fa6486b36a3876f",
          "message": "fix: render configs before saving and write them atomically\n\nServer configs were written straight to their final path after the database\nrow had already been updated, so a failed template or an interrupted write\nleft a truncated file that stopped the server from starting. Configs are now\nrendered with Prepare, saved, then materialised with Commit through a\ntemp-file-plus-rename helper, and the File Manager, custom names and scenario\nhandlers use the same path.\n\nAlso close the smaller holes from the audit: DELETE /api/logs/all requires an\nexplicit type, decodeServer rejects unknown fields, custom names reads a\nbounded body, and the log viewer parses file names, paging offsets and\ninstall status through shared helpers, so experimental DayZ logs stay live,\nstreamed lines no longer corrupt the paging offset and a failed installation\nstops looking active. Those helpers ship with Vitest, wired into CI and the\npre-commit hook.",
          "timestamp": "2026-11-02T18:01:58+01:00",
          "tree_id": "1ed4701b5b3a89cc336750e2b7ce24c1a0e60119",
          "url": "https://github.com/ramius86/btcservermanager/commit/da208a186a940231cdea7c1d5fa6486b36a3876f"
        },
        "date": 1793639011406,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40898,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "28405 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40898,
            "unit": "ns/op",
            "extra": "28405 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "28405 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "28405 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 37876,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31590 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 37876,
            "unit": "ns/op",
            "extra": "31590 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31590 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31590 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.06,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "60480624 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.06,
            "unit": "ns/op",
            "extra": "60480624 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "60480624 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "60480624 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 288.5,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4161086 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 288.5,
            "unit": "ns/op",
            "extra": "4161086 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4161086 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4161086 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112715,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "9127 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112715,
            "unit": "ns/op",
            "extra": "9127 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "9127 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "9127 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 61036,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19683 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 61036,
            "unit": "ns/op",
            "extra": "19683 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19683 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19683 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 306898,
            "unit": "ns/op\t   61337 B/op\t     718 allocs/op",
            "extra": "3624 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 306898,
            "unit": "ns/op",
            "extra": "3624 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61337,
            "unit": "B/op",
            "extra": "3624 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3624 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4692,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "247994 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4692,
            "unit": "ns/op",
            "extra": "247994 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "247994 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "247994 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33155,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "35325 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33155,
            "unit": "ns/op",
            "extra": "35325 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "35325 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35325 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16431,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "73947 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16431,
            "unit": "ns/op",
            "extra": "73947 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "73947 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "73947 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 80994,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "14880 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 80994,
            "unit": "ns/op",
            "extra": "14880 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "14880 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "14880 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5144,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "228201 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5144,
            "unit": "ns/op",
            "extra": "228201 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "228201 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "228201 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 22348,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "54742 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 22348,
            "unit": "ns/op",
            "extra": "54742 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "54742 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "54742 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1940,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "627642 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1940,
            "unit": "ns/op",
            "extra": "627642 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "627642 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "627642 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 597.8,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2003392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 597.8,
            "unit": "ns/op",
            "extra": "2003392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2003392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2003392 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.67,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.67,
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
            "value": 27267,
            "unit": "ns/op\t    1600 B/op\t      35 allocs/op",
            "extra": "43599 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27267,
            "unit": "ns/op",
            "extra": "43599 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1600,
            "unit": "B/op",
            "extra": "43599 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43599 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9975,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9975,
            "unit": "ns/op",
            "extra": "117264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2761,
            "unit": "ns/op\t     289 B/op\t       7 allocs/op",
            "extra": "446838 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2761,
            "unit": "ns/op",
            "extra": "446838 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 289,
            "unit": "B/op",
            "extra": "446838 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "446838 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2062,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "598651 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2062,
            "unit": "ns/op",
            "extra": "598651 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "598651 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "598651 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1185,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "1000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1185,
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
            "value": 213951,
            "unit": "ns/op\t   24002 B/op\t    1000 allocs/op",
            "extra": "5152 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 213951,
            "unit": "ns/op",
            "extra": "5152 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24002,
            "unit": "B/op",
            "extra": "5152 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5152 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 243.3,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4913274 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 243.3,
            "unit": "ns/op",
            "extra": "4913274 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4913274 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4913274 times\n4 procs"
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
          "id": "b0058f72b556dc362df962ca53f266f4fe2171a8",
          "message": "fix: tighten preset handling, mod updates and log truncation reporting\n\nMod preset import/export only understands the Arma 3 Launcher HTML format, so a\nnon-Arma 3 serverType is now refused instead of filing Workshop ids into another\ngame's catalogue; partial preset updates keep name and type, and the export\nbutton is hidden for non-Arma 3 presets.\n\n\"Update all mods\" re-downloads only the mods flagged by the metadata check\ninstead of the whole catalogue, non-.pbo scenario uploads are rejected, and\nterminal install statuses (including ERROR) clear the in-progress state\neverywhere.\n\nLog reads report a truncated window so the viewer stops paging instead of\npresenting a partial file, .bikey files and the signature cache are written\natomically, and SECRET_KEY placeholders or keys shorter than 32 characters are\nrefused rather than encrypting Steam credentials.",
          "timestamp": "2026-11-02T18:20:51+01:00",
          "tree_id": "04307e26fde59a9a1ddd01739285896a82f1cf31",
          "url": "https://github.com/ramius86/btcservermanager/commit/b0058f72b556dc362df962ca53f266f4fe2171a8"
        },
        "date": 1793640139963,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 33724,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "36361 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 33724,
            "unit": "ns/op",
            "extra": "36361 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "36361 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "36361 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 34703,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "34617 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 34703,
            "unit": "ns/op",
            "extra": "34617 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "34617 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "34617 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 16.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "73613014 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 16.8,
            "unit": "ns/op",
            "extra": "73613014 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "73613014 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "73613014 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 240.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4732804 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 240.2,
            "unit": "ns/op",
            "extra": "4732804 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4732804 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4732804 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 96712,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "12295 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 96712,
            "unit": "ns/op",
            "extra": "12295 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "12295 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "12295 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 55808,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "21470 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 55808,
            "unit": "ns/op",
            "extra": "21470 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "21470 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "21470 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 252114,
            "unit": "ns/op\t   61296 B/op\t     718 allocs/op",
            "extra": "4318 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 252114,
            "unit": "ns/op",
            "extra": "4318 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61296,
            "unit": "B/op",
            "extra": "4318 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "4318 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 3949,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "299306 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 3949,
            "unit": "ns/op",
            "extra": "299306 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "299306 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "299306 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 26707,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "44872 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 26707,
            "unit": "ns/op",
            "extra": "44872 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "44872 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "44872 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 13224,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "96679 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 13224,
            "unit": "ns/op",
            "extra": "96679 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "96679 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "96679 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 72724,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16864 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 72724,
            "unit": "ns/op",
            "extra": "16864 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16864 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16864 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3897,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "284150 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3897,
            "unit": "ns/op",
            "extra": "284150 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "284150 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "284150 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 17609,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "69189 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 17609,
            "unit": "ns/op",
            "extra": "69189 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "69189 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "69189 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1734,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "632190 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1734,
            "unit": "ns/op",
            "extra": "632190 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "632190 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "632190 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 500.7,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2424544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 500.7,
            "unit": "ns/op",
            "extra": "2424544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2424544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2424544 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 9.242,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "130067444 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 9.242,
            "unit": "ns/op",
            "extra": "130067444 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "130067444 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "130067444 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 25288,
            "unit": "ns/op\t    1614 B/op\t      35 allocs/op",
            "extra": "45082 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 25288,
            "unit": "ns/op",
            "extra": "45082 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1614,
            "unit": "B/op",
            "extra": "45082 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "45082 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9401,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "126796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9401,
            "unit": "ns/op",
            "extra": "126796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "126796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "126796 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2409,
            "unit": "ns/op\t     283 B/op\t       7 allocs/op",
            "extra": "504868 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2409,
            "unit": "ns/op",
            "extra": "504868 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 283,
            "unit": "B/op",
            "extra": "504868 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "504868 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1660,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "754978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1660,
            "unit": "ns/op",
            "extra": "754978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "754978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "754978 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 925.7,
            "unit": "ns/op\t     281 B/op\t       7 allocs/op",
            "extra": "1289434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 925.7,
            "unit": "ns/op",
            "extra": "1289434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 281,
            "unit": "B/op",
            "extra": "1289434 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1289434 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 185633,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5708 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 185633,
            "unit": "ns/op",
            "extra": "5708 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5708 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5708 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 244.2,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4858989 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 244.2,
            "unit": "ns/op",
            "extra": "4858989 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4858989 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4858989 times\n4 procs"
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
          "id": "3ee73d7f16a0e83810d5ebe4481c136c0f4c0270",
          "message": "fix: stop answering success when a backend step failed\n\nErrors that were logged and dropped now abort the operation instead of\nreturning 200: a failed server query no longer skips the \"no configurations\nexist\" check before uninstalling, launch parameters and Reforger admins are\nnever served empty (a following save would have overwritten them), bulk mod\ndeletes and metadata fetches report the mods they could not handle, and a zip\nstream without every entry is left without its central directory so the client\nsees a broken download instead of a short one.\n\nBikey synchronisation now copies the new keys before removing the old ones and\nwrites them atomically, so an interrupted install leaves the previous key in\nplace instead of a mod marked FINISHED with no key in the server folder.\n\nThe server status endpoint answers with one shape for both states (alive flag\nincluded), start and restart keep a bounded deadline detached from the request,\nand internal failures log the detail while the response says only that\nsomething failed.",
          "timestamp": "2026-11-02T18:44:28+01:00",
          "tree_id": "8a0e440fb375941ef1909122b9a439c9358692cb",
          "url": "https://github.com/ramius86/btcservermanager/commit/3ee73d7f16a0e83810d5ebe4481c136c0f4c0270"
        },
        "date": 1793641558750,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 36308,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "32884 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 36308,
            "unit": "ns/op",
            "extra": "32884 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "32884 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "32884 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 34195,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "34944 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 34195,
            "unit": "ns/op",
            "extra": "34944 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "34944 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "34944 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 16.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "73147136 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 16.8,
            "unit": "ns/op",
            "extra": "73147136 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "73147136 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "73147136 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 229.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5292114 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 229.6,
            "unit": "ns/op",
            "extra": "5292114 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5292114 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5292114 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 103259,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "10000 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 103259,
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
            "value": 59534,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20265 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 59534,
            "unit": "ns/op",
            "extra": "20265 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20265 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20265 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 276654,
            "unit": "ns/op\t   61343 B/op\t     718 allocs/op",
            "extra": "4112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 276654,
            "unit": "ns/op",
            "extra": "4112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61343,
            "unit": "B/op",
            "extra": "4112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "4112 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4130,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "260104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4130,
            "unit": "ns/op",
            "extra": "260104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "260104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "260104 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 28606,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "41370 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 28606,
            "unit": "ns/op",
            "extra": "41370 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "41370 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "41370 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 14333,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "85658 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 14333,
            "unit": "ns/op",
            "extra": "85658 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "85658 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "85658 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 76913,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15478 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 76913,
            "unit": "ns/op",
            "extra": "15478 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15478 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15478 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 4173,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "280836 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 4173,
            "unit": "ns/op",
            "extra": "280836 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "280836 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "280836 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 19454,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "59983 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 19454,
            "unit": "ns/op",
            "extra": "59983 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "59983 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "59983 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1964,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "613706 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1964,
            "unit": "ns/op",
            "extra": "613706 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "613706 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "613706 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 568.9,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2117419 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 568.9,
            "unit": "ns/op",
            "extra": "2117419 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2117419 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2117419 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 9.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "121533448 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 9.9,
            "unit": "ns/op",
            "extra": "121533448 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "121533448 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "121533448 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 27154,
            "unit": "ns/op\t    1597 B/op\t      35 allocs/op",
            "extra": "41888 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 27154,
            "unit": "ns/op",
            "extra": "41888 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1597,
            "unit": "B/op",
            "extra": "41888 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "41888 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10046,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "117944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10046,
            "unit": "ns/op",
            "extra": "117944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "117944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "117944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2536,
            "unit": "ns/op\t     284 B/op\t       7 allocs/op",
            "extra": "491883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2536,
            "unit": "ns/op",
            "extra": "491883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 284,
            "unit": "B/op",
            "extra": "491883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "491883 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1788,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "664293 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1788,
            "unit": "ns/op",
            "extra": "664293 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "664293 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "664293 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 973.2,
            "unit": "ns/op\t     283 B/op\t       7 allocs/op",
            "extra": "1233712 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 973.2,
            "unit": "ns/op",
            "extra": "1233712 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 283,
            "unit": "B/op",
            "extra": "1233712 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1233712 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 206946,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5239 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 206946,
            "unit": "ns/op",
            "extra": "5239 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "5239 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5239 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 265.8,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4516335 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 265.8,
            "unit": "ns/op",
            "extra": "4516335 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4516335 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4516335 times\n4 procs"
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
          "id": "e1887823553d35cf754a1783f3044d27b94243e1",
          "message": "fix: keep websocket state and log reads coherent under load\n\nA full outbound buffer now evicts a stale event instead of disconnecting the\nclient, an initial snapshot is dropped when a live event for the same domain\nalready arrived, and GetActiveLogFiles reads instance info under the process\nlock",
          "timestamp": "2026-11-02T19:22:20+01:00",
          "tree_id": "8a15f75f7a0f5ecbdf1740419aac7144630d9835",
          "url": "https://github.com/ramius86/btcservermanager/commit/e1887823553d35cf754a1783f3044d27b94243e1"
        },
        "date": 1793643881067,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 34435,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "34239 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 34435,
            "unit": "ns/op",
            "extra": "34239 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "34239 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "34239 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 32822,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "36894 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 32822,
            "unit": "ns/op",
            "extra": "36894 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "36894 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "36894 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 14.35,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "77336877 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 14.35,
            "unit": "ns/op",
            "extra": "77336877 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "77336877 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "77336877 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 210.9,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5802466 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 210.9,
            "unit": "ns/op",
            "extra": "5802466 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5802466 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5802466 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 82855,
            "unit": "ns/op\t   63936 B/op\t     948 allocs/op",
            "extra": "14414 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 82855,
            "unit": "ns/op",
            "extra": "14414 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63936,
            "unit": "B/op",
            "extra": "14414 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "14414 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 44697,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "26893 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 44697,
            "unit": "ns/op",
            "extra": "26893 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "26893 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "26893 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 237269,
            "unit": "ns/op\t   61276 B/op\t     718 allocs/op",
            "extra": "4582 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 237269,
            "unit": "ns/op",
            "extra": "4582 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61276,
            "unit": "B/op",
            "extra": "4582 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "4582 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 3642,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "318104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 3642,
            "unit": "ns/op",
            "extra": "318104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "318104 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "318104 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 24446,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "48111 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 24446,
            "unit": "ns/op",
            "extra": "48111 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "48111 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "48111 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 11873,
            "unit": "ns/op\t    4497 B/op\t      81 allocs/op",
            "extra": "99722 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 11873,
            "unit": "ns/op",
            "extra": "99722 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4497,
            "unit": "B/op",
            "extra": "99722 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "99722 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 64771,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "20902 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 64771,
            "unit": "ns/op",
            "extra": "20902 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "20902 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "20902 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 3732,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "299672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 3732,
            "unit": "ns/op",
            "extra": "299672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "299672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "299672 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 16102,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "74055 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 16102,
            "unit": "ns/op",
            "extra": "74055 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "74055 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "74055 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1433,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "826714 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1433,
            "unit": "ns/op",
            "extra": "826714 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "826714 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "826714 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 445,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2670957 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 445,
            "unit": "ns/op",
            "extra": "2670957 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2670957 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2670957 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 8.603,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "138646294 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 8.603,
            "unit": "ns/op",
            "extra": "138646294 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "138646294 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "138646294 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 20642,
            "unit": "ns/op\t    1613 B/op\t      35 allocs/op",
            "extra": "57754 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 20642,
            "unit": "ns/op",
            "extra": "57754 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1613,
            "unit": "B/op",
            "extra": "57754 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "57754 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 7659,
            "unit": "ns/op\t     353 B/op\t       7 allocs/op",
            "extra": "156018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 7659,
            "unit": "ns/op",
            "extra": "156018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 353,
            "unit": "B/op",
            "extra": "156018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "156018 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2002,
            "unit": "ns/op\t     283 B/op\t       7 allocs/op",
            "extra": "627061 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2002,
            "unit": "ns/op",
            "extra": "627061 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 283,
            "unit": "B/op",
            "extra": "627061 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "627061 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 1632,
            "unit": "ns/op\t     336 B/op\t       7 allocs/op",
            "extra": "713614 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1632,
            "unit": "ns/op",
            "extra": "713614 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 336,
            "unit": "B/op",
            "extra": "713614 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "713614 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 799.1,
            "unit": "ns/op\t     283 B/op\t       7 allocs/op",
            "extra": "1514803 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 799.1,
            "unit": "ns/op",
            "extra": "1514803 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 283,
            "unit": "B/op",
            "extra": "1514803 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1514803 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 167295,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 167295,
            "unit": "ns/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24000,
            "unit": "B/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "6505 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 193,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "6234699 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 193,
            "unit": "ns/op",
            "extra": "6234699 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "6234699 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "6234699 times\n4 procs"
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
          "id": "982ecdfff5046ef2f8765eb6bb6471ef8939a315",
          "message": "fix: stop silently losing settings, log lines and config state\n\nA partial settings PUT decoded a missing qualificationNames as an empty\nlist and deleted every member qualification, dropped log lines vanished\nwithout a trace, and a config that was never generated was rendered as\nfile content. SteamCMD also no longer retries deterministic failures ten\ntimes, no longer probes login without a deadline, and fsyncs once per\nsecond instead of once per output line.",
          "timestamp": "2026-11-02T20:22:34+01:00",
          "tree_id": "15cac40231e46856701d2c2a4ea923e07edf9ea6",
          "url": "https://github.com/ramius86/btcservermanager/commit/982ecdfff5046ef2f8765eb6bb6471ef8939a315"
        },
        "date": 1793647790026,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 40414,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "29620 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 40414,
            "unit": "ns/op",
            "extra": "29620 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "29620 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "29620 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 37892,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "31632 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 37892,
            "unit": "ns/op",
            "extra": "31632 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "31632 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "31632 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 19.71,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "59408401 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 19.71,
            "unit": "ns/op",
            "extra": "59408401 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "59408401 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "59408401 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 289.6,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4150274 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 289.6,
            "unit": "ns/op",
            "extra": "4150274 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4150274 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4150274 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 112280,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "10674 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 112280,
            "unit": "ns/op",
            "extra": "10674 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "10674 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "10674 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 65737,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "19155 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 65737,
            "unit": "ns/op",
            "extra": "19155 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "19155 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "19155 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 303865,
            "unit": "ns/op\t   61286 B/op\t     718 allocs/op",
            "extra": "3612 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 303865,
            "unit": "ns/op",
            "extra": "3612 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61286,
            "unit": "B/op",
            "extra": "3612 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3612 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4680,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "246006 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4680,
            "unit": "ns/op",
            "extra": "246006 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "246006 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "246006 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 33314,
            "unit": "ns/op\t    6370 B/op\t      85 allocs/op",
            "extra": "35841 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 33314,
            "unit": "ns/op",
            "extra": "35841 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6370,
            "unit": "B/op",
            "extra": "35841 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "35841 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 16470,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "69378 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 16470,
            "unit": "ns/op",
            "extra": "69378 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "69378 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "69378 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 75432,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "15868 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 75432,
            "unit": "ns/op",
            "extra": "15868 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "15868 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "15868 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 5096,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "223065 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 5096,
            "unit": "ns/op",
            "extra": "223065 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "223065 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "223065 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 21732,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "55066 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 21732,
            "unit": "ns/op",
            "extra": "55066 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "55066 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "55066 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1977,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "587431 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1977,
            "unit": "ns/op",
            "extra": "587431 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "587431 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "587431 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 633.5,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "1946457 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 633.5,
            "unit": "ns/op",
            "extra": "1946457 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "1946457 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "1946457 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.65,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.65,
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
            "value": 26962,
            "unit": "ns/op\t    1596 B/op\t      35 allocs/op",
            "extra": "43882 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26962,
            "unit": "ns/op",
            "extra": "43882 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1596,
            "unit": "B/op",
            "extra": "43882 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "43882 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 10012,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "119450 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 10012,
            "unit": "ns/op",
            "extra": "119450 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "119450 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "119450 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2733,
            "unit": "ns/op\t     287 B/op\t       7 allocs/op",
            "extra": "453264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2733,
            "unit": "ns/op",
            "extra": "453264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 287,
            "unit": "B/op",
            "extra": "453264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "453264 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2044,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "596320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2044,
            "unit": "ns/op",
            "extra": "596320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "596320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "596320 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1122,
            "unit": "ns/op\t     282 B/op\t       7 allocs/op",
            "extra": "999079 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1122,
            "unit": "ns/op",
            "extra": "999079 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 282,
            "unit": "B/op",
            "extra": "999079 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "999079 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 210244,
            "unit": "ns/op\t   24001 B/op\t    1000 allocs/op",
            "extra": "5281 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 210244,
            "unit": "ns/op",
            "extra": "5281 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - B/op",
            "value": 24001,
            "unit": "B/op",
            "extra": "5281 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1000,
            "unit": "allocs/op",
            "extra": "5281 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop)",
            "value": 247.8,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4812657 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 247.8,
            "unit": "ns/op",
            "extra": "4812657 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4812657 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4812657 times\n4 procs"
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
          "id": "ed0f137888ef1d57191c274e308673e7beef5b93",
          "message": "fix: stop serialising server starts and swallowing mod sync failures\n\nStarting a server held a global lock for the whole spawn path, so a slow start blocked every other one and a cancelled request kept a goroutine queued on Lock(); the lock now covers only the duplicate/port decision, with an in-flight reservation so concurrent starts still cannot double-start or claim the same ports. UpdateAllMods refreshed metadata serially and discarded each error, so callers always saw success; it now runs four refreshes in flight and returns an aggregated ModUpdateError that the endpoint reports as {queued, failed, total}.",
          "timestamp": "2026-11-02T20:48:49+01:00",
          "tree_id": "9a8809bb3256b8085fe9a0fd3d1c6a98efc8ae42",
          "url": "https://github.com/ramius86/btcservermanager/commit/ed0f137888ef1d57191c274e308673e7beef5b93"
        },
        "date": 1793649153131,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api)",
            "value": 44167,
            "unit": "ns/op\t    4384 B/op\t      66 allocs/op",
            "extra": "27072 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - ns/op",
            "value": 44167,
            "unit": "ns/op",
            "extra": "27072 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - B/op",
            "value": 4384,
            "unit": "B/op",
            "extra": "27072 times\n4 procs"
          },
          {
            "name": "BenchmarkCFAccessMiddleware (btcservermanager/internal/api) - allocs/op",
            "value": 66,
            "unit": "allocs/op",
            "extra": "27072 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api)",
            "value": 42065,
            "unit": "ns/op\t    3592 B/op\t      49 allocs/op",
            "extra": "28774 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - ns/op",
            "value": 42065,
            "unit": "ns/op",
            "extra": "28774 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - B/op",
            "value": 3592,
            "unit": "B/op",
            "extra": "28774 times\n4 procs"
          },
          {
            "name": "BenchmarkJWTParsingOnly (btcservermanager/internal/api) - allocs/op",
            "value": 49,
            "unit": "allocs/op",
            "extra": "28774 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws)",
            "value": 18.35,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "63335486 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - ns/op",
            "value": 18.35,
            "unit": "ns/op",
            "extra": "63335486 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "63335486 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_Match (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "63335486 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws)",
            "value": 269.1,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "4493868 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - ns/op",
            "value": 269.1,
            "unit": "ns/op",
            "extra": "4493868 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "4493868 times\n4 procs"
          },
          {
            "name": "BenchmarkHub_BroadcastSmall (btcservermanager/internal/api/ws) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "4493868 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset)",
            "value": 105881,
            "unit": "ns/op\t   63937 B/op\t     948 allocs/op",
            "extra": "11305 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 105881,
            "unit": "ns/op",
            "extra": "11305 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 63937,
            "unit": "B/op",
            "extra": "11305 times\n4 procs"
          },
          {
            "name": "BenchmarkModPresetExtractor (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 948,
            "unit": "allocs/op",
            "extra": "11305 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset)",
            "value": 57381,
            "unit": "ns/op\t   58040 B/op\t     408 allocs/op",
            "extra": "20758 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - ns/op",
            "value": 57381,
            "unit": "ns/op",
            "extra": "20758 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - B/op",
            "value": 58040,
            "unit": "B/op",
            "extra": "20758 times\n4 procs"
          },
          {
            "name": "BenchmarkModPreset_ExtractOnly (btcservermanager/internal/domain/modpreset) - allocs/op",
            "value": 408,
            "unit": "allocs/op",
            "extra": "20758 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario)",
            "value": 297353,
            "unit": "ns/op\t   61293 B/op\t     718 allocs/op",
            "extra": "3673 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 297353,
            "unit": "ns/op",
            "extra": "3673 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - B/op",
            "value": 61293,
            "unit": "B/op",
            "extra": "3673 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerOutput (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 718,
            "unit": "allocs/op",
            "extra": "3673 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario)",
            "value": 4646,
            "unit": "ns/op\t     505 B/op\t       9 allocs/op",
            "extra": "246093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - ns/op",
            "value": 4646,
            "unit": "ns/op",
            "extra": "246093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - B/op",
            "value": 505,
            "unit": "B/op",
            "extra": "246093 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerLine (btcservermanager/internal/domain/scenario) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "246093 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server)",
            "value": 31515,
            "unit": "ns/op\t    6371 B/op\t      85 allocs/op",
            "extra": "37592 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - ns/op",
            "value": 31515,
            "unit": "ns/op",
            "extra": "37592 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - B/op",
            "value": 6371,
            "unit": "B/op",
            "extra": "37592 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_Execute (btcservermanager/internal/domain/server) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "37592 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server)",
            "value": 15230,
            "unit": "ns/op\t    4498 B/op\t      81 allocs/op",
            "extra": "78160 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - ns/op",
            "value": 15230,
            "unit": "ns/op",
            "extra": "78160 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - B/op",
            "value": 4498,
            "unit": "B/op",
            "extra": "78160 times\n4 procs"
          },
          {
            "name": "BenchmarkConfigGenerator_GenerateReforger (btcservermanager/internal/domain/server) - allocs/op",
            "value": 81,
            "unit": "allocs/op",
            "extra": "78160 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server)",
            "value": 74138,
            "unit": "ns/op\t  332152 B/op\t       8 allocs/op",
            "extra": "16371 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - ns/op",
            "value": 74138,
            "unit": "ns/op",
            "extra": "16371 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - B/op",
            "value": 332152,
            "unit": "B/op",
            "extra": "16371 times\n4 procs"
          },
          {
            "name": "BenchmarkGetLinesFromEnd (btcservermanager/internal/domain/server) - allocs/op",
            "value": 8,
            "unit": "allocs/op",
            "extra": "16371 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server)",
            "value": 4745,
            "unit": "ns/op\t    3072 B/op\t       1 allocs/op",
            "extra": "249117 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 4745,
            "unit": "ns/op",
            "extra": "249117 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - B/op",
            "value": 3072,
            "unit": "B/op",
            "extra": "249117 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Marshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "249117 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server)",
            "value": 20909,
            "unit": "ns/op\t    1424 B/op\t      12 allocs/op",
            "extra": "56955 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - ns/op",
            "value": 20909,
            "unit": "ns/op",
            "extra": "56955 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - B/op",
            "value": 1424,
            "unit": "B/op",
            "extra": "56955 times\n4 procs"
          },
          {
            "name": "BenchmarkServerJSON_Unmarshal (btcservermanager/internal/domain/server) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "56955 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server)",
            "value": 1842,
            "unit": "ns/op\t    1608 B/op\t      33 allocs/op",
            "extra": "660248 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - ns/op",
            "value": 1842,
            "unit": "ns/op",
            "extra": "660248 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - B/op",
            "value": 1608,
            "unit": "B/op",
            "extra": "660248 times\n4 procs"
          },
          {
            "name": "BenchmarkPBOWriter (btcservermanager/internal/domain/server) - allocs/op",
            "value": 33,
            "unit": "allocs/op",
            "extra": "660248 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server)",
            "value": 573.5,
            "unit": "ns/op\t      48 B/op\t       1 allocs/op",
            "extra": "2111307 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 573.5,
            "unit": "ns/op",
            "extra": "2111307 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - B/op",
            "value": 48,
            "unit": "B/op",
            "extra": "2111307 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine (btcservermanager/internal/domain/server) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2111307 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server)",
            "value": 10.95,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "100000000 times\n4 procs"
          },
          {
            "name": "BenchmarkParseReforgerStatLine_IgnoredLine (btcservermanager/internal/domain/server) - ns/op",
            "value": 10.95,
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
            "value": 26460,
            "unit": "ns/op\t    1611 B/op\t      35 allocs/op",
            "extra": "45577 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 26460,
            "unit": "ns/op",
            "extra": "45577 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 1611,
            "unit": "B/op",
            "extra": "45577 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 35,
            "unit": "allocs/op",
            "extra": "45577 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd)",
            "value": 9856,
            "unit": "ns/op\t     352 B/op\t       7 allocs/op",
            "extra": "121785 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 9856,
            "unit": "ns/op",
            "extra": "121785 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 352,
            "unit": "B/op",
            "extra": "121785 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/AppProgress (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "121785 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd)",
            "value": 2567,
            "unit": "ns/op\t     285 B/op\t       7 allocs/op",
            "extra": "474780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2567,
            "unit": "ns/op",
            "extra": "474780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 285,
            "unit": "B/op",
            "extra": "474780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModSuccess (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "474780 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd)",
            "value": 2077,
            "unit": "ns/op\t     337 B/op\t       7 allocs/op",
            "extra": "584932 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 2077,
            "unit": "ns/op",
            "extra": "584932 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 337,
            "unit": "B/op",
            "extra": "584932 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/SelfUpdate (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "584932 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd)",
            "value": 1063,
            "unit": "ns/op\t     286 B/op\t       7 allocs/op",
            "extra": "1146066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - ns/op",
            "value": 1063,
            "unit": "ns/op",
            "extra": "1146066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - B/op",
            "value": 286,
            "unit": "B/op",
            "extra": "1146066 times\n4 procs"
          },
          {
            "name": "BenchmarkParseProgress_Table/ModError (btcservermanager/internal/domain/steamcmd) - allocs/op",
            "value": 7,
            "unit": "allocs/op",
            "extra": "1146066 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop)",
            "value": 224315,
            "unit": "ns/op\t   24000 B/op\t    1000 allocs/op",
            "extra": "5042 times\n4 procs"
          },
          {
            "name": "BenchmarkDirectoryToLowercase_Dry (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 224315,
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
            "value": 266.4,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "4514232 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - ns/op",
            "value": 266.4,
            "unit": "ns/op",
            "extra": "4514232 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "4514232 times\n4 procs"
          },
          {
            "name": "BenchmarkPathNormalization (btcservermanager/internal/domain/workshop) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "4514232 times\n4 procs"
          }
        ]
      }
    ]
  }
}