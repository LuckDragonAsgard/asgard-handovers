# Memory index

Cross-machine index — fetch this first at every session start. Sibling files in this folder are the actual rules/preferences. Project handovers are siblings to this folder.

## Hard rules (read first)

- [⛔ NOTHING on Drive — all GitHub or Cloudflare](feedback_no_drive_storage.md)
- [⛔ NEVER store/build locally](feedback_no_local_storage.md)
- [Use asgard-tools for deploys](feedback_use_asgard_tools.md)
- [Session ritual — no new file each session](feedback_session_ritual.md)

## Identity & creds

- [Luck Dragon identity & vault map](identity.md)

## Technical patterns / footguns

- [CF lame delegation = unactivated zone](cf_lame_delegation_pattern.md)
- [CF blocks worker→worker fetch in zone](cf_zone_fetch_block.md)
- [CF Pages — use wrangler not direct API](feedback_cfpages_manifest.md)
- [Edit tool null padding footgun](edit_tool_null_padding.md)
- [Crazy Domains upsell traps](feedback_cd_dark_patterns.md)

## Project handovers (one level up — `../`)

- [Bomber Boat](https://github.com/LuckDragonAsgard/bomber-boat/blob/main/docs/HANDOVER.md)
- [Sport Portal](../sportportal.md)
- [School Sport Portal / Sport Carnival / Carnival Timing](../carnivaltiming.md)
- [KBT Trial](../kbt.md)
- [Superleague v4](../superleague.md)
- [Asgard 7.0](https://github.com/LuckDragonAsgard/asgard-source/blob/main/docs/HANDOVER-EOD.md) (canonical) — `../asgard.md` is older
- [WPS Hub](https://github.com/LuckDragonAsgard/wps-hub/blob/main/docs/HANDOVER.md)
- [Clubhouse — NEW](https://github.com/LuckDragonAsgard/clubhouse/blob/main/docs/HANDOVER.md)
- [WCYMS — ARCHIVED](../wcyms.md)
- [Judy's Kitchen — idea](../judyskitchen.md)
- Plus Family Footy Tipping, Bulldogs Boat, Falkor, etc. — all under `LuckDragonAsgard/<name>` repos

## Project ideas / non-handover memories

- [Bomber Boat corporate ideas](bomberboat_corporate_ideas.md) — EFC partnership, corporate Fridays, Yarra Cruises, beer sponsorship

## D1 / data sources

- `asgard-brain.pgallivan.workers.dev/d1/query` — projects table (51+ rows). PIN: `2967` (already client-exposed, fine to reference). Query header: `X-Pin: 2967`.
- Vault: `asgard-vault.pgallivan.workers.dev/secret/<KEY>`. PIN NOT in this repo — see identity.md.