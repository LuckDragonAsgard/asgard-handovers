---
name: No new handover file per session
description: Don't create dated handover files at session start. One canonical file at end only.
type: feedback
---
Do NOT create a new *-HANDOVER-*-EOD.md file at session start.

**Why:** "sack putting a new file at the start of every chat. its killing me."

**How to apply:**
- Session start: fetch https://raw.githubusercontent.com/PaddyGallivan/asgard-handovers/main/cowork-memory/MEMORY.md (cross-machine canonical memory index). Then fetch the project-specific handover (asgard-handovers repo or per-project docs/HANDOVER.md). Write nothing.
- Session end ("end session"/"wrap up"/"save state"): overwrite the single canonical handover file for that project (no date prefix), post summary to Discord, update cowork-memory on GitHub. Done.
- One canonical file per project, not new dated ones.
