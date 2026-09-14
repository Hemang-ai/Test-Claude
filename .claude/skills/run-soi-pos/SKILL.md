---
name: run-soi-pos
description: Start the SOI POS dev server locally and verify it responds. Use whenever the user says "run", "run it", "run the app", or asks to start/launch/preview SOI POS.
---

# Run SOI POS locally

All commands run inside the `SOI POS/` folder of this repo.

1. **Install dependencies** if `node_modules/` is missing or `package.json` changed:
   `bun install` (fallback: `npm install`).
2. **Ensure secrets exist.** The dev server reads `.env.local` (git-ignored). If it is
   missing, create it with local placeholders so the site gate works, and tell the user:
   ```
   SESSION_SECRET="local-dev-session-secret-at-least-32-chars-long"
   SITE_PASSWORD="localdev"
   ```
   `SUPABASE_SERVICE_ROLE_KEY` is optional locally; without it, staff PIN sign-in and the
   backup/restore scripts do not work, but the gate, admin email login, and all pages do.
3. **Start the server in the background** and capture its log:
   `bun run dev` (serves on http://localhost:8080; add `--host` to expose on the LAN).
   If port 8080 is busy, stop the previous `vite dev` process first, never pick a
   different port silently.
4. **Verify** before reporting: wait for `Local:` in the log, then check that
   `GET http://localhost:8080/gate` returns 200 and `GET /dashboard` redirects (307)
   to `/gate`. If either fails, show the log tail and fix the cause.
5. **Report** the URL, the gate password in use (`SITE_PASSWORD` from `.env.local`),
   and anything missing (for example, no service-role key). Keep it to a few lines.

Stop the server with `pkill -f "vite dev"` when asked to stop.
