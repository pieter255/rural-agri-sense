
import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

interface FeatureFlags {
  [key: string]: boolean;
}

const defaultFlags: FeatureFlags = {
  advancedAnalytics: true,
  pushNotifications: true,
  offlineMode: true,
  betaFeatures: false,
  debugMode: false,
  weatherAlerts: true,
  cropRecommendations: true,
  marketPrices: false,
  socialFeatures: false,
  premiumFeatures: false
};

const useFeatureFlags = () => {
  const [flags, setFlags] = useLocalStorage<FeatureFlags>('featureFlags', defaultFlags);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching flags from server
    const fetchFlags = async () => {
      try {
        // In production, this would fetch from your feature flag service
        // For now, we'll use local storage with some remote overrides
        const remoteFlags = {
          // These could come from a remote config service
          ...defaultFlags,
          // Override with any server-side configurations
        };

        setFlags(prevFlags => ({ ...prevFlags, ...remoteFlags }));
      } catch (error) {
        console.warn('Failed to fetch feature flags, using defaults');
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, [setFlags]);

  const isEnabled = (flagName: string): boolean => {
    return flags[flagName] ?? false;
  };

  const enable = (flagName: string) => {
    setFlags(prev => ({ ...prev, [flagName]: true }));
  };

  const disable = (flagName: string) => {
    setFlags(prev => ({ ...prev, [flagName]: false }));
  };

  const toggle = (flagName: string) => {
    setFlags(prev => ({ ...prev, [flagName]: !prev[flagName] }));
  };

  // Development helper to override flags
  const setFlag = (flagName: string, value: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      setFlags(prev => ({ ...prev, [flagName]: value }));
    }
  };

  return {
    flags,
    loading,
    isEnabled,
    enable,
    disable,
    toggle,
    setFlag
  };
};

export default useFeatureFlags;
