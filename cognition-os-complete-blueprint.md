# COGNITION OS — Complete App Blueprint

## Product Vision

**Cognition OS** — The Cognitive Performance Operating System for High-Performers

Not a meditation app. Not a wellness journal. A performance weapon for people who use their brain as their primary money-making tool — traders, CEOs, surgeons, lawyers, developers. Every technique is evidence-based, every protocol is personalized, every day counts. Miss a day? Start the level over. The streak IS the product.

---

## 1. TECH STACK (Feb 2026 — Built for 10-Year Longevity)

### Frontend — SvelteKit 5 + Capacitor

**Why SvelteKit 5:**
- Compile-time optimized — smallest bundles, fastest runtime of any framework
- Svelte 5 runes ($state, $derived, $effect) — reactive primitives that compile away
- Single codebase → PWA + iOS + Android via Capacitor
- TypeScript strict mode — catches errors at compile time
- SSR for the marketing/landing site, SPA mode for the app shell
- Vite-powered HMR for instant dev feedback

**Why Capacitor (not React Native or Flutter):**
- Web-first: The SAME code runs as PWA and native app
- Native APIs: Push notifications, haptics, local notifications (timers), health integrations
- App Store distribution: Bundled web assets = fast review, instant OTA updates via Capgo
- No new language to learn (vs Dart/Flutter)

### Mobile-Specific Stack
```
SvelteKit 5 (Static Adapter) → Capacitor 6
├── @capacitor/push-notifications (protocol reminders)
├── @capacitor/local-notifications (timers, pomodoro alerts)
├── @capacitor/haptics (session completion feedback)
├── @capacitor/status-bar (immersive mode during sessions)
├── @capacitor/screen-orientation (lock during exercises)
├── @capacitor/app (lifecycle management)
├── @capacitor/preferences (offline-first local storage)
└── capacitor-health (Apple Health / Google Fit integration)
```

### Backend — Rust/Axum

**Why Rust/Axum:**
- Memory-safe, zero-cost abstractions — handles 100k+ concurrent connections
- Perfect for real-time features (WebSocket for live sessions)
- 10-year stability — Rust backwards compatibility guarantee
- Type safety end-to-end when paired with TypeScript frontend

```
Rust/Axum API Server
├── Authentication (JWT + refresh tokens, OAuth2)
├── User profile & onboarding data
├── Protocol engine (generates personalized schedules)
├── Progress tracking & streak management
├── Spaced repetition algorithm (SM-2 variant)
├── Dual N-Back scoring engine
├── Push notification scheduler
├── Analytics & cognitive benchmark storage
└── Subscription/billing (Stripe integration)
```

### Database — PostgreSQL + Redis

```
PostgreSQL (primary store)
├── Users, profiles, onboarding answers
├── Protocol schedules (generated per user)
├── Session logs (every pomodoro, meditation, exercise)
├── Streak data & level progression
├── Spaced repetition cards & intervals
├── Cognitive benchmark scores
└── Subscription status

Redis (real-time + caching)
├── Active session state (current pomodoro timer)
├── Notification queue
├── Rate limiting
└── Leaderboard caching
```

### Infrastructure

```
Frontend (Marketing Site):  Cloudflare Pages (SSR via SvelteKit)
Frontend (App Shell):       Capacitor (iOS/Android) + PWA
Backend API:                Fly.io (Rust/Axum containers, edge deployment)
Database:                   Neon PostgreSQL (serverless, auto-scaling)
Cache:                      Upstash Redis (serverless, global)
Object Storage:             Cloudflare R2 (user avatars, card images)
Push Notifications:         Firebase Cloud Messaging + APNs
Payments:                   Stripe (subscriptions + in-app purchases)
Analytics:                  PostHog (self-hosted, privacy-first)
OTA Updates:                Capgo (instant app updates without store review)
CI/CD:                      GitHub Actions
Monitoring:                 Sentry (error tracking) + Grafana (metrics)
```

### Design System

```
CSS Framework:     Tailwind CSS 4
Animations:        GSAP 3 + Svelte transitions
Icons:             Lucide Icons (consistent, open source)
Charts:            Chart.js or Recharts (cognitive benchmarks)
Typography:        Inter (UI) + JetBrains Mono (data/numbers)
Color System:      Custom dark-first palette (see Design Spec below)
Motion:            Spring-based animations (Svelte motion)
Haptics:           Capacitor Haptics API (native feedback)
```

---

## 2. DESIGN LANGUAGE — "Obsidian Intelligence"

### Design Philosophy
The app should feel like a cockpit, not a spa. Think Bloomberg Terminal meets Apple Watch meets a fighter jet HUD. Dark, precise, information-dense but never cluttered. Every pixel serves a purpose. The aesthetic communicates: "This is a serious tool for serious people."

### Color Palette

```
/* Core - Dark Foundation */
--bg-primary:        #0A0A0F;    /* Near-black, slight blue undertone */
--bg-secondary:      #12121A;    /* Card backgrounds */
--bg-tertiary:       #1A1A2E;    /* Elevated surfaces */
--bg-glass:          rgba(255, 255, 255, 0.04);  /* Glassmorphism panels */

/* Text Hierarchy */
--text-primary:      #F0F0F5;    /* Headlines, primary content */
--text-secondary:    #8888A0;    /* Labels, descriptions */
--text-tertiary:     #4A4A60;    /* Disabled, hints */

/* Accent - Electric Cyan (Focus/Active) */
--accent-primary:    #00D4FF;    /* Primary actions, active states */
--accent-secondary:  #0099CC;    /* Hover states */
--accent-glow:       rgba(0, 212, 255, 0.15);  /* Glow effects */

/* Semantic Colors */
--success:           #00FF88;    /* Streak alive, level complete */
--warning:           #FFB800;    /* Streak at risk, approaching deadline */
--danger:            #FF3366;    /* Streak broken, level restart */
--info:              #6C63FF;    /* Neutral information */

/* Level Colors (progressive intensity) */
--level-1:           #4A90D9;    /* Foundation - Calm Blue */
--level-2:           #7C4DFF;    /* Attention - Purple */
--level-3:           #00BFA5;    /* Memory - Teal */
--level-4:           #FF6D00;    /* Advanced - Orange */
--level-5:           #FFD700;    /* Mastery - Gold */

/* Glassmorphism */
--glass-bg:          rgba(255, 255, 255, 0.03);
--glass-border:      rgba(255, 255, 255, 0.08);
--glass-blur:        blur(20px);
```

### Typography Scale

```
/* Using Inter for UI, JetBrains Mono for data */
--font-display:      'Inter', system-ui, sans-serif;
--font-mono:         'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs:           0.75rem;    /* 12px - Labels */
--text-sm:           0.875rem;   /* 14px - Body small */
--text-base:         1rem;       /* 16px - Body */
--text-lg:           1.125rem;   /* 18px - Subheadings */
--text-xl:           1.25rem;    /* 20px - Section titles */
--text-2xl:          1.5rem;     /* 24px - Page titles */
--text-3xl:          2rem;       /* 32px - Hero numbers */
--text-4xl:          2.5rem;     /* 40px - Dashboard stats */
--text-5xl:          3.5rem;     /* 56px - Timer display */
```

