---
name: CF lame delegation = unactivated zone
description: DNS REFUSED from CF nameservers = zone in "Finish setup" state. Click Free to activate.
type: reference
---
rcode=REFUSED from CF nameservers = zone was created but plan selection was never completed.

**Fix:** dash.cloudflare.com/{accountId}/{domain}/select-plan → click Free. DNS resolves within ~30s.

Hit 3x in one session (2026-04-26): sportportal.com.au, schoolsportportal.com.au, sportcarnival.com.au.
