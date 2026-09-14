#!/usr/bin/env node
// Restores a backup made by scripts/db-backup.mjs into a Supabase project by
// upserting every row (merge on primary key). Existing rows with the same id
// are overwritten; rows that exist only in the target are left alone.
//
//   bun run db:restore -- backups/2026-09-14_15-00-00            # dry run (default)
//   bun run db:restore -- backups/2026-09-14_15-00-00 --apply    # actually write
//   bun run db:restore -- <dir> --apply --tables customers,orders
//
// Requires SUPABASE_SERVICE_ROLE_KEY for the TARGET project. To restore into a
// separate clone (recommended for testing a recovery), point SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY at that project first, after applying
// supabase/migrations there so the schema exists.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { restHeaders, supabaseConnection } from "./_shared.mjs";

const CHUNK = 500;
const MAX_PASSES = 6; // tables are retried so foreign-key ordering sorts itself out

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function upsertChunk(url, key, table, rows) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: restHeaders(key, { Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
}

async function main() {
  const dir =
    process.argv[2] && !process.argv[2].startsWith("--") ? resolve(process.argv[2]) : null;
  if (!dir || !existsSync(join(dir, "manifest.json"))) {
    console.error("Usage: node scripts/db-restore.mjs <backup dir> [--apply] [--tables a,b]");
    process.exit(1);
  }
  const apply = process.argv.includes("--apply");
  const only = arg("--tables")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  const { url, key, mode } = supabaseConnection();
  if (mode !== "service_role")
    throw new Error("Restore needs SUPABASE_SERVICE_ROLE_KEY for the target project");
  if (manifest.mode !== "service_role") {
    console.warn(
      "WARNING: this backup was taken with the anon key and is almost certainly incomplete.",
    );
  }

  const tableFiles = readdirSync(join(dir, "tables")).filter((f) => f.endsWith(".json"));
  let pending = tableFiles
    .map((f) => f.replace(/\.json$/, ""))
    .filter((t) => !(t in (manifest.views ?? {}))) // views are read-only
    .filter((t) => !only || only.includes(t))
    .map((t) => ({
      table: t,
      rows: JSON.parse(readFileSync(join(dir, "tables", `${t}.json`), "utf8")),
    }))
    .filter((t) => Array.isArray(t.rows) && t.rows.length > 0);

  console.log(`${apply ? "Restoring" : "DRY RUN:"} ${pending.length} tables from ${dir} -> ${url}`);
  for (const { table, rows } of pending) console.log(`  ${table.padEnd(24)} ${rows.length} rows`);
  if (!apply) {
    console.log("Nothing written. Re-run with --apply to perform the restore.");
    return;
  }

  const errors = {};
  for (let pass = 1; pass <= MAX_PASSES && pending.length; pass++) {
    const next = [];
    for (const item of pending) {
      try {
        for (let i = 0; i < item.rows.length; i += CHUNK) {
          await upsertChunk(url, key, item.table, item.rows.slice(i, i + CHUNK));
        }
        console.log(`  pass ${pass}: ${item.table} ok`);
        delete errors[item.table];
      } catch (e) {
        errors[item.table] = e.message;
        next.push(item);
      }
    }
    pending = next;
  }

  if (pending.length) {
    console.error("Failed tables:");
    for (const { table } of pending) console.error(`  ${table}: ${errors[table]}`);
    process.exit(1);
  }
  console.log("Restore complete. Note: auth users are not restored by this script (see README).");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