### Glassmorphism Component Pattern

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-card-elevated {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(0, 212, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

### Micro-Interactions & Motion

```
/* Principles */
- All transitions: 200-300ms ease-out (spring feel)
- Page transitions: Slide + fade, 350ms
- Button press: Scale to 0.97 + haptic feedback (on native)
- Streak counter: Number tick animation (odometer style)
- Level up: Full-screen particle explosion + haptic burst
- Timer completion: Pulse ring + chime + haptic
- Card flip: 3D rotate Y-axis 180deg (spaced repetition)
- Progress ring: SVG stroke-dasharray animation
- Streak break: Screen shake + red flash + impact haptic
```

---

## 3. ONBOARDING FLOW — "Mission Briefing"

### Philosophy
The onboarding is NOT a boring form. It's a "mission briefing" — the user is being profiled like a fighter pilot candidate. The questions feel like an assessment, not a survey. Each answer visibly adjusts the protocol in real-time on screen (a live preview updates as they answer). This creates investment before they even start.

### Screen-by-Screen Flow

---

### SCREEN 0: Splash / Hero
**Visual:** Full-screen dark background with a subtle neural network animation (thin cyan lines connecting dots, pulsing softly). The logo fades in.

**Copy:**
```
COGNITION OS

Your brain is your most valuable asset.
Most people never train it.

[BEGIN ASSESSMENT →]
```

**Technical Notes:**
- Neural network animation: Canvas-based particle system, ~60 nodes, connecting within proximity threshold, subtle pulse on connections
- GSAP timeline: Logo scale 0→1 (0.8s, elastic ease), tagline fade-in (0.5s delay), button slide-up (1s delay)
- Haptic: Light impact on button appear (native only)

---

### SCREEN 1: Identity
**Visual:** Minimal. One question at a time. Large text. Dark background with subtle gradient shift.

**Question:** "What do you do?"

**Options (Tap to select, animated border glow on selection):**
```
┌─────────────────────┐
│  🎯  Day Trader      │
├─────────────────────┤
│  📊  Swing Trader    │
├─────────────────────┤
│  🏢  CEO / Founder   │
├─────────────────────┤
│  💻  Developer       │
├─────────────────────┤
│  ⚖️  Lawyer          │
├─────────────────────┤
│  🏥  Medical Pro     │
├─────────────────────┤
│  🎓  Student         │
├─────────────────────┤
│  🔧  Other           │
└─────────────────────┘
```

**What this controls:**
- Visualization scripts (Level 4-5): Trader gets market scenarios, CEO gets boardroom scenarios
- Example spaced repetition content
- Terminology throughout the app ("session" vs "shift" vs "study block")
- Default peak performance hours pre-fill

**Animation:** Options slide in staggered from right (50ms delay each), selected option glows with accent border + subtle scale to 1.02

---

### SCREEN 2: Schedule Type
**Visual:** Same minimal dark layout. Progress bar at top (thin cyan line, 15% complete).

**Question:** "How does your day work?"

**Options:**
```
┌──────────────────────────────────────────┐
│  ⏰  Fixed Schedule                       │
│  Same hours every day                     │
├──────────────────────────────────────────┤
│  🔄  Flexible                             │
│  I set my own hours                       │
├──────────────────────────────────────────┤
│  🌙  Night Shift                          │
│  I work nights                            │
├──────────────────────────────────────────┤
│  ✂️  Split Shift                           │
│  Morning + evening with a break           │
└──────────────────────────────────────────┘
```

**What this controls:**
- "Fixed" → App generates clock-specific times (6:00 AM, 6:05 AM, etc.)
- "Flexible" → App generates relative times (Wake +0, Wake +5, etc.) and shows "I'm up" button each morning
- "Night Shift" → Entire protocol is inverted. Morning activation happens at their evening. Sleep hygiene tips adjusted for daytime sleeping.
- "Split Shift" → Protocol splits cognitive blocks around the break. Exercise goes in the middle gap.

---

### SCREEN 3: Wake Time
**Visual:** Beautiful custom time picker. Circular dial with hour markers, glowing cyan hand. NOT a boring dropdown.

**Question:** "What time does your day usually start?"

**UI Element:** Circular time picker (clock face)
- User drags the hand to their wake time
- As they drag, a "dawn gradient" subtly shifts the background (dark blue → slightly lighter at the selected time, suggesting sunrise)
- Below the clock: "I wake up at [TIME]" updates live
- If "Flexible" was selected: Additional note appears — "No worries, we'll ask you each morning"

**What this controls:**
- Anchor point for entire daily schedule
- Morning activation sequence timing
- Cold exposure timing (must be within 30 min of waking)
- Meditation timing

---

### SCREEN 4: Sleep
**Visual:** Horizontal slider with a crescent moon icon on left, sun icon on right.

**Question:** "How many hours do you usually sleep?"

**UI Element:** Custom slider, 4h → 10h
- Slider track changes color: Red (4-5h) → Orange (5-6h) → Yellow (6-7h) → Green (7-9h) → Blue (9-10h)
- As user slides, a brief message appears:

```
< 6h:  "⚠️ Sleep is the #1 cognitive enhancer. We'll help you fix this."
6-7h:  "Good start. The protocol will help you optimize."
7-9h:  "Perfect range. Your brain thanks you."
> 9h:  "Solid recovery. Let's channel that energy."
```

**What this controls:**
- If < 7h: Sleep optimization becomes a tracked metric. Evening wind-down protocol gets extra emphasis. App shows "sleep debt" warnings.
- Bedtime calculation: Wake time minus sleep hours = target bedtime
- Wind-down notification timing: 60 min before calculated bedtime

**Follow-up question (same screen, appears after slider):**
"What time do you go to bed?"

**UI Element:** Same circular time picker as wake time, but with a moon/stars gradient.

---

### SCREEN 5: Work Hours
**Visual:** A timeline bar across the screen, 24h. User drags handles to define their work block.

**Question:** "When are your work hours?"

**UI Element:** Draggable range selector on a 24h timeline
- Start handle (left) and end handle (right)
- Selected range fills with accent color
- Below: "You work [X] hours per day" auto-calculates

**For "Flexible" users:**
Instead of the timeline, show:
"How many hours of deep cognitive work do you do per day?"
Slider: 2h → 12h
- This determines number of Pomodoro blocks: hours × 2 = pomodoros (since each pomodoro = ~30 min including break)

**What this controls:**
- Number of pomodoro blocks allocated
- Placement of cognitive work within the schedule
- Whether exercise goes before, during, or after work

---

### SCREEN 6: Breaks
**Visual:** The timeline from Screen 5 is still visible at the top (context). Below it, break slots.

**Question:** "Tell us about your breaks"

**Sub-questions:**
```
Do you have a regular coffee/morning break?
  [Yes] → Time picker appears → "When?"
  [No]

Do you have a lunch break?
  [Yes] → Time picker + duration selector (15/30/45/60 min)
  [No]

Any other regular breaks?
  [Add break +] → Time picker + duration
```

**What this controls:**
- Coffee break → Micro-meditation (2 min) + hydration check inserted here
- Lunch break:
  - If ≥ 45 min: Exercise slot (30 min run/walk + 15 min cool down)
  - If < 45 min: Non-dominant hand practice + breathing exercise
  - If no lunch break: Flag as "consider adding one" + schedule exercise post-work
- Additional breaks → Attention reset exercises inserted

---

### SCREEN 7: Peak Performance
**Visual:** A "heat map" style visualization of the day. User taps time blocks to mark them as "peak."

**Question:** "When do you need to be at your absolute sharpest?"

**UI Element:** 24h grid divided into 1-hour blocks (or 30-min for traders). User taps to toggle "peak" status. Selected blocks glow cyan. Multiple blocks can be selected.

**Examples by profession (shown as hint text):**
- Trader: "Market open 9:30-11 AM, power hour 3-4 PM"
- CEO: "Board meetings, investor calls"
- Surgeon: "Operating room blocks"
- Developer: "Deep focus coding sessions"

**What this controls:**
- Post-exercise BDNF window (exercise is scheduled 60-90 min BEFORE peak times)
- Highest-priority pomodoro blocks placed here
- No notifications during peak blocks (focus mode auto-activates)
- Caffeine timing optimized: 30-60 min before peak

---

### SCREEN 8: Current Habits
**Visual:** Quick toggles, grouped in categories. Glass card containers.

**Question:** "What do you currently do? (Be honest — no judgment)"

```
MOVEMENT
  ○ I exercise regularly (3+ times/week)
  ○ I exercise sometimes (1-2 times/week)
  ○ I rarely exercise

MINDFULNESS
  ○ I meditate regularly
  ○ I've tried meditation
  ○ Never meditated

COLD EXPOSURE
  ○ I do cold showers/plunges
  ○ I've tried it
  ○ Never / No access to cold water

CAFFEINE
  ○ No caffeine
  ○ 1-2 cups/day
  ○ 3-4 cups/day
  ○ 5+ cups/day (we need to talk)
  → When do you have your first coffee? [time picker]
  → When do you have your last coffee? [time picker]
```

**What this controls:**
- Exercise history → Level 4 exercise ramp (beginners start with walking, not running)
- Meditation experience → Level 2 starting duration (5 min for newbies, 10-15 min for experienced)
- Cold access → Level 3 protocol (cold shower vs. breathwork substitute)
- Caffeine:
  - If last coffee after 2 PM: Warning + recommendation to cut off earlier
  - Coffee time → Protocol leverages caffeine peak (place hardest work 30-60 min after first cup)
  - 5+ cups → Gradual reduction protocol added as side quest

---

### SCREEN 9: Commitment Level
**Visual:** Three tier cards, side by side (or stacked on mobile), each with increasing intensity.

**Question:** "How hard do you want to go?"

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    STANDARD      │  │   AGGRESSIVE     │  │    ELITE         │
│                  │  │                  │  │                  │
│  4 Pomodoros/day │  │  6 Pomodoros/day │  │  8 Pomodoros/day │
│  10 min meditate │  │  15 min meditate │  │  20 min meditate │
│  15 min N-Back   │  │  20 min N-Back   │  │  25 min N-Back   │
│  2x/week exercise│  │  4x/week exercise│  │  5x/week exercise│
│                  │  │                  │  │                  │
│  ~3.5 hrs/day    │  │  ~5 hrs/day      │  │  ~6.5 hrs/day    │
│  total protocol  │  │  total protocol  │  │  total protocol  │
│                  │  │                  │  │                  │
│  For those       │  │  For those       │  │  For those       │
│  starting out    │  │  ready to commit  │  │  who are all-in  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Note under all options:**
"Remember: Pomodoro blocks ARE your real work (trading, coding, managing). This isn't extra time — it's how you structure the work you're already doing."

**What this controls:**
- Number of daily pomodoro blocks
- Meditation duration at each level
- N-Back session length
- Exercise frequency
- Total daily protocol time estimate

---

### SCREEN 10: Protocol Preview (The "Holy Shit" Moment)
**Visual:** This is the money screen. After all answers are collected, the app generates the personalized protocol in real-time with a slick loading animation (neural network visualization "computing" for 2-3 seconds — this is intentional theater, the actual computation takes <100ms).

**Loading animation:**
```
Analyzing your profile...
Calculating optimal protocol...
Generating your cognitive blueprint...
```

**Then reveals:**

A beautiful, scrollable daily timeline — their EXACT personalized schedule, rendered as a vertical timeline with time markers, icons for each activity, and brief descriptions.

```
YOUR PROTOCOL — Level 1: Foundation

━━━ 5:30 AM ━━━━━━━━━━━━━━━━━━━━━━━━
☀️  MORNING ACTIVATION (5 min)
    16oz water, 10 deep breaths (4-7-8)
    Set intention for the day

━━━ 5:35 AM ━━━━━━━━━━━━━━━━━━━━━━━━
☕  COFFEE + HYDRATION CHECK
    First caffeine of the day

━━━ 6:00 AM ━━━━━━━━━━━━━━━━━━━━━━━━
🎯  DEEP WORK BLOCK 1 (2 hours)
    Pomodoro 1-4 × (25 min focus + 5 min break)
    Pre-market prep + market open

━━━ 8:00 AM ━━━━━━━━━━━━━━━━━━━━━━━━
🚶  ACTIVE BREAK (15 min)
    Walk + hydration check

━━━ 8:15 AM ━━━━━━━━━━━━━━━━━━━━━━━━
🎯  DEEP WORK BLOCK 2 (2 hours)
    Pomodoro 5-8 × (25 min focus + 5 min break)

━━━ 10:15 AM ━━━━━━━━━━━━━━━━━━━━━━━
💧  HYDRATION + BREAK

━━━ 8:00 PM ━━━━━━━━━━━━━━━━━━━━━━━━
🌙  WIND-DOWN (10 min)
    Blue light filter, journal, 4-7-8 breathing

━━━ 9:00 PM ━━━━━━━━━━━━━━━━━━━━━━━━
😴  SLEEP (8 hours)
```

**Below the timeline:**
```
21 consecutive days to complete Level 1
Miss a day → restart from Day 1

Level 2 unlocks: Meditation training
Level 3 unlocks: Working memory + cold exposure
Level 4 unlocks: Exercise optimization + bilateral training
Level 5 unlocks: Full integration mastery

[ACCEPT MISSION →]
```

**Button behavior:**
- Tap "ACCEPT MISSION" → Full-screen animation: The level 1 badge materializes with a particle effect. Haptic burst. Sound effect (optional, respects silent mode).
- Transitions to the main dashboard.

---

## 4. MAIN APP SCREENS

### 4A: DASHBOARD — "Command Center"

**Layout:** Vertical scroll, mobile-first. Bento grid on tablet/desktop.

**Top Section — Status Bar:**
```
┌──────────────────────────────────────────────┐
│  🔥 DAY 14 of 21        LEVEL 1: FOUNDATION  │
│  ████████████████░░░░░░  67% Complete         │
│                                               │
│  Streak: 14 days 🔥🔥🔥                       │
│  Next milestone: Day 21 (7 days left)         │
└──────────────────────────────────────────────┘
```

- Streak number uses odometer animation (digits roll up)
- Progress bar is a gradient fill (level color)
- Fire emojis multiply every 7 days (7d = 🔥, 14d = 🔥🔥, 21d = 🔥🔥🔥)

**Middle Section — Today's Protocol (Scrollable Timeline):**

Each protocol item is a glass card:
```
┌──────────────────────────────────────────────┐
│  ☀️  Morning Activation              5:30 AM  │
│  ────────────────────────────────────────      │
│  16oz water • 10 breaths • Set intention      │
│                                               │
│  ✅ COMPLETE                        [3:42]     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  🎯  Pomodoro Block 1               6:00 AM  │
│  ────────────────────────────────────────      │
│  4 × (25 min focus + 5 min break)             │
│                                               │
│  ⏱️ 2 of 4 complete                           │
│  █████████░░░░░░░░░  [START NEXT →]           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  🚶  Active Break                    8:00 AM  │
│  ────────────────────────────────────────      │
│  15 min walk + hydration                      │
│                                               │
│  ○ UPCOMING                                   │
└──────────────────────────────────────────────┘
```

**States:**
- ✅ COMPLETE (green check, subtle glow, card slightly dimmed)
- ⏱️ IN PROGRESS (accent border pulse, live timer)
- ○ UPCOMING (neutral, no glow)
- ⚠️ MISSED (red border, warning — but can still be completed out of order)

**Bottom Section — Quick Stats (Glass cards, horizontal scroll):**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  8/8     │ │  64 oz   │ │  14      │ │  Level 1 │
│ Pomodoros│ │  Water   │ │  Day     │ │  67%     │
│ Today    │ │  Today   │ │  Streak  │ │ Complete │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

### 4B: TIMER SCREEN — "Focus Mode"

**Activated when user starts a Pomodoro, meditation, or exercise session.**

**Visual:** Full-screen takeover. Everything else disappears. Just the timer.

**Layout:**
```
┌──────────────────────────────────────────────┐
│                                               │
│           POMODORO 3 of 8                     │
│                                               │
│                                               │
│              ┌─────────┐                      │
│              │         │                      │
│              │  18:42  │  ← Large mono font   │
│              │         │  ← Inside a circular  │
│              └─────────┘     progress ring     │
│                                               │
│           "Pre-market analysis"               │
│           (task written before starting)       │
│                                               │
│                                               │
│         [ ⏸ PAUSE ]    [ ⏭ SKIP ]            │
│                                               │
│    Task switches today: 1 (target: < 2)       │
│                                               │
└──────────────────────────────────────────────┘
```

**Timer Ring:**
- SVG circular progress, stroke-dasharray animated
- Color: Level accent color, transitions to green in last 30 sec
- Subtle pulse animation on the ring every 5 seconds (barely perceptible, keeps engagement)

**Completion:**
- Ring fills completely → brief pause → pulsing glow
- Haptic: Success pattern (three short pulses)
- Sound: Gentle chime (customizable, or silent)
- Auto-transition to break timer or next protocol item

**Break Timer (Between Pomodoros):**
- Same screen, but background shifts to a calmer shade
- Timer shows break countdown (5 min)
- Prompt: "Stand up. Stretch. Hydrate. 💧"
- Hydration check: "Did you drink water?" [Yes/No]

---

### 4C: DUAL N-BACK TRAINING SCREEN (Level 3+)

**The crown jewel feature. This is what makes the app unique.**

**Layout:**
```
┌──────────────────────────────────────────────┐
│  N-BACK LEVEL: 3          Score: 82%         │
│  Round: 14 of 20          Session: 18:30     │
│                                               │
│     ┌─────┬─────┬─────┐                      │
│     │     │     │     │                      │
│     ├─────┼─────┼─────┤                      │
│     │     │ ██  │     │  ← Position grid     │
│     ├─────┼─────┼─────┤    (3×3)             │
│     │     │     │     │                      │
│     └─────┴─────┴─────┘                      │
│                                               │
│     🔊 Audio: "K"        ← Current letter    │
│                                               │
│  ┌────────────────┐  ┌────────────────┐      │
│  │  POSITION      │  │  AUDIO         │      │
│  │  MATCH         │  │  MATCH         │      │
│  │  (same spot    │  │  (same letter  │      │
│  │   as 3 ago)    │  │   as 3 ago)    │      │
│  └────────────────┘  └────────────────┘      │
│                                               │
│  Accuracy: ████████░░ 82%                     │
│  Best today: 3-back @ 88%                    │
│  All-time best: 4-back @ 72%                 │
└──────────────────────────────────────────────┘
```

**Mechanics:**
- Blue square appears in one of 9 grid positions
- Simultaneously, a letter is spoken (audio)
- User must identify if POSITION matches N rounds ago AND/OR if AUDIO matches N rounds ago
- Tap left button for position match, right for audio match, both for dual match, neither if no match
- Adaptive difficulty: >80% accuracy for 3 consecutive sessions → advance to N+1

**Visual feedback:**
- Correct: Green flash on button + haptic
- Incorrect: Red flash + subtle shake
- Grid square: Smooth fade in/out with slight scale animation
- Score ring fills in real-time

---

### 4D: SPACED REPETITION SYSTEM (Level 3+)

**Layout:**
```
┌──────────────────────────────────────────────┐
│  REVIEW SESSION          Cards due: 23       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                               │
│  ┌────────────────────────────────────┐       │
│  │                                    │       │
│  │   What is the ideal heart rate     │       │
│  │   zone for BDNF production         │       │
│  │   during aerobic exercise?         │       │
│  │                                    │       │
│  │                                    │       │
│  │         [ TAP TO REVEAL ]          │       │
│  │                                    │       │
│  └────────────────────────────────────┘       │
│                                               │
│  Card 5 of 23          Category: Neuroscience │
│                                               │
└──────────────────────────────────────────────┘

After tap:

┌──────────────────────────────────────────────┐
│  ┌────────────────────────────────────┐       │
│  │                                    │       │
│  │   60-70% of max heart rate         │       │
│  │                                    │       │
│  │   This zone optimally increases    │       │
│  │   BDNF, which supports neuronal    │       │
│  │   survival and synaptic plasticity │       │
│  │                                    │       │
│  └────────────────────────────────────┘       │
│                                               │
│  How well did you know this?                  │
│                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ Again│ │ Hard │ │ Good │ │ Easy │        │
│  │ <1m  │ │  3d  │ │  7d  │ │ 14d  │        │
│  │  🔴  │ │  🟡  │ │  🟢  │ │  🔵  │        │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
│                                               │
│  Next review based on your rating              │
└──────────────────────────────────────────────┘
```

**Card flip animation:** 3D perspective rotate on Y-axis, 400ms, with subtle shadow shift to reinforce depth.

**Algorithm (SM-2 variant):**
```
Again → Reset interval to 1 day
Hard  → interval × 1.2
Good  → interval × 2.5
Easy  → interval × 3.5

Intervals: 1d → 3d → 7d → 14d → 30d → 60d → 120d
```

**Pre-loaded card decks:**
- Neuroscience fundamentals (how the brain learns)
- Protocol science (why each technique works)
- Trading-specific (for traders): Market structure, risk management
- Leadership-specific (for CEOs): Decision frameworks, cognitive biases
- Custom cards: User can create their own

---

### 4E: PROGRESS / ANALYTICS SCREEN

**Layout:** Scrollable dashboard with glass card widgets.

**Section 1: Level Progression**
```
┌──────────────────────────────────────────────┐
│  LEVEL PROGRESSION                            │
│                                               │
│  [1]━━━━━━[2]━━━━━━[3]━━━━━━[4]━━━━━━[5]    │
│   ✅        🔓       🔒       🔒       🔒    │
│   Done    Current   Locked   Locked   Locked  │
│                                               │
│  Level 2: ATTENTION TRAINING                  │
│  Day 5 of 21    ████████░░░░░░░░ 24%         │
│  Streak: 26 days total                        │
└──────────────────────────────────────────────┘
```

**Section 2: Weekly Cognitive Benchmark**
```
┌──────────────────────────────────────────────┐
│  COGNITIVE BENCHMARK — Week 6                │
│                                               │
│  N-Back Max:        3-back @ 84%     ↑ +12%  │
│  Breath Count:      47/50 accurate   ↑ +8    │
│  Pomodoro Rate:     94% completion   ↑ +3%   │
│  SRS Retention:     88% (312 cards)  ↑ +5%   │
│  Task Switching:    1.2 avg/pomo     ↓ -0.8  │
│                                               │
│  ┌─────────────────────────────────────┐      │
│  │         📈 Performance Trend        │      │
│  │  100│                        ╱      │      │
│  │   80│              ╱────────╱       │      │
│  │   60│      ╱──────╱                 │      │
│  │   40│ ╱───╱                         │      │
│  │   20│╱                              │      │
│  │     └─────────────────────────      │      │
│  │      W1   W2   W3   W4   W5  W6    │      │
│  └─────────────────────────────────────┘      │
│                                               │
└──────────────────────────────────────────────┘
```

**Section 3: Daily Completion History**
```
┌──────────────────────────────────────────────┐
│  DAILY HISTORY — February 2026               │
│                                               │
│  Mo Tu We Th Fr Sa Su                         │
│  ●  ●  ●  ●  ●  ●  ●   Week 1  100%        │
│  ●  ●  ●  ●  ●  ●  ●   Week 2  100%        │
│  ●  ●  ●  ●  ●  ◐  ●   Week 3   95%        │
│  ●  ●  ○  ○  ○  ○  ○   Week 4   28%        │
│                                               │
│  ● = 100% complete  ◐ = partial  ○ = missed  │
│                                               │
│  GitHub-style contribution heatmap            │
└──────────────────────────────────────────────┘
```

---

### 4F: SETTINGS / PROFILE

```
┌──────────────────────────────────────────────┐
│  PROFILE                                      │
│                                               │
│  [Avatar]  Billy R.                           │
│            Day Trader                         │
│            Level 2 • Day 26 streak            │
│                                               │
│  ─────────────────────────────────────        │
│                                               │
│  Schedule                                     │
│    Wake time: 5:30 AM                    [>]  │
│    Bedtime: 9:00 PM                      [>]  │
│    Work hours: 6:00 AM - 2:00 PM         [>]  │
│    Breaks: Coffee 5:35 AM, Lunch 12 PM   [>]  │
│                                               │
│  Protocol Intensity                           │
│    Current: Aggressive (6 pomodoros/day)  [>]  │
│                                               │
│  Notifications                                │
│    Protocol reminders         [ON]            │
│    Hydration checks           [ON]            │
│    Streak warnings            [ON]            │
│    Daily summary              [ON]            │
│    Sound effects              [OFF]           │
│                                               │
│  Integrations                                 │
│    Apple Health / Google Fit   [Connect]       │
│    Export data (CSV)           [Export]        │
│                                               │
│  Account                                      │
│    Subscription: Pro ($29/mo)  [Manage]       │
│    Reset progress              [Reset]        │
│    Delete account              [Delete]       │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 5. "TRY ME" — Interactive Website Demo

### Purpose
Before downloading the app or paying, visitors to the marketing site can experience a LIVE interactive demo of the onboarding + a sample Day 1 protocol. This is the conversion weapon.

### Technical Implementation
This is a SvelteKit route on the marketing site (SSR for SEO, then hydrates to interactive SPA). No login required. No data saved. Pure client-side experience.

### Flow

**Step 1: Landing Page Hero**
```
THE COGNITIVE PERFORMANCE
OPERATING SYSTEM

Train your brain like an elite athlete trains their body.
Evidence-based. Personalized. Unforgiving.

[TRY THE DEMO — FREE →]     [DOWNLOAD APP →]
```

- Background: Subtle particle neural network animation (Three.js or Canvas)
- Stats ticker at bottom: "18,247 protocols completed this week"
- Social proof: "Used by traders at [firms], developers at [companies]"

**Step 2: Mini Onboarding (3 questions only)**

The demo asks just 3 questions (simplified from full onboarding):

1. "What do you do?" → Profession picker
2. "When does your day start?" → Time picker
3. "How hard do you want to go?" → Standard / Aggressive / Elite

**Step 3: Live Protocol Preview**

After 3 answers, generates a sample Day 1 timeline (same as Screen 10 from onboarding). The user can scroll through it.

**Step 4: Interactive Demo Session**

The user can actually DO a sample session right in the browser:
- Start a 2-minute "demo Pomodoro" (shortened from 25 min)
- Experience the timer UI, the completion animation, the haptic-style visual feedback
- Try a 5-round Dual N-Back demo (2-back, simplified)
- Flip through 5 sample spaced repetition cards

**Step 5: Results + CTA**

After the demo:
```
YOU JUST EXPERIENCED 2% OF COGNITION OS.

The full protocol includes:
✓ 5 progressive levels over 18+ weeks
✓ Personalized daily schedules
✓ Dual N-Back adaptive training
✓ Spaced repetition with 500+ cards
✓ Cold exposure protocols
✓ Cognitive benchmarking
✓ Streak accountability (miss a day = restart)

Your brain is your #1 asset.
Stop leaving performance on the table.

[DOWNLOAD NOW — FREE 7-DAY TRIAL →]
```

### Try Me Technical Stack
```
SvelteKit 5 (SSR marketing pages + CSR interactive demo)
├── Three.js (neural network hero animation)
├── GSAP (scroll-triggered animations, timeline reveals)
├── Svelte transitions (page transitions, card flips)
├── Canvas API (timer ring, N-Back grid)
├── Web Audio API (timer chime, N-Back letter audio)
└── Tailwind CSS 4 (responsive, dark-first)
```

### SEO & Performance Targets
- Lighthouse: 95+ on all metrics
- First Contentful Paint: < 1.2s
- Time to Interactive: < 2.5s
- Core Web Vitals: All green
- Meta tags: OpenGraph, Twitter cards, structured data (SoftwareApplication schema)

---

## 6. NOTIFICATION SYSTEM

### Push Notification Strategy

**Principle:** Every notification is USEFUL. No engagement-bait. No "We miss you!" garbage. Every notification either starts a protocol session or delivers actionable information.

### Notification Types

```
PROTOCOL REMINDERS (Primary)
├── "Morning Activation in 5 min. Water ready?" (5 min before wake)
├── "Pomodoro Block 1 starts now. What's your ONE task?" (at work start)
├── "Break time. Stand up. Hydrate. 💧" (after each pomodoro)
├── "Meditation session in 5 min. Find a quiet spot." (before meditation)
├── "Time for N-Back training. 20 minutes." (before N-Back)
├── "SRS Review: 23 cards due." (at scheduled review time)
├── "Exercise time. 30 min at 60-70% HRmax." (before exercise)
├── "Wind-down protocol starts in 10 min." (60 min before bed)
└── "Blue light filter ON. Time to disconnect." (30 min before bed)

STREAK WARNINGS (Critical)
├── "⚠️ 6 hours left today. 3 tasks remaining." (6 hours before day end)
├── "🔥 Day 20 of 21. ONE MORE DAY to complete Level 1." (penultimate day)
└── "🚨 2 hours left. Don't break your 14-day streak." (2 hours before midnight)

HYDRATION (Throughout day)
├── "💧 Hydration check. Have you had water in the last hour?" (hourly)
└── "You're at 48oz of 80oz today. Keep going." (with progress)

WEEKLY REPORTS (Sunday evening)
└── "📊 Your Week 6 Cognitive Benchmark is ready. View results." (after weekly test)
```

### Smart Notification Timing
- Never during peak performance hours (user-defined)
- Respect Do Not Disturb / Focus modes
- Batch non-critical notifications (don't spam)
- Progressive urgency: First reminder is gentle, streak warnings escalate in tone
- Night shift users get time-shifted notifications

---

## 7. MONETIZATION

### Pricing Tiers

```
FREE TIER
├── Level 1 protocol only (Foundation)
├── 4 Pomodoros/day
├── Basic timer
├── No N-Back, no SRS, no analytics
├── Hydration reminders
└── 7-day trial of Pro on signup

PRO — $29/month or $249/year (save 28%)
├── All 5 levels
├── Unlimited Pomodoros
├── Full Dual N-Back training
├── Spaced repetition system (all decks)
├── Full analytics & cognitive benchmarks
├── Custom schedule adjustments
├── Priority notifications
├── Export data (CSV)
└── Cold exposure & exercise protocols

TEAM — $24/user/month (5+ users)
├── Everything in Pro
├── Team leaderboard (opt-in)
├── Manager dashboard (aggregate, anonymous)
├── Bulk onboarding
└── Slack/Teams integration for accountability
```

### Revenue Projections (Conservative)
```
Year 1 Target: 5,000 paid users
├── 70% monthly ($29) = 3,500 × $29 = $101,500/mo
├── 30% annual ($249) = 1,500 × $249/12 = $31,125/mo
└── Total MRR: ~$132,625 → $1.59M ARR

Year 2 Target: 15,000 paid users → ~$4.77M ARR
```

---

## 8. DATABASE SCHEMA (Key Tables)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  profession TEXT, -- 'day_trader', 'ceo', 'developer', etc.
  schedule_type TEXT, -- 'fixed', 'flexible', 'night', 'split'
  commitment_level TEXT, -- 'standard', 'aggressive', 'elite'
  timezone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Profile
CREATE TABLE user_profiles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wake_time TIME,
  bed_time TIME,
  sleep_hours DECIMAL(3,1),
  work_start TIME,
  work_end TIME,
  work_hours DECIMAL(3,1),
  coffee_break_time TIME,
  lunch_break_time TIME,
  lunch_duration_min INT,
  peak_hours JSONB, -- array of {start, end} objects
  exercise_level TEXT, -- 'regular', 'sometimes', 'rarely'
  meditation_level TEXT, -- 'regular', 'tried', 'never'
  cold_exposure_level TEXT, -- 'regular', 'tried', 'never'
  caffeine_cups INT,
  first_coffee_time TIME,
  last_coffee_time TIME,
  PRIMARY KEY (user_id)
);

-- Generated Protocol Schedule
CREATE TABLE protocol_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  level INT NOT NULL, -- 1-5
  schedule JSONB NOT NULL, -- Array of {time, type, duration, details}
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Progress
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  level INT NOT NULL,
  day_in_level INT NOT NULL, -- 1-21 or 1-28
  completed BOOLEAN DEFAULT FALSE,
  completion_pct DECIMAL(5,2),
  pomodoros_completed INT DEFAULT 0,
  pomodoros_target INT,
  meditation_minutes INT DEFAULT 0,
  nback_sessions INT DEFAULT 0,
  nback_max_level INT,
  nback_accuracy DECIMAL(5,2),
  srs_cards_reviewed INT DEFAULT 0,
  srs_accuracy DECIMAL(5,2),
  exercise_minutes INT DEFAULT 0,
  exercise_type TEXT,
  cold_exposure_seconds INT DEFAULT 0,
  water_oz INT DEFAULT 0,
  task_switches_avg DECIMAL(3,1),
  UNIQUE(user_id, date)
);

-- Streak Tracking
CREATE TABLE streaks (
  user_id UUID REFERENCES users(id),
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  current_level INT DEFAULT 1,
  day_in_level INT DEFAULT 1,
  level_start_date DATE,
  last_completed_date DATE,
  total_restarts INT DEFAULT 0,
  PRIMARY KEY (user_id)
);

-- Spaced Repetition Cards
CREATE TABLE srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  deck TEXT NOT NULL, -- 'neuroscience', 'trading', 'custom', etc.
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  interval_days INT DEFAULT 1,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  next_review DATE,
  last_reviewed TIMESTAMPTZ,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- N-Back Scores
CREATE TABLE nback_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_date TIMESTAMPTZ DEFAULT NOW(),
  n_level INT NOT NULL, -- 2, 3, 4, 5...
  accuracy DECIMAL(5,2),
  rounds INT,
  duration_seconds INT,
  position_accuracy DECIMAL(5,2),
  audio_accuracy DECIMAL(5,2)
);

-- Cognitive Benchmarks (Weekly)
CREATE TABLE cognitive_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  week_number INT,
  benchmark_date DATE,
  nback_max_level INT,
  nback_max_accuracy DECIMAL(5,2),
  breath_count_score INT, -- out of 50
  stroop_score DECIMAL(5,2),
  pomodoro_completion_rate DECIMAL(5,2),
  srs_retention_rate DECIMAL(5,2),
  total_active_cards INT
);

-- Subscriptions
CREATE TABLE subscriptions (
  user_id UUID REFERENCES users(id),
  plan TEXT NOT NULL, -- 'free', 'pro', 'team'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT, -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  PRIMARY KEY (user_id)
);
```

---

## 9. API ROUTES (Rust/Axum)

```
Authentication
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh
  POST   /api/auth/logout
  POST   /api/auth/forgot-password
  POST   /api/auth/reset-password
  GET    /api/auth/me

Onboarding
  POST   /api/onboarding/profile        (save onboarding answers)
  PUT    /api/onboarding/profile        (update answers later)
  POST   /api/onboarding/generate       (generate protocol from answers)

Protocol
  GET    /api/protocol/schedule          (get today's schedule)
  GET    /api/protocol/schedule/:date    (get schedule for specific date)
  POST   /api/protocol/session/start     (start a session: pomodoro, meditation, etc.)
  POST   /api/protocol/session/complete  (complete a session)
  POST   /api/protocol/session/skip      (skip a session with reason)
  GET    /api/protocol/progress          (daily progress summary)

Streak
  GET    /api/streak                     (current streak data)
  POST   /api/streak/check               (end-of-day streak check)
  GET    /api/streak/history             (historical streak data)

N-Back
  POST   /api/nback/session              (save N-Back session results)
  GET    /api/nback/history              (N-Back score history)
  GET    /api/nback/stats                (aggregate stats)

Spaced Repetition
  GET    /api/srs/due                    (get cards due for review)
  POST   /api/srs/review                 (submit review rating)
  POST   /api/srs/cards                  (create custom card)
  PUT    /api/srs/cards/:id              (edit card)
  DELETE /api/srs/cards/:id              (delete card)
  GET    /api/srs/decks                  (list available decks)
  GET    /api/srs/stats                  (retention stats)

Analytics
  GET    /api/analytics/daily/:date      (daily report)
  GET    /api/analytics/weekly/:week     (weekly benchmark report)
  GET    /api/analytics/trends           (trend data for charts)
  GET    /api/analytics/export           (CSV export)

Settings
  GET    /api/settings                   (all user settings)
  PUT    /api/settings/schedule          (update schedule)
  PUT    /api/settings/notifications     (update notification prefs)
  PUT    /api/settings/intensity         (change commitment level)

Billing
  POST   /api/billing/create-checkout    (Stripe checkout session)
  POST   /api/billing/webhook            (Stripe webhook handler)
  GET    /api/billing/subscription       (current subscription)
  POST   /api/billing/cancel             (cancel subscription)
```

---

## 10. PROJECT STRUCTURE (SvelteKit)

```
cognition-os/
├── src/
│   ├── app.html
│   ├── app.css                    (global styles, CSS variables)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── GlassCard.svelte
│   │   │   │   ├── ProgressRing.svelte
│   │   │   │   ├── TimePicker.svelte
│   │   │   │   ├── Slider.svelte
│   │   │   │   ├── Toggle.svelte
│   │   │   │   ├── Badge.svelte
│   │   │   │   ├── Toast.svelte
│   │   │   │   └── Modal.svelte
│   │   │   ├── onboarding/
│   │   │   │   ├── ProfessionPicker.svelte
│   │   │   │   ├── ScheduleType.svelte
│   │   │   │   ├── WakeTimePicker.svelte
│   │   │   │   ├── SleepSlider.svelte
│   │   │   │   ├── WorkHoursSelector.svelte
│   │   │   │   ├── BreakConfig.svelte
│   │   │   │   ├── PeakHoursMap.svelte
│   │   │   │   ├── HabitsAssessment.svelte
│   │   │   │   ├── CommitmentLevel.svelte
│   │   │   │   └── ProtocolPreview.svelte
│   │   │   ├── dashboard/
│   │   │   │   ├── StatusBar.svelte
│   │   │   │   ├── ProtocolTimeline.svelte
│   │   │   │   ├── QuickStats.svelte
│   │   │   │   ├── StreakCounter.svelte
│   │   │   │   └── LevelProgress.svelte
│   │   │   ├── timer/
│   │   │   │   ├── PomodoroTimer.svelte
│   │   │   │   ├── MeditationTimer.svelte
│   │   │   │   ├── ExerciseTimer.svelte
│   │   │   │   ├── ColdExposureTimer.svelte
│   │   │   │   ├── TimerRing.svelte
│   │   │   │   └── BreakScreen.svelte
│   │   │   ├── nback/
│   │   │   │   ├── NBackGame.svelte
│   │   │   │   ├── NBackGrid.svelte
│   │   │   │   ├── NBackControls.svelte
│   │   │   │   └── NBackResults.svelte
│   │   │   ├── srs/
│   │   │   │   ├── FlashCard.svelte
│   │   │   │   ├── ReviewSession.svelte
│   │   │   │   ├── CardEditor.svelte
│   │   │   │   ├── DeckBrowser.svelte
│   │   │   │   └── RatingButtons.svelte
│   │   │   ├── analytics/
│   │   │   │   ├── PerformanceTrend.svelte
│   │   │   │   ├── WeeklyBenchmark.svelte
│   │   │   │   ├── CompletionCalendar.svelte
│   │   │   │   ├── NBackChart.svelte
│   │   │   │   └── SRSStats.svelte
│   │   │   ├── marketing/
│   │   │   │   ├── Hero.svelte
│   │   │   │   ├── NeuralNetworkBg.svelte
│   │   │   │   ├── FeatureShowcase.svelte
│   │   │   │   ├── TestimonialCarousel.svelte
│   │   │   │   ├── PricingCards.svelte
│   │   │   │   └── DemoWidget.svelte
│   │   │   └── layout/
│   │   │       ├── NavBar.svelte
│   │   │       ├── BottomNav.svelte
│   │   │       ├── Sidebar.svelte
│   │   │       └── PageTransition.svelte
│   │   ├── stores/
│   │   │   ├── auth.svelte.ts         (auth state with runes)
│   │   │   ├── protocol.svelte.ts     (daily protocol state)
│   │   │   ├── streak.svelte.ts       (streak tracking)
│   │   │   ├── timer.svelte.ts        (active timer state)
│   │   │   ├── nback.svelte.ts        (N-Back game state)
│   │   │   ├── srs.svelte.ts          (spaced repetition state)
│   │   │   ├── notifications.svelte.ts
│   │   │   └── settings.svelte.ts
│   │   ├── utils/
│   │   │   ├── api.ts                 (API client, fetch wrapper)
│   │   │   ├── protocol-engine.ts     (schedule generation logic)
│   │   │   ├── srs-algorithm.ts       (SM-2 spaced repetition)
│   │   │   ├── nback-engine.ts        (N-Back game logic)
│   │   │   ├── time.ts                (time formatting, timezone)
│   │   │   ├── haptics.ts             (Capacitor haptics wrapper)
│   │   │   ├── notifications.ts       (push notification handler)
│   │   │   ├── audio.ts               (sound effects manager)
│   │   │   └── analytics.ts           (PostHog event tracking)
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── protocol.ts
│   │   │   ├── nback.ts
│   │   │   ├── srs.ts
│   │   │   └── analytics.ts
│   │   └── constants/
│   │       ├── levels.ts              (level definitions, requirements)
│   │       ├── srs-decks.ts           (pre-loaded card content)
│   │       └── nback-config.ts        (N-Back difficulty settings)
│   ├── routes/
│   │   ├── +layout.svelte             (root layout, nav, auth guard)
│   │   ├── +page.svelte               (marketing landing page)
│   │   ├── (marketing)/
│   │   │   ├── pricing/+page.svelte
│   │   │   ├── science/+page.svelte   (the research behind it)
│   │   │   ├── demo/+page.svelte      (interactive Try Me demo)
│   │   │   └── blog/+page.svelte
│   │   ├── (auth)/
│   │   │   ├── login/+page.svelte
│   │   │   ├── register/+page.svelte
│   │   │   └── forgot-password/+page.svelte
│   │   ├── onboarding/
│   │   │   ├── +layout.svelte         (onboarding layout, progress bar)
│   │   │   ├── +page.svelte           (splash/start)
│   │   │   ├── identity/+page.svelte
│   │   │   ├── schedule/+page.svelte
│   │   │   ├── wake-time/+page.svelte
│   │   │   ├── sleep/+page.svelte
│   │   │   ├── work-hours/+page.svelte
│   │   │   ├── breaks/+page.svelte
│   │   │   ├── peak-hours/+page.svelte
│   │   │   ├── habits/+page.svelte
│   │   │   ├── commitment/+page.svelte
│   │   │   └── preview/+page.svelte   (protocol reveal)
│   │   └── app/
│   │       ├── +layout.svelte         (app shell, bottom nav, auth guard)
│   │       ├── +page.svelte           (dashboard / command center)
│   │       ├── timer/+page.svelte     (active timer screen)
│   │       ├── nback/+page.svelte     (Dual N-Back training)
│   │       ├── review/+page.svelte    (Spaced Repetition session)
│   │       ├── progress/+page.svelte  (analytics dashboard)
│   │       ├── cards/+page.svelte     (manage SRS cards)
│   │       └── settings/+page.svelte  (profile & settings)
│   └── service-worker.ts             (PWA offline support)
├── static/
│   ├── manifest.json                  (PWA manifest)
│   ├── icons/                         (app icons, various sizes)
│   ├── sounds/                        (timer chimes, completion sounds)
│   └── fonts/                         (Inter, JetBrains Mono)
├── capacitor.config.ts                (Capacitor configuration)
├── svelte.config.js                   (SvelteKit config)
├── tailwind.config.ts                 (Tailwind with custom theme)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 11. PROTOCOL ENGINE — Schedule Generation Algorithm

The heart of the app. This is the algorithm that takes onboarding answers and produces a personalized daily protocol.

```typescript
// src/lib/utils/protocol-engine.ts

interface UserProfile {
  profession: string;
  scheduleType: 'fixed' | 'flexible' | 'night' | 'split';
  wakeTime: string;        // "05:30"
  bedTime: string;         // "21:00"
  sleepHours: number;
  workStart: string;
  workEnd: string;
  coffeeBreakTime?: string;
  lunchBreakTime?: string;
  lunchDurationMin?: number;
  peakHours: { start: string; end: string }[];
  exerciseLevel: 'regular' | 'sometimes' | 'rarely';
  meditationLevel: 'regular' | 'tried' | 'never';
  coldExposureLevel: 'regular' | 'tried' | 'never';
  caffeineCups: number;
  firstCoffeeTime?: string;
  commitmentLevel: 'standard' | 'aggressive' | 'elite';
}

interface ProtocolItem {
  time: string;           // "05:30" or "wake+0"
  type: string;           // 'activation', 'pomodoro', 'meditation', etc.
  duration: number;       // minutes
  title: string;
  description: string;
  icon: string;
  level: number;          // minimum level required (1-5)
  required: boolean;      // counts toward daily completion
}

function generateProtocol(profile: UserProfile, currentLevel: number): ProtocolItem[] {
  const schedule: ProtocolItem[] = [];
  const isFixed = profile.scheduleType === 'fixed';

  // STEP 1: Morning Activation (always first, all levels)
  schedule.push({
    time: isFixed ? profile.wakeTime : 'wake+0',
    type: 'activation',
    duration: 5,
    title: 'Morning Activation',
    description: '16oz water, 10 deep breaths (4-7-8), set intention',
    icon: '☀️',
    level: 1,
    required: true
  });

  // STEP 2: Cold Exposure (Level 3+, immediately after activation)
  if (currentLevel >= 3 && profile.coldExposureLevel !== 'never') {
    const coldDuration = currentLevel === 3 ? 2 : 3; // Progressive
    schedule.push({
      time: isFixed ? addMinutes(profile.wakeTime, 5) : 'wake+5',
      type: 'cold_exposure',
      duration: coldDuration,
      title: 'Cold Exposure',
      description: `${coldDuration} min cold shower. Breathe through it.`,
      icon: '🧊',
      level: 3,
      required: true
    });
  }

  // STEP 3: Meditation (Level 2+)
  if (currentLevel >= 2) {
    const medDuration = getMeditationDuration(profile, currentLevel);
    const medOffset = currentLevel >= 3 ? 8 : 5; // After cold if Level 3+
    schedule.push({
      time: isFixed ? addMinutes(profile.wakeTime, medOffset) : `wake+${medOffset}`,
      type: 'meditation',
      duration: medDuration,
      title: 'Meditation',
      description: getMeditationDescription(currentLevel),
      icon: '🧘',
      level: 2,
      required: true
    });
  }

  // STEP 4: Exercise (Level 4+, before peak hours for BDNF)
  if (currentLevel >= 4) {
    const exerciseTime = calculateExerciseSlot(profile);
    schedule.push({
      time: exerciseTime,
      type: 'exercise',
      duration: 30,
      title: 'Aerobic Exercise',
      description: '30 min at 60-70% HRmax. Walk, jog, cycle, or swim.',
      icon: '🏃',
      level: 4,
      required: true
    });
  }

  // STEP 5: N-Back Training (Level 3+)
  if (currentLevel >= 3) {
    const nbackDuration = currentLevel >= 4 ? 25 : 20;
    // Place before first pomodoro block
    schedule.push({
      time: calculatePreWorkSlot(profile, 'nback'),
      type: 'nback',
      duration: nbackDuration,
      title: 'Dual N-Back Training',
      description: `${nbackDuration} min adaptive training`,
      icon: '🧠',
      level: 3,
      required: true
    });
  }

  // STEP 6: SRS Review (Level 3+, morning session)
  if (currentLevel >= 3) {
    schedule.push({
      time: calculatePreWorkSlot(profile, 'srs'),
      type: 'srs_review',
      duration: 15,
      title: 'Spaced Repetition Review',
      description: 'Review due cards',
      icon: '📚',
      level: 3,
      required: true
    });
  }

  // STEP 7: Pomodoro Blocks (All levels — this IS their work)
  const pomodoroCount = getPomodoroCount(profile);
  const pomodoroBlocks = distributePomodorosAcrossDay(profile, pomodoroCount, currentLevel);
  schedule.push(...pomodoroBlocks);

  // STEP 8: Break activities (inserted between pomodoro blocks)
  const breakActivities = generateBreakActivities(profile, currentLevel);
  schedule.push(...breakActivities);

  // STEP 9: Non-dominant hand practice (Level 4+)
  if (currentLevel >= 4) {
    schedule.push({
      time: profile.lunchBreakTime || calculateMidDaySlot(profile),
      type: 'non_dominant',
      duration: 10,
      title: 'Non-Dominant Hand Practice',
      description: 'Writing, daily tasks with non-dominant hand',
      icon: '✋',
      level: 4,
      required: true
    });
  }

  // STEP 10: Evening Consolidation
  schedule.push({
    time: isFixed ? subtractMinutes(profile.bedTime, 60) : 'sleep-60',
    type: 'consolidation',
    duration: currentLevel >= 5 ? 30 : currentLevel >= 3 ? 15 : 10,
    title: 'Evening Consolidation',
    description: getConsolidationDescription(currentLevel),
    icon: '📝',
    level: 1,
    required: true
  });

  // STEP 11: Wind-down
  schedule.push({
    time: isFixed ? subtractMinutes(profile.bedTime, 30) : 'sleep-30',
    type: 'winddown',
    duration: 15,
    title: 'Wind-Down',
    description: 'Blue light filter, light reading, 4-7-8 breathing',
    icon: '🌙',
    level: 1,
    required: true
  });

  // Sort by time and return
  return schedule.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}
```

---

## 12. STREAK ENFORCEMENT LOGIC

```typescript
// This runs at midnight (user's timezone) via cron job
// OR when user opens app the next day

async function enforceStreak(userId: string): Promise<void> {
  const streak = await getStreak(userId);
  const yesterday = getYesterday(userId); // timezone-aware
  const dailyLog = await getDailyLog(userId, yesterday);

  // Check if yesterday was completed (90%+ completion required)
  const isComplete = dailyLog && dailyLog.completion_pct >= 90;

  if (isComplete) {
    // Streak continues
    streak.current_streak += 1;
    streak.day_in_level += 1;

    if (streak.current_streak > streak.longest_streak) {
      streak.longest_streak = streak.current_streak;
    }

    // Check for level completion
    const daysRequired = getLevelDays(streak.current_level); // L1-2: 21, L3-5: 28
    if (streak.day_in_level >= daysRequired) {
      // LEVEL UP!
      if (streak.current_level < 5) {
        streak.current_level += 1;
        streak.day_in_level = 0;
        streak.level_start_date = today();

        // Trigger level-up notification + celebration
        await triggerLevelUp(userId, streak.current_level);
      }
    }
  } else {
    // STREAK BROKEN — restart current level
    const previousStreak = streak.current_streak;
    streak.current_streak = 0;
    streak.day_in_level = 0;
    streak.level_start_date = today();
    streak.total_restarts += 1;

    // Trigger streak-break notification
    await triggerStreakBreak(userId, previousStreak, streak.current_level);

    // NOTE: current_level does NOT reset.
    // They restart the CURRENT level, not go back to Level 1.
    // Going back to Level 1 would be too punishing and cause churn.
  }

  streak.last_completed_date = isComplete ? yesterday : streak.last_completed_date;
  await saveStreak(streak);
}
```

---

## 13. LAUNCH CHECKLIST

```
PRE-LAUNCH
□ Landing page live with "Try Me" demo
□ App Store developer accounts (Apple + Google)
□ TestFlight beta with 50 users
□ Stripe billing integration tested
□ Push notification infrastructure verified
□ Privacy policy + Terms of Service
□ GDPR compliance (data export, deletion)
□ App Store screenshots + preview video
□ ASO (App Store Optimization) keywords
□ Social proof: beta tester testimonials

LAUNCH WEEK
□ Product Hunt launch
□ Twitter/X announcement thread
□ Reddit: r/productivity, r/nootropics, r/daytrading
□ Direct outreach to trading communities
□ Content: "The Science Behind Cognition OS" blog post
□ YouTube demo walkthrough
□ Podcast guest pitches (productivity, trading, biohacking)

POST-LAUNCH
□ Monitor crash reports (Sentry)
□ User feedback loop (in-app feedback button)
□ A/B test onboarding flow conversion
□ Iterate on pricing based on conversion data
□ Weekly content: Science-backed tips (blog + email)
□ Community: Discord server for users
□ Feature: Team leaderboard (drive viral growth)
```

---

*Built for high-performers. Backed by science. No mercy on missed days.*

*COGNITION OS — Because your brain is your #1 asset.*
