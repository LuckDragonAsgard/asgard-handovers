# Memory index

> **Cross-machine canonical:** https://github.com/LuckDragonAsgard/asgard-handovers/tree/main/cowork-memory — fetch `MEMORY.md` from there at session start on any new account/machine.

- [⛔ NOTHING on Drive — all GitHub or Cloudflare](feedback_no_drive_storage.md) — Drive is purge-only. No drafts, no staging, no "temporary" files. Push direct to GitHub or pass via chat.

- [Bomber Boat — handover (GitHub-canonical)](bomberboat_handover.md) — github.com/PaddyGallivan/bomber-boat → docs/HANDOVER.md. Drive copy is a redirect stub.
- [Bomber Boat corporate ideas](bomberboat_corporate_ideas.md) — ⚠️ Nearly lost. EFC partnership ($15-20k/yr deal), corporate Friday night charters, Yarra Cruises fleet partnership, beer sponsorship.
- [Luck Dragon identity & credentials](identity.md) — primary paddy@luckdragon.io, vault at asgard-vault.pgallivan.workers.dev
- [Discord webhook — temp local store](discord_webhook_temp.md) — ✅ RESOLVED 2026-04-29. Webhook in vault as DISCORD_WEBHOOK_ASGARD. Vault PIN rotated to 2967.
- [Bomber Boat DNS fix](bomberboat_dns_fix.md) — apex was A record to Vercel; fixed to CNAME → bomber-boat.pages.dev
- [Bomber Boat deploy footgun](bomberboat_deploy_footgun.md) — NEVER run deploy-spots-fix.*; use bomberboat-rollback.bat or wrangler pages deploy
- [Bomber Boat brand assets](bomberboat_brand.md) — logo PNGs in H:\My Drive, Instagram setup incomplete
- [Bomber Boat deploy infra (SUPERSEDED)](bomberboat_auto_deploy.md) — local watcher retired 27 Apr 2026. Push to GitHub repo for deploy.
- [Sport Portal — handover (GitHub-canonical)](sportportal_handover.md) — github.com/LuckDragonAsgard/asgard-handovers/blob/main/sportportal.md. Drive copy is a redirect stub.
- [SportPortal source/live drift](sportportal_source_drift.md) — ✅ FIXED 2026-04-28. Both index.html and privacy.html in main now say australia-southeast1. Safe to push.
- [CF lame delegation = unactivated zone](cf_lame_delegation_pattern.md) — DNS REFUSED from CF NS means zone is in "Finish setup" state; click Free to activate
- [Domain transfers tracker](domain_auth_codes.md) — VentraIP inbound transfers status. bulldogsboat.com.au + bomberboat.com.au done. Auth codes NOT stored.
- [Crazy Domains exit](crazydomains_exit.md) — Migrating off CD. bomberboat done 2026-04-28; daddytissues + Judy domains still to do; CD account not yet fully scrolled.
- [Judy's Kitchen — handover (GitHub-canonical)](judyskitchen_handover.md) — Idea-stage. NO website ever existed. Two domains planned (.com.au→VentraIP, .store→CF Registrar). Handover: github.com/LuckDragonAsgard/asgard-handovers/blob/main/judyskitchen.md
- [CD upsell dark patterns](feedback_cd_dark_patterns.md) — Always itemise CD invoices. Domain Expiry Protection ($10.49/MONTH) is the worst trap. Domain Guard pointless on .au.
- [Session ritual feedback](feedback_session_ritual.md) — NO new handover file each session; overwrite one canonical HANDOVER-EOD.md at end only
- [Superleague v4 deploy (GitHub-canonical)](superleague_deploy.md) — CF deploy via sly-deploy relay (RAW body, no JSON wrap). Old leaked token invalid. Fresh token from vault as `CF_API_TOKEN`. Live v4 running.
- [KBT deploy pipeline](kbt_pipeline.md) — gh-push (Luck Dragon Main acct `a6f47c17`) auto-deploys kbt-trial to CF Pages (kbt-trial-9gu.pages.dev) on every push
- [⚠️ Project Armada — knowbrainertrivia.com.au REAL production platform](project_armada.md) — Slide Gen at /slidegen generates Google Slides from Event IDs. "Our templates" = these Google Slides, NOT dark canvas PNGs from GH Pages tools.
- [⚠️ KBT slide template — REAL design (white bg, color-coded)](kbt_slide_template.md) — WHITE background always. Color per question type (Brain=green, Brand=blue, Year=pink, Fifty-Fifty=orange, MC=purple). NO dark canvas, NO teal/gold, NO Bowlby One SC. Source: templates/KBT_Example_Slides.pptx in repo.
- [KBT latest handover (GitHub-canonical)](kbt_handover.md) — github.com/LuckDragonAsgard/asgard-handovers/blob/main/kbt.md. Prod is luckdragonasgard.github.io/kbt-trivia-tools/host-app.html (NOT Vercel, NOT CF Worker — moved to GH Pages 2026-04-27).
- [Use asgard-tools for deploys](feedback_use_asgard_tools.md) — deploy via asgard-tools /chat/smart agent loop (deploy_worker, gh-push), NOT bat files. Bats only for chicken/egg cases.
- [⛔ NEVER store/build locally](feedback_no_local_storage.md) — no local builds, no "do you have the repo locally", no `wrangler ./dist` from a local shell. Cloud-side deploys only.
- [Asgard — current state](asgard_handover.md) — Live `asgard.pgallivan.workers.dev` **v8.8.2** (black-screen fixed 2026-04-29). Source synced. CF_API_TOKEN + GITHUB_TOKEN both work. asgard-tools env PINs synced to vault. Cron `0 18` set on asgard-backup.
- [Template literal escape bombs](feedback_template_literal_bombs.md) — Dashboard is a backtick template literal; V8 strips one layer of `\\`. `\\'` → `'` and `\\n` → LF break the served browser JS. Rewrite or double-escape.
- [TWO v780 source files — DON'T confuse them](asgard_v780_two_files.md) — `asgard-home-v780 (1).js` is the user's full-feature v7.8.0 (1977 lines, build on this). `asgard-home-v780.js` is Claude's bare D1 spike (867 lines).
- [Asgard Project Hub = D1 products table](asgard_project_hub.md) — 51 projects/ideas live in asgard-brain D1; dashboard reads client-side; never hardcode the list.
- [gh-push relay — now auth-gated](gh_push_auth.md) — Bearer token required since 2026-04-28. Bearer stored as CF secret. Prefer direct GitHub API via asgard-tools.
- [CF blocks worker→worker fetch in zone](cf_zone_fetch_block.md) — `*.pgallivan.workers.dev` → `*.pgallivan.workers.dev` returns 1042/empty; do these calls client-side or use bindings.
- [Edit tool null padding footgun](edit_tool_null_padding.md) — Edit shrinking a file leaves trailing `\x00` bytes; CF deploy rejects. Strip nulls before base64.
- [WPS Hub — handover GitHub-canonical, Drive=0](wps_staff_hub.md) — v3 live at wps.carnivaltiming.com (CF Worker wps-hub-v3). All 5 security headers added 2026-04-28. D1 wps-hub-db `d89d5e1b`. Handover: github.com/LuckDragonAsgard/wps-hub/blob/main/docs/HANDOVER.md.
- [WCYMS — ARCHIVED 2026-04-27](wcyms_state.md) — All CF deploys deleted, D1 archived. Stub repos `cyms-club-app`/`footy-club-app` still exist. Handover: `github.com/LuckDragonAsgard/asgard-handovers/blob/main/wcyms.md`.
- [asgard-handovers repo](asgard_handovers_repo.md) — `github.com/LuckDragonAsgard/asgard-handovers` is the canonical handover store. One md per project, overwrite in place, git holds history.
- [Clubhouse — NEW project (idea/scaffolded)](clubhouse_handover.md) — multi-tenant sport-club platform. Repo `github.com/PaddyGallivan/clubhouse`, handover at `docs/HANDOVER.md`. D1 id=52. No code yet — write product brief next.
- [Carnival Timing — handover (GitHub-canonical)](carnivaltiming_handover.md) — carnivaltiming.com. CF Pages + DO WebSocket (v8.1). Swim/track video finish, XC bib queue, demo seed URL params. Handover: github.com/LuckDragonAsgard/asgard-handovers/blob/main/carnivaltiming.md
- [CF Pages deploy — use wrangler not direct API](feedback_cfpages_manifest.md) — Direct REST API silently stores empty hash → HTTP 500. Always use wrangler from /tmp (npm_config_cache=/tmp/npm-cache, HOME=/tmp/wrangler-home).

