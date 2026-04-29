---
name: Asgard — current state pointer
description: Live workers, versions, deploy path, D1 schema, known issues
type: reference
---
**Canonical handover (READ FIRST every Asgard session):**
https://raw.githubusercontent.com/PaddyGallivan/asgard-handovers/main/asgard.md

**Live workers (2026-04-29 EOD):**
- asgard.pgallivan.workers.dev — v8.6.0 (PRODUCTS_LOADING spinner, load-source button, browser notifications, unread badge poll)
- asgard-ai.pgallivan.workers.dev — multi-provider router
- asgard-tools.pgallivan.workers.dev — v1.5.4 (validPins fix, CORS locked)
- asgard-brain.pgallivan.workers.dev — 1.3 (D1 service + cf_deploy)
- asgard-vault.pgallivan.workers.dev — 1.2.0-pin-rotation
- asgard-backup.pgallivan.workers.dev — v1.2.0 (daily D1 backup → PaddyGallivan/asgard-backups)

**Deploy path:**
POST https://asgard-tools.pgallivan.workers.dev/admin/deploy
Headers: X-Pin: <PIN>, User-Agent: Mozilla/5.0..., Origin: https://asgard.pgallivan.workers.dev
Body: {worker_name, code_b64, main_module:"asgard.js"}
NOTE: User-Agent + Origin headers REQUIRED — plain curl gets CF 1010 bot block.

**D1 products table (asgard-brain, b6275cb4-9c0f-4649-ae6a-f1c2e70e940f):**
51 rows, 39+ columns. Multi-user PIN prefixes: 6d06=paddy, 844c=jacky, 3df4=george.

**Known issues:**
1. Edit flow missing new fields — editProjectFlow() only prompts Y1-Y5. Needs cash_spent, cash_earned, hours_needed, recommendations, Y6-Y10
2. CF_API_TOKEN + SLY token both 401 from CF REST API. Deploy via asgard-tools still works (uses its own binding).
3. GITHUB_TOKEN in vault is 403 — vault returns a token but GitHub API rejects it. Needs rotation.
4. asgard-backup cron not set — MANUAL: CF dashboard → Workers → asgard-backup → Triggers → Add Cron → 0 18 * * *
5. 15 projects have blank github_url in D1 — repos exist but field not populated.
