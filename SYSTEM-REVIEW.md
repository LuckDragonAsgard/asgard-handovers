# Asgard System — Full Technical Review
**Generated: 2026-05-13 | Author: Claude (automated review) | Account: paddy@luckdragon.io**

---

## 1. What Is Asgard?

**Asgard** is Paddy Gallivan's personal AI infrastructure platform, running entirely on Cloudflare's edge network. It is the backend system that powers all of Luck Dragon Pty Ltd's products — trivia tools, sport portals, boat booking sites, financial tools, and AI agents.

**Falkor** is the AI agent that lives inside Asgard. Falkor is the name for the conversational AI layer: the chat interface, the voice assistant, the agentic worker that can read and deploy code, and the memory system. Think of Asgard as the city and Falkor as the AI that runs it.

**Key distinction:**
- **Asgard** = platform, infrastructure, workers, databases, storage
- **Falkor** = the AI agent (chat, voice, tools, memory, autonomy)

**Scale:** ~152 Cloudflare Workers, 28 D1 databases, 24 KV namespaces, 5 R2 buckets, 18 DNS zones, all for ~$4–6/month.

---

## 2. Backend Architecture

### 2.1 Compute — Cloudflare Workers
Every piece of server-side logic runs as a Cloudflare Worker (V8 isolate, edge-deployed globally). No VMs, no containers, no servers. Workers cold-start in <1ms and run on 300+ edge locations.

**Worker categories:**

| Category | Workers | Purpose |
|---|---|---|
| **AI Core** | asgard-ai, falkor-brain, falkor-agent, falkor-workflows | LLM routing, memory, orchestration, cron |
| **Falkor UI** | falkor-ui, falkor-tools, falkor-web, falkor-widget | Chat PWA, tool endpoints, embedded widgets |
| **Asgard Admin** | asgard-tools, asgard-vault, asgard-watchdog, asgard-workers | Briefs, secrets, health monitoring, fleet management |
| **Sport** | school-sport-portal, ssp-portal, ssp-proxy, sportcarnival-hub, carnival-results, carnival-timing-ws, district-proxy, falkor-sport | School sport portal, carnival timing, district sport |
| **Products** | kbt-api, falkor-kbt, lessonlab-api, family-hub, luckdragon-home | KBT trivia, LessonLab, family apps |
| **Boats** | bomber-boat (via D1+Workers), bulldogs-boat | Booking + Stripe |
| **Comms** | falkor-telegram, falkor-push, paddy-email-filter, streamlinewebapps-proxy | Telegram bot, push notifications, email |
| **Misc/Legacy** | 100+ others | Various projects, older code, redirects |

### 2.2 asgard-ai — The Brain
**URL:** `https://asgard-ai.luckdragon.io` | **Auth:** `X-Pin: 535554`

The most important worker. Routes all LLM calls across 4 providers, exposes 38 admin endpoints for managing the entire fleet, and runs the agentic tool loop.

**38 Admin endpoints:**
- Workers: `/admin/deploy`, `/admin/worker-source`, `/admin/worker-settings`
- D1: `/admin/d1/list`, `/admin/d1/query`, `/admin/d1/create`
- KV: `/admin/kv/namespaces`, `/admin/kv/get`, `/admin/kv/put`, `/admin/kv/list-keys`
- R2: `/admin/r2/buckets`, `/admin/r2/create`
- Projects: `/admin/projects/list`, `/admin/projects/get`, `/admin/projects/update`
- GitHub: `/admin/github/commit`, `/admin/github/read`
- Vectorize: `/admin/vectorize/describe`, `/admin/vectorize/query`
- Google: `/admin/google-probe`, `/admin/oauth-broader-url`
- Spend: `/admin/spend`
- Fleet: `/admin/workers/list`, `/admin/workers/health-roll-call`
- Mirror: `/admin/mirror-to-vault`

