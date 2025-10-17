import { GlobalGameState, GridPosition, TileState } from '../types';
import { puzzleConfiguration, setConfiguration, gridToPuzzleMapping, puzzleToGridMapping } from '../data/puzzleConfig';

/**
 * Convert puzzle ID to grid position
 */
export const puzzleIdToGridPosition = (puzzleId: number): number => {
  return puzzleToGridMapping[puzzleId] || 0;
};

/**
 * Convert grid position to puzzle ID
 */
export const gridPositionToPuzzleId = (gridPosition: number): number => {
  return gridToPuzzleMapping[gridPosition] || 0;
};

/**
 * Determine if a puzzle is unlocked based on current game state
 */
export const isPuzzleUnlocked = (puzzleId: number, gameState: GlobalGameState): boolean => {
  const puzzle = puzzleConfiguration.find(p => p.id === puzzleId);
  if (!puzzle) return false;

  const setConfig = setConfiguration.sets[puzzle.set];
  if (!setConfig) return false;

  // Set 1 is always unlocked
  if (puzzle.set === 1) return true;

  // Check if all required puzzles from previous set are solved
  const requiredPuzzles = setConfig.unlockRequirement;
  return requiredPuzzles.every(reqPuzzleId => 
    gameState.solvedPuzzles.includes(reqPuzzleId)
  );
};

/**
 * Determine tile state based on puzzle and game state
 */
export const getTileState = (puzzleId: number, gameState: GlobalGameState): TileState => {
  if (gameState.solvedPuzzles.includes(puzzleId)) {
    return 'solved';
  }
  
  if (isPuzzleUnlocked(puzzleId, gameState)) {
    return 'unlocked';
  }
  
  return 'locked';
};

/**
 * Generate grid mapping for UI display
 */
export const generateGridMapping = (gameState: GlobalGameState): GridPosition[] => {
  const gridMapping: GridPosition[] = [];

  for (let position = 1; position <= 9; position++) {
    const puzzleId = gridPositionToPuzzleId(position);
    const puzzle = puzzleConfiguration.find(p => p.id === puzzleId);
    
    if (puzzle) {
      const state = getTileState(puzzleId, gameState);
      
      gridMapping.push({
        position,
        puzzleId,
        state,
        imagePiece: puzzle.imagePiece
      });
    } else {
      // Fallback for invalid positions
      gridMapping.push({
        position,
        puzzleId: null,
        state: 'locked',
        imagePiece: null
      });
    }
  }

  return gridMapping;
};

/**
 * Check if a set is completed
 */
export const isSetCompleted = (setNumber: number, gameState: GlobalGameState): boolean => {
  const setConfig = setConfiguration.sets[setNumber];
  if (!setConfig) return false;

  return setConfig.puzzles.every(puzzleId => 
    gameState.solvedPuzzles.includes(puzzleId)
  );
};

/**
 * Get the next set that should be unlocked
 */
export const getNextUnlockedSet = (gameState: GlobalGameState): number | null => {
  // Check if set 2 should be unlocked
  if (gameState.currentSet === 1 && isSetCompleted(1, gameState)) {
    return 2;
  }
  
  // Check if set 3 should be unlocked
  if (gameState.currentSet === 2 && isSetCompleted(2, gameState)) {
    return 3;
  }
  
  return null;
};

/**
 * Validate set-based unlock logic
 */
export const validateSetUnlock = (gameState: GlobalGameState): {
  shouldUnlockSet: number | null;
  completedSets: number[];
} => {
  const completedSets: number[] = [];
  
  // Check each set for completion
  for (let setNum = 1; setNum <= 3; setNum++) {
    if (isSetCompleted(setNum, gameState)) {
      completedSets.push(setNum);
    }
  }
  
  const shouldUnlockSet = getNextUnlockedSet(gameState);
  
  return {
    shouldUnlockSet,
    completedSets
  };
};

/**
 * Get puzzle by ID
 */
export const getPuzzleById = (puzzleId: number) => {
  return puzzleConfiguration.find(p => p.id === puzzleId);
};

/**
 * Get puzzles in a specific set
 */
export const getPuzzlesInSet = (setNumber: number) => {
  return puzzleConfiguration.filter(p => p.set === setNumber);
};

/**
 * Check if game is complete
 */
export const isGameComplete = (gameState: GlobalGameState): boolean => {
  return gameState.solvedPuzzles.length === 9;
};