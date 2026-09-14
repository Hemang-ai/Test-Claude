// MCP route for the SOI POS server (see src/lib/mcp). Originally emitted by the
// @lovable.dev/mcp-js Vite plugin; now maintained by hand since that plugin is no longer used.
// route: /.mcp/invoke-tool/$tool

import { createFileRoute } from "@tanstack/react-router";

import { createTanStackInvokeToolHandler } from "@lovable.dev/mcp-js/stacks/tanstack";

import mcp from "../../../lib/mcp/index";

export const Route = createFileRoute("/.mcp/invoke-tool/$tool")({
  server: {
    handlers: {
      // ANY: TanStack returns SPA HTML for methods not in `handlers`; the SDK 405s instead.
      ANY: createTanStackInvokeToolHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true }),
    },
  },
});
