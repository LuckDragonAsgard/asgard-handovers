# Asgard — Current State (2026-05-14)

## Status: Active build | Progress: ~60%

**Fleet audit (2026-05-14):** see [asgard-fleet-audit-2026-05-14.md](./asgard-fleet-audit-2026-05-14.md) — 154 workers audited, 15 stale candidates flagged, watchdog hardened to revert only on catastrophic conditions.

## Live versions
| Worker | Version | URL |
|---|---|---|
| falkor-ui (PWA) | v9.43.0 | falkor.luckdragon.io + asgard.luckdragon.io |
| asgard-ai | v6.7.0 (256 kB, 45+ routes) | asgard-ai.luckdragon.io |
| falkor-agent | v2.12.0 | falkor-agent.luckdragon.io |
| falkor-workflows | v3.14.0 (hardened watchdog) | falkor-workflows.luckdragon.io |
| falkor-brain | v1.0.0 | falkor-brain.luckdragon.io |
| falkor-push | v1.1.2 | falkor-push.luckdragon.io |
| falkor-calendar | v1.2.0 | falkor-calendar.luckdragon.io |
| falkor-code | v1.5.0 | falkor-code.luckdragon.io |
| asgard-vault | v1.4.1 | asgard-vault.pgallivan.workers.dev |

## Infrastructure
- CF account: a6f47c17811ee2f8b6caeb8f38768c20
- 154 workers, 28 D1 databases
- Cost: ~$5/mo
- Vault PIN: 535554 | Paddy PIN: 2967

## What's working end-to-end (verified in browser + API this session)
**PWA chat works.** Open `asgard.luckdragon.io`, click Chat, type a message, Falkor responds. Default model is Haiku. Tools fire — chat-to-deploy verified by writing real files to GitHub + deploying real workers from natural-language requests in the chat.

**Verified tools (via WS chat path):** `github_write_file`, `github_get_file`, `get_worker_code`, `deploy_worker`, `drive_search`, `drive_create_file` (Docs/Sheets/Slides), `sheets_write_values`, `slides_batch_update`, `docs_replace_text`, `docs_append_text`, `save_memory`, `send_email`, `http_request`, `get_secret`, image generation via `/image/generate-and-store`. The agentic loop is on by default for every PWA message.

**Project-aware chat (new in v9.43).** Click 💬 Chat on any project card in the Projects panel. The PWA fetches `/admin/project-context?name=<project>` from asgard-ai, which returns the project record + recent project_events + live /health + recent GitHub commits + an edit playbook for that specific project. That bundle becomes the chat's system_prefix. Falkor knows the GitHub repo, the CF worker name, the deploy procedure, and the recent context for the project being discussed.

## asgard-ai canonical
- Vault `ASGARD_AI_CANONICAL_DEPLOY_ID` matches live deploy
- Vault `ASGARD_AI_CANONICAL_SIZE` matches live byte count
- GitHub `asgard-source/workers/asgard-ai.js` matches live
- falkor-workflows watchdog returns healthy on every check (no more revert loop)

## Self-healers map
- **falkor-workflows asgard-ai watchdog** (cron `* * * * *`, 14-min throttle): reverts asgard-ai if its version_id drifts from vault canonical. Source of truth: GH `asgard-source/workers/asgard-ai.js`.
- **falkor-code self-heal** (cron `*/15 * * * *`): redeploys workers from GH only when their /health probe fails. asgard-ai is `autoHeal:false`. falkor-ui is `autoHeal:true` — its /health is currently green so no redeploys.
- **auto-handover** (cron `30 21 * * *`): nightly summary to D1 + GitHub.

## How to change a worker without it getting reverted
**asgard-ai:** commit to `asgard-source/workers/asgard-ai.js` FIRST → deploy via `/content` → PUT new version_id to vault `ASGARD_AI_CANONICAL_DEPLOY_ID` + size to `ASGARD_AI_CANONICAL_SIZE`. Skip step 3 and the watchdog redeploys from GH at the next tick.

**Any other worker:** commit to `asgard-source/workers/<name>.js` FIRST → deploy via `/content` (preserves bindings). If the worker is in falkor-code's monitor list with `autoHeal:true`, the GH state is what gets restored on health failure.

**Gotcha I hit this session:** if you iteratively patch by downloading-from-CF + patching + pushing-to-GH, multiple patches in sequence can overwrite each other when the CF download is stale. Always either consolidate patches in one push, OR base patches on the latest GH HEAD, not CF.

## Outstanding (carried over)
1. **R2 token** — needs CF API token with R2 Edit scope. User has to create in CF dashboard, paste to vault as `CF_R2_TOKEN`.
2. **Gmail send via chat** — needs OAuth re-consent with `gmail.send` scope added (separate from the Drive broader consent already done).
3. **longrangetipping.com.au** — DNS activate.
4. **schoolstaffhub.com.au** — VentraIP registration with ID verification.
5. **drive_read for native Google docs** — currently returns 403 ("only binary content"); needs to use Docs export API for native types.
6. **Watchdog smarter logic** — only revert on catastrophic conditions (size drop >50% or known-bad marker). Removes false-positive class. Future session.
7. **Per-project conversations in schema** — D1 conversations table is still flat. Today projects are tracked via `system_prefix` on the conversation object in localStorage; if you want true server-side per-project threading + cross-device sync, add `project_id` column + filter the sidebar by project.
8. **Project chat first message** — currently sends "Tell me about <project>. Current state and next actions?" verbatim. Could be smarter (e.g. start with "Hi, what would you like to do with <project>?").

## How to use the PWA
1. Open https://asgard.luckdragon.io
2. Settings → see three Versions: PWA / Falkor chat / AI backend
3. Type any task in plain English. For tool-using tasks (deploy, write file, send email, create Doc), Falkor will fire the right tools and report what it did.
4. Projects view → click 💬 Chat on any project card → Falkor has full context for that project.
5. Long replies show typing animation? No — replies arrive complete (truncation bug was killed in v9.39).
6. Bubbles overflow the column? No — bubbles respect their column (v9.43 fix).
7. View resets to Home on reload? No — view persists to localStorage (v9.43).

## Tested artifacts this session
- [Test deploy file in asgard-handovers](https://github.com/Luck-Dragon-Pty-Ltd/asgard-handovers/blob/main/test-pwa-deploy-1778685259.md) — written by Falkor from a chat message
- [/pwa-test route on asgard-tools](https://asgard-tools.pgallivan.workers.dev/pwa-test) — deployed by Falkor from a chat message
- [Google Doc Falkor created](https://docs.google.com/document/d/1tmpccF-FylaxrQVdfHwdrafx7JF0kFxd2Kll4EQxH8M/edit)
- [Google Slides Falkor created + retitled](https://docs.google.com/presentation/d/13h0oACXcl1SYulOAdbcwDkgaHFCw_pW0DzGbuGo_Miw/edit)
- [Google Sheet Falkor populated (10 cells)](https://docs.google.com/spreadsheets/d/1HOQAdfOiMwPApYgcURURkrrSdQt6je2auq7oNi972sw/edit)
- Email sent via Resend (id `9898fe18-cfb5-4bca-be64-36ceceb9bde9`) — should be in pgallivan@outlook.com

When ready, those test artifacts can be deleted — they're proof, not production.
