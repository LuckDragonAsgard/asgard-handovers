# KBT — Handover
**Last updated:** 2026-04-29 (Session: AI tools + Question Engine)

## Canonical cold-start
Fetch and read: `https://raw.githubusercontent.com/LuckDragonAsgard/kbt-trivia-tools/main/RESUME-HERE.md`

## Live stack
| Layer | URL / ID |
|---|---|
| Host app | `luckdragonasgard.github.io/kbt-trivia-tools/host-app.html` |
| Player app | `…/player-app.html?code=EVENT_CODE` |
| Admin app | `…/admin-app.html` |
| Wrap | `…/wrap.html?event=EVENT&team=TEAMCODE` |
| Question candidates review | `…/question-candidates.html` |
| AI tools worker | `kbt-api.pgallivan.workers.dev` (Luck Dragon Main `a6f47c17`) |
| Question engine | `kbt-question-engine.pgallivan.workers.dev` (same account) |
| Repo | `LuckDragonAsgard/kbt-trivia-tools` (GH Pages, auto-deploy ~25s) |
| Supabase | `huvfgenbcaiicatvtxak.supabase.co` (ap-southeast-2, 35 tables) |

## AI tools — ALL ✅ (as of 2026-04-29)
`fact-check`, `ai-text`, `fal-morph`, `fal-faceswap`, `fal-inpaint`, `fal-rembg`, `generate-slides`

**Google Slides note:** GCP org policy blocks SA key creation on `bubbly-clarity-494509-g0`. Worker uses OAuth2 refresh token flow instead (client ID `342815819710-…`, secrets `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` set on worker). If refresh token expires, re-auth via OAuth Playground → `https://developers.google.com/oauthplayground`, scope `presentations`, account `paddy@luckdragon.io`.

**fal-rembg note:** Worker upload works; fal.ai CDN occasionally fails to serve the uploaded image back to its own rembg service. Platform-side issue — retry if it fails.

## Question Engine — NEW (2026-04-29)
- **Worker:** `kbt-question-engine.pgallivan.workers.dev`
- **Cron:** every 6 hours (`0 */6 * * *`) — runs automatically
- **Manual trigger:** `POST /run` with `{"max_facts": N}` (max 20)
- **Review UI:** `luckdragonasgard.github.io/kbt-trivia-tools/question-candidates.html`
- **DB table:** `kbt_question_candidates` (Supabase)
- **Pipeline:** scrape (Wikipedia random, On This Day, Reddit TIL) → Claude generates Q drafts → double fact-check (FC1 accuracy + FC2 devil's advocate) → quality score 10 criteria /50 → save with status
- **Thresholds:** 35+/50 → `pending_review`, 45+/50 → `APPROVED` verdict, <35 → `rejected`
- **Gambler flag:** only on questions scoring 45+/50 with zero FC issues
- **Sources:** `workers/kbt-question-engine.js` in the repo

## New question types in DB (ids 36–48)
Closest Wins, Connections, Two Truths One Lie, Emoji Decode, Chain Round, Lightning Round, Before & After, Picture Plus, Famous Firsts, Wipeout, Accumulator, Steal Round, Survivor

## New bonus/format tags
Event Format: HQ Live, Weekly School, Pub, Fundraiser, Work Function, Family
Round Mechanic: Accumulator, Steal, Survivor

## Product brief
Full brief at `docs/kbt-question-engine-brief.md` in the repo — covers quality criteria, all new question types, HQ Live format, Weekly School format, feature roadmap.

## Vault / secrets access
- Vault PIN rotated — now `PADDY_PIN` env binding (v1.2.0-pin-rotation). Do NOT rely on hardcoded `2967` directly.
- GitHub PAT: vault key is `GITHUB_TOKEN` (not `GITHUB_PAT_LUCKDRAGON`)
- Best path to secrets: `POST asgard-tools.pgallivan.workers.dev/chat/smart` with `get_secret("KEY_NAME")` — works with X-Pin: 2967 on asgard-tools

## Outstanding (non-blocking)
- HQ Live format — elimination logic + Realtime timer push (design in brief)
- Weekly School format — shorter event type, school-mode player app
- New question type UIs in host-app (Closest Wins input, Connections grid, Emoji display)
- Promote approved candidates → `kbt_question` table (admin button in question-candidates.html)
- fal-rembg CDN issue — monitor, raise with fal.ai support if persistent

## Session update — 2026-04-29 (generate-slides fixed)

### Bug fixes deployed (live hash: `fb4904ea`)
1. **`generate-slides` crash guard** — added guard after `createRes.json()`: `if (!pres.presentationId) return json({error:'Slides API failed',details:pres},500)`. Was crashing with `Cannot read properties of undefined` on any Slides API error.
2. **`accentBar` zero-weight outline** — `updateShapeProperties` had `weight: { magnitude: 0, unit: 'PT' }` which Google Slides API rejects (`INVALID_ARGUMENT`). Removed `outline` clause; shapes now only set `shapeBackgroundFill`.
3. **Google Slides API re-enabled** — GCP project `bubbly-clarity-494509-g0` had Slides API disabled. Re-enabled 2026-04-29 via GCP console (`paddy@luckdragon.io`).

### generate-slides now confirmed working ✅
Test: `GET https://kbt-api.pgallivan.workers.dev/api/generate-slides?event_id=5259`
Returns `{"ok":true,"slides_url":"...","venue":"The Steam Packet Hotel","slides":2,...}`

### GitHub source sync needed
`workers/kbt-api.js` in `LuckDragonAsgard/kbt-trivia-tools` is behind — live Worker has 2 fixes not yet in repo. Push `/outputs/kbt-api-patched.js` when convenient.
