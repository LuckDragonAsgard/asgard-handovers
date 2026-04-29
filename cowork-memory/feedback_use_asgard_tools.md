---
name: Use asgard-tools agent loop for deploys
description: Deploy via asgard-tools /chat/smart (deploy_worker, gh-push). Bats only for chicken/egg cases.
type: feedback
---
For deploys to any CF Worker / Pages site, use the asgard-tools agent loop:
POST https://asgard-tools.pgallivan.workers.dev/chat/smart with a message instructing it to call get_worker_code, modify, then deploy_worker.

**Why:** Paddy said "you should be automating all this" after being asked to double-click .bat files. asgard-tools has CF_API_TOKEN and GITHUB_TOKEN bound and can do deploys itself.

**How to apply:**
- Code deploys to any CF Worker → asgard-tools deploy_worker
- Code pushes to GitHub → asgard-tools http_request to gh-push.pgallivan.workers.dev
- Reading worker source → asgard-tools get_worker_code
- Reading secrets → asgard-tools get_secret

Bat-file fallback only when: binding a NEW secret to asgard-tools (chicken/egg), CORS blocks entirely, or asgard-tools deploy itself is broken.
