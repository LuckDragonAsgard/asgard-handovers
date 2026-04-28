# Session Handover — 2026-04-27 (CYMS + Clubhouse)

**For:** the next Claude session, possibly under a different account.
**Pickup target:** `github.com/PaddyGallivan/asgard-handovers/SESSION-HANDOVER.md`

---

## What this session did

1. **WCYMS torn down and archived** — three CF deploys (`cyms-deploy-v4`, `cyms-deploy-v12`, `wcyms-footy-club` worker) deleted, Pages project `wcyms-footy-club` deleted, D1 row 18 in `asgard-brain` products set to `status=archived`. No buildable React source ever existed; original Vercel bundle was lost when the Vercel project was deleted earlier today by another session. Full archive note: [`asgard-handovers/wcyms.md`](https://github.com/PaddyGallivan/asgard-handovers/blob/main/wcyms.md).
2. **Created `asgard-handovers` repo** — `github.com/PaddyGallivan/asgard-handovers`. One md per project, lowercase, no dates, overwrite in place. Files: `bomberboat.md`, `sportportal.md`, `kbt.md`, `superleague.md`, `asgard.md` (Session 3 — superseded by `asgard-source/docs/HANDOVER-EOD.md`), `wcyms.md`. Plus `sources/`.
3. **NEW PROJECT — Clubhouse scaffolded** — multi-tenant platform for sport clubs. Repo `github.com/PaddyGallivan/clubhouse`. Seeded with README + `docs/HANDOVER.md`. D1 row 52, status=`idea`. Decisions: multi-tenant from day 1, v1 = Roster + Fixtures + Comms + Sponsors + role-based logins, stack = React + Vite + CF Pages + D1. **No code yet** — first action next session is `docs/PRODUCT-BRIEF.md`.
4. **Drive evacuation already in progress in another session** — `drive-r2-migrator.pgallivan.workers.dev` already moved ~2532 objects of `paddy@luckdragon.io` Drive to R2 bucket `asgard-archive` (~99.8% complete). Did NOT duplicate that work. Plan: [`asgard-source/docs/DRIVE-EVACUATION-HANDOVER.md`](https://github.com/PaddyGallivan/asgard-source/blob/main/docs/DRIVE-EVACUATION-HANDOVER.md).

## Current portfolio state

| Project | Status | Where it lives | Handover |
|---|---|---|---|
| Bomber Boat | live | `bomber-boat.pages.dev`, repo `PaddyGallivan/bomber-boat` | `docs/HANDOVER.md` in repo |
| SportPortal / SchoolSP / SportCarnival / CarnivalTiming | live | CF Pages × 4 | `asgard-handovers/sportportal.md` |
| KBT | live | `luckdragonasgard.github.io/kbt-trivia-tools/host-app.html` | `asgard-handovers/kbt.md` |
| Superleague v4 | live (v4.18) | CF Worker via sly-deploy | `asgard-handovers/superleague.md` |
| Asgard dashboard + tools | live (v7.9.2) | `asgard.pgallivan.workers.dev` | `asgard-source/docs/HANDOVER-EOD.md` |
| WPS Hub | live | `wps.carnivaltiming.com` | `LuckDragonAsgard/wps-hub/docs/HANDOVER.md` |
| Family Footy Tipping | live | repo `LuckDragonAsgard/family-footy-tipping` | n/a |
| **Clubhouse** | **idea (scaffolded today)** | repo `PaddyGallivan/clubhouse` | `docs/HANDOVER.md` in repo |
| WCYMS | **archived 2026-04-27** | n/a | `asgard-handovers/wcyms.md` |

## Outstanding stragglers (low priority)

- Stub repos `LuckDragonAsgard/cyms-club-app` + `LuckDragonAsgard/footy-club-app` — empty husks. Token lacks `delete_repo`. Manual delete via UI.
- Two `wcyms.md` Drive stubs (file IDs `1X5bOr4XoPeX_WeIw-B63rleE-IiXktw6` and `1v9UGmDz0eOQc4W0lJuRh9KLIlPD7glVD`) — click-trash in Drive UI.
- `Clubhouse` repo at `PaddyGallivan/clubhouse`; transfer to `LuckDragonAsgard` when org-scoped token available.

## Tokens (active)

- `GITHUB_TOKEN`: `<GITHUB_TOKEN — fetch from vault>` (PaddyGallivan user-namespace)
- `CF_API_TOKEN`: `<CF_API_TOKEN — fetch from vault>` (Workers/Zone/DNS/Routes; NO R2)
- `CF_ACCOUNT_ID`: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- `asgard-brain` D1 PIN: `2967`

Migration worker / R2 tokens: pull from vault per `asgard-source/docs/DRIVE-EVACUATION-HANDOVER.md`.

## What NEXT session should NOT do

- Don't duplicate the Drive evacuation.
- Don't fix or redeploy WCYMS — archived, no source.
- Don't write code in `clubhouse` yet. Brief first.
- Don't store anything on Drive. GitHub or Cloudflare only.

## Next session priorities

1. Continue Drive evacuation — share `pgallivan@outlook.com` + `hello@knowbrainertrivia.com.au` folders with `kbt-slides@asgard-493906.iam.gserviceaccount.com`.
2. Rotate leaked credentials (2 GCP SA JSONs + leaked CF token in `fix-streamline-domain.mjs`).
3. Trash 13 Drive duplicates (URLs in `asgard-source/docs/DRIVE-MIGRATION.md`).
4. Clubhouse product brief at `clubhouse/docs/PRODUCT-BRIEF.md`.

## Pickup links

- Clubhouse handover: https://github.com/PaddyGallivan/clubhouse/blob/main/docs/HANDOVER.md
- WCYMS archive: https://github.com/PaddyGallivan/asgard-handovers/blob/main/wcyms.md
- Drive evacuation: https://github.com/PaddyGallivan/asgard-source/blob/main/docs/DRIVE-EVACUATION-HANDOVER.md