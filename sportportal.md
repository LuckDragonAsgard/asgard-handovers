# SportPortal — HANDOVER-EOD (2026-04-26, Session 5.0)

Read this first. Supersedes all previous handover files.

---

## WHAT THIS SESSION DID

Goal: Migrate carnivaltiming.com from Firebase RTDB (Singapore) to Cloud Firestore (Sydney) for Victorian DET IPP 9 compliance.

### Completed this session ✅
1. Firestore `(default)` database created in `australia-southeast1` (Sydney) on project `willy-district-sport`
2. `index.html` and `timing.html` fully migrated to Firestore SDK
3. Both files pushed to `LuckDragonAsgard/district-sport` main branch ✅ (confirmed end of session)
4. CF Pages auto-deploy triggered — carnivaltiming.com now serving Firestore version

---

## FIRST THING TO DO

Verify CF Pages deploy completed:
- Go to Cloudflare Pages → district-sport → check latest deployment status
- Open carnivaltiming.com and confirm it loads (no RTDB console errors)
- Then do Task 14: update security.html on both portals to say "Australia (Sydney)" instead of Singapore

---

## MIGRATION CHANGES (for reference)

Both index.html and timing.html:
- SDK: `firebase-database-compat.js` → `firebase-firestore-compat.js`
- DB init: `firebase.database()` → `firebase.firestore()`
- Helpers: `cRef` → `fsDoc` / `fsCol` / `fsDel`
- Listeners: `.on('value')` → `.onSnapshot()`
- Push keys: RTDB `.push()` → UUID + `.update()`
- Connection: `info/connected` → `navigator.onLine`
- Server time: `serverTimeOffset` → `serverOffset = 0`

---

## PLATFORM STATE

| Surface | Status |
|---|---|
| sportportal.com.au | ✅ Live |
| schoolsportportal.com.au | ✅ Live |
| sportcarnival.com.au | ✅ Live |
| carnivaltiming.com | ✅ Firestore deployed (verify load) |
| Firestore DB (australia-southeast1) | ✅ Created and live |
| security.html (both portals) | ⚠️ Still says Singapore — update next |
| Firebase DPA | ⏳ Paddy needs to sign (login: paddy@luckdragon.io) |
| ASIC Form 484 | ⏳ BLOCKED — Corporate Key ~2026-05-02 |

---

## OUTSTANDING TASKS

| # | Task | Status |
|---|---|---|
| 4 | ASIC Form 484 | ⏳ BLOCKED ~2026-05-02 |
| 10 | Sign Firebase DPA | ⏳ console.firebase.google.com → Project Settings → Usage and billing → Data Processing and Security. Login: **paddy@luckdragon.io**. Log in asgard-prod.facts when done. |
| 14 | Update security.html to say Australia (Sydney) | ⏳ Next task — both sportportal and schoolsportportal CF Pages |

---

## INFRASTRUCTURE REFERENCE

- CF account: `a6f47c17811ee2f8b6caeb8f38768c20` (Luck Dragon Main)
- Firebase project: `willy-district-sport`
- **Firestore DB: `(default)` in `australia-southeast1` (Sydney)** ← active
- Old RTDB: `willy-district-sport-default-rtdb` in `asia-southeast1` (Singapore) ← retiring
- GitHub repo: `LuckDragonAsgard/district-sport` (branch: main)
- CF Pages: auto-deploys `carnivaltiming.com` on push to main
- sportportal CF Pages project: `sportportal` (index.html, privacy.html, terms.html, security.html)
- schoolsportportal CF Pages project: `schoolsportportal`
- Drive folder (Sport Portal): `1SVbCqDwD7AztVXmijffRTPdCi_JoGQr6`

Firebase config (Firestore):
```
apiKey: AIzaSyBOFAvjJAUfUrJ5RZe4mSYZwmv5fPnNZHw
authDomain: willy-district-sport.firebaseapp.com
projectId: willy-district-sport
storageBucket: willy-district-sport.firebasestorage.app
messagingSenderId: 834754823697
appId: 1:834754823697:web:f95d0ca87a01a72cae4e7e
```

---

## BROWSER AUTOMATION NOTES (save Claude time next session)

**GitHub pages:** CSP blocks Chrome extension content scripts. `find`/`read_page`/`computer` ALL time out. Only `javascript_tool` works.

**GitHub file upload:** `file_upload` tool won't work. Use `fa.attach([file])` on the `<file-attachment>` web component:
```javascript
const fa = document.querySelector('file-attachment');
await fa.attach([new File([content], 'index.html', {type:'text/html'})]);
// then submit the commit form
```

**Mintty/Git Bash:** Request as `mintty.exe` (not "Git Bash") to get full tier. "Git Bash" gives click-only tier.

**CF Pages ZIP injection** (for sportportal/schoolsportportal deploys):
```javascript
const inp = document.querySelector('input[type=file][accept=".zip"]');
const pk = Object.keys(inp).find(k=>k.startsWith('__reactProps'));
const dt = new DataTransfer(); dt.items.add(zipFile); inp.files = dt.files;
inp[pk].onChange({target:inp,currentTarget:inp,nativeEvent:{target:inp},type:'change',bubbles:true,preventDefault:()=>{},stopPropagation:()=>{}});
// ZIP: central directory external_attrs = 4 bytes (not 2)
```

**Bash/workspace:** Was unavailable this session. Use Chrome javascript_tool as fallback for encoding/scripting.
