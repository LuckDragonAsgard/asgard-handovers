---
name: Superleague v4 — deploy & tech stack
description: CF Worker sly-app via sly-deploy relay. RAW body NOT JSON. KV binding required.
type: project
---
Tech stack:
- sly-app CF Worker: serves KV HTML + JS/CSS patch, proxies /api/* to sly-api
- D1 Database: 8d0b8373-40ea-4174-bfd9-628b790abf92
- CF Account: a6f47c17811ee2f8b6caeb8f38768c20
- KV namespace: 4f427724561e48f682d4a7c6153d7124 (SLY_STATIC)
- Live URL: https://superleague.streamlinewebapps.com
- GitHub repo: LuckDragonAsgard/superleague-yeah-v4

CRITICAL: Always include KV binding in deploy metadata or env.SLY_STATIC = undefined → CF error 1101.

Deploy via sly-deploy relay:
POST https://sly-deploy.pgallivan.workers.dev/deploy/sly-app
Auth: Bearer SLY_DEPLOY_2026_LUCK_DRAGON
Body: RAW JS source. Content-Type: application/javascript.
DO NOT JSON-wrap — relay calls req.text(). JSON wrapping deploys the JSON literal → syntax error.
