# SOI POS

Front-desk point-of-sale for SOI Threading Salon (180 Hamburg Turnpike, Wayne NJ).
TanStack Start + React 19 + Tailwind 4 on the front, Supabase (Postgres, Auth, RLS)
on the back, deployed as a Cloudflare Worker.

Imported from `soithreadingsalon/soi-salon-stream` (Lovable project, 421 commits,
last upstream commit `1a11940` "Addressed security issues", 2026-07-18) and made
independent of Lovable's tooling. See **What changed from the Lovable version** below.

## Run it locally

```bash
bun install                 # or npm install
cp .env.example .env.local  # fill in the secrets (see below)
bun run dev                 # http://localhost:8080
```

Other scripts: `bun run build` (Cloudflare Worker bundle in `dist/`), `bun run preview`,
`bun run typecheck`, `bun run lint`, `bun run format`, `bun run db:backup`, `bun run db:restore`.

### Environment variables

| Variable                                                                         | Where it lives                      | Purpose                                                              |
| -------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | `.env` (committed, public anon key) | Browser Supabase client                                              |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`                                       | `.env` (committed)                  | Server-side user-scoped Supabase client                              |
| `SUPABASE_SERVICE_ROLE_KEY`                                                      | secret                              | Staff PIN sign-in, website import, admin recycle bin, backup scripts |
| `SESSION_SECRET`                                                                 | secret                              | Signs the `/gate` unlock cookie                                      |
| `SITE_PASSWORD`                                                                  | secret                              | Password typed on `/gate`                                            |
| `WEBSITE_BOOKING_SECRET`                                                         | secret                              | Authenticates `POST /api/public/website-appointment`                 |

The four secrets were stored in Lovable Cloud and are **not** in git. Get the
service-role key from the Supabase dashboard (Project Settings, API); the other three
are whatever values Lovable Cloud had, or new ones (a new `SITE_PASSWORD` just changes
the gate password; a new `SESSION_SECRET` logs everyone out of the gate once; a new
`WEBSITE_BOOKING_SECRET` must also be updated on the public website's booking form).

Locally, `vite.config.ts` loads `.env` and `.env.local` into `process.env` for the dev
server. On Cloudflare, set them with `wrangler secret put <NAME>`.

## What changed from the Lovable version

Lovable-specific pieces that were replaced or removed. No application code, routes,
Supabase schema or data were changed.

| Lovable piece                                                                                                                                      | What was done                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lovable.dev/vite-tanstack-config` (wrapped Vite; added sandbox-only preview proxy, HMR gate, dev-server bridge, devtools)                        | Replaced by an explicit `vite.config.ts` with the same plugins: TanStack Start, React, Tailwind, tsconfig paths, Nitro (Cloudflare preset) on build, `VITE_*` defines, lightningcss.                                                                                       |
| `@lovable.dev/mcp-js` Vite plugin (regenerated `src/routes/mcp.ts`, `[.mcp]/*`, `[.well-known]/*` and `.lovable/mcp/manifest.json` on every build) | Plugin dropped; the four route files are now ordinary hand-maintained files. The runtime package `@lovable.dev/mcp-js` (MIT, on public npm) is kept because the app's MCP server (`src/lib/mcp`) and its OAuth consent page (`/.lovable/oauth/consent`) are real features. |
| `bun.lock` pinned 167 packages to Lovable's private registry (`europe-west1-npm.pkg.dev/lovable-core-prod/...`)                                    | Re-pointed to `registry.npmjs.org`; integrity hashes unchanged and verified on install.                                                                                                                                                                                    |
| `bunfig.toml` release-age exclusions for Lovable packages                                                                                          | Removed; versions are pinned by the lockfile anyway.                                                                                                                                                                                                                       |
| `.lovable/` (editor plan notes, template id, generated MCP manifest)                                                                               | Not imported; it is Lovable editor metadata, not app code.                                                                                                                                                                                                                 |
| Secrets injected by Lovable Cloud                                                                                                                  | Documented in `.env.example`; loaded from `.env.local` in dev.                                                                                                                                                                                                             |
| `package.json` name `tanstack_start_ts`                                                                                                            | Renamed `soi-pos`; added `typecheck`, `db:backup`, `db:restore` scripts.                                                                                                                                                                                                   |
| Five TypeScript errors (navigations to `/login` without a `search` prop)                                                                           | Fixed by making the `next` search param optional in `src/routes/login.tsx`.                                                                                                                                                                                                |

Not changed: `supabase/config.toml` still points at project `wywcvoczkjkxhwflwccd`, the
Supabase auth OAuth consent path stays `/.lovable/oauth/consent` because that URL is
registered in the Supabase project's OAuth server settings, and `wrangler.jsonc` still
targets Cloudflare Workers.

## Database backups and recovery

All data lives in the Supabase project `wywcvoczkjkxhwflwccd` (26 tables, 1 view,
see `supabase/migrations`). Row-level security allows only signed-in staff to read it,
so backups need the **service-role key**.

**Before any risky change, take a backup:**

```bash
SUPABASE_SERVICE_ROLE_KEY=... bun run db:backup            # -> backups/<timestamp>/
bun run db:backup -- --out /Volumes/ExternalDrive/soi-backups
```

Each backup folder holds `tables/<table>.json` for every table and view, `auth-users.json`
(staff accounts; Supabase never exports password hashes, so after a restore staff need a
new invite or PIN reset), a copy of `supabase/migrations`, and `manifest.json` with row
counts and warnings. `backups/` is git-ignored because it contains customer data.

**Recover into a separate clone (recommended way to test a recovery):**

1. Create a new Supabase project.
2. Apply the schema: run each file in `supabase/migrations` in order (SQL editor, or
   `psql "$DATABASE_URL" -f <file>`).
3. Point the scripts at the clone and load the data:
   ```bash
   SUPABASE_URL=https://<clone-ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<clone key> \
     bun run db:restore -- backups/<timestamp> --apply
   ```
   Without `--apply` the script only prints what it would write. Restores upsert on
   primary key, so re-running is safe.
4. Re-create staff logins (Auth, Users) and set their PINs from Settings in the app.

**Full Postgres dumps** (includes auth password hashes) are also possible with the
database password from the dashboard:

```bash
pg_dump "$DATABASE_URL" --schema=public --schema=auth -Fc -f soi-$(date +%F).dump
pg_restore -d "$CLONE_DATABASE_URL" --no-owner soi-YYYY-MM-DD.dump
```

The database also keeps its own nightly snapshots of orders, payments and
appointments in `orders_backup`, `payments_backup`, `appointments_backup`
(`run_daily_backups()`), and soft-deleted customers/services/appointments in the
`*_deleted` tables, restorable from Settings in the app.

## Routes

`/gate` (site password) → `/login` (staff PIN or admin email) → `/dashboard`, `/pos`,
`/appointments`, `/customers`, `/services`, `/memberships`, `/reports`, `/my-sales`,
`/settings`. `POST /api/public/website-appointment` receives bookings from the public
website. `/mcp` exposes read-only MCP tools (today's appointments, sales summary, find
customer) for AI clients, authenticated through Supabase OAuth.
