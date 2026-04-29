# Carnival Timing — Handover

**Live:** https://carnivaltiming.com  
**CF Pages project:** `carnival-timing` (Luck Dragon Main `a6f47c17811ee2f8b6caeb8f38768c20`)  
**WS Worker:** `carnival-timing-ws` → https://carnival-timing-ws.pgallivan.workers.dev  
**Current version:** v8.2 (deployed 2026-04-29)  
**Frontend source:** fetch from live site each session (no Drive/GitHub copy)  
**Worker source:** recreate from this handover each session (ephemeral)

---

## Architecture

Single-file SPA (`index.html`) deployed to CF Pages.  
Real-time sync via Cloudflare Durable Object (`CarnivalRoom`) over WebSocket.  
Custom Firebase-compatible DO client (no actual Firebase SDK — `const firebase = {...}` wrapper).

---

## Key Features (v8.2)

### Track/Field Race Control
- Admin arms race (age, gender, event, lane names)
- Countdown → GO → timers record splits per lane
- **Multi-timer:** multiple timers on same lane — splits stored at `race/current/splits/{lane}/{timerKey}`, averaged via `trimmedMean()` (drops top/bottom outliers when ≥4 values)
- Admin publishes → results written to `results/{key}`
- Results Board shows all published events

### DQ Flags (v8.2)
- Per-lane DQ toggle button in admin done panel (before publish)
- `dqSet = new Set()` tracks DQ'd lanes; cleared on publish/new race
- DQ'd lanes sorted after non-DQ; only non-DQ lanes get place numbers
- DQ column in CSV export

### Heat Picker (v8.2)
- `_promptHeat(callback)` modal shown on publish — options: Heat 1, Heat 2, Heat 3, Final, (none)
- Heat suffix appended to event name in published results (e.g. "100m Sprint — Heat 1")

### Admin PIN Protection (v8.2)
- `_checkAdminPin(onSuccess)` gate on admin role entry
- `_pinModal(title, callback, isNew)` — numpad UI (0-9 + backspace)
- PIN stored in `carnivalMeta.adminPin` via `cRef('meta').update()`
- First-time: prompted to set a PIN; subsequent joins: must enter it

### CSV Export (v8.2, fixed)
- `exportCSV()` — async, reads from `cRef('results').once('value')`
- Uses `r.results` field (not `r.lanes`); includes DQ column
- Downloads all published results as CSV

### XC Marshal
- Marshal taps → time captured immediately (non-blocking)
- `bibPendingQueue` FIFO — bib entry at bottom of screen, queued
- Finishes stored at `xc/current/finishes/{place}` with `{elapsedMs, name}`

### Video Finish (vfMode: SWIM or TRACK)
- **SWIM mode:** per-lane vertical strip detection; end-wall camera; detects peak brightness in each lane's column
- **TRACK/XC mode:** whole-frame pixel diff against baseline; auto-calibrates threshold from 1.5s baseline; two-pass scan
- Records video + detection markers; admin reviews and assigns to lanes

### Demo / URL Deep-link
- `?code=XXXX&name=Name&role=admin&seed=1` → auto-joins carnival, optionally seeds fake data
- `_seedTestCarnival()` seeds 3 published results + armed 200m Sprint + armed XC race
- Demo page at `carnivaltiming.com/demo.html`

### Other
- `expiresAt: now + 7days` TTL on carnival creation
- Beforeunload warning during active race
- Edit names button in admin live panel

---

## Data Schema

```
{carnivalCode}/
  meta/         → {school, name, sport, createdAt, expiresAt, adminPin}
  race/current/ → {raceId, age, gender, event, state, lanes, splits, armedAt, startedAtServer}
    splits/{lane}/{timerKey} → {elapsedMs}
  xc/current/   → {raceId, age, gender, event, state, finishes, armedAt}
    finishes/{place} → {elapsedMs, name}
  results/{key} → {type:'lane'|'xc', age, gender, event, raceId, results/places, publishedAt}
```

---

## Deploy

**ALWAYS use wrangler, not the direct API.** The direct REST API accepts requests but files serve 500.

```bash
# One-time install (use fresh dirs to avoid owned-cache issues)
mkdir -p /tmp/nc2 /tmp/nl2
npm_config_cache=/tmp/nc2 npm install --prefix /tmp/nl2 wrangler --no-fund --no-audit

# Deploy
export CLOUDFLARE_API_TOKEN="<from vault: CF_API_TOKEN>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
export HOME=/tmp/wrangler-home && mkdir -p $HOME

mkdir -p /tmp/ct-deploy
cp /path/to/ct-fix.html /tmp/ct-deploy/index.html

cd /tmp && /tmp/nl2/node_modules/.bin/wrangler pages deploy /tmp/ct-deploy \
  --project-name=carnival-timing --branch=main \
  --commit-message="v8.2 update"
```

**Key footguns:**
- Run wrangler from `/tmp` (not `/sessions/...`) — /sessions fills at 9.3/9.8GB, wrangler mkdtemp fails
- Use fresh `nc2`/`nl2` dirs — `/tmp/npm-cache` is owned by `nobody` from prior sessions
- Direct API always returns success but serves HTTP 500 — wrangler only
- WS worker reads firebase-compat DO client on connect; `carnivalCode` is the room key

---

## WS Worker (`carnival-timing-ws`)

Cloudflare Durable Object worker. `CarnivalRoom` DO:
- WebSocket upgrade on connect
- Persists state in DO storage (`alarm` TTL 7 days)
- Sequential counter `seq` for ordering
- Broadcasts to all connected clients on write
- Supports `.set()`, `.update()`, `.once()`, `.on()` matching the firebase-compat API

**Recreate worker:** fetch via `workers_get_worker_code('carnival-timing-ws')` CF MCP tool, or read from previous session transcript.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v8.2 | 2026-04-29 | DQ flags per lane, heat picker on publish, admin PIN, CSV export fix |
| v8.1 | 2026-04-29 | Observer auto-join fix, initResultsView fix, showSharePage fix |
| v8 | 2026-04-29 | Swim mode video finish (per-lane strip), XC bib pending queue, seed/demo URL params |
| v7 | 2026-04-28 | Track/XC video finish auto-detect, multi-timer trimmedMean, XC marshal tap-first flow |
| v6 | 2026-04-28 | Video finish lane picker + reaction offset + offline fallback |
| v5 | 2026-04-27 | DO v8, real-time WS sync, full role system |
