/**
 * Performance optimization utilities
 */

/**
 * Preload critical resources
 */
export const preloadResources = async (): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Preload puzzle piece images
  for (let i = 1; i <= 9; i++) {
    const promise = new Promise<void>((resolve) => {
      // We'll generate these on demand, so just resolve immediately
      resolve();
    });
    promises.push(promise);
  }

  await Promise.all(promises);
};

/**
 * Lazy load images with intersection observer
 */
export const createLazyImageLoader = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return {
      observe: () => {},
      disconnect: () => {}
    };
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  return imageObserver;
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measure and log performance metrics
 */
export const performanceMonitor = {
  // Mark the start of an operation
  mark: (name: string) => {
    if ('performance' in window && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },

  // Mark the end of an operation and measure duration
  measure: (name: string) => {
    if ('performance' in window && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      }
    }
  },

  // Get navigation timing metrics
  getNavigationMetrics: () => {
    if ('performance' in window && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    }
    
    return null;
  }
};

/**
 * Memory usage monitoring
 */
export const memoryMonitor = {
  // Get current memory usage (Chrome only)
  getCurrentUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  },

  // Log memory usage
  log: () => {
    const usage = memoryMonitor.getCurrentUsage();
    if (usage) {
      console.log(`Memory: ${usage.used}MB / ${usage.total}MB (limit: ${usage.limit}MB)`);
    }
  }
};

/**
 * Bundle size analyzer (development only)
 */
export const bundleAnalyzer = {
  // Estimate component sizes
  estimateComponentSize: (componentName: string, element: HTMLElement) => {
    if (process.env.NODE_ENV === 'development') {
      const size = new Blob([element.outerHTML]).size;
      console.log(`${componentName} estimated DOM size: ${size} bytes`);
    }
  },

  // Log bundle loading times
  logLoadTimes: () => {
    if (process.env.NODE_ENV === 'development') {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      resources
        .filter(resource => resource.name.includes('.js') || resource.name.includes('.css'))
        .forEach(resource => {
          console.log(`${resource.name}: ${resource.duration.toFixed(2)}ms`);
        });
    }
  }
};

/**
 * Optimize animations for 60fps
 */
export const animationOptimizer = {
  // Request animation frame with fallback
  requestFrame: (callback: () => void) => {
    if ('requestAnimationFrame' in window) {
      return requestAnimationFrame(callback);
    } else {
      return setTimeout(callback, 16); // ~60fps fallback
    }
  },

  // Cancel animation frame with fallback
  cancelFrame: (id: number) => {
    if ('cancelAnimationFrame' in window) {
      cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};