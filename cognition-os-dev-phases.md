# COGNITION OS — Development Phases for Claude Code

## MASTER CONTEXT (Include at the start of EVERY Claude Code session)

```
You are building "Cognition OS" — a cognitive performance app for high-performers (traders, CEOs, developers). 

STACK:
- Frontend: SvelteKit 5 (Svelte 5 runes), TypeScript strict, Tailwind CSS 4, GSAP 3
- Mobile: Capacitor 6 (iOS + Android + PWA from single codebase)
- Backend: Rust/Axum (separate repo, Phase 7+)
- Database: PostgreSQL (Neon) + Redis (Upstash)
- Auth: JWT + refresh tokens
- Payments: Stripe
- Deploy: Cloudflare Pages (frontend), Fly.io (backend)
- Package Manager: pnpm

STANDARDS — Apple Principal Engineer ICT Level 7:
- TypeScript strict mode, no `any` types, no `as` casts except proven safe
- Every component: JSDoc on exports, $props() with defaults, error boundaries
- Every function: Single responsibility, <30 lines, pure where possible
- Every store: Svelte 5 runes ($state, $derived, $effect), no legacy stores
- Zero runtime errors in production — all edge cases handled
- Accessibility: WCAG 2.1 AA minimum (aria labels, keyboard nav, focus management)
- Performance: <100ms interaction response, <3s initial load, 60fps animations
- Mobile-first: All layouts designed for 375px minimum, scale up
- Error handling: Every async operation wrapped in try/catch with user-facing feedback
- No inline styles. No magic numbers. No hardcoded strings (use constants).
- File naming: kebab-case for files, PascalCase for components
- Imports: Absolute paths via $lib alias
- Git: Conventional commits (feat:, fix:, refactor:, docs:, test:)

DESIGN SYSTEM — "Obsidian Intelligence":
- Dark-first (bg: #0A0A0F, cards: #12121A, elevated: #1A1A2E)
- Accent: Electric Cyan #00D4FF
- Success: #00FF88, Warning: #FFB800, Danger: #FF3366
- Glassmorphism: rgba(255,255,255,0.03) bg, blur(20px), 1px border rgba(255,255,255,0.08)
- Typography: Inter (UI), JetBrains Mono (data/numbers)
- Motion: 200-300ms ease-out, spring-based where possible
- Border radius: 8px (buttons), 12px (inputs), 16px (cards), 20px (modals), 9999px (pills)
- Spacing: 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)

LEVEL COLORS (use throughout for level-specific theming):
- Level 1: #4A90D9 (Foundation - Blue)
- Level 2: #7C4DFF (Attention - Purple)
- Level 3: #00BFA5 (Memory - Teal)
- Level 4: #FF6D00 (Advanced - Orange)
- Level 5: #FFD700 (Mastery - Gold)
```

---

## PHASE 0: Project Scaffolding & Design System Foundation
**Estimated time: 2-3 hours**
**Dependencies: None**

### Claude Code Prompt:

```
PHASE 0: Scaffold the Cognition OS project and establish the design system foundation.

## Step 1: Create SvelteKit project
pnpm create svelte@latest cognition-os
- Select: Skeleton project
- TypeScript: Yes
- ESLint: Yes
- Prettier: Yes
- Vitest: Yes

cd cognition-os

## Step 2: Install dependencies
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add gsap lucide-svelte chart.js
pnpm add -D @sveltejs/adapter-static

## Step 3: Configure Tailwind
In vite.config.ts, add the Tailwind plugin:

import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});

In src/app.css, add:
@import 'tailwindcss';

## Step 4: Create the complete design system as CSS custom properties

Create src/app.css with ALL design tokens defined as CSS custom properties.
Include:
- All colors from the design system (bg, text, accent, semantic, level colors)
- All spacing values (--space-1 through --space-16)
- All border-radius values
- All font sizes
- All shadow definitions (glass-card, glass-card-elevated, etc.)
- Glassmorphism utility classes (.glass-card, .glass-card-elevated)
- Transition utilities (.transition-fast, .transition-base, .transition-slow)
- A dark scrollbar style
- Selection color (accent)

Also extend Tailwind via @theme in app.css:
@theme {
  --color-bg-primary: #0A0A0F;
  --color-bg-secondary: #12121A;
  --color-bg-tertiary: #1A1A2E;
  --color-accent: #00D4FF;
  --color-accent-secondary: #0099CC;
  --color-success: #00FF88;
  --color-warning: #FFB800;
  --color-danger: #FF3366;
  --color-info: #6C63FF;
  --color-level-1: #4A90D9;
  --color-level-2: #7C4DFF;
  --color-level-3: #00BFA5;
  --color-level-4: #FF6D00;
  --color-level-5: #FFD700;
  --color-text-primary: #F0F0F5;
  --color-text-secondary: #8888A0;
  --color-text-tertiary: #4A4A60;
  --font-display: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

## Step 5: Create the base layout

Create src/routes/+layout.svelte:
- Import app.css
- Set <html> and <body> to dark bg, Inter font
- Add a <slot /> wrapped in a main container
- Preload Inter and JetBrains Mono fonts (use Google Fonts CDN links in app.html <head>)

## Step 6: Create the project file structure (empty files/folders)

src/lib/
├── components/
│   ├── ui/           (Button, GlassCard, ProgressRing, etc.)
│   ├── onboarding/   (each onboarding screen component)
│   ├── dashboard/    (dashboard widgets)
│   ├── timer/        (timer components)
│   ├── nback/        (N-Back game components)
│   ├── srs/          (spaced repetition components)
│   ├── analytics/    (chart/stats components)
│   ├── marketing/    (landing page components)
│   └── layout/       (nav, sidebar, page transitions)
├── stores/           (.svelte.ts files using runes)
├── utils/            (pure utility functions)
├── types/            (TypeScript type definitions)
└── constants/        (app constants, level definitions)

## Step 7: Create the type definitions

Create src/lib/types/index.ts with ALL types:

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  profession: Profession;
  scheduleType: ScheduleType;
  commitmentLevel: CommitmentLevel;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export type Profession = 
  | 'day_trader' | 'swing_trader' | 'ceo' | 'developer' 
  | 'lawyer' | 'medical' | 'student' | 'other';

export type ScheduleType = 'fixed' | 'flexible' | 'night' | 'split';
export type CommitmentLevel = 'standard' | 'aggressive' | 'elite';

export interface UserProfile {
  userId: string;
  wakeTime: string;
  bedTime: string;
  sleepHours: number;
  workStart: string;
  workEnd: string;
  workHours: number;
  coffeeBreakTime?: string;
  lunchBreakTime?: string;
  lunchDurationMin?: number;
  peakHours: TimeRange[];
  exerciseLevel: 'regular' | 'sometimes' | 'rarely';
  meditationLevel: 'regular' | 'tried' | 'never';
  coldExposureLevel: 'regular' | 'tried' | 'never';
  caffeineCups: number;
  firstCoffeeTime?: string;
  lastCoffeeTime?: string;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface ProtocolItem {
  id: string;
  time: string;
  type: ProtocolItemType;
  duration: number;
  title: string;
  description: string;
  icon: string;
  level: number;
  required: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'missed' | 'skipped';
}

export type ProtocolItemType = 
  | 'activation' | 'cold_exposure' | 'meditation' | 'exercise'
  | 'nback' | 'srs_review' | 'pomodoro' | 'break' | 'hydration'
  | 'non_dominant' | 'visualization' | 'consolidation' | 'winddown';

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  currentLevel: number;
  dayInLevel: number;
  levelStartDate: string;
  lastCompletedDate?: string;
  totalRestarts: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  level: number;
  dayInLevel: number;
  completed: boolean;
  completionPct: number;
  pomodorosCompleted: number;
  pomodorosTarget: number;
  meditationMinutes: number;
  nbackSessions: number;
  nbackMaxLevel: number;
  nbackAccuracy: number;
  srsCardsReviewed: number;
  srsAccuracy: number;
  exerciseMinutes: number;
  coldExposureSeconds: number;
  waterOz: number;
  taskSwitchesAvg: number;
}

export interface SRSCard {
  id: string;
  userId: string;
  deck: string;
  front: string;
  back: string;
  intervalDays: number;
  easeFactor: number;
  nextReview: string;
  lastReviewed?: string;
  reviewCount: number;
}

export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface NBackScore {
  id: string;
  userId: string;
  sessionDate: string;
  nLevel: number;
  accuracy: number;
  rounds: number;
  durationSeconds: number;
  positionAccuracy: number;
  audioAccuracy: number;
}

export interface CognitiveBenchmark {
  id: string;
  userId: string;
  weekNumber: number;
  benchmarkDate: string;
  nbackMaxLevel: number;
  nbackMaxAccuracy: number;
  breathCountScore: number;
  stroopScore: number;
  pomodoroCompletionRate: number;
  srsRetentionRate: number;
  totalActiveCards: number;
}

export interface OnboardingState {
  step: number;
  profession?: Profession;
  scheduleType?: ScheduleType;
  wakeTime?: string;
  bedTime?: string;
  sleepHours?: number;
  workStart?: string;
  workEnd?: string;
  workHours?: number;
  coffeeBreakTime?: string;
  lunchBreakTime?: string;
  lunchDurationMin?: number;
  peakHours?: TimeRange[];
  exerciseLevel?: 'regular' | 'sometimes' | 'rarely';
  meditationLevel?: 'regular' | 'tried' | 'never';
  coldExposureLevel?: 'regular' | 'tried' | 'never';
  caffeineCups?: number;
  firstCoffeeTime?: string;
  lastCoffeeTime?: string;
  commitmentLevel?: CommitmentLevel;
}

## Step 8: Create constants

Create src/lib/constants/levels.ts:
- Export LEVEL_CONFIG: Record of level 1-5 with:
  - name, color, daysRequired, description
  - Requirements for each level (pomodoros, meditation duration, nback level, etc.)
  - Unlock criteria

Create src/lib/constants/protocol.ts:
- POMODORO_DURATION: 25 (minutes)
- BREAK_DURATION: 5
- LONG_BREAK_DURATION: 15
- POMODOROS_PER_BLOCK: 4
- Commitment level configs (standard/aggressive/elite with pomodoro counts, etc.)

## Step 9: Verify everything compiles
pnpm check
pnpm build

Every file must pass TypeScript strict mode with zero errors.
```

