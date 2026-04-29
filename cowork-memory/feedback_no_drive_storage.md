---
name: NEVER store anything on Drive
description: Drive is purge-only. All persistent state in GitHub or Cloudflare. No exceptions.
type: feedback
---
Rule: NOTHING goes on Google Drive. Not handover drafts, not staging files, not session logs.

**Why:** Paddy corrected this explicitly 28 Apr 2026: "NOTHING SHOULD BE ON DRIVE! all github or cloudflare"

**How to apply:**
- Handover content → push to GitHub (asgard-handovers or project repo)
- One-off content → put in chat as code block, or use Chrome MCP to create GitHub file
- Data/state → Cloudflare D1, KV, or R2
- Never Write to G:\My Drive\ unless Paddy explicitly said to in the current conversation
- "Just for a minute" / "draft" are NOT exceptions
