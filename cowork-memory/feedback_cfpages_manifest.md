---
name: CF Pages deploy — use wrangler, not direct API
description: CF Pages direct upload API returns HTTP 500 on serve even when deploy API says success. Always use wrangler pages deploy from /tmp.
type: feedback
---
**Use wrangler to deploy CF Pages, not the direct upload REST API.**

The direct API (`POST /v4/accounts/{id}/pages/projects/{name}/deployments`) accepts the request and returns success, but the deployed files show empty hash and serve HTTP 500.

**Footgun:** The bash sandbox's `/sessions` partition fills up — wrangler defaults its tmpdir to `$CWD/.wrangler/tmp`. Fix: run wrangler from `/tmp`.

**How to apply:**
```bash
export npm_config_cache=/tmp/npm-cache
npm install --prefix /tmp/npm-local wrangler
export CLOUDFLARE_API_TOKEN="<token from ASGARD_VAULT>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
export HOME=/tmp/wrangler-home && mkdir -p $HOME
mkdir -p /tmp/ct-deploy && cp ct-fix.html /tmp/ct-deploy/index.html
cd /tmp && /tmp/npm-local/node_modules/.bin/wrangler pages deploy /tmp/ct-deploy --project-name=carnival-timing --branch=main
```

**Rollback:** `POST /v4/accounts/{id}/pages/projects/{name}/deployments/{id}/rollback` works.