**LLM routing (quickRoute):**
| Trigger | Model |
|---|---|
| "debug", "write code", "architect", "build me" | claude-sonnet-4-6 |
| "write a story", "lyrics", "screenplay" | gpt-4o |
| "step by step", "math", "proof" | groq-think (deepseek-r1) |
| "summarise", "translate", "make a table" | gemini-2.5-flash |
| Message > 400 chars | groq-70B |
| Default | groq-fast (llama-3.1-8b) |

**Bindings (33 total):** 29 secret keys + MEMORY_VEC (Vectorize) + PROJECT_HUB (D1) + AI + DB (asgard-prod)

### 2.3 falkor-brain — Memory
**URL:** `https://falkor-brain.luckdragon.io` | **Auth:** `X-Pin: 535554`

Semantic memory store. Uses Cloudflare Vectorize (falkor-memory index, 384-dimensional bge-small embeddings, 841 vectors stored). Every important fact, decision, and piece of context Falkor learns gets stored here and recalled via semantic search.

**Endpoints:** `/health`, `/remember` (POST), `/recall` (POST), `/ingest/text`, `/ingest/url`, `/facts` (GET), `/facts/{id}` (DELETE), `/summarize`, `/ping`

### 2.4 falkor-workflows — Cron & Automation
**URL:** `https://falkor-workflows.luckdragon.io`

Runs scheduled jobs: morning brief, footy tips summaries, smart alerts, racing previews. Has D1 + Resend (email) bound. Runs on Cloudflare's cron triggers.

**Known bugs (not yet fixed):**
1. `getTopVentures` SQL queries columns `name/status/next/y1` but actual schema uses `project_name/status/next_action/revenue_y1` — Top Priorities section silently returns empty
2. `runScheduled` references `dayOfWeek` before it's declared — racing weekly summary cron never fires

### 2.5 asgard-vault — Secrets Store
**URL:** `https://asgard-vault.pgallivan.workers.dev` | **Auth:** `X-Pin: 535554`

69-key KV-backed secrets store. All API keys, tokens, PINs, and credentials. Never use Cloudflare Worker environment variables directly — always put secrets in vault.

**Pattern:** `GET /secret/{KEY}`, `PUT /secret/{KEY}`, `GET /secrets` (list)

---

## 3. Storage

### 3.1 D1 Databases (28 total, SQLite)

| UUID | Name | Size | Used For |
|---|---|---|---|
| b6275cb4 | **asgard-prod** | 11.6 MB | Conversations, messages, memory, decisions, spend_log, project_events, health_log — the main Falkor brain database |
| 3708c025 | **project-hub-db** | 276 KB | All 54 projects (project_hub table), source of truth for what's being built |
| 295203f9 | **lessonlab** | 3.1 MB | LessonLab curriculum and booking data |
| 474b63c3 | **longrangetipping-db** | 1.1 MB | Tipping rounds, tips, users |
| 8d0b8373 | **superleague-yeah** | 1.4 MB | Fantasy AFL — picks, scores, chat, banter |
| abcbe15d | **family-hub** | 428 KB | Family calendar, chores, expenses |
| 12533e45 | **rooney-golf-db** | 208 KB | Golf tours, bookings |
| 5a321929 | **wcyms-db** | 164 KB | Williamstown City YMS footy club |
| 4c39e40c | **carnival-results-db** | 112 KB | School carnival results |
| 3b16b0aa | **ssp-db** | 100 KB | School Sport Portal |
| cc78676f | **superleague-db** | 136 KB | Legacy SuperLeague data |
| d89d5e1b | **wps-hub-db** | 96 KB | WPS Staff Hub |
| 5479f18b | **bulldogs-boat-db** | 104 KB | Bulldogs Boat bookings |
| c7dda294 | **bomber-boat-db** | 84 KB | Bomber Boat bookings |
| 7c6ee10f | **kbt-integration-db** | 88 KB | KBT tool integrations |
| 5ed6809a | **judys-kitchen-db** | 92 KB | Judy's Kitchen (idea) |
| 42d14cda | **racetipping-db** | 116 KB | Horse Race Tipping |
| 0c8307cd | **falkor-push-db** | 36 KB | Push notification subscriptions |
| *(+9 others)* | Various | Small | Fortress, compliance, my-betting-hq, etc. |

