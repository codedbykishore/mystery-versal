# Design Document

## Overview

Mystery Versal is a collaborative puzzle hunt game built on the Devvit platform that creates a premium, engaging experience for Reddit users. The game features a 3x3 jigsaw puzzle grid where users solve cross-community puzzles to unlock pieces and reveal a final image. The core innovation is the global progress system where all users contribute to the same shared puzzle state, combined with a scrambled grid layout that creates discovery and exploration elements.

The application follows a client-server architecture with React on the frontend, Express on the backend, and Redis for persistent global state management. The design prioritizes premium UI/UX with smooth animations, responsive design, and accessibility compliance.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Reddit User   │    │   Reddit User   │    │   Reddit User   │
│   (Browser)     │    │   (Browser)     │    │   (Browser)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Devvit Platform       │
                    │   (Reddit Infrastructure) │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│  React Client   │    │ Express Server  │    │ Redis Database  │
│   (Frontend)    │    │   (Backend)     │    │ (Global State)  │
│                 │    │                 │    │                 │
│ • Grid Display  │◄──►│ • API Routes    │◄──►│ • Game State    │
│ • Puzzle Pages  │    │ • Validation    │    │ • Solved Status │
│ • Animations    │    │ • State Mgmt    │    │ • Progress Data │
│ • UI/UX         │    │ • Reddit API    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Express.js + Devvit Server SDK
- **Database**: Redis (built into Devvit platform)
- **Build System**: Vite for both client and server
- **Platform**: Devvit Web (Reddit's developer platform)
- **Routing**: React Router for client-side navigation

### Data Flow

1. **User Interaction**: User clicks on puzzle tile in React client
2. **Navigation**: Client routes to puzzle page with puzzle ID
3. **Answer Submission**: User submits answer via API call to Express server
4. **Validation**: Server validates answer and updates global state in Redis
5. **State Broadcast**: All connected clients poll for state updates
6. **UI Update**: Clients update grid display and unlock animations

## Components and Interfaces

### Frontend Components

#### Core Components

**App.tsx**
- Main application component with routing setup
- Manages global state context
- Handles error boundaries and loading states

**GridPage.tsx**
- Displays the 3x3 puzzle grid
- Manages tile states (locked, unlocked, solved)
- Handles grid animations and transitions
- Shows progress indicators

**PuzzleTile.tsx**
- Individual tile component with three states:
  - Locked: Grey placeholder with lock icon
  - Unlocked: Faded image piece with pulse animation
  - Solved: Full-color image piece with checkmark
- Handles hover effects and click interactions
- Manages jigsaw piece rendering

**PuzzlePage.tsx**
- Full-page puzzle solving interface
- Contains subreddit header, Reddit link button, answer input, submit button
- Manages answer submission and success states
- Displays hint information after successful solve

**VictoryPage.tsx**
- Final completion screen when all puzzles solved
- Shows complete jigsaw image with golden glow effect
- Displays completion message and celebration animations

#### Utility Components

**LoadingSpinner.tsx**
- Elegant loading states with skeleton screens
- Pulse animations for loading elements

**SuccessAnimation.tsx**
- Celebratory animations with confetti particles
- Smooth checkmark animations with proper easing

**ErrorBoundary.tsx**
- Graceful error handling with user-friendly messages
- Fallback UI for component failures

### Custom Hooks

**useGlobalGameState.ts**
```typescript
interface GlobalGameState {
  solvedPuzzles: number[];
  currentSet: number;
  completedSets: number[];
  totalSolved: number;
  isComplete: boolean;
  loading: boolean;
  error: string | null;
}

const useGlobalGameState = () => {
  // Manages global state polling
  // Handles state updates and synchronization
  // Provides loading and error states
}
```

**usePuzzleData.ts**
```typescript
const usePuzzleData = () => {
  // Provides puzzle configuration data
  // Handles puzzle-to-grid position mapping
  // Manages set-based unlock logic
}
```

**useAnimations.ts**
```typescript
const useAnimations = () => {
  // Manages Framer Motion animation variants
  // Provides consistent animation timing and easing
  // Handles staggered animations for set unlocks
}
```

### Backend API Endpoints

**GET /api/game-state**
- Returns current global game state
- Includes solved puzzles, current set, completion status

**POST /api/submit-answer**
- Validates puzzle answers
- Updates global state on correct answers
- Returns success status, hints, and set completion info

**GET /api/puzzle-data**
- Returns puzzle configuration and metadata
- Includes subreddit links, grid positions, set assignments

**POST /api/reset-game** (Development only)
- Resets global game state for testing
- Only available in development environment

### API Response Types

```typescript
// Game State Response
interface GameStateResponse {
  solvedPuzzles: number[];
  currentSet: number;
  completedSets: number[];
  totalSolved: number;
  isComplete: boolean;
  lastUpdated: string;
}

// Answer Submission Response
interface SubmitAnswerResponse {
  success: boolean;
  puzzleId: number;
  hint?: string;
  targetSubreddit?: string;
  setCompleted?: boolean;
  newSetUnlocked?: number;
  isGameComplete?: boolean;
  error?: string;
}

// Puzzle Data Response
interface PuzzleDataResponse {
  puzzles: Puzzle[];
  gridMapping: GridPosition[];
  setConfiguration: SetConfig;
}
```

## Data Models

### Puzzle Configuration

```typescript
interface Puzzle {
  id: number;                    // Solve order (1-9)
  subreddit: string;            // e.g., "r/Math"
  postLink: string;             // Reddit post URL
  answer: string;               // Correct answer
  hintText: string;             // Hint for next puzzle
  targetSubreddit: string;      // Which subreddit hint is for
  set: number;                  // Set number (1, 2, or 3)
  gridPosition: number;         // Display position (1-9, scrambled)
  imagePiece: string;           // Path to jigsaw piece image
}

const puzzleConfiguration: Puzzle[] = [
  {
    id: 1,
    subreddit: "r/Math",
    postLink: "https://reddit.com/r/MVMath/post1",
    answer: "1",
    hintText: "Hint for r/History: The number is 1300",
    targetSubreddit: "r/History",
    set: 1,
    gridPosition: 5,  // Center position
    imagePiece: "/images/piece-1.png"
  },
  {
    id: 2,
    subreddit: "r/History",
    postLink: "https://reddit.com/r/MVHistory/post2",
    answer: "2",
    hintText: "Hint for r/Codes: The key is 13",
    targetSubreddit: "r/Codes",
    set: 1,
    gridPosition: 1,  // Top-left position
    imagePiece: "/images/piece-2.png"
  }
  // ... 7 more puzzles with scrambled gridPositions
];
```

### Global Game State

```typescript
interface GlobalGameState {
  solvedPuzzles: number[];      // [1, 2, 3] - solved puzzle IDs
  currentSet: number;           // 1, 2, or 3 - currently unlocked set
  completedSets: number[];      // [1] - fully completed sets
  totalSolved: number;          // Total count of solved puzzles
  isComplete: boolean;          // True when all 9 solved
  lastUpdated: string;          // ISO timestamp of last update
  version: number;              // For optimistic updates
}
```

### Grid Display Mapping

```typescript
interface GridPosition {
  position: number;             // 1-9 grid position
  puzzleId: number | null;      // Which puzzle occupies this position
  state: 'locked' | 'unlocked' | 'solved';
  imagePiece: string | null;    // Jigsaw piece image path
}

// Example scrambled mapping
const gridMapping: GridPosition[] = [
  { position: 1, puzzleId: 2, state: 'unlocked', imagePiece: '/images/piece-2.png' },
  { position: 2, puzzleId: 7, state: 'locked', imagePiece: '/images/piece-7.png' },
  { position: 3, puzzleId: 4, state: 'locked', imagePiece: '/images/piece-4.png' },
  { position: 4, puzzleId: 9, state: 'locked', imagePiece: '/images/piece-9.png' },
  { position: 5, puzzleId: 1, state: 'unlocked', imagePiece: '/images/piece-1.png' },
  // ... etc
];
```

## Error Handling

### Client-Side Error Handling

**Network Errors**
- Retry logic with exponential backoff
- Offline state detection and user notification
- Graceful degradation when server unavailable

**Validation Errors**
- Real-time input validation with clear error messages
- Form state management with proper error display
- User-friendly error recovery suggestions

**State Synchronization Errors**
- Conflict resolution for concurrent updates
- Optimistic updates with rollback capability
- Clear indication when state is out of sync

### Server-Side Error Handling

**Answer Validation Errors**
- Detailed logging for debugging
- Sanitized error messages for client
- Rate limiting to prevent abuse

**Redis Connection Errors**
- Connection retry logic with circuit breaker
- Fallback to in-memory state for development
- Proper error propagation to client

**Reddit API Errors**
- Graceful handling of API rate limits
- Fallback behavior when Reddit services unavailable
- User notification for external service issues

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // User-friendly error message
    details?: any;          // Additional error context
    retryable: boolean;     // Whether client should retry
  };
  timestamp: string;
}
```

## Testing Strategy

### Unit Testing

**Frontend Components**
- React Testing Library for component behavior
- Jest for utility functions and hooks
- Mock API responses for isolated testing
- Accessibility testing with jest-axe

**Backend Logic**
- Jest for API endpoint testing
- Mock Redis operations for unit tests
- Answer validation logic testing
- Error handling scenario testing

### Integration Testing

**API Integration**
- End-to-end API flow testing
- Redis state persistence testing
- Concurrent user scenario testing
- Error recovery testing

**Client-Server Integration**
- Full user flow testing from grid to puzzle completion
- State synchronization testing
- Real-time update testing
- Cross-browser compatibility testing

### Performance Testing

**Load Testing**
- Concurrent user simulation
- Redis performance under load
- API response time monitoring
- Memory usage profiling

**Frontend Performance**
- Animation performance testing (60fps requirement)
- Bundle size optimization
- Loading time measurement
- Mobile performance testing

### Testing Data

```typescript
// Test puzzle configuration with simple answers
const testPuzzles: Puzzle[] = [
  {
    id: 1,
    subreddit: "r/TestMath",
    postLink: "https://reddit.com/r/test/1",
    answer: "1",
    hintText: "Test hint for puzzle 2",
    targetSubreddit: "r/TestHistory",
    set: 1,
    gridPosition: 5,
    imagePiece: "/test-images/piece-1.png"
  }
  // ... simplified test data
];
```

### Accessibility Testing

**WCAG 2.1 AA Compliance**
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation
- Focus management testing
- ARIA label verification

**Mobile Accessibility**
- Touch target size validation (44px minimum)
- Gesture accessibility
- Voice control compatibility
- Zoom functionality testing## P
remium UI/UX Design System

### Visual Design Philosophy

The design follows a premium, minimal aesthetic inspired by Apple, Linear, and Vercel. Every pixel is intentional, with obsessive attention to detail that creates a memorable experience for hackathon judges.

### Color Palette

```css
:root {
  /* Primary Colors */
  --bg-primary: #FAFAFA;        /* Warm off-white background */
  --surface: #FFFFFF;           /* Pure white for cards */
  --primary: #007AFF;           /* iOS blue for CTAs */
  --success: #34C759;           /* Bright green for success */
  
  /* Text Colors */
  --text-primary: #1D1D1F;      /* Near-black, readable */
  --text-secondary: #86868B;    /* Subtle grey for hints */
  
  /* Accent Colors */
  --accent-gold: #FFD700;       /* Golden glow for completion */
  --shadow: rgba(0, 0, 0, 0.08); /* Subtle shadows */
  
  /* State Colors */
  --locked: #E5E5EA;            /* Locked tile background */
  --unlocked: rgba(0, 122, 255, 0.1); /* Unlocked tile highlight */
  --solved: #34C759;            /* Solved tile accent */
}
```

### Typography System

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Typography Scale */
.title {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-header {
  font-size: 32px;
  font-weight: 600;
}

.puzzle-subreddit {
  font-size: 24px;
  font-weight: 600;
}

.body-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}

.label {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.hint-text {
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
}
```

