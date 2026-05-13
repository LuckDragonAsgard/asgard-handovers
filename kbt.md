# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 8 — deep audit + gap resolution)

## PLATFORM URLs
- **Tools + Host App:** kbt.luckdragon.io (Worker → R2, bypasses broken Pages)
  - /tools — 31 tools with Save to Library (all wired to /api/save-question → R2)
  - /host-app — real host dashboard (markQuestion, Gambler Pairs A-E, R1/R2/R3 scoring)
  - /live-scoring — live ladder + run sheet  
  - /player-app — player registration + quiz + results (no loadWrapData in Pages version)
- **Trial admin:** kbt-trial.pgallivan.workers.dev (serves from R2 kbt-assets/)
- **API:** kbt-api.luckdragon.io
- **Question engine:** every 6hrs

## INFRASTRUCTURE NOTES
- kbt.luckdragon.io was broken (CF Pages stuck at May 6, ad_hoc uploads returning 500)
- Fixed by: deploying kbt-tools Worker that serves all content from R2 kbt-assets/tools/
- 49 HTML+JS files uploaded to R2 tools/ prefix from GitHub LuckDragonAsgard/kbt-trivia-tools
- CF Pages project kbt-trivia-tools still exists but is bypassed by Worker route

## SCORING (CORRECT AS OF THIS SESSION)
Standard KBT pack: 3 rounds + Bonus (0pt each) + Gambler
- R1 = 12pts: Freebie(2) + 50-50(1) + MC(1) + Brain(1) + Maths(1) + Classic×3(3) + WordPuzzle(1) + Brands(2) + Bonus(0)
- R2 = 12pts: Anagram(1) + MC(1) + SongLyrics(1) + Classic×3(3) + FaceMorph(2) + 50-50(1) + MapPins(1) + SoundMash(2) + BonusHT(0)
- R3 = 16pts: LinkedPics(2) + Classic×5(5) + CrackCode(1) + GuessYear(1) + GhostActors(2) + MC(1) + Gambler(5)
- Gambler mechanics: 5 questions, pick N to attempt, all correct = N pts, any wrong = 0

## REAL HOST APP (kbt.luckdragon.io/host-app) — KEY FEATURES
Functions: markQuestion, lockGamblerWagers, renderGamblerPairsPanel, applyGamblerPairsScore, 
           applyAllGamblerPairs, loadTeamMembersIntoCards, pollIncomingAnswers, loadLiveQuestions,
           loadVenueCooldowns, loadTeamsFromSupabase, loadRecentEvents, launchEvent, loadQuestionsFromBank
Data layer: kbt-data.js (pgGet/pgPost helpers, Supabase direct)
Tables: kbt_event, kbt_live_answers, kbt_question_venue_cooldown, kbt_question_venue_usage
External scripts: kbt-data.js, slides-export.js, Google GSI
Key tabs: Update Scores (R1/R2/R3 per team), Final Results (podium), Teams, Settings

## TRIAL ADMIN (kbt-trial.pgallivan.workers.dev) — CURRENT STATE
Serves from R2: admin-app.html + player-app.html (both updated this session)
Features built: Quiz Gen, Quiz Edit (round/Q config), Live Scoring (+/-), Fuzzy Answer Check,
                Gambler Panel (correct mechanics), Host Roster, Draft Review, Events/Locations/Hosts
Gap vs real host-app: no per-question marking, no R1/R2/R3 column scoring, no podium

## API ENDPOINTS (kbt-api.luckdragon.io/api/...)
- save-question — R2 (KBT_ASSETS binding) + kbt_question table
- save-asset — R2 (KBT_ASSETS binding) + kbt_question table (new, universal)
- save-morph — original face-morph dedicated endpoint
- check-answer — fuzzy (Levenshtein + AI)
- score-event — kbt_sess + kbt_teams.score + question stats
- submit-answer — → kbt_live_answers  
- team-wrap — historical stats
- update-question-stats — times_used/success_rate
- generate-event-deck-v2 — Google Slides (all 68 types via asgard-ai drive-op)
- host-schedule — D1 kbt_host_schedule (GET/POST/DELETE shifts)
- wager — D1 kbt_wager_log (Gambler wager tracking)
- ai-text, deezer/*, fal-* — all working

## D1 (kbt-integration-db: 7c6ee10f-93d4-475e-889d-cade0dbfd076)
Tables: kbt_host_schedule, kbt_wager_log (both created this session)

## ASGARD-AI DRIVE-OP
- Recurring overwrite problem: identified root cause as newer 236k Docs API build deployed by Asgard sessions
- Current canonical in both repos: 238780 chars (v6.5.0 + drive-op)
- Drive-op is live and working NOW
- Permanent fix needed: self-repair check in /admin/deploy route

## TEMPLATES (types 49-68)
All in Drive folder 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx
- Image types: name_the_brain format (INSERT INTRO SLIDE + [q]) — structurally correct
- Text types: classic format ([question_text] [answer_text]) — correct
- Audio types: descriptions updated (Voice ID, Intro Only, Instrument Solo, Wrong Speed)
- NOT DONE: type-specific visual labels, KBT branding, animations — needs Paddy review in Slides
- NOT TESTED: actual deck gen output for types 49-68

## PENDING ITEMS
1. kbt.luckdragon.io/player-app — no loadWrapData (Pages version different from kbt-trial version)
2. Types 49-68 templates: need visual design + testing
3. asgard-ai drive-op permanent fix (self-repair in /admin/deploy)  
4. Per-question marking in kbt-trial admin (to match host-app)
5. R1/R2/R3 column scoring in kbt-trial admin
6. Podium display in kbt-trial admin
7. CF Pages project kbt-trivia-tools: webhook broken, bypassed by Worker (acceptable)
8. kbt-save.js in repo calls /api/save-question — verified this works with KBT_ASSETS R2 binding
