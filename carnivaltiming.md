# Carnival Timing — Handover

**Live:** https://carnivaltiming.com (CF Pages `carnival-timing`, account: Luck Dragon Main `a6f47c17`)
**WS Worker:** `carnival-timing-ws` → https://carnival-timing-ws.pgallivan.workers.dev
**Frontend source:** fetch from live site each session (no Drive copy)
**Worker source:** recreate `/tmp/ct-worker/worker.js` from this doc each session (ephemeral)

---

## Architecture

Single HTML file app. No framework. Cloudflare Pages for hosting.
Realtime backend: **Cloudflare Durable Objects** (one DO per carnival code).
WebSocket shim wraps Firebase-like `db.ref(path).on/set/update/push` API.
No Firebase dependency — fully replaced.

### Stack
- CF Pages → static HTML (`carnival-timing` project)
- CF Worker `carnival-timing-ws` → WS routing, creates DO per carnival code
- `CarnivalRoom` Durable Object → hibernatable WS, seq counter, DO alarm TTL

---

## Worker v5 (current)

Key design decisions:
- `broadcast()` sends to ALL sessions (including sender) — required for GO to reach client
- Seq counter: every snapshot carries monotonic `seq`; client re-subscribes on gap
- DO alarm: `setAlarm(expiresAt)` where expiresAt = `meta.expiresAt || now + 7 days`
- `alarm()` calls `deleteAll()` + closes all WS code 1001

### WS Protocol

| Message | Description |
|---|---|
| `create` | Create carnival (idempotent) |
| `get` | Read path → `snapshot` |
| `set` | Overwrite path, broadcasts |
| `update` | Merge-update, broadcasts |
| `push` | Append child, broadcasts |
| `remove` | Delete path, broadcasts |
| `subscribe` | Register for live updates |
| `unsubscribe` | Remove subscription |
| `servertime` | Get server timestamp |

---

## Frontend Roles

| Role | Description |
|---|---|
| `admin` | Race Control — ARM / GO / RECALL / ABANDON / PUBLISH |
| `starter` | GO button only |
| `timer` | Live clock, shows recalled/live/done state |
| `results` | Live results board |
| `marshal` | XC Marshal — tap-to-record finishers with bib numpad |
| `xc-admin` | XC Race Control |
| `video-finish` | Camera capture + auto-detect finish crossings |
| `share` | QR code join page |

---

## Video Finish Feature (v8)

Auto-starts recording when race goes LIVE. Two modes:

### Swim Mode (end-wall camera)
Camera points at pool end-wall, capturing all lanes in one shot.
Each lane = a distinct vertical column. No lane labelling needed.
- Set lane count (4/6/8/10) before recording
- After stop → auto-scan detects FIRST crossing per lane
- Per-lane baseline calibrated from first 1.5s of video
- Threshold = max(6, baseline × 3.5)
- Two-pass: rough scan at 100ms, then 1/60s refinement ±0.3s around peak
- Results show lane + place + elapsed time

### Track / XC Mode (finish-line camera)
Camera points across finish line. Whole-frame pixel diff detects each athlete.
- Auto-calibrate threshold from first 1.5s baseline
- Rough scan at 100ms, min 0.5s gap between events
- Refine ±0.35s at 1/60s steps
- Results show place + elapsed time (no lanes)

### Offline Fallback
If no WS connection after 3s, banner shows.
Elapsed = `video.currentTime * 1000 - offsetMs`.

### Reaction Offset
Default 75ms. Accounts for GO→record-start lag.

**Time formula:**
```
elapsedMs = (vfRecStartServerMs + video.currentTime * 1000) - vfRaceStartMs - offsetMs
```

**Published to:** `race/current/videoFinish.marks`

---

## XC Marshal (v8)

