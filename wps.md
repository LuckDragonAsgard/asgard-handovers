# WPS Hub — handover

**Last updated:** 2026-04-28
**Live:** https://wps.carnivaltiming.com (will move to https://schoolstaffhub.com.au once registered + NS swapped)
**Worker:** `wps-hub-v3` on Cloudflare account a6f47c17811ee2f8b6caeb8f38768c20 (Luck Dragon Main)
**D1:** `wps-hub-db` uuid d89d5e1b-a9b0-49ad-800d-0cee8f2925b3
**Repos:** [`LuckDragonAsgard/wps-hub`](https://github.com/LuckDragonAsgard/wps-hub) (live v3, product B) + [`LuckDragonAsgard/wps-staff-hub`](https://github.com/LuckDragonAsgard/wps-staff-hub) (parked product A)
**Drive footprint:** zero. Source-of-truth is GitHub. No drafts, no helpers, no staging on Drive.

---

## What this is

> Two products both named "WPS Hub" / "WPS Staff Hub". Always confirm which one a conversation is about.

| | **A. WPS Staff Hub** (CRT/absence) | **B. WPS Hub v3** (school management — Paddy's growth product) |
|---|---|---|
| Repo | `LuckDragonAsgard/wps-staff-hub` | `LuckDragonAsgard/wps-hub` |
| Stack | Express + Turso + Twilio + SendGrid (Railway-ready) | Single 71 KB HTML PWA + CF Worker + D1 |
| Status | Parked | Live |
| Asgard Project Hub D1 row | id=21 | id=51 |

Product B is what is live. Product A is parked (Turso token leak HEAD-stripped commit 90c9148 but still in git history — rotate the Turso dashboard if you ever revive it).

---

## Architecture (Product B v3)

- Frontend: single 71 KB HTML PWA in [`LuckDragonAsgard/wps-hub/index.html`](https://github.com/LuckDragonAsgard/wps-hub/blob/main/index.html). Vanilla JS, school emoji logo, all `/api/*` calls relative.
- Worker [`worker.js`](https://github.com/LuckDragonAsgard/wps-hub/blob/main/worker.js): multi-tenant. Fetches `index.html` from GitHub raw at runtime (5-min cache). Routes `/api/*` against D1 scoped by `school_id`. Serves `/super` super-admin UI (after v4.1 deploy).
- Per-school shared (in D1): bell times, notices, school events, timetable, admin user list.
- Per-teacher local (browser storage only): class rolls, gradebook marks, student notes — never leaves the device (student-PII safe).
- Multi-tenancy: school resolved from (1) `X-School-Id` header, (2) `school=` query param, (3) hostname lookup against `schools.domain`, (4) fallback to `wps`.

## Schools state

| id | name | domain | created |
|---|---|---|---|
| `wps` | Williamstown Primary School | schoolstaffhub.com.au | 2026-04-20 |
| `demo` | Demo Primary School | demo.wps.carnivaltiming.com | 2026-04-27 (test) |

Data: 10 bell_times + 2 admin users (Mat Montebello + Paddy Gallivan, both `@education.vic.gov.au`, Paddy super_admin). Empty notices/timetable/events.

---

## OPEN ITEMS — manual actions

1. **Deploy v4.1 (the /super super-admin UI).** Source written and pushed to repo. Deploy needs either (a) CF Workers Builds wiring then a no-op push to trigger build, (b) bash sandbox + the multipart wrangler/curl call when the sandbox is back, or (c) `wrangler deploy` from a clone with wrangler installed. Live currently runs v4 (multi-tenant) without /super.
2. **Register `schoolstaffhub.com.au`** at VentraIP. CF zone is pre-staged, NS pair is `coraline.ns.cloudflare.com` + `renan.ns.cloudflare.com`. Worker custom-domain bindings (apex + www) already in place — site goes live as soon as NS propagates.
3. **Wire CF Workers Builds** for auto-deploy. Dashboard step (CF API does not expose it): dash.cloudflare.com → Workers → `wps-hub-v3` → Settings → Build → Connect to Git → authorise `LuckDragonAsgard/wps-hub` → branch `main`, deploy command `wrangler deploy`.
4. **Rotate the admin secret** from the placeholder once Mat has a real value. PUT to `/accounts/<acc>/workers/scripts/wps-hub-v3/secrets`.
5. **Walk Mat through onboarding** — `docs/MAT-ONBOARDING.md` in the repo covers what he needs.
6. **Rotate Turso token** for Product A (still in git history of `wps-staff-hub` repo) — only if you ever revive the CRT app.

---

## Credentials (in vault unless noted)

| What | Where |
|---|---|
| CF API token | asgard-vault `cfut_...` (token name `asgard-fullops-mona-2026-04-27`) |
| GitHub PAT | asgard-vault `GITHUB_TOKEN` (X-Pin to read) |
| Admin secret | set as CF Worker secret on `wps-hub-v3` |
| Vault | `https://asgard-vault.pgallivan.workers.dev` — `GET /secret/<KEY>` with X-Pin header |
| Asgard project hub D1 | `asgard-brain.pgallivan.workers.dev/d1/query` with X-Pin header and curl User-Agent |

---

## API surface (multi-tenant v4)

All responses `{ok, data?, error?}`. School resolved per request.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET`  | `/api/health` | open | `{ok, version, has_db, school, school_name}` |
| `GET`  | `/api/school` | open | Current resolved school |
| `POST` | `/api/auth/verify-admin` | body `{pin, email}` | `{ok, role, super_admin, school}` |
| `GET`  | `/api/bells` | open (school-scoped) | List |
| `GET`  | `/api/notices` | open | List |
| `POST` | `/api/notices` | open | Create |
| `DELETE` | `/api/notices/:id` | open | |
| `GET`  | `/api/timetable` | open | List |
| `GET`  | `/api/timetable/all` | open | Same |
| `POST` | `/api/timetable` | `X-Admin-Email` + `X-Admin-PIN` | Bulk upsert |
| `DELETE` | `/api/timetable/:id` | admin | |
| `DELETE` | `/api/timetable/all` | admin | |
| `GET`  | `/api/users` | open (school-scoped) | List |
| `GET`  | `/api/events` | open (school-scoped) | List |
| `GET`  | `/api/admin/log` | admin | Audit |
| `GET`  | `/api/_super/schools` | super-admin headers | List schools |
| `POST` | `/api/_super/schools` | super-admin | Create school |
| `POST` | `/api/_super/promote-admin` | super-admin | `{school_id, email, name?}` |
| `GET`  | `/super` | self-gated UI (after v4.1 deploy) | Super-admin onboarding page |

---

## Recovery story (for context only)

- 2026-04-20: built v3 hub (the one with iDoceo features) in a Claude session. Deployed as worker `wps-staff-hub` v5 with D1 + admin secret bindings.
- 2026-04-27 06:46 UTC: Vercel→CF migration accidentally overwrote v5 with a static snapshot of Product A frontend. Stripped all bindings. Production broke.
- 2026-04-27 10:33 UTC: restored. D1 was untouched, source rebuilt by reverse-engineering API surface from v3 frontend HTML, redeployed as new worker `wps-hub-v3` to keep `wps-staff-hub` as a safety net. `wps.carnivaltiming.com` repointed.
- 2026-04-27 12:00 UTC: source migrated off Drive into `LuckDragonAsgard/wps-hub` repo. Drive folder for WPS Hub deleted entirely.
- 2026-04-27 12:14 UTC: D1 multi-tenant migration applied (`schools` table, `school_id` on every per-school table, `super_admin` flag, indexes). Worker rewritten as multi-tenant v4. WPS seeded as first school. Verified isolation with a test `demo` school.
- 2026-04-28: built /super UI source as v4.1. Bash sandbox died mid-session, deploy still pending (see OPEN ITEM 1).

Pre-recovery snapshot pinned as GitHub release [`pre-recovery-2026-04-27`](https://github.com/LuckDragonAsgard/wps-hub/releases/tag/pre-recovery-2026-04-27) with 3 attached assets.

---

## How to resume from a different account

1. Read this file (you are doing it now).
2. Make sure you have CF + GH tokens — pull from asgard-vault with the X-Pin header.
3. Confirm live state: hit `https://wps.carnivaltiming.com/api/health` and expect `ok:true` with `school: wps` and version v4 or v4.1.
4. Pick up wherever in OPEN ITEMS above. The full canonical handover is in the repo at [`LuckDragonAsgard/wps-hub/docs/HANDOVER.md`](https://github.com/LuckDragonAsgard/wps-hub/blob/main/docs/HANDOVER.md).

## Quick verification

```
curl -s https://wps.carnivaltiming.com/api/health
curl -s https://wps.carnivaltiming.com/api/users

# After NS swap on schoolstaffhub.com.au:
curl -s https://schoolstaffhub.com.au/api/health

# After v4.1 deploy:
curl -sI https://wps.carnivaltiming.com/super
```
