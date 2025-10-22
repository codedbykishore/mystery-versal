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
 * Unlocking flow:
 * - r/Math (1), r/History (2), r/Codes (3) are always unlocked (starting points)
 * - r/Math (1) unlocks r/Science (4)
 * - r/Science (4) unlocks r/Biology (7)
 * - r/Biology (7) unlocks r/Linguistics (8)
 * - r/History (2) unlocks r/Geography (5)
 * - r/Geography (5) unlocks r/Linguistics (8)
 * - r/Codes (3) unlocks r/Chemistry (6)
 * - r/Chemistry (6) unlocks r/Art (9)
 * - r/Art (9) unlocks r/Linguistics (8)
 */
export const isPuzzleUnlocked = (puzzleId: number, gameState: GlobalGameState): boolean => {
  const solvedPuzzles = gameState.solvedPuzzles;
  
  switch (puzzleId) {
    case 1: // r/Math - always unlocked (starting point)
      return true;
    
    case 2: // r/History - always unlocked (starting point)
      return true;
    
    case 3: // r/Codes - always unlocked (starting point)
      return true;
    
    case 4: // r/Science - unlocked by r/Math
      return solvedPuzzles.includes(1);
    
    case 5: // r/Geography - unlocked by r/History
      return solvedPuzzles.includes(2);
    
    case 6: // r/Chemistry - unlocked by r/Codes
      return solvedPuzzles.includes(3);
    
    case 7: // r/Biology - unlocked by r/Science
      return solvedPuzzles.includes(4);
    
    case 8: // r/Linguistics - unlocked by r/Biology OR r/Geography OR r/Art
      return solvedPuzzles.includes(7) || solvedPuzzles.includes(5) || solvedPuzzles.includes(9);
    
    case 9: // r/Art - unlocked by r/Chemistry
      return solvedPuzzles.includes(6);
    
    default:
      return false;
  }
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
 * Check if a path (set) is completed
 */
export const isSetCompleted = (setNumber: number, gameState: GlobalGameState): boolean => {
  const setConfig = setConfiguration.sets[setNumber];
  if (!setConfig) return false;

  return setConfig.puzzles.every(puzzleId => 
    gameState.solvedPuzzles.includes(puzzleId)
  );
};

/**
 * Get completed paths
 */
export const getCompletedSets = (gameState: GlobalGameState): number[] => {
  const completedSets: number[] = [];
  
  // Check each set for completion
  for (let setNum = 1; setNum <= 3; setNum++) {
    if (isSetCompleted(setNum, gameState)) {
      completedSets.push(setNum);
    }
  }
  
  return completedSets;
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