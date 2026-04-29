---
name: CF Pages deploy — use wrangler not direct API
description: CF Pages direct upload API returns HTTP 500 even when deploy API says success. Always use wrangler pages deploy from /tmp.
type: feedback
---
**Use wrangler to deploy CF Pages, not the direct upload REST API.**

The direct API accepts the request and returns success, but the deployed files show empty hash and serve HTTP 500.

**Footgun:** bash sandbox /sessions partition fills up — wrangler defaults tmpdir to $CWD/.wrangler/tmp. Fix: run wrangler from /tmp.

**How to apply:**
```bash
# Install once per session (use fresh dirs to avoid owned-cache issues from prior sessions)
mkdir -p /tmp/nc2 /tmp/nl2
npm_config_cache=/tmp/nc2 npm install --prefix /tmp/nl2 wrangler --no-fund --no-audit

# Deploy
export CLOUDFLARE_API_TOKEN="<from vault: CF_API_TOKEN>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
export HOME=/tmp/wrangler-home && mkdir -p $HOME
cd /tmp && /tmp/nl2/node_modules/.bin/wrangler pages deploy /tmp/ct-deploy \
  --project-name=carnival-timing --branch=main
```

**Rollback:** POST /v4/accounts/{id}/pages/projects/{name}/deployments/{id}/rollback works.
