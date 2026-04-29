---
name: CF blocks worker→worker fetch within same zone
description: *.pgallivan.workers.dev → same zone = CF error 1042. Do these calls client-side.
type: feedback
---
Cloudflare blocks worker-to-worker fetch() within the same zone. Returns 0 results or throws 1042.

**How to apply:**
- For *.pgallivan.workers.dev ↔ same zone: call client-side from browser. CORS on brain is Access-Control-Allow-Origin: * so it works.
- True server-to-server: use direct bindings (D1, service, KV) not URL fetch.
