# Asgard EOD Handover — 2026-04-29 (v8.3.2)

## Live Workers
| Worker | Version | URL |
|--------|---------|-----|
| asgard (main dashboard) | **8.3.2** | https://asgard.pgallivan.workers.dev |
| asgard-ai | multi-provider router | https://asgard-ai.pgallivan.workers.dev |
| asgard-tools | 1.5.3-george-added | https://asgard-tools.pgallivan.workers.dev |
| asgard-brain | 1.3 | https://asgard-brain.pgallivan.workers.dev |
| asgard-vault | 1.2.0-pin-rotation | https://asgard-vault.pgallivan.workers.dev |

## Source
`github.com/PaddyGallivan/asgard-source/blob/main/workers/asgard.js`
Commit: `0380fac6d0554a13b926d278a365d77f8ad2a8d8`

## Deploy Path
```
POST https://asgard-tools.pgallivan.workers.dev/admin/deploy
Headers: Content-Type: application/json
         X-Pin: <PIN>
         User-Agent: Mozilla/5.0...  (REQUIRED — CF 1010 bot block without it)
         Origin: https://asgard.pgallivan.workers.dev
Body: {worker_name, code_b64, main_module:"asgard.js"}
```
PIN from: `asgard.pgallivan.workers.dev` localStorage key `asgard.pin.v1`
Vault: `asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN` (X-Pin header)

## D1 Products Table (asgard-brain, b6275cb4-9c0f-4649-ae6a-f1c2e70e940f)
51 rows. 39+ columns: cash_spent, cash_earned, hours_needed, recommendations, revenue_y1-y10.
Client-side fetch only (CF worker-to-worker same-zone = 1042 block).

## Multi-User PIN Prefixes
`6d06`=paddy, `844c`=jacky, `3df4`=george

## Session Work (v8.3.1 to v8.3.2)

### Root Cause Fixed
The inline client-side JS lives inside a backtick template literal in the CF Worker.
Template literal escape processing corrupts ALL backslash sequences in the served HTML:
- `\n` becomes a literal newline (breaks string/regex literals)
- `\x00` becomes a null byte (CF deploy rejects)
- `\*` becomes just `*` (backslash dropped — unrecognised escape in sloppy V8)
- `\[`, `\]`, `\(`, `\)` become just the bracket (backslash dropped)
This had silently broken Asgard since v8.2.0.

### Fixes Applied
1. `/^\n/` SyntaxError (line 649) — replaced with `c.charCodeAt(0)===10` check
2. `'\x00'` null byte — replaced `'~~CODE'` / `'~~'` placeholder strings
3. `var nl = '\n'` — replaced with `var NL = String.fromCharCode(10)`
4. Link regex backslashes dropped — doubled all `\[`, `\]`, `\(`, `\)` in patterns
5. Bold/italic `/*` block-comment bug — `\*` became `*`, starting a JS block comment. Rewrote `inline()` using `new RegExp()` with runtime char construction
6. `new RegExp('***...')` nothing to repeat — fixed with `var _es = _bs + _star` (escaped star `\*`)
7. `const conv` TDZ error — moved declaration above private-toggle section where it's used
8. User pill not showing on load — added `updateUserPill()` call inside `render()`

### Verified Green
- Zero JS errors on page load
- `projectsCount: "51"` (all D1 products loading via client-side fetch)
- `userPill: "Paddy"`, `display: "flex"`
- 51 project cards render in Projects view

## Known Issues / Next
1. **Edit flow missing new fields** — `editProjectFlow()` only prompts Y1-Y5. Needs cash_spent, cash_earned, hours_needed, recommendations, Y6-Y10 (was IN PROGRESS)
2. **CF API tokens in vault invalid** — CF_API_TOKEN + SLY token both 401. Deploy via asgard-tools still works (own binding)
3. **GH Actions `-d` arg-list bug** — fails for large b64 payloads. Direct curl deploy works
4. **Worker-to-worker CF zone block** — same-zone fetches = 1042. Use client-side or bindings
5. **CF bot-block on plain curl** — need `User-Agent + Origin` headers to avoid 1010 (already in deploy path above)

## Template Literal Escape Rules (critical for future edits)
Any backslash sequence inside the HTML template literal is processed by JS template eval before serving.
- Newlines in strings: `String.fromCharCode(10)` not `'\n'`
- Regex with special chars in template: double all backslashes (`\\*` serves as `\*`)
- `new RegExp()` patterns inside template: use `String.fromCharCode(N)` vars (`_bs`, `_star`, `_slash`)
- Never `'\x00'`: use a placeholder like `'~~'`
- Never regex literals with `\*`: always `new RegExp()` with `_es = _bs + _star`
