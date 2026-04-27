# KBT — Know Brainer Trivia

_Canonical handover — overwrite in place. Last updated: 2026-04-28 (work performed 2026-04-27)._
_Prior versions live in git history of this repo. Per-session detail: `LuckDragonAsgard/kbt-trivia-tools/docs/handovers/`._

---

## What KBT is

A pub-quiz business that runs weekly trivia events. Two interlocking products live in one repo:

1. **Live event runner** — host scoring app + player team-registration app, both browser-based, scores in Supabase.
2. **Question-production tools** — 8 multimedia generators used by Paddy when building slide decks for an event (face morph, ghost actors, linked pics, etc.).

Repo: **`github.com/LuckDragonAsgard/kbt-trivia-tools`** (Luck Dragon Asgard GitHub org).

---

## Live URLs

| What | URL | Status |
|------|-----|--------|
| Host app | `luckdragonasgard.github.io/kbt-trivia-tools/host-app.html` | ✅ live |
| Player registration | `luckdragonasgard.github.io/kbt-trivia-tools/player-app.html?code=EVENT_CODE` | ✅ live |
| Tools index | `luckdragonasgard.github.io/kbt-trivia-tools/index.html` | ✅ live |
| Static tools (no AI) | crack-the-code, guess-the-year, name-the-brain, linked-pics, carmen-sandiego | ✅ live |
| AI-backed tools | face-morph, ghost-actors, brand (crop), soundmash, host-brief, fact-check, generate-slides | ⛔ **broken — backend not deployed** |

Deploy: push to `main` → GitHub Actions → live in ~60s. No build step.

---

## Stack

- **Frontend:** static HTML/JS served by GitHub Pages.
- **Database:** Supabase project `huvfgenbcaiicatvtxak`. Anon key embedded client-side. Tables: `kbt_event`, `kbt_question`, `kbt_quiz`, `kbt_teams`, `trial_scores` (RLS on, unique on `event_code,team_name,round,question_number`), `kbt_live_answers`, `trial_registrations`.
- **OAuth (Slides export):** GCP project `bubbly-clarity-494509-g0`, client `342815819710-sugohi5jr60hs2mfv1vgi4apfp3p2bjc`. Authorized origins include `luckdragonasgard.github.io`.
- **AI backend (parked):** 8 Cloudflare Pages Functions exist in `functions/api/` — `env-check`, `ai-text`, `fact-check`, `fal-faceswap`, `fal-morph`, `fal-inpaint`, `fal-rembg`, `generate-slides` + `_utils.js`. Need `FAL_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_SA_JSON` to function. **Not yet deployed.**

---

## Backend deploy — current state

- **Vercel:** deleted (was at `kbt-trial.vercel.app`).
- **GitHub Pages:** static frontend works perfectly. The 8 AI tools call `/api/*` and 404 because Pages is static-only.
- **Cloudflare Pages:** repo is fully ready (`functions/api/`, `wrangler.jsonc`, `_redirects` all in place). A connect-via-dashboard flow was 90% wired up on the Luck Dragon (Main) account `a6f47c17811ee2f8b6caeb8f38768c20` then **paused** — Paddy wants the backend integrated into Asgard infrastructure rather than as a standalone Pages project.
- **Decision needed:** which of these wins?
  1. Finish CF Pages project under Luck Dragon Main → `kbt-trivia-tools.pages.dev` (resume `docs/handovers/2026-04-27-v13.md`).
  2. Deploy the 8 functions as a single Worker via the asgard-tools `/chat/smart` deploy_worker flow → `kbt-api.pgallivan.workers.dev`. Frontend stays on GH Pages, calls the worker. Aligns with `feedback_use_asgard_tools` memory.
  3. Mount under existing `asgard.pgallivan.workers.dev` as `/kbt-api/*` routes.

Until one of these ships, the AI tools are broken. Static tools and the live event runner are unaffected.

---

## Repo layout

```
kbt-trivia-tools/
├── host-app.html, player-app.html, kbt-data.js, slides-export.js  — live event runner
├── index.html, tools.html, *-tool.html (×10)                       — question-production tools
├── functions/api/*.js                                              — CF Pages Functions (ready, not deployed)
├── api/*.js, vercel.json, .vercel/, deploy*.bat                    — DEAD Vercel artefacts (safe to delete)
├── wrangler.jsonc, _redirects                                      — CF Pages config
├── _bashprobe.txt, _probe.bin, _probe2.txt                         — junk probe files (delete via GH UI)
├── docs/
│   ├── README.md
│   ├── handovers/2026-04-19..2026-04-27-v13.md                     — historical session logs (do not extend; this canonical replaces them)
│   ├── archive/                                                    — falkor master plan, smoke tests, fix reports, kbt-app/trial origs
│   └── reference/kbt-blurb.md, kbt-trivia-app-reference.md         — migrated docx originals
├── legacy-prototypes/face_morph_server.py                          — old Python prototype (not in use)
├── assets/, screenshots/                                           — branded assets, screenshots
└── README.md, .nojekyll, package.json
```

