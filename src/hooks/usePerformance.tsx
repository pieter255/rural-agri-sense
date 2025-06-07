
import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ loadTime: 0, renderTime: 0 });

  useEffect(() => {
    // Measure page load performance
    const measurePerformance = () => {
      if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const renderTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        
        let memoryUsage;
        if ('memory' in performance) {
          memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
        }

        setMetrics({ loadTime, renderTime, memoryUsage });
        
        // Log performance metrics
        console.log('Performance Metrics:', { loadTime, renderTime, memoryUsage });
        
        // Report to analytics if needed
        if (loadTime > 3000) {
          console.warn('Slow page load detected:', loadTime + 'ms');
        }
      }
    };

    // Measure when page is fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Performance observer for Core Web Vitals
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('Performance entry:', entry.name, entry.value);
        });
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        console.warn('Performance Observer not supported for these entry types');
      }

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
};

export default usePerformance;
