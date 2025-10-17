import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { ErrorBoundary, LoadingSpinner } from './components';
import { GridPage } from './pages';
import { preloadResources, performanceMonitor } from './utils/performance';

// Lazy load pages for better performance
const PuzzlePage = React.lazy(() => import('./pages/PuzzlePage'));
const VictoryPage = React.lazy(() => import('./pages/VictoryPage'));

export const App = () => {
  useEffect(() => {
    // Performance monitoring
    performanceMonitor.mark('app-init');
    
    // Preload resources
    preloadResources().then(() => {
      performanceMonitor.measure('app-init');
    });

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const metrics = performanceMonitor.getNavigationMetrics();
        if (metrics) {
          console.log('Performance Metrics:', metrics);
        }
      }, 2000);
    }
  }, []);

  return (
    <ErrorBoundary>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner text="Loading Mystery Versal..." />
              </div>
            }>
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
