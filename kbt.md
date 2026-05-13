# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 3)

## Live
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, 8 categories)
- **API worker:** kbt-api.luckdragon.io (deployed 2026-05-13 session 3)
- **Source:** github.com/LuckDragonAsgard/kbt-trivia-tools

## Asset Storage — R2 (fully working)
- **Bucket:** kbt-assets (Cloudflare R2)
- **Public URL:** https://pub-1a54ecdb73db411abfee3ed3772db25e.r2.dev
- **Path pattern:** /questions/{timestamp}-{type}-Q.png and -A.png
- **No OAuth needed** — R2 bound directly to kbt-api worker
- Google Drive / OAuth path permanently abandoned (bubbly-clarity-494509 project inaccessible)

## Save to Library — fully wired
- All 31 tools have 💾 Save to Library button
- /api/save-question → uploads Q+A PNGs to R2 → inserts into kbt_question with asset URLs
- Verified working: questionId=106724, R2 URLs returning 200

## DB
- **Supabase:** huvfgenbcaiicatvtxak.supabase.co
- **kbt_qtype:** 68 rows (IDs 1–68, new types 49–68 for all tools)
- **New Qs land as:** status=draft

## Weekly rotation
1. Use tools → 💾 Save to Library → Q+A PNGs in R2, metadata in Supabase
2. Admin → filter draft → approve
3. Friday: pick Qs → generate-event-deck-v2 → Slides deck

## Tools — all 31 live, dark UI + white slide outputs
All 31 tools: dark chrome, white 1920×1080 slide exports, Save to Library wired.

## kbt_qtype IDs (key)
face_morph=19, soundmash=26, crack_the_code=14, name_the_brain=24
New: baby_photo=49, backwards=50, pixel_reveal=51, city_skyline=52, close_up=53,
country_outline=54, emoji_song=55, first_letters=56, flag_mashup=57,
instrument_solo=58, intro_only=59, movie_frame=60, silhouette=61,
sound_and_pic=62, stats_puzzle=63, text_message=64, title_sequence=65,
translator_fail=66, voice_id=67, wrong_speed=68
