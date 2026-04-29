---
name: Asgard — current state pointer
description: Live workers v8.6.0, 51 D1 projects, deploy path, known issues
type: reference
---
**Canonical handover (READ FIRST every Asgard session):**
https://raw.githubusercontent.com/PaddyGallivan/asgard-handovers/main/asgard.md

**Live workers (2026-04-29 EOD):**
- asgard.pgallivan.workers.dev — v8.6.0
- asgard-tools.pgallivan.workers.dev — v1.5.4
- asgard-brain.pgallivan.workers.dev — 1.3 (D1 service)
- asgard-vault.pgallivan.workers.dev — 1.2.0-pin-rotation
- asgard-backup.pgallivan.workers.dev — v1.2.0 (daily D1 backup → asgard-backups)
- asgard-ai.pgallivan.workers.dev — multi-provider router

**Deploy path:**
POST https://asgard-tools.pgallivan.workers.dev/admin/deploy
Headers: X-Pin: <PIN>, User-Agent: Mozilla/5.0..., Origin: https://asgard.pgallivan.workers.dev
Body: {worker_name, code_b64, main_module:"asgard.js"}
NOTE: User-Agent + Origin REQUIRED — plain curl gets CF 1010 bot block.

**D1:** asgard-brain b6275cb4-9c0f-4649-ae6a-f1c2e70e940f — 51 rows, 39+ columns.
Multi-user PIN prefixes: 6d06=paddy, 844c=jacky, 3df4=george.

**Known issues:**
1. editProjectFlow() only prompts Y1-Y5 — needs cash_spent, cash_earned, hours_needed, recommendations, Y6-Y10
2. CF_API_TOKEN + SLY token both 401 from CF REST API. asgard-tools deploy still works (own binding).
3. GITHUB_TOKEN in vault 403 — needs rotation. Affects GitHub commits from vault token.
4. asgard-backup cron not set — MANUAL: CF dashboard → asgard-backup → Triggers → 0 18 * * *
5. 15 projects have blank github_url in D1.
