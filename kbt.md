# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 5)

## Live
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, 8 categories)
- **API:** kbt-api.luckdragon.io
- **Host admin:** kbt-trial.pgallivan.workers.dev
- **Source:** github.com/LuckDragonAsgard/kbt-trivia-tools

## Working ✅
- **Deck generation:** /api/generate-event-deck-v2 (asgard-ai Drive proxy + SA Slides API)
- **Save to Library:** all 31 tools → R2 + Supabase kbt_question + bridge to questions table
- **Fuzzy matching:** /api/check-answer (Levenshtein + AI fallback at 55-82% similarity)
- **Score persistence:** /api/score-event → kbt_teams.score + kbt_sess table
- **Live scoring UI:** kbt-trial.pgallivan.workers.dev Live Scoring section — real leaderboard, +/- buttons, fuzzy answer checker, Save All Scores
- **Question engine:** approve bridges candidates → questions table; Guardian News added as source; more question types (Guess The Year, Anagram, Willywood, Connections)
- **R2 assets:** kbt-assets bucket, CDN pub-1a54ecdb73db411abfee3ed3772db25e.r2.dev

## Database
- **Supabase:** huvfgenbcaiicatvtxak.supabase.co
- **questions:** 6,099 active, 27 draft, 586 archived (real question bank)
- **kbt_question_candidates:** question engine staging table (20 pending)
- **kbt_qtype:** 68 rows (IDs 1-68)
- **kbt_teams:** team registration per event
- **kbt_sess:** historical scores per team per event

## API routes (kbt-api.luckdragon.io)
- /api/save-question — saves PNG assets to R2 + kbt_question + bridges to questions table
- /api/check-answer — fuzzy matching: exact/partial/fuzzy/ai/wrong with confidence
- /api/score-event — persists scores to kbt_teams + kbt_sess
- /api/generate-event-deck-v2 — full Google Slides deck
- /api/ai-text — AI content for tools
- /api/deezer/search|preview — music search + stream proxy
- /api/fal-morph|faceswap|rembg|inpaint|matting-hq — image AI

## asgard-ai /admin/drive-op (PIN 535554)
- op: copy, slides-get, slides-update
- Uses paddy@luckdragon.io GOOGLE_REFRESH_TOKEN (drive scope)
- Source: github.com/Luck-Dragon-Pty-Ltd/asgard-ai commit b8a68023

## Google Cloud (Asgard project)
- SA: kbt-slides@asgard-493906.iam.gserviceaccount.com (key 1d0357a894da)
- Templates folder: 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx (paddy@luckdragon.io)
- Output folder: 1LI91ZcUTl5UGR_LWN3nQyS9uDigRM0L3
- Base deck: 1R7xJwPwd811x2nUlLe2R1V8YbYuEQI6Rc099BdGcPX8

## Remaining gaps
- Slides templates for question types 49-68 (new tools) — not yet built
- ElevenLabs API key needs regenerating (Voice ID tool)
- kbt-trial.vercel.app returns 404 (Vercel deploy broken, pgallivan.workers.dev works)
- No player-facing answer submission app
- question_success field not updated on use
