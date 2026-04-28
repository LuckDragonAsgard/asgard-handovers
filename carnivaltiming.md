# Carnival Timing — Handover

> **Canonical.** Overwrite in place each session. Git holds history.
> Last updated: 2026-04-29 (Session 2)

## Live URLs
| Thing | URL |
|---|---|
| App | https://carnivaltiming.com |
| CF Pages project | `carnival-timing` |
| WS Worker | https://carnival-timing-ws.pgallivan.workers.dev |
| Ping | https://carnival-timing-ws.pgallivan.workers.dev/ping |

## Architecture
Single HTML file + CF Durable Objects WebSocket backend. Zero Firebase. Zero third-party deps.

```
Browser ── WSS ──► CF Worker (carnival-timing-ws)
                      └──► CarnivalRoom DO (one per 4-letter carnival code)
                               ├── Durable Storage (race state, splits, meta, seq)
                               └── Hibernatable WebSockets (all connected clients)
```

**Why this:** ~50ms latency (vs ~500ms Firebase). One DO per carnival = zero shared state. Hibernatable WS = DO sleeps between messages. DO alarm = self-cleaning TTL. Scales to unlimited concurrent carnivals on $5/month CF Workers Paid.

## Worker (carnival-timing-ws) — v5

### wrangler.toml
```toml
name = "carnival-timing-ws"
main = "worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
[durable_objects]
bindings = [{ name = "CARNIVAL_ROOM", class_name = "CarnivalRoom" }]
[[migrations]]
tag = "v1"
new_classes = ["CarnivalRoom"]
```

### Deploy
```bash
cd /tmp/ct-worker   # recreate worker.js + wrangler.toml from this handover each session
export npm_config_cache=/tmp/npm-cache npm_config_prefix=/tmp/npm-global
PATH="/tmp/npm-global/bin:$PATH" \
CLOUDFLARE_API_TOKEN="$(vault CF_API_TOKEN)" \
CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20" \
wrangler deploy
```

Get token via: `POST https://asgard-tools.pgallivan.workers.dev/chat/smart` with `X-Pin: 2967`, body `{"message":"get_secret CF_API_TOKEN"}`.

### Key features
- **Hibernatable WS** — `state.acceptWebSocket` + `webSocketMessage()` lifecycle
- **Seq counter** — every snapshot has monotonic `seq` (stored in DO storage); client re-subscribes if gap detected
- **DO alarm TTL** — `setAlarm(expiresAt)` on create; `alarm()` calls `deleteAll()` + closes all WS with code 1001
- **Server timestamps** — `{'.sv':'timestamp'}` sentinel resolved server-side in `stamp()`
- **Broadcast to ALL** including sender — no `if (ws === sender) continue`

### WS protocol
| Client → DO | DO response | Notes |
|---|---|---|
| `{type:'create', meta}` | `created` or `error: code_taken` | sets alarm |
| `{type:'subscribe', path}` | `snapshot` with current data + seq | always fresh |
| `{type:'set', path, data}` | `ack` + broadcast snapshot | full replace |
| `{type:'update', path, data}` | `ack` + broadcast snapshot | shallow merge |
| `{type:'push', path, data}` | `pushed` (key) + broadcast snapshot | |
| `{type:'remove', path}` | `ack` + broadcast snapshot | |
| `{type:'get', path}` | `snapshot` | one-shot |
| `{type:'servertime'}` | `{ts: Date.now()}` | |

## Frontend (ct-fix.html)

**Location:** `G:\My Drive\ct-fix.html` → deployed as CF Pages `index.html`

### Deploy Pages
```bash
mkdir /tmp/ct-deploy && cp "G:/My Drive/ct-fix.html" /tmp/ct-deploy/index.html
cd /tmp/ct-deploy
PATH="/tmp/npm-global/bin:$PATH" \
CLOUDFLARE_API_TOKEN="$(vault CF_API_TOKEN)" \
CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20" \
wrangler pages deploy . --project-name=carnival-timing --branch=main
```

### WS shim (replaces Firebase, ~50 lines, starts at line ~1009)
Drop-in `db.ref(path)` API. Key behaviours:
- Auto-reconnects every 2.5s
- Re-subscribes all paths on reconnect → DO sends fresh snapshots → gap healed
- Buffers writes during disconnect; replays on reconnect
- Gap detection: `seq > lastSeq+1` → immediate re-subscribe
- `firebase.database.ServerValue.TIMESTAMP` → `{'.sv':'timestamp'}` → resolved server-side

### GO timing (no round-trip)
`adminGo()`, `starterGo()`, `xcAdminGo()` all use `ServerValue.TIMESTAMP` sentinel — NOT `getServerTime()`. The DO resolves the timestamp server-side. No extra WS round-trip before GO.

## Roles & timing algorithm

| Role | Notes |
|---|---|
| Race Control | Arms/fires/recalls, publishes results. One per carnival. |
| Timer | Taps STOP for one lane. 2–3 per lane recommended. |
| Starter | Fires GO from start line. Optional. |
| Observer | Live splits. Read-only. |
| XC Control | Arms/fires XC races, sees finish order. |
| XC Marshal | Taps finishers in finish chute order. |

**Trimmed mean:** 1 timer → direct. 2 timers → mean. 3+ timers → drop fastest + slowest, mean rest. No hard limit on timers.

## TTL / cleanup
On `create`: `state.storage.setAlarm(expiresAt)` where `expiresAt = meta.expiresAt || now + 7days`.
On alarm: `deleteAll()` + close all WS (code 1001, reason "Carnival expired"). Self-contained, no external scheduler.

## Known footguns
- `/tmp/ct-worker/` is **ephemeral** — recreate each session from this handover
- Check `tail -5 ct-fix.html` after edits — old truncation bug at line 2220 (fixed, but verify)
- Edit tool can leave `\x00` null bytes if file shrinks — CF deploy rejects; strip with python if needed
- DO migration tag `v1` already applied — do not add new migrations unless adding new DO classes
- CF worker→worker fetch on `*.pgallivan.workers.dev` returns 1042 — do calls client-side

## Session 2 summary (2026-04-29)
Replaced Firebase entirely with CF Durable Objects + WebSocket. Fixed GO broadcast bug (sender excluded). Switched to hibernatable WS. Added seq counter + gap detection. Added DO alarm TTL. Removed `getServerTime()` roundtrip from GO. Added how-to/roles/timer-count guide to home screen. All deployed and E2E tested.