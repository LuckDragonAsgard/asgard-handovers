# Claude → Asgard Migration Plan — 2026-05-14

## Goal
Make Falkor (in your PWA) good enough that Claude is the last resort. To get there, four things have to come across from Claude into Asgard:

1. **Long-term memory** — facts, preferences, patterns ("Paddy is a teacher", "Essendon fan", "Jacky's allergic to X")
2. **Current state per project** — where each project is up to, what's next, what's blocked
3. **Concepts / detail docs** — the long-form thinking behind each project (vision, plans, decisions)
4. **History of decisions** — what was tried, what worked, what was abandoned

Plus housekeeping:
5. **Merge duplicate projects** in `project_hub` so the list is the real map

## Where each thing lives in Asgard already

| What | D1 table | Purpose today | Status |
|---|---|---|---|
| Long-term memory | `memory_v2` | Vector-searchable facts, project-scoped, versioned | Mostly empty (~30 facts) |
| Current state per project | `project_hub.next_action` + `notes` | One-liner per project | Filled for ~30 of 54 projects |
| Concept docs | `project_hub.concept_md` | Long-form vision | Empty for most projects |
| Detail docs | `project_hub.detail_md` | Long-form implementation notes | Filled for ~15 projects |
| Decision history | `project_events` | Append-only log of changes | Has 67 events from this session alone |

The plumbing exists. It's just unfilled because most context has lived in Claude chats, not Asgard.

## The four-step migration

### Step 1 — Merge duplicate projects in project_hub (clean the map first)

There are 54 project entries. Some are duplicates or fragments of the same product. Before importing anything else, consolidate so each real product is one row.

**Candidate mergers** (need your eye on these):

| Keep | Merge in | Reason |
|---|---|---|
| `Asgard Final Build` | `Asgard Platform` + `Asgard Service Fleet` | All three are about the same: finish/run the Asgard platform |
| `Falkor Chat (PWA)` | `Falkor (Legacy)` | Legacy was earlier version; the PWA is the live one |
| `asgard-ai (LLM/Tool Router)` | nothing | keep as-is (clear product) |
| `Save My Seat` | nothing | keep |
| `KBT Question Development` + `KBT Web Apps` | one of them, name "KBT" | Both are aspects of KBT |
| `SportCarnival` + `SSV Sport Takeover` + `WPS Athletics Carnival 2026` | one umbrella "SportCarnival" | All three are sport carnival product variations |
| `School Sport Portal` | nothing | keep |
| `Thor`, `Lady Thor`, `Thunder-*` (5 entries) | one umbrella "Thunder" | These are 7 broken entries; either consolidate or delete |

I can list every project and propose merges per cluster. You approve, I execute the merge (copy notes from source into target's `detail_md`, mark source `status='merged_into'` rather than delete so history is preserved).

### Step 2 — Build the "Import from Claude" pipeline

One-time tool. You paste a Claude chat (or upload a chat export), Falkor reads it and extracts the structured stuff into Asgard automatically.

**Endpoint:** `POST /admin/migrate-chat` on asgard-ai. Input: `{ transcript: "...", default_project?: "..." }`. Output: summary of what was extracted.

**What it extracts using Haiku:**

| Extracted thing | Where it goes | Example |
|---|---|---|
| Facts about you/family/preferences | `memory_v2` with `category="preferences"` and `project="global"` | "Paddy prefers Haiku for speed" |
| Project decisions | `project_events` rows | "Decided to drop Bomber Boat in favour of Bulldogs Boat" |
| Project state updates | `project_hub.next_action` / `notes` | "Currently blocked on Vercel domain auth for X" |
| Concept docs | `project_hub.concept_md` (append if exists) | The vision/plan you discussed |
| Detail docs | `project_hub.detail_md` | Implementation notes, schema sketches |
| Code/tool usage patterns | `falkor_facts` | "When deploying, always commit GH first" |

**UI:** new "📥 Import from Claude" button in Settings → opens a textarea. You paste, hit Import, Falkor returns a count of extracted items + a preview. Repeat for each old chat.

I can build this in ~20 minutes. Then migrating a year of Claude chats is just paste-import-paste-import.

### Step 3 — Improve Falkor's recall (so the migrated context actually gets used)

Adding the memory to `memory_v2` is only useful if Falkor pulls it back into the conversation at the right time.

**What I'll add to asgard-ai's agentic loop:**

- On every chat message, do a fast `memory_v2` vector search for relevant facts and prepend them to the system prompt
- On every project chat, include the project's `concept_md` + `detail_md` + last 5 `project_events` in the system prompt (already partially there — strengthen it)
- Add a `recall(query)` agentic tool so Falkor can explicitly search memory mid-conversation when it needs to

Net effect: ask Falkor "what was our plan for SportPortal?" and it retrieves the concept doc + recent decisions automatically, instead of starting blind.

### Step 4 — Identify Claude-only gaps and close them

Once context is migrated, the remaining reason to open Claude is when Falkor genuinely can't do something. List of likely gaps:
- Long-form writing (essays, documents) — Falkor can do it but doesn't have a "long mode"; add an "essay length" model picker option
- Complex multi-step reasoning Claude does well but Haiku doesn't — fix by exposing Sonnet / Opus more visibly in the picker (already in dropdown)
- Browser browsing (Claude in Chrome) — Falkor has tool calls for HTTP + Drive but no general browse; Claude in Chrome stays useful for "look at this site and tell me"
- File upload of PDFs/Docs for reading — Falkor has `drive_read` but not paste-in-PDF; add a `/pdf/extract` endpoint that takes a file upload, OCRs/extracts, returns text

These get fixed individually after migration is the new baseline.

## Recommended execution order

1. **Today (next 30 min if you want)** — Merge the obvious project_hub duplicates (Asgard cluster, KBT cluster, SportCarnival cluster, Thunder cluster). I propose, you approve per cluster, I execute. **Net: 54 projects → ~40 clean ones.**
2. **Today (~20 min)** — Build the `/admin/migrate-chat` endpoint + the PWA "Import from Claude" button. **Net: you can start pasting Claude chats whenever.**
3. **Whenever you've got time** — Paste a Claude chat. Falkor extracts and stores. Repeat. Each one takes a minute.
4. **Today (~15 min)** — Strengthen recall (add memory-search to every chat's system prompt + add `recall` tool). **Net: Falkor uses migrated context automatically.**
5. **Ongoing** — As you find Claude-only gaps, tell Falkor "I shouldn't have to open Claude for X, fix it" and it builds the missing piece.

## What I won't do without you saying so

- Delete any project row (would lose history)
- Merge any cluster you haven't approved
- Auto-import any chat that exists in Claude (privacy / you decide what to import)
- Rebuild Falkor's UI without showing you mocks first

## Decision request

Which do you want to start with right now?
- **A:** Project merges first (I propose specific clusters, you approve, I execute)
- **B:** Build the import-from-Claude pipeline first (so you can start collecting Claude context into Asgard while we sort the merges)
- **C:** Both in parallel — I do A while you start using B as soon as it's deployed
- **D:** Something else — tell me what
