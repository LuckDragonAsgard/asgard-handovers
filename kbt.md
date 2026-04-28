# KBT — Handover

**Canonical cold-start:** `github.com/LuckDragonAsgard/kbt-trivia-tools/blob/main/RESUME-HERE.md`

## Key URLs (2026-04-28)
- **Host app:** `https://luckdragonasgard.github.io/kbt-trivia-tools/host-app.html`
- **Player URL:** `…/player-app.html?code=EVENT_CODE`
- **Admin app:** `…/admin-app.html`
- **Backend Worker:** `https://kbt-api.pgallivan.workers.dev` (CF Worker, Luck Dragon Main account)

## Stack
- **Frontend:** GitHub Pages (`LuckDragonAsgard/kbt-trivia-tools`), auto-deploy on push ~25s
- **DB:** Supabase `huvfgenbcaiicatvtxak` (ap-southeast-2, 34 tables, RLS on all)
- **Backend:** CF Worker `kbt-api` on Luck Dragon Main (`a6f47c17`) — all AI tools
- **GCP:** OAuth client `342815819710-sugohi5jr60hs2mfv1vgi4apfp3p2bjc`, project `bubbly-clarity-494509-g0`

## Accounts
- GitHub: `LuckDragonAsgard`
- Supabase/GCP login: `paddy@luckdragon.io`
- CF account: Luck Dragon Main `a6f47c17811ee2f8b6caeb8f38768c20`
- Vault: `asgard-vault.pgallivan.workers.dev` X-Pin `2967`

## Backend Worker secrets (as of 2026-04-28)
| Secret | Status | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Set | `kbt-api` key in Anthropic console, paddy@luckdragon.io |
| `FAL_KEY` | ✅ Set | New fal.ai account paddy@luckdragon.io — **needs billing top-up** |
| `GOOGLE_SA_JSON` | ⚠️ Not set | Needed for generate-slides — get from GCP project `bubbly-clarity-494509-g0` |

## CF API Token (2026-04-28)
New token `cfut_W413...` (name: "Edit Cloudflare Workers") created 2026-04-28.
Scoped to Luck Dragon (Main), All zones. Workers Scripts:Edit + Pages:Edit + KV:Edit.
Also updated in asgard-tools secrets as `CF_API_TOKEN`.

## Tool status
- `fact-check` — ✅ live (ANTHROPIC_API_KEY working)
- `ai-text`, `fal-morph`, `fal-faceswap`, `fal-inpaint`, `fal-rembg` — ⚠️ blocked (fal.ai needs billing)
- `generate-slides` — ⚠️ blocked (GOOGLE_SA_JSON not set)

## Outstanding to fully fix all tools
1. Top up fal.ai account at `fal.ai/dashboard/billing` (paddy@luckdragon.io Google login)
2. Set GOOGLE_SA_JSON on kbt-api Worker (from GCP `bubbly-clarity-494509-g0` service accounts)

## Feature backlog
- Realtime push vs 3s polling
- Push question to players
- Captain reassign UI
- PDF customisation
- Question-bank UX
- Per-venue analytics
- Player profiles/cross-event

_Last updated: 2026-04-28_