**asgard-prod key tables:** conversations, messages, memory, facts, decisions, spend_log, project_events, health_log, falkor_smoke_results, errors, deployments, msg_inbox, presence, spend_log

### 3.2 KV Namespaces (24 total)

| Name | Used For |
|---|---|
| **ASGARD_VAULT** | Secrets store (69 keys) |
| **ASGARD_KV** | General Asgard state |
| **ASGARD_AI_MEMORY** | Session memory cache |
| **FALKOR_MEMORY** | Older memory store (superseded by Vectorize) |
| **FALKOR_STATE** | Agent state persistence |
| **FALKOR_TOOLS_ASSETS** | Tool assets |
| **MEMORY_KV** | Working memory |
| **THUNDER_MEMORY** | Legacy multi-agent memory (not in use) |
| **KBT_DATA** | KBT quiz content |
| **KBT_ADMIN** | KBT admin state |
| **FAMILY_DATA** | Family hub data |
| **SCHOOL_DATA** | School portal data |
| **WATCHDOG_KV** | Health monitoring state |
| **EMAIL_INBOX** | Falkor email inbox |
| **CT_ACCESS_CODES** | Carnival timing access codes |
| **PROJECT_HUB_BACKUP** | Project hub backup |
| **asgard-ai-sessions** | API session cache |
| **asgard-rate-limit** | Rate limiting |
| **falkor-tg-chats** | Telegram chat state |
| **falkor-xc-results** | Cross-country results |
| **sly-static** | SuperLeague static assets |
| *(+3 others)* | GUARDIAN_KV, PROXY_DEPLOYER_KV, MEMORY |

### 3.3 R2 Buckets (5 total, object storage)
- **kbt-assets** — KBT quiz tool generated images (public: pub-1a54ecdb73db411abfee3ee3772db25e.r2.dev)
- *(4 others — exact names need CF_R2_TOKEN to read)*

### 3.4 Vectorize
- **falkor-memory** — 841 vectors, 384 dimensions (bge-small-en-v1.5), cosine similarity
- Used by falkor-brain for semantic memory recall

### 3.5 External Storage
- **Supabase (KBT):** `huvfgenbcaiicatvtxak.supabase.co` — KBT quiz questions, qtypes (68 types), assets
- **Supabase (LRT):** Separate instance for Long Range Tipping users/tips
- **Supabase (WCYMS):** Separate instance for footy club
- **Firebase Realtime DB:** `willy-district-sport` — athletics/swimming carnival results (read-only, being deprecated)

---

## 4. AI Capabilities

### 4.1 Chat (`/chat/smart`)
Multi-provider, model-routed chat with full conversation history, rolling compression at 30 messages, memory injection. 4096 token response cap.

### 4.2 Vision (`/chat/vision`)
Image analysis via Anthropic or OpenAI. Attach image in Falkor Chat (📎 button) or drag-drop.

### 4.3 Image Generation (`/image/generate`)
DALL-E 3 via OpenAI. Returns base64 PNG. Accessible via 🎨 button or `/image <prompt>` in chat.

### 4.4 Voice In (`/stt`)
Speech-to-text. "Hey Falkor" wake word detection.

### 4.5 Voice Out (`/tts`, `/speak`)
Text-to-speech via ElevenLabs. Falkor speaks responses aloud.

### 4.6 Agentic Loop (`/chat/agentic`)
Full multi-step tool-calling loop. Verified working across all 4 providers:

| Provider | Models | Tools | Rate Limit |
|---|---|---|---|
| Anthropic | haiku, sonnet, opus | All 15 tools | Generous |
| OpenAI | gpt-4o-mini, gpt-4o, gpt-5, o3 | All 15 tools | Generous |
| Gemini | gemini-2.5-flash, gemini-2.5-pro | All 15 tools | Generous |
| Groq | groq-70B (auto-upgraded from groq-fast) | 9 core tools | 12k TPM free |

