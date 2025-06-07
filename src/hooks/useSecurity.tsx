
import { useState, useEffect } from 'react';
import useNotification from './useNotification';

const useSecurity = () => {
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const { showWarning } = useNotification();

  // Auto-logout after inactivity
  const resetSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(() => {
      showWarning('Session expired due to inactivity');
      // Force logout
      localStorage.removeItem('agroSenseUser');
      window.location.reload();
    }, 30 * 60 * 1000); // 30 minutes

    setSessionTimeout(timeout);
  };

  // Content Security Policy validation
  const validateCSP = () => {
    // Basic CSP checks
    const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!hasCSP) {
      console.warn('CSP not detected - consider adding Content Security Policy');
    }
  };

  // Input sanitization helper
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove basic XSS characters
      .trim()
      .substring(0, 1000); // Limit length
  };

  // Rate limiting helper
  const checkRateLimit = (action: string, limit: number = 5): boolean => {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const timeDiff = now - data.timestamp;
      
      if (timeDiff < 60000) { // 1 minute window
        if (data.count >= limit) {
          showWarning('Too many attempts. Please wait a moment.');
          return false;
        }
        data.count++;
      } else {
        data.count = 1;
        data.timestamp = now;
      }
      
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
    }
    
    return true;
  };

  useEffect(() => {
    validateCSP();
    
    // Track user activity for session management
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetSessionTimeout, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetSessionTimeout, true);
      });
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []);

  return {
    sanitizeInput,
    checkRateLimit,
    resetSessionTimeout
  };
};

export default useSecurity;
