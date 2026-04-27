# Superleague v4 — EOD Handover
**Session:** SLY 4.0 · **Live version: v4.18** · Status: deployed and verified

---

## TL;DR for next chat

**Live site** https://superleague.streamlinewebapps.com — green badge top-right shows current version.

**Read this file first.** Everything you need is below: credentials, deploy procedure, what's broken, what's been fixed.

To deploy a new version of `sly-app`:
1. Edit `G:\My Drive\sly-app-v2.js` (worker source)
2. Bump `var VER='vX.YY';` near top of patch script
3. Run: `node "G:\My Drive\sly-login-deploy.js"` — POSTs the file raw to relay → CF → live in ~10s
4. Hard-refresh site, confirm green badge shows new version

---

## What v4.18 fixes (all live, verified this session)

| # | Issue | Fix |
|---|---|---|
| 1 | Login broken (`/api/login` 404) | sly-app intercepts POST `/api/login`, verifies via PIN PATCH trick, returns coach |
| 2 | Coach-picker 54×28 rectangles on login | Universal CSS `img[src*="team-logos"]` → 64×64 rounded white tiles |
| 3 | Banter chat broken (`/api/banter` 404) | sly-app forwards GET/POST to `/api/messages` |
| 4 | Match Day "Could not load AFL scores" | Patch detects that text, replaces with rendered scores from `/api/scores` (logos + points, sorted desc) |
| 5 | Player initials never became headshots | Was using `/api/draft-picks` (lost champid field). Now uses `/api/players` (has champid for 492 players). Builds initials → champid map, swaps text for AFL CDN headshot. **138 photos active.** |
| 6 | The Fund — no team jumpers | Patch finds rows containing coach name + Paid/Unpaid, prepends coach.logo_url image. **Working.** |
| 7 | Gold details ($20 → $50, description) | Description rewrite works. $20→$50 still gets reverted by React re-render — see Pending |
| 8 | CORS preflight | OPTIONS handler for any `/api/*` |
| 9 | Visible version banner top-right (`v4.18 · LIVE` green) | Always-on, so we KNOW which version is showing — kills the "loading old versions" debate |
| 10 | Stronger no-cache headers | `Cache-Control: no-cache, no-store, must-revalidate, max-age=0` + CDN-Cache-Control no-store |

---

## Pending / known issues for next session

- **$20 → $50 in The Fund** — text node walker replaces it but React re-renders the `<strong>` and reverts. v4.19 hotfix already prepared on disk: dropped the `__slyG` marker so the patch runs idempotently each tick. **Just deploy** — `node "G:\My Drive\sly-login-deploy.js"` — to push v4.19 live.
- **Banter messages duplicated** (06:07 and 06:38 same text) — that's data dupe in `/api/messages`, not a patch issue. Would need to dedupe in sly-api or DB.
- **Fixtures** — user mentioned "jumpers suck in fixtures, dark and small". The universal `img[src*="team-logos"]` rule should catch them at 64×64 white. If they're still small after v4.18, the fixtures view may be wrapping them in a container with its own size constraints — needs DOM inspection in that view.
- **Player photo coverage**: 138/492 players have champid, others stay as initials.

---

## Deploy infrastructure

| Thing | Value |
|---|---|
| Live URL | https://superleague.streamlinewebapps.com |
| CF Account | `a6f47c17811ee2f8b6caeb8f38768c20` |
| CF Token (sly-deploy uses internally) | `<<see vault: SLY_CF_TOKEN — ROTATE, was leaked in Drive>>` |
| KV namespace (SLY_STATIC) | `4f427724561e48f682d4a7c6153d7124` |
| D1 database | `8d0b8373-40ea-4174-bfd9-628b790abf92` |
| sly-deploy relay URL | `https://sly-deploy.pgallivan.workers.dev/deploy/sly-app` |
| Deploy secret | `<<see vault: SLY_DEPLOY_BEARER>>` |
| sly-api base | `https://sly-api.pgallivan.workers.dev` |