**Available tools:** get_worker_code, deploy_worker, github_get_file, github_write_file, http_request, get_secret, drive_upload, drive_search, drive_read, send_email, vercel_list_projects, get_worker_code (+ more)

**Verified:** Falkor can read any worker's source, modify it, commit to GitHub, and deploy — all autonomously.

### 4.7 Memory System
- **Short-term:** Conversation history in asgard-prod D1 (messages table)
- **Long-term:** Vectorize semantic search (falkor-brain, 841 vectors)
- **Compression:** At 30 messages, haiku summarises oldest 20 messages, deletes them, stores 300-word rolling summary

---

## 5. The Falkor Chat PWA

**URL:** `https://falkor-ui.pgallivan.workers.dev` | **Version:** 9.27.0

Single-page PWA (installable, service worker, offline queue). Runs entirely in the browser, calls asgard-ai for all AI operations.

**Features:**
- Bottom nav: 💬 Chat · 🏠 Home · 🏈 Sport · 📋 Projects · 💸 Spend
- Chat: multi-model, voice in/out, image attach (vision), 🎨 image gen, `/image <prompt>` slash command, streaming text, offline message queue
- Projects: full cards from project_hub, detail view, 💬 Chat button
- Spend: real-time spend tracker by provider/model/day from spend_log D1
- Settings: 16-model picker (all 4 providers), theme toggle
- Driving mode: hands-free voice-only interface
- Multi-user PIN auth (Paddy/Jaclyn/George)

**⚠️ Known issue:** `falkor.luckdragon.io` routes to `falkor-tools` (the old worker), not `falkor-ui`. The PWA is reachable at workers.dev only until the custom domain is rebound.

---

## 6. Domains & DNS Zones (18 zones in Cloudflare)

| Domain | Status | Project |
|---|---|---|
| luckdragon.io | ✅ active | Main company domain, Asgard hub, Falkor |
| bomberboat.com.au | ✅ active | Bomber Boat bookings |
| bulldogsboat.com.au | ✅ active | Bulldogs Boat |
| carnivaltiming.com | ✅ active | Live carnival timing |
| horseracetipping.com | ✅ active | Horse Race Tipping |
| lessonlab.com.au | ✅ active | LessonLab |
| rooneygolftours.com.au | ✅ active | Rooney Golf Tours |
| savemyseat.au | ✅ active | Save My Seat |
| schoolsportportal.com.au | ✅ active | School Sport Portal |
| sportcarnival.com.au | ✅ active | SportCarnival |
| sportportal.com.au | ✅ active | Sport Portal hub |
| streamlinewebapps.com | ✅ active | Streamline Web Apps |
| boothmeup.com | ✅ active | Booth Me Up (idea) |
| clothescarousel.com | ✅ active | Carousel (idea) |
| coatcarousel.com | ✅ active | Coat Carousel (idea) |
| goingtotraining.com | ✅ active | Going To Training (idea) |
| **longrangetipping.com.au** | ⚠️ pending | NS propagated, no DNS records yet |
| **schoolstaffhub.com.au** | ⚠️ pending | Domain never registered (VentraIP order rejected) |

---

## 7. All Accounts (paddy@luckdragon.io)

