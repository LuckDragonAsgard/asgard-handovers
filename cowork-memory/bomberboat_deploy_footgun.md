---
name: Bomber Boat deploy footgun — never use deploy-spots-fix.*
description: deploy-spots-fix.js/.bat is NEUTRALISED. Never run it. Use bomberboat-rollback.bat or GitHub push.
type: feedback
---
G:\My Drive\deploy-spots-fix.bat and deploy-spots-fix.js are NEUTRALISED stubs as of 26 Apr 2026. Running them bricks the live site (partial manifest drops every other asset).

**Why:** It bricked the live site in BB 5.0 AND BB 6.0.

**How to apply:**
- NEVER run, recommend, or "fix" deploy-spots-fix.* — intentionally broken.
- To restore: G:\My Drive\bomberboat-rollback.bat (CF Pages rollback API, target deployment 674425bc).
- To deploy a NEW version: push to GitHub main — GH Actions handles deploy.
- After every deploy: fetch https://bomberboat.com.au/ and confirm HTTP 200.
