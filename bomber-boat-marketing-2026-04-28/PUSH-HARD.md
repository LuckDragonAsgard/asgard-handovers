# Bomber Boat — PUSH HARD pack
**Mon→Sat: from 0 to 60 seats sold.** Everything you need below. Copy, paste, send.

---

## 1. Cheer Squad email (send NOW — most leverage)

**To:** Whoever runs the Essendon Cheer Squad (cheersquad@essendonfc.com.au — or via the Cheer Squad Facebook group admin)
**Cc (optional):** essendonsupporters@gmail.com (Essendon Bombers Supporter Group)
**Subject:** Group offer for Cheer Squad — boat from Maribyrnong to Marvel, Sat vs Brisbane

```
Hi team,

We run Bomber Boat — a fan ferry from Cafe Riviera in Maribyrnong straight to Marvel Stadium for every Bombers home game. Free drink on arrival, hot finger food on board, cheap bar all the way, and the boat waits 30 minutes after the final siren to bring everyone home.

This Saturday vs Brisbane is the first ever sailing. We'd love to fill the boat with Cheer Squad members.

Two things on offer:

1. Group rate — book 6 seats and the 7th sails free. Stack as many as you like.
2. Maiden voyage bonus — every paid seat earns a free seat at any other home game this season.

60 seats only. $55 adult / $25 child return — includes the drink and food.

Booking: bomberboat.com.au — or reply to this email and we'll set up a single group invoice.

Up the Bombers,
The Bomber Boat crew
hello@bomberboat.com.au
bomberboat.com.au
```

**Other groups worth pinging the same day:**
- Essendon FC Members services (membership@essendonfc.com.au) — ask if they'll mention in their Friday e-news
- Maribyrnong / Footscray neighbourhood Facebook groups — drop the post-pack version
- Local AFL umpiring / AFL juniors clubs — they have Bombers fan parents

---

## 2. SMS variants — pick by relationship

**A. Warm contacts (mates, family, anyone who knows Paddy):**
```
Mate — Bomber Boat first sailing is Sat vs Brisbane. Boat from Maribyrnong, free drink, finger food, no Citylink, no parking. Book Saturday and your next home game is FREE on me. bomberboat.com.au — get on it before Friday.
```

**B. Existing waitlist (signed up via the site already):**
```
Hi — Bomber Boat here. The first sailing is THIS Sat vs Brisbane and you're on the early list. Maiden voyage offer for waitlisters: book Saturday and your next home game is on us. Pick any home game.

60 seats only. bomberboat.com.au

Reply STOP to opt out.
```

**C. Cold contacts (mates of mates, given by someone you know):**
```
G'day — [referrer] gave me your number. Running Bomber Boat — fan ferry from Maribyrnong to Marvel for Bombers home games. First sailing is this Sat vs Brisbane. Free drink, food, cheap bar, no parking. Book Saturday and your next home game is free. bomberboat.com.au — the Bomber Boat crew.
```

---

## 3. Meta Ads Manager — screen-by-screen launch (90 sec once Pixel ID is in)

