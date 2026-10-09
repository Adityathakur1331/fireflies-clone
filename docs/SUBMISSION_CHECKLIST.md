# Submission checklist (2026-10-09)

## Verified by agent

| Check | Evidence |
|-------|----------|
| Origin git remote + `main` pushed | `origin` → `aditya-thakur/tmp-546d8d7de49f2654`, commit on `main` |
| Origin repo visibility | **Private** (`origin repo view` → `Visibility: private`) |
| Public GitHub | **Not verified** — no `gh` auth; no `Aditya-Thakur/fireflies-clone` or `northstar-notes` repo found on GitHub API |
| Live demo HTTP | `https://polymer-decreased-fax-mystery.trycloudflare.com` — `/api/meetings` total **6**, `/meetings`, `/meetings/1`, `/tasks` → **200** |
| `pytest` | **17 passed** |
| `npm run test:browser-qa` | **All pass** (against local prod on :3000) |
| `npm run build` | **Pass** (with dev server stopped) |

## Your manual steps before 6 PM

### A. Public GitHub (required for Scaler)

1. Open https://github.com/new  
2. Repository name e.g. `fireflies-clone` or `northstar-notes`, visibility **Public**, no README (already in project).  
3. In Cursor or locally:

   ```bash
   git remote add github https://github.com/Aditya-Thakur/<repo-name>.git
   git push -u github main
   ```

4. Confirm: open `https://github.com/Aditya-Thakur/<repo-name>` in a logged-out browser — repo loads without login.

### B. Persistent demo (recommended)

1. Push to public GitHub (step A).  
2. Render → New Blueprint → connect repo → deploy `render.yaml`.  
3. Replace the Cloudflare URL in README **Submission links** with the Render URL.  
4. Re-test `/meetings` and `/meetings/1`.

### C. Google Form (copy/paste)

- **GitHub:** `https://github.com/Aditya-Thakur/<your-repo-name>` (after step A)  
- **Demo:** `https://polymer-decreased-fax-mystery.trycloudflare.com` until Render is live  
- **Stack:** Next.js 15 + TypeScript, FastAPI, SQLite  
- **Notes:** Seeded demo data; SQLite re-seeds on deploy; no real STT/auth  

Assignment PDF was not in the repository; requirements traced via README + CHECKLIST + browser QA (`docs/ASSIGNMENT_AUDIT.md`).
