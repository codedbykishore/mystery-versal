import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnimations, useGlobalGameState, usePuzzleData } from '../hooks';
import { Button, Input, LoadingSpinner } from '../components';


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

  const puzzle = getPuzzle(puzzleId);
  const tileState = getTileState(puzzleId);

  useEffect(() => {
    // Redirect if puzzle doesn't exist or is locked
    if (!puzzle || tileState === 'locked') {
      navigate('/grid');
      return;
    }

    // If puzzle is already solved, stay on page and show solved state
    // No redirect needed - user can view the puzzle and go back manually
  }, [puzzle, tileState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitAnswer(puzzleId, answer.trim());
      
      if (result.success) {
        // Stay on page to show solved state - don't navigate away
        // User can manually go back to grid to see updated state
        setAnswer(''); // Clear the input
      } else {
        setError(result.error || 'Incorrect answer. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (gameLoading || !puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
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
          onClick={() => navigate('/grid')}
          className="flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Grid</span>
        </Button>

        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {puzzle.title}
          </h1>
        </div>

        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl w-full">
          {/* Puzzle already solved state */}
          {tileState === 'solved' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Solved!
              </h2>
              <p className="text-gray-600">
                This puzzle has been completed.
              </p>
            </div>
          )}

          {/* Reddit post link */}
          <div className="text-center mb-8">
            <a
              href={puzzle.postLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 shadow-lg hover:shadow-xl font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 touch-target px-8 py-4 text-lg min-h-[56px] cursor-pointer w-full md:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-3.5a.75.75 0 011.5 0v3.5A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
              <span>Go to Post</span>
            </a>
          </div>

          {/* Answer form (only show if not solved) */}
          {tileState !== 'solved' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Your Answer"
                  placeholder="Enter your answer here..."
                  value={answer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
                  error={error ?? ''}
                  disabled={submitting}
                  autoFocus
                  className="text-center"
                  style={{ color: '#1f2937' }}
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
              <li>• <strong>Desktop:</strong> Hold Ctrl (or Cmd on Mac) and click the button above to open the Reddit post</li>
              <li>• <strong>Mobile:</strong> Tap the button to visit the Reddit post</li>
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