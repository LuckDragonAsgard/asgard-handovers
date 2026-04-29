---
name: Edit tool leaves trailing null bytes after shrinking files
description: Edit tool pads original file size with \x00 when content shrinks. Strip nulls before any deploy/base64.
type: feedback
---
When the Edit tool shrinks a file, it leaves the original byte length padded with NULs (\x00). node --check passes but CF /admin/deploy rejects with SyntaxError pointing past EOF.

**How to apply:**
Before base64-encoding any file from the outputs mount that was just modified by Edit, strip trailing nulls:
```bash
python3 -c "b=open(P,'rb').read(); open(P,'wb').write(b.rstrip(b'\x00'))"
```
Or write a fresh copy via `cat outputs/file > /tmp/clean.js`.
