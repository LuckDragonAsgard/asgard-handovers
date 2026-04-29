---
name: Crazy Domains upsell dark patterns
description: How Crazy Domains traps registration into bundles, and which add-ons are scams
type: feedback
---
Rule: When dealing with a Crazy Domains invoice/cart, ALWAYS itemise the line items first and refuse the upsells before paying. Never click PAY on a bundle without breaking it down.

**Why:** CD bundles registration with three high-margin add-ons that look optional but are pre-ticked or hidden inside a single "Pay & Register" total. Observed in Paddy's account 2026-04-28:
- A clean `$87.23` Domain Registration screen exists in Notifications, but the My Wallet → Invoices view rolls it up with add-ons into a `$142.11` bundle. CD's UI actively makes the clean path hard to find again once you leave it.
- **Domain Expiry Protection** is the worst trap: priced as `$10.49 per MONTH` (would auto-renew to ~$126/yr) for something replicated free by enabling auto-renew on the domain itself.
- **Domain Guard** ($31.47 / 5yr) sells WHOIS privacy — useless on `.au` domains because auDA mandates public registrant info regardless.
- **Premium DNS** — pointless when the domain's nameservers are already at Cloudflare.

**How to apply:**
1. If a CD invoice total looks bigger than `domain price × years × ~1.10 (GST)`, an upsell is hidden inside.
2. Find the clean registration view at My Profile → **Notifications** → click "Domains Not Registered, Action Now!" entries (NOT the upsell-only invoices).
3. Better yet, when leaving CD entirely, just abandon the cart and register at the destination registrar (VentraIP / Cloudflare) — no upsells to fight.
4. Auto-renew toggle is free at every registrar — never pay for "Expiry Protection".