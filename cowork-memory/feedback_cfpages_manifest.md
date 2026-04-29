---
name: CF Pages deploy — use wrangler not direct API
description: Direct API serves HTTP 500. Always use wrangler from /tmp with fresh nc2/nl2 dirs.
type: feedback
---
Use wrangler to deploy CF Pages, NOT the direct upload REST API. Direct API accepts request, returns success, but serves HTTP 500.

**Install pattern (avoids owned-cache issues from prior sessions):**
```bash
mkdir -p /tmp/nc2 /tmp/nl2
npm_config_cache=/tmp/nc2 npm install --prefix /tmp/nl2 wrangler --no-fund --no-audit
```

**Deploy from /tmp (not /sessions — disk fills at 9.3/9.8GB):**
```bash
export CLOUDFLARE_API_TOKEN="<from vault>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
export HOME=/tmp/wrangler-home && mkdir -p $HOME
cd /tmp && /tmp/nl2/node_modules/.bin/wrangler pages deploy /tmp/ct-deploy --project-name=carnival-timing --branch=main
```