### Acceptance Criteria:
- [ ] `pnpm dev` runs without errors
- [ ] `pnpm check` passes with zero TypeScript errors  
- [ ] `pnpm build` produces a valid build
- [ ] All CSS custom properties render correctly (check with browser devtools)
- [ ] Glassmorphism classes produce correct visual effect
- [ ] All type definitions compile
- [ ] File structure matches spec exactly
- [ ] Tailwind classes work with custom theme colors

---

## PHASE 1: Core UI Component Library
**Estimated time: 4-6 hours**
**Dependencies: Phase 0**

### Claude Code Prompt:

```
PHASE 1: Build the core UI component library for Cognition OS.

[PASTE MASTER CONTEXT HERE]

All components go in src/lib/components/ui/. Every component MUST:
- Use Svelte 5 runes ($props, $state, $derived)
- Accept a `class` prop for style overrides (use {@render} or class merging)
- Have TypeScript types for all props
- Handle all states (default, hover, active, disabled, loading, error)
- Be keyboard accessible
- Use design system tokens (no hardcoded colors/sizes)

Build these components in this exact order:

### 1. Button.svelte
Props: variant ('primary' | 'secondary' | 'ghost' | 'danger'), size ('sm' | 'md' | 'lg'), disabled, loading, fullWidth, type, onclick
- Primary: bg accent, text dark, hover brightness
- Secondary: glass-card bg, accent border, accent text
- Ghost: transparent, text-secondary, hover bg-tertiary
- Danger: bg danger
- Loading state: spinner SVG replaces text, disabled interaction
- Disabled: opacity 50%, cursor-not-allowed
- Press animation: scale(0.97) on active
- Focus: 2px accent ring with 2px offset

### 2. GlassCard.svelte  
Props: variant ('default' | 'elevated' | 'interactive'), padding ('sm' | 'md' | 'lg'), class
- default: glass-card styles from CSS
- elevated: glass-card-elevated
- interactive: adds hover:scale-[1.01], cursor-pointer, transition
- Renders children via {@render children()}
- Must support nesting

### 3. ProgressRing.svelte
Props: progress (0-100), size (number, default 120), strokeWidth (number, default 8), color (string, default accent), showLabel (boolean), label (string)
- SVG circle with stroke-dasharray animation
- Background track circle (bg-tertiary, 20% opacity)
- Foreground progress circle (animated, rounded linecap)
- Optional center label (percentage or custom text)
- Smooth transition when progress changes (CSS transition on stroke-dashoffset)
- Color prop accepts any CSS color or level color variable

### 4. TimePicker.svelte
Props: value (string "HH:MM"), onchange, label, showPeriod (12h/24h toggle)
- Circular clock face design (NOT a boring dropdown)
- Dark background circle with hour markers
- Draggable hour hand (touch + mouse events)
- Inner ring for minutes (tap to set)
- Glowing cyan indicator at selected time
- Digital display below: "5:30 AM" 
- Handle touch events for mobile (touchstart, touchmove, touchend)
- Debounce rapid changes

### 5. Slider.svelte
Props: min, max, step, value, onchange, label, showValue, formatValue (function), trackColorFn (function that returns color based on value)
- Custom styled range input (hide default appearance)
- Track: rounded, bg-tertiary
- Fill: gradient or solid color (controlled by trackColorFn)
- Thumb: 20px circle, accent color, shadow, scale on drag
- Value label appears above thumb on drag
- Touch-optimized (44px minimum hit target)

### 6. Toggle.svelte
Props: checked, onchange, label, description, disabled
- Pill-shaped track (40px × 22px)
- Sliding circle thumb (18px)
- Off: bg-tertiary track
- On: accent bg track, thumb slides right
- Spring animation on toggle (not linear)
- Label and optional description text beside it

### 7. Badge.svelte
Props: variant ('default' | 'success' | 'warning' | 'danger' | 'info' | 'level'), level (1-5), size ('sm' | 'md'), label
- Pill-shaped
- Variant colors from design system
- 'level' variant uses level colors based on level prop
- Subtle glow on level badge

### 8. Toast.svelte + toast store
Create src/lib/stores/toast.svelte.ts:
- $state array of toasts
- addToast(message, type, duration) function
- removeToast(id) function
- Auto-remove after duration (default 4000ms)

Toast.svelte:
- Fixed position bottom-center (mobile) or bottom-right (desktop)
- Glass card background
- Icon + message + close button
- Slide-up entrance, fade-out exit (Svelte transition)
- Types: success (green), error (red), warning (yellow), info (blue)
- Stack multiple toasts with gap

### 9. Modal.svelte
Props: open, onclose, title, size ('sm' | 'md' | 'lg' | 'full')
- Glass card elevated background
- Backdrop: rgba(0,0,0,0.7) with backdrop-filter blur(8px)
- Center positioned with Svelte scale+fade transition
- Close on backdrop click, Escape key
- Focus trap (tab cycles within modal)
- Title bar with close X button
- Body renders children
- Prevent body scroll when open

### 10. Icon.svelte (wrapper)
Props: name (lucide icon name), size, color, class
- Thin wrapper around lucide-svelte icons
- Consistent sizing and color defaults

After building all components, create a test page at src/routes/dev/components/+page.svelte that renders every component in every state so you can visually verify them all. This page is for development only.

Every component must compile with zero TypeScript errors under strict mode.
```

### Acceptance Criteria:
- [ ] All 10 components render correctly
- [ ] All states (hover, active, disabled, loading) work
- [ ] Touch events work on mobile viewport (test in Chrome DevTools device mode)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] No TypeScript errors
- [ ] Dev test page shows all components in all states
- [ ] Glassmorphism renders correctly (backdrop-filter supported)
- [ ] Animations are smooth (60fps)

---

## PHASE 2: Onboarding Flow
**Estimated time: 8-12 hours**
**Dependencies: Phase 0, Phase 1**

### Claude Code Prompt:

```
PHASE 2: Build the complete onboarding flow for Cognition OS.

[PASTE MASTER CONTEXT HERE]

The onboarding is a multi-step wizard. It's themed as a "Mission Briefing" — 
the tone is serious, professional, and slightly military. NOT a wellness app.

## Routing Structure

Create src/routes/onboarding/ with this structure:
  +layout.svelte    — Onboarding shell (progress bar, back button, step tracking)
  +page.svelte      — Splash/hero screen (Screen 0)
  step-1/+page.svelte — Profession picker
  step-2/+page.svelte — Schedule type
  step-3/+page.svelte — Wake time
  step-4/+page.svelte — Sleep
  step-5/+page.svelte — Work hours
  step-6/+page.svelte — Breaks
  step-7/+page.svelte — Peak performance hours
  step-8/+page.svelte — Current habits
  step-9/+page.svelte — Commitment level
  step-10/+page.svelte — Protocol preview (generated schedule)

## Onboarding Store

Create src/lib/stores/onboarding.svelte.ts:

```typescript
import type { OnboardingState } from '$lib/types';

class OnboardingStore {
  state = $state<OnboardingState>({ step: 0 });
  
  get isComplete(): boolean {
    // $derived equivalent inside class
    return this.state.step >= 10 && 
           this.state.profession !== undefined &&
           this.state.scheduleType !== undefined &&
           this.state.wakeTime !== undefined &&
           this.state.commitmentLevel !== undefined;
  }
  
  get progressPercent(): number {
    return Math.round((this.state.step / 10) * 100);
  }
  
  updateField<K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) {
    this.state = { ...this.state, [key]: value };
  }
  
  nextStep() {
    this.state = { ...this.state, step: this.state.step + 1 };
  }
  
  prevStep() {
    if (this.state.step > 0) {
      this.state = { ...this.state, step: this.state.step - 1 };
    }
  }
  
  reset() {
    this.state = { step: 0 };
  }
}

