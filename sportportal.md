# SportPortal — HANDOVER (2026-04-28, Session 6.0)

Read this first. Supersedes `SportPortal-HANDOVER-EOD (2026-04-26)` — the Apr-26 doc said "all green", but the Apr-27 restructure introduced regressions and the Apr-26 architectural framing (workers serving the domains) was wrong.

---

## TL;DR for the next session

- All four domains are **Cloudflare Pages projects with direct upload** — NOT workers. Previous chats spent hours hunting for the "right worker" because the Apr-26 handover used worker terminology loosely. There are zero `workers/routes` bound on `carnivaltiming.com`. CF Pages serves it at apex.
- Three regressions outstanding from Apr-27 restructure (A, B, C below). District Sport itself is restored at `paddygallivan.github.io/district-sport/`.
- This session diagnosed all three, fixed the easy one (C — mojibake), and laid out clean paths for A and B.

---

## Domain → CF Pages project map (verified Apr-28 via API)

| Domain | CF Pages project | `pages.dev` URL |
|---|---|---|
| `sportportal.com.au` | `sportportal` | `sportportal.pages.dev` |
| `schoolsportportal.com.au` | `schoolsportportal` | `schoolsportportal.pages.dev` |
| `sportcarnival.com.au` | `sportcarnival-hub` | `sportcarnival-hub.pages.dev` |
| `carnivaltiming.com` | `carnival-timing` | `carnival-timing.pages.dev` |

All four projects show `source.config.repo_name = ""` — i.e. **direct upload**, no git connection. To deploy you POST a manifest of file hashes to `/accounts/{acct}/pages/projects/{name}/upload-token`, upload missing files, then create a deployment. Or use `wrangler pages deploy <dir> --project-name=<name>`. The previous chat's framing of "git push to repo → auto-deploy" applies only to the `district-sport` GitHub Pages site, not these four.

Account ID: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main).

---

## Three regressions — current state

### A — sportcarnival.com.au shows placeholder content

The `sportcarnival-hub` Pages project IS bound to the domain. The serving content is a placeholder, not the real carnival management UI. The previous chat assumed "another worker is intercepting" — false. Diagnosis: the Pages project itself contains placeholder HTML, because the Apr-27 restructure pushed the wrong build to it.

**Fix path:** locate the correct build artifact (likely in Drive `SportPortal-build/` folder ID `1pHDFF4NPEiILxR4JT3RrtM51PDHXItZM`, or in the asgard `sources/` directory in `asgard-handovers` repo) and redeploy via wrangler or direct-upload API. No worker route work needed.

Status: **NOT FIXED** in this session. Pages-project-level redeploy required.

### B — schoolsportportal demo pages missing

