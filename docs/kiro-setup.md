MYSTERY VERSAL - COLLABORATIVE PUZZLE HUNT GAME

PROJECT OVERVIEW
Build a Devvit Web app (React + TypeScript + Tailwind CSS) that displays a 3x3 jigsaw puzzle grid where users solve cross-community puzzles to unlock pieces and reveal a final image. Progress is GLOBAL across all users (not individual).

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

VISUAL DESIGN

- Background: #FAFAFA (off-white)
- Tiles: White cards with subtle shadows
- Locked tiles: opacity 0.3, grayscale, lock icon
- Unlocked unsolved tiles: opacity 0.7, partially visible
- Solved tiles: Full color, shows image piece
- Puzzle page: Full screen, centered content, clean layout
- Success animation: Green checkmark fade-in, confetti particles
- Typography: System fonts, 14px body, 20px headings, 32px page titles

UI FLOWS

Flow 1: First Time User (Fresh Game with Scrambled Grid)
1. Sees 3x3 grid, 3 tiles unlocked (Set 1: puzzles 1,2,3 in scrambled positions), 6 locked
2. Clicks gridPosition 5 which contains Puzzle 1 (r/Math)
3. Navigates to full puzzle page for r/Math
4. Clicks "Go to r/Math Post" → opens Reddit in new tab
5. Reads question, returns to puzzle page
6. Types answer "1" and submits
7. Success message: "✅ CORRECT!!! Hint for r/History: [hint]"
8. Returns to grid, gridPosition 5 now shows as solved
9. User looks for r/History tile, finds it at gridPosition 1
10. Solves Puzzle 2, gets hint for r/Codes
11. Finds r/Codes at gridPosition 8, solves it
12. After solving all 3 → Set 2 unlocks (Puzzles 4,5,6 appear in their scrambled positions)
13. Continue until all 9 solved

Flow 2: Late Joiner (Some Puzzles Already Solved)
1. Opens app, sees 3x3 grid in scrambled arrangement
2. 4 tiles already solved (by other users), 2 tiles active, 3 locked
3. Can click solved tiles to see "Already solved by community"
4. Can click active tiles to solve
5. Solves remaining puzzles in current set
6. Next set unlocks for everyone

Flow 3: Completing Final Puzzle
1. User solves 8th puzzle
2. One tile in Set 3 remains (in its scrambled position)
3. Solves 9th puzzle
4. All 9 pieces animate together in grid formation
5. Golden glow effect
6. Navigate to victory page
7. Text message: "KNOWLEDGE IS POWER..."
8. Celebration animation

MOBILE OPTIMIZATION

- Grid: 3 columns on all screen sizes
- Tiles: Min 80px x 80px (touch-friendly)
- Puzzle page: Full screen, large touch targets
- Buttons: 44px minimum height
- Works in Reddit's mobile web view
- Responsive text sizes

SUCCESS CRITERIA

- 3x3 grid displays with scrambled puzzle positions
- Set-based unlocking works (3 → 3 → 3) regardless of visual scrambling
- Hints flow linearly by puzzle ID, not grid position
- Full page navigation smooth
- Global state persists and updates
- Answer validation works
- Jigsaw puzzle visual forms properly in scrambled grid
- Mobile responsive
- New users see already-solved puzzles
- No bugs in core flow

BUILD PRIORITY

Week 1:
- Basic 3x3 grid UI with scrambled positioning logic
- Full page puzzle view with routing
- Answer validation
- Set-based unlock logic (by puzzle ID, not position)
- Global state in Redis

Week 2:
- Jigsaw puzzle visual (image pieces match grid positions)
- Animations
- Global progress updates
- Polish and demo

CONSTRAINTS

- Must use Devvit platform (no external hosting)
- Must work inside Reddit posts
- Bundle size < 500KB
- Fast loading (< 3 seconds)
- Global state must be reliable and consistent

IMPORTANT: The separation between puzzle order (for logic) and grid position (for display) is the core mechanic that creates mystery and discovery. Users must explore the grid to find which subreddit is which, making it more engaging than a predictable sequential layout.

This is a hackathon project. Prioritize working functionality over perfection. Build incrementally and test frequently. Focus on the scrambled grid system, global progress, and set-based unlocking as these are the unique features.
