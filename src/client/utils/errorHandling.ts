/**
 * Error handling utilities for the Mystery Versal game
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  timestamp: string;
}

/**
 * Create a standardized error object
 */
export const createError = (
  code: string,
  message: string,
  details?: any,
  retryable: boolean = true
): AppError => ({
  code,
  message,
  details,
  retryable,
  timestamp: new Date().toISOString()
});

/**
 * Error types and their user-friendly messages
 */
export const ERROR_TYPES = {
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Unable to connect to the server. Please check your internet connection.',
    retryable: true
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Please check your input and try again.',
    retryable: false
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Something went wrong on our end. Please try again in a moment.',
    retryable: true
  },
  RATE_LIMIT_ERROR: {
    code: 'RATE_LIMIT_ERROR',
    message: 'Too many attempts. Please wait a moment before trying again.',
    retryable: true
  },
  PUZZLE_NOT_FOUND: {
    code: 'PUZZLE_NOT_FOUND',
    message: 'This puzzle could not be found.',
    retryable: false
  },
  PUZZLE_LOCKED: {
    code: 'PUZZLE_LOCKED',
    message: 'This puzzle is not yet available. Complete previous puzzles first.',
    retryable: false
  },
  GAME_STATE_ERROR: {
    code: 'GAME_STATE_ERROR',
    message: 'Unable to load game progress. Please refresh the page.',
    retryable: true
  }
};

/**
 * Retry mechanism with exponential backoff
 */
export class RetryManager {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;

  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 10000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  async execute<T>(
    operation: () => Promise<T>,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !shouldRetry(error)) {
          throw error;
        }

        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt),
          this.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

/**
 * Network error handler
 */
export const handleNetworkError = (error: any): AppError => {
  if (!navigator.onLine) {
    return createError(
      'OFFLINE_ERROR',
      'You appear to be offline. Please check your internet connection.',
      error,
      true
    );
  }

  if (error.name === 'AbortError') {
    return createError(
      'REQUEST_CANCELLED',
      'Request was cancelled.',
      error,
      true
    );
  }

  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return createError(
      'NETWORK_ERROR',
      ERROR_TYPES.NETWORK_ERROR.message,
      error,
      true
    );
  }

  const status = error.response?.status;
  
  switch (status) {
    case 400:
      return createError(
        'VALIDATION_ERROR',
        error.response?.data?.message || ERROR_TYPES.VALIDATION_ERROR.message,
        error,
        false
      );
    
    case 429:
      return createError(
        'RATE_LIMIT_ERROR',
        ERROR_TYPES.RATE_LIMIT_ERROR.message,
        error,
        true
      );
    
    case 500:
    case 502:
    case 503:
    case 504:
      return createError(
        'SERVER_ERROR',
        ERROR_TYPES.SERVER_ERROR.message,
        error,
        true
      );
    
    default:
      return createError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred. Please try again.',
        error,
        true
      );
  }
};

/**
 * Error boundary error handler
 */
export const handleComponentError = (error: Error, errorInfo: any): AppError => {
  console.error('Component Error:', error, errorInfo);
  
  return createError(
    'COMPONENT_ERROR',
    'A component error occurred. Please refresh the page.',
    { error: error.message, stack: error.stack, errorInfo },
    true
  );
};

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandling = () => {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    const error = createError(
      'UNHANDLED_REJECTION',
      'An unexpected error occurred.',
      event.reason,
      true
    );
    
    // You could send this to an error reporting service
    console.error('Global Error:', error);
  });

  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    
    const error = createError(
      'GLOBAL_ERROR',
      'An unexpected error occurred.',
      {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      },
      true
    );
    
    // You could send this to an error reporting service
    console.error('Global Error:', error);
  });
};

/**
 * Error recovery suggestions
 */
export const getRecoverySuggestions = (error: AppError): string[] => {
  const suggestions: string[] = [];

  switch (error.code) {
    case 'NETWORK_ERROR':
    case 'OFFLINE_ERROR':
      suggestions.push('Check your internet connection');
      suggestions.push('Try refreshing the page');
      break;
    
    case 'RATE_LIMIT_ERROR':
      suggestions.push('Wait a moment before trying again');
      suggestions.push('Avoid rapid clicking or submissions');
      break;
    
    case 'SERVER_ERROR':
      suggestions.push('Try again in a few minutes');
      suggestions.push('Refresh the page');
      break;
    
    case 'VALIDATION_ERROR':
      suggestions.push('Check your input for errors');
      suggestions.push('Make sure all required fields are filled');
      break;
    
    case 'PUZZLE_LOCKED':
      suggestions.push('Complete previous puzzles first');
      suggestions.push('Check the puzzle grid for available puzzles');
      break;
    
    default:
      suggestions.push('Try refreshing the page');
      suggestions.push('Clear your browser cache');
      break;
  }

  return suggestions;
};