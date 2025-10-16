import React from 'react';
import { useGameContext } from '../context/GameContext';

const GridPage: React.FC = () => {
  const { gameState, loading, error } = useGameContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading Mystery Versal...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Mystery Versal</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500"
          >
            Tile {i + 1}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-gray-600">
          Solved: {gameState.totalSolved}/9 puzzles
        </p>
        <p className="text-gray-600">
          Current Set: {gameState.currentSet}
        </p>
      </div>
    </div>
  );
};

export default GridPage;