import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import LoadingSpinner from './LoadingSpinner';

const AndroidGridLayout: React.FC = () => {
  const navigate = useNavigate();
  const { gridMapping, loading, error } = useGameContext();


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Subreddit names mapping
  const subredditNames = [
    'r/Math', 'r/History', 'r/Codes',
    'r/Science', 'r/Geography', 'r/Chemistry',
    'r/Biology', 'r/Linguistics', 'r/Art'
  ];

  // Create simplified grid for mobile
  const puzzles = gridMapping.map((gridPos, index) => {
    const subredditName = subredditNames[index] || `Puzzle ${gridPos.puzzleId || gridPos.position}`;
    
    return {
      id: `puzzle-${gridPos.puzzleId || gridPos.position}`,
      label: subredditName,
      unlocked: gridPos.state === 'unlocked' || gridPos.state === 'solved',
      solved: gridPos.state === 'solved',
      gridPosition: gridPos,
      puzzleId: gridPos.puzzleId
    };
  });

  const handlePuzzleClick = (puzzle: any) => {
    if (puzzle.unlocked && puzzle.puzzleId) {
      navigate(`/puzzle/${puzzle.puzzleId}`);
    }
  };

  const getTierColor = (index: number, solved: boolean) => {
    if (solved) {
      return 'from-green-400 to-green-600';
    }

    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600', 
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600',
      'from-teal-400 to-teal-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600'
    ];
    
    return colors[index % colors.length];
  };

  // Create planet positions for portrait layout - vertical graph structure
  const planetPositions = [
    // Top tier - 3 planets (Math, History, Codes)
    { x: 25, y: 15, tier: 'top', index: 0 },    // Math - left
    { x: 50, y: 10, tier: 'top', index: 1 },    // History - center
    { x: 75, y: 15, tier: 'top', index: 2 },    // Codes - right
    
    // Mid tier - 3 planets (Science, Geography, Chemistry)
    { x: 25, y: 35, tier: 'mid', index: 3 },    // Science - left
    { x: 50, y: 40, tier: 'mid', index: 4 },    // Geography - center
    { x: 75, y: 35, tier: 'mid', index: 5 },    // Chemistry - right
    
    // Lower tier - 2 planets (Biology, Art)
    { x: 30, y: 60, tier: 'lower', index: 6 },  // Biology - left
    { x: 70, y: 60, tier: 'lower', index: 8 },  // Art - right
    
    // Final tier - 1 planet (Linguistics - the core)
    { x: 50, y: 80, tier: 'core', index: 7 },   // Linguistics - center bottom
  ];

  const renderPlanet = (puzzle: any, position: any) => {
    const size = position.tier === 'core' ? 100 : 80; // 50% larger than before
    
    return (
      <motion.div
        key={puzzle.id}
        className="absolute"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: position.index * 0.15, type: 'spring', stiffness: 100 }}
      >
        <motion.button
          onClick={() => handlePuzzleClick(puzzle)}
          disabled={!puzzle.unlocked}
          className={`
            relative rounded-full flex flex-col items-center justify-center
            transition-all duration-300 transform
            ${puzzle.unlocked 
              ? 'hover:scale-110 active:scale-95 shadow-2xl' 
              : 'opacity-50 cursor-not-allowed'
            }
          `}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: puzzle.unlocked 
              ? `radial-gradient(circle at 30% 30%, ${getTierColor(position.index, puzzle.solved).split(' ')[0].replace('from-', '')}, ${getTierColor(position.index, puzzle.solved).split(' ')[1].replace('to-', '')})`
              : 'radial-gradient(circle at 30% 30%, #64748b, #475569)'
          }}
          whileTap={{ scale: puzzle.unlocked ? 0.9 : 1 }}
          whileHover={{ scale: puzzle.unlocked ? 1.1 : 1 }}
        >
          {/* Planet surface details */}
          <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"></div>
          
          {/* Planet core */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {puzzle.solved ? (
              <div className="text-white text-2xl font-bold">✓</div>
            ) : !puzzle.unlocked ? (
              <div className="text-white/60 text-xl">🔒</div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-white/60 animate-pulse"></div>
            )}
          </div>

          {/* Solved indicator */}
          {puzzle.solved && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <div className="text-white text-sm font-bold">✓</div>
            </div>
          )}

          {/* Orbital ring animation for unlocked planets */}
          {puzzle.unlocked && (
            <div 
              className="absolute inset-0 rounded-full border border-white/30"
              style={{
                width: `${size + 20}px`,
                height: `${size + 20}px`,
                left: '-10px',
                top: '-10px',
              }}
            >
              <motion.div
                className="absolute w-2 h-2 bg-white/80 rounded-full"
                style={{ top: '-1px', left: '50%', marginLeft: '-1px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Glow effect */}
          {puzzle.unlocked && (
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
              style={{
                width: `${size + 40}px`,
                height: `${size + 40}px`,
                left: '-20px',
                top: '-20px',
                filter: 'blur(10px)',
              }}
            />
          )}
        </motion.button>

        {/* Planet label */}
        <div 
          className="absolute text-white text-sm font-medium text-center leading-tight mt-2"
          style={{
            top: `${size/2 + 15}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
          }}
        >
          {puzzle.label.replace('r/', '')}
        </div>
      </motion.div>
    );
  };

  // Connection lines for portrait layout
  const connections = [
    // Top tier connections
    { from: { x: 25, y: 15 }, to: { x: 25, y: 35 }, color: 'blue' },    // Math → Science
    { from: { x: 50, y: 10 }, to: { x: 50, y: 40 }, color: 'purple' },  // History → Geography
    { from: { x: 75, y: 15 }, to: { x: 75, y: 35 }, color: 'pink' },    // Codes → Chemistry
    
    // Mid to lower connections
    { from: { x: 25, y: 35 }, to: { x: 30, y: 60 }, color: 'cyan' },    // Science → Biology
    { from: { x: 75, y: 35 }, to: { x: 70, y: 60 }, color: 'orange' },  // Chemistry → Art
    
    // Lower to core connections
    { from: { x: 30, y: 60 }, to: { x: 50, y: 80 }, color: 'teal' },    // Biology → Linguistics
    { from: { x: 50, y: 40 }, to: { x: 50, y: 80 }, color: 'indigo' },  // Geography → Linguistics
    { from: { x: 70, y: 60 }, to: { x: 50, y: 80 }, color: 'red' },     // Art → Linguistics
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Header */}
      <div className="text-center pt-8 pb-4 relative z-10">
        <h1 className="text-3xl font-light text-white tracking-wider mb-3">
          MYSTERY VERSAL
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60"></div>
      </div>

      {/* Main graph container */}
      <div className="relative w-full h-full px-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, index) => {
            const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
            const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
            const x1 = (conn.from.x / 100) * screenWidth;
            const y1 = (conn.from.y / 100) * (screenHeight - 120);
            const x2 = (conn.to.x / 100) * screenWidth;
            const y2 = (conn.to.y / 100) * (screenHeight - 120);
            
            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`rgba(96, 165, 250, 0.4)`}
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            );
          })}
        </svg>

        {/* Planet nodes */}
        <div className="relative w-full h-full" style={{ zIndex: 2 }}>
          {planetPositions.map((position) => {
            const puzzle = puzzles[position.index];
            if (!puzzle) return null;
            return renderPlanet(puzzle, position);
          })}
        </div>
      </div>
    </div>
  );
};

export default AndroidGridLayout;