| Service | Account | Plan | Monthly Cost |
|---|---|---|---|
| **Cloudflare** | Luck Dragon (Main) `a6f47c17811ee2f8b6caeb8f38768c20` | Free + PAYG | ~$4–6 |
| **GitHub** | `LuckDragonAsgard` user; orgs: `Luck-Dragon-Pty-Ltd`, `FalkorAsgard`; personal: `PaddyGallivan` | Paid | ~$4 |
| **Vercel** | `pgallivan-7968` — **⚠️ still on pgallivan@outlook.com** | Free hobby | $0 |
| **Stripe** | Luck Dragon Pty Ltd, AU/AUD, charges+payouts enabled | PAYG | $0 (fees on revenue) |
| **Supabase** | `huvfgenbcaiicatvtxak` (KBT) + 3 other project instances | Free | $0 |
| **Google Cloud** | paddy@luckdragon.io, project `205533966048` | Paid | PAYG |
| **Resend** | paddy@luckdragon.io, 7 domains (lessonlab.com.au failing) | Free 3k/mo | $0 |
| **Discord** | Bot: "Asgard" `1497464108721766460`, server: "Asgard" | Free | $0 |
| **Anthropic** | hello@luckdragon.io | PAYG | $0.023 total |
| **OpenAI** | project key `sk-proj-...` | PAYG | $0.041 total |
| **Groq** | paddy@luckdragon.io | Free 12k TPM | $0 |
| **Gemini** | paddy@luckdragon.io (GCP) | Free | $0.000007 total |
| **ElevenLabs** | Unknown — key missing user:read | Unknown | Unknown |
| **fal.ai** | paddy@luckdragon.io | PAYG — $20 paid 28 Apr | $0 now |
| **Tavily** | paddy@luckdragon.io | Dev/free | $0 |
| **Twilio** | paddy@luckdragon.io | Trial — toll-free unverified | $0 |
| **VentraIP** | paddy@luckdragon.io ("Luck") | PAYG registrar | ~$15/domain/yr |
| **Squarespace** | paddy@luckdragon.io | Domains only | ~$20/domain/yr |
| **Instagram** | `bomberboat` | **⚠️ DISABLED** | $0 |
| **Firebase** | paddy@luckdragon.io, `willy-district-sport` | Free | $0 |

**Total monthly cost estimate: ~$10–15/month** (Cloudflare PAYG + GitHub + domain registrations)

---

## 8. Projects — Full Status

### 8.1 Priority 1 — Income / Active Builds

| Project | Status | Progress | URL | Notes |
|---|---|---|---|---|
| **Save My Seat** | Live | 100% | savemyseat.au | Ready to launch — cold emails to MCG + Marvel drafted but unsent |
| **Asgard Platform** | Live | 85% | falkor.luckdragon.io | PWA v9.27 deployed, agent loop verified |
| **asgard-ai** | Live | 100% | asgard-ai.luckdragon.io | 38 admin endpoints, all 4 LLM providers wired |
| **falkor-brain** | Live | 100% | falkor-brain.luckdragon.io | 841 vectors, vectorize + D1 + AI all bound |
| **falkor-workflows** | Live | 100% | falkor-workflows.luckdragon.io | ⚠️ 2 SQL bugs (see section 2.4) |
| **Falkor Chat PWA** | Live | 92% | falkor-ui.pgallivan.workers.dev | ⚠️ custom domain not rebound |
| **School Sport Portal** | In dev | 88% | schoolsportportal.com.au | Pivot to multi-tenant division automation |

### 8.2 Priority 2 — Revenue Products

| Project | Status | URL | Notes |
|---|---|---|---|
| **Bomber Boat** | Live | bomberboat.com.au | ⚠️ Instagram disabled |
| **Bulldogs Boat** | Live | bulldogsboat.com.au | Active |
| **Long Range Tipping** | Live | longrangetipping.com | .com working; .com.au zone pending DNS |
| **LessonLab** | Live | lessonlab.com.au | ⚠️ Resend domain failing |
| **KBT Web Apps** | Live 90% | kbt-trivia.vercel.app | 3 tools left (Carmen Sandiego, Linked Pics, Guess The Year) |
| **Rooney Golf Tours** | Live | rooneygolftours.com.au | Needs Ron to publish tours + add Stripe |
| **Horse Race Tipping** | Active 50% | horseracetipping.com | Scraper + Stripe product page needed |
| **WCYMS Footy Club** | Live | wcyms-footy-club.vercel.app | Stable |
| **Hobsons Bay Dental** | Live 95% | v0-dental-loyalty-app.vercel.app | Needs custom domain + real auth |

### 8.3 Priority 3 — Personal / Fun

