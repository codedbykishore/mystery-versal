import express from 'express';
import { GameStateResponse, SubmitAnswerResponse, ErrorResponse } from '../shared/types/api';
import { GlobalGameState } from '../shared/types/game';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import { gameStateService } from './services/gameStateService';
import { answerValidationService } from './services/answerValidationService';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// Rate limiting map (simple in-memory for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxAttempts = 10;

  const current = rateLimitMap.get(identifier);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxAttempts) {
    return false;
  }

  current.count++;
  return true;
};

// Get current global game state
router.get('/api/game-state', async (_req, res): Promise<void> => {
  try {
    const gameState = await gameStateService.getGameState();
    res.json(gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch game state',
        retryable: true
      },
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// Submit answer for puzzle
router.post('/api/submit-answer', async (req, res): Promise<void> => {
  try {
    const { puzzleId, answer } = req.body;
    
    if (!puzzleId || !answer) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Puzzle ID and answer are required',
          retryable: false
        },
        timestamp: new Date().toISOString()
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Rate limiting
    const username = await reddit.getCurrentUsername() || 'anonymous';
    if (!checkRateLimit(username)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT',
          message: 'Too many attempts, please try again later',
          retryable: true
        },
        timestamp: new Date().toISOString()
      };
      res.status(429).json(errorResponse);
      return;
    }

    const result = await answerValidationService.validateAnswer(puzzleId, answer);
    res.json(result);
  } catch (error) {
    console.error('Error submitting answer:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'SUBMIT_ERROR',
        message: 'Failed to submit answer',
        retryable: true
      },
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
});

// Reset game state (development only)
router.post('/api/reset-game', async (_req, res): Promise<void> => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({ success: false, error: 'Not allowed in production' });
      return;
    }

    await gameStateService.resetGameState();
    const gameState = await gameStateService.getGameState();
    res.json({ success: true, gameState });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({ success: false, error: 'Failed to reset game' });
  }
});

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
