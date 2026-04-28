# SportPortal — HANDOVER (2026-04-29, Session 10)

---

## TL;DR for the next session

- All four domains are **Cloudflare Pages projects with direct upload** — NOT workers.
- **carnivaltiming.com is LIVE and GREEN** — mojibake fixed, demo feature deployed (Session 6.1).
- **Two regressions still outstanding**: A (sportcarnival.com.au placeholder) and B (schoolsportportal demo pages missing).
- **Session 9–10 work: email catalog (33 types) + external stakeholder chain documented** — comparison HTML fully updated, Word doc built with itemised hours.
- **Key deliverable this session:** `ssv-admin-burden-analysis.docx` — the "no one can argue" hours doc. Full evidence, ~$7.9M/year statewide figure.

---

## Sessions 9–10 (2026-04-28/29) — what got built

### 1. Email catalog expansion (Session 9)
- Stats bar updated: **33** distinct email types catalogued (was 8)
- Division count corrected: **55** (from 2026-27 PDs), was 40
- Statewide cost corrected: **$337K/yr** per division tier, ~**$5.6M** total (HTML)
- Full 9-category email catalog section added to HTML with all 33 types:
  - Cat 1: Entry Collection Chain (3) · Cat 2: Data Errors (6) · Cat 3: Missing Entries & Draw Errors (3)
  - Cat 4: The 4→2 Event Cliff (3) · Cat 5: Results Distribution & Disputes (4) · Cat 6: Meet Manager Pain (3)
  - Cat 7: Logistics & Coordination (5) · Cat 8: Rule Inconsistency Queries (3) · Cat 9: Admin & Payment (3)

### 2. External stakeholder chain (Session 10)
New section added to `sportportal-comparison.html` — **"The Bigger Play"**:
- 6 external stakeholder cards: Councils, Aquatic Centres, First Aid, Officials/Umpires, Parent Volunteers, Transport
- Real email evidence in each card:
  - Council booking #BP8995 (Wyndham, Marc Camilleri, Dec 2025)
  - Council booking #14811 (Maribyrnong, Terry Antoniadis → Paddy, Mar 2026)
  - WynActive pool hire (James, aquaticbookings@wynactive.com.au, Nov 2025) — Hire Agreement + 2× Application Forms + CoC
  - Sports Aid officials/first aid (James Theodorakopoulos, Oct 2025, High Importance, 15MB PDF)
  - Parent volunteer coordination ("asking parents to take a day off to time a lane")
- Totals callout: **+8–12 hrs per carnival** from external coordination alone
- SportPortal fix per category described

### 3. ssv-admin-burden-analysis.docx
**File:** `G:\My Drive\ssv-admin-burden-analysis.docx`  
Full Word document: "The Hidden Cost of School Sport Administration" — designed for pitching to SSV, principals, councils, investors.
- **CRT rate:** $425.80/day, $70.97/hr (DET Victoria, July 2025)
- **Part 1 — Internal Admin Chain:**
  - PE Teacher: 12 hrs/carnival × 3 carnivals = 36 hrs/yr = $2,555/yr
  - District Coordinator: 28 hrs/carnival = 84 hrs/yr = $5,964/yr
  - Division Coordinator: 36 hrs/carnival = 108 hrs/yr = $7,663/yr
  - Region Coordinator: 48 hrs/carnival = 144 hrs/yr = $10,219/yr
- **Part 2 — External Stakeholder Chain:** +4–8 hrs per carnival per coordinator role
- **Part 3 — Combined Totals:**
  - PE Teacher: 16 hrs/carnival, 48/yr, $3,407/yr
  - District: 36 hrs, 108/yr, $7,651/yr
  - Division: 42 hrs, 126/yr, $8,934/yr
  - Region: 56 hrs, 168/yr, $11,922/yr
- **Part 4 — Statewide:** ~**$7.9M/year** (1,600 PE + 232 District + 55 Division + 16 Region)
- **Part 5 — What SportPortal Eliminates** (comparison table)
- Real email evidence boxes throughout (amber highlight, quoted text, source attribution)

---

## Outstanding regressions (carried from Session 6.1)

### A — sportcarnival.com.au shows placeholder content
`sportcarnival-hub` Pages project contains placeholder HTML, not real carnival management UI.
**Fix:** locate correct build (Drive `SportPortal-build/` folder `1pHDFF4NPEiILxR4JT3RrtM51PDHXItZM`) and redeploy via wrangler. Status: **NOT FIXED**.

### B — schoolsportportal demo pages missing
`schoolsportportal` project missing `/demo-school`, `/demo-district`, `/altonadistrict` etc.
**Fix:** rollback via deployment history or rebuild 4 demo pages + 9 district stubs (~1hr HTML). Status: **NOT FIXED**.

### C — carnivaltiming.com ✅ FIXED + DEMO DEPLOYED (Session 6.1)
Mojibake fixed. Live demo feature: 8 pre-filled athletes, 4-letter join code, QR scan. Status: **LIVE**.

---

## Key facts

- Firebase project: `willy-district-sport`, Firestore `australia-southeast1` (Sydney)
- Firebase SDK: v9.23.0 compat layer (`firebase-firestore-compat.js`)
- Stripe payment link: `https://buy.stripe.com/bJe9AS2DH6wH7N6ckm9IQ04` ($1 AUD/student) — live
- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS (NOT VentraIP)
- carnivaltiming.com: was Google Domains, now CF Registrar
- Stripe approval: Google sign-in with pat_gallivan@hotmail.com (NOT paddy@luckdragon.io)
- ASIC Form 484 (Corporate Key) — postal letter ETA ~2026-05-02
- info@sportportal.com.au email setup — not done
- SSV structure: 1,600 schools, 232 districts, **55 divisions**, 16 region coordinators (confirmed from 2026-27 PDs)
- CRT rate: $425.80/day, $70.97/hr (DET Victoria, July 2025)

---

## Working tokens (fetch from vault — X-Pin auth required)

```bash
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/CF_FULLOPS_TOKEN
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN
```

CF_ACCOUNT_ID: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
CF Pages API: does NOT accept `per_page` — call `/pages/projects` with no params.

---

Last updated: 2026-04-29, Session 10 (external stakeholder chain + hours doc + HTML updated).

