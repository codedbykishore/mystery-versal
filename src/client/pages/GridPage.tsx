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
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
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
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
          <span className="text-2xl font-bold text-blue-500">
            {progress.solved}/9
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Current Set: {gameState.currentSet}</span>
          <span>{progress.percentage}% Complete</span>
        </div>
      </div>

      {/* Puzzle Grid */}
      <motion.div
        className="grid grid-cols-3 gap-3 md:gap-6 mb-8"
        variants={gridVariants}
        initial="initial"
        animate="animate"
      >
        {gridMapping.map((gridPosition) => (
          <PuzzleTile
            key={gridPosition.position}
            gridPosition={gridPosition}
            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
          />
        ))}
      </motion.div>

      {/* Set Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Set Status
        </h3>
        
        <div className="space-y-3">
          {[1, 2, 3].map((setNum) => {
            const isCompleted = gameState.completedSets.includes(setNum);
            const isCurrent = gameState.currentSet === setNum;
            const isLocked = setNum > gameState.currentSet;
            
            return (
              <div
                key={setNum}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : isCurrent 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span className="font-medium">Set {setNum}</span>
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isCurrent && !isCompleted && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                  {isLocked && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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