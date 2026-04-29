---
name: Bomber Boat DNS fix — 25 Apr 2026
description: Apex had stale A record to Vercel; fixed to CNAME → bomber-boat.pages.dev
type: feedback
---
Apex bomberboat.com.au had stale A record to 216.198.79.1 (Vercel). Fixed: deleted A record, proxied CNAME → bomber-boat.pages.dev.

DO NOT add A records for apex pointing to Vercel IPs. Always use Git push → CF Pages auto-deploy.
