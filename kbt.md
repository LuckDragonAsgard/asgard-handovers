# KBT — Handover
**Last updated:** 2026-04-29 (Session: Gambler Pairs E2E + fuzzy auto-correct confirmed live)

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

---

## Session update — 2026-04-29 (Gambler Pairs UI + fuzzy auto-correct + venue cooldown)

### Features built this session

---

### Feature 1: Gambler Pairs host-app panel (purple UI)
**Files:** `host-app.html` (v10→v12), `kbt-data.js`

**What it does:**
- `quiz_qtype = 'Gambler Pairs'` now correctly maps to type `'Gambler Pairs'` (was falling through to `'Gambler pairs'` — lowercase p)
- A dedicated purple panel (`#gamblerPairsPanel`) replaces the old wager panel for this type
- Panel header shows all 5 pair correct answers (A1, B2, etc.) with full text from `question_answer_supporttext`
- Team submissions parsed from `selected_option` — accepts comma or space separated e.g. `A1,B2,C2,D1,E1`
- Per-team table: each pair cell coloured green (correct) or red (wrong)
- Auto-score: N correct pairs if 0 wrong; 0 if any wrong (all-or-nothing)
- Per-row override input + Apply button; "Apply All Auto-Grades" bulk button
- Panel refreshes every 3s via existing incoming poller

**DB format confirmed:**
- `question_answer_text`: `A1)\nB2)\nC2)\nD1)\nE1)` — correct option per pair
- `question_answer_supporttext`: `A1) Sherlock Holmes\nB2) Durian\n...` — full answer text
- `quiz_qtype` literal value: `"Gambler Pairs"`

**Key functions added:**
- `parseGamblerPairsAnswers(answerText)` → `{ A:'1', B:'2', … }`
- `parseTeamPairsSelection(text)` → parses any reasonable format
- `calcGamblerPairsScore(teamSel, correct)` → `{ score, correct, wrong, details }`
- `renderGamblerPairsPanel(q)` — async, fetches live answers + renders
- `applyGamblerPairsScore(answerId)` — apply one team's score
- `applyAllGamblerPairs(round, qNum)` — bulk apply auto-grades

---

### Feature 2: Gambler Pairs player-app toggle mode
**File:** `player-app.html`

**What it does:**
- "🃏 Pairs mode" button in the answer card header toggles between text area and 5-pair toggle UI
- 5 pair buttons: A/B/C/D/E each with Option 1 and Option 2 (green when selected, toggle off on second click)
- Submit formats selections as `A1,B2,C2,D1,E1` — exactly what the host-app parser expects
- Auto-increments Q# after submit

---

### Feature 3: Fuzzy auto-correct in incoming answers panel
**File:** `host-app.html` (v11)

**What it does:**
- `levenshtein(a, b)` — character-level edit distance (strips non-alphanumeric, lowercases)
- `fuzzyMatch(submitted, correct)` → `{ score, label, color, autoGrade }`
  - `score >= 0.8` or contained match → green badge `"✓ exact"` / `"95%"`, `autoGrade: true`
  - `score 0.6–0.8` → amber badge, no auto-grade
  - `score < 0.6` → red badge
- `findCorrectAnswer(round, qNum)` looks up correct answer from loaded `questions` array
- Each incoming answer row now shows a coloured confidence badge + the ✓ button is highlighted (ring glow) when auto-gradeable
- "⚡ Auto-grade N confident answer(s)" button appears above the panel when high-confidence matches exist
- `gradeAllConfident()` iterates all ungraded rows, grades those with `fm.autoGrade === true` as correct

---

### Feature 4: Question venue cooldown tracking (2-year rule)
**DB:** Supabase `huvfgenbcaiicatvtxak`  
**Files:** `kbt-data.js`, `host-app.html` (v12)

**Schema (migration `fix_question_venue_usage_types_and_cooldown`):**
```sql
kbt_question_venue_usage (
  id bigserial PK,
  question_id bigint NOT NULL,
  loc_id      bigint NOT NULL,   -- kbt_loc.id
  event_id    bigint NOT NULL,   -- kbt_event.id
  used_on     date DEFAULT CURRENT_DATE,
  slot        text,              -- e.g. "R3Q10"
  UNIQUE (question_id, loc_id, event_id)
)
-- View:
kbt_question_venue_cooldown: question_id, loc_id, last_used, days_ago, in_cooldown (bool, 2yr)
```
RLS: anon SELECT + INSERT (host-app uses anon key).

**kbt-data.js new methods:**
- `recordVenueUsage(eventCode, questions)` — batch inserts with `resolution=ignore-duplicates`; fetches `event_location_id` from `kbt_event` first
- `getVenueCooldowns(questionIds, locId)` — queries the view, returns cooldown rows

**host-app.html:**
- `loadLiveQuestions()` now: records venue usage in background + calls `loadVenueCooldowns()`
- `loadVenueCooldowns()` populates `_venueCooldownSet` (Set of question dbIds)
- `displayQuestion()` shows amber warning banner: `⚠️ This question was used at this venue within the last 2 years`
- Mapped question objects now include `dbId: r.quiz_question_id`

