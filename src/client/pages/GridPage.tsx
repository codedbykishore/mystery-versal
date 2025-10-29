import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { usePlatform } from '../context/PlatformContext';
import { useGlobalGameState } from '../hooks';
import { LoadingSpinner, ConnectionLine, LockIcon } from '../components';
import AndroidGridLayout from '../components/AndroidGridLayout';

const GridPage: React.FC = () => {
  const navigate = useNavigate();
  const { gridMapping, loading, error } = useGameContext();
  const { gameState } = useGlobalGameState();
  const { platform, fullscreen } = usePlatform();

  // Properly detect mobile with state and resize listener
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use Android layout for Android platform when not in fullscreen
  if (platform === 'android' && !fullscreen) {
    return <AndroidGridLayout />;
  }




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
    // Using viewBox 0 0 1000 800 for all screen sizes
    const positions = [
      // Top tier - 3 planets
      { x: 200, y: 140, tier: 'top' },
      { x: 500, y: 140, tier: 'top' },
      { x: 800, y: 140, tier: 'top' },
      // Mid tier - 3 planets
      { x: 200, y: 380, tier: 'mid' },
      { x: 500, y: 380, tier: 'mid' },
      { x: 800, y: 380, tier: 'mid' },
      // Bottom tier - 3 planets
      { x: 350, y: 620, tier: 'bottom' },
      { x: 500, y: 680, tier: 'core' },
      { x: 650, y: 620, tier: 'bottom' },
    ];

    const pos = positions[index] || { x: 500, y: 400, tier: 'mid' };
    const subredditName = subredditNames[index] || `Puzzle ${gridPos.puzzleId || gridPos.position}`;

    // Use larger sizes for better visibility (desktop gets large sizes, mobile gets even larger)
    const desktopSize = pos.tier === 'core' ? 160 : 110;
    const mobileSize = pos.tier === 'core' ? 180 : 120;
    const actualSize = isMobile ? mobileSize : desktopSize;

    return {
      id: `puzzle-${gridPos.puzzleId || gridPos.position}`,
      label: subredditName,
      x: pos.x,
      y: pos.y,
      size: actualSize,
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
    { from: 0, to: 3, path: 'M 200 195 Q 200 290 200 325', visible: true }, // Math → Science

    // r/Science (3) unlocks r/Biology (6)
    { from: 3, to: 6, path: 'M 200 435 Q 275 525 310 565', visible: true }, // Science → Biology

    // r/Biology (6) unlocks r/Linguistics (7)
    { from: 6, to: 7, path: 'M 405 620 Q 452 650 460 680', visible: true }, // Biology → Linguistics

    // r/History (1) unlocks r/Geography (4)
    { from: 1, to: 4, path: 'M 500 195 Q 500 290 500 325', visible: true }, // History → Geography

    // r/Geography (4) unlocks r/Linguistics (7)
    { from: 4, to: 7, path: 'M 500 435 Q 500 550 500 600', visible: true }, // Geography → Linguistics

    // r/Codes (2) unlocks r/Chemistry (5)
    { from: 2, to: 5, path: 'M 800 195 Q 800 290 800 325', visible: true }, // Codes → Chemistry

    // r/Chemistry (5) unlocks r/Art (8)
    { from: 5, to: 8, path: 'M 800 435 Q 725 525 690 565', visible: true }, // Chemistry → Art

    // r/Art (8) unlocks r/Linguistics (7)
    { from: 8, to: 7, path: 'M 595 620 Q 548 650 540 680', visible: true }, // Art → Linguistics
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
      <div id="svg-container" className={`relative w-full h-auto ${isMobile ? 'px-0' : 'px-4 max-w-6xl'}`}>
        <svg
          viewBox="0 0 1000 850"
          className="w-full h-auto"
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

              {/* Planet label - Responsive font size */}
              <text
                x={planet.x}
                y={planet.y + planet.size / 2 + (isMobile ? 38 : 32)}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize={isMobile ? (planet.tier === 'core' ? '32' : '26') : (planet.tier === 'core' ? '24' : '20')}
                fontWeight={planet.tier === 'core' ? '600' : '500'}
                letterSpacing="0.5"
                style={{ pointerEvents: 'none' }}
                className="planet-label"
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
                <g style={{ pointerEvents: 'none' }} className="lock-icon-group">
                  <LockIcon x={planet.x} y={planet.y} size={isMobile ? 32 : 26} opacity={0.9} />
                </g>
              )}

            </g>
          ))}

          {/* Title - Responsive */}
          <text
            x="500"
            y={isMobile ? "65" : "55"}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.95)"
            fontSize={isMobile ? "52" : "40"}
            fontWeight="300"
            letterSpacing="3"
            className="grid-title"
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
              top: `${(planet.y / 850) * 100}%`,
              width: `${Math.max((planet.size / 1000) * 100, 8)}%`,
              height: `${Math.max((planet.size / 850) * 100, 8)}%`,
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


    </div>
  );
};

export default GridPage;