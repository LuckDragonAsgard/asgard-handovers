# Carnival Timing — Handover

**Live:** https://carnivaltiming.com (CF Pages `carnival-timing`, account: Luck Dragon Main `a6f47c17`)
**WS Worker:** `carnival-timing-ws` → https://carnival-timing-ws.pgallivan.workers.dev
**Frontend source:** `ct-fix.html` in session outputs (deploy each session via wrangler)
**Worker source:** `/tmp/ct-worker/worker.js` — recreate from this doc each session (ephemeral)

---

## Architecture

Single HTML file app. No framework. Cloudflare Pages for hosting.  
Realtime backend: **Cloudflare Durable Objects** (one DO per carnival code).  
WebSocket shim wraps Firebase-like `db.ref(path).on/set/update/push` API.  
No Firebase dependency — fully replaced.

### Stack
- CF Pages → static HTML
- CF Worker `carnival-timing-ws` → WS routing, creates DO per carnival code
- `CarnivalRoom` Durable Object → hibernatable WS, seq counter, DO alarm TTL

---

## Worker v5 (current)

```js
export class CarnivalRoom {
  // Hibernatable WS: DO sleeps between messages
  async fetch(request) {
    const [client, server] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, raw) { /* set/update/push/remove/subscribe/get/create/servertime */ }
  async alarm() { await this.state.storage.deleteAll(); /* close all WS */ }
  broadcast(changedPath, newValue, seq) { /* send to all subscribed sessions */ }
}
```

**Key design decisions:**
- `broadcast()` sends to ALL sessions (including sender) — required for GO to reach client
- Seq counter: every snapshot carries monotonic `seq`; client re-subscribes on gap
- DO alarm: `setAlarm(expiresAt)` where expiresAt = `meta.expiresAt || now + 7 days`
- `alarm()` calls `deleteAll()` + closes all WS code 1001

### WS Protocol

| Message type | Description |
|---|---|
| `create` | Create carnival with code (idempotent) |
| `get` | Read path, returns `snapshot` |
| `set` | Overwrite path, broadcasts |
| `update` | Merge-update path, broadcasts |
| `push` | Append child (Firebase-like push key), broadcasts |
| `remove` | Delete path, broadcasts |
| `subscribe` | Register for live updates on path |
| `unsubscribe` | Remove subscription |
| `servertime` | Get server timestamp |

Server responses: `snapshot`, `ack`, `pushed`, `created`, `error`

---

## Frontend Roles

| Role | Screen | Description |
|---|---|---|
| `admin` | Race Control | ARM / GO / RECALL / ABANDON / PUBLISH |
| `starter` | Starter | GO button only, receives ARM state |
| `timer` | Timer | Live clock from GO, shows recalled/live/done |
| `results` | Results | Live results board, all published events |
| `marshal` | XC Marshal | Tap-to-record finishers, tap count display |
| `xc-admin` | XC Race Control | XC ARM / GO / RECALL / PUBLISH |
| `video-finish` | Video Finish | Camera capture + frame-accurate finish marking |
| `share` | Join QR | QR code for spectators to join |

---

## Video Finish Feature (new in v5)

Auto-starts recording when race goes LIVE. Operator points phone at finish line.

**Flow:**
1. Open Video Finish role → camera opens
2. Race GOes → recording starts automatically (server time synced)
3. Race finishes → tap "Stop & Review"
4. Scrub video frame-by-frame to each athlete crossing
5. Tap "Mark" for each finish — elapsed time computed as:
   `elapsedMs = (vfRecStartServerMs + video.currentTime * 1000) - vfRaceStartMs`
6. "Publish Times" → writes to `race/current/videoFinish.marks`

**Elements:**
- `vf-video-preview`: live camera feed
- `vf-canvas`: frame-accurate review canvas
- `vf-scrubber`: seek bar (step = 1/60s)
- `vf-mark-list`: marked finish times
- `vf-review-video` (hidden): used for seeking/rendering

---

## Deploy Commands

### Frontend (CF Pages)
```bash
export CLOUDFLARE_API_TOKEN="<from asgard-tools get_secret CF_API_TOKEN>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
mkdir /tmp/ct-deploy
cp ct-fix.html /tmp/ct-deploy/index.html
cd /tmp/ct-deploy
npx wrangler@latest pages deploy . --project-name carnival-timing --branch main
```

### Worker (DO backend)
```bash
# Create /tmp/ct-worker/worker.js + wrangler.toml (see below)
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

## Data Schema (Durable Object storage)

```
data/
  meta/         { code, school, createdAt, expiresAt }
  race/
    current/    { state, age, gender, event, startedAtServer, raceId, lanes[], videoFinish{} }
  xc/
    current/    { state, age, gender, event, startedAtServer, raceId, finishes{} }
  results/      { [key]: race result object }
  recall/       { active: bool }
  seq           monotonic integer
```

---

## Footguns

- Worker /tmp is ephemeral — recreate worker.js from this doc each session
- CF Pages `carnival-timing` is under **Luck Dragon Main** (`a6f47c17`), not Luck Dragon (`b6a2ea8732`)
- `broadcast()` must NOT exclude sender — that was the original GO bug
- Write tool doesn't persist to /tmp — use bash `cat >` or Python for worker.js
- CF ENOSPC on wrangler logs is non-fatal

---

## Session log

| Date | Version | Change |
|---|---|---|
| 2026-04-28 | v3 | Replace Firebase with CF DO, fix GO broadcast bug |
| 2026-04-28 | v4 | WS shim seq counter, gap detection |
| 2026-04-28 | v5 | Hibernatable WS, DO alarm TTL, `getServerTime()` removed from GO |
| 2026-04-29 | v5+ | Video finish feature, home screen how-to guide, file tail recovery |

