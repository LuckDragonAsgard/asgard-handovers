# SportPortal — HANDOVER (2026-04-29, Session 10 — transport update)

---

## TL;DR for the next session

- All four domains are **Cloudflare Pages projects with direct upload** — NOT workers.
- **carnivaltiming.com is LIVE and GREEN** — mojibake fixed, demo feature deployed (Session 6.1).
- **Two regressions still outstanding**: A (sportcarnival.com.au placeholder) and B (schoolsportportal demo pages missing).
- **Session 9–10 work: email catalog (33 types) + external stakeholder chain + transport deep-dive documented.**
- **Key deliverable this session:** `ssv-admin-burden-analysis.docx` — full hours doc with transport cascade detail. Statewide figure updated to **~$8.36M/year**.

---

## Sessions 9–10 (2026-04-28/29) — what got built

### 1. Email catalog expansion (Session 9)
- Stats bar updated: **33** distinct email types catalogued (was 8)
- Division count corrected: **55** (from 2026-27 PDs), was 40
- Statewide cost corrected: **$337K/yr** per division tier, ~**$5.6M** total (HTML)
- Full 9-category email catalog section added to HTML with all 33 types

### 2. External stakeholder chain (Session 10)
New section added to `sportportal-comparison.html` — **"The Bigger Play"**:
- 6 external stakeholder cards: Councils, Aquatic Centres, First Aid, Officials/Umpires, Parent Volunteers, Transport
- Real email evidence in each card (council bookings, WynActive pool hire, Sports Aid, parent volunteers)

### 3. Transport deep-dive (Session 10 update)
Transport card in HTML fully expanded with:
- **PE Teacher transport tasks**: 8 tasks itemised, ~3.0 hrs/carnival (was 2.0)
  - Permission slips (100+ students) · Chase non-returners · Parent-driver DET consent forms · Bus inquiry · Confirm final numbers · Student manifest · Send program + fixture to bus company · Day-of call if late
- **Division Coordinator transport tasks**: ~2.5 hrs/carnival
  - Program distribution to all schools · Fixture distribution · Venue access brief · Field school queries · Resend updated program · Day-of delay management
- **The cascade bottleneck**: entries close → draw → program → numbers confirmed → bus booked → 2 days out
- **8 documents per school per carnival** just for transport (listed)
- SportPortal fix: confirmed count live at entry close, program auto-generates timetable, bus company receives structured brief automatically

### 4. ssv-admin-burden-analysis.docx (updated)
**File:** `G:\My Drive\ssv-admin-burden-analysis.docx`
Updated statewide figures (now including full transport cascade):
- PE Teacher: 17 hrs/carnival, 51 hrs/yr, **$3,620/yr**
- District Coordinator: 37.5 hrs/carnival, 112.5 hrs/yr, **$7,984/yr**
- Division Coordinator: 44.5 hrs/carnival, 133.5 hrs/yr, **$9,475/yr**
- Region Coordinator: 58 hrs/carnival, 174 hrs/yr, **$12,349/yr**
- **Statewide total: ~$8.36M/year** (up from $7.9M — transport now fully counted)

---

## Outstanding regressions (carried from Session 6.1)

### A — sportcarnival.com.au shows placeholder content
Status: **NOT FIXED**. Fix: locate correct build in Drive `SportPortal-build/` folder and redeploy via wrangler.

### B — schoolsportportal demo pages missing
Status: **NOT FIXED**. Fix: rollback via deployment history or rebuild 4 demo pages + 9 district stubs.

### C — carnivaltiming.com ✅ FIXED (Session 6.1)

---

## Key facts

- Firebase project: `willy-district-sport`, Firestore `australia-southeast1` (Sydney)
- Firebase SDK: v9.23.0 compat layer (`firebase-firestore-compat.js`)
- Stripe payment link: `https://buy.stripe.com/bJe9AS2DH6wH7N6ckm9IQ04` ($1 AUD/student) — live
- VentraIP account #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS (NOT VentraIP)
- carnivaltiming.com: now CF Registrar
- Stripe approval: Google sign-in with pat_gallivan@hotmail.com (NOT paddy@luckdragon.io)
- ASIC Form 484 (Corporate Key) — postal letter ETA ~2026-05-02
- info@sportportal.com.au email setup — not done
- SSV structure: 1,600 schools, 232 districts, **55 divisions**, 16 region coordinators
- CRT rate: $425.80/day, $70.97/hr (DET Victoria, July 2025)

---

## Working tokens

```bash
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/CF_FULLOPS_TOKEN
curl -H "X-Pin: <pin>" https://asgard-vault.pgallivan.workers.dev/secret/GITHUB_TOKEN
```

CF_ACCOUNT_ID: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)

---

Last updated: 2026-04-29, Session 10 transport update (~$8.36M statewide, 8 transport docs per school per carnival).