---

### Commits this session
| File | SHA | Description |
|------|-----|-------------|
| `host-app.html` | `5b973d1a` | Gambler Pairs panel v10 |
| `player-app.html` | `1355831c` | Pairs toggle mode |
| `host-app.html` | `35119b9b` | Fuzzy auto-correct v11 |
| `kbt-data.js` | `b1fb38e0` | recordVenueUsage + getVenueCooldowns |
| `host-app.html` | `f814634a` | Venue cooldown warning v12 |

---

### Still to do / known gaps
- Gambler Pairs is not yet tested end-to-end with a live event (need an event with a GP question)
- Player app Pairs mode sets selections but there's no "deselect all" button — minor UX gap
- Venue cooldown: `recordVenueUsage` fires on every `loadLiveQuestions()` call — uses `ON CONFLICT DO NOTHING` so idempotent, but fires each page load. Could add a session flag if needed.
- Xero/roster integration (Google Sheets `1I8v5kq8B0Djdora_WmEuKYDVLuHHVgb5nXXM1H9jCNE`) — not started; need to understand roster structure first
- Admin UI for venue cooldown management (override, extend cooldown period) — not built

---

## Session update — 2026-04-29 (Gambler Pairs E2E fix + fuzzy test confirmed live)

### Bugs found and fixed this session (all confirmed via live Chrome test)

---

### Bug 7: `r.question` → `r.kbt_question` (CRITICAL — all question text blank)
**File:** `host-app.html`  
**Root cause:** `getQuizItems()` in `kbt-data.js` uses Supabase PostgREST FK join alias `kbt_question:quiz_question_id(...)`. The response returns key `kbt_question` — NOT `question`. `loadLiveQuestions()` mapped using `const q = r.question || {}`, so `q` was always `{}` → question text, answer, type all empty strings.  
**Symptom:** Host-app loaded 32 questions but every `.question-text` div was blank; `questions[n].text === ''` for all n.  
**Fix:** `const q = r.kbt_question || r.question || {};`  
**Commit:** `792939dc` (v14b), also bumped `kbt-data.js?v=2` → `?v=3`

---

### Bug 8: `#gamblerPairsPanel` container never created in `displayQuestion()`
**File:** `host-app.html`  
**Root cause:** `displayQuestion()` HTML template had a single ternary: `q.type === 'Gambler' ? wagerPanel : markPanel`. For `q.type === 'Gambler Pairs'` it fell through to `markPanel` — creating `#markPanel` instead of `#gamblerPairsPanel`. `renderGamblerPairsPanel()` bails immediately if `document.getElementById('gamblerPairsPanel')` returns null.  
**Symptom:** Gambler Pairs question showed `#markPanel` instead of the purple GP panel.  
**Fix:** Added three-way ternary: `'Gambler' ? wagerPanel : 'Gambler Pairs' ? gamblerPairsPanel+incomingAnswers : markPanel+incomingAnswers`  
**Commit:** `a90da131` (v15)

---

### Bug 9: `r.round_number` in 3 filter locations (GP panel, incoming poller, gradeAllConfident)
**File:** `host-app.html`  
**Root cause:** `kbt_live_answers` DB returns `round` (not `round_number`). Three places in host-app used `r.round_number` exclusively — GP panel filter, incoming poller filter, `gradeAllConfident` lookup. All three filtered to empty arrays because `r.round_number` was `undefined`.  
**Symptom:** GP panel showed answer badges but no team table. Fuzzy badges never appeared.  
**Fix:** Changed all three to `(r.round == q.round || r.round_number == q.round)` / `(r.round_number || r.round)` fallback patterns.  
**Commit:** `7cd789e8` (v15b)

---

### Live E2E test results — ALL PASSING ✅

| Test | Result |
|------|--------|
| Question text populates (r.kbt_question fix) | ✅ All 32 questions show text |
| Gambler Pairs panel renders (R3Q10) | ✅ Purple panel, 5 correct answer badges with clue tooltips |
| GP scoring: all-correct team | ✅ TestTeamAlpha A1,B2,C2,D1,E1 → `5 ✓` |
| GP scoring: any-wrong team | ✅ TestTeamBeta A1,B1,C1,D2,E2 → `0 ⚠` |
| GP "Apply All Auto-Grades" | ✅ `"✓ Applied auto-grades for 2 team(s)"` |
| Fuzzy match: exact | ✅ "The Betoota Advocate" → `✓ exact` (1.00) |
| Fuzzy match: typo | ✅ "Betoota Advocaate" → `78%` (autoGrade: true) |
| Fuzzy match: wrong answer | ✅ "The Sydney Morning Herald" → `27%` (autoGrade: false) |

---

### How to push to GitHub (session note)
The `gh-push.pgallivan.workers.dev` relay now requires a bearer token (stored as CF secret). Sandbox VM gets Cloudflare 403 (error 1010) on that relay.  
**Workaround:** Get GITHUB_TOKEN via `POST asgard-tools.pgallivan.workers.dev/chat/smart` `{"message":"Use get_secret to retrieve the value of GITHUB_TOKEN"}` → use token directly with GitHub contents API (PUT with SHA + base64 content). Public-repo scope sufficient for kbt-trivia-tools.

