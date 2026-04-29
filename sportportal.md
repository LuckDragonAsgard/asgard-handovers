# SportPortal — EOD Handover (Session 13, 2026-04-29)

## TL;DR
All 5 WPS sport URLs are now live and serving correct content. Root cause: old Worker Routes on both zones were intercepting all requests before CF Pages could handle them. Both deleted. All 5 URLs verified ✅.

## Session 13 — what got done

### ✅ Root cause found and fixed — Worker Routes blocking CF Pages
Both `schoolsportportal.com.au` and `sportcarnival.com.au` zones had Worker Routes that intercepted every request before it reached CF Pages:

| Zone | Route | Old Worker | Fix |
|---|---|---|---|
| schoolsportportal.com.au | `schoolsportportal.com.au/*` | `schoolsportportal` | Route deleted via CF API |
| sportcarnival.com.au | `sportcarnival.com.au/*` | `sportportal` | Route deleted via CF API |

The `pages.dev` URLs always worked because they bypass the zone proxy entirely.

### ✅ Cache purged
- `sportcarnival.com.au` zone cache purged (`purge_everything: true`) — zone ID `796f639e769fefac582a9e4b104dd98d`
- `schoolsportportal.com.au` cache already purged in Session 12

### ✅ sportcarnival-hub CF Pages deploy
Deployed correct content to `sportcarnival-hub` CF Pages project (deployment `158959ae`) with all WPS athletics/swimming files in prior session.

## All 5 URLs — verified working 2026-04-29

| URL | Title |
|---|---|
| schoolsportportal.com.au/williamstownps | Williamstown Primary School — School Sport Portal ✅ |
| schoolsportportal.com.au/williamstowndistrict | Williamstown District Sport ✅ |
| schoolsportportal.com.au/hobsonsbaydivision | Hobsons Bay Division — School Sport Portal ✅ |
| sportcarnival.com.au/williamstownps/athletics.html | WPS Athletics Carnival — SportCarnival ✅ |
| sportcarnival.com.au/williamstownps/swimming.html | WPS Swimming Carnival — SportCarnival ✅ |

## Architecture (current as of 2026-04-29)

| Domain | CF Pages project | Zone ID |
|---|---|---|
| schoolsportportal.com.au | `schoolsportportal` | `7cbd90f8acd552a3bafc3d221878f108` |
| sportcarnival.com.au | `sportcarnival-hub` | `796f639e769fefac582a9e4b104dd98d` |
| sportportal.com.au | `sportportal` | — |
| carnivaltiming.com | `carnival-timing` | — |

All zones in Luck Dragon (Main) account `a6f47c17811ee2f8b6caeb8f38768c20`.

**Deploy method:** CF Pages direct upload via wrangler (no GitHub integration — push to GitHub does NOT trigger deploy).

## CF Pages projects — current deployments

| Project | Canonical deployment | Source repo |
|---|---|---|
| schoolsportportal | `4cbb475a` | LuckDragonAsgard/schoolsportportal |
| sportcarnival-hub | `158959ae` | LuckDragonAsgard/sportcarnival-hub |

## Key facts
- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS
- Stripe: Google sign-in with pat_gallivan@hotmail.com
- Sport Portal Drive folder: `1SVbCqDwD7AztVXmijffRTPdCi_JoGQr6`
- Firebase project: `willy-district-sport` (australia-southeast1)

## BLAKE3 hash formula (for future CF Pages deploys)
`blake3(base64(fileContent) + fileExtension).hex.slice(0, 32)`
Wrangler used from `/tmp` with `npm_config_cache=/tmp/npm-cache HOME=/tmp/wrangler-home`.

## Outstanding
- None from this session. All 5 URLs verified working.
