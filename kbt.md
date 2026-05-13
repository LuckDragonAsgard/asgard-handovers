# KBT — Know Brainer Trivia
Last updated: 2026-05-13

## Live
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, 8 categories)
- **API worker:** kbt-api.luckdragon.io (deployed 2026-05-13)
- **Question engine:** kbt-question-engine.pgallivan.workers.dev (cron every 6h)
- **Source:** github.com/LuckDragonAsgard/kbt-trivia-tools

## DB
- **Supabase:** huvfgenbcaiicatvtxak.supabase.co
- **Key tables:** kbt_question, kbt_qtype (68 rows), kbt_quiz, kbt_qtag
- **Question count:** 100,000+ (IDs from 100001)
- **New Qs land as:** status=draft, review in admin before use

## Tools — all 31 live at kbt.luckdragon.io/tools
### People & Faces
- face-morph-tool (v13: auto AI morph, AI version grid)
- brain-tool, ghost-actors-tool, silhouette-tool, pixel-reveal-tool, close-up-tool, baby-photo-tool, linked-pics-tool

### Music & Audio
- soundmash-tool, intro-only-tool, wrong-speed-tool, instrument-solo-tool, voice-id-tool, sound-and-pic-tool

### Places & Geography
- carmen-sandiego-tool, city-skyline-tool, country-outline-tool, flag-mashup-tool (v2 rebuild)

### Movies, TV & Pop Culture
- movie-frame-tool, title-sequence-tool, emoji-song-tool

### Words, Text & Puzzles
- crack-the-code-tool, first-letters-tool, backwards-tool, text-message-tool, translator-fail-tool, stats-puzzle-tool

### Time & Numbers
- guess-the-year-tool

### Brands & Logos
- brand-tool

### Utilities
- host-brief-tool, face-prep-tool, question-dev

## Save to Library system (built 2026-05-13)
- `/api/save-question` — generic save for all 68 question types
- `kbt-save.js` — shared snippet: `kbtSave({type, questionText, answerText, qCanvas, aCanvas, label})`
- 11 tools have Save button wired: pixel-reveal, city-skyline, close-up, country-outline, baby-photo, flag-mashup, movie-frame, silhouette, text-message, title-sequence, stats-puzzle
- Remaining 6 new tools (backwards, emoji-song, first-letters, instrument-solo, intro-only, wrong-speed, voice-id, translator-fail) need Save button added

## Deck generation
- `/api/generate-event-deck-v2` — builds real Google Slides deck programmatically
- White bg, grid texture, KBT branding applied server-side (not in tool outputs)
- All 68 question types now have QUESTION_TYPES config (accent color + wordmark)
- Real templates: Drive folder 1-z8QMj_9YAGrqJhzHNoBMRFg3t6JanZa (hello@knowbrainertrivia.com.au)
- LuckDragon copies: Drive folder 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx

## kbt-brand.js — NOTE
- Was updated to dark theme (#0f172a) this session but real KBT slides are WHITE
- Tool UI chrome can stay dark; slide canvas OUTPUTS should match real templates (white/grid)
- TODO: revert tool canvas outputs to white to match real slide branding

## kbt_qtype IDs (key ones)
face_morph=19, ghost_actors=20, linked_pics=22, name_the_brain=24, soundmash=26,
crack_the_code=14, brands=17, carmen_sandiego=23, guess_the_year=8
New types: baby_photo=49, backwards=50, pixel_reveal=51, city_skyline=52,
close_up=53, country_outline=54, emoji_song=55, first_letters=56,
flag_mashup=57, instrument_solo=58, intro_only=59, movie_frame=60,
silhouette=61, sound_and_pic=62, stats_puzzle=63, text_message=64,
title_sequence=65, translator_fail=66, voice_id=67, wrong_speed=68

## Weekly rotation workflow
1. Use tools during the week → 💾 Save to Library
2. Admin → Questions → filter draft → approve
3. Friday: pick questions → generate-event-deck-v2 → Slides deck
