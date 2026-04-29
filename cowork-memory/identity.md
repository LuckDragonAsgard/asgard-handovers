---
name: Luck Dragon identity & credentials
description: Paddy's primary identities, accounts, and where secrets live (vault PIN intentionally NOT stored here)
type: user
---
Primary login: paddy@luckdragon.io (Workspace, GCP, Cloudflare Super Admin, Stripe)
Secondary: hello@luckdragon.io (Bustle virtual office, can't log in to receive)
Legacy: pgallivan@outlook.com (being wound down — do NOT use as email destination)
Deliverables email: paddy@luckdragon.io

Entity: Luck Dragon Pty Ltd, ABN 64 697 434 898

Vault: https://asgard-vault.pgallivan.workers.dev/secret/<KEY>
Vault PIN: NOT stored in this repo. Paddy has it in Outlook (subject "MK"). Ask him at runtime if needed.
Keys held in vault: ANTHROPIC_API_KEY, ASGARD_DB_ID, CF_ACCOUNT_ID, CF_API_TOKEN, GITHUB_TOKEN, RESEND_API_KEY, STRIPE_SECRET_KEY, SUPABASE_ANON_KEY, SUPABASE_URL, VAULT_ID, DISCORD_WEBHOOK_ASGARD

CF Account ID: a6f47c17811ee2f8b6caeb8f38768c20 (Luck Dragon Main)
GitHub org: LuckDragonAsgard (repos consolidated 2026-04-29)

Projects under Luck Dragon: SportPortal (4 school-sport sites), KBT-trial (trivia rebuild), Bomber Boat (Essendon fan charter), Bulldogs Boat (fan boat bookings), Clubhouse (NEW — multi-tenant club platform), Carnival Timing, WPS Hub.
DO NOT touch Know Brainer Trivia (original KBT) — only the kbt-trial rebuild.

Ops log channel: Discord (NOT Slack). End-of-session summaries go to Discord #all-asgard equivalent (webhook in vault as DISCORD_WEBHOOK_ASGARD).

Google Drive policy: NOTHING stored on Drive. Push to GitHub or Cloudflare. See `feedback_no_drive_storage.md`.

**Why:** Single source of truth for onboarding any new Claude session quickly.
**How to apply:** Use paddy@luckdragon.io for all Cloudflare, GCP, Stripe logins. Fetch secrets from vault, never ask Paddy to paste tokens in chat.