# SportPortal — Session 13 EOD (2026-04-29)

## Status: ALL GREEN

All 4 domains confirmed live:
- sportportal.com.au ✅ 200
- schoolsportportal.com.au ✅ 200 (all demo routes working, Worker Route set)
- sportcarnival.com.au ✅ 200
- carnivaltiming.com ✅ 200

Pitch deck: github.com/LuckDragonAsgard/schoolsportportal/blob/main/docs/sportportal-pitch.docx

## Session 13 deliverables

- GitHub token rotated: LuckDragonAsgard PAT (no expiry, repo scope) saved to vault as GITHUB_TOKEN
- Pitch deck pushed to LuckDragonAsgard/schoolsportportal/docs/sportportal-pitch.docx
- Exposed Discord webhook DELETED via API (was live ~40 min after accidental push to asgard-handovers)
- cowork-memory/identity.md scrubbed of webhook URL (both in GitHub and local memory)
- Vault DISCORD_WEBHOOK_ASGARD marked REVOKED — create new webhook in Discord server settings
- Asgard D1 updated: sport-carnival status active, infra_state all-green, pitch_documents → GitHub, schoolsportportal github_repo → LuckDragonAsgard

## Architecture (current as of 2026-04-29)

All 4 domains live on Luck Dragon Main CF account (a6f47c17811ee2f8b6caeb8f38768c20):

| Domain | CF Pages project | NS pair |
|---|---|---|
| sportportal.com.au | sportportal | coraline + renan |
| schoolsportportal.com.au | schoolsportportal | coraline + renan |
| sportcarnival.com.au | (auto-attached) | (CF) |
| carnivaltiming.com | carnival-timing | liv + quinton |

Worker Routes (zone-level, set via CF dashboard):
- schoolsportportal.com.au/* → schoolsportportal worker ✅
- sportcarnival.com.au/* → sportportal worker ✅

Firebase: willy-district-sport, australia-southeast1, SDK v9.23.0 compat

## Key facts

- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS
- carnivaltiming.com: CF Registrar
- Stripe: pat_gallivan@hotmail.com (NOT paddy@luckdragon.io)
- CF account: a6f47c17811ee2f8b6caeb8f38768c20 (Luck Dragon Main)
- Firebase: willy-district-sport
- GitHub repos: LuckDragonAsgard/schoolsportportal (primary), PaddyGallivan/sportportal
- GitHub token in vault: LuckDragonAsgard account PAT (GITHUB_TOKEN)

## Asgard D1 — SportPortal facts (all populated)

- sportportal:cost_model_figures — $8.36M breakdown by role
- sportportal:real_pricing — $1/student/yr, District $150, Division $250, Region $500
- sportportal:revenue_projections_5yr — Year 1 ~$32k → Year 5 ~$367-500k ARR
- sportportal:hours_per_role — PE 51hrs/yr, District 112.5hrs/yr, Division 133.5hrs/yr
- sportportal:email_catalog — 33 email types across 9 categories
- sportportal:external_stakeholders — 6 stakeholder categories
- sportportal:transport_cascade — 8 docs per school per carnival
- sportportal:ssv_structure — 1,600 schools, 232 districts, 55 divisions, 16 regions

## Outstanding (action required)

- Create new Discord webhook in server settings → save URL to vault as DISCORD_WEBHOOK_ASGARD
- ASIC Form 484 (Corporate Key) — postal letter ETA ~2026-05-02
- info@sportportal.com.au email — not done
- Paddys own pages: /hobsonsbay and /williamstowndistrict not yet built
