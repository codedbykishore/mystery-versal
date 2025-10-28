import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { GlobalGameState, Puzzle, GridPosition, SubmitAnswerResponse } from '../../shared/types';
import { puzzleConfiguration } from '../../shared/data/puzzleConfig';
import { generateGridMapping } from '../../shared/utils/gridUtils';

interface GameContextType {
  gameState: GlobalGameState;
  puzzles: Puzzle[];
  gridMapping: GridPosition[];
  loading: boolean;
  error: string | null;
  actions: {
    submitAnswer: (puzzleId: number, answer: string) => Promise<SubmitAnswerResponse>;
    refreshState: () => Promise<void>;
    resetGame: () => Promise<void>;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GlobalGameState>({
    solvedPuzzles: [],
    currentSet: 1,
    completedSets: [],
    totalSolved: 0,
    isComplete: false,
    lastUpdated: new Date().toISOString(),
    version: 1
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized puzzle data
  const puzzles = useMemo(() => puzzleConfiguration, []);
  
  // Generate grid mapping based on current game state
  const gridMapping = useMemo(() => {
    return generateGridMapping(gameState);
  }, [gameState]);

  const refreshState = async () => {
    console.log('GameContext: refreshState called');
    try {
      console.log('GameContext: Fetching /api/game-state');
      const response = await fetch('/api/game-state');
      console.log('GameContext: Game state response status:', response.status, 'ok:', response.ok);
      
      if (!response.ok) throw new Error('Failed to fetch game state');
      
      const data = await response.json();
      console.log('GameContext: Received game state:', data);
      console.log('GameContext: Setting game state with solvedPuzzles:', data.solvedPuzzles, 'totalSolved:', data.totalSolved);
      
      setGameState(data);
      setError(null);
      
      console.log('GameContext: Game state updated successfully');
    } catch (err) {
      console.error('GameContext: Error in refreshState:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (puzzleId: number, answer: string): Promise<SubmitAnswerResponse> => {
    try {
      // Optimistic update - temporarily add to solved puzzles
      const optimisticState = {
        ...gameState,
        solvedPuzzles: [...gameState.solvedPuzzles, puzzleId].sort((a, b) => a - b),
        totalSolved: gameState.totalSolved + 1,
        version: gameState.version + 1
      };
      setGameState(optimisticState);

      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId, answer })
      });
      
      if (!response.ok) {
        // Rollback optimistic update
        await refreshState();
        throw new Error('Failed to submit answer');
      }
      
      const result: SubmitAnswerResponse = await response.json();
      
      if (result.success) {
        // Refresh to get the actual server state
        await refreshState();
      } else {
        // Rollback optimistic update on incorrect answer
        await refreshState();
      }
      
      return result;
    } catch (err) {
      // Rollback optimistic update on error
      await refreshState();
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const resetGame = async () => {
    console.log('GameContext: resetGame called');
    try {
      console.log('GameContext: Fetching /api/reset-game');
      const response = await fetch('/api/reset-game', { method: 'POST' });
      console.log('GameContext: Reset response status:', response.status, 'ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('GameContext: Reset failed with response:', errorData);
        throw new Error('Failed to reset game');
      }
      
      const data = await response.json();
      console.log('GameContext: Reset successful, response:', data);
      
      console.log('GameContext: Calling refreshState after reset');
      await refreshState();
      console.log('GameContext: refreshState completed after reset');
    } catch (err) {
      console.error('GameContext: Error in resetGame:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err; // Re-throw so caller knows it failed
    }
  };

  // Poll for updates every 5 seconds
  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 5000);
    return () => clearInterval(interval);
  }, []);

  const contextValue: GameContextType = {
    gameState,
    puzzles,
    gridMapping,
    loading,
    error,
    actions: {
      submitAnswer,
      refreshState,
      resetGame
    }
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};