---
name: Use asgard-tools agent loop, not bat files, for deploys
description: For ASGARD-related changes, deploy via the asgard-tools /chat/smart agent loop (deploy_worker, get_worker_code, http_request, get_secret) — don't make Paddy double-click bat files.
type: feedback
---
For deploys to any CF Worker / Pages site, use the asgard-tools agent loop directly:

`POST https://asgard-tools.pgallivan.workers.dev/chat/smart` with a message instructing it to call `get_worker_code`, modify, then `deploy_worker`. It runs server-side and returns the result.

**Why:** Paddy explicitly said "you should be automating all this" after being asked to double-click multiple .bat files. The whole point of asgard-tools is that it has `CF_API_TOKEN` and `GITHUB_TOKEN` bound and can do deploys itself.

**How to apply:**
- Code deploys to ANY CF Worker (asgard, asgard-tools, asgard-ai, bomber-boat-api, etc.) → asgard-tools `deploy_worker`
- Code pushes to LuckDragonAsgard GitHub repos (auto-deploys CF Pages / Vercel) → asgard-tools `http_request` to `https://gh-push.pgallivan.workers.dev`
- Reading any worker source → asgard-tools `get_worker_code`
- Reading bound secrets (CF_API_TOKEN, GITHUB_TOKEN, ANTHROPIC_API_KEY) → asgard-tools `get_secret`

**Bat-file fallback is OK only when:**
- Binding a NEW secret to asgard-tools itself (chicken/egg)
- Browser CORS blocks AND the agent loop also can't reach the resource
- An asgard-tools deploy itself is broken and needs a recovery deploy