**Critical relay quirk** — the relay does `await req.text()` and uses the body **raw** as worker source. **Never JSON-wrap** the body. Send with `Content-Type: application/javascript`, body is the worker JS itself. (JSON-wrapping causes CF to deploy the literal JSON `{"code":"..."}` as the worker → `Unexpected token ':' at 1:7`.)

**KV binding**: handled automatically by sly-deploy relay (it includes `bindings:[{type:'kv_namespace',name:'SLY_STATIC',namespace_id:'...'}]` in metadata). If you ever bypass the relay and hit CF API directly, you MUST include the binding or worker 500s with `env.SLY_STATIC undefined`.

---

## Files in Drive (all at `G:\My Drive\`)

| File | Purpose |
|---|---|
| `sly-app-v2.js` | sly-app worker source — **edit and re-deploy this** |
| `sly-login-deploy.js` | Node deploy script — `node "G:\My Drive\sly-login-deploy.js"` reads the worker source and POSTs raw to relay |
| `sly-deploy.js` | sly-deploy relay worker source (deployed once, runs forever; rarely needs re-deploy) |
| `deploy_sly.bat`, `deploy_sly_deploy.bat` | legacy bat alternatives |
| `sly-deploy-now.html` | failed file:// helper from earlier — can delete |

---

## Live API endpoint state (verified 2026-04-27)

**Working on sly-api directly:**
`/api/coaches` `/api/players` (491 with champid) `/api/draft-picks` `/api/ladder` `/api/scores` `/api/activity-feed` `/api/swap-requests` `/api/messages` `/api/rounds` `/api/coaches/:id/pin` (PATCH)

**404 on sly-api — handled in sly-app worker:**
`/api/login` (intercepted) · `/api/team-selections` (returns `[]` stub) · `/api/banter` `/api/chat` (forwarded to `/api/messages`) · `/api/match-day` `/api/current-round` (return `[]` stub)

**`/api/draft-picks` lost the `champid` field at some point** — that's why earlier player photo patches failed silently. Always pull champid from `/api/players` and join via player_id.

---

## Patch architecture (v4.18)

The worker injects ~18KB of JS+CSS before `</body>` of the KV-served HTML.

**Key components:**
- Visible green version banner top-right (`#sly-ver-banner`)
- Universal jersey CSS targeting `img[src*="team-logos"]` and `img[src*="hzkodmxrranessgbjjjl.supabase"]`
- `loadAll()` polls `/api/players`, `/api/coaches`, `/api/scores` every 30s
- `injectPlayerPhotos()` swaps initials text → AFL CDN headshot for any small element matching `^[A-Z]{2,3}$`
- `injectFundLogos()` finds Paid/Unpaid rows, prepends `<img>` from coach.logo_url
- `fillMatchDay()` replaces "Loading..." or "Could not load AFL scores" with rendered scores
- `fixGold()` walks text nodes, replaces `$20` with `$50`, rewrites stale Gold descriptions
- `MutationObserver` re-runs the patch suite on every DOM change (handles React re-renders)
- SLY Extras modal (`⭐` button, bottom right): Rosters, Activity, Swaps, Change PIN tabs

**Selectors are content-based, not class-based** — Lovable's class names are inconsistent across views (`.coach-cell`, `.coach-select-btn`, `.logo`, etc.). v4.16+ targets by image `src` patterns and text content matching, which works across Home/Fund/Fixtures/Match Day/Banter without per-view tweaking.

---

## How to start the next session

1. Read this file (you're doing it now)
2. Open https://superleague.streamlinewebapps.com — green badge top-right confirms live version
3. If badge says < v4.19: there's a v4.19 patch waiting on disk. Deploy: `node "G:\My Drive\sly-login-deploy.js"`
4. Smoke-test: login (any coach + their PIN), Banter sends/receives, Match Day shows scores, The Fund shows team jumpers
5. Pick next thing — Fixtures jumper sizing, dedupe banter messages, anything new

---

## Session ritual feedback (kept from prior sessions)

- Overwrite this one canonical `HANDOVER-EOD.md` at end of session — don't create new files per session
- Memory pointer in `superleague_handover.md` already points here — no need to update unless filename moves
