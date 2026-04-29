# KBT — Know Brainer Trivia — Handover

## Canonical live system
- **Prod platform**: `knowbrainertrivia.com.au` (OLD; not rebuilt yet)
- **GitHub Pages tools**: `luckdragonasgard.github.io/kbt-trivia-tools/` — replaces graphic designers
- **Repo**: `github.com/LuckDragonAsgard/kbt-trivia-tools`
- **API worker**: `kbt-api.pgallivan.workers.dev` (CF Worker, Luck Dragon Main acct)
- **host-app**: `luckdragonasgard.github.io/kbt-trivia-tools/host-app.html` (NOT Vercel, NOT CF)
- **Auto-deploy**: push to `main` → GH Pages deploys automatically

## Real KBT slide template (WHITE background — CRITICAL)
Source: `templates/KBT_Example_Slides.pptx` + `KBT_Question_Templates.pptx` in repo

- Background: **WHITE** always (never dark canvas)
- Top-left: R_Q_ label in colored rounded rectangle (white text)
- Question type title next to it in same bold color
- Content centred with lots of whitespace
- Cutout sticker photos (rembg, white outline, drop shadow)
- Solid color bar at very bottom
- Colors per type:
  - Brain/Maths = green `#16a34a`
  - Brand/Word/Crack = sky blue `#2563eb`
  - Year = pink `#db2777`
  - Fifty-Fifty = orange `#ea580c`
  - MC/Ghost/Facemorph = purple `#7c3aed`

## Mission: replace graphic designers
`knowbrainertrivia.com.au` pays designers to create image question slides. GitHub Pages tools automate this. Output must be pixel-perfect — indistinguishable from what the designer produces.

## Face morph correct technique (NOT fal.ai, NOT a split)
Layered composite with surgical feature erasure using **MediaPipe Face Landmarker** (478-pt mesh):
1. Detect landmarks on both faces
2. Align Face B onto Face A canvas using eye-centre affine transform (iris pts 468/473)
3. For each feature region: if assigned to Face A, erase that region from Face B with `blur(22px)` feathered `destination-out` fill
4. Composite: draw Face A base → draw feathered Face B on top → 10% Face A reconciliation pass
5. Run rembg cutout → white border sticker + drop shadow
6. Render on 1920×1080 white KBT slide

## All 7 tools status

### ✅ face-morph-tool.html — REBUILT v7 (2026-04-30)
- **Live**: `luckdragonasgard.github.io/kbt-trivia-tools/face-morph-tool.html`
- **Commit**: `5999890a258d` — feathered blend (blur erasure + reconciliation pass)
- MediaPipe landmark alignment, `blur(22px)` feathered feature erasure, sticker treatment
- Outputs: question slide (sticker morph) + answer slide (3 stickers + purple answer box)
- **Not yet tested with real face photos** — needs end-to-end validation

### ❌ brain-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, green `#16a34a`, "Name The Brain."

### ❌ guess-the-year-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, pink `#db2777`, "Guess The Year."

### ❌ crack-the-code-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, blue `#2563eb`, "Crack The Code."

### ❌ linked-pics-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, blue `#2563eb`, "Linked Pics."

### ❌ ghost-actors-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, purple `#7c3aed`, "Ghost Actors."

### ❌ soundmash-tool.html — NEEDS REBUILD
- Wrong dark canvas template → white bg, orange `#ea580c`, "Sound Mash."

## Live system (host-app) — audit status
Triple-pass audit done 2026-04-27, all ✅:
- host-app, player-app, admin-app, wrap, kbt-data.js, kbt-api worker, question-candidates, slides-export, all 7 media tools
- launchEvent/revealAnswer/gradeAllConfident verified, wrap tiers, submitRoundScore upsert, gradeAllConfident on empty

## Business model status
- Live Model ✅ Ship-ready
- Demo/Offline ✅ launchDemo() working
- Weekly School ⚠️ Designed only
- HQ Live/No-Host ⚠️ Designed only

## Outstanding / next session
1. **Test face-morph-tool v7** with real face photos end-to-end — verify blend quality
2. **Rebuild brain-tool** (simplest, just image + bg swap — good starting template for the rest)
3. **Rebuild remaining 5 tools** to white template
4. ⚠️ **Account change noted** — user switching accounts; check GH token + CF token on new account

## Key tech refs
- MediaPipe: `cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.js`
- rembg API: `POST kbt-api.pgallivan.workers.dev/api/fal-rembg` `{image: base64}` → `{url}`
- KBT API: `kbt-api.pgallivan.workers.dev` (CF Worker, Luck Dragon Main `a6f47c17`)
- KBT-trial auto-deploy: repo `a6f47c17` → CF Pages `kbt-trial-9gu.pages.dev`
- GH Pages deploy: push to `LuckDragonAsgard/kbt-trivia-tools` main branch
