import { SubmitAnswerResponse } from '../../shared/types/api';
import { puzzleConfiguration } from '../../shared/data/puzzleConfig';
import { getPuzzleById, isSetCompleted } from '../../shared/utils/gridUtils';
import { gameStateService } from './gameStateService';

class AnswerValidationService {
  private sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML
      .substring(0, 100); // Limit length
  }

  private validateAnswer(input: string, correctAnswer: string): boolean {
    const sanitized = this.sanitizeInput(input).toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    return sanitized === correct;
  }

  async validateAnswer(puzzleId: number, answer: string): Promise<SubmitAnswerResponse> {
    try {
      const puzzle = getPuzzleById(puzzleId);
      
      if (!puzzle) {
        return {
          success: false,
          puzzleId,
          error: 'Invalid puzzle ID'
        };
      }

      const isCorrect = this.validateAnswer(answer, puzzle.answer);
      
      if (!isCorrect) {
        return {
          success: false,
          puzzleId,
          error: 'Incorrect answer'
        };
      }

      // Mark puzzle as solved and update global state
      const updatedGameState = await gameStateService.markPuzzleSolved(puzzleId);
      
      // Prepare response
      const response: SubmitAnswerResponse = {
        success: true,
        puzzleId
      };

      // Add hint for next puzzle if not the last one
      if (puzzleId < 9) {
        response.hint = puzzle.hintText;
        response.targetSubreddit = puzzle.targetSubreddit;
      }

      // Check if set was completed
      const currentSet = puzzle.set;
      const wasSetCompleted = isSetCompleted(currentSet, updatedGameState);
      
      if (wasSetCompleted && !updatedGameState.completedSets.includes(currentSet)) {
        response.setCompleted = true;
        
        // Check if new set was unlocked
        if (currentSet < 3) {
          response.newSetUnlocked = currentSet + 1;
        }
      }

      // Check if game is complete
      if (updatedGameState.isComplete) {
        response.isGameComplete = true;
      }

      return response;
    } catch (error) {
      console.error('Error validating answer:', error);
      return {
        success: false,
        puzzleId,
        error: 'Internal server error'
      };
    }
  }
}

export const answerValidationService = new AnswerValidationService();