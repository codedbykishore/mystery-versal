import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { PlatformProvider } from './context/PlatformContext';
import { ErrorBoundary } from './components';
import { IntroPage, GridPage, PuzzlePage, VictoryPage } from './pages';
import { preloadResources, performanceMonitor } from './utils/performance';

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
      <PlatformProvider>
        <GameProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<IntroPage />} />
                <Route path="/grid" element={<GridPage />} />
                <Route path="/puzzle/:id" element={<PuzzlePage />} />
                <Route path="/victory" element={<VictoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </GameProvider>
      </PlatformProvider>
    </ErrorBoundary>
  );
};
