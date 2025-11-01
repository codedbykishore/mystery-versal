import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalGameState, usePuzzleData } from '../hooks';
import { LoadingSpinner } from '../components';


const PuzzlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const puzzleId = parseInt(id || '0');
  
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <LoadingSpinner />
      </div>
    );
  }



  return (
    <motion.div
      className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header with back button */}
      <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto w-full relative z-10">
        <button
          onClick={() => navigate('/grid')}
          className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Grid</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white/95 tracking-wide">
            {puzzle.title}
          </h1>
        </div>

        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 overflow-y-auto">
        <motion.div 
          className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-2xl w-full max-w-2xl mx-4 border border-white/10 my-auto"
          style={{ maxWidth: '75%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Puzzle already solved state */}
          {tileState === 'solved' && (
            <motion.div 
              className="text-center py-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(34, 197, 94, 0.5)',
                    '0 0 40px rgba(34, 197, 94, 0.8)',
                    '0 0 20px rgba(34, 197, 94, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                Solved!
              </h2>
              <p className="text-white/70">
                This puzzle has been completed.
              </p>
            </motion.div>
          )}

          {/* Reddit post link */}
          <div className="text-center mb-5">
            <motion.a
              href={puzzle.postLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 font-semibold rounded-xl transition-all duration-200 px-6 py-3 text-base cursor-pointer w-full md:w-auto justify-center border border-blue-400/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-3.5a.75.75 0 011.5 0v3.5A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
              <span>Go to Puzzle Post</span>
            </motion.a>
          </div>

          {/* Answer form (only show if not solved) */}
          {tileState !== 'solved' && (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <label className="block text-white/90 font-semibold mb-2 text-base">
                  Your Answer
                </label>
                <input
                  type="text"
                  placeholder="Enter your answer here..."
                  value={answer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
                  disabled={submitting}
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-center backdrop-blur-sm"
                />
                {error && (
                  <motion.p 
                    className="mt-2 text-red-400 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={!answer.trim() || submitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-purple-400/30"
                whileHover={!submitting && answer.trim() ? { scale: 1.02, y: -2 } : {}}
                whileTap={!submitting && answer.trim() ? { scale: 0.98 } : {}}
              >
                {submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit Answer'
                )}
              </motion.button>
            </motion.form>
          )}

          {/* Instructions */}
          <motion.div 
            className="mt-5 p-3 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-white/90 mb-2 text-base flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Instructions</span>
            </h3>
            <ul className="text-sm text-white/70 space-y-1.5">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white/90">Desktop:</strong> Hold Ctrl (or Cmd on Mac) and click the button above</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-white/90">Mobile:</strong> Tap the button to visit the post</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Solve the puzzle and enter your answer above</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Correct answers unlock the next puzzle!</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PuzzlePage;