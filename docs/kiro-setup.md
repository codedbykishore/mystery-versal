MYSTERY VERSAL - COLLABORATIVE PUZZLE HUNT GAME

PROJECT OVERVIEW
Build a Devvit Web app (React + TypeScript + Tailwind CSS) that displays a 3x3 jigsaw puzzle grid where users solve cross-community puzzles to unlock pieces and reveal a final image. Progress is GLOBAL across all users (not individual).

CRITICAL: This must NOT look like a typical React app. Invest heavily in UI/UX to create a premium, polished experience that judges will remember.

CORE FUNCTIONALITY

1. 3x3 Grid Display with Scrambled Positions (CRITICAL)
- Display 9 puzzle tiles in a 3x3 grid layout
- Each tile represents a different subreddit: r/Math, r/History, r/Codes, r/Science, r/Geography, r/Linguistics, r/Chemistry, r/Biology, r/Art
- IMPORTANT: Puzzle solve order (1→2→3→4→5→6→7→8→9) is DIFFERENT from grid display positions
- Example: Puzzle 1 might be at grid position 5, Puzzle 2 at position 1, Puzzle 3 at position 8, etc.
- Grid positions are SCRAMBLED so users can't predict the linear order
- Visual states: 🔒 Locked (grey/faded), 🟡 Active (clickable/unlocked), ✅ Solved (colored, shows image piece)

2. Three-Tier Unlock System (CRITICAL)
- START STATE: Puzzles 1, 2, 3 are unlocked (first set) - but displayed in scrambled grid positions
- AFTER solving Puzzles 1, 2, 3 → Puzzles 4, 5, 6 unlock (second set) - also in scrambled positions
- AFTER solving Puzzles 4, 5, 6 → Puzzles 7, 8, 9 unlock (third set) - also in scrambled positions
- Users must complete each set before next set unlocks
- Example scrambled layout:
  Grid Position 1: Puzzle 4
  Grid Position 2: Puzzle 7
  Grid Position 3: Puzzle 2
  Grid Position 4: Puzzle 9
  Grid Position 5: Puzzle 1
  Grid Position 6: Puzzle 5
  Grid Position 7: Puzzle 8
  Grid Position 8: Puzzle 3
  Grid Position 9: Puzzle 6

3. Tile Interaction - FULL PAGE (NOT Modal)
- Click any unlocked tile → navigates to a new FULL PAGE view
- Full page contains:
  * Large subreddit name header (e.g., "r/Math Puzzle")
  * Button: "Go to r/Math Post" (opens external Reddit link in new tab)
  * Large text input field for answer
  * Submit button
  * Back button to return to grid
- After correct answer submission:
  * Show success message: "✅ CORRECT!!!!!"
  * Display hint text: "Hint for r/History: [hint text]"
  * Mark tile as solved globally
  * Return to grid view
  * If all tiles in current set are solved → unlock next set with animation

