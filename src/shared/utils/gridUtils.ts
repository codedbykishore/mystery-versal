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

  // Get puzzles in this set (path)
  const puzzlesInSet = setConfig.puzzles;
  const puzzleIndex = puzzlesInSet.indexOf(puzzleId);
  
  if (puzzleIndex === -1) return false;
  
  // First puzzle in each path is always unlocked
  if (puzzleIndex === 0) return true;
  
  // For subsequent puzzles, check if the previous puzzle in the path is solved
  const previousPuzzleId = puzzlesInSet[puzzleIndex - 1];
  if (previousPuzzleId === undefined) return false;
  return gameState.solvedPuzzles.includes(previousPuzzleId);
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