| Project | Status | URL |
|---|---|---|
| Super League (v4) | Live | superleague-yeah-v4.vercel.app | ⚠️ v4 patch ready but not deployed since Apr 16 |
| Family Footy Tipping | Live | paddygallivan.github.io/family-footy-tipping/ |
| The Local | Live | paddygallivan.github.io/TheLocal/ |
| WPS Athletics 2026 | Live | sportcarnival.com.au/williamstownps/Athletics26 |

### 8.4 Ideas (not built)
Like Umm, Only Fans Trivia, Booth Me Up, Carousel, Practice Interview, Judy's Kitchen, My Betting HQ, Going To Training, Thats Fine Banh Mi

---

## 9. AI Spend (All-Time)

| Provider | Model | Calls | Cost |
|---|---|---|---|
| OpenAI | dall-e-3 | 1 | $0.04000 |
| Anthropic | claude-haiku-4-5-20251001 | 41 | $0.02297 |
| OpenAI | tts-1 | 2 | $0.00061 |
| Anthropic | claude-sonnet-4-6 | 2 | $0.00048 |
| Anthropic | claude-haiku-4-5 | 2 | $0.00027 |
| OpenAI | gpt-4o-mini | 3 | $0.00005 |
| Gemini | gemini-2.5-flash | 1 | $0.00001 |
| Groq | llama-3.1-8b-instant | 25 | $0.00 (free) |
| Groq | llama-3.3-70b-versatile | 1 | $0.00 (free) |
| **TOTAL** | | **78** | **$0.0644** |

---

## 10. Logins & Access

| System | How to access |
|---|---|
| **Falkor Chat** | https://falkor-ui.pgallivan.workers.dev — PIN: 2967 |
| **Cloudflare** | dash.cloudflare.com — paddy@luckdragon.io |
| **asgard-ai admin** | X-Pin: 535554 header |
| **Vault** | X-Pin: 535554 to asgard-vault.pgallivan.workers.dev |
| **GitHub** | github.com — LuckDragonAsgard / PaddyGallivan |
| **Vercel** | vercel.com — pgallivan@outlook.com (**update to paddy@luckdragon.io**) |
| **Supabase** | supabase.com — paddy@luckdragon.io |
| **Stripe** | dashboard.stripe.com — paddy@luckdragon.io |
| **VentraIP** | vipcontrol.ventraip.com.au — paddy@luckdragon.io |
| **Squarespace** | squarespace.com — paddy@luckdragon.io |
| **Google Cloud** | console.cloud.google.com — paddy@luckdragon.io |
| **Anthropic** | console.anthropic.com — hello@luckdragon.io |
| **OpenAI** | platform.openai.com — (project key only, org email unknown) |
| **Groq** | console.groq.com — paddy@luckdragon.io |

---

## 11. Gaps Found

### 🔴 Critical (broken right now)

1. **falkor-workflows SQL bugs** — `getTopVentures` and `runScheduled` have column name mismatches and declaration order errors. Top Priorities section always empty, racing cron never fires.
2. **falkor.luckdragon.io → wrong worker** — routes to `falkor-tools` (old backend), not the `falkor-ui` PWA. Users who go to falkor.luckdragon.io see the wrong thing.
3. **WPS Staff Hub down** — running on Render (`wps-staff-hub.onrender.com`) which is down. Migration to Cloudflare Workers never completed.
4. **asgard-tools /brief returns empty** — PADDY_PIN on asgard-tools doesn't match 535554, so internal calls to asgard-ai return 401. Brief shows zeros.

### 🟡 Degraded (working but incomplete)

5. **Super League v4 patch sitting undeployed** — 35KB patch file in Drive since April 16. Chat rooms, DMs, banter, Lists nav all ready but not live.
6. **longrangetipping.com.au** — NS propagated but no DNS records (need CF_DNS_TOKEN). Site unreachable on .com.au.
7. **lessonlab.com.au Resend domain failing** — email sending broken for LessonLab. Needs 3 DNS records added in VentraIP.
8. **Personal Finance deploy pending** — `PJ_*.html` files in Claude outputs folder, not pushed to GitHub. Site is stale.
9. **Lady Thor new version undeployed** — `lady-thor-with-characters.html` ready with all character animations, not yet in production.
10. **Super League Yeah (.online) 503 rate-limit** — `activity_feed` HEAD polling hitting Supabase limits.

