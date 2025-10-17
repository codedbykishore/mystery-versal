import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GridPosition, TileState } from '../../shared/types';
import { useAnimations } from '../hooks';
import { getPuzzlePieceImage } from '../utils/imageUtils';

interface PuzzleTileProps {
  gridPosition: GridPosition;
  onClick?: () => void;
  className?: string;
}

const PuzzleTile: React.FC<PuzzleTileProps> = ({ 
  gridPosition, 
  onClick,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { tileVariants, pulseVariants } = useAnimations();
  
  const { position, puzzleId, state, imagePiece } = gridPosition;

  // Generate the puzzle piece image based on state
  const pieceImage = useMemo(() => {
    if (!puzzleId) return null;
    return getPuzzlePieceImage(puzzleId, state === 'solved');
  }, [puzzleId, state]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (state === 'unlocked' && puzzleId) {
      navigate(`/puzzle/${puzzleId}`);
    }
  };

  const getTileContent = () => {
    switch (state) {
      case 'locked':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg 
              className="w-8 h-8 mb-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-label="Locked puzzle"
            >
              <path 
                fillRule="evenodd" 
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="text-xs font-medium">Locked</span>
          </div>
        );
      
      case 'unlocked':
        return (
          <div className="relative h-full">
            {pieceImage && (
              <img 
                src={pieceImage} 
                alt={`Puzzle piece ${position}`}
                className="w-full h-full object-cover opacity-70"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <svg 
                  className="w-6 h-6 text-blue-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Click to solve"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      
      case 'solved':
        return (
          <div className="relative h-full">
            {pieceImage && (
              <img 
                src={pieceImage} 
                alt={`Completed puzzle piece ${position}`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 right-2">
              <div className="bg-green-500 rounded-full p-1 shadow-lg">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-label="Puzzle solved"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTileStyles = () => {
    const baseStyles = "w-32 h-32 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer premium-shadow";
    
    switch (state) {
      case 'locked':
        return `${baseStyles} bg-gray-200 opacity-40 cursor-not-allowed`;
      
      case 'unlocked':
        return `${baseStyles} bg-white hover:premium-shadow-hover transform hover:scale-105 hover:-translate-y-1`;
      
      case 'solved':
        return `${baseStyles} bg-white`;
      
      default:
        return baseStyles;
    }
  };

  // Don't animate locked tiles
  const shouldAnimate = state !== 'locked';
  
  // Add pulse animation for unlocked tiles
  const animationVariants = state === 'unlocked' 
    ? { ...tileVariants, ...pulseVariants }
    : tileVariants;

  const TileComponent = shouldAnimate ? motion.div : 'div';
  const motionProps = shouldAnimate ? {
    variants: animationVariants,
    whileHover: state === 'unlocked' ? 'hover' : undefined,
    whileTap: state === 'unlocked' ? 'tap' : undefined,
    animate: state === 'unlocked' ? 'animate' : 'animate'
  } : {};

  return (
    <TileComponent
      className={`${getTileStyles()} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={state === 'unlocked' ? 0 : -1}
      aria-label={
        state === 'locked' 
          ? `Puzzle ${position} is locked`
          : state === 'unlocked'
          ? `Click to solve puzzle ${position}`
          : `Puzzle ${position} is completed`
      }
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && state === 'unlocked') {
          e.preventDefault();
          handleClick();
        }
      }}
      {...motionProps}
    >
      {getTileContent()}
    </TileComponent>
  );
};

export default PuzzleTile;