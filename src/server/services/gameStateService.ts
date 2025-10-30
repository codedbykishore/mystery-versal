import { redis } from '@devvit/web/server';
import { GlobalGameState } from '../../shared/types/game';
import { getCompletedSets } from '../../shared/utils/gridUtils';

const GAME_STATE_KEY_PREFIX = 'mystery_versal:user_game_state:';
const GAME_VERSION_KEY_PREFIX = 'mystery_versal:user_game_version:';

class GameStateService {
  private getUserGameStateKey(userId: string): string {
    return `${GAME_STATE_KEY_PREFIX}${userId}`;
  }

  private getUserVersionKey(userId: string): string {
    return `${GAME_VERSION_KEY_PREFIX}${userId}`;
  }

  private async getStoredGameState(userId: string): Promise<GlobalGameState | null> {
    try {
      const stateJson = await redis.get(this.getUserGameStateKey(userId));
      if (!stateJson) return null;
      
      return JSON.parse(stateJson) as GlobalGameState;
    } catch (error) {
      console.error('Error parsing stored game state:', error);
      return null;
    }
  }

  private async saveGameState(userId: string, gameState: GlobalGameState): Promise<void> {
    try {
      // Increment version for optimistic updates
      gameState.version = await redis.incrBy(this.getUserVersionKey(userId), 1);
      gameState.lastUpdated = new Date().toISOString();
      
      await redis.set(this.getUserGameStateKey(userId), JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game state:', error);
      throw error;
    }
  }

  async getGameState(userId: string): Promise<GlobalGameState> {
    const storedState = await this.getStoredGameState(userId);
    
    if (storedState) {
      return storedState;
    }

    // Initialize default game state for this user
    const initialState: GlobalGameState = {
      solvedPuzzles: [],
      currentSet: 1,
      completedSets: [],
      totalSolved: 0,
      isComplete: false,
      lastUpdated: new Date().toISOString(),
      version: 1
    };

    await this.saveGameState(userId, initialState);
    return initialState;
  }

  async markPuzzleSolved(userId: string, puzzleId: number): Promise<GlobalGameState> {
    const currentState = await this.getGameState(userId);
    
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

    await this.saveGameState(userId, updatedState);
    return updatedState;
  }

  async resetGameState(userId: string): Promise<void> {
    const initialState: GlobalGameState = {
      solvedPuzzles: [],
      currentSet: 1,
      completedSets: [],
      totalSolved: 0,
      isComplete: false,
      lastUpdated: new Date().toISOString(),
      version: 1
    };

    await redis.del(this.getUserGameStateKey(userId));
    await redis.del(this.getUserVersionKey(userId));
    await this.saveGameState(userId, initialState);
  }

  async getGameVersion(userId: string): Promise<number> {
    const version = await redis.get(this.getUserVersionKey(userId));
    return version ? parseInt(version) : 1;
  }
}

export const gameStateService = new GameStateService();