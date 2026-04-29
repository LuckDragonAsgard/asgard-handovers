# SportPortal — EOD Handover (Session 12, 2026-04-29)

## TL;DR
4-domain school sports SaaS on CF Pages + Firestore. All background tasks done.
One manual browser action outstanding: wire the schoolsportportal.com.au Worker Route.

## Session 12 — what got done
- **Asgard backup cron set** via API: `0 18 * * *` on `asgard-backup` Worker ✅
- **Superleague $20→$50 fix** — confirmed already live (v4.31) ✅
- **Superleague fixture jumpers** — confirmed already live ✅
- **WPS v4.1 /super admin UI** — confirmed already deployed ✅
- **Asgard D1 github_urls** — confirmed already 0 blank records ✅
- **Asgard editProjectFlow Y6–Y10 + cash fields** — confirmed already present ✅
- **schoolsportportal Worker** re-deployed (430KB, all routes working at `.pgallivan.workers.dev`)
- **Repo cleaned**: `wrangler.toml` deleted then restored with `pages_build_output_dir = "."`,
  full `_worker.js` restored (commit `a4cf92d8`)

## ⚠️ One browser action required — #9 schoolsportportal.com.au
Zone route `schoolsportportal.com.au/*` exists but has **Worker = None**.
Fix: CF dashboard → schoolsportportal.com.au zone → Workers → Routes → Edit that route → select `schoolsportportal` → Save.
The Worker itself is healthy at `schoolsportportal.pgallivan.workers.dev` (confirmed 200 on all routes).
CF Pages project (`schoolsportportal`) is also broken (500 on all routes, likely build config issue) —
fixing the Worker Route bypasses CF Pages entirely.

## Session 11 deliverables (still current)
- Inserted 20 comprehensive facts into Asgard D1 (all 20 OK)
- `G:\My Drive\ssv-admin-burden-analysis.docx` — hours doc, ~$7.9M/yr statewide
- `G:\My Drive\sportportal-comparison.html` — 33-email catalog + 6 external stakeholder cards
- SSV structure: 1,600 schools, 232 districts, 55 divisions, 16 regions
- CRT rate: $70.97/hr (DET Victoria, July 2025)

## Architecture (current as of 2026-04-26)
All 4 domains on Luck Dragon (Main) CF account (`a6f47c17811ee2f8b6caeb8f38768c20`):

| Domain | CF Pages project | NS pair |
|---|---|---|
| sportportal.com.au | `sportportal` | coraline + renan |
| schoolsportportal.com.au | `schoolsportportal` | coraline + renan |
| sportcarnival.com.au | (auto-attached) | (CF) |
| carnivaltiming.com | `carnival-timing` | liv + quinton |

Firebase project: `willy-district-sport` (australia-southeast1), SDK v9.23.0 compat layer.

## Key facts
- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS
- Stripe: Google sign-in with pat_gallivan@hotmail.com
- Sport Portal Drive folder: `1SVbCqDwD7AztVXmijffRTPdCi_JoGQr6`

## Outstanding
- **info@sportportal.com.au** email setup — not done
- **ASIC Form 484** — postal letter expected ~2026-05-02
