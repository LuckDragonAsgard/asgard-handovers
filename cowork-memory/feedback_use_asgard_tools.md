---
name: Use asgard-tools agent loop for deploys
description: Deploy via POST asgard-tools.pgallivan.workers.dev/chat/smart. Bats only for chicken/egg.
type: feedback
---
Use asgard-tools agent loop for all CF Worker/Pages deploys:
POST https://asgard-tools.pgallivan.workers.dev/chat/smart

**Why:** Paddy said "you should be automating all this" after being asked to double-click bat files.

**How to apply:**
- CF Worker deploys → asgard-tools deploy_worker
- GitHub pushes → asgard-tools http_request to gh-push.pgallivan.workers.dev
- Reading worker source → asgard-tools get_worker_code
- Reading secrets → asgard-tools get_secret

Bat fallback ONLY for: new secret binding to asgard-tools (chicken/egg), CORS block, asgard-tools itself broken.
