import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAnimations, useGlobalGameState } from '../hooks';
import { Button } from '../components';

const VictoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { pageVariants } = useAnimations();
  const { gameState, refreshState } = useGlobalGameState();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Redirect if game is not actually complete
    if (!gameState.isComplete) {
      navigate('/grid');
      return;
    }

    // Start confetti animation
    setShowConfetti(true);
  }, [gameState.isComplete, navigate]);

  const handleResetProgress = async () => {
    if (isResetting) return;
    
    setIsResetting(true);
    try {
      const response = await fetch('/api/reset-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear victory page session storage and refresh the game state
        sessionStorage.removeItem('hasSeenVictory');
        await refreshState();
        navigate('/grid');
      } else {
        console.error('Failed to reset game');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
    } finally {
      setIsResetting(false);
    }
  };

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FFD700'][Math.floor(Math.random() * 6)],
    size: Math.random() * 12 + 6,
    delay: Math.random() * 3
  }));

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`
              }}
              initial={{ 
                y: -100, 
                rotate: 0,
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: 720,
                opacity: 0,
                scale: 1
              }}
              transition={{
                duration: 4,
                delay: particle.delay,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Victory content */}
      <div className="text-center mb-12 z-10">
        <motion.div
          className="text-8xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.5 
          }}
        >
          🏆
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Puzzle Hunt Complete!
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Congratulations! You and the community have successfully solved all 9 puzzles 
          and revealed the complete mystery image.
        </motion.p>
      </div>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate('/grid?from=victory')}
          className="text-xl px-12 py-4 rounded-2xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
          style={{ 
            backgroundColor: '#ffffff',
            color: '#581c87'
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="font-extrabold">View Puzzle Grid</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Button>
        
        <Button
          variant="outline"
          size="large"
          onClick={handleResetProgress}
          disabled={isResetting}
          className="border-white text-white hover:bg-white hover:text-purple-900 disabled:opacity-50"
        >
          {isResetting ? 'Resetting...' : 'Reset Progress'}
        </Button>
      </motion.div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default VictoryPage;