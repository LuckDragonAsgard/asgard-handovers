# asgard-handovers

Canonical handover store for the Asgard portfolio. Replaces the Drive copies in `🏰 ASGARD/02 Ops/Handovers & session logs/`.

One markdown file per project. Overwrite in place — git keeps the history. Filenames lowercase, no dates.

---

## ⚡ For Claude sessions: pickup protocol

If a user has pointed you here at the start of a new chat, follow this protocol — it's account-and-device-agnostic. Works on any Claude account, no per-account user-preferences required.

**1. Identify the project.** The user names it (e.g. "Sport Portal", "Bomber Boat"). Map it to the slug column in the file table below.

**2. Read the handover.** Fetch `https://raw.githubusercontent.com/PaddyGallivan/asgard-handovers/main/<slug>.md`. This is the source of truth — supersedes any Drive doc, prior chat memory, or older handover.

**3. Brief in one paragraph.** Status, progress %, next action, blockers. No long preamble. Then get to work — don't ask permission, don't ask which fix to start with.

**4. Tokens from asgard-vault.** Don't ask the user for tokens. Live secrets are at `https://asgard-vault.pgallivan.workers.dev/secret/<KEY>` (X-Pin auth — the user provides the pin once). Common keys: `CF_FULLOPS_TOKEN`, `GITHUB_TOKEN`. Never commit raw token values to this repo — GitHub secret-scanner will reject the push. Always reference vault key names.

**5. Active CF account.** `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main). The `pgallivan@outlook.com` Cloudflare account is **dormant** — do not use it.

**6. When the user says "wrap up":** summarise the session in 3–5 bullets, then PUT an updated `<slug>.md` to this repo via the GitHub API. Commit message = today's date + one-line summary. Redact secrets, reference vault key names instead.

**7. Sort out popups without asking.**

---

## File table

| File | Project | Status |
| --- | --- | --- |
| bomberboat.md | Bomber Boat | live |
| sportportal.md | SportPortal / SchoolSportPortal / SportCarnival / CarnivalTiming | live (3 regressions tracked in handover) |
| kbt.md | KBT Trivia Tools | live |
| superleague.md | Superleague Yeah | live (v4.28) |
| asgard.md | Asgard dashboard + tools | superseded — see asgard-source/docs/HANDOVER-EOD.md |
| wps.md | WPS Hub (school mgmt) | live |
| wcyms.md | WCYMS Footy Club Hub | archived 2026-04-27 |

---

## User invocation cheatsheet

The user only needs to remember **`asgard-handovers`** to pick up any project from a cold-start Claude session on any account. Examples that all work:

- `Sport Portal — github.com/PaddyGallivan/asgard-handovers`
- `Bomber Boat — see asgard-handovers`
- `pick up superleague from asgard-handovers`
- `asgard handover bomberboat`

Claude on any account, any device, reads this README, finds the right `<slug>.md`, briefs, and dives in.
