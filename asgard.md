# Asgard 7.0 — Canonical handover

**Live:** [asgard.pgallivan.workers.dev](https://asgard.pgallivan.workers.dev) — currently v7.9.2.

**Canonical store:** this file (`github.com/PaddyGallivan/asgard-handovers/asgard.md`). Drive copies are pointers only.

---

## Source pinned in this repo

Live worker source for the four core CF Workers is committed under:
- [`sources/asgard.js`](sources/asgard.js) — dashboard worker (currently v7.9.2)
- [`sources/asgard-tools.js`](sources/asgard-tools.js) — agent loop + admin endpoints
- [`sources/asgard-brain.js`](sources/asgard-brain.js) — D1 service for the products table + cloud-sync
- [`sources/asgard-vault.js`](sources/asgard-vault.js) — secret store

Re-pin after each significant deploy by running the live against the CF API and committing the extracted body.

---

## Live infrastructure

### Asgard dashboard — `asgard.pgallivan.workers.dev`
- Single-page chat + Project Hub built on Cloudflare Worker.
- **Project Hub** (added Session 3): pulls 51 rows live from the `products` table in `asgard-brain` D1. Includes status grouping, detail view with revenue Y1/Y2/Y3, income_priority, full description, edit/add/delete that round-trip to D1.
- **Other features (v7.8.0+):** theme picker, model picker (Claude/OpenAI/Gemini with pricing), live-sync update banner, project tiles + filter chips + sort, PIN gate, cloud-sync of conversations to D1, bridges modal (Chrome + Desktop), settings/stats/deploy modals, image attachments, TTS speak, Slack/Telegram message forwarders, debug info, heartbeat dots in sidebar.
- **PIN stored in localStorage** as `asgard.pin.v1` — set via Settings → X-Pin field in the dashboard UI.

### Asgard tools — `asgard-tools.pgallivan.workers.dev`
Endpoints: `/health`, `/tools`, `/chat/smart` (Claude agent loop with `http_request`/`get_worker_code`/`deploy_worker`/`get_secret`), `/admin/projects` (live CF inventory, public read-only), `/admin/deploy` (X-Pin, body `{worker_name, code_b64, main_module?}`), `/admin/patch` (find/replace).

**Known deploy bug:** `/admin/deploy` crashes with 1101 (CF unhandled exception) regardless of PIN. Use `sly-deploy` relay pattern or direct CF API instead.

### gh-push relay — `gh-push.pgallivan.workers.dev`
**FIXED 2026-04-28** — now requires `Authorization: Bearer <GH_PUSH_BEARER>` on every request. Returns 401 without it. Bearer value set as CF Worker secret. To call:
```
POST https://gh-push.pgallivan.workers.dev/
Authorization: Bearer <GH_PUSH_BEARER from CF dashboard secrets>
Content-Type: application/json
{"owner":"...", "repo":"...", "path":"...", "message":"...", "content":"<base64>", "branch":"main"}
```
To get the bearer for a new session: either check CF dashboard → Workers → gh-push → Settings → Variables & Secrets, or reset it to a new known value via CF API (PUT `/secrets` with `GH_PUSH_BEARER`).

> **Preferred path:** asgard-tools calls GitHub Contents API directly using `env.GITHUB_TOKEN` — bypass gh-push entirely. gh-push is only for external/automated callers.

### GitHub writes
Direct GitHub Contents API. Token in vault as `GITHUB_TOKEN` (or bound directly to asgard-tools).

---

## CF tokens

- **Worker-scoped token:** vault → `CF_API_TOKEN` (also as `CF_API_TOKEN` in asgard-tools binding). Scope: Edit Cloudflare Workers only. Use for Worker deploys.
- **Zone-edit token:** NOT in vault. Required for CF Transform Rules, zone rulesets, HSTS, firewall rules. Create in CF dashboard if needed.

---

## Known issues / blocked

1. **`/admin/deploy` 1101 crash** — crashes before PIN check. Use direct CF API instead (token from vault).
2. **`get_worker_code` multipart parser BROKEN** — fix: try `Accept: application/json` and parse `result.script`, or strip multipart boundary manually from raw response.
3. **Zone Transform Rules** — can't set X-Frame-Options / Permissions-Policy / HSTS on CF Pages sites via `_headers` (CF Pages blocks them). Needs zone-edit token to add via Rulesets API, or manual CF dashboard → Zone → Transform Rules.

---

## Security state (2026-04-28)

| Asset | Security headers |
|---|---|
| `wps.carnivaltiming.com` (CF Worker `wps-hub-v3`) | ✅ HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| `carnivaltiming.com` (CF Pages) | ⚠️ X-Content-Type-Options + Referrer-Policy (CF defaults). X-Frame-Options/HSTS/Permissions-Policy blocked by CF Pages. |
| `gh-push.pgallivan.workers.dev` | ✅ Now auth-gated with bearer token |
| Other CF Pages sites | ⚠️ Same CF defaults only |

---

## Pending / next session

1. **Zone Transform Rules** for carnivaltiming.com — add X-Frame-Options + Permissions-Policy + HSTS via CF dashboard (or create zone-edit token). Affects all CF Pages sites on the zone.
2. **Fix `get_worker_code` parser** (unblocks `/admin/patch`).
3. **asgard-tools `/admin/deploy` 1101 bug** — debug CF unhandled exception, likely a missing binding or syntax issue in the deploy endpoint.
4. **GOOGLE_SA_JSON** for kbt-api Worker — get from GCP project `bubbly-clarity-494509-g0`, set via CF API or dashboard.

---

## Live inventory snapshot

CF Workers (~113): asgard, asgard-tools, asgard-brain, asgard-vault, asgard-ai, asgard-email, asgard-email-ui, asgard-memory, asgard-monitor, asgard-watchdog, asgard-pingtest, asgard-build, asgard-deploy-helper, asgard-comms, asgard-auth, asgard-agent, asgard-intelligence, asgard-ranking, asgard-workers, ai-job-processor, bomber-boat-api, bout-transcribe, bulldogs-boat-api, cf-route-bootstrap, circuit-breaker, comms-hub, comms-hub-integrator, **gh-push (now auth'd)**, craftsman, wps-hub-v3, kbt-api, sly-app, sly-api, sly-deploy, and ~80 others.

CF Pages (10): bomber-boat-git, carnival-timing (carnivaltiming.com), schoolsportportal, sportcarnival-hub, sportportal, superleague-tipping, wps-staff-hub, bomber-boat (legacy), falkor-app, v0-dental-loyalty-app.

Always re-pull live inventory via `GET https://asgard-tools.pgallivan.workers.dev/admin/projects`.

---

## Session history (compressed)

- **Session 1:** v6.5.0 dashboard built with Claude-style chat + 39 hardcoded projects.
- **Session 2:** patched `get_secret` env-first, bound `GITHUB_TOKEN` to asgard-tools, added `/admin/deploy` and `/admin/projects`, switched to direct GitHub Contents API after `gh-push` broke.
- **Session 3:** discovered the 49 D1 products were never lost; built D1 product hub (v7.8.1 → v7.8.2). Hit a deployment conflict.
- **Session 4 (2026-04-27):** consolidated handovers off Drive into this GitHub repo. Drive `*-HANDOVER-EOD.md` files now pointers only.
- **Session 5 (2026-04-27):** Drive evacuation (R2), Asgard worker stack patched.
- **Session 6 (2026-04-28):** Portfolio reassessment. Rotated Superleague CF token (invalid). Patched sportportal source Singapore→Sydney. Registered all projects in Asgard D1 (51 rows). Full security audit. gh-push committed with auth fix.
- **Session 7 (2026-04-28):** **Security hardening.** gh-push bearer auth deployed + GH_PUSH_BEARER secret set on CF worker. kbt-api confirmed live (FAL + Anthropic keys set). Security headers deployed to wps-hub-v3 (all 5). carnivaltiming.com `_headers` deployed but CF Pages blocks X-Frame-Options/HSTS/Permissions-Policy. Real PIN confirmed working (`asgard.pin.v1` in Asgard dashboard localStorage). CF API token fresh from vault for Worker deploys.
