# Memory index

## How to bootstrap on a new machine
At the start of every session, fetch this index:
`https://raw.githubusercontent.com/PaddyGallivan/asgard-handovers/main/cowork-memory/MEMORY.md`

Then fetch any linked files you need. All files in this folder are the canonical cross-machine memory.

## Rules & feedback
- [NEVER store anything on Drive](feedback_no_drive_storage.md) — Drive is purge-only. GitHub or Cloudflare only.
- [NEVER store or build locally](feedback_no_local_storage.md) — no local builds, no wrangler ./dist, no repo clones.
- [No new handover file per session](feedback_session_ritual.md) — Overwrite one canonical file at end only.
- [Use asgard-tools agent loop for deploys](feedback_use_asgard_tools.md) — /chat/smart (deploy_worker, gh-push). Bats only for chicken/egg.
- [CF Pages — use wrangler not direct API](feedback_cfpages_manifest.md) — Direct API serves HTTP 500. Always wrangler from /tmp with fresh nc2/nl2 dirs.
- [CF blocks worker→worker fetch in same zone](cf_zone_fetch_block.md) — *.pgallivan.workers.dev → same zone = 1042. Call client-side.
- [Edit tool leaves trailing null bytes](edit_tool_null_padding.md) — Strip nulls before base64/deploy.
- [CF lame delegation = unactivated zone](cf_lame_delegation_pattern.md) — DNS REFUSED = "Finish setup" state; click Free to activate.
- [Crazy Domains upsell dark patterns](feedback_cd_dark_patterns.md) — Domain Expiry Protection ($10.49/MONTH) is the worst trap.
- [gh-push relay now auth-gated](gh_push_auth.md) — Bearer token required. Prefer direct GitHub API via asgard-tools.

## Identity & infrastructure
- [Luck Dragon identity & credentials](identity.md) — primary paddy@luckdragon.io, vault at asgard-vault.pgallivan.workers.dev, CF account a6f47c17.
- [asgard-handovers repo](asgard_handovers_repo.md) — github.com/PaddyGallivan/asgard-handovers — one md per project, overwrite in place.
- [Asgard — current state](asgard_handover.md) — v8.6.0 live. 51 D1 projects. CANONICAL: github.com/PaddyGallivan/asgard-handovers/blob/main/asgard.md
- [Asgard Project Hub = D1 products table](asgard_project_hub.md) — 51 projects in asgard-brain D1; never hardcode the list.
- [TWO v780 source files](asgard_v780_two_files.md) — asgard-home-v780 (1).js is user's full v7.8.0 (1977 lines). Build on that one.

## Projects
- [Bomber Boat — handover](bomberboat_handover.md) — github.com/PaddyGallivan/bomber-boat/docs/HANDOVER.md. Git-connected CF Pages.
- [Bomber Boat corporate ideas](bomberboat_corporate_ideas.md) — EFC partnership ($15-20k/yr), corporate Friday nights, Yarra Cruises, beer sponsorship.
- [Bomber Boat DNS fix](bomberboat_dns_fix.md) — apex was A record to Vercel; fixed to CNAME → bomber-boat.pages.dev.
- [Bomber Boat deploy footgun](bomberboat_deploy_footgun.md) — NEVER run deploy-spots-fix.*
- [Bomber Boat brand assets](bomberboat_brand.md) — logo PNGs in Drive, Instagram setup incomplete.
- [Bomber Boat deploy infra (SUPERSEDED)](bomberboat_auto_deploy.md) — local watcher retired 27 Apr 2026.
- [Sport Portal — handover](sportportal_handover.md) — 4-domain family. asgard-handovers/sportportal.md. Firestore australia-southeast1.
- [SportPortal source/live drift FIXED](sportportal_source_drift.md) — FIXED 2026-04-28. Both files say australia-southeast1.
- [KBT latest handover](kbt_handover.md) — GH Pages + Supabase + CF Worker. All tools working 2026-04-29.
- [KBT deploy pipeline](kbt_pipeline.md) — push to LuckDragonAsgard/kbt-trivia-tools → GH Pages auto-deploy.
- [WPS Hub — handover](wps_staff_hub.md) — v4 at wps.carnivaltiming.com (CF Worker wps-hub-v3). D1 wps-hub-db.
- [WCYMS — ARCHIVED 2026-04-27](wcyms_state.md) — All CF deploys deleted. Do NOT try to redeploy.
- [Carnival Timing — handover](carnivaltiming_handover.md) — v8.2.2. carnivaltiming.com. CF Pages + DO WebSocket. All timing features.
- [Superleague v4 deploy](superleague_deploy.md) — CF Worker sly-app via sly-deploy relay. RAW body, no JSON wrap.
- [Clubhouse — NEW (idea/scaffolded)](clubhouse_handover.md) — Multi-tenant sport-club platform. PaddyGallivan/clubhouse. No code yet.
- [Judy's Kitchen — handover](judyskitchen_handover.md) — Idea-stage. NO website ever existed.
- [Crazy Domains exit](crazydomains_exit.md) — bomberboat done; daddytissues + Judy still to do.
- [Domain transfers tracker](domain_auth_codes.md) — VentraIP inbound. bulldogsboat + bomberboat done. Auth codes NOT stored.