4. GLOBAL Progress System (CRITICAL)
- Progress is SHARED across ALL users (not individual)
- If Puzzle 1 is solved by User A → it's marked solved for EVERYONE
- New users see:
  * Already-solved puzzles (can view but don't need to re-solve)
  * Currently active puzzles (can solve)
  * Locked puzzles (not yet unlocked)
- Users can choose to skip already-solved puzzles or re-solve them for practice
- Store in Redis: Global state of which puzzles are solved

5. Linear Hint System
- Hints flow LINEARLY based on PUZZLE ORDER (not grid position)
- Puzzle 1 → provides hint for Puzzle 2
- Puzzle 2 → provides hint for Puzzle 3
- Puzzle 3 → provides hint for Puzzle 4
- ... and so on sequentially
- This order is fixed and logical, but hidden from users because of scrambled grid

6. Answer Validation (Server-Side)
- Store 9 puzzles with answers in data structure
- Development phase: Use simple answers (1, 2, 3, 4, 5, 6, 7, 8, 9)
- Validate user input against stored answer (case-insensitive, trim whitespace)
- When correct → mark puzzle as globally solved
- Return: { success: boolean, hint: string, nextSubreddit: string, setCompleted: boolean }

7. Jigsaw Puzzle Visual Completion
- Each of the 9 tiles contains 1/9th of a final image
- Image pieces correspond to GRID POSITIONS (not puzzle order)
- When locked: tile shows grey placeholder with lock icon
- When unlocked but unsolved: tile shows faded image piece
- When solved: tile shows full-color image piece
- When all 9 solved: complete image forms showing text:
  "KNOWLEDGE IS POWER, SCATTERED ACROSS MANY MINDS, UNITED IN PURPOSE"
- Add golden glow effect around completed puzzle

TECHNICAL REQUIREMENTS

Platform: Devvit Web (Reddit's developer platform)
Frontend: React 18 + TypeScript + Tailwind CSS + React Router (for page navigation)
State Management: React hooks (useState, useContext)
Backend: Devvit server endpoints
Database: Redis (built into Devvit) - stores GLOBAL game state
Build Tool: Vite
Animation Library: Framer Motion (for smooth, professional animations)

KEY COMPONENTS TO BUILD

1. App.tsx - Main app component with routing
2. GridPage.tsx - 3x3 grid view (home page)
3. PuzzleTile.tsx - Individual tile component
4. PuzzlePage.tsx - Full page puzzle solving view (replaces modal)
5. VictoryPage.tsx - Final completion screen
6. useGlobalGameState.ts - Custom hook for global state
7. server/puzzles.ts - Puzzle data and set configuration
8. server/validation.ts - Answer checking endpoint
9. server/globalProgress.ts - Global progress tracking

DATA STRUCTURE

const puzzles = [
  {
    id: 1,  // Puzzle solve order (1-9, sequential for hints)
    subreddit: "r/Math",
    postLink: "https://reddit.com/r/MVMath/post1",
    answer: "1",  // Test answer (change to real later)
    hintText: "Hint for r/History: The number is 1300",
    targetSubreddit: "r/History",
    set: 1,  // Which set this puzzle belongs to (1, 2, or 3)
    gridPosition: 5  // Where it appears in UI grid (1-9, scrambled)
  },
  {
    id: 2,
    subreddit: "r/History",
    postLink: "https://reddit.com/r/MVHistory/post2",
    answer: "2",
    hintText: "Hint for r/Codes: The key is 13",
    targetSubreddit: "r/Codes",
    set: 1,
    gridPosition: 1  // Different from puzzle ID - scrambled!
  },
  {
    id: 3,
    subreddit: "r/Codes",
    postLink: "https://reddit.com/r/MVCodes/post3",
    answer: "3",
    hintText: "Hint for r/Science: Element Carbon",
    targetSubreddit: "r/Science",
    set: 1,
    gridPosition: 8
  },
  // ... 6 more puzzles with scrambled gridPositions
]

const globalGameState = {
  solvedPuzzles: number[],  // [1, 2, 3] - solved puzzle IDs (not positions)
  currentSet: number,  // 1, 2, or 3 - which set is currently unlocked
  completedSets: number[],  // [1] - which sets are fully completed
  totalSolved: number,  // Total count of solved puzzles
  isComplete: boolean  // True when all 9 solved
}

CRITICAL IMPLEMENTATION DETAILS

1. Two Separate Systems - Puzzle Order vs Grid Position:
   
   PUZZLE ORDER (for logic/hints):
   - Sequential: 1, 2, 3, 4, 5, 6, 7, 8, 9
   - Used for: hint flow, set grouping, unlock logic
   - Puzzle 1 always gives hint for Puzzle 2
   
   GRID POSITION (for display):
   - Scrambled: Could be 5, 1, 8, 3, 7, 2, 9, 4, 6
   - Used for: visual placement in 3x3 grid, jigsaw pieces
   - Puzzle 1 might appear in position 5 (center of grid)
   
2. Set-Based Unlocking:
   Set 1: Puzzles 1, 2, 3 (solve order) → appear in scrambled grid positions
   Set 2: Puzzles 4, 5, 6 (solve order) → appear in scrambled grid positions
   Set 3: Puzzles 7, 8, 9 (solve order) → appear in scrambled grid positions
   
3. Grid Rendering Logic:
   - Sort puzzles by gridPosition (1-9) for display
   - Show locks based on puzzle set membership
   - Example: If Puzzle 4 is at gridPosition 1, and Set 2 isn't unlocked yet, gridPosition 1 shows locked

4. Global State Management:
   - ONE shared game state for all users
   - Redis stores: solvedPuzzles[] (by puzzle ID, not position)
   - When puzzle solved → update global state immediately
   - All connected users see updates in real-time (poll every 5-10 seconds)

5. Full Page Navigation:
   - Use React Router or simple conditional rendering
   - Routes: "/" (grid), "/puzzle/:id" (puzzle page by puzzle ID), "/victory" (completion)
   - Smooth transitions between pages
   - Back button always returns to grid

6. No Sharing Language:
   - Do NOT say "Share this hint"
   - Just display: "Hint for r/History: [text]"
   - Users decide organically if they want to post in other subreddits

7. Hint Flow Example with Scrambled Grid:
   User sees grid with positions scrambled
   Clicks gridPosition 5 → it's actually Puzzle 1 (r/Math)
   Solves it → gets "Hint for r/History" (Puzzle 2)
   User must find which grid position has r/History (maybe position 1)
   Clicks gridPosition 1 → it's Puzzle 2 (r/History)
   This creates discovery element - users must explore the grid

═══════════════════════════════════════════════════════════════════
PREMIUM UI/UX REQUIREMENTS (CRITICAL)
═══════════════════════════════════════════════════════════════════

DESIGN PHILOSOPHY
This MUST look like a premium product, not a typical React app. Think Apple, Linear, Vercel - clean, minimal, obsessed with details. Every pixel matters.

VISUAL DESIGN SYSTEM

Colors & Palette:
- Background: #FAFAFA (warm off-white, not harsh white)
- Surface: #FFFFFF (pure white for cards)
- Primary: #007AFF (iOS blue for CTAs)
- Success: #34C759 (bright green)
- Text Primary: #1D1D1F (near-black, readable)
- Text Secondary: #86868B (subtle grey for hints)
- Accent Gold: #FFD700 (for completion glow)
- Shadow: rgba(0, 0, 0, 0.08) (subtle, barely visible)

Typography:
- Font Stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
- Title (Mystery Versal): 48px, weight 700, letter-spacing -0.02em
- Page Headers: 32px, weight 600
- Puzzle Subreddit: 24px, weight 600
- Body Text: 16px, weight 400, line-height 1.6
- Labels: 14px, weight 500, letter-spacing 0.01em
- Hints: 14px, weight 400, italic
- All text must be crisp and perfectly aligned

Spacing System (8px base):
- Micro: 4px (tight elements)
- Small: 8px (related items)
- Medium: 16px (standard gap)
- Large: 24px (section spacing)
- XL: 32px (major sections)
- XXL: 48px (page margins)

UI COMPONENTS SPECIFICATION

1. Puzzle Tiles (Grid View):
   - Size: 120px x 120px on desktop, 100px x 100px on mobile
   - Border radius: 16px (generous, modern)
   - Shadow (unlocked): 0 4px 12px rgba(0,0,0,0.08)
   - Shadow (hover): 0 8px 24px rgba(0,0,0,0.12) (lift effect)
   - Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) (smooth easing)
   - Cursor: pointer (with custom hover state)
   
   Locked State:
   - Opacity: 0.4
   - Grayscale filter: 100%
   - Lock icon: 24px, centered, #86868B color
   - No hover effect
   
   Unlocked Unsolved State:
   - Opacity: 0.8
   - Subtle pulse animation (1.5s, infinite)
   - Border: 2px solid transparent
   - Hover: scale(1.05), brighter shadow
   
   Solved State:
   - Full opacity: 1
   - Shows vibrant image piece
   - Checkmark overlay: top-right, 20px, green background
   - No pulse animation

2. Grid Container:
   - Max width: 440px (contained, not full-screen)
   - Centered on page with generous vertical padding
   - Gap between tiles: 16px
   - Responsive: maintains aspect ratio on all screens

3. Buttons:
   - Height: 48px (touch-friendly)
   - Border radius: 12px
   - Font: 16px, weight 600
   - Padding: 0 24px
   - Transition: all 0.2s ease
   
   Primary Button:
   - Background: #007AFF
   - Color: white
   - Hover: background #0051D5, lift 2px
   - Active: scale(0.98)
   - Shadow: 0 2px 8px rgba(0, 122, 255, 0.3)
   
   Secondary Button:
   - Background: transparent
   - Border: 2px solid #007AFF
   - Color: #007AFF
   - Hover: background #F0F8FF
   
   Back Button:
   - Icon-only or with text
   - Minimal style, top-left, always visible
   - Hover: background rgba(0,0,0,0.05)

4. Input Fields:
   - Height: 56px (generous, easy to tap)
   - Border radius: 12px
   - Border: 2px solid #E5E5EA
   - Font size: 18px (readable)
   - Padding: 16px
   - Focus: border #007AFF, shadow 0 0 0 4px rgba(0,122,255,0.1)
   - Transition: all 0.2s ease
   - Placeholder: #C7C7CC (subtle)

5. Success Animation:
   - Green checkmark fades in with scale (0.5 → 1.2 → 1)
   - Confetti particles (20-30) burst from center
   - Haptic feedback if on mobile
   - Duration: 1.2s
   - Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bouncy)

