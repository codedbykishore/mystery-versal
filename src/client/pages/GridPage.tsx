import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { useAnimations, useGlobalGameState } from '../hooks';
import { PuzzleTile, LoadingSpinner } from '../components';

const GridPage: React.FC = () => {
  const navigate = useNavigate();
  const { gridMapping, loading, error } = useGameContext();
  const { gameState, getProgress } = useGlobalGameState();
  const { pageVariants, gridVariants } = useAnimations();

  const progress = getProgress();

  // Navigate to victory page when game is complete (but allow manual navigation back to grid)
  useEffect(() => {
    if (gameState.isComplete) {
      // Check if user manually navigated here or if this is automatic completion
      const urlParams = new URLSearchParams(window.location.search);
      const fromVictory = urlParams.get('from') === 'victory';
      
      if (!fromVictory) {
        // Only auto-navigate if not coming from victory page
        navigate('/victory');
      }
    }
  }, [gameState.isComplete, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Mystery Versal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Solve puzzles across Reddit communities to unlock pieces of the final image. 
          Work together with other players to complete the collaborative puzzle hunt!
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white border-opacity-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
          <span className="text-2xl font-bold text-purple-600">
            {progress.solved}/9
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <motion.div
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-center">
          <span className="text-lg font-medium text-gray-700">{Math.round(progress.percentage)}% Complete</span>
        </div>
      </div>

      {/* Puzzle Grid */}
      <motion.div
        className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        variants={gridVariants}
        initial="initial"
        animate="animate"
      >
        {gridMapping.map((gridPosition) => (
          <PuzzleTile
            key={gridPosition.position}
            gridPosition={gridPosition}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40"
          />
        ))}
      </motion.div>

      {/* Development Reset Button (only in dev) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={async () => {
            const { resetGame } = useGameContext().actions;
            await resetGame();
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
        >
          Reset Game (Dev)
        </button>
      )}
    </motion.div>
  );
};

export default GridPage;