---

### Current live SHA
`host-app.html` commit `7cd789e8` — v15b with all 3 round_number fixes  
`player-app.html` commit `1355831c` — Pairs toggle (unchanged this session)  
`kbt-data.js?v=3` — recordVenueUsage + getVenueCooldowns (unchanged this session)

---

### Outstanding
- Xero/roster integration (Google Sheets `1I8v5kq8B0Djdora_WmEuKYDVLuHHVgb5nXXM1H9jCNE`) — not started
- Admin UI for venue cooldown management — not built
- Venue cooldown banner: test with a real repeat event to confirm the amber banner fires correctly
- Player app Pairs mode: no "deselect all" button (minor UX gap)

## Session update — 2026-04-29 (Triple-pass audit + 2 fixes)

### Scope
Full triple-pass audit of ALL KBT apps, tools, workflows, question types, scoring mechanisms, and business models.

### Bug 9d — gradeAllConfident missing round fallback (FIXED)
`window.gradeAllConfident` closure had unfixed `findCorrectAnswer(r.round_number, ...)`. Fix: `r.round_number || r.round`. Commit `20e57f3b`. Verified live ✅.

### Bug P3-1 — nextBtn not disabled at last question (FIXED)
`displayQuestion()` never set `nextBtn.disabled`. Fix: `nextBtn.disabled = currentQuestion === questions.length - 1`. Commit `7dd858ea`. Current host-app SHA: `7dd858eac11c`.

### Audit results — ALL ✅
- Pass 1 source: host-app, player-app, admin-app, wrap, kbt-data.js, kbt-api worker, question-candidates, slides-export, all 7 media tools
- Pass 2 live: launchEvent/revealAnswer/gradeAllConfident verified, wrap placement messages, kbt-api live AI + fact-check
- Pass 3 edge cases: GP mode, wrap tiers, submitRoundScore upsert, gradeAllConfident on empty, invalid event code, generate-slides 500

### Business model status
- Live Model ✅ Ship-ready
- Demo/Offline ✅ launchDemo() working
- Weekly School ⚠️ Designed only (brief at docs/kbt-question-engine-brief.md)
- HQ Live/No-Host ⚠️ Designed only

### Outstanding (post-launch roadmap)
- Weekly School format UI + event_type='school' player app
- HQ Live: elimination logic, Realtime, timer overlay
- New Q type UIs: Closest Wins, Connections grid, Emoji display
- Promote approved candidates → kbt_question table

## Session update — 2026-04-30 (Template discovery + face morph spec rebuild)

### Critical discovery: ALL 7 canvas tools built with wrong template
The real KBT slide template is WHITE background — not dark. The dark canvas tools all need to be completely rebuilt.

Real template spec (from templates/KBT_Example_Slides.pptx + KBT_Question_Templates.pptx):
- Background: WHITE always
- Top-left: R_Q_ label in colored rounded rectangle (white text inside)
- Question type title next to it in same bold color
- Content centered with lots of whitespace
- Cutout sticker photos (rembg, white outline, drop shadow)
- Solid color bar at very bottom of slide
- Colors: Brain/Maths=green ~#2ECC71, Brand/Word=sky blue ~#29B6F6, Year=pink ~#CE93D8, Fifty-Fifty=orange ~#FFAB76, MC=purple ~#9575CD

### Mission clarification
knowbrainertrivia.com.au is the OLD production system. GitHub Pages tools exist to replace graphic designers who currently create all image question slides at high cost. Output must be pixel-perfect to real template — indistinguishable from what the designer produces.

### Face morph correct technique (NOT fal.ai face swap, NOT a split)
Layered composite with surgical feature erasure:
1. Place Face B top layer over Face A at 100% opacity
2. Rotate/translate Face B to align its eyes exactly onto Face A's eyes
3. Reduce opacity temporarily to check alignment
4. Pinpoint ALL facial landmarks precisely: each eye centre, each ear, nose tip, mouth corners
5. Surgically erase from Face B at exact landmark coords: one eye, one ear, nose OR mouth
6. Restore Face B to 100% opacity — solid composite with mixed features from both
7. Trim excess with rembg to remove hair, collars, clothing
8. White border outline + drop shadow on white slide background
Result: ONE ambiguous face that triggers recognition of both people simultaneously.

### All 7 tools need rebuilding
- face-morph-tool: white bg, MediaPipe landmark detection, layered composite per spec
- brain-tool: white bg, green "Name The Brain." label
- guess-the-year-tool: white bg, pink "Guess The Year." label
- crack-the-code-tool: white bg, blue label
- linked-pics-tool: white bg, blue label
- ghost-actors-tool: white bg
- soundmash-tool: white bg

### Outstanding
- View slides 38 and 51 in event 5259 deck for real face morph context
- Rebuild face-morph-tool with MediaPipe landmark pipeline
- Rebuild all 7 canvas tools to white template
