# Asgard — EOD Handover
**Session date:** 2026-04-29
**Version live:** 8.2.0
**Worker URL:** https://asgard.pgallivan.workers.dev
**GitHub source:** github.com/PaddyGallivan/asgard-source/blob/main/workers/asgard.js

---

## What was done this session

### D1 schema migration (asgard-brain)
Nine new columns added to `products` table via asgard-brain `/run` agent:
- `cash_spent REAL DEFAULT 0`
- `cash_earned REAL DEFAULT 0`
- `hours_needed INTEGER DEFAULT 0`
- `recommendations TEXT DEFAULT ''`
- `revenue_y6` through `revenue_y10 REAL DEFAULT 0`
Total: 39 columns now in products table.

### asgard.js v8.2.0 deployed
All changes live at https://asgard.pgallivan.workers.dev

**No-hard-refresh PIN:**
- `savePin()` now calls `updateUserPill()` immediately — no page reload needed
- `updateUserPill()` extracted as standalone function
- User pill updates live when PIN entered in settings

**Rich project detail cards:**
- 6-tile summary grid: Status, Priority, Cash Spent (red), Cash Earned (green), Hours Needed, 10-yr Total
- Description, Next-to-do (highlighted), Recommendations, Tech stack, Key features
- Full 10-year revenue forecast table with mini bar charts (Y1–Y10)
- Live links section at bottom (site + repo)

**Data layer:**
- `loadProductsFromBrain()` now queries asgard-brain directly from the browser client (bypasses CF worker→worker zone block that caused 1042 errors)
- SQL SELECT expanded to include all new columns
- Local PROJECTS map includes: revenue_y6-y10, cash_spent, cash_earned, hours_needed, recommendations

### asgard-tools bug fix
Fixed `validPins is not defined` ReferenceError in `/admin/deploy` handler — this was causing all deploys to crash with CF error 1101. Fixed via `/admin/patch`. Deployed.

---

## Deploy pipeline state

| Step | Status |
|------|--------|
| GitHub source | ✅ `workers/asgard.js` at commit `2fa91874a3ef` |
| CF Workers | ✅ `asgard` worker v8.2.0 live |
| D1 schema | ✅ asgard-brain products table has all 39 columns |
| asgard-tools | ✅ validPins bug fixed, `/admin/deploy` working |

**Deploy path (for next session):**
```
python3 (build payload.json with code_b64)
→ POST asgard-tools.pgallivan.workers.dev/admin/deploy  
   X-Pin: <PADDY_PIN from localStorage>
   body: {worker_name, code_b64, main_module: "asgard.js"}
```

**PIN for deploy auth:** Read from browser localStorage at `asgard.pgallivan.workers.dev` key `asgard.pin.v1`
**GitHub token:** `asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN` (X-Pin header)

---

## Known issues / next priorities

1. **Product data is empty** — all 51 projects have Y6-Y10 = 0, cash_spent = 0 etc. Need to populate via the Edit flow or a batch update. The edit modal currently only prompts for Y1-Y5. Consider expanding `editProjectFlow()` to include the new fields.

2. **asgard-tools /admin/deploy workflow** — GitHub Actions still has the arg-list-too-long bug (uses `-d` shell arg for large payloads) and the workflow file can't be updated without `workflow` scope on the GH token. Not blocking since direct deploy via curl works.

3. **CF API tokens in vault are invalid** — `CF_API_TOKEN` and `SLY_CF_TOKEN_2026_04_25` both return 401 from the CF REST API. The deploy path uses asgard-tools as the intermediary (which has its own CF_API_TOKEN binding), so this doesn't block anything currently.

4. **Edit flow needs new fields** — `editProjectFlow()` prompts for Y1-Y5 only. Should add prompts (or better, an inline form) for: cash_spent, cash_earned, hours_needed, recommendations, revenue_y6-y10.

---

## Architecture notes

- **Worker→worker calls:** CF blocks `*.pgallivan.workers.dev` → `*.pgallivan.workers.dev` fetches (returns 1042). All cross-worker reads must be client-side or use CF service bindings.
- **D1 writes from client:** Use asgard-brain `/d1/write` with `X-Pin` header (PADDY_PIN or JACKY_PIN).
- **Multi-user:** getPinUser() maps PIN prefix → user. Prefixes: `6d06`=paddy, `844c`=jacky, `3df4`=george. All bridge/sync calls use dynamic UID.
- **asgard-brain DB:** `b6275cb4-9c0f-4649-ae6a-f1c2e70e940f` (asgard-brain D1, `asgard-brain.pgallivan.workers.dev`)

---

## Files in GitHub
- `workers/asgard.js` — main dashboard worker (v8.2.0, 2463 lines, ~141KB)
- `workers/asgard-tools.js` — deploy/patch/admin tools worker (v1.5.3 + validPins fix)
- `workers/asgard-ai.js` — AI chat worker
- `.github/workflows/deploy.yml` — push-triggered deploy (has arg-list bug for large workers)
