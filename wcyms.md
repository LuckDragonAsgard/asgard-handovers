# WCYMS Footy Club Hub — ARCHIVED 2026-04-27

**Status:** Archived. Do not revive without a fresh feature spec.

## What was torn down (2026-04-27)

- Cloudflare Worker `cyms-deploy-v4` — deleted
- Cloudflare Worker `cyms-deploy-v12` — deleted
- Cloudflare Worker `wcyms-footy-club` (worker stub) — deleted
- Cloudflare Pages project `wcyms-footy-club` — deleted
- D1 row `id=18` in asgard-brain `products` — status set to `archived`, URLs cleared

## What still exists

- GitHub stub repos `cyms-club-app` + `footy-club-app` under LuckDragonAsgard org — deletion attempted but token lacked `delete_repo` scope. Both are empty husks; safe to leave or delete manually via the GitHub UI.

## Why archived rather than rebuilt

No buildable React source ever existed in any GitHub repo. The original built bundle lived on Vercel and was lost when the Vercel project `wcyms-footy-club` was deleted during the 2026-04-27 portfolio consolidation. Three Cloudflare deployments were preserved as live HTML snapshots during the migration but all were broken (asset URLs returned text/html due to missing JS bundles).

Classified Tier-C scrap candidate in the Vercel→Cloudflare Migration handover.

## If reviving in the future

1. Define what the app actually does first (roster? score entry? sponsor portal?).
2. Consider WCYMS as a tenant of an existing product (SportPortal, SchoolSportPortal, Carnival Timing) rather than standalone.
3. New repo, new CF Pages project with Git auto-build. Do not resurrect the empty `footy-club-app` repo without a spec.

## Source-of-truth pointers

- D1: `asgard-brain` products table, id 18
- Migration context: `Vercel → Cloudflare Migration Plan (2026-04-27)` Drive doc id 1YQ6O1TkiJYqG693zLfkm681IbWQnRk4Ai18tK9yFYzk
- Earlier portfolio consolidation handover: Drive doc id 1VJXFhXMv0ZSSQfikr387phpUc4jYy71lcOBKWkIbcYI
