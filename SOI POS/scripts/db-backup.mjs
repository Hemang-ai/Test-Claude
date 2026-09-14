#!/usr/bin/env node
// Dumps every public table (and view) of the Supabase project to JSON files,
// plus auth users and a copy of the SQL migrations, into backups/<timestamp>/.
//
//   bun run db:backup                 # uses SUPABASE_SERVICE_ROLE_KEY from .env.local
//   bun run db:backup -- --out /path  # write somewhere else (e.g. an external drive)
//   bun run db:backup -- --tables orders,payments
//
// With only the anon key the dump succeeds but row-level security hides almost
// every row, so the manifest records mode="anon" and the counts stay at 0.
// Use the service_role key for a real backup. Nothing here writes to the DB.
import { mkdirSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  projectRoot,
  restHeaders,
  schemaObjectsFromTypes,
  supabaseConnection,
  timestampSlug,
} from "./_shared.mjs";

const PAGE = 1000;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function fetchAllRows(url, key, table) {
  const rows = [];
  let offset = 0;
  let orderBy = null;
  for (;;) {
    const params = new URLSearchParams({
      select: "*",
      limit: String(PAGE),
      offset: String(offset),
    });
    if (orderBy) params.set("order", `${orderBy}.asc`);
    const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
      headers: restHeaders(key, { Prefer: "count=exact" }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { rows: null, error: `${res.status} ${body.slice(0, 200)}` };
    }
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE) break;
    // Stable paging needs an order; every table in this schema has an `id`.
    if (!orderBy && page[0] && "id" in page[0]) orderBy = "id";
    offset += PAGE;
  }
  return { rows, error: null };
}

async function fetchAuthUsers(url, key) {
  const users = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=${PAGE}`, {
      headers: restHeaders(key),
    });
    if (!res.ok) return { users: null, error: `${res.status} ${(await res.text()).slice(0, 200)}` };
    const data = await res.json();
    const batch = data.users ?? [];
    users.push(...batch);
    if (batch.length < PAGE) break;
  }
  return { users, error: null };
}

async function main() {
  const { url, key, mode } = supabaseConnection();
  const { tables, views } = schemaObjectsFromTypes();
  const only = arg("--tables")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const targets = [...tables, ...views].filter((t) => !only || only.includes(t));
  const outRoot = resolve(arg("--out") ?? join(projectRoot, "backups"));
  const outDir = join(outRoot, timestampSlug());
  mkdirSync(join(outDir, "tables"), { recursive: true });

  console.log(`Backing up ${url} as ${mode} -> ${outDir}`);
  if (mode === "anon") {
    console.warn(
      "WARNING: no SUPABASE_SERVICE_ROLE_KEY set. RLS will hide nearly all rows; this is NOT a usable backup.",
    );
  }

  const manifest = {
    created_at: new Date().toISOString(),
    supabase_url: url,
    mode,
    tables: {},
    views: {},
    auth_users: null,
    warnings: [],
  };

  for (const table of targets) {
    const { rows, error } = await fetchAllRows(url, key, table);
    const bucket = views.includes(table) ? manifest.views : manifest.tables;
    if (error) {
      bucket[table] = { rows: null, error };
      manifest.warnings.push(`${table}: ${error}`);
      console.log(`  ${table.padEnd(24)} ERROR ${error}`);
      continue;
    }
    writeFileSync(join(outDir, "tables", `${table}.json`), JSON.stringify(rows, null, 2));
    bucket[table] = { rows: rows.length };
    console.log(`  ${table.padEnd(24)} ${rows.length} rows`);
  }

  if (mode === "service_role") {
    const { users, error } = await fetchAuthUsers(url, key);
    if (error) {
      manifest.warnings.push(`auth users: ${error}`);
      console.log(`  auth.users               ERROR ${error}`);
    } else {
      writeFileSync(join(outDir, "auth-users.json"), JSON.stringify(users, null, 2));
      manifest.auth_users = users.length;
      console.log(
        `  auth.users               ${users.length} users (no password hashes; re-invite or reset PINs on restore)`,
      );
    }
  } else {
    manifest.warnings.push("auth users skipped: requires service_role key");
  }

  const migrations = join(projectRoot, "supabase", "migrations");
  if (existsSync(migrations)) {
    cpSync(migrations, join(outDir, "migrations"), { recursive: true });
    console.log("  schema                   copied supabase/migrations");
  }

  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done. Manifest: ${join(outDir, "manifest.json")}`);
  if (manifest.warnings.length) {
    console.log(`Warnings (${manifest.warnings.length}):`);
    for (const w of manifest.warnings) console.log(`  - ${w}`);
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
