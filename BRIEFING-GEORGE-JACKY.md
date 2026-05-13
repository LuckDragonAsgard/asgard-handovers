# Asgard & Falkor — Briefing for George & Jacky
**Prepared by Paddy Gallivan, Luck Dragon Pty Ltd | May 2026**

---

## The short version

Paddy has built a personal AI platform called **Asgard** that runs all of Luck Dragon's technology. Inside Asgard lives an AI assistant called **Falkor** — think of it like a private version of ChatGPT, but one that knows Paddy's entire business, can write and deploy code, manage databases, send emails, and read/write Google Calendar and Drive. It runs 24/7 on Cloudflare's global network for about $10–15 a month.

---

## What is Asgard?

Asgard is the **infrastructure** — the backend system that powers everything. It's built entirely on [Cloudflare Workers](https://workers.cloudflare.com), which means there are no servers to manage, no data centres to worry about, and it runs at the edge globally. 

**By the numbers:**
- 152 individual microservices (called "Workers") running in the cloud
- 28 databases (SQLite via Cloudflare D1)
- 24 key-value stores for fast data
- 5 object storage buckets (like S3)
- 18 domain names under management
- ~$10–15/month total running cost

**Think of it like this:** Asgard is the city. All of Luck Dragon's products — the booking sites, the sport portals, the trivia tools, the AI — are buildings in that city. Falkor is the AI that manages and runs the city.

---

## What is Falkor?

Falkor is the **AI assistant** that lives in Asgard. You access Falkor via:

- **Web/Mobile:** `https://falkor.luckdragon.io` — the main chat interface (works like ChatGPT, installable as an app)
- **PIN:** 2967

Falkor is not a single AI — it routes conversations across **4 different AI providers** depending on the task:

| AI | Used for | Cost |
|---|---|---|
| **Anthropic Claude** (Haiku/Sonnet) | General chat, coding, analysis | ~$0.25/million words |
| **OpenAI** (GPT-4o, DALL-E 3) | Creative writing, image generation | ~$0.15/million words |
| **Google Gemini** (2.5 Flash) | Lists, tables, summaries, translation | ~$0.075/million words |
| **Groq** (Llama 3.3 70B) | Fast free responses, default chat | **Free** |

**All-time AI spend so far: $0.11** — yes, eleven cents. The platform uses the cheapest model that can do the job.

---

## What can Falkor actually do?

### 1. Chat (like any AI assistant)
Ask it anything. It remembers context across conversations and has semantic memory — it can recall things you told it weeks ago.

### 2. Voice
Say "Hey Falkor" and it listens. It responds with a synthesised voice (ElevenLabs). Works on mobile or desktop in driving mode.

### 3. Image Generation
Type `/image a dragon holding a burger` and DALL-E 3 generates it inline. Or tap the 🎨 button.

### 4. Vision
Attach a photo and ask Falkor to analyse it. Works for receipts, documents, whiteboards, anything.

### 5. Google Integration
- **Drive:** Can search, read, and upload files to Paddy's Google Drive
- **Calendar:** Can read and write calendar events (just enabled today)

### 6. Read and Write Code — and Deploy It
This is the big one. Falkor can:
- Read the source code of any of the 152 live workers
- Modify the code
- Commit the change to GitHub
- Deploy it to Cloudflare — live on the internet

**Verified today:** Falkor read the `asgard-tools` worker, added a `/version` endpoint, committed to GitHub, and deployed it. All autonomously. 4 steps, ~25 seconds.

### 7. Manage the Entire Fleet
Falkor has 38 admin endpoints. It can:
- List all 152 workers and check their health
- Create or query any of the 28 databases
- Read/write to any KV store
- Check costs and spend across all AI providers
- Commit to GitHub repos

---

## The Products (what Asgard powers)

### Income-generating / live products:

| Product | What it is | URL |
|---|---|---|
| **Bomber Boat** | Essendon boat charter bookings + Stripe payments | bomberboat.com.au |
| **Bulldogs Boat** | Western Bulldogs boat charter bookings | bulldogsboat.com.au |
| **Long Range Tipping** | AFL tipping site (Next.js + D1) | longrangetipping.com |
| **Save My Seat** | Stadium seat sharing/splitting app | savemyseat.au |
| **LessonLab** | Curriculum planning tool for teachers | lessonlab.com.au |
| **KBT Web Apps** | Quiz and game tools for Key Business Trivia events | kbt-trivia.vercel.app |
| **Horse Race Tipping** | Tipping competition platform for pubs | horseracetipping.com |
| **Rooney Golf Tours** | Golf tour booking site (Ron Rooney) | rooneygolftours.com.au |
| **Hobsons Bay Dental** | Patient loyalty app | v0-dental-loyalty-app.vercel.app |
| **School Sport Portal** | Sports administration for Victorian schools | schoolsportportal.com.au |
| **SportCarnival** | School carnival timing + results | sportcarnival.com.au |

### Personal / family:
- **Family Footy Tipping** — Gallivan family AFL comp
- **Super League** — Fantasy AFL for a group of mates
- **WCYMS Footy Club** — Williamstown City YMS club hub
- **Family Hub** — shared calendar, chores, family dashboard

