import { useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { 
  getPuzzleById, 
  getPuzzlesInSet, 
  puzzleIdToGridPosition, 
  gridPositionToPuzzleId,
  getTileState 
} from '../../shared/utils/gridUtils';

/**
 * Hook for accessing puzzle data and utility functions
 */
const usePuzzleData = () => {
  const { puzzles, gameState, gridMapping } = useGameContext();

  const puzzleUtils = useMemo(() => ({
    // Get puzzle by ID
    getPuzzle: (puzzleId: number) => getPuzzleById(puzzleId),
    
    // Get puzzles in a specific set
    getPuzzlesInSet: (setNumber: number) => getPuzzlesInSet(setNumber),
    
    // Position mapping utilities
    puzzleToGrid: (puzzleId: number) => puzzleIdToGridPosition(puzzleId),
    gridToPuzzle: (gridPosition: number) => gridPositionToPuzzleId(gridPosition),
    
    // Get tile state for a puzzle
    getTileState: (puzzleId: number) => getTileState(puzzleId, gameState),
    
    // Get next puzzle in sequence
    getNextPuzzle: (currentPuzzleId: number) => {
      const nextId = currentPuzzleId + 1;
      return nextId <= 9 ? getPuzzleById(nextId) : null;
    },
    
    // Get previous puzzle in sequence
    getPreviousPuzzle: (currentPuzzleId: number) => {
      const prevId = currentPuzzleId - 1;
      return prevId >= 1 ? getPuzzleById(prevId) : null;
    },
    
    // Get puzzles by state
    getUnlockedPuzzles: () => {
      return gridMapping
        .filter(tile => tile.state === 'unlocked' && tile.puzzleId)
        .map(tile => getPuzzleById(tile.puzzleId!))
        .filter(Boolean);
    },
    
    getSolvedPuzzles: () => {
      return gridMapping
        .filter(tile => tile.state === 'solved' && tile.puzzleId)
        .map(tile => getPuzzleById(tile.puzzleId!))
        .filter(Boolean);
    },
    
    getLockedPuzzles: () => {
      return gridMapping
        .filter(tile => tile.state === 'locked' && tile.puzzleId)
        .map(tile => getPuzzleById(tile.puzzleId!))
        .filter(Boolean);
    }
  }), [puzzles, gameState, gridMapping]);

  return {
    puzzles,
    gridMapping,
    ...puzzleUtils
  };
};

export default usePuzzleData;