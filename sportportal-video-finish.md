# SportPortal — Video Finish & Timing Feature

**Status:** Banked — build next  
**Added:** 2026-04-28  
**Platform:** carnivaltiming.com

---

## What it is

A phone-based video finish system built into the CarnivalTiming app. At the finish line, one official points their phone at the line and hits Record. The app captures the moment, timestamps each frame, and lets the timing official scrub back to call exact finish order and — where needed — derive a split-second time.

## Why it matters

School carnivals run on volunteer timers with stopwatches. Results get disputed. Parents complain. At higher levels (Division, Region), a wrong call can eliminate a kid from qualification. There is currently no accessible photo-finish system for school sport — the professional alternatives (Lynx, FinishLynx) cost thousands and require specialist operators. A phone-based system built into the app they're already using changes everything.

## Key use cases

1. **Disputed sprint finishes** — 100m, 200m where 1st/2nd are too close to call by eye. Scrub video to frame, confirm order.
2. **Relay changeovers** — Was the baton handed before or after the line? Video review settles it on the spot.
3. **Hurdles/obstacle events** — Did they knock the hurdle? Was it intentional? 
4. **Record verification** — If a student sets a school or district record, video timestamp provides evidence.
5. **Timing accuracy at lower levels** — Where volunteer stopwatches are the only timing, video frame timestamps give a crosscheck.

## Technical approach (MVP)

- **Capture:** Native camera API via browser (getUserMedia) or React Native — phone pointed at finish line, records to local storage or streams to server
- **Timestamp:** Each frame tagged server-side with Unix ms timestamp at receipt, or device clock + network sync offset
- **Review UI:** Scrubber with frame-step buttons (← →), finish line overlay, tap-to-mark finish for each athlete in heat
- **Output:** Confirmed finish order written directly to the heat result in SportPortal — no manual re-entry

## Phase 2

- **Lane tracking** — ML-based lane assignment from video so the official doesn't have to manually match athletes to finish positions
- **Auto-timing** — Frame timestamp of confirmed finish position → automatic time calculation (requires calibrated start signal)
- **Highlights clip** — Auto-trimmed finish clip attached to result, shareable to parents

## Integration points

-  — primary surface (timing officials already here)
- Heat result object in Firestore — add  field pointing to clip + confirmed order
- Admin screen — "Review finish" button on any heat result, opens video scrubber
- Parent results view — optional: show finish clip alongside result

## Competitive angle

No school sport platform has this. PhotoMyRun and similar are consumer apps, not integrated into event management. This makes carnivaltiming.com a genuinely unique product at every level of the sport pathway.

---

*Banked by Paddy Gallivan, 2026-04-28*