---

## Running an event

1. Insert event row in Supabase `kbt_event` (`event_code`, `event_description`, `event_date`, `event_status='active'`).
2. Add quiz items to `kbt_quiz` (links event ↔ questions in `kbt_question`).
3. Share `…/player-app.html?code=YOUR_EVENT_CODE` with players.
4. Open `…/host-app.html`, enter event code → scoring panel.
5. Submit scores per round → leaderboard updates live.
6. Export to Slides via the button (Google OAuth → opens deck in new tab).

Current event code on file: `TEST-001`.

---

## Drive state — 2026-04-27

The Drive ASGARD folder is no longer canonical for KBT (canonical = this file in `asgard-handovers`). On 2026-04-27 a major bulk-trash pass via Chrome MCP cleared most KBT folders and duplicates. What remains on Drive:

**Operational — KEEP on Drive (live-edit assets for gigs):**
- `KBT — Cross Keys Hotel`, `KBT — The Spotswood Hotel`, `KBT — The Ascot Vale Hotel` event presentations
- `KBT Slides/`, `KBT — Mascot Generator/` folders
- `KBT_Brain_Example.pptx`, `KBT_Brain_v2.pptx`, `KBT_Example_Slides.pptx`, `KBT_Question_Templates.pptx`, `KBT-MASTER-TEMPLATE.pptx` templates
- `KBT Run Sheet - West Welcome Wagon.docx`
- `KBT Trivia — The Prince Albert Hotel (Demo).pptx`

**Stragglers — duplicates of what's already in repo, safe to trash:**
- `kbt-data.js` (3 copies in different folders) — repo has the canonical
- `face-morph-tool.html`, `Face Morph Tool.html`, `face-morph-tool.png` — repo has them
- `kbt-examples.html` — in repo
- `face_morph_v3.py` — corrupted; repo has working replacement at `functions/api/fal-morph.js`
- `face_morph_server.py` — already in `legacy-prototypes/`
- `KBT - Blurb.docx`, `KBT_Trivia_App_Reference.docx` — converted to markdown in `docs/reference/`
- All `KBT-HANDOVER-*.md`, `KBT-2.0-HANDOFF-*.md`, `KBT-PLATFORM-HANDOFF-*.md`, `FALKOR-KBT-MASTER-PLAN-*.md`, `KBT-Trial-Fix-Report.md`, `KBT-Trial-Smoke-Test-Report.md`, `kbt-app.md`, `kbt-trial.md`, `ASGARD-PROJECT-NOTE-KBT-*.md` — all already in repo `docs/handovers/` and `docs/archive/`
- Empty/legacy folders: `KBT — App`, `kbt-trivia-tools`, `face-morph`, `Face_Morph` (×3, dating to 2020), `kbt-trial`, `KBT-Face-Morph-v5-DEPLOY`, `KBT-Fixes-2026-04-19`, `Face Morph` (×3 copies in different paths), `🧠 KBT Platform 2026`

**Caveat:** the bulk of these straggler files are owned by `paddy@luckdragon.io`. The cleanup HTML at `H:\My Drive\KBT-DRIVE-CLEANUP.html` produces one-click trash links that work when logged in as the file owner.

---

## Accounts

| Service | Account | Purpose |
|---------|---------|---------|
| GitHub | `LuckDragonAsgard` | repo + Pages hosting |
| Supabase | luckdragon.io Google login | DB |
| Google Cloud | luckdragon.io Google login | Slides OAuth |
| Cloudflare | Luck Dragon (Main), id `a6f47c17811ee2f8b6caeb8f38768c20` | Asgard infra (where backend would deploy) |

Credentials → `asgard-vault.pgallivan.workers.dev`.

---

## What's left on the table

1. **Decide backend host** (see "Backend deploy" above) and ship it. Until then, AI tools 404.
2. **Repo hygiene** (low priority): delete `_bashprobe.txt`, `_probe.bin`, `_probe2.txt`, `api/*.js`, `vercel.json`, `.vercel/`, `deploy*.bat`. None of these are referenced after a CF Pages or Worker backend goes live.
3. **Drive trash sweep**: open `KBT-DRIVE-CLEANUP.html` in the `paddy@luckdragon.io` Drive session and click through. ~30 stragglers, ~6 are folders that take everything inside with them.

---

## Memory pointers

- `kbt_handover.md` (this file's location)
- `kbt_pipeline.md` (CF Pages auto-deploy via gh-push for `kbt-trial`; `kbt-trivia-tools` has its own pipeline TBD)
- `feedback_use_asgard_tools.md` (deploy via asgard-tools agent loop, not bat files)
- `feedback_no_local_storage.md` (cloud-side deploys only)
- `feedback_session_ritual.md` (overwrite this canonical file, do NOT add new vN handovers in `docs/handovers/`)
- `asgard_handovers_repo.md` (this repo `PaddyGallivan/asgard-handovers` is the canonical handover store)
