# SportPortal — EOD Handover (Session 11, 2026-04-29)

## TL;DR
4-domain school sports SaaS on CF Pages + Firestore. Pitch materials complete.
Asgard D1 now has 20 rich facts covering all projects.

## Session 11 deliverables
- Inserted 20 comprehensive facts into Asgard D1 (all 20 OK)
  - sportportal: urls, ssv_structure, hours_per_role, cost_model_figures, transport_cascade,
    external_stakeholders, email_catalog, pitch_documents, revenue_projections_5yr, infra_state
  - bomberboat: urls, revenue_model, corporate_ideas
  - kbt: urls
  - carnivaltiming: urls
  - judyskitchen: state
  - clubhouse: state
  - asgard: urls
  - bulldogsboat: state
  - luckdragon: all_projects (master index)

## Session 10 deliverables (still current)
- G:\My Drive\ssv-admin-burden-analysis.docx — hours doc with real email evidence, ~$8.36M/yr statewide
- G:\My Drive\ssv-admin-cost-model-v2.xlsx — 6-sheet Excel model with all figures
- G:\My Drive\sportportal-comparison.html — 33-email catalog + external stakeholder section (6 cards)
- SSV structure: 1,600 schools, 232 districts, 55 divisions, 16 regions
- CRT rate: $70.97/hr (DET Victoria, July 2025)
Sport Portal Drive folder: 1SVbCqDwD7AztVXmijffRTPdCi_JoGQr6

## Cost model (all figures)
- Statewide annual admin cost: **$8,362,146/yr**
- PE Teachers: 1,600 x $3,620/yr = $5,792,000
- District: 232 x $7,984/yr = $1,852,288
- Division: 55 x $9,475/yr = $521,125
- Region: 16 x $12,349/yr = $197,584

## Hours per role per carnival
| Role | Hrs/carnival | Hrs/yr | Cost/yr |
|---|---|---|---|
| PE Teacher | 17 | 51 | $3,620 |
| District Coord | 37.5 | 112.5 | $7,984 |
| Division Coord | 44.5 | 133.5 | $9,475 |
| Region Coord | 58 | 174 | $12,349 |

## Revenue projections (5-year)
| Year | Scope | ARR |
|---|---|---|
| Year 1 | Pilot: 3 divisions, 15 districts | $30,000 |
| Year 2 | 3 regions, 10 div, 50 dist | $100,000 |
| Year 3 | 8 regions, 28 div, 120 dist | $260,000 |
| Year 4 | Statewide VIC: 55 div, 232 dist | $507,000 |
| Year 5 | VIC lock-in + NSW pilot | $500k-$800k |

Pricing: Division $5,000/yr (1.9x ROI), District $1,000/yr (8x ROI), Schools free tier

## Architecture
All 4 domains on Luck Dragon Main CF account (a6f47c17811ee2f8b6caeb8f38768c20):

| Domain | CF Pages project | NS pair |
|---|---|---|
| sportportal.com.au | sportportal | coraline+renan |
| schoolsportportal.com.au | schoolsportportal | coraline+renan |
| sportcarnival.com.au | (auto-attached) | (CF) |
| carnivaltiming.com | carnival-timing | liv+quinton |

Firebase: willy-district-sport (australia-southeast1), SDK v9.23.0 compat

## Known regressions (not urgent)
- **A**: sportcarnival.com.au showing placeholder — rebuild from Drive SportPortal-build/
- **B**: schoolsportportal.com.au missing demo pages (/demo-school, /demo-district, /altonadistrict)

## Key facts
- VentraIP #45838174: sportportal.com.au, schoolsportportal.com.au
- sportcarnival.com.au registrar: Tucows/OpenSRS
- carnivaltiming.com: CF Registrar
- Stripe: approved, login pat_gallivan@hotmail.com (NOT paddy@luckdragon.io)
- CF account: a6f47c17811ee2f8b6caeb8f38768c20

## Outstanding
- ASIC Form 484 (Corporate Key) — postal letter ETA ~2026-05-02
- info@sportportal.com.au email setup — not done
- Regression A + B fixes when ready
