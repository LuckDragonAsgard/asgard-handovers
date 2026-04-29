---
name: Edit tool leaves trailing null bytes after shrinking files
description: Edit pads original file size with \x00 when content shrinks. Strip nulls before deploy.
type: feedback
---
When Edit tool shrinks a file, it leaves original byte length padded with NULs. CF /admin/deploy rejects with SyntaxError past EOF.

**Fix before base64/deploy:**
```bash
python3 -c "b=open(P,'rb').read(); open(P,'wb').write(b.rstrip(b'\x00'))"
```
Or: `cat outputs/file > /tmp/clean.js`
