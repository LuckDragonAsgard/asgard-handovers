# Asgard / Falkor — handover 2026-05-10

**Naming:** Asgard = platform. Falkor = agent. Don't conflate.

## What shipped (45 tasks, 1 day)

### Bugs fixed
- Vision PNG (mime auto-detect from base64 magic bytes in asgard-ai)
- Aeneas login (vault AENEAS_PIN added)
- /afl/comp empty (R9 tips seeded)
- Falkor chat JSON-parse crash on certain queries (defensive .catch on all sub-agent fetches; falkor-web stubbed)
- Self-heal logging (falkor-code D1 binding restored — was stripped 2026-05-07)
- Ghost endpoints (asgard-watchdog removed asgard/asgard-brain/asgard-backup, 8000 false alarms cleared)
- 26K stale HEALTH_FAIL decisions cleared, cortex projects pruned
- Drive OAuth widened to drive.readonly + LD_GOOGLE_REFRESH_TOKEN preferred over GOOGLE_REFRESH_TOKEN
- pinOk accepts `?pin=` query param (browser OAuth flow works)
- Asgard hub black-screen (apostrophe-in-template-literal at line 656)
- Brief tab showing wrong status (CF edge-loop on luckdragon.io probes; switched to workers.dev)

### Structural
- 11-probe functional smoke test on falkor-code, every 15 min via cron
- Apostrophe-trap regex catches the JS template-literal bug class
- All inter-worker URLs swapped to *.luckdragon.io (except asgard-tools brief probes)

### New Asgard hub features (live at falkor.luckdragon.io)
- 6 sidebar tabs: Home / Chat / Brief / Inbox / Spend / Sites (was 2)
- Home actually renders now (was defined but never called)
- Brief tab pulls /brief
- Inbox shows D1 msg_inbox per user
- Spend graceful placeholder (backend pending)
- Sites: 11 site cards with Open + "Edit via Falkor" buttons
- Personality layer locked (Cecil St, family, Essendon, projects, procrastination push-back, brain-first, AEST awareness)

### Other
- Leaked gist 13d6e09 deleted (had revoked credentials)
- mascot-gen.pages.dev built + deployed from kbt-mascot-generator
- Drive read access permanent

## Still outstanding
- **Voice clone** — needs 5-10 min audio sample from Paddy
- **Tool-calling (Jarvis)** — Falkor uses regex routing, not Anthropic tool_use
- **NS for longrangetipping.com.au + schoolstaffhub.com.au** — registrar logins needed
- **Squarespace 8-domain verification** — inbox click needed
- **Phase 81 PC bridge** — not running locally
- **/spend backend endpoint on asgard-tools** — UI placeholder live

## Smoke status
11/11 passing, 1.4s avg, persisted to falkor_smoke_results, alerts via decisions table.

## Pickup protocol
1. Read this doc
2. Hit https://asgard-tools.luckdragon.io/brief?pin=535554&user=paddy for live brief
3. Hit https://falkor-code.pgallivan.workers.dev/smoke (POST) for 11-probe status
