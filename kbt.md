# KBT — Know Brainer Trivia Handover

**RESUME-HERE:** `github.com/LuckDragonAsgard/kbt-trivia-tools/blob/main/RESUME-HERE.md`

## Stack (as of 2026-04-29)

| Layer | Detail |
|-------|--------|
| Frontend | GitHub Pages — `LuckDragonAsgard/kbt-trivia-tools` (auto-deploy on push to main, ~25s) |
| Backend | CF Worker `kbt-api` on Luck Dragon Main (`a6f47c17`) |
| Database | Supabase `huvfgenbcaiicatvtxak.supabase.co` (ap-southeast-2, 34 KBT tables, RLS on) |
| Auth (Google) | OAuth2 refresh token — `paddy@luckdragon.io` / KBT Host App client |

## Live URLs

- **Host app:** `https://luckdragonasgard.github.io/kbt-trivia-tools/host-app.html`
- **Player URL:** `https://luckdragonasgard.github.io/kbt-trivia-tools/player-app.html?code=EVENT_CODE`
- **Admin app:** `https://luckdragonasgard.github.io/kbt-trivia-tools/admin-app.html`
- **Wrap:** `…/wrap.html?event=EVENT&team=TEAMCODE`
- **Backend Worker:** `https://kbt-api.pgallivan.workers.dev`
- **Vault:** `asgard-vault.pgallivan.workers.dev` X-Pin `2967`

## Secrets status (all ✅ as of 2026-04-29)

| Secret | Status | Notes |
|--------|--------|-------|
| `FAL_KEY` | ✅ set | fal.ai account `paddy@luckdragon.io`, $20 credits loaded 2026-04-28 |
| `ANTHROPIC_API_KEY` | ✅ set | Used for fact-check |
| `GOOGLE_CLIENT_ID` | ✅ set | `342815819710-sugohi5jr60hs2mfv1vgi4apfp3p2bjc` (KBT Host App) |
| `GOOGLE_CLIENT_SECRET` | ✅ set | Created 2026-04-29 (old secret hidden by GCP, new one created) |
| `GOOGLE_REFRESH_TOKEN` | ✅ set | `paddy@luckdragon.io` auth, scope: presentations. Generated via OAuth Playground 2026-04-29 |

**Note:** SA key approach abandoned — GCP org policy `iam.disableServiceAccountKeyCreation` enforced on `bubbly-clarity-494509-g0`. Worker now uses OAuth2 refresh token flow instead.

## Tool status (all ✅ as of 2026-04-29)

| Tool | Status |
|------|--------|
| fact-check | ✅ live and tested |
| ai-text | ✅ live |
| fal-morph | ✅ live (fal.ai billing topped up) |
| fal-faceswap | ✅ live |
| fal-inpaint | ✅ live |
| fal-rembg | ✅ live |
| generate-slides | ✅ live (OAuth refresh token) |

## Accounts

- GitHub: `LuckDragonAsgard` org
- Google/Supabase/GCP: `paddy@luckdragon.io`
- GCP project: `bubbly-clarity-494509-g0` ("Google Slides")
- CF account: Luck Dragon Main (`a6f47c17811ee2f8b6caeb8f38768c20`)
- CF API token: `cfut_W413...` (Edit Workers, All zones — created 2026-04-28)

## Outstanding / Feature backlog

- Realtime push (vs 3s polling)
- Push-question to players
- Captain-reassign UI
- PDF customisation
- Question-bank UX
- Per-venue analytics
- Player profiles

## Repo hygiene (still to do)

Delete from repo: `_bashprobe.txt`, `_probe.bin`, `api/*.js`, `vercel.json`, `.vercel/`, `deploy*.bat`
