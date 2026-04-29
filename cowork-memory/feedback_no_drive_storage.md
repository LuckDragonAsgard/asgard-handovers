---
name: NEVER store anything on Drive
description: Drive is purge-only. All persistent state lives in GitHub or Cloudflare. Hard rule, no exceptions including drafts/staging.
type: feedback
---
Rule: **NOTHING goes on Google Drive.** Not handover drafts, not staging files, not session logs, not "temporary" markdown. All persistent state lives in GitHub repos or Cloudflare (D1 / KV / Workers).

**Why:** Paddy is mid-migration purging Drive of all working state. Memory shows the same pattern across projects: WPS Hub Drive folder deleted 27 Apr (`wps_staff_hub.md` says "Drive=0"), Asgard Drive purged ("asgard.pgallivan.workers.dev v7.9.2 (Drive purged)"), Bomber Boat docs migrated to GitHub repo, asgard-handovers repo replaces the Drive ASGARD folder. Putting new files on Drive — even as drafts — re-pollutes a folder Paddy is actively trying to empty. Triggered direct correction 28 Apr 2026 ("NOTHING SHOULD BE ON DRIVE! all github or cloudflare").

**How to apply:**
- For handover content → push directly to a GitHub repo (asgard-handovers, or the project's own repo).
- For one-off content I need to share with Paddy → put it in chat as a code block for him to paste, or use the Chrome MCP to drive a GitHub create-file page directly.
- For data/state → Cloudflare D1, KV, or R2 via asgard-tools / workers.
- Never use `Write` to put anything under `G:/My Drive/` unless Paddy has explicitly told me to in the current conversation.
- "Just for a minute" / "as staging" / "draft" are NOT exceptions. The file will get forgotten and pollute the folder.