import { useGameContext } from '../context/GameContext';

/**
 * Hook for accessing global game state and actions
 */
const useGlobalGameState = () => {
  const { gameState, loading, error, actions } = useGameContext();

  return {
    gameState,
    loading,
    error,
    submitAnswer: actions.submitAnswer,
    refreshState: actions.refreshState,
    resetGame: actions.resetGame,
    
    // Computed properties for convenience
    isGameComplete: gameState.isComplete,
    totalSolved: gameState.totalSolved,
    currentSet: gameState.currentSet,
    completedSets: gameState.completedSets,
    solvedPuzzles: gameState.solvedPuzzles,
    
    // Helper methods
    isPuzzleSolved: (puzzleId: number) => gameState.solvedPuzzles.includes(puzzleId),
    getProgress: () => ({
      solved: gameState.totalSolved,
      total: 9,
      percentage: Math.round((gameState.totalSolved / 9) * 100)
    })
  };
};

export default useGlobalGameState;