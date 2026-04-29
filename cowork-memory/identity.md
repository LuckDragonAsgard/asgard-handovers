---
name: Luck Dragon identity & credentials
description: Paddy's primary identities, accounts, and where secrets live
type: user
---
Primary login: paddy@luckdragon.io (Workspace, GCP, Cloudflare Super Admin, Stripe)
Secondary: hello@luckdragon.io (Bustle virtual office, can't log in to receive)
Legacy: pgallivan@outlook.com (inbound email routing target, being wound down)

Entity: Luck Dragon Pty Ltd, ABN 64 697 434 898

Vault: https://asgard-vault.pgallivan.workers.dev/secret/<KEY>
PIN: stored as PADDY_PIN env secret in vault worker (v1.2.0-pin-rotation). Fetch via X-Pin header.
Keys: ANTHROPIC_API_KEY, ASGARD_DB_ID, CF_ACCOUNT_ID, CF_API_TOKEN, GITHUB_TOKEN, RESEND_API_KEY, STRIPE_SECRET_KEY, SUPABASE_ANON_KEY, SUPABASE_URL, VAULT_ID, SLY_CF_TOKEN_2026_04_25, DISCORD_WEBHOOK_ASGARD

Discord webhook (Asgard ops channel): stored in vault as DISCORD_WEBHOOK_ASGARD — do NOT hardcode here.

CF Account ID: a6f47c17811ee2f8b6caeb8f38768c20

Projects under Luck Dragon: SportPortal (4 school-sport sites), KBT-trial (trivia rebuild), Bomber Boat (Essendon fan charter), Bulldogs Boat (fan boat bookings).
DO NOT touch Know Brainer Trivia (original KBT) — only the kbt-trial rebuild.

Ops log channel: Discord (NOT Slack).
Google Drive mount: G:\My Drive (NOT H:).

Multi-user Asgard PIN prefixes: 6d06=paddy, 844c=jacky, 3df4=george.

**How to apply:** Use paddy@luckdragon.io for all Cloudflare, GCP, Stripe logins. Fetch secrets from vault, never ask Paddy to paste tokens.
