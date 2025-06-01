
import { useState, useEffect } from 'react';
import useNotification from './useNotification';

const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showWarning, showSuccess } = useNotification();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess('Connection restored', {
        description: 'You are back online',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      showWarning('You are offline', {
        description: 'Some features may be limited',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSuccess, showWarning]);

  return { isOnline, isOffline: !isOnline };
};

export default useOffline;
