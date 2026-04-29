---
name: No new handover file per session
description: Don't create dated handover files at session start. One canonical file at end only.
type: feedback
---
Do NOT create a new *-HANDOVER-*-EOD.md file at session start.

**Why:** "sack putting a new file at the start of every chat. its killing me."

**How to apply:**
- Session start: read latest EOD handover from GitHub, get on with it. Write nothing.
- Session end ("end session"/"wrap up"/"save state"): overwrite the single canonical file (no date prefix), post to Discord, done.