export const onboarding = new OnboardingStore();
```

## Onboarding Layout

The layout (onboarding/+layout.svelte) must include:
- Thin progress bar at top (accent color, width = progressPercent%)
- Back arrow button (top-left) — calls onboarding.prevStep() + goto previous route
- Step indicator: "STEP 3 OF 10" (top-right, text-tertiary, small)
- Content area with padding
- Page transitions: slide-left on forward, slide-right on back (use Svelte fly transition with x offset)
- Splash screen (step 0) has NO progress bar or back button

## Screen 0: Splash (onboarding/+page.svelte)

Full screen, dark background.

Build a neural network background animation:
- Use an HTML Canvas element (full viewport)
- Create ~50 particles (small dots, color text-tertiary at 30% opacity)
- Each particle moves slowly in a random direction, bouncing off edges
- When two particles are within 150px of each other, draw a connecting line
  (color: accent at 5% opacity, thinner the farther apart)
- This creates a subtle, living neural network effect
- Performance: Use requestAnimationFrame, skip rendering when tab is hidden
- On mobile: reduce to ~30 particles for performance

Overlay content (centered, z-index above canvas):
- "COGNITION OS" — text-4xl, font-bold, tracking-widest, text-primary
  Animate: scale from 0 to 1 with elastic ease, 0.8s (use GSAP or Svelte scale transition)
- Subtitle: "Your brain is your most valuable asset.\nMost people never train it."
  text-lg, text-secondary, fade in after 0.5s delay
- Button: "BEGIN ASSESSMENT →" 
  Primary button, large, slides up from below after 1s delay
  On click: goto /onboarding/step-1, set step to 1

## Screen 1: Profession (step-1/+page.svelte)

Question: "What do you do?" (text-2xl, font-bold, text-primary, mb-8)

Grid of option cards (2 columns on mobile, 4 on desktop):
Each card is a GlassCard (interactive variant) containing:
- Icon (emoji, text-2xl)
- Label (text-lg, font-medium)
- Selected state: accent border (2px), accent glow shadow, slight scale

Options:
  { icon: '🎯', label: 'Day Trader', value: 'day_trader' }
  { icon: '📊', label: 'Swing Trader', value: 'swing_trader' }
  { icon: '🏢', label: 'CEO / Founder', value: 'ceo' }
  { icon: '💻', label: 'Developer', value: 'developer' }
  { icon: '⚖️', label: 'Lawyer', value: 'lawyer' }
  { icon: '🏥', label: 'Medical Pro', value: 'medical' }
  { icon: '🎓', label: 'Student', value: 'student' }
  { icon: '🔧', label: 'Other', value: 'other' }

On select: Update onboarding store, auto-advance to step 2 after 300ms delay
Animation: Cards stagger in from right (50ms between each, fly transition x:40)

## Screen 2: Schedule Type (step-2/+page.svelte)

Question: "How does your day work?"

Stack of option cards (full width, vertical stack):
Each has icon, title (text-lg, bold), and subtitle (text-sm, text-secondary):
  { icon: '⏰', title: 'Fixed Schedule', subtitle: 'Same hours every day', value: 'fixed' }
  { icon: '🔄', title: 'Flexible', subtitle: 'I set my own hours', value: 'flexible' }
  { icon: '🌙', title: 'Night Shift', subtitle: 'I work nights', value: 'night' }
  { icon: '✂️', title: 'Split Shift', subtitle: 'Morning + evening with a break', value: 'split' }

Same select behavior: update store, auto-advance.

## Screen 3: Wake Time (step-3/+page.svelte)

Question: "What time does your day usually start?"

Use the TimePicker component (built in Phase 1).
Default to 6:00 AM.
Below the picker: "I wake up at [TIME]" — live updating text, text-xl, text-accent.

If user selected "Flexible" in step 2, show additional note:
"No worries — we'll check in with you each morning" (text-sm, text-secondary, italic)

"Continue" button at bottom (primary, large).
On continue: save wakeTime to store, advance.

## Screen 4: Sleep (step-4/+page.svelte)

Question: "How many hours do you usually sleep?"

Use the Slider component:
- min: 4, max: 10, step: 0.5
- Default: 7
- trackColorFn: returns red for <6, orange for 6-6.5, yellow for 6.5-7, green for 7-9, blue for 9+
- formatValue: (v) => `${v} hours`

Dynamic message below slider (changes with value):
  < 6:    "⚠️ Sleep is the #1 cognitive enhancer. We'll help you fix this." (text-warning)
  6-7:    "Good start. The protocol will help you optimize." (text-secondary)
  7-9:    "Perfect range. Your brain thanks you." (text-success)
  > 9:    "Solid recovery. Let's channel that energy." (text-info)

Second question on same screen: "What time do you go to bed?"
Use TimePicker, default to wakeTime minus sleepHours.

"Continue" button.

## Screen 5: Work Hours (step-5/+page.svelte)

Question: "When are your work hours?"

If Fixed/Night/Split: Show a dual-handle range slider on a 24h timeline.
- Horizontal bar representing 0:00 to 23:59
- Two draggable handles for start and end
- Selected range fills with accent color at 20% opacity
- Hour labels every 3 hours below
- Auto-calculate: "You work X hours per day"

If Flexible: Show a single Slider instead.
- "How many hours of deep cognitive work per day?"
- min: 2, max: 12, step: 1
- Auto-calculate pomodoros: hours × 2

"Continue" button.

## Screen 6: Breaks (step-6/+page.svelte)

Question: "Tell us about your breaks"

Three toggle questions, each with conditional time picker:

1. "Do you have a regular coffee/morning break?"
   Toggle [Yes/No] → If yes, show TimePicker for time

2. "Do you have a lunch break?"
   Toggle [Yes/No] → If yes, show TimePicker + duration selector (15/30/45/60 min as segmented control)

3. "Any other regular breaks?"
   [+ Add break] button → Adds a TimePicker + duration row (can add multiple, can remove)

Each sub-section in its own GlassCard.
"Continue" button.

## Screen 7: Peak Performance (step-7/+page.svelte)

Question: "When do you need to be at your sharpest?"

24-hour grid: 
- Show hours from user's wake time to bed time only (no need to show sleeping hours)
- 1-hour blocks in a grid (4 per row on mobile, 6 on desktop)
- Each block is tappable. Tapped = accent bg at 30% + accent border. Untapped = bg-tertiary.
- Multi-select: user can tap multiple hours.

Below the grid, show profession-specific hint:
  Trader: "Market open 9:30-11, power hour 3-4"
  CEO: "Board meetings, investor calls, strategic decisions"
  Developer: "Deep focus coding sessions"
  (etc.)

"Continue" button.

## Screen 8: Current Habits (step-8/+page.svelte)

Question: "What do you currently do? (Be honest)"

Four sections, each in a GlassCard:

MOVEMENT section:
  Radio group: "I exercise regularly (3+/week)" | "Sometimes (1-2/week)" | "Rarely"

MINDFULNESS section:
  Radio group: "I meditate regularly" | "I've tried it" | "Never"

COLD EXPOSURE section:
  Radio group: "I do cold showers/plunges" | "I've tried it" | "Never / No access"

CAFFEINE section:
  Radio group: "None" | "1-2 cups" | "3-4 cups" | "5+ cups"
  If anything except "None":
    → "When is your first coffee?" TimePicker
    → "When is your last coffee?" TimePicker

"Continue" button.

## Screen 9: Commitment Level (step-9/+page.svelte)

Question: "How hard do you want to go?"

Three cards side by side (horizontal scroll on mobile, flex row on desktop):

STANDARD card:
  - Border: text-tertiary
  - 4 Pomodoros/day, 10 min meditation, 15 min N-Back, 2x/week exercise
  - "~3.5 hrs/day total protocol"
  - "For those starting out"

AGGRESSIVE card (recommended badge):
  - Border: accent
  - "RECOMMENDED" badge at top
  - 6 Pomodoros/day, 15 min meditation, 20 min N-Back, 4x/week exercise
  - "~5 hrs/day total protocol"
  - "For those ready to commit"

ELITE card:
  - Border: level-5 gold
  - 8 Pomodoros/day, 20 min meditation, 25 min N-Back, 5x/week exercise
  - "~6.5 hrs/day total protocol"
  - "For those who are all-in"

Note below all cards:
"Remember: Pomodoro blocks ARE your real work. This isn't extra time."
(text-sm, text-secondary)

On select: save, auto-advance.

## Screen 10: Protocol Preview (step-10/+page.svelte)

This is the most important screen. THE CONVERSION MOMENT.

Loading sequence (2.5 seconds of intentional theater):
1. Show a dark screen with the neural network canvas from Screen 0
2. Overlay text sequence (each fades in, then out):
   - "Analyzing your profile..." (0-0.8s)
   - "Calculating optimal protocol..." (0.8-1.6s)
   - "Generating your cognitive blueprint..." (1.6-2.4s)
3. Then the timeline reveals

The generated timeline:
- Import and call generateProtocol() from src/lib/utils/protocol-engine.ts
  (you must implement this function — logic described below)
- Render as a vertical timeline with time markers on the left
- Each protocol item is a GlassCard with icon, title, time, description
- Level-locked items (Level 2+) show as dimmed with a lock icon and
  "Unlocks at Level X" text
- Stagger animation: each card fades/slides in with 100ms delay

Below the timeline:
- "21 consecutive days to complete Level 1"
- "Miss a day → restart from Day 1" (text-danger)
- Level roadmap: 5 circles connected by lines, Level 1 active, rest locked
- "ACCEPT MISSION →" button (primary, large, full-width)

On "ACCEPT MISSION":
- Full-screen celebration: 
  - Background flashes briefly with accent glow
  - Level 1 badge (circle with "1" and level-1 color) scales in with elastic ease
  - Confetti-like particle burst (small dots flying outward, accent + success colors)
  - Text: "LEVEL 1: FOUNDATION" fades in below badge
  - After 2s, auto-redirect to /app (main dashboard)
- Save all onboarding data to store (and eventually API)

## Protocol Engine Implementation

Create src/lib/utils/protocol-engine.ts:

This function takes the OnboardingState + currentLevel and returns ProtocolItem[].

Logic (implement exactly):

1. Morning Activation (Level 1+, always first):
   time = wakeTime, 5 min, "16oz water, 10 deep breaths (4-7-8), set intention"

2. Cold Exposure (Level 3+, if coldExposureLevel !== 'never'):
   time = wakeTime + 5min
   duration: Level 3 = 2min, Level 4 = 2.5min, Level 5 = 3min

3. Meditation (Level 2+):
   time = after cold (or wake+5 if no cold)
   duration by level & experience:
     Level 2: never=5, tried=10, regular=15
     Level 3: never=10, tried=15, regular=20
     Level 4-5: 20-25 (10 focused + 10-15 open monitoring)

4. N-Back (Level 3+):
   time = before first work block
   duration: Level 3=20, Level 4=25, Level 5=25

5. SRS Review (Level 3+):
   time = before first work block (after N-Back)
   duration: 15 min

6. Visualization (Level 4+):
   time = before first work block
   duration: 10 min

7. Pomodoro Blocks:
   Based on commitmentLevel: standard=4, aggressive=6, elite=8
   Split into Block 1 and Block 2 (even split)
   Place Block 1 at workStart, Block 2 after lunch/break
   Each pomodoro: 25 min work + 5 min break
   After every 4 pomodoros: 15-20 min active break (walk)

8. Exercise (Level 4+):
   Place 60-90 min BEFORE the earliest peak hour
   If no peak hours defined, place after first pomodoro block
   30 min

9. Non-Dominant Hand (Level 4+):
   Place at lunch break (or midday). 10 min.

10. Evening Consolidation (Level 1+):
    time = bedTime - 60min
    Level 1-2: 10 min (journal, recall 3 learnings)
    Level 3-4: 15 min (+ SRS card creation)
    Level 5: 30 min (+ Feynman technique)

11. Wind-Down (Level 1+):
    time = bedTime - 30min
    15 min, "Blue light filter, light reading, 4-7-8 breathing"

For "flexible" schedule: Use relative times ("wake+0", "wake+5", etc.)
For "fixed" schedule: Use actual clock times

Sort all items by time ascending before returning.

Generate unique IDs for each item (use crypto.randomUUID() or a counter).
Set all statuses to 'upcoming' initially.

## Important Implementation Notes:
- Every screen transition must animate (fly or slide)
- Every selection must provide immediate visual feedback
- Store persists in sessionStorage (so refresh doesn't lose progress)
- Back button works correctly at every step
- Direct URL access to a step redirects to the last incomplete step
- The entire flow works without any backend (Phase 2 is frontend-only)
```

