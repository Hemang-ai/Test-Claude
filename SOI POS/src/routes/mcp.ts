// MCP route for the SOI POS server (see src/lib/mcp). Originally emitted by the
// @lovable.dev/mcp-js Vite plugin; now maintained by hand since that plugin is no longer used.
// route: /mcp

import { createFileRoute } from "@tanstack/react-router";

import { createTanStackMcpHandler } from "@lovable.dev/mcp-js/stacks/tanstack";

import mcp from "../lib/mcp/index";

export const Route = createFileRoute("/mcp")({
  server: {
    handlers: {
      ANY: createTanStackMcpHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true }),
    },
  },
});
