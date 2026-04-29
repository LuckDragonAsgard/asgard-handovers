---
name: CF blocks worker→worker fetch within same zone
description: fetch() from one *.pgallivan.workers.dev worker to another fails (CF error 1042). Do same-zone D1/brain calls client-side.
type: feedback
---
Cloudflare blocks worker-to-worker fetch() within the same zone. Symptom: call returns nothing (0 results) or throws 1042.

**Why:** Asgard dashboard v7.8.0 tried to fetch asgard-brain server-side — got count:0 even though same query worked from any external client.

**How to apply:**
- For *.pgallivan.workers.dev ↔ same zone: do the call client-side from the browser. CORS on brain is Access-Control-Allow-Origin: * so it just works.
- Alternative for true server-to-server: bind directly (D1 binding, service binding, KV binding) instead of fetching by URL.
