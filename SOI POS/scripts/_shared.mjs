// Shared helpers for scripts/db-backup.mjs and scripts/db-restore.mjs.
// Node 18+ only (uses global fetch); no dependencies.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Minimal .env parser: KEY=value / KEY="value" / KEY='value', `#` comments. */
function parseDotenv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** Loads .env then .env.local from the project root; real env vars always win. */
export function loadEnv() {
  for (const name of [".env", ".env.local"]) {
    const file = join(projectRoot, name);
    if (!existsSync(file)) continue;
    for (const [k, v] of Object.entries(parseDotenv(readFileSync(file, "utf8")))) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

/**
 * Resolves the Supabase connection. Prefers the service_role key (bypasses RLS,
 * sees every row); falls back to the anon/publishable key, which only sees what
 * row-level security exposes to signed-out clients (in this app: almost nothing).
 */
export function supabaseConnection() {
  loadEnv();
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is not set (see .env.example)");
  const key = serviceKey || anonKey;
  if (!key)
    throw new Error("Set SUPABASE_SERVICE_ROLE_KEY (full access) or SUPABASE_PUBLISHABLE_KEY");
  return { url, key, mode: serviceKey ? "service_role" : "anon" };
}

export function restHeaders(key, extra = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Reads the table and view names out of the generated Supabase types file so the
 * scripts never need a hard-coded list. Regenerate types after adding tables.
 */
export function schemaObjectsFromTypes() {
  const file = join(projectRoot, "src/integrations/supabase/types.ts");
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const tables = [];
  const views = [];
  let section = null;
  for (const line of lines) {
    if (/^    Tables: \{$/.test(line)) section = "tables";
    else if (/^    Views: \{$/.test(line)) section = "views";
    else if (/^    (Functions|Enums|CompositeTypes): \{$/.test(line)) section = null;
    else if (section) {
      const m = /^      ([a-z0-9_]+): \{$/.exec(line);
      if (m) (section === "tables" ? tables : views).push(m[1]);
    }
    if (/^  [a-z_]+: \{$/.test(line) && !/^  public: \{$/.test(line)) break; // left the public schema
  }
  if (tables.length === 0) throw new Error(`No tables found in ${file}`);
  return { tables, views };
}

export function timestampSlug(d = new Date()) {
  return d.toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
}
