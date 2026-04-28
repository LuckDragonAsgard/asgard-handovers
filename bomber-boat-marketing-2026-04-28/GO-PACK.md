# Bomber Boat — Saturday Sell-Out GO PACK

**Game:** Bombers vs Brisbane Lions · **Sat 2 May** · Marvel Stadium
**Goal:** 60 paid seats by Sat morning · Break-even: 20
**Today:** Tue 28 Apr · **You have 4 days.**

---

## DO THESE TODAY (Tuesday) — 90 minutes total

### 1 · Site fixes (30 min — Paddy)
- [ ] In the bomberboat worker code, find every `Western Bombers` and replace with `Bombers`
- [ ] Pricing block: change `$90 / $40` to `$55 / $25`, relabel "One-way to the game" → swap with "Both ways — full return" so the labels match Con's email
- [ ] Postcode: `3016` → `3032` everywhere (schema.org, FAQ)
- [ ] Trip-time contradiction: pick **30 min** and replace the `~60 min` in FAQ #6
- [ ] Add hero band above current hero: `MAIDEN VOYAGE — SAIL ONCE. SEE TWICE. Book Saturday vs Brisbane, your next home game is on us.`
- [ ] Confirm Sat 2 May vs Brisbane is set to `bookings_open=true` in D1 `game_settings`

### 2 · Meta Pixel + Purchase event (15 min)
Drop this in the `<head>` of the worker's HTML response:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID_HERE');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"/></noscript>
```

On the Stripe success redirect page, fire the Purchase event with the booking value:

```html
<script>fbq('track', 'Purchase', {value: BOOKING_TOTAL_AUD, currency: 'AUD'});</script>
```

You'll need a Pixel ID from Meta Events Manager → Data Sources → Pixels → Create.

### 3 · Print posters (20 min — Mona)
1. Open the A3 PDF (link below)
2. Officeworks Print app — A3, full colour, 30 copies (~$90)
3. Pickup nearest store

### 4 · Social pre-warm (25 min)
Post the FB ad image (NOT as a paid ad yet — as an organic post on the Bomber Boat page) with the caption from §A below. Cross-post to Instagram. Loads up early engagement so when paid kicks in tomorrow, the ad has social proof on it.

---

## TOMORROW (Wednesday) — paid ad goes live

### 1 · Launch the FB ad ($80/day)
Meta Ads Manager → Create campaign:
- **Objective:** Sales (or Conversions if older account)
- **Conversion event:** Purchase (or Lead if Pixel still warming)
- **Daily budget:** $80
- **End date:** Sat 2 May 2:00pm
- **Audience saved name:** `BB-Bombers-West-25-64`
- **Locations:** 15 km radius around 3008 Marvel Stadium · include suburbs: Maribyrnong, Footscray, Yarraville, Seddon, Kingsville, Ascot Vale, Moonee Ponds, Essendon, Aberfeldie, Strathmore, Niddrie, Avondale Heights, Keilor East, Sunshine, Braybrook, Tottenham, West Footscray, Williamstown, Newport, Spotswood, Altona, Altona North, Brooklyn
- **Age:** 25–64 · **Gender:** All
- **Interests (any):** Essendon Football Club, AFL, Marvel Stadium, AFL Members
- **Placements:** Manual → Facebook Feed, IG Feed, IG Stories, Reels (NOT Audience Network)
- **Creative:** the 1080×1350 PNG below
- **Primary text:** Variant A from §A
- **Headline:** Sail once. See twice.
- **Description:** Free drink. Next game free.
- **Website URL:** https://bomberboat.com.au/?utm_source=facebook&utm_medium=paid&utm_campaign=maiden-voyage&utm_content=v-a
- **CTA button:** Book Now

### 2 · Drop these in FB groups (organic, free)
Copy/paste verbatim from §B. Be visible, not spammy — one post per group, then engage with comments.

### 3 · SMS the existing waitlist (text in §C)

### 4 · Email cheer squad / supporter groups (text in §D)

---

## §A — FB ad copy (3 variants, A is primary)

**Variant A — primary**
```
Maiden voyage offer: Sail once. See twice.

Book a seat on the FIRST EVER Bomber Boat sailing this Saturday vs Brisbane and your next Bombers home game is on us. Free.

Free drink on arrival. Hot finger food on board. Cheap bar prices the whole way. No Citylink. No parking. No Ubering home through brake lights.

Only 60 seats. When they're gone, the offer is gone.

🚤 bomberboat.com.au
```

**Variant B — story-led (for older audience)**
```
25 minutes down the Maribyrnong, free beer in your hand, mates already in colours, and you walk into Marvel ready to roar.

Saturday is the first ever Bomber Boat sailing — Bombers vs Brisbane. Get on it, and your next home game is on us. Every paid seat earns a free seat at any home game R9–R24.

60 seats. Up the Bombers.

