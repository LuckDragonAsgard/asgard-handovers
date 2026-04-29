---
name: Cloudflare lame delegation = unactivated zone
description: Diagnosis pattern when DNS returns "rcode=REFUSED, lame delegation" from CF nameservers — usually means the CF zone is in "Finish setup" state, not deleted
type: reference
---
If `dig NS <domain>` against Cloudflare anycast nameservers returns `rcode=REFUSED` with comment "Name servers refused query (lame delegation?)", the cause is almost always:

**The CF zone exists in the dashboard but is in "Finish setup" / pending plan selection state — never activated.**

It is NOT (usually): zone deleted from CF, NS records mismatched at registrar, or zone on a different CF account.

**Why:** When a CF zone is created but plan selection is never completed, the zone is provisioned but doesn't actually serve DNS responses. CF refuses to answer queries for that zone until the user clicks "Select plan → Free" (or any plan) and the zone activates.

**How to apply:**
1. Verify symptom: `https://dns.google/resolve?name={domain}&type=NS` returns Status:2 + "lame delegation".
2. Open `dash.cloudflare.com/{accountId}/{domain}/select-plan` — if you see the plan-selection page with a "Finish setup" badge, this is the case.
3. Fix: click "Select plan" under Free. Within seconds DNS starts resolving correctly to CF anycast IPs.
4. After activation, check DNS records — usually CF imported the registrar's existing records. Verify they point to the right hosting target.