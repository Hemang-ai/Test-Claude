// Standalone Vite config for the SOI POS app.
//
// This used to be `defineConfig` from `@lovable.dev/vite-tanstack-config`, a
// wrapper that composed the plugins below and added Lovable sandbox-only
// behaviour (preview asset proxy, HMR gate, dev-server bridge, devtools).
// Everything the app actually needs is now declared explicitly here, so the
// project builds and runs anywhere without Lovable's tooling or registry.
import {
  defineConfig,
  loadEnv,
  mergeConfig,
  type Plugin,
  type PluginOption,
  type UserConfig,
} from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

/**
 * Lovable Cloud injected server-side secrets (SESSION_SECRET, SITE_PASSWORD,
 * SUPABASE_SERVICE_ROLE_KEY, WEBSITE_BOOKING_SECRET, SUPABASE_URL, ...) straight
 * into the runtime. Outside Lovable the dev server reads them from `.env` /
 * `.env.local` instead. Vite only exposes `VITE_*` keys to the client bundle;
 * the non-prefixed keys are copied onto `process.env` for server functions.
 * Existing shell variables always win. Never do this for the client bundle.
 */
function serverEnvFromDotenv(mode: string): Plugin {
  return {
    name: "soi:server-env-from-dotenv",
    apply: "serve",
    config() {
      const loaded = loadEnv(mode, process.cwd(), "");
      for (const [key, value] of Object.entries(loaded)) {
        if (key.startsWith("VITE_")) continue;
        if (process.env[key] === undefined) process.env[key] = value;
      }
    },
  };
}

export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const plugins: PluginOption[] = [
    serverEnvFromDotenv(mode),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart(
      mergeConfig(
        {
          importProtection: {
            behavior: "error",
            client: { files: ["**/server/**"], specifiers: ["server-only"] },
          },
        },
        { server: { entry: "server" } },
      ),
    ),
    viteReact(),
  ];

  // Production builds target Cloudflare Workers via Nitro (see wrangler.jsonc),
  // exactly as the Lovable wrapper did. Set NITRO_PRESET to target elsewhere.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  // The wrapper inlined every VITE_* key as a compile-time define; keep that so
  // `import.meta.env.VITE_SUPABASE_*` resolves in SSR and client code alike.
  const viteEnv = loadEnv(mode, process.cwd(), "VITE_");
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(viteEnv)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const isDevBuild = command === "build" && mode === "development";

  return {
    plugins,
    define,
    ...(isDevBuild
      ? {
          environments: {
            client: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
          },
          esbuild: { keepNames: true },
        }
      : {}),
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    // Lovable's sandbox required port 8080; kept so existing bookmarks/docs work.
    // Pass `--host` to expose the dev server on the LAN.
    server: {
      port: 8080,
      watch: { awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 } },
    },
  };
});
