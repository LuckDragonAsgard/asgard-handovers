---
name: Bomber Boat DNS fix — 25 Apr 2026
description: Apex bomberboat.com.au had stale A record to Vercel; fixed to CNAME → bomber-boat.pages.dev
type: feedback
---
The apex bomberboat.com.au had a stale A record pointing to 216.198.79.1 (Vercel). CF Pages custom domain was deactivated.

Fix: deleted A record, created proxied CNAME bomberboat.com.au → bomber-boat.pages.dev. CF Pages domain activated automatically.

**How to apply:** DO NOT add A records for the apex pointing to Vercel IPs. DO NOT deploy to Vercel. Always use wrangler pages deploy.
