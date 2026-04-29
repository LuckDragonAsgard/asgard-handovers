---
name: Edit tool leaves trailing null bytes after shrinking files
description: When the Edit tool reduces a file's content, it pads the original file size with `\x00`. Strip nulls before any deploy / base64 encode.
type: feedback
---
When the Edit tool shrinks a file in the outputs mount, it leaves the original byte length and pads the tail with NULs. `node --check` passes (it stops at the first `}`), but Cloudflare's `/admin/deploy` parser reads the whole base64 payload and rejects with `SyntaxError: Invalid or unexpected token at <file>:<line>` pointing past EOF.

**Why:** Burned one deploy on this. The deploy looked like it had a real syntax bug but the actual JS was fine — the trailing nulls were the problem.

**How to apply:**
Before base64-encoding any file from the outputs mount that was just modified by Edit, strip trailing nulls:
```bash
python3 -c "b=open(P,'rb').read(); open(P,'wb').write(b.rstrip(b'\x00'))"
```
Or write a fresh copy via `cat outputs/file > /tmp/clean.js`. Watch for this any time `wc -c` of an edited file matches the pre-edit size despite content shrinking.