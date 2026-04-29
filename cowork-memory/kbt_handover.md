---
name: KBT latest handover
description: GH Pages + Supabase + CF Worker. All tools working 2026-04-29.
type: project
---
Canonical: github.com/PaddyGallivan/asgard-handovers/blob/main/kbt.md
RESUME-HERE: github.com/LuckDragonAsgard/kbt-trivia-tools/blob/main/RESUME-HERE.md

Stack: GitHub Pages + Supabase + CF Worker. NO Drive files.

Key URLs:
- Host: https://luckdragonasgard.github.io/kbt-trivia-tools/host-app.html
- Player: .../player-app.html?code=EVENT_CODE
- Admin: .../admin-app.html
- Backend: https://kbt-api.pgallivan.workers.dev (Luck Dragon Main a6f47c17)
- Repo: LuckDragonAsgard/kbt-trivia-tools (GH Pages, ~25s deploy on push)
- Supabase: huvfgenbcaiicatvtxak.supabase.co (ap-southeast-2, 34 tables, RLS on all)
- GCP OAuth: client 342815819710-..., project bubbly-clarity-494509-g0 (Slides export)

All tools ✅ as of 2026-04-29. Live Worker hash: fb4904ea.

Question Engine: kbt-question-engine.pgallivan.workers.dev — CF cron every 6h.
