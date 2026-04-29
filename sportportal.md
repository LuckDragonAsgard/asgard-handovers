---
name: Sport Portal — latest handover
description: Most recent EOD handover file for SportPortal-family (4 domains) with Firestore backend on Cloudflare Pages
type: project
originSessionId: c5bc21e7-cfa3-4d24-8f65-3291ffd33e0e
---
Latest handover: **2026-04-30 EOD (Session 14)** — CANONICAL at `github.com/LuckDragonAsgard/asgard-handovers/blob/main/sportportal.md`

Session 14 deliverables:
- Discord webhook created (ID 1499034258629591040), tested, saved to vault as DISCORD_WEBHOOK_ASGARD ✅
- Vault PIN rotated to 2967 (old PIN 6d069732989ef453 was dead) ✅
- cowork-memory pushed to GitHub — identity.md, MEMORY.md, sportportal.md all current ✅

## Architecture (current as of 2026-04-26)

All 4 domains live on **Luck Dragon (Main)** CF account (`a6f47c17811ee2f8b6caeb8f38768c20`), each → CF Pages project → Firestore (australia-southeast1) backend:

| Domain | CF Pages project | NS pair |
|---|---|---|
| sportportal.com.au | `sportportal` | coraline + renan |
| schoolsportportal.com.au | `schoolsportportal` | coraline + renan |
| sportcarnival.com.au | (auto-attached) | (CF) |
| carnivaltiming.com | **`carnival-timing`** (NEW this session) | liv + quinton |

**Why:** Why all on CF Pages: unified vendor, automatic TLS, AU edge. Firebase SDK v9.23.0 compat with `firebase-firestore-compat.js` (NOT `firebase-database-compat`).
**How to apply:** When debugging any of these domains, check the CF Pages project (not Vercel — Vercel projects exist but are no longer in the serving path) and the corresponding Firestore collections.

## Session 7 (2026-04-26) — what got fixed

- 3 CF zones in "lame delegation / Finish setup" state → activated by clicking Free plan
- carnivaltiming.com had a `district-sport` Worker intercepting all traffic → routes deleted, CF Pages now serves
- New CF Pages project `carnival-timing` created (legacy `wild-cherry-f0ba` was on old pgallivan@outlook.com account and is not accessible)

## Key facts

- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS (NOT VentraIP)
- carnivaltiming.com: was on Google Domains, now on CF
- Stripe approval: Google sign-in with pat_gallivan@hotmail.com (NOT paddy@luckdragon.io)
- CF account: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- Firebase project: `willy-district-sport`
- Firebase SDK: v9.23.0 compat layer

## Outstanding (not urgent)

- ASIC Corporate Key — postal letter ETA ~2026-05-02. Company registration CONFIRMED ✅ (ASIC email received 2026-04-30, ACN 697 434 898). Once key arrives, register at asic.gov.au/company-officeholders. Certificate download link expires 30 days from registration email — download if not already done.
- info@sportportal.com.au email setup — not done
