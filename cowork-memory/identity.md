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
Keys: ANTHROPIC_API_KEY, ASGARD_DB_ID, CF_ACCOUNT_ID, CF_API_TOKEN, GITHUB_TOKEN, RESEND_API_KEY, STRIPE_SECRET_KEY, SUPABASE_ANON_KEY, SUPABASE_URL, VAULT_ID, SLY_CF_TOKEN_2026_04_25, DISCORD_WEBHOOK_ASGARD

Discord webhook (Asgard ops channel): https://discord.com/api/webhooks/1497607433638514859/8W8U8P7HBV2YeGEjCuKROeLFvT67_Dc01CurK-IHXaV1vbs8mNHZuvT8dxUPxBJkkCh7

CF Account ID: a6f47c17811ee2f8b6caeb8f38768c20

Projects under Luck Dragon: SportPortal (4 school-sport sites), KBT-trial (trivia rebuild), Bomber Boat (Essendon fan charter), Bulldogs Boat (fan boat bookings).
DO NOT touch Know Brainer Trivia (original KBT) — only the kbt-trial rebuild.

Ops log channel: Discord (NOT Slack). End-of-session summaries go to Discord #all-asgard equivalent.

Google Drive mount: G:\My Drive (NOT H:). ASGARD project files live there. Always save final deliverables to G:\My Drive\ASGARD\<project>\ — never leave them in C drive Cowork session outputs.

**Why:** Single source of truth for onboarding any new Claude session quickly.
**How to apply:** Use paddy@luckdragon.io for all Cloudflare, GCP, Stripe logins. Fetch secrets from vault, never ask Paddy to paste tokens.
