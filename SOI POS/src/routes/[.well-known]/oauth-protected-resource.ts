// MCP route for the SOI POS server (see src/lib/mcp). Originally emitted by the
// @lovable.dev/mcp-js Vite plugin; now maintained by hand since that plugin is no longer used.
// route: /.well-known/oauth-protected-resource

import { createFileRoute } from "@tanstack/react-router";

import { createTanStackOAuthProtectedResourceMetadataHandler } from "@lovable.dev/mcp-js/stacks/tanstack";

import mcp from "../../lib/mcp/index";

export const Route = createFileRoute("/.well-known/oauth-protected-resource")({
  server: {
    handlers: {
      ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true }),
    },
  },
});