### Acceptance Criteria:
- [ ] Complete 10-step flow works end to end
- [ ] Back navigation works at every step
- [ ] Progress bar updates correctly
- [ ] Profession selection auto-advances
- [ ] TimePicker is touch-friendly (test on mobile viewport)
- [ ] Sleep slider shows correct color and message
- [ ] Protocol preview generates correct schedule based on ALL inputs
- [ ] Flexible vs Fixed schedules produce different time formats
- [ ] Level-locked items show correctly on preview
- [ ] "Accept Mission" celebration plays smoothly
- [ ] All data persists in sessionStorage across refreshes
- [ ] Zero TypeScript errors

---

## PHASE 3: Dashboard & Protocol Timeline
**Estimated time: 6-8 hours**  
**Dependencies: Phase 0, 1, 2**

### Claude Code Prompt:

```
PHASE 3: Build the main dashboard (Command Center) and daily protocol timeline.

[PASTE MASTER CONTEXT HERE]

## App Shell Layout

Create src/routes/app/+layout.svelte:
- Bottom navigation bar (mobile), sidebar (desktop 1024px+)
- 5 nav items:
  { icon: Home, label: 'Today', path: '/app' }
  { icon: Timer, label: 'Focus', path: '/app/timer' }  
  { icon: Brain, label: 'Train', path: '/app/nback' }
  { icon: BookOpen, label: 'Review', path: '/app/review' }
  { icon: BarChart3, label: 'Progress', path: '/app/progress' }
- Active state: accent color icon + label, inactive: text-tertiary
- Glass card background for bottom nav
- Settings gear icon in top-right corner → /app/settings
- Page content has padding-bottom on mobile (for bottom nav clearance)

## Protocol Store

Create src/lib/stores/protocol.svelte.ts:

```typescript
class ProtocolStore {
  items = $state<ProtocolItem[]>([]);
  activeItemId = $state<string | null>(null);
  
  get completedCount(): number {
    return this.items.filter(i => i.status === 'completed').length;
  }
  
  get requiredCount(): number {
    return this.items.filter(i => i.required).length;
  }
  
  get completionPercent(): number {
    if (this.requiredCount === 0) return 0;
    const completed = this.items.filter(i => i.required && i.status === 'completed').length;
    return Math.round((completed / this.requiredCount) * 100);
  }
  
  get activeItem(): ProtocolItem | null {
    return this.items.find(i => i.id === this.activeItemId) ?? null;
  }
  
  get nextUpcoming(): ProtocolItem | null {
    return this.items.find(i => i.status === 'upcoming' && i.required) ?? null;
  }
  
  loadSchedule(items: ProtocolItem[]) {
    this.items = items;
  }
  
  startItem(id: string) {
    this.items = this.items.map(i => 
      i.id === id ? { ...i, status: 'active' as const } : i
    );
    this.activeItemId = id;
  }
  
  completeItem(id: string) {
    this.items = this.items.map(i =>
      i.id === id ? { ...i, status: 'completed' as const } : i
    );
    this.activeItemId = null;
  }
  
  skipItem(id: string) {
    this.items = this.items.map(i =>
      i.id === id ? { ...i, status: 'skipped' as const } : i
    );
  }
}

export const protocol = new ProtocolStore();
```

## Streak Store

Create src/lib/stores/streak.svelte.ts:

```typescript
class StreakStore {
  data = $state<Streak>({
    currentStreak: 0,
    longestStreak: 0,
    currentLevel: 1,
    dayInLevel: 1,
    levelStartDate: new Date().toISOString().split('T')[0],
    totalRestarts: 0
  });
  
  get daysRequired(): number {
    return this.data.currentLevel <= 2 ? 21 : 28;
  }
  
  get levelProgress(): number {
    return Math.round((this.data.dayInLevel / this.daysRequired) * 100);
  }
  
  get daysRemaining(): number {
    return this.daysRequired - this.data.dayInLevel;
  }
  
  get levelName(): string {
    const names: Record<number, string> = {
      1: 'Foundation', 2: 'Attention', 3: 'Working Memory',
      4: 'Advanced', 5: 'Mastery'
    };
    return names[this.data.currentLevel] ?? 'Unknown';
  }
}

export const streak = new StreakStore();
```

## Dashboard Page (src/routes/app/+page.svelte)

### Top Section — Status Bar
Glass card with:
- Left: Fire emoji + "DAY {dayInLevel} of {daysRequired}" (font-bold)
- Right: "LEVEL {level}: {levelName}" with level-color badge
- Below: Progress bar (level color fill, bg-tertiary track, rounded, 6px height)
  Label below bar: "{levelProgress}% Complete"
- Below that: "Streak: {currentStreak} days" + fire emojis 
  (1 fire per 7 days of streak, max 5)

The streak number should use an odometer/counter animation when it changes.
For the odometer effect: each digit is a span with overflow-hidden, the number
slides up when incrementing. Use GSAP or CSS animation.

### Middle Section — Today's Protocol Timeline
Vertical list of GlassCards, one per protocol item.

Each card shows:
- Left: Icon (emoji, 24px) + colored dot (status indicator)
  - upcoming: bg-tertiary dot
  - active: accent dot with pulse animation (CSS animation: scale 1→1.3→1, opacity 1→0.5→1)
  - completed: success dot with check
  - missed: danger dot
  - skipped: text-tertiary dot, strikethrough title
- Center: Title (text-base, font-medium) + Time (text-sm, text-secondary)
  Below title: Description (text-sm, text-tertiary, one line, truncated)
- Right: 
  - upcoming: nothing or "8:00 AM"
  - active: live timer countdown + "IN PROGRESS" accent text
  - completed: checkmark + duration completed "[25:00]"

If item is the next upcoming required item, show a "START →" button (small, primary)
that navigates to the appropriate screen:
  - pomodoro → /app/timer?type=pomodoro
  - meditation → /app/timer?type=meditation  
  - nback → /app/nback
  - srs_review → /app/review
  - exercise → /app/timer?type=exercise
  - cold_exposure → /app/timer?type=cold
  - Others → /app/timer?type={type} (generic timer)

### Bottom Section — Quick Stats
Horizontal scrolling row of 4 small GlassCards:

1. Pomodoros: "{completed}/{target}" with a mini progress ring
2. Water: "{oz} oz" with water drop icon  
3. Streak: "{days}" with fire icon
4. Level: "{level}" with level-color ring showing level progress

### Behavior:
- On page load: Call protocol engine to generate today's schedule
  (use onboarding data from store — for now, hardcode demo data if no onboarding)
- Items auto-update status based on current time (mark as "missed" if time has passed
  and not completed — but allow user to still complete out of order)
- Pull-to-refresh gesture (on mobile) reloads schedule

## Dev/Demo Mode
Since we don't have a backend yet, create a function in src/lib/utils/demo-data.ts
that generates realistic demo data:
- A pre-filled onboarding profile (day trader, 5:30 AM wake, aggressive)
- A protocol schedule for today
- A streak of 14 days in Level 1
- Some items already completed, some upcoming

Import and use this demo data when no real data exists.
This allows the entire app to be visually complete and interactive without a backend.
```

### Acceptance Criteria:
- [ ] Bottom nav renders with 5 items, highlights active route
- [ ] Dashboard loads with demo data showing realistic protocol
- [ ] Status bar shows correct level, day, and streak
- [ ] Protocol timeline shows all items in correct order
- [ ] Status indicators (upcoming/active/completed/missed) all render correctly
- [ ] "START →" button appears on next upcoming item
- [ ] Quick stats show correct numbers
- [ ] Responsive: works on 375px mobile and 1440px desktop
- [ ] Smooth scroll, no layout shifts

---

## PHASE 4: Timer System
**Estimated time: 4-6 hours**
**Dependencies: Phase 0, 1, 3**

### Claude Code Prompt:

```
PHASE 4: Build the universal timer system used for Pomodoros, meditation, 
exercise, cold exposure, and all timed protocol sessions.

[PASTE MASTER CONTEXT HERE]

## Timer Store

Create src/lib/stores/timer.svelte.ts:

```typescript
type TimerMode = 'pomodoro' | 'meditation' | 'exercise' | 'cold' | 'break' | 'generic';
type TimerState = 'idle' | 'running' | 'paused' | 'complete';

class TimerStore {
  mode = $state<TimerMode>('pomodoro');
  timerState = $state<TimerState>('idle');
  totalSeconds = $state(0);
  remainingSeconds = $state(0);
  protocolItemId = $state<string | null>(null);
  taskDescription = $state('');
  pomodoroNumber = $state(1);
  pomodoroTotal = $state(4);
  
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  get progress(): number {
    if (this.totalSeconds === 0) return 0;
    return ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
  }
  
