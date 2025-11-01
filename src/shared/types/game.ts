// Core game data types
export interface Puzzle {
  id: number;                    // Solve order (1-9)
  subreddit: string;            // e.g., "r/Math"
  title: string;                // Puzzle title (e.g., "The Foundation")
  postLink: string;             // Reddit post URL
  answer: string;               // Correct answer
  hintText: string;             // Hint for next puzzle
  targetSubreddit: string;      // Which subreddit hint is for
  set: number;                  // Set number (1, 2, or 3)
  gridPosition: number;         // Display position (1-9, scrambled)
  imagePiece: string;           // Path to jigsaw piece image
}

// Global game state
export interface GlobalGameState {
  solvedPuzzles: number[];      // [1, 2, 3] - solved puzzle IDs
  currentSet: number;           // 1, 2, or 3 - currently unlocked set
  completedSets: number[];      // [1] - fully completed sets
  totalSolved: number;          // Total count of solved puzzles
  isComplete: boolean;          // True when all 9 solved
  lastUpdated: string;          // ISO timestamp of last update
  version: number;              // For optimistic updates
}

// Grid display mapping
export interface GridPosition {
  position: number;             // 1-9 grid position
  puzzleId: number | null;      // Which puzzle occupies this position
  state: 'locked' | 'unlocked' | 'solved';
  imagePiece: string | null;    // Jigsaw piece image path
}

// Set configuration
export interface SetConfig {
  sets: {
    [key: number]: {
      puzzles: number[];
      unlockRequirement: number[];
    };
  };
}

// Tile state for UI
export type TileState = 'locked' | 'unlocked' | 'solved';