6. Page Transitions:
   - Fade + slide: 400ms
   - Grid → Puzzle: slide up
   - Puzzle → Grid: slide down
   - Smooth, never jarring

LAYOUT SPECIFICATIONS

Grid Page:
┌────────────────────────────────────┐
│                                    │
│        MYSTERY VERSAL              │  ← 48px title, centered
│      The Ancient Cipher            │  ← 18px subtitle
│                                    │
│     [Progress: 3/9 Solved]         │  ← Subtle progress indicator
│                                    │
│    ┌───┐  ┌───┐  ┌───┐           │
│    │ 🔒│  │ ✅ │  │ 🔒│           │  ← Grid with generous spacing
│    └───┘  └───┘  └───┘           │
│    ┌───┐  ┌───┐  ┌───┐           │
│    │ 🟡│  │ 🟡│  │ 🔒│           │
│    └───┘  └───┘  └───┘           │
│    ┌───┐  ┌───┐  ┌───┐           │
│    │ 🟡│  │ 🔒│  │ 🔒│           │
│    └───┘  └───┘  └───┘           │
│                                    │
│    Clean, spacious, breathing      │
└────────────────────────────────────┘

Puzzle Page:
┌────────────────────────────────────┐
│  ← Back                            │  ← Top bar, minimal
│                                    │
│        r/Math Puzzle               │  ← 32px, centered
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Go to r/Math Post            │ │  ← Large, obvious CTA
│  └──────────────────────────────┘ │
│                                    │
│  Your Answer:                      │  ← Clear label
│  ┌──────────────────────────────┐ │
│  │ [___________________]        │ │  ← Huge input
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Submit Answer                │ │  ← Primary button
│  └──────────────────────────────┘ │
│                                    │
│  Massive whitespace, no clutter    │
└────────────────────────────────────┘