  get displayTime(): string {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  get isRunning(): boolean {
    return this.timerState === 'running';
  }
  
  start(config: {
    mode: TimerMode;
    durationMinutes: number;
    protocolItemId?: string;
    task?: string;
    pomodoroNumber?: number;
    pomodoroTotal?: number;
  }) {
    this.mode = config.mode;
    this.totalSeconds = config.durationMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.protocolItemId = config.protocolItemId ?? null;
    this.taskDescription = config.task ?? '';
    this.pomodoroNumber = config.pomodoroNumber ?? 1;
    this.pomodoroTotal = config.pomodoroTotal ?? 4;
    this.timerState = 'running';
    this.tick();
  }
  
  pause() {
    this.timerState = 'paused';
    if (this.intervalId) clearInterval(this.intervalId);
  }
  
  resume() {
    this.timerState = 'running';
    this.tick();
  }
  
  stop() {
    this.timerState = 'idle';
    if (this.intervalId) clearInterval(this.intervalId);
    this.remainingSeconds = 0;
  }
  
  private tick() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.timerState = 'complete';
        if (this.intervalId) clearInterval(this.intervalId);
        return;
      }
      this.remainingSeconds -= 1;
    }, 1000);
  }
  
  dispose() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const timer = new TimerStore();
```

## Timer Page (src/routes/app/timer/+page.svelte)

Read query params: ?type=pomodoro&itemId=xxx
Initialize timer from query params + protocol store.

### Full-Screen Timer Layout

When timer is running, the screen should be immersive:
- Hide bottom nav (communicate this via a layout store or context)
- Dark background (#0A0A0F)
- Status bar area at top:
  - Mode label: "POMODORO 3 OF 8" or "MEDITATION" or "COLD EXPOSURE"
  - Small, text-secondary, tracking-widest

- Center: Timer Ring (large, ~250px diameter on mobile, ~300px on desktop)
  - Use ProgressRing component at this size
  - Color varies by mode:
    - pomodoro: accent (#00D4FF)
    - meditation: level-2 (#7C4DFF)
    - exercise: level-4 (#FF6D00)
    - cold: level-3 (#00BFA5)
    - break: text-secondary
  - Timer text in center: displayTime (font-mono, text-5xl)
  - Ring animates smoothly as seconds tick

- Below timer:
  - Task description (if pomodoro): "Pre-market analysis" (text-lg, text-secondary)
  - Mode-specific prompt:
    - meditation: "Focus on your breath"
    - cold: "Breathe through it. You are in control."
    - exercise: "60-70% max heart rate"
    - break: "Stand up. Stretch. Hydrate. 💧"

- Controls at bottom:
  - Running state: [⏸ Pause] [⏭ Skip] buttons (ghost variant, large touch targets)
  - Paused state: [▶ Resume] [⏹ End] buttons
  - Break state: No skip (break must complete), show hydration check

### Timer Completion Flow

When remainingSeconds hits 0:
1. Ring fills to 100%, pulses green briefly
2. Play completion sound (if sounds enabled):
   - Use Web Audio API: generate a gentle 3-note ascending chime
   - Create a simple AudioContext-based synth (sine wave, 440→523→659 Hz)
   - 200ms per note, with decay envelope
3. Vibration pattern (navigator.vibrate if available): [100, 50, 100, 50, 100]
4. Show completion overlay:

For POMODORO completion:
  If more pomodoros remaining in block:
    "Pomodoro {n} complete! Time for a break."
    [START BREAK →] button → starts 5-min break timer
  If last pomodoro in block:
    "Block complete! Take a long break."
    [START LONG BREAK →] button → starts 15-min break timer
  If all pomodoros done for the day:
    "All pomodoros complete! 🎉"
    Show confetti burst (reuse from onboarding celebration)
    [BACK TO DASHBOARD →]

For BREAK completion:
  "Break's over. Ready for the next one?"
  Hydration check: "Did you drink water?" [Yes 💧] [No]
  If Yes: increment water count in protocol store
  [START NEXT POMODORO →] or [BACK TO DASHBOARD →]

For MEDITATION completion:
  "Session complete. Notice how you feel."
  Brief pause (3 seconds of stillness)
  Then: [CONTINUE →] → marks item complete, returns to dashboard

For COLD EXPOSURE:
  "{duration} seconds. You did it. 🧊"
  "Norepinephrine +530%. Dopamine +250%." (motivational fact)
  [CONTINUE →]

For EXERCISE:
  "Great session. BDNF is flowing."
  "Your next 60-90 minutes are your cognitive peak."
  [CONTINUE →]

### Pre-Pomodoro Task Input

Before starting a pomodoro, show a task input screen:
- "What's your ONE task for this pomodoro?"
- Single text input (large, centered, glass card bg)
- Placeholder: "e.g., Review pre-market levels"
- Character limit: 100
- [START TIMER →] button
- This enforces single-tasking (Level 2+ protocol requirement)

### Task-Switch Counter

During pomodoro, show small text at bottom:
"Task switches today: {count} (target: < 2 per pomodoro)"

Add a small "+ Switch" button (ghost, text-danger) that increments the counter.
This is honor-system: user taps it when they catch themselves switching tasks.
The count is tracked per pomodoro and averaged in daily stats.

### Screen Wake Lock

When timer is running, prevent the screen from sleeping:
if ('wakeLock' in navigator) {
  const wakeLock = await navigator.wakeLock.request('screen');
}
Release on pause/complete/navigate away.
Wrap in try/catch (not all browsers support it).

### Edge Cases:
- User navigates away during active timer: Show confirmation dialog
  "Timer is running. Leave anyway?" [Stay] [Leave (timer pauses)]
- App goes to background (mobile): Timer continues via setInterval
  (Capacitor keeps JS alive briefly, but for long sessions, 
   also store start time and calculate elapsed on resume)
- Multiple rapid taps on Start: Debounce, only start once
```

### Acceptance Criteria:
- [ ] Pomodoro timer counts down correctly
- [ ] Break timer auto-starts after pomodoro
- [ ] Meditation, exercise, cold timers all work with correct colors
- [ ] Task input screen appears before pomodoro start
- [ ] Completion sounds play (Web Audio API)
- [ ] Vibration fires on supported devices
- [ ] Screen stays awake during timer
- [ ] Back navigation shows confirmation dialog during active timer
- [ ] Hydration check appears after breaks
- [ ] Task switch counter works
- [ ] Timer survives brief app backgrounding

---

## PHASE 5: Dual N-Back Training Game
**Estimated time: 6-8 hours**
**Dependencies: Phase 0, 1, 3**

### Claude Code Prompt:

```
PHASE 5: Build the Dual N-Back cognitive training game.

[PASTE MASTER CONTEXT HERE]

This is the crown jewel feature. It must feel like a game, not a chore.
Smooth animations, clear feedback, satisfying sounds.

## N-Back Game Engine

Create src/lib/utils/nback-engine.ts:

This is a PURE logic module (no DOM, no Svelte, fully testable).

```typescript
export interface NBackRound {
  position: number;      // 0-8 (3x3 grid index)
  letter: string;        // A-Z letter
  isPositionMatch: boolean;
  isAudioMatch: boolean;
}

export interface NBackGameState {
  nLevel: number;              // Current N level (2, 3, 4, 5...)
  rounds: NBackRound[];        // Pre-generated sequence
  currentRoundIndex: number;
  userResponses: {
    positionMatch: boolean;    // User pressed position match
    audioMatch: boolean;       // User pressed audio match
  }[];
  totalRounds: number;         // Usually 20
  positionCorrect: number;
  positionIncorrect: number;
  audioCorrect: number;
  audioIncorrect: number;
}

// Generate a game sequence with controlled match frequency
export function generateNBackSequence(
  nLevel: number,
  totalRounds: number = 20,
  matchProbability: number = 0.3  // 30% chance of match per channel
): NBackRound[] {
  // Generate positions (0-8) and letters (random from A-Z)
  // For the first N rounds, matches are impossible
  // From round N onwards, compare to round (current - N)
  // Use matchProbability to control how often matches occur
  // Ensure at least 3 position matches and 3 audio matches per game
  // Ensure at least 1 dual match (both position AND audio) per game
  
  // Implementation:
  // 1. Generate first N rounds randomly
  // 2. For rounds N to totalRounds-1:
  //    - Roll for position match (random < matchProbability)
  //    - If match: copy position from round[current - N]
  //    - Else: pick a DIFFERENT position than round[current - N]
  //    - Same logic for audio letter
  // 3. Verify minimum matches are met, regenerate if not
}

// Evaluate user response for a round
export function evaluateResponse(
  state: NBackGameState,
  roundIndex: number,
  userPressedPosition: boolean,
  userPressedAudio: boolean
): { positionCorrect: boolean; audioCorrect: boolean } {
  const round = state.rounds[roundIndex];
  return {
    positionCorrect: userPressedPosition === round.isPositionMatch,
    audioCorrect: userPressedAudio === round.isAudioMatch
  };
}

// Calculate overall accuracy
export function calculateAccuracy(state: NBackGameState): {
  overall: number;
  position: number;
  audio: number;
} {
  // Position accuracy: correct position responses / total rounds where decision was made
  // Audio accuracy: same for audio
  // Overall: average of both
}

// Determine if player should level up
export function shouldLevelUp(
  recentAccuracies: number[],  // Last 3 session accuracies
  currentLevel: number
): boolean {
  // Level up if last 3 sessions were all >80% accuracy
  return recentAccuracies.length >= 3 && 
         recentAccuracies.every(a => a >= 80);
}

// Determine if player should level down
export function shouldLevelDown(
  recentAccuracies: number[],
  currentLevel: number
): boolean {
  // Level down if last 3 sessions were all <50% and level > 2
  return currentLevel > 2 && 
         recentAccuracies.length >= 3 && 
         recentAccuracies.every(a => a < 50);
}
```

## N-Back Audio System

Create src/lib/utils/nback-audio.ts:

Use the Web Speech Synthesis API to speak letters:

```typescript
const LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];
// Use only distinct-sounding letters to avoid confusion

export function speakLetter(letter: string): void {
  const utterance = new SpeechSynthesisUtterance(letter);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  speechSynthesis.speak(utterance);
}

