import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { useGlobalGameState } from '../hooks';
import { LoadingSpinner, ConnectionLine, LockIcon } from '../components';

const GridPage: React.FC = () => {
  const navigate = useNavigate();
  const { gridMapping, loading, error, actions } = useGameContext();
  const { gameState, getProgress } = useGlobalGameState();

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

  // Subreddit names mapping
  const subredditNames = [
    'r/Math', 'r/History', 'r/Codes',
    'r/Science', 'r/Geography', 'r/Chemistry',
    'r/Biology', 'r/Linguistics', 'r/Art'
  ];

  // Create planet nodes from grid mapping
  const planets = gridMapping.map((gridPos, index) => {
    // Define positions for 9 planets in a space diagram layout
    const positions = [
      // Top tier - 3 planets
      { x: 200, y: 100, tier: 'top' },
      { x: 500, y: 100, tier: 'top' },
      { x: 800, y: 100, tier: 'top' },
      // Mid tier - 3 planets
      { x: 200, y: 300, tier: 'mid' },
      { x: 500, y: 300, tier: 'mid' },
      { x: 800, y: 300, tier: 'mid' },
      // Bottom tier - 3 planets
      { x: 350, y: 500, tier: 'bottom' },
      { x: 500, y: 550, tier: 'core' },
      { x: 650, y: 500, tier: 'bottom' },
    ];

    const pos = positions[index] || { x: 500, y: 400, tier: 'mid' };
    const subredditName = subredditNames[index] || `Puzzle ${gridPos.puzzleId || gridPos.position}`;

    return {
      id: `puzzle-${gridPos.puzzleId || gridPos.position}`,
      label: subredditName,
      x: pos.x,
      y: pos.y,
      size: pos.tier === 'core' ? 120 : 80,
      tier: pos.tier,
      unlocked: gridPos.state === 'unlocked' || gridPos.state === 'solved',
      solved: gridPos.state === 'solved',
      gridPosition: gridPos,
      puzzleId: gridPos.puzzleId
    };
  });

  // Define connection paths showing unlocking flow (not play order)
  const connections = [
    // r/Math (0) unlocks r/Science (3)
    { from: 0, to: 3, path: 'M 200 140 Q 200 220 200 260', visible: true }, // Math → Science

    // r/Science (3) unlocks r/Biology (6)
    { from: 3, to: 6, path: 'M 200 340 Q 275 420 310 460', visible: true }, // Science → Biology

    // r/Biology (6) unlocks r/Linguistics (7)
    { from: 6, to: 7, path: 'M 390 500 Q 445 525 460 550', visible: true }, // Biology → Linguistics

    // r/History (1) unlocks r/Geography (4)
    { from: 1, to: 4, path: 'M 500 140 Q 500 220 500 260', visible: true }, // History → Geography

    // r/Geography (4) unlocks r/Linguistics (7)
    { from: 4, to: 7, path: 'M 500 340 Q 500 430 500 490', visible: true }, // Geography → Linguistics

    // r/Codes (2) unlocks r/Chemistry (5)
    { from: 2, to: 5, path: 'M 800 140 Q 800 220 800 260', visible: true }, // Codes → Chemistry

    // r/Chemistry (5) unlocks r/Art (8)
    { from: 5, to: 8, path: 'M 800 340 Q 725 420 690 460', visible: true }, // Chemistry → Art

    // r/Art (8) unlocks r/Linguistics (7)
    { from: 8, to: 7, path: 'M 610 500 Q 555 525 540 550', visible: true }, // Art → Linguistics
  ];

  const getGradientId = (tier: string, id: string) => {
    return `gradient-${tier}-${id}`;
  };

  const getTierColor = (tier: string, solved: boolean) => {
    if (solved) {
      return { start: '#34D399', mid: '#10B981', end: '#059669' }; // Green for solved
    }

    switch (tier) {
      case 'top': return { start: '#60A5FA', mid: '#3B82F6', end: '#2563EB' };
      case 'mid': return { start: '#A78BFA', mid: '#8B5CF6', end: '#7C3AED' };
      case 'core': return { start: '#F472B6', mid: '#EC4899', end: '#DB2777' };
      case 'bottom': return { start: '#FBBF24', mid: '#F59E0B', end: '#D97706' };
      default: return { start: '#60A5FA', mid: '#3B82F6', end: '#2563EB' };
    }
  };

  const handlePlanetClick = (planet: any) => {
    if (planet.unlocked && planet.puzzleId) {
      navigate(`/puzzle/${planet.puzzleId}`);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden relative">
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

      {/* SVG Container with ID for positioning reference */}
      <div id="svg-container" className="relative w-full max-w-6xl h-auto">
        <svg
          viewBox="0 0 1000 700"
          className="w-full max-w-6xl h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for each planet */}
            {planets.map((planet) => {
              const colors = getTierColor(planet.tier, planet.solved);
              return (
                <radialGradient
                  key={getGradientId(planet.tier, planet.id)}
                  id={getGradientId(planet.tier, planet.id)}
                  cx="30%"
                  cy="30%"
                >
                  <stop offset="0%" stopColor={colors.start} stopOpacity="1" />
                  <stop offset="50%" stopColor={colors.mid} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={colors.end} stopOpacity="0.8" />
                </radialGradient>
              );
            })}

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Outer glow filter */}
            <filter id="outerGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="blur" in2="SourceGraphic" operator="out" result="outerGlow" />
              <feMerge>
                <feMergeNode in="outerGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="rgba(96, 165, 250, 0.6)" />
            </marker>
          </defs>

          {/* Connection paths */}
          {connections.map((conn, index) => (
            conn.visible && (
              <ConnectionLine
                key={`connection-${index}`}
                path={conn.path}
                delay={index * 0.1}
                opacity={1}
                animate={true}
              />
            )
          ))}

          {/* Planet nodes */}
          {planets.map((planet) => (
            <g
              key={planet.id}
              style={{ pointerEvents: 'none' }}
            >
              {/* Outer glow */}
              <circle
                cx={planet.x}
                cy={planet.y}
                r={planet.size / 2 + 10}
                fill={`url(#${getGradientId(planet.tier, planet.id)})`}
                opacity="0.3"
                filter="url(#outerGlow)"
              />

              {/* Planet circle */}
              <circle
                cx={planet.x}
                cy={planet.y}
                r={planet.size / 2}
                fill={`url(#${getGradientId(planet.tier, planet.id)})`}
                stroke={planet.unlocked ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)"}
                strokeWidth={planet.unlocked ? "3" : "2"}
                filter="url(#glow)"
                className={planet.unlocked ? 'hover:opacity-90 transition-all duration-200' : 'opacity-60'}
              >
                {planet.unlocked && (
                  <animate
                    attributeName="r"
                    values={`${planet.size / 2};${planet.size / 2 + 3};${planet.size / 2}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Inner ring detail */}
              <circle
                cx={planet.x}
                cy={planet.y}
                r={planet.size / 2 - 8}
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="3,3"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${planet.x} ${planet.y}`}
                  to={`360 ${planet.x} ${planet.y}`}
                  dur="20s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Invisible larger click area for better UX */}
              <circle
                cx={planet.x}
                cy={planet.y}
                r={planet.size / 2 + 15}
                fill="transparent"
                stroke="none"
              />

              {/* Planet label */}
              <text
                x={planet.x}
                y={planet.y + planet.size / 2 + 25}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize={planet.tier === 'core' ? '16' : '14'}
                fontWeight={planet.tier === 'core' ? '600' : '400'}
                letterSpacing="0.5"
                style={{ pointerEvents: 'none' }}
              >
                {planet.label}
              </text>

              {/* Solved checkmark */}
              {planet.solved && (
                <g style={{ pointerEvents: 'none' }}>
                  <circle
                    cx={planet.x + planet.size / 2 - 10}
                    cy={planet.y - planet.size / 2 + 10}
                    r="8"
                    fill="rgba(34, 197, 94, 0.9)"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                  />
                  <path
                    d={`M ${planet.x + planet.size / 2 - 13} ${planet.y - planet.size / 2 + 10} 
                      L ${planet.x + planet.size / 2 - 10} ${planet.y - planet.size / 2 + 13}
                      L ${planet.x + planet.size / 2 - 7} ${planet.y - planet.size / 2 + 7}`}
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {/* Lock icon for locked planets */}
              {!planet.unlocked && (
                <g style={{ pointerEvents: 'none' }}>
                  <LockIcon x={planet.x} y={planet.y} size={18} opacity={0.9} />
                </g>
              )}

            </g>
          ))}

          {/* Title */}
          <text
            x="500"
            y="50"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.95)"
            fontSize="28"
            fontWeight="300"
            letterSpacing="3"
          >
            MYSTERY VERSAL
          </text>
        </svg>

        {/* Clickable planet buttons positioned absolutely over SVG */}
        {planets.map((planet) => (
          <button
            key={`btn-${planet.id}`}
            onClick={() => handlePlanetClick(planet)}
            disabled={!planet.unlocked}
            className={`absolute rounded-full transition-all ${planet.unlocked
              ? 'cursor-pointer hover:bg-white hover:bg-opacity-10'
              : 'cursor-not-allowed opacity-50'
              }`}
            style={{
              left: `${(planet.x / 1000) * 100}%`,
              top: `${(planet.y / 700) * 100}%`,
              width: `${Math.max((planet.size / 1000) * 100, 8)}%`,
              height: `${Math.max((planet.size / 700) * 100, 8)}%`,
              transform: 'translate(-50%, -50%)',
              background: 'transparent',
              border: 'none',
              zIndex: 10,
            }}
            title={planet.label}
            aria-label={planet.label}
          />
        ))}
      </div>

      {/* Progress indicator in bottom right */}
      <div className="absolute bottom-8 right-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
        <div className="text-center">
          <div className="text-white/90 text-sm mb-2">Progress</div>
          <div className="text-2xl font-bold text-purple-400">
            {progress.solved}/9
          </div>
          <div className="text-white/70 text-xs">
            {Math.round(progress.percentage)}% Complete
          </div>
        </div>
      </div>

      {/* Reset Progress Button */}
      <button
        onClick={async () => {
          if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            try {
              const response = await fetch('/api/reset-game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });

              if (response.ok) {
                await actions.refreshState();
              } else {
                alert('Failed to reset progress. Please try again.');
              }
            } catch (error) {
              alert('Failed to reset progress. Please try again.');
            }
          }
        }}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors shadow-lg z-50 cursor-pointer"
        style={{ pointerEvents: 'all' }}
      >
        🔄 Reset Progress
      </button>
    </div>
  );
};

export default GridPage;