**Pre-flight:**
- Pixel ID swapped in `site/index.html` (replace `YOUR_PIXEL_ID` with the real ID, both occurrences)
- Test Events tab in Meta Events Manager → load bomberboat.com.au → see PageView fire → green tick
- Stripe success page firing Purchase event (this is the #1 thing to verify; if it doesn't, your ad WILL waste money)

**Step 1 — Create campaign (https://adsmanager.facebook.com/adsmanager → green "+ Create" button):**
- **Buying type:** Auction
- **Objective:** Sales
- **Campaign name:** `BB-MaidenVoyage-2026-05-02`
- **Special ad categories:** None
- **A/B test:** Off
- **Advantage campaign budget:** OFF (we want ad-set level control)
- Click Next.

**Step 2 — Ad set (sales optimisation):**
- **Ad set name:** `BB-Bombers-West-25-64`
- **Conversion location:** Website
- **Pixel:** Bomber Boat (the one Paddy created)
- **Conversion event:** Purchase
- **Daily budget:** $80 AUD
- **Schedule end:** Sat 2 May 2026, 2:00pm
- **Locations:** Drop a pin on Marvel Stadium (700 Bourke St, Docklands 3008), set radius **15 km**. Then "Include" → add suburbs from list (paste them):

```
Maribyrnong, Footscray, Yarraville, Seddon, Kingsville, Ascot Vale, Moonee Ponds, Essendon, Aberfeldie, Strathmore, Niddrie, Avondale Heights, Keilor East, Sunshine, Braybrook, Tottenham, West Footscray, Williamstown, Newport, Spotswood, Altona, Altona North, Brooklyn
```

- **Age:** 25 – 64
- **Gender:** All
- **Detailed targeting → Interests (any):** type and add each — Essendon Football Club, Australian Football League (AFL), Marvel Stadium, AFL Members
- **Languages:** All
- **Placements:** Manual placements
  - ✅ Facebook Feed · IG Feed · IG Stories · Reels (FB and IG)
  - ❌ Audience Network · ❌ Right Column · ❌ Marketplace
- Click Next.

**Step 3 — Ad:**
- **Ad name:** `BB-MaidenVoyage-V-A`
- **Identity → Facebook Page:** Bomber Boat · **Instagram account:** Bomber Boat
- **Ad setup:** Create ad
- **Format:** Single image
- **Media:** upload `fb_ad_1080x1350.png` (https://github.com/PaddyGallivan/asgard-handovers/blob/main/bomber-boat-marketing-2026-04-28/fb_ad_1080x1350.png)
- **Primary text:**
```
Maiden voyage offer: sail once, see twice.

Book a seat on the FIRST EVER Bomber Boat sailing this Saturday vs Brisbane and your next home game is on us. Free.

Free drink on arrival. Finger food on board. Cheap bar all the way home. No Citylink. No parking. No Ubering home through brake lights.

Only 60 seats. When they're gone, the offer's gone.

🚤 bomberboat.com.au
```
- **Headline:** `Sail once. See twice.`
- **Description:** `Free drink. Next game free.`
- **Website URL:** `https://bomberboat.com.au/?utm_source=facebook&utm_medium=paid&utm_campaign=maiden-voyage&utm_content=v-a`
- **Display link:** `bomberboat.com.au`
- **Call to action:** `Book Now`
- **Conversion event:** Purchase
- Toggle on **Standard enhancements** (Meta auto-tweaks brightness, cropping)
- Click **Publish**.

**Within 30 min** Meta should approve and start delivery. Watch the campaign for 4 hours, then if CPM is sane (<$25), let it run. If CPM is awful, pause and check the audience — it usually means the location radius pulled in too many people.

**At 24 hours**: duplicate the ad set, swap the creative for Variant B (longer story copy from the GO-PACK). Run both in parallel — Meta will tilt budget toward whichever performs better.

---

## 4. Instagram set — fire today

**Feed post (1080×1350):** same image as FB. Caption:
```
🚤 First sailing.

This Saturday vs Brisbane — boat from Cafe Riviera Maribyrnong to Marvel and back. Free drink, finger food, cheap bar all the way home.

Maiden voyage deal: book Saturday → next home game on us.

Only 60 seats. Link in bio.

#UpTheBombers #EssendonBombers #BomberBoat #MaribyrnongRiver #AFL2026 #MarvelStadium #VFLMelbourne #FootscrayLife
```

**Story (vertical, sticker → bomberboat.com.au):**
```
Sail once.
See twice.
Sat vs Brisbane.
60 seats.
[link sticker]
```

**Reel (use Jaclyn's `bomberboat_reel.mp4` from Drive):**
- Caption:
```
The first ever Bomber Boat sailing is THIS Saturday vs Brisbane.

Book Saturday → next home game's free. 60 seats only.

bomberboat.com.au · Up the Bombers 🚤
```
- Add audio: any AFL anthem or "Bombers in their colours" — let Instagram auto-suggest from Reels trending
- Cover frame: pick frame with the boat + skyline visible

---

## 5. Pub posters — drop-off route (after Officeworks pickup)

Aim to stick up by 6pm Tuesday so they catch Wednesday foot traffic:

| # | Pub | Address | Why |
|---|---|---|---|
| 1 | **Cafe Riviera** | 55 Cumberland Dr, Maribyrnong | Boarding point — most obvious |
| 2 | Plough Hotel Footscray | 333 Barkly St, Footscray | Bombers crowd, big sports clientele |
| 3 | Stork Hotel | 504 Elizabeth St, Melbourne | (covers nth Melb fans, tram line to Marvel) |
| 4 | Royal Hotel Essendon | 13 Pascoe Vale Rd, Essendon | Heart of Bombers heartland |
| 5 | Vic Hotel Footscray | 222 Barkly St, Footscray | Essendon-friendly, walkable to Marvel |
| 6 | Lincolnshire Arms | 4 Watt St, Yarraville | Yarraville fans skew west = Bombers |
| 7 | Yarraville Club | 135 Stephen St, Yarraville | Members are the target demo |
| 8 | Mona Castle Hotel | 1 Mona St, Seddon | Walking distance from boat |
| 9 | Anglers Tavern | 2 Raleigh St, Maribyrnong | Already on the river — natural fit |
| 10 | Junction Hotel Newport | 6 Mason St, Newport | Western fan catchment |

Pitch to the publican: *"Hey — I'm running a fan ferry to Marvel for Bombers games. Mind if I stick a poster up? Happy to leave a stack of A4s on the bar too — every booking via this poster, I'll buy a round for your bar staff at the end of the season."* That last line gets the publican on side.

---

## 6. Tracking sheet — spend $5 to $15/booking, monitor daily

Open Google Sheets, two columns:

| Date | Source | Bookings | Spend | Notes |
|---|---|---|---|---|

Sources to track: `paid-fb`, `organic-fb`, `instagram`, `sms-mates`, `cheer-squad`, `poster-cafe`, `poster-pubs`, `direct`, `unknown`.

Pull `paid-fb` count from Meta Ads Manager. The rest from Stripe metadata UTM params or "how did you hear about us" question if you add one to checkout.

Halfway through the week, kill anything below 0.5% conversion and double-down on what's working.

---

**Hit go on whichever you can right now. I'll keep watching. Tell me when the Pixel ID arrives and I'll update the worker code in one push so you can launch the paid ad straight after.**