bomberboat.com.au
```

**Variant C — short / IG Story**
```
SAIL ONCE. SEE TWICE.
Saturday's maiden voyage → next game on us.
60 seats only.
bomberboat.com.au
```

---

## §B — FB group post (organic, drop in 4 groups)

**Groups:** Essendon Bombers Fans · Bombers Loyalists · Bombers Diehards · AFL Footy Tipping VIC · Maribyrnong/Footscray/Yarraville Community

**Post (paste with the FB ad image):**
```
Hey Bombers — quick one for the western suburbs crew.

This Saturday vs Brisbane is the first ever Bomber Boat sailing. Boat from Cafe Riviera in Maribyrnong straight to Marvel Stadium. Free drink on arrival, finger food on board, cheap bar all the way, no Citylink, no parking. Boat waits 30 min after the final siren and brings you home.

Because it's the maiden voyage we're doing a one-off offer: book Saturday's sailing, your next home game is on us. Free seat at any home game R9–R24.

Only 60 seats. bomberboat.com.au

(Mods — happy to take this down if it's a violation, just letting fellow Bombers know about a thing built for us.)

Up the Bombers 🚤
```

---

## §C — SMS to existing waitlist

Send via your provider (or paste into Messages on iPhone for batch send):
```
Hey it's Paddy from Bomber Boat. The first sailing is THIS Saturday vs Brisbane.

Maiden voyage offer for waitlist: book Saturday and your next home game is FREE.

Only 60 seats. Boat from Cafe Riviera Maribyrnong, free drink on arrival, finger food on board, no Citylink no parking. bomberboat.com.au

Reply STOP to opt out.
```

(GDPR/Spam Act note: only send to numbers that opted in. If unsure, omit and just SMS personal contacts manually.)

---

## §D — Email to Essendon Cheer Squad / supporter groups

**Subject:** Group offer for Bombers vs Brisbane this Saturday — boat from Maribyrnong

```
Hi [name],

I run Bomber Boat — a fan ferry from Cafe Riviera in Maribyrnong straight to Marvel Stadium for every Bombers home game. Free drink on arrival, hot finger food on board, cheap bar all the way, and we wait 30 minutes after the final siren to bring everyone home.

Saturday's game vs Brisbane is the first ever sailing. I'd love to fill the boat with cheer squad / [supporter group] members. Two things on offer:

1. Group rate: book 6 seats and the 7th sails free.
2. Maiden voyage bonus: every paid seat earns a free seat at any home game R9–R24.

60 seats total, $55 adult / $25 child return — includes the drink and food.

Booking: bomberboat.com.au — or reply and I'll set up a group invoice.

Up the Bombers,
Paddy
```

---

## §E — Personal asks (Paddy texts 20 mates)

```
Mate — Bomber Boat's first sailing is Sat vs Brisbane. Boat from Maribyrnong, free drink, finger food, no Citylink, no parking. Book Saturday and your next home game is FREE on me. bomberboat.com.au — book before Friday or I'll be sad.
```

---

## §F — Site banner (add to bomberboat.com.au)

Paste this above the current hero:
```html
<div style="background:linear-gradient(135deg,#cc0000,#ff1f1f);padding:18px;text-align:center;font-family:Barlow,sans-serif;font-weight:800;color:#fff;font-size:20px;letter-spacing:1px;">
  🚤 MAIDEN VOYAGE OFFER — Book Saturday vs Brisbane, your next home game is FREE.
  <span style="opacity:.8;font-weight:600;">60 seats only.</span>
</div>
```

---

## §G — Post-Sat plan (when bookings hit milestones)

- **At 20 paid (break-even):** post celebration on socials, "halfway there" tone
- **At 40 paid:** scarcity push — "Only 20 seats left, boat departs Saturday"
- **At 50 paid:** retargeting ad budget bumped to $20/day, sticky countdown banner
- **At 60 paid (sold out):** waitlist toggle ON, capture emails for R8

---

## §H — BOGOF redemption rules (lock these BEFORE sales)

1. **Eligibility:** every paid seat (adult or child) on Saturday's first sailing earns 1 free seat of the same class on a future home game.
2. **Validity window:** R9–R24 (NOT R8 — R8 stays full-price).
3. **Redemption:** unique code in booking confirmation email, tied to buyer email in Stripe metadata `maiden_voyage_code`.
4. **One per paid seat.** Not transferable to cash. Not stackable.
5. **Expiry:** 31 Aug 2026 (end of regular season).
6. **No-show on Saturday = no free seat** (don't allow ghost bookings to redeem).

---

## §I — What I (Mona) need from Paddy in the next hour

1. Confirm Saturday's bounce time so I can update the poster + ad
2. Push the four site fixes from §1 above
3. Get me the Meta Pixel ID once created
4. Tell me how many people are on the existing waitlist (so I know if §C is worth doing)
5. Forward any Bombers cheer squad contact you have for §D

---

## Asset URLs (GitHub — clickable from anywhere)

Updated below after upload. All assets live in `PaddyGallivan/asgard-handovers/bomber-boat-marketing-2026-04-28/`.