Success State:
┌────────────────────────────────────┐
│                                    │
│           ✅                       │  ← Big checkmark
│       CORRECT!!!                   │  ← Celebratory
│                                    │
│  ┌────────────────────────────┐   │
│  │ 💡 Hint for r/History:     │   │
│  │                            │   │  ← Card with hint
│  │ "The number is 1300"       │   │
│  └────────────────────────────┘   │
│                                    │
│  [Continue to Grid]                │  ← Clear next action
│                                    │
└────────────────────────────────────┘

ANIMATION REQUIREMENTS

Micro-interactions (CRITICAL for premium feel):
- Tile hover: Lift 4px, shadow expands, 200ms
- Button hover: Lift 2px, brighten, 150ms
- Input focus: Border glow expands, 200ms
- Click feedback: Scale 0.98, 100ms
- Unlock animation: Fade in + scale, 400ms
- Lock shake: Wiggle if clicked, 300ms

Macro-animations:
- Set unlock: Tiles animate in sequence (stagger 100ms each)
- Victory: All tiles pulse together, golden glow radiates outward
- Page transition: Smooth slide + fade, 400ms

Loading States:
- Skeleton screens (not spinners)
- Pulse animation on loading elements
- Smooth fade-in when content loads

ACCESSIBILITY

- All interactive elements: min 44x44px touch target
- Keyboard navigation: Tab through all elements
- Focus indicators: 2px outline, #007AFF, 4px offset
- ARIA labels on all icons and buttons
- High contrast mode support
- Screen reader friendly

