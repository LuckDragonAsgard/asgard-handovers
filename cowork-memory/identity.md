---
name: Luck Dragon identity & credentials
description: Paddy's primary identities, accounts, and where secrets live
type: user
originSessionId: 874f7f56-babd-48a5-abbd-ee2f4d87c8c8
---
Primary login: paddy@luckdragon.io (Workspace, GCP, Cloudflare Super Admin, Stripe)
Secondary: hello@luckdragon.io (Bustle virtual office, can't log in to receive)
Legacy: pgallivan@outlook.com (being wound down — do NOT use as email destination)
Deliverables email: paddy@luckdragon.io

Entity: Luck Dragon Pty Ltd, ABN 64 697 434 898, ACN 697 434 898 (registration confirmed 2026-04-30 per ASIC email)

Vault: https://asgard-vault.pgallivan.workers.dev/secret/<KEY>
Vault PIN: 2967 (confirmed working 2026-04-29). Old PIN 6d069732989ef453 is invalid — rotated out.
Keys: ANTHROPIC_API_KEY, ASGARD_DB_ID, CF_ACCOUNT_ID, CF_API_TOKEN, CF_PAGES_TOKEN, GITHUB_TOKEN, RESEND_API_KEY, STRIPE_SECRET_KEY, SUPABASE_ANON_KEY, SUPABASE_URL, VAULT_ID, SLY_CF_TOKEN_2026_04_25, DISCORD_WEBHOOK_ASGARD

CF_PAGES_TOKEN: scoped token with Cloudflare Pages:Edit permission — use this (not CF_API_TOKEN) for wrangler pages deploy. Deploy cmd: cd /tmp && CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=a6f47c17... HOME=/tmp/wh wrangler pages deploy /tmp/dir --project-name=<name>

Discord webhook (Asgard ops channel): stored in vault as DISCORD_WEBHOOK_ASGARD — do NOT hardcode here. Webhook ID 1499034258629591040, saved to vault 2026-04-29.

CF Account ID: a6f47c17811ee2f8b6caeb8f38768c20

Projects under Luck Dragon: SportPortal (4 school-sport sites), KBT-trial (trivia rebuild), Bomber Boat (Essendon fan charter), Bulldogs Boat (fan boat bookings).
DO NOT touch Know Brainer Trivia (original KBT) — only the kbt-trial rebuild.

Ops log channel: Discord (NOT Slack). End-of-session summaries go to Discord #all-asgard equivalent.

Google Drive mount: G:\My Drive is a sandbox-only virtual mount — NOT accessible on Paddy's real computer. Do NOT save deliverables there. Push to GitHub or deploy to Cloudflare instead.

**Why:** Single source of truth for onboarding any new Claude session quickly.
**How to apply:** Use paddy@luckdragon.io for all Cloudflare, GCP, Stripe logins. Fetch secrets from vault, never ask Paddy to paste tokens.