### In development:
- **SportCarnival** (commercial pivot — school carnival management SaaS)
- **Practice Interview** (AI mock interview tool)
- **Like Umm** (filler word counter)
- **Judy's Kitchen** (recipe sharing)
- Several others at idea stage

---

## The Tech Stack (plain English)

| Layer | What | Why |
|---|---|---|
| **Compute** | Cloudflare Workers (152 of them) | Runs globally, no servers, <1ms cold start, ~free |
| **Databases** | Cloudflare D1 (SQLite) — 28 databases | Fast, cheap, built into CF |
| **File storage** | Cloudflare R2 — 5 buckets | Like S3 but cheaper, no egress fees |
| **Secrets** | asgard-vault (custom KV store) | Centralised, PIN-protected, 69 keys |
| **Memory/AI Search** | Cloudflare Vectorize | Semantic search — how Falkor "remembers" |
| **DNS** | Cloudflare — 18 domains | All domains managed centrally |
| **Code** | GitHub — Luck-Dragon-Pty-Ltd org | All source code, auto-deploy on commit |
| **Hosting** | Cloudflare Pages + Vercel | Static sites |
| **Payments** | Stripe (Luck Dragon Pty Ltd, AU, AUD) | Active — charges and payouts enabled |
| **Email** | Resend — 7 verified domains | Transactional email |
| **SMS** | Twilio (trial) | SMS notifications |
| **Notifications** | Discord, Slack, Telegram bots | Falkor posts alerts/summaries |
| **External DBs** | Supabase (KBT, WCYMS, LRT, Save My Seat) | Postgres for heavier data needs |

---

## The Accounts

Everything important is under **paddy@luckdragon.io**:
- Cloudflare (main account: Luck Dragon)
- GitHub (LuckDragonAsgard + LuckDragon-Pty-Ltd org + PaddyGallivan personal)
- Stripe (Luck Dragon Pty Ltd — fully active, AU/AUD)
- Google Cloud (project 205533966048 — Gemini, Firebase, Calendar)
- Supabase, Resend, Discord, Twilio, Tavily, fal.ai

One exception: **Vercel** is still on `pgallivan@outlook.com` — this needs to be updated.

---

## Costs

**Cloudflare:** ~$4–6/month (pure pay-as-you-go, no plan fees)
**GitHub:** ~$4/month (paid org plan)
**AI (all providers combined):** $0.11 all-time. Groq is free. Anthropic/OpenAI/Gemini cost fractions of a cent per conversation.
**Domain registrations:** ~$15/domain/year (VentraIP + Squarespace)
**Vercel:** Free
**Supabase:** Free (multiple projects)
**Stripe:** No monthly fee — takes a % of payments processed

**Total monthly: ~$10–15.** Everything else is free tier or pay-as-you-go.

---

## Verified Capabilities (tested live today, 13 May 2026)

| Capability | Status | Detail |
|---|---|---|
| Chat (4 AI providers) | ✅ All working | Groq, Claude, GPT-4o-mini, Gemini all responding |
| Voice (TTS) | ✅ Working | ElevenLabs — 10KB audio per response |
| Image generation | ✅ Working | DALL-E 3 via OpenAI |
| Google Drive | ✅ Working | Search + read + upload |
| Google Calendar | ✅ Working | Just enabled today — reads/writes events |
| Semantic memory | ✅ Working | 841 vectors in Vectorize, stores + recalls |
| Agentic loop (read code) | ✅ All 4 providers | Falkor reads any worker's source code |
| Agentic loop (deploy code) | ✅ Verified | Falkor deployed a code change live today |
| Fleet management (152 workers) | ✅ Working | Lists, health checks, all admin endpoints |
| Database management (28 D1s) | ✅ Working | Query, create, inspect |
| GitHub read + commit | ✅ Working | Real commit pushed during this session |
| Spend tracking | ✅ Working | $0.11 all-time, visible in 💸 Spend tab |
| Custom domain | ✅ Working | falkor.luckdragon.io → PWA |

---

## How to access Falkor

**Chat interface:** https://falkor.luckdragon.io
**PIN:** 2967
**Install as an app:** On mobile, tap Share → Add to Home Screen

**George's PIN:** 3df458dc6e49ce5d (from the Asgard welcome email)
**Jacky's PIN:** stored in vault as JACKY_PIN

---

## What's next

The platform is at about 65% of the "Asgard Final Build" — the goal is for Falkor to be better than a standalone Claude subscription for Paddy's specific needs. What's still to come:

1. **Morning briefing** — automated daily digest delivered by Falkor at 7am (weather, calendar, footy, projects, costs)
2. **Voice clone** — Falkor responding in a custom voice trained on Paddy's audio
3. **Proactive alerts** — Falkor notices things and flags them (e.g. "your Bomber Boat booking page hasn't had a hit in 3 days")
4. **Tool palette in chat** — buttons for Drive, GitHub, Calendar, Email directly in the chat UI
5. **SportCarnival SaaS** — turning the school carnival tools into a paid product for Victorian schools

---

*This document generated 13 May 2026. Technical review, capability verification, and gap fixes all performed in the same session.*
