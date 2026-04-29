---
name: Bomber Boat deploy footgun — NEVER use deploy-spots-fix.*
description: deploy-spots-fix.js/.bat is neutralised stub. It bricks the site.
type: feedback
---
G:\My Drive\deploy-spots-fix.bat and .js are NEUTRALISED stubs. Running them bricks the live site (partial manifest drops all other assets).

NEVER run them. To deploy: push to GitHub main → GH Actions handles it.
Break-glass rollback: G:\My Drive\bomberboat-rollback.bat (CF Pages rollback API, deployment 674425bc).
