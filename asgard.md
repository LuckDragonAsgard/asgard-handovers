# Asgard handover — 2026-04-29 EOD

## Live workers
- asgard v8.4.0 (CSP + CORS hardened, /products PIN-gated)
- asgard-tools v1.5.4 (validPins fix, CORS locked)
- asgard-brain 1.3
- asgard-vault 1.2.0-pin-rotation
- asgard-ai multi-provider router
- asgard-backup v1.2.0 (NEW — daily D1 backup to GitHub)

## Source
All workers: github.com/PaddyGallivan/asgard-source/tree/main/workers

## Deploy path
POST https://asgard-tools.pgallivan.workers.dev/admin/deploy
Headers: X-Pin, User-Agent: Mozilla/5.0, Origin: https://asgard.pgallivan.workers.dev
Body: {worker_name, code_b64, main_module:"worker.js"}

## D1 (asgard-brain, b6275cb4-9c0f-4649-ae6a-f1c2e70e940f)
51 rows in products, 40+ columns. Multi-user PINs: 6d06=paddy, 844c=jacky, 3df4=george

## Security done this session
1. CSP header added to asgard
2. CORS locked on asgard + asgard-tools (origin whitelist)
3. /products PIN-gated (401 without valid PIN)
4. validPins bug fixed in asgard-tools /admin/deploy

## Backup system (NEW)
Worker: asgard-backup.pgallivan.workers.dev v1.2.0
Repo: github.com/PaddyGallivan/asgard-backups
Bindings: PADDY_PIN, GITHUB_TOKEN, DB (D1 direct) all confirmed
First run: 2026-04-28T23:29 — 18 tables full, 13 counted, 0 errors
TODO: Add cron in CF dashboard: Workers & Pages > asgard-backup > Triggers > 0 18 * * *

## Known issues
1. editProjectFlow() only prompts Y1-Y5 — needs Y6-Y10 + cash_spent/earned/hours_needed
2. CF API vault tokens 401 — use asgard-tools /admin/deploy (uses its own binding)
3. asgard-backup cron not yet set — needs CF dashboard
4. 15 projects have blank github_url in D1 despite repos existing