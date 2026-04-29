---
name: asgard-handovers GitHub repo
description: Canonical handover store — one md per project, overwrite in place, git holds history
type: reference
---
Location: github.com/PaddyGallivan/asgard-handovers (created 2026-04-27)

One markdown per project, lowercase filenames, no dates. Overwrite → git keeps history.

When to use vs per-project repo:
- Project has own repo with docs/HANDOVER.md → use that.
- Project is archived/meta/no own repo → use this repo.

Write from Claude: GitHub Contents API PUT /repos/PaddyGallivan/asgard-handovers/contents/<path>
Get SHA first if updating. GITHUB_TOKEN from vault.