MOBILE OPTIMIZATION

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Mobile-specific:
- Tiles: 100px x 100px
- Font sizes: +2px for readability
- Touch targets: minimum 48px
- Bottom padding: 32px (thumb zone)
- Fixed headers: none (let content scroll naturally)

POLISH REQUIREMENTS

Details that matter:
✅ All animations have proper easing (no linear)
✅ All shadows are subtle and realistic
✅ All text is perfectly aligned (no misalignment)
✅ All colors have sufficient contrast (WCAG AA)
✅ All interactive elements have hover/active states
✅ All page transitions are smooth
✅ No jarring movements or flashes
✅ Loading states are elegant
✅ Error states are friendly
✅ Empty states have helpful guidance

WHAT TO AVOID

❌ Generic Material UI / Bootstrap look
❌ Harsh shadows or borders
❌ Linear animations (use cubic-bezier)
❌ Cluttered layouts
❌ Too many colors
❌ Tiny text or touch targets
❌ Sudden movements
❌ Default browser styles
❌ Inconsistent spacing
❌ Poor typography hierarchy

INSPIRATION REFERENCES

Study these for design quality:
- Linear (linear.app) - clean, fast, beautiful
- Apple (apple.com) - minimal, spacious, premium
- Vercel (vercel.com) - modern, crisp, professional
- Stripe (stripe.com) - simple, elegant, functional

═══════════════════════════════════════════════════════════════════

UI FLOWS

Flow 1: First Time User (Fresh Game with Scrambled Grid)
1. Sees 3x3 grid, 3 tiles unlocked (Set 1: puzzles 1,2,3 in scrambled positions), 6 locked
2. Clicks gridPosition 5 which contains Puzzle 1 (r/Math)
3. Smooth page transition to puzzle view
4. Clicks "Go to r/Math Post" → opens Reddit in new tab
5. Reads question, returns to puzzle page
6. Types answer "1" and submits
7. Success animation with confetti
8. Shows hint card with smooth fade-in
9. Returns to grid with smooth transition
10. GridPosition 5 now shows as solved with checkmark
11. Continues solving other puzzles in Set 1
12. After all Set 1 solved → Set 2 tiles unlock with staggered animation

MOBILE OPTIMIZATION

- Grid: 3 columns on all screen sizes
- Tiles: Min 80px x 80px (touch-friendly)
- Puzzle page: Full screen, large touch targets
- Buttons: 44px minimum height
- Works in Reddit's mobile web view
- Responsive text sizes

SUCCESS CRITERIA

✅ Looks like a premium product (not typical React app)
✅ 3x3 grid displays with scrambled puzzle positions
✅ Set-based unlocking works (3 → 3 → 3)
✅ All animations smooth and delightful
✅ Minimal, clean, uncluttered design
✅ Perfect spacing and typography
✅ All micro-interactions polished
✅ Mobile responsive and touch-friendly
✅ Global state persists and updates
✅ Answer validation works
✅ Jigsaw puzzle visual forms beautifully
✅ No bugs in core flow

BUILD PRIORITY

Week 1:
- Basic 3x3 grid UI with EXCELLENT visual design
- Full page puzzle view with smooth transitions
- Answer validation
- Set-based unlock logic
- Global state in Redis

Week 2:
- Jigsaw puzzle visual with quality image
- Polish all animations (success, unlock, transition)
- Perfect all micro-interactions
- Test and refine UX
- Demo video

CONSTRAINTS

- Must use Devvit platform (no external hosting)
- Must work inside Reddit posts
- Bundle size < 500KB
- Fast loading (< 3 seconds)
- Global state must be reliable
- MUST look premium and polished

FINAL NOTE

This is a hackathon project competing for $15,000. The UI/UX quality will be a major differentiator. Judges see dozens of apps - this one must stand out visually. Every detail matters. Make it beautiful, make it smooth, make it memorable.

Focus on: Clean design, smooth animations, perfect spacing, premium feel, minimal but stunning.

