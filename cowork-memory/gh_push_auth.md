---
name: gh-push relay — now auth-gated (2026-04-28)
description: gh-push worker requires Bearer token; where bearer lives, preferred alternative
type: project
---
gh-push.pgallivan.workers.dev now requires Authorization: Bearer <GH_PUSH_BEARER> on every POST.

**Bearer location:** CF Worker secret GH_PUSH_BEARER on the gh-push worker (Luck Dragon Main a6f47c17). Cannot be read back via CF API — access via CF dashboard → Workers → gh-push → Settings → Variables & Secrets.

**Call format:**
```
POST https://gh-push.pgallivan.workers.dev/
Authorization: Bearer <GH_PUSH_BEARER>
Content-Type: application/json
{"owner":"...", "repo":"...", "path":"...", "message":"...", "content":"<base64>", "branch":"main"}
```

Note: content is base64. Relay does NOT do the encoding.

**Why:** Was unauthenticated — anyone with the URL could push to any repo GITHUB_TOKEN has access to.

**How to apply:** Prefer direct GitHub Contents API via asgard-tools (uses env.GITHUB_TOKEN, bypasses gh-push). Only use gh-push if asgard-tools is unavailable.
