---
name: NEVER store or build anything locally
description: Hard rule from Paddy — no local builds, no `wrangler pages deploy ./dist`, no "clone the repo", no "do you have it locally". Everything goes through cloud-side tooling.
type: feedback
---
NEVER suggest, propose, or do any of the following:
- Local builds (`npm run build`, `vite build`, `wrangler pages deploy ./dist`, etc.)
- "Do you have the source repo locally?"
- Cloning a repo to a local machine
- Anything that produces or relies on files on Paddy's computer for a deploy
- `.bat` / `.ps1` scripts that build then push (the `deploy-spots-fix.*` / `bb-deploy-stage` footgun pattern)

**Why:** Paddy has stated this MANY times. Local builds drift from prod, leave artefacts on his machine, and break the "everything is in the cloud" model that Asgard is built around.

**How to apply:** All deploys must go through cloud-side paths:
- `asgard-tools` agent loop (`deploy_worker`, `gh-push`) at `/chat/smart` or `/admin/deploy`
- `gh-push` → GitHub → CF Pages auto-build (KBT-style pipeline)
- `wrangler pages deploy` invoked **server-side** by an Asgard worker, never from a local shell
- For chicken/egg cases ONLY: a `.bat` is acceptable, but everything it does should still hit cloud endpoints — no local builds.

When a deploy is broken, the question is NEVER "where's the source on your machine?" — it's "which Asgard project owns this, and what's the cloud deploy path?". Use `/admin/projects` on asgard-tools, the project-hub markdown, or ask Paddy which pipeline owns it. Roll forward via that pipeline, or roll back via CF Pages deployment history. Never local.