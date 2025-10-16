import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { ErrorBoundary } from './components';
import { GridPage } from './pages';

// Lazy load pages for better performance
const PuzzlePage = React.lazy(() => import('./pages/PuzzlePage'));
const VictoryPage = React.lazy(() => import('./pages/VictoryPage'));

export const App = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/" element={<GridPage />} />
                <Route path="/puzzle/:id" element={<PuzzlePage />} />
                <Route path="/victory" element={<VictoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </GameProvider>
    </ErrorBoundary>
  );
};
