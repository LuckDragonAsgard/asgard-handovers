# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 9 — architecture separation + deck gen fixed)

## PLATFORM URLS
- **kbt.luckdragon.io** — tools (49), host-app, live-scoring, player-app (Worker → R2)
- **kbt-trial.pgallivan.workers.dev** — admin dashboard
- **kbt-api.luckdragon.io** — API (all KBT logic, own Drive/Slides)
- **kbt-oauth.luckdragon.io** — OAuth helper (no longer needed, keep for reference)

## ARCHITECTURE (CLEAN AS OF THIS SESSION)
- **kbt-api** owns ALL KBT code — Drive/Slides ops, player accounts, scoring, deck gen
- **asgard-ai** is clean — no KBT code, no drive-op, no cron
- No cross-project dependencies

## GOOGLE AUTH (CRITICAL — KBT specific)
GCP project: bubbly-clarity-494509
OAuth client: KBT Host App (342815819710-sugohi5jr60hs2mfv1vgi4apfp3p2bjc.apps.googleusercontent.com)
Client secret: stored as GOOGLE_CLIENT_SECRET in kbt-api + Vault as KBT_GOOGLE_CLIENT_SECRET
Drive refresh token: stored as KBT_DRIVE_REFRESH_TOKEN in kbt-api (paddy@luckdragon.io, drive scope)
Registered callback: https://kbt-api.luckdragon.io/api/google-auth-callback
Re-auth URL: https://kbt-api.luckdragon.io/api/google-auth-start

## DECK GENERATION
- Endpoint: POST /api/generate-event-deck-v2
- Uses KBT_DRIVE_REFRESH_TOKEN (paddy@luckdragon.io, drive scope) for file copy
- SA (kbt-slides@asgard-493906) used for Slides API batch updates
- Base deck: 1R7xJwPwd811x2nUlLe2R1V8YbYuEQI6Rc099BdGcPX8
- Output folder: 1LI91ZcUTl5UGR_LWN3nQyS9uDigRM0L3 (KBT Generated Decks)
- Templates folder: 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx
- ✅ VERIFIED WORKING

## SCORING (CORRECT)
- R1=12pts, R2=12pts, R3=16pts, Bonus=0pt, Gambler=5pt max
- Gambler: pick N questions, all correct=N pts, any wrong=0

## LIVE SCORING ADMIN (kbt-trial)
- Per-question grid, R1/R2/R3/TOT leaderboard (matches knowbrainertrivia.com.au)
- Leaderboard broadcast toggle — host controls visibility on player devices
- Question push (R/Q) — captain sees current question on player app

## PLAYER APP (kbt.luckdragon.io/player-app + kbt-trial/player-app)
- Persistent player accounts (kbt_player D1 table)
- Player codes e.g. PYYGY, permanent QR code
- Team codes, team QR, captain mode
- Returning player tick-list (captain sees who's played before)
- Leaderboard only shows when host broadcasts it

## API ENDPOINTS (kbt-api.luckdragon.io/api/...)
save-question, save-asset, save-morph, check-answer, score-event, submit-answer
team-wrap, update-question-stats, generate-event-deck-v2, drive-op (slides-copy/update/get/delete/list)
host-schedule, wager, player/register, player/:code, player/:code/teams
team/returning/:team_code, team/checkin, broadcast, broadcast/:event_code
google-auth-start, google-auth-callback, ai-text, deezer/*, fal-*

## D1 (kbt-integration-db: 7c6ee10f-93d4-475e-889d-cade0dbfd076)
Tables: kbt_player, kbt_host_broadcast, kbt_player_team_history, kbt_host_schedule, kbt_wager_log

## SUPABASE (huvfgenbcaiicatvtxak.supabase.co)
Tables used: kbt_event, kbt_teams, kbt_team_member, kbt_live_answers, kbt_sess, kbt_quiz, questions

## ASGARD-AI STATUS
- Clean: 236,283 chars, no KBT code
- Both GitHub repos synced: Luck-Dragon-Pty-Ltd/asgard-ai + LuckDragonAsgard/asgard-ai
- No cron, no self-heal, no drive-op

## PENDING
1. Templates 49-68: need visual design in Google Slides (Paddy manual task)
2. CF Pages kbt-trivia-tools: webhook broken, bypassed by kbt-tools Worker (acceptable)
3. Player app end-to-end test with real event
4. knowbrainertrivia.com.au source repo — separate codebase, not in these GitHub orgs
5. pgallivan references in CF subdomains — can't change (CF account subdomain), use luckdragon.io custom domains
