# Asgard 7.0 — Canonical handover

**Live:** [asgard.pgallivan.workers.dev](https://asgard.pgallivan.workers.dev) — currently v7.9.1.

**Canonical store:** this file (`github.com/PaddyGallivan/asgard-handovers/asgard.md`). Drive copies are pointers only.

---

## Source pinned in this repo

Live worker source for the four core CF Workers is committed under :
- [`sources/asgard.js`](sources/asgard.js) — dashboard worker (currently v7.9.2)
- [`sources/asgard-tools.js`](sources/asgard-tools.js) — agent loop + admin endpoints
- [`sources/asgard-brain.js`](sources/asgard-brain.js) — D1 service for the products table + cloud-sync
- [`sources/asgard-vault.js`](sources/asgard-vault.js) — secret store

Re-pin after each significant deploy by running the live  against the CF API and committing the extracted body. The CF response is multipart/form-data — strip the boundary headers + trailing  to get the JS body.

---


## Live infrastructure

### Asgard dashboard — `asgard.pgallivan.workers.dev`
- Single-page chat + Project Hub built on Cloudflare Worker.
- **Project Hub** (added Session 3): pulls 49 rows live from the `products` table in `asgard-brain` D1 (client-side fetch — see "CF zone fetch block" below). Replaces the old hardcoded 39-entry list. Includes status grouping, detail view with revenue Y1/Y2/Y3, income_priority, full description, edit/add/delete that round-trip to D1.
- **Other features (v7.8.0+):** theme picker, model picker (Claude/OpenAI/Gemini with pricing), live-sync update banner, project tiles + filter chips + sort, PIN gate, cloud-sync of conversations to D1, bridges modal (Chrome + Desktop), settings/stats/deploy modals, image attachments, TTS speak, Slack/Telegram message forwarders, debug info, heartbeat dots in sidebar.

### Asgard tools — `asgard-tools.pgallivan.workers.dev` (v1.0.11)
Endpoints: `/health`, `/tools`, `/chat/smart` (Claude agent loop with `http_request`/`get_worker_code`/`deploy_worker`/`get_secret`), `/admin/projects` (live CF inventory, public read-only), `/admin/deploy` (X-Pin: 2967, body `{worker_name, code_b64, main_module?}`), `/admin/patch` (find/replace — currently broken, see Known Issues).

Bound secrets: `ANTHROPIC_API_KEY`, `CF_API_TOKEN`, `GITHUB_TOKEN`.

### Asgard brain — `asgard-brain.pgallivan.workers.dev`
D1 SQL service. `POST /d1/query` (read), `POST /d1/write` (write). Header `X-Pin: 2967`. Body `{sql, params}`. Returns `Access-Control-Allow-Origin: *` so the browser can call it directly. Hosts the `products` table — 49 rows of projects + ideas with rich fields (project_name, category, status, live_url, tech_stack, description, next_action, progress_pct, revenue_y1/y2/y3, income_priority, key_features, scale_notes, cost_monthly, github_url, linked_workers, last_updated, notes).

### Asgard vault — `asgard-vault.pgallivan.workers.dev`
Secret storage. `GET /secret/{KEY}` with `X-Pin: 2967`. **Works from browser/PS/external; returns 404 from inside CF workers** (zone fetch block — bind secrets directly via CF API or `/admin/deploy` with a secret payload instead).

## Key facts

- CF Account ID: `a6f47c17811ee2f8b6caeb8f38768c20`
- Paddy PIN: `2967`
- GitHub org: `LuckDragonAsgard` (worker-related repos), `PaddyGallivan` (handover store)
- Default chat model: `claude-sonnet-4-5`
- Vault has the GitHub PAT under key `GITHUB_TOKEN`

## Footguns (learned the hard way)

1. **CF blocks worker→worker fetch in same zone.** `*.pgallivan.workers.dev → *.pgallivan.workers.dev` returns error 1042 / empty body. Always do these calls **client-side from the browser** or via service bindings. Symptom of getting it wrong: the response is silently empty / count 0. Brain's `Access-Control-Allow-Origin: *` makes client-side calls trivial.
2. **Edit-tool null-byte padding.** When the Edit tool shrinks a file in the agent's outputs mount, it can leave the file at the original byte length with the tail zero-padded — or worse, truncated mid-string. CF rejects with `SyntaxError: Invalid or unexpected token at <file>:<line>` pointing past EOF. Fix: `python3 -c "open(P,'wb').write(open(P,'rb').read().rstrip(b'\\x00'))"` before base64 + deploy. Better: prefer one-shot `Write` with the full new content over chained `Edit` calls when the file size will change meaningfully.
3. **TWO `asgard-home-v780` files in Drive — different workers, NOT versions.**
   - `asgard-home-v780.js` — Claude's 867-line D1 spike (v7.8.2). Don't deploy thinking it's the latest.
   - `asgard-home-v780 (1).js` — user's 1977-line full-feature v7.8.0 baseline. Build on this one.
   - `asgard-home-v783.js` — intermediate D1-on-v7.8.0 attempt.
   - Live (v7.9.1) source isn't yet pinned to a known Drive file — likely deployed direct from another agent without Drive snapshot.

## Deployment patterns

### Direct large-payload deploy (any size, no LLM)
```js
const code_b64 = btoa(unescape(encodeURIComponent(code)));
await fetch('https://asgard-tools.pgallivan.workers.dev/admin/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Pin': '2967' },
  body: JSON.stringify({ worker_name: 'asgard', code_b64, main_module: 'asgard.js' })
});
```

### Find/replace patch (small diffs — BROKEN by Issue #1)
`/admin/patch` is wired but the `get_worker_code` multipart parser corrupts the source it pulls down, so the patch deploys garbage. Fix is in pending.

### Chat-based (small workers ≤14KB)
POST to `/chat/smart` instructing the agent to `get_worker_code` + modify + `deploy_worker`. Browser usually times out at 60s; agent completes server-side — verify via `/health`.

### GitHub writes
Direct GitHub Contents API. Token in vault as `GITHUB_TOKEN` (or bound directly to asgard-tools). The `gh-push` worker is currently broken (CF 1042 globally) — go direct.

## Known issues / blocked

1. **`get_worker_code` multipart parser BROKEN.** CF Workers API returns multipart/form-data with no `Content-Type: application/javascript` substring inside. Current parser falls through to "raw fallback" returning the raw multipart body (including `--<boundary>`), which `deploy_worker` then rejects. Effect: `/admin/patch` cannot patch any worker; chat-based small patches via the agent loop also fail because Claude is given garbage code. Fix: try `?multipart=true` query, or `Accept: application/json` and parse `result.script`, or empirically inspect what `Content-Type` lines CF actually sends.
2. **`gh-push` worker** throws CF 1042 globally — retire it or fix; we use direct GitHub Contents API now.

## Pending / next session

1. Fix `get_worker_code` parser (unblocks `/admin/patch`).
2. Pin the v7.9.1 source — either snapshot it from the live worker once `get_worker_code` is fixed, or commit the current source to a `LuckDragonAsgard/asgard-dashboard` repo as the canonical location.
3. Decide whether to retire the heap of historical `asgard-home-v*.js` files on Drive (16 of them) — git history in the new repo replaces them.

## Live inventory snapshot

CF Workers (~111 returned by `/admin/projects` — many are dispatch-namespaced; the ~29 actively used ones include): asgard, asgard-tools, asgard-brain, asgard-vault, asgard-ai, asgard-email, asgard-email-ui, asgard-memory, asgard-monitor, asgard-watchdog, asgard-pingtest, asgard-build, asgard-deploy-helper, asgard-comms, asgard-auth, asgard-agent, asgard-intelligence, asgard-ranking, asgard-workers, ai-job-processor, bomber-boat-api, bout-transcribe, bulldogs-boat-api, cf-route-bootstrap, circuit-breaker, comms-hub, comms-hub-integrator, gh-push (broken), craftsman.

CF Pages (4): bomber-boat → bomberboat.com.au · carnival-timing → carnivaltiming.com · schoolsportportal → schoolsportportal.com.au · sportportal → sportportal.com.au.

LuckDragonAsgard repos (currently 4 + the `wcyms` family of stubs): cyms-club-app, district-sport, division-hub, falkor-app.

Always re-pull live inventory via `GET https://asgard-tools.pgallivan.workers.dev/admin/projects`.

## Session history (compressed)

- **Session 1 (pre-2026-04-26):** v6.5.0 dashboard built with Claude-style chat + 39 hardcoded projects.
- **Session 2 (2026-04-26):** patched `get_secret` env-first, bound `GITHUB_TOKEN` to asgard-tools, added `/admin/deploy` and `/admin/projects`, switched to direct GitHub Contents API after `gh-push` broke.
- **Session 3 (2026-04-27):** discovered the 49 D1 products were never lost; built D1 product hub (v7.8.1 → v7.8.2). Hit a deployment conflict where v7.8.2 was redeployed over a parallel v7.8.0 (theme/model/live-sync features). User's other Claude session resumed from that point and reached v7.9.1 with both feature sets merged.
- **2026-04-27 evening:** consolidated handovers off Drive into this GitHub repo. Drive `*-HANDOVER-EOD.md` files are now pointers only.
