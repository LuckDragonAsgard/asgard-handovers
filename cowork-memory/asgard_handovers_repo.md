---
name: asgard-handovers GitHub repo
description: Canonical handover store — one md per project, overwrite in place, git holds history
type: reference
---
**Location:** github.com/PaddyGallivan/asgard-handovers (created 2026-04-27)

**Pattern:** one markdown file per project, lowercase filenames, no dates. Overwrite in place — git keeps history.

**When to use vs per-project repo:**
- Project has its own active code repo with docs/HANDOVER.md → put handover in project repo.
- Project is archived or meta → put it here (e.g. wcyms.md).

**Save state ritual:** when Paddy says "end session"/"wrap up"/"save state", commit to whichever location is canonical for that project. Don't write a fresh dated file — overwrite the existing one.

**How to write from Claude:** GitHub Contents API (PUT /repos/PaddyGallivan/asgard-handovers/contents/<path>) — get the existing sha first if updating. Use GITHUB_TOKEN from vault.
