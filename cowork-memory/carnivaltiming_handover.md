---
name: Carnival Timing — handover (GitHub-canonical)
description: carnivaltiming.com. CF Pages + DO WebSocket. v8.2.2. Full timing system — swim/track video finish, XC marshal, DQ flags, heat picker, admin PIN, CSV export.
type: project
---
Canonical: github.com/PaddyGallivan/asgard-handovers/blob/main/carnivaltiming.md

Live: https://carnivaltiming.com (CF Pages carnival-timing, Luck Dragon Main a6f47c17)
WS Worker: carnival-timing-ws → https://carnival-timing-ws.pgallivan.workers.dev
Frontend source: fetch from live site each session (no Drive copy)
Current version: v8.2.2 (deployed 2026-04-29)

v8.2: DQ flags per lane, heat picker (Heat 1/2/3/Final/none), admin PIN numpad, CSV export fix (async, r.results field)
v8.2.1: Replaced blocking confirm() in _offerSetPin with custom offer-pin-modal
v8.2.2: Added --border: #30363d to :root CSS (referenced in 12 inline templates, never declared)

All 13 test suites passing (28 functions, 17 DOM elements, 11 CSS vars, trimmedMean, DQ, PIN, CSV, heat picker).

Deploy (wrangler only — direct API serves 500):
```bash
mkdir -p /tmp/nc2 /tmp/nl2
npm_config_cache=/tmp/nc2 npm install --prefix /tmp/nl2 wrangler --no-fund --no-audit
export CLOUDFLARE_API_TOKEN="<vault CF_API_TOKEN>"
export CLOUDFLARE_ACCOUNT_ID="a6f47c17811ee2f8b6caeb8f38768c20"
export HOME=/tmp/wrangler-home && mkdir -p $HOME
cd /tmp && /tmp/nl2/node_modules/.bin/wrangler pages deploy /tmp/ct-deploy --project-name=carnival-timing --branch=main
```
