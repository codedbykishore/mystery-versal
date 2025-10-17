import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  title?: string;
  message?: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  title = "Success!",
  message = "Great job!"
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti particles */}
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
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: 360,
                opacity: 0
              }}
              transition={{
                duration: 3,
                delay: particle.delay,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Success card */}
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Animated checkmark */}
        <motion.div
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ 
            duration: 0.8, 
            times: [0, 0.6, 1],
            ease: [0.34, 1.56, 0.64, 1]
          }}
        >
          <motion.svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </motion.svg>
        </motion.div>

        {/* Title with bounce animation */}
        <motion.h2
          className="text-3xl font-bold text-green-600 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {title}
        </motion.h2>

        {/* Message with slide animation */}
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {/* Animated progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{
                delay: 0.8 + i * 0.1,
                duration: 0.4,
                times: [0, 0.6, 1]
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;