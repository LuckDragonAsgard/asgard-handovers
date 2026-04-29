---
name: CF lame delegation = unactivated zone
description: DNS REFUSED from CF NS means zone is in "Finish setup" state, not deleted
type: reference
---
If dig NS against Cloudflare anycast nameservers returns rcode=REFUSED (lame delegation?), the cause is almost always:

**The CF zone exists in the dashboard but is in "Finish setup" / pending plan selection state — never activated.**

**How to apply:**
1. Verify: https://dns.google/resolve?name={domain}&type=NS returns Status:2 + "lame delegation"
2. Open dash.cloudflare.com/{accountId}/{domain}/select-plan
3. Fix: click "Select plan" under Free. Within ~30s DNS starts resolving.
4. Check DNS records after activation.

This pattern was hit 3x in one session (2026-04-26) for sportportal.com.au, schoolsportportal.com.au, sportcarnival.com.au.
