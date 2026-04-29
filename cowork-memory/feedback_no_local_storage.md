---
name: NEVER store or build locally
description: No local builds, no wrangler ./dist, no repo clones on Paddy's machine.
type: feedback
---
NEVER suggest or do:
- Local builds (npm run build, vite build, wrangler pages deploy ./dist)
- "Do you have the source repo locally?"
- Cloning a repo to a local machine
- .bat/.ps1 scripts that build then push

**Why:** Stated many times. Local builds drift from prod, leave artefacts, break the cloud model.

**How to apply:** All deploys through:
- asgard-tools /chat/smart (deploy_worker, gh-push)
- gh-push → GitHub → CF Pages auto-build
- wrangler invoked server-side by an Asgard worker
- Bat files ONLY for chicken/egg cases (new secret binding etc)
