import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnimations, useGlobalGameState, usePuzzleData } from '../hooks';
import { Button, Input, LoadingSpinner } from '../components';
import { SubmitAnswerResponse } from '../../shared/types';

const PuzzlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const puzzleId = parseInt(id || '0');
  
  const { pageVariants } = useAnimations();
  const { submitAnswer, loading: gameLoading } = useGlobalGameState();
  const { getPuzzle, getTileState } = usePuzzleData();
  
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SubmitAnswerResponse | null>(null);

  const puzzle = getPuzzle(puzzleId);
  const tileState = getTileState(puzzleId);

  useEffect(() => {
    // Redirect if puzzle doesn't exist or is locked
    if (!puzzle || tileState === 'locked') {
      navigate('/');
      return;
    }

    // If puzzle is already solved, show it but don't allow re-submission
    if (tileState === 'solved') {
      // Could show a "already solved" state here
    }
  }, [puzzle, tileState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitAnswer(puzzleId, answer.trim());
      
      if (result.success) {
        setSuccessData(result);
        setShowSuccess(true);
        setAnswer('');
        
        // Auto-return to grid after showing success
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(result.error || 'Incorrect answer. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedditLink = () => {
    if (puzzle?.postLink) {
      window.open(puzzle.postLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (gameLoading || !puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (showSuccess && successData) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          {/* Success Animation */}
          <motion.div
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, times: [0, 0.6, 1] }}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>

          <h2 className="text-3xl font-bold text-green-600 mb-4">
            ✅ CORRECT!!!!!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Great job solving the {puzzle.subreddit} puzzle!
          </p>

          {/* Show hint for next puzzle */}
          {successData.hint && successData.targetSubreddit && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Next Hint for {successData.targetSubreddit}:
              </h3>
              <p className="text-blue-800 italic">
                {successData.hint}
              </p>
            </div>
          )}

          {/* Set completion notification */}
          {successData.setCompleted && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">
                🎉 Set Complete!
              </h3>
              <p className="text-yellow-800">
                You've completed Set {puzzle.set}!
                {successData.newSetUnlocked && ` Set ${successData.newSetUnlocked} is now unlocked!`}
              </p>
            </div>
          )}

          {/* Game completion */}
          {successData.isGameComplete && (
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-purple-900 mb-2">
                🏆 Puzzle Hunt Complete!
              </h3>
              <p className="text-purple-800">
                Congratulations! You've solved all puzzles!
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Returning to grid in a moment...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col p-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Grid</span>
        </Button>

        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {puzzle.subreddit}
          </h1>
          <p className="text-gray-600">
            Puzzle {puzzleId} of 9
          </p>
        </div>

        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl w-full">
          {/* Puzzle already solved state */}
          {tileState === 'solved' && (
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Already Solved!
              </h2>
              <p className="text-gray-600">
                This puzzle has been completed by the community.
              </p>
            </div>
          )}

          {/* Reddit post link */}
          <div className="text-center mb-8">
            <Button
              variant="primary"
              size="large"
              onClick={handleRedditLink}
              className="w-full md:w-auto"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-3.5a.75.75 0 011.5 0v3.5A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                </svg>
                <span>Go to {puzzle.subreddit} Post</span>
              </div>
            </Button>
          </div>

          {/* Answer form (only show if not solved) */}
          {tileState !== 'solved' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Your Answer"
                  placeholder="Enter your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  error={error || undefined}
                  disabled={submitting}
                  autoFocus
                  className="text-center"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={submitting}
                disabled={!answer.trim() || submitting}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </form>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click the button above to visit the Reddit post</li>
              <li>• Solve the puzzle in the post</li>
              <li>• Enter your answer in the field above</li>
              <li>• Correct answers unlock the next puzzle for everyone!</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PuzzlePage;