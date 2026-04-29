---
name: NEVER store anything on Drive
description: Drive is purge-only. All persistent state lives in GitHub or Cloudflare. Hard rule, no exceptions including drafts/staging.
type: feedback
---
Rule: **NOTHING goes on Google Drive.** Not handover drafts, not staging files, not session logs, not "temporary" markdown. All persistent state lives in GitHub repos or Cloudflare (D1 / KV / Workers).

**Why:** Paddy is mid-migration purging Drive of all working state. Triggered direct correction 28 Apr 2026 ("NOTHING SHOULD BE ON DRIVE! all github or cloudflare").

**How to apply:**
- For handover content → push directly to a GitHub repo (asgard-handovers, or the project's own repo).
- For one-off content → put it in chat as a code block for him to paste, or use Chrome MCP to drive a GitHub create-file page.
- For data/state → Cloudflare D1, KV, or R2 via asgard-tools / workers.
- Never use Write to put anything under G:\My Drive\ unless Paddy has explicitly told you to in the current conversation.
- "Just for a minute" / "as staging" / "draft" are NOT exceptions.
