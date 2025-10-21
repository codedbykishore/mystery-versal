import { redis } from '@devvit/web/server';
import { GlobalGameState } from '../../shared/types/game';
import { getCompletedSets, isGameComplete } from '../../shared/utils/gridUtils';

const GAME_STATE_KEY = 'mystery_versal:game_state';
const GAME_VERSION_KEY = 'mystery_versal:game_version';

class GameStateService {
  private async getStoredGameState(): Promise<GlobalGameState | null> {
    try {
      const stateJson = await redis.get(GAME_STATE_KEY);
      if (!stateJson) return null;
      
      return JSON.parse(stateJson) as GlobalGameState;
    } catch (error) {
      console.error('Error parsing stored game state:', error);
      return null;
    }
  }

  private async saveGameState(gameState: GlobalGameState): Promise<void> {
    try {
      // Increment version for optimistic updates
      gameState.version = await redis.incrBy(GAME_VERSION_KEY, 1);
      gameState.lastUpdated = new Date().toISOString();
      
      await redis.set(GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state:', error);
      throw error;
    }
  }

  async getGameState(): Promise<GlobalGameState> {
    const storedState = await this.getStoredGameState();
    
    if (storedState) {
      return storedState;
    }

    // Initialize default game state
    const initialState: GlobalGameState = {
      solvedPuzzles: [],
      currentSet: 1,
      completedSets: [],
      totalSolved: 0,
      isComplete: false,
      lastUpdated: new Date().toISOString(),
      version: 1
    };

    await this.saveGameState(initialState);
    return initialState;
  }

  async markPuzzleSolved(puzzleId: number): Promise<GlobalGameState> {
    const currentState = await this.getGameState();
    
    // Don't add if already solved
    if (currentState.solvedPuzzles.includes(puzzleId)) {
      return currentState;
    }

    // Add to solved puzzles
    const newSolvedPuzzles = [...currentState.solvedPuzzles, puzzleId].sort((a, b) => a - b);
    
    const updatedState: GlobalGameState = {
      ...currentState,
      solvedPuzzles: newSolvedPuzzles,
      totalSolved: newSolvedPuzzles.length,
      isComplete: newSolvedPuzzles.length === 9
    };

    // Check for set completion
    const completedSets = getCompletedSets(updatedState);
    updatedState.completedSets = completedSets;
    
    // For independent paths, currentSet is not really used, but keep it for compatibility
    updatedState.currentSet = 1;

    await this.saveGameState(updatedState);
    return updatedState;
  }

  async resetGameState(): Promise<void> {
    const initialState: GlobalGameState = {
      solvedPuzzles: [],
      currentSet: 1,
      completedSets: [],
      totalSolved: 0,
      isComplete: false,
      lastUpdated: new Date().toISOString(),
      version: 1
    };

    await redis.del(GAME_STATE_KEY);
    await redis.del(GAME_VERSION_KEY);
    await this.saveGameState(initialState);
  }

  async getGameVersion(): Promise<number> {
    const version = await redis.get(GAME_VERSION_KEY);
    return version ? parseInt(version) : 1;
  }
}

export const gameStateService = new GameStateService();