The `schoolsportportal` Pages project is missing `/demo-school`, `/demo-district`, `/altonadistrict`, etc. Previous chat said "the worker is too large for `workers_get_worker_code`" — that error was a red herring (the project isn't a worker). The real reason the demo pages are missing: they were never built. Per the Apr-23 doc, `schoolsportportal` previously showed 4 fictional demos (Riverside Primary, Riverside District, Eastbay Division, Central Coast Region) and 9 district stubs. The Apr-27 push appears to have stripped these.

**Fix path:** Either (a) restore from a previous deployment (`/accounts/{acct}/pages/projects/schoolsportportal/deployments` lists history; you can promote any prior build), or (b) build the demo pages fresh and direct-upload. The 4 demo pages and 9 district stubs were thin (login-required lock-screen stubs); rebuilding is ~1 hour of HTML.

Status: **NOT FIXED** in this session. Recommend trying deployment rollback first.

### C — carnivaltiming.com mojibake (FIXED LOCALLY)

The previous chat suspected a missing `<meta charset>` or `Content-Type` header. **Both were already correct** — verified live: `content-type: text/html; charset=utf-8` and `<meta charset="UTF-8">` at the top of the HTML.

The actual cause: the source HTML in the deployed bundle was **double-encoded UTF-8** (UTF-8 bytes saved as Latin-1/CP1252 then re-saved as UTF-8). 1,364 mojibake clusters across `index.html`, including `â”€â”€` for `──` (box-drawing, 124 instances), `â†'` for `→` (arrows, 11), `â€¦` for `…`, `âœ…` for `✅`, `âš¡` for `⚡`, etc.

**Fix applied:** ran `ftfy` on the live HTML — all 1,364 clusters resolved cleanly to 0. File trimmed from 121,301 → 110,277 bytes. Fixed file is at `/tmp/ct-fixed.html` in the workspace; needs upload to the `carnival-timing` Pages project to go live.

Status: **HTML repaired locally, deployment pending.** Next session: `wrangler pages deploy` the fixed HTML, or use the direct-upload API. `timing.html` (the secondary page) also has mojibake and should be run through ftfy and bundled in the same upload.

---

## What's still the same (no regression)

- Firestore `(default)` database in `australia-southeast1` (Sydney) on project `willy-district-sport` — still active, still serving carnivaltiming.com timing data.
- Stripe payment link `https://buy.stripe.com/bJe9AS2DH6wH7N6ckm9IQ04` ($1 AUD per student) — live.
- All four CF zones — Active on Free plan.
- DNS pointing correctly to CF Pages (`*.pages.dev` aliases).

---

## Working tokens (verified Apr-28, redacted for secret-scanner)

Token values live in `asgard-vault.pgallivan.workers.dev` (X-Pin auth required). Pull at session start:

```bash
# CF token — has Workers/Zone/DNS/Routes/Pages on account a6f47c17...
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/CF_FULLOPS_TOKEN

# GitHub PAT — PaddyGallivan user-namespace; no org create_repo, no delete_repo
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN
```

Token IDs in vault (for reference, NOT the values):
```
GITHUB_TOKEN: <REDACTED — fetch from asgard-vault key `GITHUB_TOKEN`>
  (PaddyGallivan user-namespace; no org create_repo, no delete_repo)
CF_API_TOKEN (asgard-fullops-mona-2026-04-27):
  <REDACTED — fetch from asgard-vault key `CF_FULLOPS_TOKEN`>
  (Workers/Zone/DNS/Routes; Pages also works — verified by listing Pages projects)
CF_ACCOUNT_ID: a6f47c17811ee2f8b6caeb8f38768c20 (Luck Dragon Main)
```

CF Pages API does NOT accept `per_page` parameter — call `/pages/projects` with no params, returns all projects in single response.

---

## Suggested first three actions for the next session

1. **Deploy the C fix.** `/tmp/ct-fixed.html` is the repaired index. Bundle it with a fixed `timing.html` (re-run ftfy) and direct-upload to `carnival-timing` Pages. Confirm `carnivaltiming.com` shows `── Screens ──` not `â”€â”€ Screens â”€â”€`.
2. **Roll back schoolsportportal (Issue B).** List deployments for the `schoolsportportal` project, find the last build that contained demo pages, promote it. If no good rollback exists, rebuild the four demo HTML pages + nine district stubs fresh.
3. **Find and redeploy correct sportcarnival-hub content (Issue A).** Check Drive `SportPortal-build/` (folder `1pHDFF4NPEiILxR4JT3RrtM51PDHXItZM`) for the real build, or pull from `LuckDragonAsgard/sportcarnival-hub` repo if it exists. Direct-upload to the `sportcarnival-hub` Pages project.

---

## Account-swap notes (asked Apr-28)

This handover is the source of truth — readable from any Claude account. CF token + GitHub PAT in this doc work account-agnostically. Drive access changes per account, but all critical state lives in GitHub now. If the next session is on `pgallivan@outlook.com`, that's actually the account configured as canonical per `CLAUDE.md` ("Only ever use Google Drive for files. Specifically pgallivan@outlook.com"), so it's the preferred account.

The `pgallivan@outlook.com` Cloudflare account is dormant — legacy `wild-cherry-f0ba` Pages project lived there. Do NOT use it. The token above is pinned to the correct active account `a6f47c17811ee2f8b6caeb8f38768c20`.

---

Last updated: 2026-04-28 by mona session (asgard-fullops-mona-2026-04-27 token).
