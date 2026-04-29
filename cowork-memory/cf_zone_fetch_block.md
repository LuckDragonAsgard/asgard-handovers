---
name: CF blocks worker→worker fetch within same zone
description: Server-side fetch from one *.pgallivan.workers.dev worker to another fails (CF error 1042 / 0 results). Always do same-zone D1/brain calls client-side.
type: feedback
---
Cloudflare blocks worker-to-worker `fetch()` within the same zone. Symptom: the call returns nothing (0 results) or throws 1042; no useful error in the worker logs.

**Why:** First v7.8.0 deploy of the Asgard dashboard tried to fetch `asgard-brain.pgallivan.workers.dev/d1/query` server-side — got `count: 0` even though the same query worked from any external client.

**How to apply:**
- For `*.pgallivan.workers.dev` ↔ `*.pgallivan.workers.dev` integration, do the call **client-side** from the browser. CORS on brain is `Access-Control-Allow-Origin: *` so it just works.
- The pin (`2967`) being in client-side JS is the same exposure as `/admin/deploy` already has — fine.
- Alternative for true server-to-server: bind the resource directly (D1 binding, service binding, KV binding). Requires wrangler config change, not just `/admin/deploy`.