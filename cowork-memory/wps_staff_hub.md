---
name: WPS Hub — handover GitHub-canonical
description: v4 live at wps.carnivaltiming.com (CF Worker wps-hub-v3). D1 wps-hub-db d89d5e1b. Drive footprint = 0.
type: project
---
"WPS Hub" is TWO products — always confirm which one Paddy means.

## Product B — WPS Hub v3 (live, the one Paddy wants to grow)
- Repo: LuckDragonAsgard/wps-hub (index.html, worker.js, wrangler.toml, docs/HANDOVER.md)
- Live: https://wps.carnivaltiming.com (CF Worker wps-hub-v3, a6f47c17)
- D1: wps-hub-db d89d5e1b-a9b0-49ad-800d-0cee8f2925b3 — 6 user tables, 2 admin users (Mat Montebello + Paddy Gallivan @education.vic.gov.au)
- Auto-deploy NOT yet wired. D1 row id=51.

## Product A — WPS Staff Hub (CRT/absence app, parked)
- Repo: LuckDragonAsgard/wps-staff-hub (Express + Turso)
- Turso JWT was hardcoded in HEAD — stripped 2026-04-27, still in git history. Rotate on Turso dashboard.
- D1 row id=21, status=parked.

Drive footprint: ZERO. Entire WPS Hub Drive folder deleted 2026-04-27.