// Alternative: Pre-recorded audio buffers for consistent quality
// If SpeechSynthesis is inconsistent, fall back to AudioContext-generated tones
// Each letter maps to a unique tone pattern
```

## N-Back Store

Create src/lib/stores/nback.svelte.ts:

Manages active game state, history of past sessions, and adaptive difficulty.

## N-Back Game Page (src/routes/app/nback/+page.svelte)

### Layout (full-screen, immersive):

Top bar:
  Left: "N-BACK LEVEL: {n}" (font-mono, text-accent)
  Right: "Score: {overallAccuracy}%" (font-mono)
  Below: "Round {current} of {total}" + session timer

Center: 3×3 Grid
  - 3 rows × 3 columns of squares
  - Each square: 64px × 64px on mobile, 80px × 80px on desktop
  - Gap: 8px between squares
  - Default: bg-tertiary with subtle border
  - Active square: accent color background, scale to 1.05, glow shadow
  - Square lights up for 500ms, then returns to default
  - Smooth transition (200ms ease-out)

Below grid:
  "🔊 {letter}" — shows the current letter being played (text-xl, text-accent)
  Fades in when letter plays, fades out after 500ms

Response buttons (large, centered, equal size):
  [POSITION MATCH]    [AUDIO MATCH]
  Left button: "Same POSITION as {n} rounds ago"
  Right button: "Same LETTER as {n} rounds ago"
  
  Button states:
  - Default: glass card bg, text-primary
  - Pressed (correct): flash green (#00FF88) for 300ms
  - Pressed (incorrect): flash red (#FF3366) for 300ms + subtle shake animation
  - Not pressed (was a match — miss): brief yellow flash on the relevant button after round ends

  Buttons must be LARGE (min 120px × 64px) for reliable touch targets.
  
  Response window: User has 2500ms per round to respond.
  After 2500ms, move to next round. If user didn't press and there was a match, count as miss.

Bottom stats bar:
  "Accuracy: [=======---] {pct}%" 
  "Best: {n}-back @ {pct}%"
  Progress bar fills with accent color

### Game Flow:

1. Pre-game screen:
   "DUAL N-BACK — LEVEL {n}"
   "Match positions and sounds from {n} rounds ago"
   "20 rounds • ~3 minutes"
   [START →]

2. Countdown: 3... 2... 1... (each number scales in/out, 1s each)

3. Game loop:
   Every 3000ms (3 second interval):
   a. Highlight a grid position (random or predetermined from sequence)
   b. Simultaneously speak a letter
   c. User has 2500ms to press Position Match, Audio Match, both, or neither
   d. After 2500ms, evaluate response and show feedback (300ms)
   e. Brief blank (200ms) between rounds for visual reset
   
4. Game complete:
   Show results screen:
   
   "SESSION COMPLETE"
   
   Overall accuracy: {pct}% (large, color-coded: green >80%, yellow 60-80%, red <60%)
   Position accuracy: {pct}%
   Audio accuracy: {pct}%
   
   Trend: ↑ +5% from last session (or ↓ -3%)
   
   If accuracy >= 80% for 3 consecutive sessions:
     "🎉 Ready to advance to {n+1}-back!"
     [ADVANCE TO {n+1}-BACK →] [STAY AT {n}-BACK]
   
   If accuracy < 50% for 3 consecutive sessions:
     "Consider stepping back to {n-1}-back to build a stronger foundation."
     [DROP TO {n-1}-BACK] [STAY AT {n}-BACK]
   
   [PLAY AGAIN] [BACK TO DASHBOARD]

### Keyboard Shortcuts (desktop):
  A or Left Arrow: Position Match
  L or Right Arrow: Audio Match
  Space: Both (dual match)
  
Show keyboard hint text on desktop: "Keyboard: A = Position, L = Audio"

### Performance Requirements:
  - Grid highlight must be EXACTLY on time (use requestAnimationFrame for visual, 
    setInterval for timing logic)
  - Audio must play simultaneously with visual (pre-load speech or audio)
  - No dropped frames during gameplay
  - Response measurement: track exact response time (ms) for future analytics
```

### Acceptance Criteria:
- [ ] N-Back game plays correctly for N=2, 3, 4, 5
- [ ] Grid highlights correct position with smooth animation
- [ ] Audio plays simultaneously with visual
- [ ] User can respond with touch (mobile) and keyboard (desktop)
- [ ] Correct/incorrect feedback is immediate and clear
- [ ] Accuracy calculation is mathematically correct
- [ ] Level-up suggestion appears after 3 sessions >80%
- [ ] Level-down suggestion appears after 3 sessions <50%
- [ ] Results screen shows all stats
- [ ] Game state doesn't break on rapid button presses

---

## PHASE 6: Spaced Repetition System
**Estimated time: 4-6 hours**
**Dependencies: Phase 0, 1, 3**

### Claude Code Prompt:

```
PHASE 6: Build the Spaced Repetition flashcard system.

[PASTE MASTER CONTEXT HERE]

## SRS Algorithm

Create src/lib/utils/srs-algorithm.ts:

Implement SM-2 variant:

```typescript
export interface ReviewResult {
  newInterval: number;      // days until next review
  newEaseFactor: number;    // adjusted ease factor
  nextReviewDate: string;   // ISO date string
}

export function calculateNextReview(
  currentInterval: number,
  currentEase: number,
  rating: SRSRating
): ReviewResult {
  let newInterval: number;
  let newEase = currentEase;
  
  switch (rating) {
    case 'again':
      newInterval = 1;
      newEase = Math.max(1.3, currentEase - 0.2);
      break;
    case 'hard':
      newInterval = Math.max(1, Math.round(currentInterval * 1.2));
      newEase = Math.max(1.3, currentEase - 0.15);
      break;
    case 'good':
      newInterval = Math.round(currentInterval * currentEase);
      break;
    case 'easy':
      newInterval = Math.round(currentInterval * currentEase * 1.3);
      newEase = currentEase + 0.15;
      break;
  }
  
  // Cap at 365 days
  newInterval = Math.min(newInterval, 365);
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  
  return {
    newInterval,
    newEaseFactor: newEase,
    nextReviewDate: nextDate.toISOString().split('T')[0]
  };
}

// For display: show next review interval
export function formatInterval(days: number): string {
  if (days < 1) return '<1d';
  if (days === 1) return '1d';
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.round(days / 7)}w`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}
```

## Pre-loaded Card Decks

Create src/lib/constants/srs-decks.ts:

Build 3 starter decks with 20 cards each:

1. "Neuroscience Fundamentals" — How the brain learns
   Cards about BDNF, neuroplasticity, hippocampus, prefrontal cortex,
   synaptic plasticity, neurogenesis, myelin, dopamine, norepinephrine, etc.

2. "Protocol Science" — Why each technique works
   Cards about why pomodoro works (attention decay at 25-30 min),
   why cold exposure works (norepinephrine +530%), why spaced repetition
   works (forgetting curve), why exercise boosts cognition (BDNF),
   why meditation changes brain structure (gray matter), etc.

3. "Cognitive Biases" — Decision-making for high-performers
   Cards about confirmation bias, anchoring, sunk cost, availability
   heuristic, Dunning-Kruger, survivorship bias, etc.

Each card: { front: string, back: string, deck: string }

## SRS Store

Create src/lib/stores/srs.svelte.ts:
- cards: all user's cards
- dueCards: derived — cards where nextReview <= today
- currentSession: the active review session (subset of due cards)
- currentCardIndex: which card in the session
- sessionStats: { total, correct, incorrect }

## Review Page (src/routes/app/review/+page.svelte)

### No Cards Due State:
  "All caught up! 🎉"
  "No cards due for review right now."
  "Next review: {date} ({N} cards)"
  [BROWSE DECKS →] [CREATE CARD →]

### Review Session:

Top bar:
  "REVIEW SESSION" + "Cards due: {remaining}"
  Progress bar showing cards completed in session

Card display (centered, large):
  GlassCard (elevated), near full-width:
  
  FRONT STATE:
    Card question text (text-xl, centered, padding 32px)
    Below: [TAP TO REVEAL] button or tap anywhere on card
  
  FLIP ANIMATION:
    3D perspective rotate on Y-axis (rotateY 0° → 180°, 400ms)
    The card literally flips over in 3D space.
    Use CSS: perspective: 1000px on parent
    Front face: backface-visibility: hidden
    Back face: rotateY(180deg), backface-visibility: hidden
    On flip: rotate the whole card container 180deg
  
  BACK STATE (after flip):
    Answer text (text-lg, centered)
    May include additional explanation text (text-sm, text-secondary)

Rating buttons (below card, after flip):
  4 buttons in a row:
  [Again] [Hard] [Good] [Easy]
  
  Each shows the next review interval:
  Again: "< 1d" (danger color)
  Hard:  "{interval}" (warning color)  
  Good:  "{interval}" (success color)
  Easy:  "{interval}" (info color)
  
  Large touch targets, clear color coding.

After rating:
  - Calculate next review with SM-2
  - Update card in store
  - Animate card off-screen (slide left) 
  - Next card slides in from right
  - Update progress bar and "remaining" count

### Session Complete:
  "Session Complete! 📚"
  "Reviewed: {total} cards"
  "Accuracy: {pct}% (cards rated Good or Easy)"
  "Time: {minutes}:{seconds}"
  [BACK TO DASHBOARD →]

### Card Browser (src/routes/app/cards/+page.svelte):
  - List all cards grouped by deck
  - Search/filter
  - Tap card to view
  - Create new card button → opens card editor modal
  - Edit and delete existing cards

### Card Editor (Modal):
  - Front text (textarea)
  - Back text (textarea)  
  - Deck selector (dropdown)
  - [Save] [Cancel]
  - For edit: [Delete] button (with confirmation)

### Keyboard shortcuts (desktop):
  Space or Enter: Flip card
  1: Again, 2: Hard, 3: Good, 4: Easy
