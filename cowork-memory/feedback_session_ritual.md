---
name: No new handover file per session
description: Don't create a new dated handover file at the start of every chat — overwrite the canonical one at end only.
type: feedback
---
Do NOT create a new `*-HANDOVER-*-EOD.md` file at the start of a new session just to record context. It creates noise.

**Why:** Paddy said it explicitly — "sack putting a new file at the start of every chat. its killing me."

**How to apply:**
- At session start: fetch `https://raw.githubusercontent.com/LuckDragonAsgard/asgard-handovers/main/cowork-memory/MEMORY.md` — the canonical cross-machine memory index. Then fetch any project-specific handover for the project Paddy names (asgard-handovers repo or per-project `docs/HANDOVER.md`). Don't write anything at start.
- At session END ("end session"/"wrap up"/"save state"): overwrite the single canonical handover for that project (no date prefix), update `cowork-memory/` if rules changed.
- One file per project, not a new dated one each time.