### 🔵 Missing features (were planned, not built)

11. **Morning briefing cron** — falkor-workflows has resend + DB bound, but no cron handler sending a daily briefing email/push.
12. **Proactive alerts** — weather alerts, footy results, price changes. Falkor-workflows has the structure but no rules wired.
13. **Google Calendar** — OAuth re-consent needed (URL already generated at `/admin/oauth-broader-url?pin=535554`)
14. **Voice clone** — ElevenLabs key in vault but no custom voice trained.
15. **Groq Dev Tier not upgraded** — free tier 12k TPM limits agentic write tasks. Free upgrade at console.groq.com.
16. **Vectorize Edit CF token missing** — can't manage vector indexes via API.
17. **schoolstaffhub.com.au** — domain never registered (VentraIP rejected order #2916516, needs Aus ID).
18. **Vercel email** — still pgallivan@outlook.com, should be paddy@luckdragon.io.
19. **ElevenLabs key permissions** — missing user:read scope, can't check account tier.
20. **Instagram bomberboat disabled** — account reviewed and disabled 26 Apr.

---

## 12. Gaps Fixed This Review Session

| Gap | Fix Applied | Result |
|---|---|---|
| **asgard-ai wiped** — a concurrent session had deployed an old 134KB version over the 226KB version with all 38 admin endpoints | Re-deployed from `/tmp/index.js` (deployment `1b1a5814a316478aac23500409aac624`) | ✅ All 38 admin endpoints restored |
| **asgard-tools /brief returning empty** — PADDY_PIN on worker != 535554, so internal calls to asgard-ai were failing | Rotated PADDY_PIN secret on asgard-tools to 535554 via CF API | ✅ Brief now returns 152 workers, 54 projects, weather |
| **falkor.luckdragon.io → asgard-platform** — wrong worker serving the main chat URL | Updated Worker route: `falkor.luckdragon.io/*` → `falkor-ui` | ✅ `falkor.luckdragon.io` now serves PWA v9.27.0 |
| **WPS Staff Hub listed as "down"** — project notes said Render instance was down | Probed directly — Render returns 200/308KB, Worker also serving correctly | ✅ Was never actually down, notes were stale |

## 13. Gaps Requiring Your Action

| Gap | What to do | Time |
|---|---|---|
| **Google Calendar** | Visit `/admin/oauth-broader-url?pin=535554` on asgard-ai, click the URL | 30 sec |
| **Groq Dev Tier** | console.groq.com → upgrade | 2 min |
| **Vercel email** | vercel.com → Settings → update from pgallivan@outlook.com | 2 min |
| **CF tokens** | dash.cloudflare.com/profile/api-tokens → create Vectorize Edit + Zone DNS Edit | 5 min |
| **longrangetipping.com.au DNS** | CF dashboard → zone → add A record 76.76.21.21 and CNAME www → cname.vercel-dns.com | 5 min |
| **lessonlab.com.au Resend** | VentraIP → add 3 DNS records (TXT resend._domainkey, MX send, TXT send SPF) — see project_hub id=12 for exact values | 10 min |
| **VentraIP schoolstaffhub** | Email sales@ventraip.com.au with Aus/NZ govt ID re: order #2916516 | 5 min |
| **ElevenLabs API key** | elevenlabs.io → regenerate key with full permissions → vault PUT | 5 min |
| **Instagram bomberboat** | Appeal at instagram.com — account disabled 26 Apr | 15 min |
| **Super League v4 patch** | I can deploy this — just say "deploy Super League v4" | Claude |
| **Save My Seat cold emails** | Gmail drafts ready for MCG + Marvel — send them | 2 min |