### Spacing System (8px base)

```css
:root {
  --space-micro: 4px;    /* Tight elements */
  --space-small: 8px;    /* Related items */
  --space-medium: 16px;  /* Standard gap */
  --space-large: 24px;   /* Section spacing */
  --space-xl: 32px;      /* Major sections */
  --space-xxl: 48px;     /* Page margins */
}
```

### Component Specifications

#### Puzzle Tiles

```css
.puzzle-tile {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.puzzle-tile--locked {
  opacity: 0.4;
  filter: grayscale(100%);
  cursor: not-allowed;
}

.puzzle-tile--unlocked {
  opacity: 0.8;
  animation: pulse 1.5s infinite;
  box-shadow: 0 4px 12px var(--shadow);
}

.puzzle-tile--unlocked:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.puzzle-tile--solved {
  opacity: 1;
  box-shadow: 0 4px 12px var(--shadow);
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

#### Buttons

```css
.button-primary {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  padding: 0 24px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.button-primary:hover {
  background: #0051D5;
  transform: translateY(-2px);
}

.button-primary:active {
  transform: scale(0.98);
}

.button-secondary {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.button-secondary:hover {
  background: #F0F8FF;
}
```

#### Input Fields

```css
.input-field {
  height: 56px;
  border-radius: 12px;
  border: 2px solid #E5E5EA;
  font-size: 18px;
  padding: 16px;
  transition: all 0.2s ease;
  width: 100%;
}

.input-field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  outline: none;
}

.input-field::placeholder {
  color: #C7C7CC;
}
```

### Animation Specifications

#### Micro-interactions

```css
/* Tile Hover Animation */
@keyframes tileHover {
  from {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 12px var(--shadow);
  }
  to {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

/* Button Click Feedback */
@keyframes buttonClick {
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
}

/* Success Animation */
@keyframes successCheckmark {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

#### Page Transitions

```typescript
// Framer Motion variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Staggered tile animations
const gridVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const tileVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};
```

### Responsive Design

#### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) {
  /* Tablet styles */
  .puzzle-tile {
    width: 140px;
    height: 140px;
  }
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .puzzle-tile {
    width: 160px;
    height: 160px;
  }
}
```

#### Mobile Optimizations

```css
/* Touch-friendly targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Mobile grid adjustments */
@media (max-width: 639px) {
  .puzzle-grid {
    gap: 12px;
    padding: 16px;
  }
  
  .puzzle-tile {
    width: 100px;
    height: 100px;
  }
  
  .input-field {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

## Implementation Architecture

### State Management Flow

```typescript
// Global State Context
interface GameContextType {
  gameState: GlobalGameState;
  puzzles: Puzzle[];
  gridMapping: GridPosition[];
  actions: {
    submitAnswer: (puzzleId: number, answer: string) => Promise<void>;
    refreshState: () => Promise<void>;
    resetGame: () => Promise<void>; // Dev only
  };
}

// State update flow
const GameProvider: React.FC = ({ children }) => {
  const [gameState, setGameState] = useState<GlobalGameState>(initialState);
  
  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(refreshState, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const submitAnswer = async (puzzleId: number, answer: string) => {
    // Optimistic update
    // API call
    // Handle response
    // Update state
  };
};
```

### Routing Structure

```typescript
// React Router setup
const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<GridPage />} />
      <Route path="/puzzle/:id" element={<PuzzlePage />} />
      <Route path="/victory" element={<VictoryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);
```

### Performance Optimizations

#### Bundle Optimization

```typescript
// Code splitting for better performance
const PuzzlePage = lazy(() => import('./pages/PuzzlePage'));
const VictoryPage = lazy(() => import('./pages/VictoryPage'));

// Image optimization
const optimizedImages = {
  webp: '/images/pieces.webp',
  fallback: '/images/pieces.png'
};
```

#### Animation Performance

```typescript
// Use transform and opacity for 60fps animations
const animationConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
};

// Avoid layout thrashing
const performantAnimation = {
  transform: "translateY(-4px) scale(1.05)",
  willChange: "transform"
};
```

## Security Considerations

### Input Validation

```typescript
// Server-side answer validation
const validateAnswer = (input: string, correctAnswer: string): boolean => {
  const sanitized = input.trim().toLowerCase();
  const correct = correctAnswer.trim().toLowerCase();
  return sanitized === correct;
};

// Rate limiting
const rateLimiter = {
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 attempts per minute per user
  message: "Too many attempts, please try again later"
};
```

### Data Sanitization

```typescript
// Sanitize user inputs
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 100); // Limit length
};
```

## Deployment Strategy

### Build Process

```bash
# Production build
npm run build

# Deploy to Reddit
npm run deploy

# Publish for review
npm run launch
```

### Environment Configuration

```typescript
// Environment-specific settings
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    pollInterval: 2000,
    enableDevTools: true
  },
  production: {
    apiUrl: '/api',
    pollInterval: 5000,
    enableDevTools: false
  }
};
```

This comprehensive design document provides the foundation for implementing the Mystery Versal collaborative puzzle hunt game with premium UI/UX, robust architecture, and excellent performance characteristics suitable for a hackathon competition.