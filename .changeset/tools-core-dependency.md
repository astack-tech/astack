---
'@astack-tech/tools': minor
---

`@astack-tech/tools` now declares its dependency on `@astack-tech/core`. MCP tools take a typed `MCPClient`, and client errors are wrapped as `MCP call failed: ...` with the original error as `cause`. Node.js 20 or later is required.
