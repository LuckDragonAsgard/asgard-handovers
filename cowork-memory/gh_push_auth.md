---
name: gh-push relay — now auth-gated (2026-04-28)
description: Bearer token required. Prefer direct GitHub API via asgard-tools.
type: project
---
gh-push.pgallivan.workers.dev requires: Authorization: Bearer <GH_PUSH_BEARER>

Bearer is CF Worker secret GH_PUSH_BEARER on the gh-push worker. Cannot be read via API — check CF dashboard.

**Prefer:** direct GitHub Contents API via asgard-tools (uses env.GITHUB_TOKEN, bypasses gh-push).

**Format:**
```
POST https://gh-push.pgallivan.workers.dev/
Authorization: Bearer <GH_PUSH_BEARER>
Content-Type: application/json
{"owner":"...", "repo":"...", "path":"...", "message":"...", "content":"<base64>", "branch":"main"}
```
Note: content must be base64. Relay does NOT encode for you.
