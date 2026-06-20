package api

const errInvalidServerID = "invalid server ID"

/*
This is the index/hub file for Server-related API handlers.
To improve maintainability, the handlers have been split into multiple files based on their responsibility:

1. servers_crud.go:
   - Handles Create, Read, Update, Delete (CRUD) operations for server configurations.
   - Contains the JSON decoding logic (decodeServer) for polymorphic server types.

2. servers_lifecycle.go:
   - Handles process management: Start, Stop, Restart.
   - Handles status monitoring and automatic restart settings.

3. servers_install.go:
   - Handles SteamCMD installations, game updates, and branch management.
   - Handles version detection and progress reporting.

When adding new server-related endpoints, please place them in the file that best matches
their functional responsibility.
*/
