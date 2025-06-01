
import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { useAuth } from './useAuth';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'st';
  notifications: {
    weather: boolean;
    pest: boolean;
    yield: boolean;
    community: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
  };
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    weather: true,
    pest: true,
    yield: true,
    community: false,
  },
  dashboard: {
    layout: 'grid',
    widgets: ['weather', 'alerts', 'quickActions'],
  },
};

const useUserPreferences = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    `userPreferences_${user?.id || 'guest'}`,
    defaultPreferences
  );

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const updateNotificationPreferences = (updates: Partial<UserPreferences['notifications']>) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...updates,
      },
    }));
  };

  const updateDashboardPreferences = (updates: Partial<UserPreferences['dashboard']>) => {
    setPreferences(prev => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        ...updates,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Get user's location if permission granted
  const requestLocation = (): Promise<UserPreferences['location']> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get location name (in production, use a geocoding service)
          let locationName = 'Unknown Location';
          try {
            // Mock location name - in production, use reverse geocoding
            locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          } catch (error) {
            console.warn('Could not get location name:', error);
          }

          const location = { latitude, longitude, name: locationName };
          updatePreferences({ location });
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  return {
    preferences,
    updatePreferences,
    updateNotificationPreferences,
    updateDashboardPreferences,
    resetPreferences,
    requestLocation,
  };
};

export default useUserPreferences;
