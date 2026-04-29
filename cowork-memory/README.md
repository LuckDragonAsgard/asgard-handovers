# cowork-memory

Cross-machine, cross-account portable Claude memory for the Asgard portfolio.

## Why this folder exists

Claude Cowork's auto-memory lives at `C:/Users/<user>/AppData/Roaming/Claude/local-agent-mode-sessions/<id>/spaces/<id>/memory/`. That's local-only — a different account or different machine starts blank.

This folder mirrors the persistent rules and project state to GitHub so any future Claude session, on any account, on any computer, can rehydrate by fetching from here.

## Pickup pattern (any new session)

At session start, fetch:

1. `cowork-memory/MEMORY.md` — the index of memories
2. The specific project handover for whatever Paddy mentions (sibling files in this repo, or `docs/HANDOVER.md` in the project's own repo)

Then act per the rules in `feedback_*.md`.

## What's NOT in here

- Live token values (vault PIN, GH tokens, CF tokens) — those stay in `asgard-vault.pgallivan.workers.dev` and are fetched at runtime
- Per-conversation ephemera — only the patterns and rules that should outlive a session

## Update ritual

This folder is updated at "save state" / "end session" / "wrap up". Overwrite in place, no dated copies, let git track history.