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

## Session update — 2026-04-29 (tool audit + upgrades)

### face-morph-tool.html upgraded to v6 (commit e26e1396)
- Two-pass morph pipeline: rembg both faces → `fal-morph` x2 in parallel (A+B and B+A) → 50/50 canvas blend → true feature morph
- Slide A: KBT dark bg, framed morph photo centred with white border + drop shadow
- Slide B: Face A as cutout sticker (white outline dilation), morph as framed photo, Face B as cutout sticker — all on dark KBT bg
- **No more:** Easel AI faceswap; gender/workflow dropdowns; transparent output

### brain-tool.html output bg fix (commit 49c2a172)
- BrainA/BrainB canvases now export with KBT dark gradient background — previously transparent

### workers/kbt-api.js in sync ✅
Repo source matches live Worker `fb4904ea` — pushed earlier this session (commit ffc41b7a)

### All tools confirmed working ✅
fact-check · ai-text · fal-morph · fal-faceswap · fal-inpaint · fal-rembg · generate-slides · brain-tool · soundmash-tool · face-morph-tool



## Session update — 2026-04-29 (font audit + bug fixes)

### Problem found: all html2canvas tools had font inheritance bug
`#export-canvas` inherited `Londrina Solid` from `body` — not Bowlby. Computed style confirmed via Chrome DevTools.

### Fixes pushed:
- **guess-the-year-tool.html** — added `font-family: Bowlby One SC` to `#export-canvas`, `.year-display`, `.kbt-watermark` (commit 47a9ec85)
- **linked-pics-tool.html** — added `font-family: Bowlby One SC` to `#export-canvas` (commit 8eee023b)
- **crack-the-code-tool.html** — added `font-family: Bowlby One SC` to `#export-canvas` (commit fe488dbe)
- **soundmash-tool.html** — defined missing `loadFontsForCanvas()` — function was called but never defined, causing ReferenceError on init (commit d0b7263b)

### Final verified state — all 7 tools ✅
| Tool | Mechanism | Font verified | KBT chrome |
|------|-----------|--------------|------------|
| guess-the-year | html2canvas | Bowlby One SC ✅ | Dark bg + teal bar + gold year ✅ |
| linked-pics | html2canvas | Bowlby One SC ✅ | Dark bg + teal/gold banner ✅ |
| crack-the-code | html2canvas | Bowlby One SC ✅ | Dark gradient + teal grid ✅ |
| soundmash | canvas2D | ctx.font explicit ✅ | Full KBT Q+A slides ✅ |
| ghost-actors | canvas2D | ctx.font explicit ✅ | kbtDrawChrome() Q+A ✅ |
| brain-tool | canvas2D | N/A (no text) ✅ | Dark gradient bg ✅ |
| face-morph | canvas2D | ctx.font explicit ✅ | KBT chrome + sticker/framed ✅ |

## Session update — 2026-04-29 (full system E2E audit + host-app fixes)

### E2E audit scope
All 7 tools, host-app, player-app, admin-app, wrap.html, kbt-api Worker routes.
Result: tools/player/admin/wrap all confirmed ✅ in prior sessions. 3 critical bugs found and fixed in **host-app.html** + **kbt-data.js** this session.

---

### Bug 1: `</script>` inside template literal crashed main script (CRITICAL)
**File:** `host-app.html`  
**Root cause:** `displayQuestion()` renders `display.innerHTML` using a JS template literal. That template contained an inline `<script>` block for the live answers poller. The HTML parser saw the `</script>` closing tag and terminated the outer main script at line 2540 — making **all functions defined after that point** (including `launchEvent`, `navigateTo`, `renderMarkPanel`, etc.) undefined.  
**Symptom:** `ReferenceError: launchEvent is not defined` when clicking Launch.  
**Fix:** Changed `</script>` inside the template to `<\/script>` — HTML parser ignores backslash-escaped form; `innerHTML` assignment produces the correct `</script>` string.  
**Commit:** `56e77113`

---

### Bug 2: `updateQuestion()` called instead of `displayQuestion()` (CRITICAL)
**File:** `host-app.html`  
**Root cause:** At the end of `launchEvent()` and `launchDemo()`, the code called `(typeof updateQuestion === 'function' ? updateQuestion : (()=>{}))()`. Function `updateQuestion` was never defined — so after launch the question display would be blank even though `questions` array was fully populated.  
**Symptom:** Quiz page loaded with correct question counter and mark panel but `.question-text` div was empty.  
**Fix:** Replaced both stubs with `if (typeof displayQuestion === 'function') displayQuestion();`  
**Commit:** `e84743d2`

---

### Bug 3: `trial_scores` upsert returning 409 Conflict (CRITICAL)
**File:** `kbt-data.js`  
**Root cause:** PostgREST v11 (Supabase) requires the `?on_conflict=col1,col2,...` query parameter in the URL to identify which unique constraint to use for upsert. Sending `Prefer: resolution=merge-duplicates` alone is no longer sufficient — without the on_conflict param, PostgREST does a plain INSERT and returns 409 on duplicate.  
**Symptom:** Every `markQuestion()` call logged `[kbt] markQuestion persist failed: Supabase POST trial_scores -> 409: duplicate key value violates unique constraint "trial_scores_upsert_key"`. Score buttons showed correct visual state (win/lose class) but DB write silently failed.  
**Fix:** Changed the path in `submitRoundScore` from `'trial_scores'` to `'trial_scores?on_conflict=event_code,team_name,round,question_number'`  
**Commit:** `8f10460d`