```

### Acceptance Criteria:
- [ ] SM-2 algorithm produces correct intervals
- [ ] Card flip animation is smooth 3D perspective
- [ ] Rating updates card's next review date correctly
- [ ] Due cards calculation is accurate
- [ ] Pre-loaded decks contain 60 quality cards
- [ ] Card creation and editing works
- [ ] Review session completes with stats
- [ ] Keyboard shortcuts work on desktop

---

## PHASE 7: Analytics & Progress Dashboard
**Estimated time: 4-6 hours**
**Dependencies: Phase 0, 1, 3, 4, 5, 6**

### Claude Code Prompt:

```
PHASE 7: Build the analytics and progress tracking dashboard.

[PASTE MASTER CONTEXT HERE]

Page: src/routes/app/progress/+page.svelte

Build 5 sections, each in its own GlassCard:

### Section 1: Level Progression
- Horizontal level roadmap: 5 circles (Level 1-5) connected by lines
- Completed levels: filled with level color + checkmark
- Current level: pulsing border, accent glow
- Locked levels: dimmed, lock icon
- Below: "Level {n}: {name}" + "Day {x} of {y}" + progress bar

### Section 2: Weekly Cognitive Benchmark
Use Chart.js (line chart) to show:
- X-axis: Weeks (W1, W2, W3...)
- Y-axis: Composite score (0-100)
- Line: accent color, smooth curves, filled gradient below

Below chart, show current week stats:
- N-Back Max Level: {n}-back @ {pct}%
- Pomodoro Completion Rate: {pct}%
- SRS Retention: {pct}% ({n} active cards)
- Task Switching: {avg}/pomodoro

Each stat shows trend arrow (↑ green if improving, ↓ red if declining)

### Section 3: Daily Completion Calendar
GitHub-style contribution heatmap for the current month:
- Grid: 7 columns (Mon-Sun) × 4-5 rows
- Each cell: small square (12-16px)
- Color intensity based on completion %:
  0%: bg-tertiary
  1-50%: level color at 25% opacity
  51-89%: level color at 50% opacity  
  90-99%: level color at 75% opacity
  100%: level color at 100%
- Hover/tap: show tooltip with date and completion %

### Section 4: N-Back Progress Chart
Line chart (Chart.js):
- X-axis: Sessions over time
- Y-axis: Accuracy % (left), N-Level (right, step chart)
- Show accuracy trend line + N-level step changes
- Highlight level-up moments with markers

### Section 5: Streak Stats
- Current streak: large number with fire emojis
- Longest streak: secondary display
- Total restarts: shown but not emphasized
- Average completion rate: percentage
- Calendar showing streak history (check/x marks per day)

## Demo Data Generator

Expand src/lib/utils/demo-data.ts to generate:
- 6 weeks of daily logs with realistic progression
- N-Back scores improving from 2-back 60% → 3-back 75%
- SRS retention improving from 70% → 85%
- Pomodoro completion improving from 80% → 95%
- Some missed days and a restart (realistic, not perfect)
- Weekly benchmark data

Use this to make the analytics page look impressive with data.

## Chart Configuration

Global Chart.js config for dark theme:
- Grid lines: rgba(255,255,255,0.05)
- Tick labels: text-secondary color
- Tooltips: glass card styling
- Line: accent color, 2px, smooth tension
- Points: accent color, 4px radius
- Fill: accent gradient (15% → 0% opacity top to bottom)
```

---

## PHASE 8: Marketing Landing Page + "Try Me" Demo
**Estimated time: 8-10 hours**
**Dependencies: Phase 0, 1, 2, 4, 5**

### Claude Code Prompt:

```
PHASE 8: Build the marketing landing page with interactive "Try Me" demo.

[PASTE MASTER CONTEXT HERE]

This is the CONVERSION page. It must be stunning. 
Think Apple product page meets Bloomberg meets Stripe.

## Landing Page (src/routes/+page.svelte)

