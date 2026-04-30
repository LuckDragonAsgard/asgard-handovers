# Asgard — Handover (Session 6 EOD — 2026-04-29)

> Canonical. Drive=0. Source: github.com/PaddyGallivan/asgard-source

## Session 6 wins
1. asgard v8.8.3 — fixed showProjectInfo onclick (template-literal escaping). All tile modals work.
2. D1 cleanup — archived Thor/Thunder, merged KBT/Superleague/ON-ICE variants (~20 ops).
3. Jacky PIN — JACKY_PIN set, onboarding email sent (rooney.jaclyn.l@gmail.com).
4. D1 gaps filled — GitHub URLs + Recommendations for all active projects.
5. Long Range Tipping 404 fixed — Vercel Auth disabled + domain re-added via API. Live.
6. asgard-watchdog v1.1.0 — 5min cron, 9 endpoints, D1 log, state-change alerts, auto-heals asgard.

## Live workers (2026-04-29)
| Worker | Version | Notes |
|---|---|---|
| asgard | 8.8.3 | Dashboard |
| asgard-ai | latest | AI chat |
| asgard-tools | 1.5.4 | Deploy relay |
| asgard-brain | 1.2 | D1 + PIN auth |
| asgard-vault | 1.2.0 | KV secrets |
| asgard-backup | 1.2.0 | Backup |
| asgard-watchdog | 1.1.0 NEW | 5min health cron |

## Watchdog
- https://asgard-watchdog.pgallivan.workers.dev/ (/status /run)
- Cron: */5 * * * *
- Workers via CF Deployments API (avoids zone loopback)
- Sites via HTTP: longrangetipping.com, carnivaltiming.com, wps.carnivaltiming.com
- Alerts: paddy@luckdragon.io + rooney.jaclyn.l@gmail.com (state-change only)
- Auto-heals asgard from GitHub if down
- D1: health_log + health_state in asgard-brain

## Key facts
- Dashboard PIN: <vault: PADDY_PIN — ask Paddy out-of-band>
- API PIN (X-Pin): PADDY_PIN CF secret value
- D1 asgard-brain: b6275cb4-9c0f-4649-ae6a-f1c2e70e940f
- CF account: a6f47c17811ee2f8b6caeb8f38768c20
- Deploy: POST asgard-tools.pgallivan.workers.dev/admin/deploy X-Pin=PADDY_PIN
- Vault: GET asgard-vault.pgallivan.workers.dev/secret/KEY X-Pin=PADDY_PIN

## CRITICAL: Null-byte footgun
Claude Write/Edit pads files with null bytes. Strip before CF deploy:
  python3 -c "open(f,"wb").write(open(f,"rb").read().replace(b"\x00",b""))"

## Pending
- Commit .github/workflows/deploy.yml for GHA CI/CD (30sec user task)
- Migrate pgallivan@outlook.com + KBT Drive to R2
- Watchdog: self-monitoring (external check of asgard-watchdog itself)