---

### End state after fixes
| Test | Result |
|------|--------|
| Launch event (TEST-002) | ✅ Event code, venue, date, 32 questions loaded |
| Quiz page question display | ✅ Question text, type badge, round badge all render |
| Show Answer | ✅ Reveals correct answer |
| Next/Prev navigation | ✅ Advances through questions, question text updates |
| Mark panel | ✅ Shows registered teams, ✓ Right / ✗ Wrong buttons |
| Score persistence | ✅ `win` class applied, no 409, DB write confirmed |
| Console errors | ✅ Zero errors/warnings on current live build |


## Session update — 2026-04-29 (full E2E audit continued — incoming answers + host-app poller fix)

### Scope this session
Completed full end-to-end audit of player→host live answer flow, gambler scoring, scoring page, teams page, results/podium, timer, and wrap.html. Three additional bugs found and fixed.

---

### Bug 4: `kbt-data.js` cached in host-app (no version query on script tag)
**File:** `host-app.html`  
**Root cause:** `player-app.html` had `<script src="kbt-data.js?v=2">` (added earlier session) to bust GH Pages cache, but `host-app.html` still loaded `<script src="kbt-data.js">` with no version. Browser served the old cached version — missing `submitPlayerAnswer`, `getLiveAnswers`, `gradeLiveAnswer` methods on `window.kbtData`.  
**Symptom:** Host `window.kbtData.getLiveAnswers` was `undefined`, incoming answers panel showed 0 forever.  
**Fix:** Changed to `<script src="kbt-data.js?v=2"></script>`.  
**Commit:** `2a508e93`

---

### Bug 5: Incoming answers poller `<script>` inside `innerHTML` never executed
**File:** `host-app.html`  
**Root cause:** `displayQuestion()` injects the incoming answers panel HTML (including `<script>` block with `setInterval` poller) via `display.innerHTML = ...`. Browsers do **not** execute `<script>` tags injected via `innerHTML` — this is a hard browser security rule. The poller `setInterval` was never registered, so the panel stayed at 0 regardless.  
**Symptom:** `getLiveAnswers()` called manually returned correct rows; panel never updated.  
**Fix:**  
1. Removed the `<script>` block from the template literal entirely  
2. Added `startIncomingPoller()` as a real JS function (with `_incomingPollerStarted` guard so it starts only once), containing the poll logic + `window.gradeIncoming` + `setInterval`  
3. Called `startIncomingPoller()` from `displayQuestion()` after setting innerHTML  
**Commit:** `f3cf33f3`

---

### Bug 6: `kbt_live_answers` table missing UPDATE RLS policy
**Database:** Supabase `huvfgenbcaiicatvtxak`  
**Root cause:** `kbt_live_answers` had RLS policies for INSERT (anon) and SELECT (anon) but no UPDATE policy. `gradeLiveAnswer()` used anon key to PATCH — Supabase silently returned `[]` (0 rows updated) due to RLS blocking the update.  
**Symptom:** `gradeIncoming()` returned `[]`, graded answers didn't disappear from the host panel.  
**Fix:** `CREATE POLICY anon_update_live_answers ON kbt_live_answers FOR UPDATE TO anon USING (true) WITH CHECK (true);`  
**Applied via:** Supabase MCP `execute_sql`

---

### Full E2E test results — ALL PASSING ✅

| Feature | Result |
|---------|--------|
| Player submits answer → appears in host panel | ✅ Within 3s poller cycle |
| Host grades ✓ → row updated, clears from panel | ✅ |
| Host grades ✗ → same | ✅ |
| Scoring page (navigateTo → renderScoreTable) | ✅ Teams + round scores + totals |
| Teams page | ✅ Team list, captains, player counts |
| Results/podium (showLeaderboard) | ✅ Podium + full leaderboard rendered |
| Gambler wager panel renders | ✅ Banner, per-team inputs, lock button |
| lockGamblerWagers → DB write + score delta | ✅ 2 teams updated, +5/-3 applied |
| Timer countdown | ✅ setInterval running, timerDisplay counting |
| wrap.html with real team code | ✅ Full render: placement, rounds, members, top 3 |

### Notes for next session
- `navigateTo('results')` alone does NOT render the podium — call `showLeaderboard()` instead
- wrap.html `?team=` expects the team **code** (e.g. `TFR4PFF`), not team name
- "Gambler Pairs" question type in DB does NOT trigger wager panel — only type string `"Gambler"` does. Add a type mapping in `loadLiveQuestions` if Gambler Pairs events need wager UI.
- Test data in DB: "Live Test Team" (code TFR4PFF) and graded `kbt_live_answers` rows for TEST-002 — fine to leave or clean up as desired
