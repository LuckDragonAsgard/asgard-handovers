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
| `marshal` | XC Marshal — tap-to-record finishers |
| `xc-admin` | XC Race Control |
| `video-finish` | Camera capture + frame-accurate finish marking |
| `share` | QR code join page |

---

## Video Finish Feature (v5+)

Auto-starts recording when race goes LIVE. Operator stands at the finish line pointing camera across it.

**Flow:**
1. Enter Video Finish role → rear camera opens
2. Race GOes → recording starts automatically (server-synced)
3. Finish → tap "Stop & Review"
4. Scrub frame-by-frame (‹ › = 1 frame = 1/60s)
5. Tap "Mark Athlete at This Frame" → lane picker appears (lanes 1–8)
6. Select lane → mark saved with `{ lane, place, elapsedMs }`
7. Place order auto-assigned by elapsed time
8. "Publish Times" → writes to `race/current/videoFinish.marks`

**Time calculation:**
```
elapsedMs = (vfRecStartServerMs + video.currentTime * 1000) - vfRaceStartMs - offsetMs
```

**Offline fallback:** if no WS connection after 3s, banner shows. Operator taps Record at GO manually.
Elapsed = `video.currentTime * 1000 - offsetMs`

**Reaction offset:** configurable input (default 75ms). Accounts for GO→record-start lag.

**Data published:**
```js
race/current/videoFinish: {
  marks: { [lane]: { lane, place, elapsedMs } },
  offsetMs,
  offlineMode,
  recordedBy,
  publishedAt
}
```

---

## Deploy Commands

### Frontend (CF Pages) — Direct API (wrangler times out in sandbox)
```python
import urllib.request, json, hashlib

TOKEN   = "<from asgard-tools get_secret CF_API_TOKEN>"
ACCOUNT = "a6f47c17811ee2f8b6caeb8f38768c20"
PROJECT = "carnival-timing"

with open('index.html', 'rb') as f:
    content = f.read()
file_hash = hashlib.sha256(content).hexdigest()
boundary = "----CFDirect9abc"
CRLF = b'\r\n'

def part(name, value, filename=None, ctype=None):
    hdr = f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"'
    if filename: hdr += f'; filename="{filename}"'
    hdr += '\r\n'
    if ctype: hdr += f'Content-Type: {ctype}\r\n'
    hdr += '\r\n'
    if isinstance(value, str): value = value.encode()
    return hdr.encode() + value + CRLF

body = (
    part('manifest', json.dumps({'/index.html': file_hash})) +
    part('file', content, filename='/index.html', ctype='text/html; charset=utf-8') +
    f'--{boundary}--\r\n'.encode()
)
req = urllib.request.Request(
    f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/deployments',
    data=body, method="POST",
    headers={"Authorization": f"Bearer {TOKEN}",
             "Content-Type": f"multipart/form-data; boundary={boundary}"}
)
with urllib.request.urlopen(req, timeout=40) as r:
    d = json.load(r)
print("Deploy URL:", d['result']['url'])
```

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
- **wrangler times out (>45s)** in sandbox — use Direct API Python script above instead

---

## Session log

| Date | Version | Change |
|---|---|---|
| 2026-04-28 | v3 | Replace Firebase with CF DO, fix GO broadcast bug |
| 2026-04-28 | v4 | WS shim seq counter, gap detection |
| 2026-04-28 | v5 | Hibernatable WS, DO alarm TTL, server timestamp for GO |
| 2026-04-29 | v5+ | Video finish: auto-record, frame scrub, lane picker (1-8), reaction offset, offline fallback |
