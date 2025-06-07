import { useEffect } from 'react';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = (event: AnalyticsEvent) => {
    // Log locally for now (in production, send to analytics service)
    console.log('Analytics Event:', {
      ...event,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    });

    // Store events locally for offline capability
    const events = JSON.parse(localStorage.getItem('pendingAnalytics') || '[]');
    events.push({
      ...event,
      timestamp: Date.now(),
      userId: user?.id || 'anonymous'
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('pendingAnalytics', JSON.stringify(events));
  };

  const trackPageView = (page: string) => {
    trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: page
    });
  };

  const trackUserAction = (action: string, category: string = 'user_interaction') => {
    trackEvent({
      action,
      category,
      label: user?.id || 'anonymous'
    });
  };

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Date.now().toString());
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackUserAction
  };
};

export default useAnalytics;