Fully non-blocking tap flow:
1. Tap "TAP FINISH" button at top → time recorded immediately, client-gen key written to DB
2. Bib numpad slides up at bottom (doesn't cover tap button)
3. Enter bib digits → Confirm (or Skip)
4. Queue (`bibPendingQueue`) handles burst taps — next bib auto-shows after confirm

```js
const key = myId.slice(0,4) + '-' + Date.now().toString(36); // client-gen key
await cRef(`xc/current/finishes/${key}`).set({ marshalId, bib:'', elapsedMs, tapAt });
```

---

## Deploy Commands

### Frontend (CF Pages) — use `requests` library, NOT urllib multipart

```python
import hashlib, json, requests

TOKEN   = "cfut_..."   # from ASGARD_VAULT KV → CF_API_TOKEN
ACCOUNT = "a6f47c17811ee2f8b6caeb8f38768c20"
PROJECT = "carnival-timing"

with open("ct-fix.html", "rb") as f:
    file_data = f.read()
file_hash = hashlib.sha256(file_data).hexdigest()

resp = requests.post(
    f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/deployments",
    headers={"Authorization": f"Bearer {TOKEN}"},
    data={"manifest": json.dumps({"/index.html": {"hash": file_hash, "size": len(file_data)}})},
    files={file_hash: ("index.html", file_data, "text/html")},
)
print(resp.json().get("result", {}).get("url"))
```

**Key:** `manifest` must be `data=` (plain form field), NOT inside `files=`. The file hash is the field name.

### Worker (DO backend)
```bash
cd /tmp/ct-worker
npx wrangler@latest deploy
```

**wrangler.toml:**
```toml
name = "carnival-timing-ws"
main = "worker.js"
compatibility_date = "2024-09-23"

[[durable_objects.bindings]]
name = "CARNIVAL_ROOM"
class_name = "CarnivalRoom"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["CarnivalRoom"]
```

---

## Data Schema

```
data/
  meta/         { code, school, createdAt, expiresAt }
  race/
    current/    { state, age, gender, event, startedAtServer, raceId, lanes[], videoFinish{} }
  xc/
    current/    { state, age, gender, event, startedAtServer, raceId, finishes{} }
  results/      { [key]: race result }
  recall/       { active: bool }
  seq           monotonic integer
```

---

## Footguns

- Worker /tmp is ephemeral — recreate from this doc each session
- CF Pages `carnival-timing` is under **Luck Dragon Main** (`a6f47c17`), not Luck Dragon (`b6a2ea8732`)
- `broadcast()` must NOT exclude sender — that was the original GO bug
- Write tool doesn't persist to /tmp — use bash cat or Python
- CF ENOSPC on wrangler logs is non-fatal
- **wrangler times out (>45s)** in sandbox — use Direct API Python (requests) script above
- **manifest must be `data=` not `files=`** — CF API parses it differently; using files= gives 8000096 error

---

## Session log

| Date | Version | Change |
|---|---|---|
| 2026-04-28 | v3 | Replace Firebase with CF DO, fix GO broadcast bug |
| 2026-04-28 | v4 | WS shim seq counter, gap detection |
| 2026-04-28 | v5 | Hibernatable WS, DO alarm TTL, server timestamp for GO |
| 2026-04-29 | v5+ | Video finish: auto-record, frame scrub, lane picker (1-8), reaction offset, offline fallback |
| 2026-04-29 | v6 | Auto-detect crossings via pixel diff — finish line zone, 2-pass scan, inline lane assignment, manual fallback |
| 2026-04-29 | v7 | Swim mode: per-lane strip detection (vertical columns, end-wall camera). Track/XC mode: whole-frame pixel diff. Auto-calibrate threshold from first 1.5s baseline. Two-pass scan (100ms rough + 1/60s refinement). |
| 2026-04-29 | v8 | XC marshal overhaul: tap captures time immediately (non-blocking), bib entry queued in numpad panel at bottom, bibPendingQueue handles rapid multi-taps, client-gen keys for instant DB write. |
