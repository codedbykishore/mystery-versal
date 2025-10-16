// Game State Response
export interface GameStateResponse {
  solvedPuzzles: number[];
  currentSet: number;
  completedSets: number[];
  totalSolved: number;
  isComplete: boolean;
  lastUpdated: string;
}

// Answer Submission Response
export interface SubmitAnswerResponse {
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
export interface PuzzleDataResponse {
  puzzles: Puzzle[];
  gridMapping: GridPosition[];
  setConfiguration: SetConfig;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
  timestamp: string;
}
// Import game types
import { Puzzle, GridPosition, SetConfig } from './game';