### Hero Section (100vh)
- Neural network canvas animation (reuse from onboarding splash, but larger, more particles ~80)
- Large headline (text-5xl → text-7xl on desktop):
  "THE COGNITIVE PERFORMANCE OPERATING SYSTEM"
  Text gradient: white → accent (#00D4FF)
- Subheadline (text-xl, text-secondary):
  "Train your brain like an elite athlete trains their body.
   Evidence-based. Personalized. Unforgiving."
- Two CTAs:
  [TRY THE DEMO — FREE →] (primary, large)
  [DOWNLOAD APP →] (secondary, large)
- Scroll indicator at bottom (animated chevron bouncing down)

### Social Proof Bar (sticky after scroll past hero)
- Horizontal strip:
  "18,247 protocols completed this week"
  "Used by traders, CEOs, and developers worldwide"
- Subtle scroll animation: numbers count up on first view (use IntersectionObserver)

### Feature Showcase (scroll-triggered reveals)
3 feature blocks, each with:
- Left: Feature description (heading + paragraph)
- Right: Screenshot/mockup of the app screen (use actual app components in a phone frame!)

Feature 1: "Personalized to Your Life"
  Show the onboarding protocol preview timeline
  "Tell us your schedule. We build your protocol."

Feature 2: "Train Your Working Memory"  
  Show the N-Back game grid with animated demo
  "Dual N-Back training — the gold standard of cognitive enhancement."

Feature 3: "Never Miss a Day"
  Show the streak counter with fire emojis
  "Miss a day, restart your level. The streak IS the product."

Each block: fade-in + slide-up on scroll (IntersectionObserver + GSAP)

### Science Section
- "BACKED BY SCIENCE, NOT MARKETING"
- 4 stat cards (glass elevated):
  "+530% Norepinephrine — Cold exposure at 14°C (Šrámek et al., 2000)"
  "+46% Cognitive Function — Aerobic exercise BDNF (meta-analysis, N=1,111)"
  "+27 min → Gray Matter Changes — 8 weeks meditation (Harvard/MGH)"
  "2x Learning Retention — Active recall vs passive study (Karpicke, Science 2011)"

### Pricing Section
Use the pricing tiers from the blueprint:
- Free, Pro ($29/mo), Team ($24/user/mo)
- 3 columns, Pro highlighted with accent border + "MOST POPULAR" badge
- Feature comparison list
- [START FREE TRIAL →] on each

### Footer
- Links: Science, Blog, Privacy, Terms, Support
- "© 2026 Cognition OS. Your brain is your #1 asset."

## Interactive Demo Page (src/routes/demo/+page.svelte)

This is a standalone interactive experience. No login required.
Everything runs client-side. No data saved.

### Step 1: Mini Onboarding (simplified — 3 questions)
Show only:
1. Profession picker (same as onboarding step 1)
2. Wake time picker
3. Commitment level (Standard/Aggressive/Elite)

Styled identically to real onboarding but with "DEMO" badge visible.

### Step 2: Protocol Preview
Generate and display a sample Day 1 schedule based on answers.
Same component as onboarding step 10 but without the "Accept Mission" button.
Instead: "This is YOUR personalized protocol. Want to try a session?"
[TRY A POMODORO →]  [TRY N-BACK →]

### Step 3a: Demo Pomodoro
- Shortened to 2 minutes (120 seconds) instead of 25
- Task input: pre-filled with "Demo focus session"
- Full timer UI, identical to real timer
- On complete: Show completion animation + prompt to try N-Back or sign up

### Step 3b: Demo N-Back
- Shortened to 5 rounds instead of 20
- 2-back difficulty (simplest)
- Full game UI, identical to real game
- On complete: Show results + sign up prompt

### Step 4: Conversion CTA
After demo:
  "YOU JUST EXPERIENCED 2% OF COGNITION OS."
  Checklist of full features (animated check marks appearing one by one)
  [DOWNLOAD NOW — 7 DAY FREE TRIAL →]
  "No credit card required"

### SEO
- Meta tags: title, description, OpenGraph, Twitter cards
- Structured data: SoftwareApplication schema
- All images have alt text
- Semantic HTML (header, main, section, footer)
```

---

## PHASE 9: Capacitor Mobile Integration
**Estimated time: 4-6 hours**
**Dependencies: Phase 0-6**

### Claude Code Prompt:

```
PHASE 9: Add Capacitor for native iOS and Android support.

[PASTE MASTER CONTEXT HERE]

## Setup

1. Install Capacitor:
   pnpm add @capacitor/core
   pnpm add -D @capacitor/cli
   npx cap init "Cognition OS" "com.cognitionos.app" --web-dir build

2. Switch to static adapter for mobile builds:
   In svelte.config.js, use @sveltejs/adapter-static
   Add fallback: 'index.html' for SPA routing

3. Add platforms:
   pnpm add @capacitor/ios @capacitor/android
   npx cap add ios
   npx cap add android

4. Install plugins:
   pnpm add @capacitor/push-notifications
   pnpm add @capacitor/local-notifications
   pnpm add @capacitor/haptics
   pnpm add @capacitor/status-bar
   pnpm add @capacitor/preferences
   pnpm add @capacitor/app
   pnpm add @capacitor/splash-screen

5. Configure capacitor.config.ts:
   - appId, appName, webDir: 'build'
   - plugins config for each plugin
   - server: { androidScheme: 'https' }

## Native Feature Wrappers

Create src/lib/utils/native.ts:
A unified wrapper that detects if running in Capacitor or browser
and provides appropriate implementations.

```typescript
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

// Haptics
export async function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (isNative) {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    const styleMap = { light: ImpactStyle.Light, medium: ImpactStyle.Medium, heavy: ImpactStyle.Heavy };
    await Haptics.impact({ style: styleMap[style] });
  }
  // Browser: use navigator.vibrate as fallback
  else if ('vibrate' in navigator) {
    const durations = { light: 10, medium: 20, heavy: 30 };
    navigator.vibrate(durations[style]);
  }
}

export async function hapticNotification(type: 'success' | 'warning' | 'error') {
  if (isNative) {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');
    const typeMap = { success: NotificationType.Success, warning: NotificationType.Warning, error: NotificationType.Error };
    await Haptics.notification({ type: typeMap[type] });
  }
}

// Local Notifications (for timers and protocol reminders)
export async function scheduleNotification(config: {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
}) {
  if (isNative) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.schedule({
      notifications: [{
        id: config.id,
        title: config.title,
        body: config.body,
        schedule: { at: config.scheduleAt },
        sound: 'timer_complete.wav'
      }]
    });
  }
}

// Status Bar (immersive mode during timer)
export async function setImmersiveMode(enabled: boolean) {
  if (isNative) {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    if (enabled) {
      await StatusBar.hide();
    } else {
      await StatusBar.show();
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0A0A0F' });
    }
  }
}

// Preferences (offline-first local storage)
export async function saveLocal(key: string, value: string) {
  if (isNative) {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
}

export async function loadLocal(key: string): Promise<string | null> {
  if (isNative) {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key });
    return value;
  } else {
    return localStorage.getItem(key);
  }
}
```

## Integrate Native Features

Update existing components to use native wrappers:

1. Timer completion → hapticNotification('success')
2. Button press → hapticImpact('light')
3. Streak break → hapticNotification('error')
4. N-Back correct → hapticImpact('light')
5. N-Back incorrect → hapticNotification('warning')
6. Level up → hapticNotification('success') + hapticImpact('heavy')
7. Timer screen → setImmersiveMode(true), restore on leave
8. All store persistence → use saveLocal/loadLocal instead of localStorage

## PWA Configuration

Create static/manifest.json:
- name: "Cognition OS"
- short_name: "CogOS"
- theme_color: "#0A0A0F"
- background_color: "#0A0A0F"
- display: "standalone"
- icons: 192px and 512px (create placeholder SVG icons)

Create src/service-worker.ts:
- Cache static assets for offline use
- Cache API responses with stale-while-revalidate
- Handle offline fallback

## Build Scripts

Add to package.json scripts:
- "build:web": "vite build"  (for web/PWA deploy)
- "build:mobile": "vite build && npx cap sync"
- "dev:android": "vite build && npx cap sync && npx cap open android"
- "dev:ios": "vite build && npx cap sync && npx cap open ios"
```

---

## PHASE 10: Backend API (Rust/Axum)
**Estimated time: 12-16 hours**
**Dependencies: Separate repo, can start after Phase 2**

### Claude Code Prompt:

```
PHASE 10: Build the Rust/Axum backend API for Cognition OS.

This is a SEPARATE repository: cognition-os-api

## Project Setup

cargo init cognition-os-api
cd cognition-os-api

Cargo.toml dependencies:
[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.8", features = ["runtime-tokio", "postgres", "chrono", "uuid"] }
uuid = { version = "1", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
jsonwebtoken = "9"
bcrypt = "0.16"
tower-http = { version = "0.6", features = ["cors", "trace"] }
tracing = "0.1"
tracing-subscriber = "0.3"
dotenvy = "0.15"
thiserror = "2"

## Architecture

src/
├── main.rs              (server startup, router)
├── config.rs            (env vars, app config)
├── error.rs             (AppError enum, IntoResponse impl)
├── auth/
│   ├── mod.rs
│   ├── handler.rs       (register, login, refresh, me)
│   ├── jwt.rs           (token generation/validation)
│   └── middleware.rs     (auth guard middleware)
├── users/
│   ├── mod.rs
│   ├── handler.rs       (profile CRUD)
│   └── model.rs         (User, UserProfile structs)
├── protocol/
│   ├── mod.rs
│   ├── handler.rs       (schedule, session start/complete)
│   ├── engine.rs        (Rust port of protocol generation)
│   └── model.rs
├── streak/
│   ├── mod.rs
│   ├── handler.rs
│   └── model.rs
├── nback/
│   ├── mod.rs
│   ├── handler.rs
│   └── model.rs
├── srs/
│   ├── mod.rs
│   ├── handler.rs       (due cards, review, CRUD)
│   ├── algorithm.rs     (SM-2 in Rust)
│   └── model.rs
├── analytics/
│   ├── mod.rs
│   ├── handler.rs
│   └── model.rs
└── db/
    ├── mod.rs
    └── migrations/      (SQL migration files)

## Implement ALL API routes from the blueprint:
(Auth, Onboarding, Protocol, Streak, N-Back, SRS, Analytics, Settings, Billing)

## Key Implementation Details:

1. Auth: bcrypt password hashing, JWT access tokens (15 min), 
   refresh tokens (7 days, stored in DB), HttpOnly cookie for refresh

2. Protocol Engine: Port the TypeScript logic to Rust.
   Accept UserProfile, return Vec<ProtocolItem>.

3. Streak Enforcement: Background task (tokio::spawn) that runs 
   at midnight per user's timezone to check daily completion.

4. SRS Algorithm: Port SM-2 to Rust (pure function, same logic).

5. CORS: Allow frontend origins (localhost:5173, production domain).

6. Error handling: Custom AppError enum with proper HTTP status codes.
   All handlers return Result<Json<T>, AppError>.

7. Database: Use sqlx with compile-time query checking.
   Create migration files for all tables from the schema.

8. Validation: Validate all input at the handler level.
   Reject invalid data with 400 Bad Request + descriptive message.
```

---

## PHASE 11: Authentication & User Flow
**Estimated time: 4-6 hours**
**Dependencies: Phase 0-3, Phase 10 (backend)**

### Claude Code Prompt:
```
PHASE 11: Implement authentication flow in the SvelteKit frontend.

Connect to the Rust/Axum API. Implement:
- Register page (email, password, name)
- Login page
- Forgot password flow
- Auth store (JWT management, auto-refresh)
- Auth guard (redirect to /login if not authenticated)
- Protected routes (all /app/* routes)
- Logout
- Connect onboarding to save profile to API on completion
- Load protocol from API on dashboard load
```

---

## PHASE 12: Payments (Stripe)
**Estimated time: 4-6 hours**
**Dependencies: Phase 10, 11**

### Claude Code Prompt:
```
PHASE 12: Implement Stripe subscription billing.

Frontend:
- Pricing page with tier comparison
- Checkout button → Stripe Checkout Session
- Success/cancel return pages
- Subscription management in settings
- Feature gating (Free tier = Level 1 only)

Backend:
- POST /api/billing/create-checkout → Stripe Checkout Session
- POST /api/billing/webhook → Handle Stripe events
  (checkout.session.completed, customer.subscription.updated,
   customer.subscription.deleted, invoice.payment_failed)
- Middleware: Check subscription status on protected endpoints
```

---

## PHASE 13: Settings, Polish & QA
**Estimated time: 6-8 hours**
**Dependencies: All previous phases**

### Claude Code Prompt:
```
PHASE 13: Settings page, final polish, and quality assurance.

1. Settings page (src/routes/app/settings/+page.svelte):
   - Profile section (avatar, name, profession)
   - Schedule editing (re-do any onboarding question)
   - Notification preferences (toggles for each notification type)
   - Intensity adjustment (change commitment level)
   - Integrations section (Apple Health placeholder)
   - Data export (CSV download)
   - Account management (subscription, reset progress, delete account)

2. Polish:
   - Page transition animations between all routes
   - Loading skeletons for all async data
   - Empty states for all lists (no data yet)
   - Error boundaries for every page
   - Offline handling (show "You're offline" toast, queue actions)
   - Responsive testing: 375px, 414px, 768px, 1024px, 1440px
   - Dark mode (already default — ensure no white flashes on load)
   - Reduce motion: Respect prefers-reduced-motion media query

3. Performance:
   - Lazy load Chart.js and GSAP (dynamic imports)
   - Image optimization (if any images used)
   - Code splitting per route (SvelteKit does this automatically)
   - Service worker caching strategy
   - Lighthouse audit: Target 95+ on all metrics

4. Accessibility:
   - All interactive elements have aria labels
   - Focus visible on all focusable elements
   - Skip navigation link
   - Screen reader announcements for timer events
   - Color contrast: 4.5:1 minimum ratio

5. Testing:
   - Unit tests for: protocol engine, SRS algorithm, N-Back engine, streak logic
   - Component tests for: Timer, N-Back game, SRS review
   - Use Vitest + @testing-library/svelte
```

---

## EXECUTION ORDER SUMMARY

```
Phase 0:  Scaffold + Design System        [2-3 hrs]   ← START HERE
Phase 1:  UI Component Library             [4-6 hrs]
Phase 2:  Onboarding Flow                  [8-12 hrs]
Phase 3:  Dashboard & Timeline             [6-8 hrs]
Phase 4:  Timer System                     [4-6 hrs]
Phase 5:  N-Back Training Game             [6-8 hrs]
Phase 6:  Spaced Repetition System         [4-6 hrs]
Phase 7:  Analytics Dashboard              [4-6 hrs]
Phase 8:  Marketing + Try Me Demo          [8-10 hrs]
Phase 9:  Capacitor Mobile                 [4-6 hrs]
Phase 10: Backend API (Rust/Axum)          [12-16 hrs] ← Can run parallel to 3-8
Phase 11: Auth Integration                 [4-6 hrs]
Phase 12: Stripe Payments                  [4-6 hrs]
Phase 13: Settings, Polish, QA             [6-8 hrs]
─────────────────────────────────────────────────────
TOTAL ESTIMATED:                           78-107 hrs
```

### How to Use These Phases with Claude Code:

1. Start a new Claude Code session
2. Paste the MASTER CONTEXT block
3. Paste the specific Phase prompt
4. Let Claude Code execute
5. Test the output manually
6. Fix any issues in follow-up prompts
7. Commit: `git add -A && git commit -m "feat: Phase {N} — {description}"`
8. Start next phase in a new session (or continue if context allows)

### Critical Rules:
- NEVER skip phases or combine phases
- ALWAYS test Phase N before starting Phase N+1
- ALWAYS include the MASTER CONTEXT in every session
- If Claude Code produces errors, fix them BEFORE moving forward
- Each phase should result in a working, testable increment
